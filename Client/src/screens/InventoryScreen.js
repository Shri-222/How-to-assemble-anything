import { useContext, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { InventoryContext } from '../context/InventoryContext';

const InventoryScreen = () => {
  const { stockpile, removeStockpileItem, blueprints } =
    useContext(InventoryContext);
  const [activeTab, setActiveTab] = useState('stockpile'); // 'stockpile' or 'blueprints'

  return (
    <View style={styles.container}>
      {/* 1. Tactical Header */}
      <View style={styles.header}>
        <Text style={styles.title}>THE ARMORY</Text>
        <View style={styles.tabBar}>
          <TouchableOpacity
            onPress={() => setActiveTab('stockpile')}
            style={[styles.tab, activeTab === 'stockpile' && styles.activeTab]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'stockpile' && styles.activeTabText,
              ]}
            >
              STOCKPILE ({stockpile.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('blueprints')}
            style={[styles.tab, activeTab === 'blueprints' && styles.activeTab]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'blueprints' && styles.activeTabText,
              ]}
            >
              BLUEPRINTS ({blueprints.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Content List */}
      <FlatList
        data={activeTab === 'stockpile' ? stockpile : blueprints}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.cardTitle}>{item.name || item.title}</Text>
              <Text style={styles.cardSub}>
                {item.material || item.difficulty || 'Archived Guide'}
              </Text>
            </View>

            {activeTab === 'stockpile' ? (
              <TouchableOpacity onPress={() => removeStockpileItem(item.id)}>
                <Text style={styles.actionText}>SCRAP</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity>
                <Text style={[styles.actionText, { color: '#007AFF' }]}>
                  OPEN
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No data secured in this sector.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    padding: 20,
    backgroundColor: '#050505',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 2,
    marginBottom: 20,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#111',
    borderRadius: 8,
    padding: 4,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 6 },
  activeTab: { backgroundColor: '#222', borderWidth: 1, borderColor: '#333' },
  tabText: { color: '#666', fontSize: 12, fontWeight: 'bold' },
  activeTabText: { color: '#007AFF' },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#111',
  },
  cardTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  cardSub: { color: '#666', fontSize: 13, marginTop: 4 },
  actionText: { color: '#FF3B30', fontWeight: 'bold', fontSize: 12 },
  empty: {
    color: '#444',
    textAlign: 'center',
    marginTop: 50,
    letterSpacing: 1,
  },
});

export default ArmoryScreen;
