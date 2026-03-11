
import User from '../models/user.js';
import Project from '../models/projects.js';
import { calculateProjectMatches } from '../utils/matchingAlgo.js';

 // Gets projects based on existing inventory (No camera needed)
 
export const getMyBuilds = async (req, res, next) => {
  try {
    // 1. Get the user and their saved parts
    const user = await User.findOne({ firebaseUid: req.user.uid }).populate('inventory');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Fetch all projects
    const allProjects = await Project.find({}).populate('requiredParts.partId');

    // 3. Run the Matching Algorithm
    const matches = calculateProjectMatches(user.inventory, allProjects);

    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (error) {
    next(error);
  }
};