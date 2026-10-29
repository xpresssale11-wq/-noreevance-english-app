import { NextRequest, NextResponse } from "next/server";
import { MICRO_LESSONS } from "@/lib/persona";

export async function GET() {
  return NextResponse.json({ lessons: MICRO_LESSONS });
}

export async function POST(req: NextRequest) {
  try {
    const { customTopic = "coffee shop small talk", apiKey: clientApiKey } = await req.json();
    const apiKey = clientApiKey || process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return NextResponse.json({
        lesson: MICRO_LESSONS[0],
        source: "seed-library",
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(
        apiKey
      )}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `You are Noree Vance, an indie-folk singer-songwriter and gentle English coach. Create a bite-sized Micro-Lesson about: "${customTopic}". Return valid JSON matching the schema.`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                id: { type: "STRING" },
                dateLabel: { type: "STRING" },
                category: {
                  type: "STRING",
                  enum: [
                    "Idiom & Expression",
                    "Natural Phrasing Swap",
                    "Connected Speech & Rhythm",
                  ],
                },
                title: { type: "STRING" },
                subtitle: { type: "STRING" },
                noreeNote: { type: "STRING" },
                examples: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      context: { type: "STRING" },
                      sentence: { type: "STRING" },
                      rhythmGuide: { type: "STRING" },
                    },
                    required: ["context", "sentence", "rhythmGuide"],
                  },
                },
                practicePrompt: { type: "STRING" },
                starterReply: { type: "STRING" },
              },
              required: [
                "id",
                "dateLabel",
                "category",
                "title",
                "subtitle",
                "noreeNote",
                "examples",
                "practicePrompt",
                "starterReply",
              ],
            },
          },
        }),
      }
    );

    if (!response.ok) {
      return NextResponse.json({ lesson: MICRO_LESSONS[0], source: "seed-library" });
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const lesson = rawText ? JSON.parse(rawText) : MICRO_LESSONS[0];

    return NextResponse.json({ lesson, source: "gemini-2.5-flash" });
  } catch {
    return NextResponse.json({ lesson: MICRO_LESSONS[0], source: "seed-library" });
  }
}
