import { createContext, useContext, useState } from 'react';

const SimpleAuthContext = createContext();

export function useAuth() {
  const context = useContext(SimpleAuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a SimpleAuthProvider');
  }
  return context;
}

export function SimpleAuthProvider({ children }) {
  // Simple mock auth state - bypasses Firebase completely
  const [currentUser] = useState({
    uid: 'demo-user',
    email: 'demo@protogen.dev',
    displayName: 'Demo User'
  });
  
  const [userProfile] = useState({
    uid: 'demo-user',
    email: 'demo@protogen.dev',
    displayName: 'Demo User',
    role: 'user',
    preferences: {
      theme: 'light',
      notifications: true
    }
  });

  const [loading] = useState(false); // Never loading

  // Mock functions
  const signup = async () => ({ user: currentUser });
  const signin = async () => ({ user: currentUser });
  const signInWithGoogle = async () => ({ user: currentUser });
  const logout = async () => {};
  const resetPassword = async () => {};

  const value = {
    currentUser,
    userProfile,
    signup,
    signin,
    signInWithGoogle,
    logout,
    resetPassword,
    loading
  };

  return (
    <SimpleAuthContext.Provider value={value}>
      {children}
    </SimpleAuthContext.Provider>
  );
}
