import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../Card';
import { supabase } from '../../lib/supabase';
import type { CalendarEvent } from '../../lib/supabase';
import './CalendarSection.css';

export const CalendarSection: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
      if (!anonKey || anonKey === 'dummy-key-for-initialization') {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('is_active', true)
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true })
        .limit(6);

      if (error && error.code !== 'PGRST116') {
        if (!error.message.includes('JWT') && !error.message.includes('key')) {
          console.error('Error loading events:', error);
        }
      } else if (data) {
        setEvents(data || []);
      }
    } catch (error: any) {
      if (error?.message && !error.message.includes('JWT') && !error.message.includes('key')) {
        console.error('Error loading events:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <section className="calendar-section" id="events">
      <div className="calendar-section__container">
        <motion.div
          className="calendar-section__header"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="calendar-section__title">Upcoming Events</h2>
          <p className="calendar-section__subtitle">
            Join us for these upcoming events and activities
          </p>
        </motion.div>

        {loading ? (
          <div className="calendar-section__loading">
            <p>Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="calendar-section__empty">
            <p className="calendar-section__empty-text">
              No upcoming events scheduled at this time. Check back soon!
            </p>
            <p className="calendar-section__empty-hint">
              Events will appear here once they are added through the admin dashboard.
            </p>
          </div>
        ) : (
          <div className="calendar-section__events">
            {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card variant="elevated" padding="lg" className="calendar-section__event-card">
                <div className="calendar-section__event-date">
                  <div className="calendar-section__event-month">
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                  <div className="calendar-section__event-day">
                    {new Date(event.date).toLocaleDateString('en-US', { day: 'numeric' })}
                  </div>
                </div>
                <div className="calendar-section__event-content">
                  <h3 className="calendar-section__event-title">{event.title}</h3>
                  {event.description && (
                    <p className="calendar-section__event-description">{event.description}</p>
                  )}
                  <div className="calendar-section__event-meta">
                    {event.time && (
                      <span className="calendar-section__event-time">
                        🕐 {formatTime(event.time)}
                      </span>
                    )}
                    {event.location && (
                      <span className="calendar-section__event-location">
                        📍 {event.location}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
          </div>
        )}
      </div>
    </section>
  );
};

