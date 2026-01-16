
import { GoogleGenAI, Type } from "@google/genai";
import { Feedback, ActionPlan } from "../types";

export const generateActionPlan = async (feedbacks: Feedback[]): Promise<ActionPlan> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const commentsList = feedbacks
    .filter(f => f.comment.trim().length > 0)
    .map(f => `[Mood: ${f.mood}/5] Comment: ${f.comment}`)
    .join('\n');

  const prompt = `
    You are an expert HR consultant and organizational psychologist. 
    Analyze the following employee feedback data and generate a clear, empathetic 3-point action plan for management.
    
    Feedback Data:
    ${commentsList}

    Identify recurring themes, morale issues, or positive trends.
    Your response should be professional, constructive, and prioritized by impact.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          point1: { type: Type.STRING, description: "First specific action item" },
          point2: { type: Type.STRING, description: "Second specific action item" },
          point3: { type: Type.STRING, description: "Third specific action item" },
          summary: { type: Type.STRING, description: "A brief summary of the overall sentiment" },
        },
        required: ["point1", "point2", "point3", "summary"],
      }
    }
  });

  try {
    return JSON.parse(response.text.trim()) as ActionPlan;
  } catch (error) {
    console.error("Failed to parse AI response", error);
    throw new Error("Could not generate a valid action plan.");
  }
};
