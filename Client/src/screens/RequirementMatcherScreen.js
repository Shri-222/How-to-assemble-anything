import { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { InventoryContext } from '../context/InventoryContext';

const RequirementMatcherScreen = () => {
  const { stockpile, blueprints } = useContext(InventoryContext);
  const [selectedBlueprint, setSelectedBlueprint] = useState(null);
  const [analysis, setAnalysis] = useState({
    matched: [],
    missing: [],
    percentage: 0,
  });

  // 1. THE MATCHING ENGINE
  const analyzeBuild = blueprint => {
    setSelectedBlueprint(blueprint);

    // blueprints have a 'missingParts' array from the Gemini initial scan
    const requirements = blueprint.missingParts || [];
    let matched = [];
    let missing = [];

    requirements.forEach(req => {
      // Logic: Does any item in our stockpile match the material or name of the requirement?
      const found = stockpile.find(
        item =>
          item.name.toLowerCase().includes(req.toLowerCase()) ||
          item.material.toLowerCase().includes(req.toLowerCase()),
      );

      if (found) {
        matched.push({ req, foundWith: found.name });
      } else {
        missing.push(req);
      }
    });

    const percent =
      requirements.length > 0
        ? Math.round((matched.length / requirements.length) * 100)
        : 100;

    setAnalysis({ matched, missing, percentage: percent });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>BUILD ANALYZER</Text>
        <Text style={styles.subtitle}>SELECT BLUEPRINT TO CROSS-REFERENCE</Text>
      </View>

      {/* 2. BLUEPRINT SELECTOR (Horizontal) */}
      <View style={styles.selectorContainer}>
        <FlatList
          horizontal
          data={blueprints}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => analyzeBuild(item)}
              style={[
                styles.miniCard,
                selectedBlueprint?.id === item.id && styles.activeCard,
              ]}
            >
              <Text style={styles.miniCardText}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* 3. ANALYSIS RESULTS */}
      {selectedBlueprint ? (
        <ScrollView style={styles.resultsContainer}>
          <View style={styles.progressCircle}>
            <Text style={styles.percentText}>{analysis.percentage}%</Text>
            <Text style={styles.statusText}>READINESS</Text>
          </View>

          <Text style={styles.sectionHeader}>MATCHED FROM STOCKPILE</Text>
          {analysis.matched.map((m, i) => (
            <View key={i} style={styles.matchItem}>
              <Text style={styles.matchText}>✅ {m.req}</Text>
              <Text style={styles.foundText}>Sourced from: {m.foundWith}</Text>
            </View>
          ))}

          <Text style={[styles.sectionHeader, { marginTop: 20 }]}>
            CRITICAL SHORTFALLS
          </Text>
          {analysis.missing.map((m, i) => (
            <View key={i} style={styles.missingItem}>
              <Text style={styles.missingText}>❌ {m}</Text>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            SELECT A ARCHIVED BLUEPRINT TO BEGIN ANALYSIS
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', paddingTop: 40 },
  header: { padding: 25, borderBottomWidth: 1, borderColor: '#222' },
  title: { color: '#FFF', fontSize: 24, fontWeight: '900', letterSpacing: 1 },
  subtitle: {
    color: '#007AFF',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 5,
  },
  selectorContainer: { height: 80, paddingVertical: 15 },
  miniCard: {
    backgroundColor: '#111',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#333',
    justifyContent: 'center',
  },
  activeCard: { borderColor: '#007AFF', backgroundColor: '#001A33' },
  miniCardText: { color: '#AAA', fontWeight: 'bold', fontSize: 12 },
  resultsContainer: { flex: 1, padding: 20 },
  progressCircle: {
    height: 120,
    width: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#007AFF',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
  },
  percentText: { color: '#FFF', fontSize: 32, fontWeight: 'bold' },
  statusText: { color: '#007AFF', fontSize: 10, fontWeight: '900' },
  sectionHeader: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 15,
    letterSpacing: 1,
  },
  matchItem: {
    backgroundColor: '#051A05',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#28A745',
  },
  matchText: { color: '#FFF', fontWeight: 'bold' },
  foundText: { color: '#888', fontSize: 12, marginTop: 4 },
  missingItem: {
    backgroundColor: '#1A0505',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#DC3545',
  },
  missingText: { color: '#AAA' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#333', fontWeight: 'bold', letterSpacing: 1 },
});

export default RequirementMatcherScreen;
