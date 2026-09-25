import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('ft_user');
    const token = localStorage.getItem('ft_token');
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('ft_user');
        localStorage.removeItem('ft_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const fbRes = await signInWithEmailAndPassword(auth, email, password);
      const firebaseToken = await fbRes.user.getIdToken();
      const res = await authAPI.login({ firebaseToken });
      const { token, user: userData } = res.data;
      localStorage.setItem('ft_token', token);
      localStorage.setItem('ft_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      if (error.code) throw new Error(error.message); // Firebase error
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const fbRes = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseToken = await fbRes.user.getIdToken();
      const res = await authAPI.register({ name, email, firebaseToken });
      const { token, user: userData } = res.data;
      localStorage.setItem('ft_token', token);
      localStorage.setItem('ft_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      if (error.code) throw new Error(error.message);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const fbRes = await signInWithPopup(auth, provider);
      const firebaseToken = await fbRes.user.getIdToken();
      
      // Backend login or register for Google User
      const res = await authAPI.googleLogin({
        name: fbRes.user.displayName || 'Google User',
        email: fbRes.user.email,
        firebaseToken
      });
      
      const { token, user: userData } = res.data;
      localStorage.setItem('ft_token', token);
      localStorage.setItem('ft_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      if (error.code) throw new Error(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch(e) { console.error('Firebase signout error', e); }
    
    localStorage.removeItem('ft_token');
    localStorage.removeItem('ft_user');
    setUser(null);
  };

  const updateUser = (updatedData) => {
    const merged = { ...user, ...updatedData };
    localStorage.setItem('ft_user', JSON.stringify(merged));
    setUser(merged);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

export default AuthContext;
