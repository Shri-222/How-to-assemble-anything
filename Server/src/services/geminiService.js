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
          name: { type: SchemaType.STRING, description: "Name of the hardware part" },
          material: { type: SchemaType.STRING, description: "Likely material like metal, plastic, wood" },
          confidence: { type: SchemaType.NUMBER, description: "Confidence score 0 to 1" }
        },
        required: ["name", "material"]
      }
    }
  }
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

    const prompt = "Identify all reusable hardware, scrap parts, or assembly components in this image.";

    const imagePart = {
      inlineData: {
        data: imageBuffer.toString("base64"),
        mimeType: "image/jpeg",
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    
    // With Structured Output, result.response.text() is guaranteed to be valid JSON
    return JSON.parse(result.response.text());
    
  } catch (error) {
    console.error("Gemini Analysis Error:", error.message);
    // Fallback: If AI fails, return an empty array so the app doesn't crash
    return { parts: [] };
  }
};