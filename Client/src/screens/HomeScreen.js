import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { scanScrapImage } from '../api/apiService';
import { PermissionsAndroid, Platform } from 'react-native'

import { syncKnowledgeBase } from './services/KnowledgeService';

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const [syncStatus, setSyncStatus] = useState('Checking Data...');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const initData = async () => {
      const result = await syncKnowledgeBase((p) => setProgress(p));
      if (result.success) {
        setSyncStatus('System Ready');
      } else {
        setSyncStatus('Offline Mode: Limited Data');
      }
    };
    initData();
  }, []);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: "Camera Permission",
              message: "Assemble-It needs access to your camera to scan scrap.",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK"
            }
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
          console.warn(err);
          return false;
        }
      }
      return true;
    };

  const handlePickImage = type => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
    };

    const method = type === 'camera' ? launchCamera : launchImageLibrary;

    method(options, async response => {
        if (type === 'camera') {
          const hasPermission = await requestCameraPermission();
            if (!hasPermission) {
              Alert.alert("Permission Denied", "Camera access is required to scan scrap.");
              return;
            }
        }

      if (response.didCancel) return;
      if (response.errorCode)
        return Alert.alert('Error', response.errorMessage);

      const asset = response.assets[0];
      const imageUri = `${asset.uri}`;
      setLoading(true);

      try {
        const result = await scanScrapImage(asset);
        // Navigate to Results screen with the data from backend
        navigation.navigate('Results', { data: result, scannedImageUri: imageUri });
      } catch (error) {
        Alert.alert('Scan Failed', error.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>How To Assemble Anything</Text>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <View style={styles.avatarMini}>
            <Text style={styles.avatarInitial}>S</Text>
          </View>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>
            Analyzing scrap...
          </Text>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.mainButton}
            onPress={() => handlePickImage('camera')}
          >
            <Text style={styles.buttonText}>Scan Scrap</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => handlePickImage('library')}
          >
            <Text style={styles.secondaryButtonText}>Upload from Gallery</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#000' },
  
  profileButton: {
    padding: 5,
  },
  avatarMini: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  avatarInitial: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 15, color: '#666' },
  buttonContainer: { flex: 1, justifyContent: 'center' },
  mainButton: {
    backgroundColor: '#000',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  secondaryButton: { marginTop: 20, padding: 15, alignItems: 'center' },
  secondaryButtonText: { color: '#666', fontSize: 16 },
});

export default HomeScreen;
