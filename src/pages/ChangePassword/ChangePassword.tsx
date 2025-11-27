import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { supabase } from '../../lib/supabase';
import './ChangePassword.css';

export const ChangePassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate('/admin', { replace: true });
        } else {
          const mustChange = localStorage.getItem('must_change_password');
          if (!mustChange) {
            // User doesn't need to change password, redirect to dashboard
            navigate('/admin/dashboard', { replace: true });
          }
        }
      } catch (err) {
        console.error('Auth check error:', err);
        navigate('/admin', { replace: true });
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
        data: {
          must_change_password: false, // Clear the flag
        }
      });

      if (updateError) {
        setError(updateError.message || 'Failed to update password.');
        setLoading(false);
        return;
      }

      // Clear the flag from localStorage
      localStorage.removeItem('must_change_password');
      
      alert('Password changed successfully! Redirecting to dashboard...');
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error('Password change error:', err);
      setError(err.message || 'An error occurred. Please try again.');
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="change-password__loading">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="change-password">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="change-password__container"
      >
        <Card variant="elevated" padding="lg" className="change-password__card">
          <div className="change-password__header">
            <h1 className="change-password__title">Change Your Password</h1>
            <p className="change-password__subtitle">
              For security reasons, you must change your password before accessing the dashboard.
            </p>
          </div>

          {error && (
            <div className="change-password__error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="change-password__form">
            <div className="change-password__field">
              <label htmlFor="newPassword">New Password *</label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Minimum 6 characters"
                minLength={6}
              />
            </div>

            <div className="change-password__field">
              <label htmlFor="confirmPassword">Confirm New Password *</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Re-enter your new password"
                minLength={6}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="change-password__submit"
            >
              {loading ? 'Changing Password...' : 'Change Password'}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

