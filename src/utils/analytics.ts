// Analytics utilities for tracking page views, events, and visitors

import { supabase } from '../lib/supabase';

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

// Track page view
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

    await supabase.from('page_views').insert({
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
    });

    // Update unique visitor
    await updateUniqueVisitor(visitorId, deviceType, browser);
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

// Track custom event
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

    await supabase.from('analytics_events').insert({
      event_type: eventType,
      event_name: eventName,
      page_path: window.location.pathname,
      metadata: metadata || {},
      session_id: sessionId,
      visitor_id: visitorId,
      user_id: user?.id || null,
    });
  } catch (error) {
    console.error('Analytics event error:', error);
  }
};

