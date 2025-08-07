import React, { createContext, useContext, useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';

const awsConfig = {
  region: import.meta.env.VITE_AWS_REGION,
  userPoolId: import.meta.env.VITE_AWS_USER_POOL_ID,
  userPoolWebClientId: import.meta.env.VITE_AWS_USER_POOL_WEB_CLIENT_ID,
};

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: awsConfig.userPoolId,
      userPoolClientId: awsConfig.userPoolWebClientId,
      loginWith: {
        oauth: {
          domain: 'us-east-1bzgeloc9g.auth.us-east-1.amazoncognito.com',
          scopes: ['openid', 'email', 'phone'],
          redirectSignIn: ['http://localhost:5173/dashboard', 'https://172.50.66.153/dashboard'],
          redirectSignOut: ['http://localhost:5173/', 'https://172.50.66.153/'],
          responseType: 'code'
        }
      }
    }
  }
});

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const { getCurrentUser } = await import('aws-amplify/auth');
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signInWithRedirect = async () => {
    const { signInWithRedirect } = await import('aws-amplify/auth');
    await signInWithRedirect({ provider: 'Cognito' });
  };

  const signOutGlobal = async () => {
    try {
      const { signOut } = await import('aws-amplify/auth');
      await signOut();
      setUser(null);
      // Redirigir a la página de logout hospedada
      window.location.href = 'https://us-east-1bzgeloc9g.auth.us-east-1.amazoncognito.com/logout?client_id=u41vq0son5fab0l4fnc8eusuv&logout_uri=https%3A%2F%2F172.50.66.153%2F';
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Fallback: limpiar estado local y recargar
      setUser(null);
      window.location.href = '/';
    }
  };

  const value = {
    user,
    loading,
    checkAuthState,
    signInWithRedirect,
    signOutGlobal
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};