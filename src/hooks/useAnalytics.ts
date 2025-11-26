import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, trackEvent } from '../utils/analytics';

// Hook to automatically track page views
export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    trackPageView(location.pathname, document.title);
  }, [location.pathname]);
};

// Hook for tracking custom events
export const useEventTracking = () => {
  const trackClick = (elementName: string, metadata?: Record<string, any>) => {
    trackEvent('click', elementName, metadata);
  };

  const trackFormSubmit = (formName: string, metadata?: Record<string, any>) => {
    trackEvent('form_submit', formName, metadata);
  };

  const trackDonationClick = (source: string) => {
    trackEvent('donation_click', source, { source });
  };

  const trackNavigation = (destination: string) => {
    trackEvent('navigation', destination, { destination });
  };

  return {
    trackClick,
    trackFormSubmit,
    trackDonationClick,
    trackNavigation,
  };
};

