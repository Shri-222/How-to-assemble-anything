import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import api from '../api/apiService'; // Your axios instance

const ProjectDetailScreen = ({ route }) => {
  const { project, scavengedParts } = route.params;
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlueprints = async () => {
      try {
        const response = await api.post('/vision/generate-instructions', {
          projectTitle: project.title,
          scavengedParts: scavengedParts,
          materialContext: project.material, // Assuming this comes from the scan
        });
        setInstructions(response.data.instructions);
      } catch (error) {
        Alert.alert(
          'Error',
          'Could not generate blueprints. Check your connection.',
        );
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlueprints();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Engineering Blueprints...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{project.title}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>v2.0 Tactical Guide</Text>
        </View>
      </View>

      <View style={styles.markdownContainer}>
        <Markdown style={markdownStyles}>{instructions}</Markdown>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#333' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  loadingText: { color: '#888', marginTop: 10, letterSpacing: 1 },
  badge: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  badgeText: { color: '#007AFF', fontSize: 12, fontWeight: '600' },
  markdownContainer: { padding: 20 },
});

const markdownStyles = {
  body: { color: '#CCC', fontSize: 16, lineHeight: 24 },
  heading1: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  heading2: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
  },
  strong: { color: '#FFF', fontWeight: 'bold' },
  bullet_list: { marginVertical: 10 },
  list_item: { marginBottom: 5 },
};

export default ProjectDetailScreen;
