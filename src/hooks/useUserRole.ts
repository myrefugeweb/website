import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useUserRole = () => {
  const [userRole, setUserRole] = useState<string>('');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserRole();
  }, []);

  const loadUserRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Get user roles
      const { data: userRoles, error } = await supabase
        .from('user_roles')
        .select(`
          role_id,
          roles:role_id (
            name,
            permissions
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading user role:', error);
        setLoading(false);
        return;
      }

      if (userRoles && userRoles.length > 0) {
        const roleNames = userRoles.map((ur: any) => ur.roles?.name).filter(Boolean);
        const primaryRole = roleNames[0] || '';
        setUserRole(primaryRole);
        setIsSuperAdmin(roleNames.includes('super_admin'));
      }
    } catch (error) {
      console.error('Error loading user role:', error);
    } finally {
      setLoading(false);
    }
  };

  return { userRole, isSuperAdmin, loading, refreshRole: loadUserRole };
};

