import { GoogleGenerativeAI } from "@google/generative-ai";
import tarotDeck from "../constants/deck";
import { TarotCard } from "../types";

const ai = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const cardNames = tarotDeck.map((card) => card.name_en).join(', ');

export interface QuizResult {
  cardName: string;
  portrait: string;
}

export interface SpreadInterpretation {
  general: string;
  relationship: string;
  career: string;
}

const getQuizResult = async (answers: string[]): Promise<QuizResult> => {
  const model = ai.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Based on these answers to a personality quiz: ${answers.join(', ')}, which of these Tarot cards best represents the person? Cards: ${cardNames}. Respond in JSON format like {"cardName": "The Fool", "portrait": "A detailed, vivid, and imaginative description of the character represented by the card, suitable for generating an AI image."}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return JSON.parse(text);
};

const getSpreadInterpretation = async (cardNames: string[]): Promise<SpreadInterpretation> => {
  const model = ai.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Provide a tarot reading for a three-card spread with these cards: ${cardNames.join(', ')}. The interpretation should cover general themes, relationships, and career. Respond in JSON format like {"general": "...", "relationship": "...", "career": "..."}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return JSON.parse(text);
};

export const geminiService = {
  getQuizResult,
  getSpreadInterpretation,
};
