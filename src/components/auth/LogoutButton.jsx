import React from 'react';
import { useAuth } from './AuthProvider';

const LogoutButton = () => {
  const { signOutGlobal } = useAuth();

  const handleLogout = async () => {
    try {
      await signOutGlobal();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Cerrar Sesión
    </button>
  );
};

export default LogoutButton;