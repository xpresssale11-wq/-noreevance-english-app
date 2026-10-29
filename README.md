# Noree Vance — Gentle Framework English Studio 🎸☕

**Noree Vance** is a standalone AI-powered English language learning application built around an indie-folk singer-songwriter persona and the **"Gentle Framework"** methodology:

1. **Free Conversation & Voice Shadowing**: Chat with Noree via voice or text about daily life, music, and creative habits. Every turn includes an **Active Shadowing Studio** card with stressed syllable beats (`CAPS`), `1.0x` vs `0.8x` slow acoustic playback, and a side-by-side **"Shadow Out Loud"** voice recorder.
2. **Gentle Corrections (`✨ A Gentle Tune-Up`)**: Soft, non-intimidating grammar and natural phrasing suggestions embedded calmly beneath your messages—showing both a **Natural Warm Phrasing** and a **Casual Indie Friend Vibe** without harsh red error marks.
3. **Daily Micro-Lessons ("Noree's Lyric & Liner Notes")**: Bite-sized daily idioms (*Play it by ear*, *Strike a chord*), natural vocabulary swaps (*Low-key*), and connected-speech rhythm tips (*Kinda / Wanna*) that you can immediately practice in conversation.

---

## 🚀 Two Ways to Run

### Option A: Instant Zero-Install Launch (Windows)
Double-click **`Start-Noree-Vance.bat`** (or run `powershell -ExecutionPolicy Bypass -File .\server.ps1`).
- Starts a local studio server at **`http://localhost:3080`** using built-in Windows PowerShell (so browser microphone & speech APIs have full `localhost` permissions) and opens the studio automatically.

### Option B: Full-Stack Next.js Development Server
If you have **Node.js (v18+)** installed:
```bash
cp .env.example .env.local
# Add your GEMINI_API_KEY to .env.local (or enter it in the in-app Settings modal)
npm install
npm run dev
```
Then open **`http://localhost:3000`**.

---

## 🔑 Configuring Gemini API & Voice Output
- Click **⚙️ API / Voice** in the top-right corner of the app to paste your `GEMINI_API_KEY` and select Noree's voice profile:
  - **Aoede** (Recommended — Warm Indie-Folk & Soft Acoustic via `gemini-2.5-flash-preview-tts`)
  - **Kore** (Clear, Comforting & Gentle)
  - **Browser Built-in Voice** (Zero-latency fallback)
- Even before adding an API key, the app runs in **Offline Studio Demo Mode** with local ESL grammar detection, gentle corrections, and voice synthesis so you can test every feature right away.
