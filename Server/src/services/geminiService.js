
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Analyzes an image buffer using Gemini 1.5 Flash to identify scrap parts.
 * @param {Buffer} imageBuffer - The image data from the request.
 * @returns {Object} - Parsed JSON object containing the identified parts.
 */
export const analyzeScrapImage = async (imageBuffer) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = "Analyze this image and return a JSON list of hardware/scrap parts identified. Format: { parts: [{ name, material, confidence }] }";

    const imagePart = {
      inlineData: {
        data: imageBuffer.toString("base64"),
        mimeType: "image/jpeg", // Standardizing for general scrap images
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Cleaning the response in case the AI wraps it in markdown code blocks
    const cleanedJson = text.replace(/```json|```/g, "").trim();
    
    return JSON.parse(cleanedJson);
    
  } catch (error) {
    console.error("Gemini Analysis Error:", error.message);
    throw new Error("Failed to analyze image with Gemini AI.");
  }
};