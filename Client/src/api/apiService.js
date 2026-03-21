import axios from 'axios';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";

const API_URL = 'http://10.0.2.2:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor to attach Firebase ID Token to every request

api.interceptors.request.use(
  async config => {
    try {
      const user = auth().currentUser;
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error fetching Firebase token:', error);
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

/**
 * Sends image data to the backend vision/scan endpoint
 * @param {Object} image - The response object from react-native-image-picker
 */
export const scanScrapImage = async image => {
  const formData = new FormData();

  const uri = Platform.OS === 'android' ? image.uri : image.uri.replace('file://', '');

  formData.append('image', {
    uri: uri,
    type: image.type || 'image/jpeg',
    name: image.fileName || 'upload.jpg',
  });

  try {
    const response = await api.post('/vision/scan', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
     
    console.log("Api response from ScanScrapImage : ", response.data)
    return response.data;
  } catch (error) {
    console.error(
      'Scan Image API Error:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const projectInstructions = async ({projectTitle, scavengedParts, materialContext}) => {

  console.log("data we for Project : ", projectTitle, scavengedParts, materialContext)

  try {

    const response = await api.post('/vision/generate-instruction', { projectTitle, scavengedParts, materialContext });

    console.log("response get from the projectInstructions : ", response.data);

    return response.data;
    
  } catch (error) {
    console.error(
      'Project Instructions API Error:',
      error.response?.data || error.message,
    );
    throw error;
  }
}


export const syncData = async (userId) => {
  
      const network = await NetInfo.fetch();
      if (!network.isConnected) return { success: false, message: 'Offline' };

    try {
      // 1. Grab everything from local Storage
      const rawStockpile = await AsyncStorage.getItem('@scavenged_items');
      const rawBlueprints = await AsyncStorage.getItem('@saved_blueprints');

      const stockpile = rawStockpile ? JSON.parse(rawStockpile) : [];
      const blueprints = rawBlueprints ? JSON.parse(rawBlueprints) : [];

      // console.log("data we have into syncData api call : ", stockpile, blueprints, userId)

      const response = await api.post('/data/sync', {
        userId,
        stockpile,
        blueprints
      });

      console.log('result we got from the syncData api call : ', response)

      const result = await response.json();

      if (response.ok) {
        // 3. Mark last sync time locally
        await AsyncStorage.setItem('last_sync_timestamp', new Date().toISOString());
        return { success: true, data: result };
      }
      
      return { success: false, error: result.error };
    } catch (error) {
      console.error("Sync Error:", error);
      return { success: false, error: error.message };
    }
}

export default api;
