import sharp from 'sharp'; 
import { analyzeScrapImage } from '../services/geminiService.js';
import { calculateProjectMatches } from '../utils/matchingAlgo.js';
import { uploadToCloudinary } from '../utils/ImageUploadCloudinary.js'; // ADD THIS LINE
import Part from '../models/Part.js';
import User from '../models/User.js';
import Project from '../models/Project.js';

export const scanImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }
    
    // 1. Process the image with Sharp
    const optimizedImageBuffer = await sharp(req.file.buffer)
      .resize(1024)
      .jpeg({ quality: 80 })
      .toBuffer();

    // 1.5 Save to Cloudinary
    const imageUrl = await uploadToCloudinary(optimizedImageBuffer);

    // 2. Identify parts using Gemini AI
    const result = await analyzeScrapImage(optimizedImageBuffer);
    const identifiedParts = result.parts || [];

    // 3. Find or Create parts
    const newPartIds = [];
    const savedPartsInfo = [];

    for (const p of identifiedParts) {
      const part = await Part.findOneAndUpdate(
        { name: p.name.toLowerCase() },
        { 
          $setOnInsert: { name: p.name, material: p.material, commonSources: [] } 
        },
        { upsert: true, new: true }
      );
      newPartIds.push(part._id);
      savedPartsInfo.push(part);
    }

    // 4. Update User Inventory
    const user = await User.findOneAndUpdate(
      { firebaseUid: req.user.uid },
      { $addToSet: { inventory: { $each: newPartIds } } }, 
      { new: true }
    ).populate('inventory');

    // 5. Fetch all projects and run Matching Algorithm
    const allProjects = await Project.find({}).populate('requiredParts.partId');
    const topProjects = calculateProjectMatches(user.inventory, allProjects);

    res.status(201).json({
      success: true,
      imageUrl, 
      identifiedParts: savedPartsInfo,
      topMatches: topProjects.slice(0, 5) 
    });

  } catch (error) {
    next(error);
  }
};