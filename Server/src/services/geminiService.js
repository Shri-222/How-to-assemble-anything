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
          name: { type: SchemaType.STRING, description: "Technical name of the component" },
          material: { type: SchemaType.STRING, description: "Observed material (e.g., Brushed Stainless, Tempered Glass)" },
          confidence: { type: SchemaType.NUMBER, description: "Float between 0 and 1" }
        },
        required: ["name", "material", "confidence"] // Force the AI to provide confidence
      }
    },
    projects: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: { type: SchemaType.STRING },
          description: { type: SchemaType.STRING },
          difficulty: { type: SchemaType.STRING, enum: ["Low-Resource", "Moderate-Build", "Complex-Engineering"] },
          missingParts: { 
            type: SchemaType.ARRAY, 
            items: { type: SchemaType.STRING } 
          }
        },
        required: ["title", "description", "difficulty", "missingParts"]
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
      SYSTEM ROLE: Lead Survival Engineer & Scavenging Analyst.
      
      TASK: 
      1. Identify all hardware components in the provided image with high precision.
      2. For every identified part, assign a 'confidence' score between 0.1 and 1.0 based on visual clarity.
      3. Analyze the physical properties (tensile strength, heat resistance, conductivity) of the identified scrap.
      4. Generate 2-3 "Field-Ready" tactical or survival assemblies.
      
      PROJECT CRITERIA:
      - Must be high-utility (Defense, Water Purification, Energy, or Signaling).
      - Must utilize the scanned parts as the "Critical Path" components.
      - Must include a 'missingParts' inventory for required common scavenging items.
      - STRICT BANS: No artistic decor, no furniture, no non-functional aesthetics.
      
      TONE: Professional, technical, and urgent. Use engineering terminology.
    `;
    
    const imagePart = {
      inlineData: {
        data: imageBuffer.toString("base64"),
        mimeType: "image/jpeg",
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const responseBody = result.response.text(); 
    const parsedData = JSON.parse(responseBody);

    console.log("response body from gemini - ", parsedData);

    return parsedData;
    
  } catch (error) {
    console.error("Gemini Analysis Error:", error.message);
    // Fallback: If AI fails, return an empty array so the app doesn't crash
    return { parts: [] };
  }
};

export const generateProjectBlueprints = async (title, parts, material) => {
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  const prompt = `
    SYSTEM ROLE: Lead Survival Engineer.
    TASK: Generate a technical assembly manual for the project: "${title}".
    
    COMPONENTS AVAILABLE: ${parts.map(p => p.name).join(", ")}.
    MATERIAL CONTEXT: ${material}.

    GUIDELINES:
    1. Provide a "Safety Warning" specific to this build.
    2. List "Required Scavengables" (items like wire, tape, or glue not in the scan).
    3. Provide a 5-8 step "Assembly Process" using professional engineering verbs (e.g., "fasten," "calibrate," "insulate").
    4. Estimate "Operational Integrity" (Low/Medium/High).
    
    FORMAT: Return the response in clean Markdown.
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
};