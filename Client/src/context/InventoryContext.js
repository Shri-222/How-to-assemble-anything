import { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const [inventory, setInventory] = useState([]);

  const [stockpile, setStockpile] = useState([]); // Physical items
  const [blueprints, setBlueprints] = useState([]); // Saved projects

  // Load the Inventory on startup
  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      // 1. Load Scavenged Items (Stockpile)
      const savedItems = await AsyncStorage.getItem('@scavenged_items');
      if (savedItems) setStockpile(JSON.parse(savedItems));

      // 2. Load Saved Blueprints
      const savedBlueprints = await AsyncStorage.getItem('@saved_blueprints');
      if (savedBlueprints) setBlueprints(JSON.parse(savedBlueprints));
      
    } catch (e) { 
      console.error("Critical failure loading Inventory data:", e); 
    }
  };

 const addToStockpile = async (item) => {
    const newStockpile = [...stockpile, { ...item, id: Date.now() }];
    setStockpile(newStockpile);
    await AsyncStorage.setItem('@scavenged_items', JSON.stringify(newStockpile));
  };

  const removeStockpileItem = async (id) => {
    const filtered = stockpile.filter(item => item.id !== id);
    setStockpile(filtered);
    await AsyncStorage.setItem('@scavenged_items', JSON.stringify(filtered));
  };

  const saveBlueprint = async (project, instructions) => {
    const newBlueprints = [...blueprints, { ...project, instructions, id: Date.now() }];
    setBlueprints(newBlueprints);
    await AsyncStorage.setItem('@saved_blueprints', JSON.stringify(newBlueprints));
  };

  const userStats = {
    name: "Shreyash Chougale", // We can get this from an Auth/Login later
    itemCount: stockpile.length,
    projectCount: blueprints.length,
    // Calculate Level: 1 level for every 5 items found
    level: Math.floor(stockpile.length / 5) + 1, 
    // Calculate Rank based on Level
    rank: stockpile.length > 20 ? "Master Engineer" : stockpile.length > 10 ? "Scavenger" : "Scrap Hunter"
  };
  
  return (
    <InventoryContext.Provider value={{ stockpile, addToStockpile, removeStockpileItem, blueprints, saveBlueprint, userStats }}>
      {children}
    </InventoryContext.Provider>
  );
};