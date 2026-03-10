import { analyzeScrapImage } from '../services/geminiService.js';
import { calculateProjectMatches } from '../utils/matchingAlgo.js';
import Part from '../models/Part.js';
import User from '../models/User.js';
import Project from '../models/Project.js';

/**
 * Handles image scanning, part identification, inventory updates, and project matching.
 */
export const scanImage = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('Please upload an image');
    }

    // 1. Identify parts using Gemini AI
    const { parts } = await analyzeScrapImage(req.file.buffer);

    // 2. Save identified parts and get their ObjectIds
    const savedParts = await Part.insertMany(
      parts.map(p => ({
        name: p.name,
        material: p.material,
        commonSources: [] // Default empty, can be expanded
      }))
    );

    const newPartIds = savedParts.map(p => p._id);

    // 3. Update User Inventory (using Firebase UID from auth middleware)
    const user = await User.findOneAndUpdate(
      { firebaseUid: req.user.uid },
      { $push: { inventory: { $each: newPartIds } } },
      { new: true }
    ).populate('inventory');

    // 4. Fetch all projects and run Matching Algorithm
    const allProjects = await Project.find({}).populate('requiredParts.partId');
    const topProjects = calculateProjectMatches(user.inventory, allProjects);

    res.status(201).json({
      identifiedParts: savedParts,
      topMatches: topProjects.slice(0, 5) // Return top 5 matches
    });

  } catch (error) {
    next(error);
  }
};