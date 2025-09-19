import { supabase } from '@/integrations/supabase/client';

export const createTeacherAccount = async () => {
  try {
    // Create teacher account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'teacher@school.edu',
      password: 'teacher123',
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          full_name: 'John Teacher',
          role: 'teacher'
        }
      }
    });

    if (authError) throw authError;

    console.log('Teacher account created:', {
      email: 'teacher@school.edu',
      password: 'teacher123',
      name: 'John Teacher',
      role: 'teacher'
    });

    return authData;
  } catch (error) {
    console.error('Error creating teacher account:', error);
    throw error;
  }
};

// Uncomment the line below and run in console to create teacher account
// createTeacherAccount();