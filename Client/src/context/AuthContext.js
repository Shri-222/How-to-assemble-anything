import { createContext, useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import api from '../api/apiService'; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (userState) => {
      if (userState) {
        // Sync user with MongoDB whenever they log in
        try {
          await api.post('/users/sync', {
            uid: userState.uid,
            email: userState.email,
          });
          console.log('User synced with MongoDB');
        } catch (error) {
          console.error('User sync failed:', error.response?.data || error.message);
        }
      }
      
      setUser(userState);
      setLoading(false);
    });

    return unsubscribe; 
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};