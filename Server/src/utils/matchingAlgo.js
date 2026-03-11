
 // Calculates match percentage considering both part type AND quantity.

export const calculateProjectMatches = (userInventory, allProjects) => {

  // 1. Create a "Stock Count" Map: { "partId": count }
  // This tells us exactly how many of each item the user has.

  const inventoryMap = userInventory.reduce((acc, part) => {
    const id = part._id ? part._id.toString() : part.toString();
    acc[id] = (acc[id] || 0) + 1; 
    return acc;
  }, {});

  const matchedProjects = allProjects.map(project => {
    const projectData = project.toObject ? project.toObject() : project;
    const required = projectData.requiredParts || [];
    
    if (required.length === 0) return { ...projectData, matchPercentage: 0 };

    let totalRequiredItems = 0;
    let totalOwnedItems = 0;

    // 2. Loop through required parts and check quantities
    required.forEach(req => {
      const reqId = req.partId._id ? req.partId._id.toString() : req.partId.toString();
      const qtyNeeded = req.quantity || 1;
      const qtyOwned = inventoryMap[reqId] || 0;

      totalRequiredItems += qtyNeeded;
      
      // We only count up to the amount needed (can't have 200% of a part)
      totalOwnedItems += Math.min(qtyOwned, qtyNeeded);
    });

    const matchPercentage = Math.round((totalOwnedItems / totalRequiredItems) * 100);

    return {
      ...projectData,
      matchPercentage,
      isBuildable: matchPercentage === 100 // Quick flag for the frontend
    };
  });

  // Sort by match percentage (highest first) and then by difficulty
  return matchedProjects.sort((a, b) => b.matchPercentage - a.matchPercentage);
};