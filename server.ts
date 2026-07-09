/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON parsing
app.use(express.json());

// Lazy-initialized Gemini client to prevent startup crashes if GEMINI_API_KEY is not defined
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not defined.');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// AI Chat proxy endpoint
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { prompt, history } = req.body;
    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required.' });
      return;
    }

    // Try to retrieve lazy Gemini client
    let ai;
    try {
      ai = getGeminiClient();
    } catch (e: any) {
      console.warn('Gemini Client Init Warning:', e.message);
      // Return supportive educational dummy text if the API Key is not set yet
      res.json({ 
        text: "I am ready to help you with your studies! However, I notice that the GEMINI_API_KEY is not currently set up in this environment. To enable real-time replies, please configure your GEMINI_API_KEY in the Secrets panel." 
      });
      return;
    }

    // Standardize system instructions for highly effective high-school/junior educational tutor
    const systemInstruction = 
      "You are a supportive, friendly, and expert AI Study Buddy for Bharat School junior-high students. " +
      "Explain complex physics, math, and science concepts using intuitive, simple analogies. " +
      "Make your explanations engaging, scannable with bullet points, and encourage students to ask questions. " +
      "If the student provides questions about homework or exams, walk them through the solution step-by-step rather than just giving the final answer.";

    // Format chat history correctly
    const contents: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((msg: any) => {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      });
    }

    // Push the current prompt as the last message in content array
    contents.push({
      role: 'user',
      parts: [{ text: prompt }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "I was able to look that up, but could not formulate a text reply. Let's try another topic.";
    res.json({ text: replyText });

  } catch (error: any) {
    console.error('Server-side Gemini Chat Error:', error);
    res.status(500).json({ 
      error: 'Failed to process chat response from Gemini.',
      details: error.message 
    });
  }
});

// Setup Vite dev server or serve static assets based on environment
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== 'production') {
    console.log('Mounting Vite middleware in Development mode...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log('Serving compiled static files in Production mode...');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EduStream Server listening at http://0.0.0.0:${PORT}`);
  });
}

setupViteOrStatic().catch((err) => {
  console.error('Failed to initialize server entrypoint:', err);
});
