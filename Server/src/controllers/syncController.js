import Inventory from "../models/Inventory.js";
import Blueprint from "../models/Blueprint.js";
import User from "../models/user.js";

// POST /api/sync
export const syncInventory = async (req, res, next) => {

  try {
    const { userId, stockpile, blueprints } = req.body;

    // 1. DATA VALIDATION GUARD
    if (!userId || typeof userId !== 'string') {
       console.error("❌ SYNC FAILED: userId is missing or invalid in req.body");
       return res.status(400).json({ 
         success: false, 
         message: "Invalid userId. Tactical sync requires a valid Firebase UID." 
       });
    }

    // 2. Find the User
    const user = await User.findOne({ firebaseUid: userId });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found in Tactical Database" });
    }

    // 3. Sync Stockpile (Use the validated userId)
    const stockpilePromises = (stockpile || []).map(item => 
      Inventory.findOneAndUpdate(
        { userId: userId, itemId: item.id }, 
        { ...item, userId: userId, lastSynced: new Date() }, // Ensure userId is saved in the doc
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
    );

    // 4. Sync Blueprints
    const blueprintPromises = (blueprints || []).map(blueprint => {

        const cleanInstructions = typeof blueprint.data === 'object' ? blueprint.data.data : blueprint.data;

        return Blueprint.findOneAndUpdate(
            { userId: userId, blueprintId: blueprint.id },
            { 
            ...blueprint, 
            userId: userId, 
            instructions: cleanInstructions, // Mapping the text correctly
            lastSynced: new Date() 
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
    });

    const [syncedStockpile, syncedBlueprints] = await Promise.all([
      Promise.all(stockpilePromises),
      Promise.all(blueprintPromises)
    ]);

    // 5. Link to User (Unique IDs only)
    user.inventory = [...new Set([...user.inventory, ...syncedStockpile.map(s => s._id)])];
    user.blueprint = [...new Set([...user.blueprint, ...syncedBlueprints.map(b => b._id)])];
    
    await user.save();

    res.status(200).json({ success: true, message: "Sync Successful" });

  } catch (error) {
    console.error("Critical Sync Error:", error.message);
    next(error); 
  }
};