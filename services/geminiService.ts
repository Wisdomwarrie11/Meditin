
import { GoogleGenAI, Type } from "@google/genai";

export async function generateMedicalFeedback(
  practiceType: string,
  field: string,
  userPerformance: string
) {
  try {
    // Always initialize GoogleGenAI with a fresh instance to ensure correct API key selection
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Evaluate this medical ${practiceType} performance for a student in ${field}. 
      Performance Data: ${userPerformance}
      Provide constructive feedback, strengths, weaknesses, and clear recommendations.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.STRING },
          },
          propertyOrdering: ["score", "strengths", "weaknesses", "recommendations"]
        }
      }
    });

    // Use .text property directly as per latest SDK guidelines
    const feedbackText = response.text?.trim() || "{}";
    return JSON.parse(feedbackText);
  } catch (error) {
    console.error("Gemini Feedback Error:", error);
    return null;
  }
}
