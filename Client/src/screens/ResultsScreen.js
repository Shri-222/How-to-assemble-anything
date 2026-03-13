import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const ResultsScreen = ({ route, navigation }) => {
  const results = route.params?.data || {};
  const identifiedParts = results.identifiedParts || []; 
  const topMatches = results.projects || [];

  console.log("Result - ", results);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Tactical Analysis</Text>

      {/* 1. Scavenged Parts Section */}
      <Text style={styles.sectionHeader}>Identified Components:</Text>
      {identifiedParts?.map((part, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.partName}>📦 {part.name}</Text>
            <Text style={styles.confidenceBadge}>
              {Math.round(part.confidence * 100)}%
            </Text>
          </View>
          <Text style={styles.materialText}>Material: {part.material}</Text>
        </View>
      ))}

      {/* 2. Suggested Projects Section */}
      <Text style={styles.sectionHeader}>Survival Assemblies:</Text>
      {topMatches?.map((project, index) => (
        <View key={index} style={[styles.card, styles.projectCard]}>
          <Text style={styles.projectName}>🛠️ {project.title}</Text>
          <Text style={styles.difficultyTag}>{project.difficulty}</Text>
          <Text style={styles.projectDetails}>{project.description}</Text>

          {/* Corrected: Missing Parts section inside the map loop */}
          {project.missingParts && project.missingParts.length > 0 && (
            <View style={styles.missingContainer}>
              <Text style={styles.missingHeader}>Required to Complete:</Text>
              <View style={styles.tagWrapper}>
                {project.missingParts.map((item, idx) => (
                  <View key={idx} style={styles.missingTag}>
                    <Text style={styles.missingTagText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
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
  title: { fontSize: 26, fontWeight: 'bold', marginTop: 40, marginBottom: 20, color: '#000' },
  sectionHeader: { fontSize: 14, fontWeight: 'bold', color: '#666', textTransform: 'uppercase', letterSpacing: 1, marginVertical: 15 },
  
  card: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  partName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  confidenceBadge: { fontSize: 12, fontWeight: 'bold', color: '#007AFF', backgroundColor: '#E1EFFF', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 5 },
  materialText: { fontSize: 13, color: '#777', marginTop: 4, fontStyle: 'italic' },

  projectCard: { backgroundColor: '#000', borderColor: '#333' }, // Professional dark cards
  projectName: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  difficultyTag: { fontSize: 10, color: '#FFD700', fontWeight: 'bold', marginBottom: 10 },
  projectDetails: { color: '#ccc', fontSize: 14, lineHeight: 20 },

  missingContainer: { marginTop: 15, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#333' },
  missingHeader: { fontSize: 11, color: '#888', fontWeight: 'bold', marginBottom: 8, textTransform: 'uppercase' },
  tagWrapper: { flexDirection: 'row', flexWrap: 'wrap' },
  missingTag: { backgroundColor: '#1A1A1A', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6, marginRight: 8, marginBottom: 8, borderWidth: 1, borderColor: '#444' },
  missingTagText: { color: '#FF4444', fontSize: 11, fontWeight: '600' },

  backButton: { backgroundColor: '#000', padding: 18, borderRadius: 12, marginVertical: 30, alignItems: 'center' },
  backButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default ResultsScreen;