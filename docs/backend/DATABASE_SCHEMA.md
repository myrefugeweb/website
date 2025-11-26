# Database Schema Documentation

## Overview

This document describes all database tables, their relationships, and usage in the My Refuge application.

## Tables

### Core Content Tables

#### `images`
Stores images for different sections of the website.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| section | TEXT | Section identifier (hero, mission, etc.) |
| url | TEXT | Image URL from Supabase Storage |
| alt_text | TEXT | Alt text for accessibility |
| order_index | INTEGER | Display order |
| is_active | BOOLEAN | Whether image is active |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

**Sections**: `hero`, `mission`, `story`, `help`, `contact`, `impact`, `donation`, `sparrows-closet-hero`, `sparrows-closet-info`, `sparrows-closet-impact`, `sparrows-closet-cta`

#### `header_content`
Stores header/title content for pages.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| page | TEXT | Page identifier (home, etc.) |
| title | TEXT | Page title |
| description | TEXT | Page description |
| updated_at | TIMESTAMP | Last update timestamp |

#### `sparrows_closet_content`
Stores content for Sparrows Closet page.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | TEXT | Page title |
| description | TEXT | Page description |
| updated_at | TIMESTAMP | Last update timestamp |

#### `calendar_events`
Stores calendar events.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | TEXT | Event title |
| description | TEXT | Event description |
| date | DATE | Event date |
| time | TIME | Event time (optional) |
| location | TEXT | Event location (optional) |
| is_active | BOOLEAN | Whether event is active |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

### User Management Tables

#### `roles`
Defines user roles and their permissions.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | Role name (unique) |
| description | TEXT | Role description |
| permissions | JSONB | Permissions object |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

**Default Roles**:
- `super_admin` - Full access
- `admin` - Content management
- `editor` - Content editing
- `viewer` - Read-only

#### `user_roles`
Junction table linking users to roles.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | References auth.users(id) |
| role_id | UUID | References roles(id) |
| created_at | TIMESTAMP | Creation timestamp |

### Analytics Tables

#### `page_views`
Tracks page views and visitor information.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| page_path | TEXT | Page path (e.g., "/", "/sparrows-closet") |
| page_title | TEXT | Page title |
| referrer | TEXT | HTTP referrer |
| user_agent | TEXT | Browser user agent |
| ip_address | INET | Visitor IP address |
| session_id | TEXT | Session identifier |
| user_id | UUID | User ID if authenticated |
| device_type | TEXT | Device type (desktop, mobile, tablet) |
| browser | TEXT | Browser name |
| browser_version | TEXT | Browser version |
| os | TEXT | Operating system |
| country | TEXT | Country (from IP geolocation) |
| city | TEXT | City (from IP geolocation) |
| created_at | TIMESTAMP | View timestamp |

#### `unique_visitors`
Tracks unique visitors.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| visitor_id | TEXT | Unique visitor identifier |
| first_visit_at | TIMESTAMP | First visit timestamp |
| last_visit_at | TIMESTAMP | Last visit timestamp |
| total_visits | INTEGER | Total number of visits |
| user_id | UUID | User ID if authenticated |
| device_type | TEXT | Device type |
| browser | TEXT | Browser name |
| country | TEXT | Country |

#### `analytics_events`
Tracks user interactions and events.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| event_type | TEXT | Event type (click, form_submit, etc.) |
| event_name | TEXT | Event name/identifier |
| page_path | TEXT | Page where event occurred |
| element_id | TEXT | Element ID (if applicable) |
| element_text | TEXT | Element text (if applicable) |
| metadata | JSONB | Additional event data |
| session_id | TEXT | Session identifier |
| visitor_id | TEXT | Visitor identifier |
| user_id | UUID | User ID if authenticated |
| created_at | TIMESTAMP | Event timestamp |

**Event Types**:
- `click` - Button/link clicks
- `form_submit` - Form submissions
- `download` - File downloads
- `donation_click` - Donation button clicks
- `navigation` - Page navigation

## Views

### `daily_page_views`
Daily summary of page views with unique sessions and visitors.

### `analytics_summary`
Overall analytics summary with device breakdown.

### `top_pages`
Most viewed pages in the last 30 days.

### `event_analytics`
Event tracking analytics grouped by type and name.

## Helper Functions

### `user_has_role(role_name TEXT)`
Returns true if the current authenticated user has the specified role.

### `user_has_permission(permission_name TEXT)`
Returns true if the current authenticated user has the specified permission.

## Row Level Security (RLS)

All tables have RLS enabled with the following access patterns:

- **Public Read**: images, calendar_events, header_content, sparrows_closet_content
- **Authenticated Write**: All content tables (for admins)
- **Analytics Insert**: Anyone can insert (for tracking)
- **Analytics Read**: Only authenticated users can read analytics data
- **Role Management**: Only authenticated users can view, admins can manage

## Indexes

Indexes are created on:
- Foreign keys (user_id, role_id, etc.)
- Frequently queried columns (section, date, page_path, etc.)
- Composite indexes for common query patterns

## Storage

### Buckets

- **images** - Public bucket for uploaded images
  - Path: `images/{section}-{timestamp}.{ext}`
  - Access: Public read, authenticated write

