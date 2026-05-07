import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

export const ai = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const generateTrends = async () => {
  if (!ai) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const prompt = `
    Du er en viral trendanalytiker. Generer 6 aktuelle og realistiske trender for sosiale medier (TikTok, Instagram, YouTube, X/Twitter).
    Du må hente inspirasjon fra alt som rører seg på tvers av plattformer akkurat nå.
    Returner KUN et JSON-array med objekter som følger dette formatet:
    {
      "id": "string",
      "platform": "TikTok" | "Instagram" | "YouTube" | "X",
      "growth_stat": "string (f.eks +240%)",
      "viral_score": number (0-100),
      "heat_level": "Hot" | "Rising" | "Stable",
      "title": "En fengende tittel",
      "category": "Kategori",
      "country": "Land eller Global",
      "language": "Språk",
      "target_audience": "Beskrivelse",
      "music_mood": "Viral/Upbeat" | "Cinematic/Epic" | "Lo-Fi/Chill" | "Techno/Hype" | "Sad/Emotional" | "None",
      "caption_style": "Animated/Viral" | "Minimalist" | "Bold/Shadow" | "Typewriter",
      "transition_style": "Cinematic Zoom" | "Fast Cut" | "Dissolve" | "None"
    }
    Gjør noen av dem relevante for Norge/Skandinavia, og noen globale. Fokuser på teknologi, livsstil, AI og dagsaktuelle nyheter.
  `;

  try {
    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const response = await result.response;
    const text = response.text();
    if (!text) {
      throw new Error("No response from Gemini");
    }

    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini generation error:", error);
    throw error;
  }
};
