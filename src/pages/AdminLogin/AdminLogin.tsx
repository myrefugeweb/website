import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { supabase } from '../../lib/supabase';
import './AdminLogin.css';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          // User is already logged in, redirect to dashboard
          navigate('/admin/dashboard', { replace: true });
        }
      } catch (err) {
        console.error('Session check error:', err);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate('/admin/dashboard', { replace: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      console.log('🔐 Attempting login...', { email, supabaseUrl: supabaseUrl ? 'Set' : 'Missing', hasKey: !!supabaseKey });

      if (!supabaseUrl || !supabaseKey || supabaseKey === 'dummy-key-for-initialization' || supabaseKey === 'REPLACE_WITH_YOUR_ANON_PUBLIC_KEY_HERE') {
        setError('Supabase is not configured. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set correctly. See GET_ANON_KEY_STEPS.md for instructions on how to get your anon/public key.');
        console.error('❌ Supabase configuration missing:', {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseKey,
          keyValue: supabaseKey ? (supabaseKey.substring(0, 20) + '...') : 'missing'
        });
        setLoading(false);
        return;
      }

      // Check for secret key
      if (supabaseKey.includes('sb_secret_') || supabaseKey.includes('service_role')) {
        setError('You are using a secret key. Please use the anon/public key instead. See FIND_ANON_KEY.md for instructions.');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        console.error('❌ Login error:', error);
        // Provide more helpful error messages
        if (error.message.includes('Invalid API key') || error.message.includes('JWT') || error.message.includes('Forbidden')) {
          setError('Invalid API key. Please check your .env file and ensure VITE_SUPABASE_ANON_KEY is set correctly. Make sure you\'re using the anon/public key, not the service role key.');
        } else if (error.message.includes('Invalid login credentials') || error.message.includes('Invalid password') || error.message.includes('Email not confirmed')) {
          setError('Invalid email or password. Please check your credentials and try again.');
        } else {
          setError(error.message || 'An error occurred during login.');
        }
        setLoading(false);
      } else if (data.user) {
        console.log('✅ Login successful!', { userId: data.user.id, email: data.user.email });
        // Store session info (Supabase handles this automatically, but we can store additional info)
        if (data.session) {
          localStorage.setItem('supabase.auth.token', JSON.stringify(data.session));
        }
        navigate('/admin/dashboard');
      } else {
        setError('Login failed. No user data returned.');
        setLoading(false);
      }
    } catch (err: any) {
      console.error('❌ Login exception:', err);
      if (err.message?.includes('fetch') || err.message?.includes('network')) {
        setError('Network error. Please check your internet connection and Supabase project URL.');
      } else if (err.message?.includes('Forbidden') || err.message?.includes('secret')) {
        setError('You are using a secret key. Please use the anon/public key instead. See FIND_ANON_KEY.md for instructions.');
      } else {
        setError(err.message || 'An error occurred. Please try again.');
      }
      setLoading(false);
    }
  };

  // Show loading while checking auth
  if (checkingAuth) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{ fontSize: '1.2rem' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="admin-login">
      <motion.div
        className="admin-login__container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card variant="elevated" padding="lg" className="admin-login__card">
          <h1 className="admin-login__title">Admin Login</h1>
          <p className="admin-login__subtitle">Sign in to access the admin dashboard</p>
          
          <form onSubmit={handleSubmit} className="admin-login__form">
            {error && <div className="admin-login__error">{error}</div>}
            
            <div className="admin-login__field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@myrefuge.org"
              />
            </div>
            
            <div className="admin-login__field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
            
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

