
import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

export const getSmartInsights = async (transactions: Transaction[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const transactionsSummary = transactions.map(t => 
    `${t.name} (${t.category}): ${t.type === 'expense' ? '-' : '+'}$${Math.abs(t.amount)}`
  ).join(', ');

  const prompt = `
    Based on the following recent transactions: ${transactionsSummary}.
    Provide a single, short, and encouraging financial insight or tip (max 2 sentences).
    Focus on potential savings or spending patterns. 
    Use a friendly tone like a professional financial advisor.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "You're doing great! Keep tracking your spending to stay on top of your goals.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Analyzing your spending... Stay tuned for personalized budget tips!";
  }
};
