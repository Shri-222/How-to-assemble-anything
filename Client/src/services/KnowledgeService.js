import RNFS from 'react-native-fs';

// Replace with your actual server IP (use 10.0.2.2 for Android Emulator)
const REMOTE_URL = 'http://10.0.2.2:5000/static/FM_3-05.70.md'; 
const LOCAL_PATH = `${RNFS.DocumentDirectoryPath}/survival_manual.md`;

export const syncKnowledgeBase = async (onProgress) => {
  try {
    // 1. Check if file already exists
    const exists = await RNFS.exists(LOCAL_PATH);
    
    if (exists) {
      console.log(' Knowledge Base already exists locally.');
      return { success: true, path: LOCAL_PATH };
    }

    // 2. Start Download
    console.log(' Downloading Knowledge Base...');
    const download = RNFS.downloadFile({
      fromUrl: REMOTE_URL,
      toFile: LOCAL_PATH,
      progress: (res) => {
        const percent = (res.bytesWritten / res.contentLength) * 100;
        if (onProgress) onProgress(percent.toFixed(2));
      },
    });

    const result = await download.promise;

    if (result.statusCode === 200) {
      return { success: true, path: LOCAL_PATH };
    } else {
      throw new Error('Download failed with status: ' + result.statusCode);
    }
  } catch (error) {
    console.error('Knowledge Sync Error:', error);
    return { success: false, error: error.message };
  }
};