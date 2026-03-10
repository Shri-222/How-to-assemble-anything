
/**
 * Calculates match percentage for projects based on user inventory.
 * @param {Array} userInventory - Array of User's Part objects or ObjectIds.
 * @param {Array} allProjects - Array of Project documents from the database.
 * @returns {Array} - Projects with a matchPercentage property, sorted descending.
 */
export const calculateProjectMatches = (userInventory, allProjects) => {
  // Map inventory to a Set of strings for efficient lookup
  const inventorySet = new Set(
    userInventory.map(part => (part._id ? part._id.toString() : part.toString()))
  );

  const matchedProjects = allProjects.map(project => {
    const projectData = project.toObject ? project.toObject() : project;
    const required = projectData.requiredParts || [];
    
    if (required.length === 0) {
      return { ...projectData, matchPercentage: 0 };
    }

    // Count how many unique required partIds exist in the user's inventory
    const ownedCount = required.filter(req => 
      inventorySet.has(req.partId.toString())
    ).length;

    const matchPercentage = Math.round((ownedCount / required.length) * 100);

    return {
      ...projectData,
      matchPercentage
    };
  });

  // Sort by match percentage: highest to lowest
  return matchedProjects.sort((a, b) => b.matchPercentage - a.matchPercentage);
};