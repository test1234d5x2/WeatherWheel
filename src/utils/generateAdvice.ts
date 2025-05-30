import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const genAI = new GoogleGenAI({ apiKey: API_KEY });

const generateAdvice = async (prompt: string) => {
    try {
        const result = await genAI.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: prompt
        });
        const response = result.text;
        return response ? response: '';
    } catch (error) {
        console.error("Error generating content:", error);
        throw error;
    }
};

export default generateAdvice