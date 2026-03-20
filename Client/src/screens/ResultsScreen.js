import { useContext, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';

import { projectInstructions } from '../api/apiService';
import { InventoryContext } from '../context/InventoryContext';

const ResultsScreen = ({ route, navigation }) => {
  const results = route.params?.data || {};
  const identifiedParts = results.identifiedParts || [];
  const topMatches = results.projects || [];

  // const scannedImageUri = route.params?.scannedImageUri || null;

  const { addToStockpile } = useContext(InventoryContext);

  const [loading, setLoading] = useState(false);
  const [collectedItems, setCollectedItems] = useState([]);

  const isAlreadyCollected = (partName) => collectedItems.includes(partName);

  // console.log('Result - ', identifiedParts, topMatches);

  const handaleprojectInstuctions = async selectedProject => {
    try {
      setLoading(true);
      const instructions = await projectInstructions({
        projectTitle: selectedProject.title,
        scavengedParts: selectedProject.missingParts,
        materialContext: identifiedParts,
      });
      console.log('Instructions received from backend : ', instructions);
      navigation.navigate('ProjectDetail', { data: instructions.instructions, projectTitle: selectedProject.title});
    } catch (error) {
      Alert.alert('Scan Failed', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const SafetyDisclaimer = () => (
    <View style={styles.disclaimerBox}>
      <Text style={styles.disclaimerTitle}>⚠️ SURVIVALIST ADVISORY</Text>
      <Text style={styles.disclaimerText}>
        The assemblies generated are for educational purposes only. AI
        identification can misinterpret materials. Always verify structural
        integrity and chemical safety manually. Assemble-It is not liable for
        injuries resulting from improvised builds.
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Tactical Analysis</Text>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>Analyzing...</Text>
        </View>
      ) : (
        <>
          {/* 1. Scavenged Parts Section */}
          <Text style={styles.sectionHeader}>Identified Components:</Text>
          {identifiedParts?.map((part, index) => (
            <View key={index} style={styles.card}>
              {/* <Image
                source={{ uri: scannedImageUri }}
                style={styles.thumbnail}
              /> */}
              <View style={styles.row}>
                <Text style={styles.partName}>{part.name}</Text>
                <Text style={styles.confidenceBadge}>
                  {Math.round(part.confidence * 100)}%
                </Text>
              </View>
              <Text style={styles.materialText}>Material: {part.material}</Text>
              <TouchableOpacity 
                disabled={isAlreadyCollected(part.name)}
                style={[styles.collectButton, isAlreadyCollected(part.name) && { borderColor: '#444', backgroundColor: 'transparent' }]}
                onPress={() => {
                  addToStockpile(part);
                  setCollectedItems(prev => [...prev, part.name]);
                  Alert.alert("Secured!", `${part.name} added to your Inventory.`);
                }}
              >
                <Text style={[styles.collectText, isAlreadyCollected(part.name) && { color: '#444' }]}>{isAlreadyCollected(part.name) ? 'SECURED' : '+ COLLECT'}</Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* 2. Suggested Projects Section */}
          <Text style={styles.sectionHeader}>Survival Assemblies:</Text>
          {topMatches?.map((project, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.card, styles.projectCard]}
              onPress={() => handaleprojectInstuctions(project)}
            >
              <Text style={styles.projectName}>{project.title}</Text>
              <Text style={styles.difficultyTag}>{project.difficulty}</Text>
              <Text style={styles.projectDetails}>{project.description}</Text>

              {/* Corrected: Missing Parts section inside the map loop */}
              {project.missingParts && project.missingParts.length > 0 && (
                <View style={styles.missingContainer}>
                  <Text style={styles.missingHeader}>
                    Required to Complete:
                  </Text>
                  <View style={styles.tagWrapper}>
                    {project.missingParts.map((item, idx) => (
                      <View key={idx} style={styles.missingTag}>
                        <Text style={styles.missingTagText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Scan Again</Text>
          </TouchableOpacity>
        </>
      )}

      <SafetyDisclaimer style={styles.SafetyDisclaimer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 20,
    color: '#000',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginVertical: 15,
  },

  card: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  partName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  confidenceBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#007AFF',
    backgroundColor: '#E1EFFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5,
  },

  collectButton: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)', // Subtle blue tint
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#007AFF', // High-visibility blue border
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF', // Creates a "Glow" effect
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5, // Shadow for Android
    marginTop : 12
  },
  collectText: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5, // Tactical "spaced-out" look
    textTransform: 'uppercase',
  },

  materialText: {
    fontSize: 13,
    color: '#777',
    marginTop: 4,
    fontStyle: 'italic',
  },

  projectCard: { backgroundColor: '#000', borderColor: '#333' }, // Professional dark cards
  projectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  difficultyTag: {
    fontSize: 10,
    color: '#FFD700',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  projectDetails: { color: '#ccc', fontSize: 14, lineHeight: 20 },

  missingContainer: {
    marginTop: 15,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  missingHeader: {
    fontSize: 11,
    color: '#888',
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  tagWrapper: { flexDirection: 'row', flexWrap: 'wrap' },
  missingTag: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  missingTagText: { color: '#FF4444', fontSize: 11, fontWeight: '600' },

  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#333',
  },

  backButton: {
    backgroundColor: '#000',
    padding: 18,
    borderRadius: 12,
    marginVertical: 30,
    alignItems: 'center',
  },
  backButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  disclaimerBox: {
    backgroundColor: '#FFF5F5',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FEB2B2',
    marginTop: 10,
    marginBottom: 50,
  },
  disclaimerTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#C53030',
    marginBottom: 5,
  },
  disclaimerText: {
    fontSize: 11,
    color: '#742A2A',
    lineHeight: 16,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 15, color: '#666' },
});

export default ResultsScreen;
