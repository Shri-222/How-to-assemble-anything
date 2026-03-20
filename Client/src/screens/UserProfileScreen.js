import { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { InventoryContext } from '../context/InventoryContext';

const UserProfileScreen = ({ navigation }) => {
  const { stockpile, blueprints, userStats } = useContext(InventoryContext);

  // Get initials dynamically (e.g., "Shri Chougale" -> "SC")
  const initials = userStats.name.split(' ').map(n => n[0]).join('');

   const handleLogout = () => auth().signOut();
  return (
    <ScrollView style={styles.container}>
      {/* 1. Tactical ID Card */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{initials}</Text> 
        </View>
        <View>
          <Text style={styles.userName}>{userStats.name}</Text>
          <Text style={styles.userRank}>{userStats.rank} | Lvl {userStats.level}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* 2. Armory Statistics (The "Quick Look") */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stockpile.length}</Text>
          <Text style={styles.statLabel}>STOCKPILE</Text>
        </View>
        <View style={[styles.statBox, { borderLeftWidth: 1, borderColor: '#333' }]}>
          <Text style={styles.statNumber}>{blueprints.length}</Text>
          <Text style={styles.statLabel}>MANUALS</Text>
        </View>
      </View>

      {/* 3. The REQUIREMENT MATCHER (The Main Objective) */}
      <TouchableOpacity 
        style={styles.matcherButton}
        onPress={() => navigation.navigate('RequirementMatcher')}
      >
        <View style={styles.matcherContent}>
          <Text style={styles.matcherTitle}>ANALYZE BUILD READINESS</Text>
          <Text style={styles.matcherSub}>Cross-reference Stockpile with Saved Blueprints</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.matcherButton}
        onPress={() => navigation.navigate('Inventory')}
      >
        <View style={styles.matcherContent}>
          <Text style={styles.matcherTitle}>Go to Inventory </Text>
        </View>
      </TouchableOpacity>

      {/* 4. Settings/Account Options */}
      {/* <View style={styles.menuList}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Cloud Sync (v3.0 coming soon)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Export Forensic Log (Veritas Mode)</Text>
        </TouchableOpacity>
      </View> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', paddingTop: 40 },
  profileHeader: { padding: 25, flexDirection: 'row', alignItems: 'center', backgroundColor: '#050505' },
  logout: { color: '#ff4444', fontWeight: '500' },
  avatarPlaceholder: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center', marginRight: 20 },
  avatarText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
  userName: { color: '#FFF', fontSize: 20, fontWeight: '900', letterSpacing: 0.5 },
  userRank: { color: '#007AFF', fontSize: 12, fontWeight: 'bold', marginTop: 4, textTransform: 'uppercase' },
  statsRow: { flexDirection: 'row', paddingVertical: 20, backgroundColor: '#0A0A0A', borderBottomWidth: 1, borderColor: '#222' },
  statBox: { flex: 1, alignItems: 'center' },
  statNumber: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  statLabel: { color: '#666', fontSize: 10, letterSpacing: 1, marginTop: 5 },
  matcherButton: { margin: 20, padding: 20, backgroundColor: '#111', borderRadius: 12, borderWidth: 1, borderColor: '#007AFF', borderStyle: 'dashed' },
  matcherTitle: { color: '#007AFF', fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
  matcherSub: { color: '#888', fontSize: 12 },
  menuList: { paddingHorizontal: 20 },
  menuItem: { paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#111' },
  menuText: { color: '#AAA', fontSize: 14 }
});

export default UserProfileScreen;