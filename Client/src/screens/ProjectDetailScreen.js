import {useContext} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import { InventoryContext } from '../context/InventoryContext';

const ProjectDetailScreen = ({ route, navigation }) => {
  
  const instructions = route.params;
  const projectTitle = route.params?.projectTitle || "Assembly Blueprint";
  const isFromInventory = route.params?.isFromInventory || false; // Flag to determine if we came from the Inventory or directly from Results

  const { saveBlueprint, blueprints } = useContext(InventoryContext);

  // console.log("Instruction we got from Inventory : ", instructions)

  const handleSave = () => {
    saveBlueprint({ title: projectTitle, ...instructions}, instructions);
    Alert.alert("Data Archived", "Blueprint secured in the Armory.");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* 1. Header with Tactical Badge */}
      <View style={styles.header}>
        <Text style={styles.title}>{projectTitle}</Text>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>v2.0 TACTICAL GUIDE</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: '#1A1A1A', marginLeft: 10 }]}>
            <Text style={[styles.badgeText, { color: '#888' }]}>ENGR-LEVEL: HIGH</Text>
          </View>
        </View>

        {!isFromInventory && (
          <TouchableOpacity 
            style={styles.archiveButton} 
            onPress={() => handleSave()}
          >
            <Text style={styles.archiveText}> ARCHIVE TO INVENTORY</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 2. Markdown Content */}
      <View style={styles.markdownContainer}>
        {/* We use the instructions string here */}
        <Markdown style={markdownStyles}>
          {instructions.data || instructions.instructions.data || "No instructions generated."}
        </Markdown>
      </View>

      {/* 3. Footer Back Button */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>EXIT BLUEPRINT</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', paddingTop : 40 },
  header: { 
    padding: 25, 
    borderBottomWidth: 1, 
    borderBottomColor: '#222',
    backgroundColor: '#050505' 
  },
  title: { fontSize: 26, fontWeight: '900', color: '#fff', marginBottom: 12, letterSpacing: 0.5 },
  badgeRow: { flexDirection: 'row' },
  badge: {
    backgroundColor: 'rgba(0, 122, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  badgeText: { color: '#007AFF', fontSize: 10, fontWeight: '800', letterSpacing: 1 },

  archiveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
    marginTop: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00A2FF',
  },
  disabledButton: {
    backgroundColor: '#1A1A1A',
    borderColor: '#333',
  },
  archiveText: {
    color: '#FFFF',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 1,
  },

  markdownContainer: { padding: 20 },
  backButton: {
    margin: 20,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
  },
  backButtonText: { color: '#888', fontWeight: 'bold', letterSpacing: 2 },
});

// Pro-level Markdown styling for a "Terminal" survival look
const markdownStyles = {
  body: { color: '#AAA', fontSize: 16, lineHeight: 26 },
  heading1: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginTop: 20, textTransform: 'uppercase' },
  heading2: { color: '#FFF', fontSize: 20, fontWeight: '700', marginTop: 25, marginBottom: 10 },
  heading3: { color: '#007AFF', fontSize: 18, fontWeight: '800', marginTop: 20, marginBottom: 5 },
  strong: { color: '#FFF', fontWeight: '900' },
  hr: { backgroundColor: '#333', marginVertical: 20 },
  bullet_list: { marginVertical: 10 },
  list_item: { marginBottom: 10 },
  text: { color: '#CCC' },
};

export default ProjectDetailScreen;