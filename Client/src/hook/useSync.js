import { useState } from 'react';
import {syncData} from '../api/apiService';

export const useSync = (userId) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  const triggerSync = async () => {
    setIsSyncing(true);
    const result = await syncData(userId);
    
    if (result.success) {
      setLastSync(new Date().toLocaleTimeString());
    }
    
    setIsSyncing(false);
    return result;
  };

  return { triggerSync, isSyncing, lastSync };
};