import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const ResultsScreen = ({ route, navigation }) => {
  // Extract the data sent from HomeScreen
  const { data } = route.params || {};
  const { identifiedParts, topMatches } = data?.data || {};

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Analysis Results</Text>

      <Text style={styles.sectionHeader}>Identified Parts:</Text>
      {identifiedParts?.map((part, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.partName}>📦 {part.name}</Text>
          <Text style={styles.details}>Confidence: {part.confidence}%</Text>
        </View>
      ))}

      <Text style={styles.sectionHeader}>Suggested Projects:</Text>
      {topMatches?.map((project, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.projectName}>🛠️ {project.title}</Text>
          <Text style={styles.details}>{project.description}</Text>
        </View>
      ))}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Scan Again</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 40, marginBottom: 20 },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
    color: '#333',
  },
  card: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#000',
  },
  partName: { fontSize: 16, fontWeight: 'bold' },
  projectName: { fontSize: 16, fontWeight: 'bold', color: '#007AFF' },
  details: { color: '#666', marginTop: 4 },
  backButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    marginVertical: 30,
    alignItems: 'center',
  },
  backButtonText: { color: '#fff', fontWeight: 'bold' },
});

export default ResultsScreen;
