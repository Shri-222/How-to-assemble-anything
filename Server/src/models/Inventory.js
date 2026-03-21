import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({
  itemId: { type: String, required: true }, // The ID from mobile app
  name: { type: String, required: true },
  material: { type: String },
  confidence: { type: Number },
  scannedAt: { type: Date },
  lastSynced: { type: Date, default: Date.now },
});

// Ensures a user doesn't have duplicate item IDs in the cloud
InventorySchema.index({ itemId: 1 }, { unique: true });

const Inventory = mongoose.model("Inventory", InventorySchema);

export default Inventory;
