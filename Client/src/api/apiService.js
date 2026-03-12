import axios from 'axios';
import auth from '@react-native-firebase/auth';

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
    return response.data;
  } catch (error) {
    console.error(
      'Scan Image API Error:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export default api;
