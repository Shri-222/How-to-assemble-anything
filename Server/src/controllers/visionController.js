import sharp from 'sharp'; 
import { analyzeScrapImage, generateProjectBlueprints } from '../services/geminiService.js';
import { calculateProjectMatches } from '../utils/matchingAlgo.js';
import { uploadToCloudinary } from '../utils/ImageUploadCloudinary.js'; 
import Part from '../models/parts.js';
import User from '../models/user.js';
import Project from '../models/projects.js';

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
    const identifiedParts = Array.isArray(result?.parts) ? result.parts : [];

    // 3. Find or Create parts
    const newPartIds = [];
    const savedPartsInfo = [];

    for (const p of identifiedParts) {

      if (!p.name) continue;

      const part = await Part.findOneAndUpdate(
        { name: p.name.toLowerCase() },
        { 
          $setOnInsert: { 
            name: p.name, 
            material: p.material || 'Unknown', 
            confidence: p.confidence || 0 , 
            commonSources: [] 
          } 
        },
        { upsert: true, new: true }
      );
      newPartIds.push(part._id);
      savedPartsInfo.push(part);
    }

    // 4. Update User Inventory
    const user = await User.findOneAndUpdate(
      { firebaseUid: req.user.uid },
      { $addToSet: { parts: { $each: newPartIds } } }, 
      { new: true }
    ).populate('parts');

    // 5. Fetch all projects and run Matching Algorithm
    const allProjects = await Project.find({}).populate('requiredParts.partId');
    const topProjects = calculateProjectMatches(user.parts, allProjects);

    res.status(201).json({
      success: true,
      imageUrl, 
      identifiedParts: savedPartsInfo,
      topMatches: topProjects.slice(0, 5),
      projects : result.projects
    });

  } catch (error) {
    next(error);
  }
};


export const getProjectInstructions = async (req, res, next) => {
  try {
    const { projectTitle, scavengedParts, materialContext } = req.body;

    if (!projectTitle || !scavengedParts) {
      return res.status(400).json({ message: "Missing project context." });
    }

    // Call Gemini to generate the detailed assembly guide
    const instructions = await generateProjectBlueprints(projectTitle, scavengedParts, materialContext);

    res.status(200).json({
      success: true,
      instructions: instructions // This will be a structured object or Markdown
    });
  } catch (error) {
    next(error);
  }
};