-- Helper Functions and Views
-- This migration creates utility functions for common operations

-- ============================================
-- ROLE CHECK FUNCTIONS
-- ============================================

-- Function to check if user has a specific role
CREATE OR REPLACE FUNCTION user_has_role(role_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND r.name = role_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has permission
CREATE OR REPLACE FUNCTION user_has_permission(permission_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND (
      r.permissions->>'all' = 'true'
      OR r.permissions->>permission_name = 'true'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- ANALYTICS VIEWS
-- ============================================

-- View for daily page views summary
CREATE OR REPLACE VIEW daily_page_views AS
SELECT 
  DATE(created_at) as date,
  page_path,
  COUNT(*) as views,
  COUNT(DISTINCT session_id) as unique_sessions,
  COUNT(DISTINCT visitor_id) as unique_visitors
FROM page_views
GROUP BY DATE(created_at), page_path
ORDER BY date DESC, views DESC;

-- View for analytics summary
CREATE OR REPLACE VIEW analytics_summary AS
SELECT 
  DATE(created_at) as date,
  COUNT(*) as total_page_views,
  COUNT(DISTINCT session_id) as unique_sessions,
  COUNT(DISTINCT visitor_id) as unique_visitors,
  COUNT(DISTINCT CASE WHEN device_type = 'desktop' THEN visitor_id END) as desktop_visitors,
  COUNT(DISTINCT CASE WHEN device_type = 'mobile' THEN visitor_id END) as mobile_visitors,
  COUNT(DISTINCT CASE WHEN device_type = 'tablet' THEN visitor_id END) as tablet_visitors
FROM page_views
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- View for top pages
CREATE OR REPLACE VIEW top_pages AS
SELECT 
  page_path,
  COUNT(*) as total_views,
  COUNT(DISTINCT session_id) as unique_sessions,
  COUNT(DISTINCT visitor_id) as unique_visitors
FROM page_views
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY page_path
ORDER BY total_views DESC
LIMIT 20;

-- View for event analytics
CREATE OR REPLACE VIEW event_analytics AS
SELECT 
  event_type,
  event_name,
  COUNT(*) as event_count,
  COUNT(DISTINCT session_id) as unique_sessions,
  COUNT(DISTINCT visitor_id) as unique_visitors,
  DATE(created_at) as date
FROM analytics_events
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY event_type, event_name, DATE(created_at)
ORDER BY date DESC, event_count DESC;

