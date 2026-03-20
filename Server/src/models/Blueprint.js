import mongoose from "mongoose";

const BlueprintSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  blueprintId: { type: String, required: true },
  title: { type: String, required: true },
  instructions: { type: String }, // The Markdown text
  missingParts: [String],        // Array of parts needed
  isArchived: { type: Boolean, default: true },
  lastSynced: { type: Date, default: Date.now }
});

BlueprintSchema.index({ userId: 1, blueprintId: 1 }, { unique: true });

const Blueprint = mongoose.model('Blueprint', BlueprintSchema);

export default Blueprint;