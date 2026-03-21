import Inventory from "../models/Inventory.js";
import Blueprint from "../models/Blueprint.js";
import User from "../models/user.js";

// POST /api/sync
export const syncInventory = async (req, res, next) => {
  try {
    const { userId, stockpile, blueprints } = req.body;

    const user = await User.findOne({ firebaseUid: userId});

    console.log('user we have from frontend to sync the inventory : ', user, userId )

    // 1. Sync Stockpile Items
    const stockpilePromises = stockpile.map(item => 
      Inventory.findOneAndUpdate(
        { userId, itemId: item.id }, 
        { ...item, lastSynced: new Date() },
        { upsert: true, new: true }
      )
    );

    // 2. Sync Blueprints (Knowledge)
   
    const blueprintPromises = blueprints.map(bp => 
      Blueprint.findOneAndUpdate(
        { userId, blueprintId: bp.id },
        { ...bp, lastSynced: new Date() },
        { upsert: true, new: true }
      )
    );

    await Promise.all([...stockpilePromises, ...blueprintPromises]);

    res.status(200).json({ 
      success: true, 
      message: "Tactical Data Synchronized",
      timestamp: new Date() 
    });
  } catch (error) {
    next(error);
  }
};