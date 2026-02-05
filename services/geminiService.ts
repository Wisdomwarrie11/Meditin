
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateMedicalFeedback(
  practiceType: string,
  field: string,
  userPerformance: string
) {
  try {
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
          required: ["score", "strengths", "weaknesses", "recommendations"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Feedback Error:", error);
    return null;
  }
}
