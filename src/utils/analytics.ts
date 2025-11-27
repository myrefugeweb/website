// Analytics utilities for tracking page views, events, and visitors

import { supabase } from '../lib/supabase';

// Analytics queue for batching requests
interface QueuedEvent {
  type: 'page_view' | 'event' | 'visitor_update';
  data: any;
  timestamp: number;
}

const ANALYTICS_QUEUE_KEY = 'analytics_queue';
const BATCH_SIZE = 10; // Send batch when queue reaches this size
const BATCH_INTERVAL = 30000; // Send batch every 30 seconds
const MAX_QUEUE_SIZE = 100; // Prevent queue from growing too large

let queue: QueuedEvent[] = [];
let batchTimer: ReturnType<typeof setInterval> | null = null;
let isProcessing = false;

// Load queue from localStorage on init
const loadQueue = (): QueuedEvent[] => {
  try {
    const stored = localStorage.getItem(ANALYTICS_QUEUE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save queue to localStorage
const saveQueue = (queue: QueuedEvent[]) => {
  try {
    localStorage.setItem(ANALYTICS_QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error('Error saving analytics queue:', error);
  }
};

// Initialize queue from localStorage
queue = loadQueue();

// Process and send batched events
const processQueue = async () => {
  if (isProcessing || queue.length === 0) return;
  
  isProcessing = true;
  const batch = queue.splice(0, BATCH_SIZE);
  saveQueue(queue);

  try {
    const pageViews = batch.filter(e => e.type === 'page_view').map(e => e.data);
    const events = batch.filter(e => e.type === 'event').map(e => e.data);
    const visitorUpdates = batch.filter(e => e.type === 'visitor_update').map(e => e.data);

    // Batch insert page views
    if (pageViews.length > 0) {
      const { error } = await supabase.from('page_views').insert(pageViews);
      if (error) throw error;
    }

    // Batch insert events
    if (events.length > 0) {
      const { error } = await supabase.from('analytics_events').insert(events);
      if (error) throw error;
    }

    // Process visitor updates (need to handle individually due to upsert logic)
    for (const visitorData of visitorUpdates) {
      await updateUniqueVisitor(
        visitorData.visitor_id,
        visitorData.device_type,
        visitorData.browser
      );
    }
  } catch (error) {
    // If batch fails, put items back in queue (except if queue is too large)
    if (queue.length < MAX_QUEUE_SIZE) {
      queue = [...batch, ...queue];
      saveQueue(queue);
    }
    console.error('Error processing analytics queue:', error);
  } finally {
    isProcessing = false;
  }
};

// Start batch timer
const startBatchTimer = () => {
  if (batchTimer) return;
  batchTimer = setInterval(() => {
    if (queue.length > 0) {
      processQueue();
    }
  }, BATCH_INTERVAL);
};

// Add event to queue
const enqueue = (type: QueuedEvent['type'], data: any) => {
  // Prevent queue from growing too large
  if (queue.length >= MAX_QUEUE_SIZE) {
    // Remove oldest events
    queue = queue.slice(-MAX_QUEUE_SIZE + 1);
  }

  queue.push({
    type,
    data,
    timestamp: Date.now(),
  });
  saveQueue(queue);

  // Process immediately if batch size reached
  if (queue.length >= BATCH_SIZE) {
    processQueue();
  }

  // Start timer if not already running
  startBatchTimer();
};

// Process queue on page unload (sendBeacon for reliability)
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    if (queue.length > 0) {
      // Try to process queue before page closes
      // Note: sendBeacon would require a server endpoint, so we use regular processing
      processQueue();
    }
  });
}

// Generate or retrieve visitor ID
export const getVisitorId = (): string => {
  let visitorId = localStorage.getItem('visitor_id');
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('visitor_id', visitorId);
  }
  return visitorId;
};

// Generate session ID
export const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('session_id', sessionId);
  }
  return sessionId;
};

// Detect device type
export const getDeviceType = (): string => {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

// Parse user agent
export const parseUserAgent = () => {
  const ua = navigator.userAgent;
  let browser = 'Unknown';
  let browserVersion = '';
  let os = 'Unknown';

  // Browser detection
  if (ua.includes('Chrome') && !ua.includes('Edg')) {
    browser = 'Chrome';
    const match = ua.match(/Chrome\/(\d+)/);
    browserVersion = match ? match[1] : '';
  } else if (ua.includes('Firefox')) {
    browser = 'Firefox';
    const match = ua.match(/Firefox\/(\d+)/);
    browserVersion = match ? match[1] : '';
  } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
    browser = 'Safari';
    const match = ua.match(/Version\/(\d+)/);
    browserVersion = match ? match[1] : '';
  } else if (ua.includes('Edg')) {
    browser = 'Edge';
    const match = ua.match(/Edg\/(\d+)/);
    browserVersion = match ? match[1] : '';
  }

  // OS detection
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

  return { browser, browserVersion, os };
};

// Track page view (now queued and batched)
export const trackPageView = async (pagePath: string, pageTitle?: string) => {
  try {
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
    if (!anonKey || anonKey === 'dummy-key-for-initialization') {
      return;
    }

    const visitorId = getVisitorId();
    const sessionId = getSessionId();
    const deviceType = getDeviceType();
    const { browser, browserVersion, os } = parseUserAgent();
    const { data: { user } } = await supabase.auth.getUser();

    const pageViewData = {
      page_path: pagePath,
      page_title: pageTitle || document.title,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
      session_id: sessionId,
      visitor_id: visitorId,
      user_id: user?.id || null,
      device_type: deviceType,
      browser,
      browser_version: browserVersion,
      os,
    };

    // Queue page view instead of inserting immediately
    enqueue('page_view', pageViewData);

    // Queue visitor update (will be processed in batch)
    enqueue('visitor_update', {
      visitor_id: visitorId,
      device_type: deviceType,
      browser,
    });
  } catch (error) {
    // Silently fail - don't break the app if analytics fails
    console.error('Analytics error:', error);
  }
};

// Update unique visitor record
const updateUniqueVisitor = async (
  visitorId: string,
  deviceType: string,
  browser: string
) => {
  try {
    const { data: existing } = await supabase
      .from('unique_visitors')
      .select('*')
      .eq('visitor_id', visitorId)
      .single();

    const { data: { user } } = await supabase.auth.getUser();

    if (existing) {
      // Update existing visitor
      await supabase
        .from('unique_visitors')
        .update({
          last_visit_at: new Date().toISOString(),
          total_visits: (existing.total_visits || 0) + 1,
          user_id: user?.id || existing.user_id,
        })
        .eq('id', existing.id);
    } else {
      // Create new visitor
      await supabase.from('unique_visitors').insert({
        visitor_id: visitorId,
        first_visit_at: new Date().toISOString(),
        last_visit_at: new Date().toISOString(),
        total_visits: 1,
        user_id: user?.id || null,
        device_type: deviceType,
        browser,
      });
    }
  } catch (error) {
    console.error('Error updating unique visitor:', error);
  }
};

// Track custom event (now queued and batched)
export const trackEvent = async (
  eventType: string,
  eventName: string,
  metadata?: Record<string, any>
) => {
  try {
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
    if (!anonKey || anonKey === 'dummy-key-for-initialization') {
      return;
    }

    const visitorId = getVisitorId();
    const sessionId = getSessionId();
    const { data: { user } } = await supabase.auth.getUser();

    const eventData = {
      event_type: eventType,
      event_name: eventName,
      page_path: window.location.pathname,
      metadata: metadata || {},
      session_id: sessionId,
      visitor_id: visitorId,
      user_id: user?.id || null,
    };

    // Queue event instead of inserting immediately
    enqueue('event', eventData);
  } catch (error) {
    console.error('Analytics event error:', error);
  }
};

