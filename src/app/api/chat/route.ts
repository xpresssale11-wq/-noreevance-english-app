import { NextRequest, NextResponse } from "next/server";
import {
  NOREE_VANCE_SYSTEM_PROMPT,
  generateLocalGentleResponse,
  NoreeTurnResponse,
} from "@/lib/persona";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      message = "",
      history = [],
      apiKey: clientApiKey,
      topicContext = "",
    } = body;

    const apiKey = clientApiKey || process.env.GEMINI_API_KEY;

    if (!message.trim()) {
      return NextResponse.json(
        { error: "Please share a thought or voice message first." },
        { status: 400 }
      );
    }

    // If no Gemini API key is configured yet, use the built-in Gentle Framework fallback responder
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      const fallback = generateLocalGentleResponse(message);
      return NextResponse.json({
        ...fallback,
        source: "local-gentle-engine",
      });
    }

    const conversationContext = history
      .slice(-6)
      .map((m: { role: string; text: string }) => `${m.role === "user" ? "Learner" : "Noree Vance"}: ${m.text}`)
      .join("\n");

    const prompt = `${
      topicContext ? `Current Cozy Topic Context: ${topicContext}\n\n` : ""
    }${
      conversationContext ? `Recent Conversation:\n${conversationContext}\n\n` : ""
    }Learner's latest message: "${message}"

Respond as Noree Vance following the Gentle Framework. Return ONLY valid JSON matching the required schema.`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(
        apiKey
      )}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: NOREE_VANCE_SYSTEM_PROMPT }],
          },
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.75,
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                reply: { type: "STRING" },
                mood: {
                  type: "STRING",
                  enum: [
                    "warm-curious",
                    "encouraging",
                    "cozy-reflective",
                    "playful-acoustic",
                  ],
                },
                correction: {
                  type: "OBJECT",
                  properties: {
                    hasCorrection: { type: "BOOLEAN" },
                    original: { type: "STRING" },
                    naturalPhrasing: { type: "STRING" },
                    alternativeCasual: { type: "STRING" },
                    gentleTip: { type: "STRING" },
                  },
                  required: [
                    "hasCorrection",
                    "original",
                    "naturalPhrasing",
                    "alternativeCasual",
                    "gentleTip",
                  ],
                },
                shadowingTarget: {
                  type: "OBJECT",
                  properties: {
                    sentence: { type: "STRING" },
                    rhythmGuide: { type: "STRING" },
                    focusPoint: { type: "STRING" },
                  },
                  required: ["sentence", "rhythmGuide", "focusPoint"],
                },
                followUpSuggestions: {
                  type: "ARRAY",
                  items: { type: "STRING" },
                },
              },
              required: [
                "reply",
                "mood",
                "correction",
                "shadowingTarget",
                "followUpSuggestions",
              ],
            },
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      const fallback = generateLocalGentleResponse(message);
      return NextResponse.json({
        ...fallback,
        source: "local-fallback-on-api-error",
      });
    }

    const data = await geminiResponse.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      const fallback = generateLocalGentleResponse(message);
      return NextResponse.json({ ...fallback, source: "local-gentle-engine" });
    }

    const parsed: NoreeTurnResponse = JSON.parse(rawText);
    return NextResponse.json({
      ...parsed,
      source: "gemini-2.5-flash",
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Something went wrong in the studio." },
      { status: 500 }
    );
  }
}
