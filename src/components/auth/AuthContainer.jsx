import React, { useEffect } from 'react';
import { useAuth } from './AuthProvider';

const AuthContainer = () => {
  const { user, signInWithRedirect } = useAuth();

  useEffect(() => {
    if (!user) {
      signInWithRedirect();
    }
  }, [user, signInWithRedirect]);

  if (user) {
    return null;
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #E2E8F0, #F1F5F9)'
    }}>
      <p style={{ color: '#475569' }}>Redirigiendo a inicio de sesión...</p>
    </div>
  );
};

export default AuthContainer;