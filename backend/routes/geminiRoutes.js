import { GoogleGenerativeAI } from "@google/generative-ai";

// Gemini Chat Handler
export const handleGeminiChat = async (req, res) => {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      return res.status(500).json({
        error: "GOOGLE_API_KEY is not configured"
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate content
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    return res.json({ reply: text });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({
      error: error.message || "Internal server error"
    });
  }
};

export const checkGeminiApiStatus = (req, res) => {
  res.json({
    message: "API Gemini is working! Use POST to chat."
  });
};