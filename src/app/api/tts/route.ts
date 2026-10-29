import { NextRequest, NextResponse } from "next/server";

function pcmToWavBase64(pcmBase64: string, sampleRate = 24000): string {
  const pcmBuffer = Buffer.from(pcmBase64, "base64");
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const wavHeader = Buffer.alloc(44);

  wavHeader.write("RIFF", 0);
  wavHeader.writeUInt32LE(36 + pcmBuffer.length, 4);
  wavHeader.write("WAVE", 8);
  wavHeader.write("fmt ", 12);
  wavHeader.writeUInt32LE(16, 16); // PCM chunk size
  wavHeader.writeUInt16LE(1, 20); // Audio format 1 = PCM
  wavHeader.writeUInt16LE(numChannels, 22);
  wavHeader.writeUInt32LE(sampleRate, 24);
  wavHeader.writeUInt32LE(byteRate, 28);
  wavHeader.writeUInt16LE(blockAlign, 32);
  wavHeader.writeUInt16LE(bitsPerSample, 34);
  wavHeader.write("data", 36);
  wavHeader.writeUInt32LE(pcmBuffer.length, 40);

  return Buffer.concat([wavHeader, pcmBuffer]).toString("base64");
}

export async function POST(req: NextRequest) {
  try {
    const { text, voiceName = "Aoede", apiKey: clientApiKey } = await req.json();
    const apiKey = clientApiKey || process.env.GEMINI_API_KEY;

    if (!text || !apiKey || apiKey === "your_gemini_api_key_here") {
      return NextResponse.json(
        { fallbackToBrowserTTS: true, reason: "No Gemini API key provided" },
        { status: 200 }
      );
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${encodeURIComponent(
        apiKey
      )}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Speak in a warm, gentle, friendly indie-folk acoustic persona: ${text}`,
                },
              ],
            },
          ],
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: voiceName || process.env.NOREE_VOICE_NAME || "Aoede",
                },
              },
            },
          },
        }),
      }
    );

    if (!response.ok) {
      return NextResponse.json({ fallbackToBrowserTTS: true }, { status: 200 });
    }

    const data = await response.json();
    const inlineData = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData;

    if (!inlineData?.data) {
      return NextResponse.json({ fallbackToBrowserTTS: true }, { status: 200 });
    }

    const wavBase64 = pcmToWavBase64(inlineData.data, 24000);
    return NextResponse.json({
      audioDataUrl: `data:audio/wav;base64,${wavBase64}`,
      fallbackToBrowserTTS: false,
    });
  } catch {
    return NextResponse.json({ fallbackToBrowserTTS: true }, { status: 200 });
  }
}
