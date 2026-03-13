import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Define the schema 
const responseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    parts: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          name: { type: SchemaType.STRING },
          material: { type: SchemaType.STRING },
          confidence: { type: SchemaType.NUMBER }
        },
        required: ["name", "material", "confidence"]
      }
    },
    projects: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: { type: SchemaType.STRING },
          description: { type: SchemaType.STRING },
          difficulty: { type: SchemaType.STRING },
          // ✅ ADD THIS: List of items the user still needs
          missingParts: { 
            type: SchemaType.ARRAY, 
            items: { type: SchemaType.STRING },
            description: "Common items required to finish this project that are NOT in the image"
          }
        },
        required: ["title", "description", "missingParts"]
      }
    }
  },
  required: ["parts", "projects"]
};

export const analyzeScrapImage = async (imageBuffer) => {
  try {
    // Using gemini-3-flash-preview for the best speed/intelligence balance
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const prompt = `
      You are a survivalist engineering expert. 
      Analyze these scavenged hardware parts and suggest 2-3 functional, high-utility survival assemblies.
      
      Rules:
      1. The scanned parts must be the PRIMARY components of the project.
      2. For each project, identify common scavengable items (like duct tape, wire, or wood) that are MISSING from the image but necessary to complete the build.
      3. Focus on: Defense/Security, Resource Collection (Water/Fire), or Survival Gear.
      4. Strictly NO home decor.
    `;
    
    const imagePart = {
      inlineData: {
        data: imageBuffer.toString("base64"),
        mimeType: "image/jpeg",
      },
    };

    const result = await model.generateContent([prompt, imagePart]);

    
    
    // With Structured Output, result.response.text() is guaranteed to be valid JSON
    const responseBody = result.response.text(); 
    const parsedData = JSON.parse(responseBody);

    console.log("Result from gemini - ", parsedData);

    return parsedData;
    
  } catch (error) {
    console.error("Gemini Analysis Error:", error.message);
    // Fallback: If AI fails, return an empty array so the app doesn't crash
    return { parts: [] };
  }
};