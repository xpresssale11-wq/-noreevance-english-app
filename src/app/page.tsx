"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  CONVERSATION_TOPICS,
  MICRO_LESSONS,
  ConversationTopic,
  MicroLesson,
  ShadowingTarget,
  GentleCorrection,
  SavedPhrase,
} from "@/lib/persona";
import ChatStudio, { ChatMessage } from "@/components/ChatStudio";
import ShadowingDeck from "@/components/ShadowingDeck";
import MicroLessonCard from "@/components/MicroLessonCard";
import SettingsModal from "@/components/SettingsModal";
import { AppLanguage, UI_TRANSLATIONS } from "@/lib/i18n";
import {
  Music2,
  MessageCircleHeart,
  Disc3,
  BookOpenCheck,
  Settings,
  Volume2,
  Trash2,
  Sparkles,
  Flame,
  Radio,
} from "lucide-react";

export default function NoreeVanceStudioPage() {
  const [lang, setLang] = useState<AppLanguage>("th");
  const t = UI_TRANSLATIONS[lang];
  const [activeTab, setActiveTab] = useState<"studio" | "lessons" | "notebook">("studio");
  const [activeTopic, setActiveTopic] = useState<ConversationTopic>(CONVERSATION_TOPICS[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      role: "noree",
      text: CONVERSATION_TOPICS[0].openingLine,
      mood: "warm-curious",
      shadowingTarget: CONVERSATION_TOPICS[0].openingShadow,
      timestamp: "Just now",
    },
  ]);
  const [inputDraft, setInputDraft] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>(
    CONVERSATION_TOPICS[0].suggestedUserReplies
  );
  const [isSending, setIsSending] = useState(false);

  // Active Shadowing Target
  const [shadowTarget, setShadowTarget] = useState<ShadowingTarget>(
    CONVERSATION_TOPICS[0].openingShadow
  );

  // Micro-Lessons State
  const [lessons, setLessons] = useState<MicroLesson[]>(MICRO_LESSONS);
  const [activeLesson, setActiveLesson] = useState<MicroLesson>(MICRO_LESSONS[0]);
  const [isGeneratingLesson, setIsGeneratingLesson] = useState(false);

  // Saved Phrasebook State
  const [savedPhrases, setSavedPhrases] = useState<SavedPhrase[]>([
    {
      id: "seed-1",
      original: "Yesterday I hear a very relax song.",
      naturalPhrasing: "Yesterday I heard a really relaxing song at the café.",
      rhythmGuide: "YES-ter-day I HEARD a REAL-ly re-LAX-ing SONG at the ca-FÉ.",
      note: "Use '-ing' ('relaxing') to describe the vibe of a song or place.",
      savedAt: "Studio Starter Note",
    },
  ]);

  // Settings & Voice State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [voiceName, setVoiceName] = useState("Aoede");
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Load persisted settings & notebook from localStorage
  useEffect(() => {
    try {
      const savedKey = localStorage.getItem("noree_gemini_api_key");
      const savedVoice = localStorage.getItem("noree_voice_name");
      const savedNotebook = localStorage.getItem("noree_saved_phrases");
      const savedLang = localStorage.getItem("noree_ui_lang") as AppLanguage | null;
      if (savedKey) setApiKey(savedKey);
      if (savedVoice) setVoiceName(savedVoice);
      if (savedNotebook) setSavedPhrases(JSON.parse(savedNotebook));
      if (savedLang === "th" || savedLang === "en") setLang(savedLang);
    } catch {
      // ignore storage errors
    }
  }, []);

  const handleChangeLang = (nextLang: AppLanguage) => {
    setLang(nextLang);
    playStudioClip(nextLang === "th" ? "/audio/greeting_th.wav" : "/audio/greeting.wav", 1.0);
    try {
      localStorage.setItem("noree_ui_lang", nextLang);
    } catch {
      // ignore
    }
  };

  const handleSaveApiKey = (val: string) => {
    setApiKey(val);
    try {
      localStorage.setItem("noree_gemini_api_key", val);
    } catch {
      // ignore
    }
  };

  const handleSaveVoiceName = (val: string) => {
    setVoiceName(val);
    try {
      localStorage.setItem("noree_voice_name", val);
    } catch {
      // ignore
    }
  };

  // Top Soundboard Special WAV Player (for /audio/*.wav buttons at the top)
  const playStudioClip = useCallback((audioPath: string, rate = 1.0) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(true);
    const audio = new Audio(audioPath);
    audio.playbackRate = rate;
    audio.onended = () => setIsSpeaking(false);
    audio.onerror = () => setIsSpeaking(false);
    audio.play().catch(() => setIsSpeaking(false));
  }, []);

  // Card & Content Speak Function (Uses Web Speech API window.speechSynthesis to read the exact English text on Shadowing Studio, Micro-Lessons, and Chat cards)
  const speakText = useCallback(
    async (text: string, rate = 1.0) => {
      if (!text) return;
      setIsSpeaking(true);

      const speakWithBrowser = () => {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = "en-US";
          utterance.rate = rate;
          utterance.pitch = 1.04;
          const voices = window.speechSynthesis.getVoices();
          const preferred = voices.find(
            (v) =>
              v.lang.startsWith("en") &&
              (v.name.includes("Natural") ||
                v.name.includes("Aria") ||
                v.name.includes("Zira") ||
                v.name.includes("Samantha") ||
                v.name.includes("Google US English"))
          );
          if (preferred) utterance.voice = preferred;
          utterance.onend = () => setIsSpeaking(false);
          utterance.onerror = () => setIsSpeaking(false);
          window.speechSynthesis.speak(utterance);
        } else {
          setIsSpeaking(false);
        }
      };

      if (voiceName === "browser" || !apiKey) {
        speakWithBrowser();
        return;
      }

      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, voiceName, apiKey }),
        });
        const data = await res.json();
        if (data.audioDataUrl && !data.fallbackToBrowserTTS) {
          const audio = new Audio(data.audioDataUrl);
          audio.playbackRate = rate;
          audio.onended = () => setIsSpeaking(false);
          audio.onerror = () => speakWithBrowser();
          await audio.play();
        } else {
          speakWithBrowser();
        }
      } catch {
        speakWithBrowser();
      }
    },
    [apiKey, voiceName]
  );

  // Switch Conversation Topic
  const handleSelectTopic = (topic: ConversationTopic) => {
    setActiveTopic(topic);
    setMessages([
      {
        id: `topic-${topic.id}-${Date.now()}`,
        role: "noree",
        text: topic.openingLine,
        mood: "warm-curious",
        shadowingTarget: topic.openingShadow,
        timestamp: "Just now",
      },
    ]);
    setShadowTarget(topic.openingShadow);
    setSuggestions(topic.suggestedUserReplies);
    if (autoSpeak) {
      speakText(topic.openingLine, 1.0);
    }
  };

  // Send User Message to Noree Vance
  const handleSendMessage = async (userText: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: userText,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: messages.map((m) => ({ role: m.role, text: m.text })),
          topicContext: `${activeTopic.title} (${activeTopic.vibe})`,
          apiKey,
        }),
      });

      const data = await res.json();

      // Attach Gentle Correction to user message and append Noree's reply
      setMessages((prev) => {
        const updated = prev.map((m) =>
          m.id === userMsg.id ? { ...m, correction: data.correction } : m
        );
        return [
          ...updated,
          {
            id: `noree-${Date.now()}`,
            role: "noree",
            text: data.reply,
            mood: data.mood,
            shadowingTarget: data.shadowingTarget,
            timestamp: "Just now",
          },
        ];
      });

      if (data.shadowingTarget) {
        setShadowTarget(data.shadowingTarget);
      }
      if (Array.isArray(data.followUpSuggestions) && data.followUpSuggestions.length > 0) {
        setSuggestions(data.followUpSuggestions);
      }
      if (autoSpeak && data.reply) {
        speakText(data.reply, 1.0);
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setIsSending(false);
    }
  };

  // Save Phrase from Shadowing Deck or Gentle Correction Card
  const persistPhrases = (next: SavedPhrase[]) => {
    setSavedPhrases(next);
    try {
      localStorage.setItem("noree_saved_phrases", JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const handleSaveFromShadow = (target: ShadowingTarget) => {
    const entry: SavedPhrase = {
      id: `saved-${Date.now()}`,
      naturalPhrasing: target.sentence,
      rhythmGuide: target.rhythmGuide,
      note: target.focusPoint,
      savedAt: new Date().toLocaleDateString(),
    };
    persistPhrases([entry, ...savedPhrases]);
  };

  const handleSaveFromCorrection = (corr: GentleCorrection) => {
    const entry: SavedPhrase = {
      id: `saved-${Date.now()}`,
      original: corr.original,
      naturalPhrasing: corr.naturalPhrasing,
      rhythmGuide: corr.naturalPhrasing,
      note: corr.gentleTip,
      savedAt: new Date().toLocaleDateString(),
    };
    persistPhrases([entry, ...savedPhrases]);
  };

  const handleDeleteSavedPhrase = (id: string) => {
    persistPhrases(savedPhrases.filter((p) => p.id !== id));
  };

  // Practice Micro-Lesson directly in Chat
  const handlePracticeLessonInChat = (starterText: string, lessonTitle: string) => {
    setActiveTab("studio");
    setInputDraft(starterText);
    setMessages((prev) => [
      ...prev,
      {
        id: `noree-lesson-${Date.now()}`,
        role: "noree",
        text: `Let's try out "${lessonTitle}" together! Finish the sentence in the chat box below however feels true to your life—no pressure at all.`,
        mood: "encouraging",
        timestamp: "Just now",
      },
    ]);
  };

  // Generate Custom Micro-Lesson
  const handleGenerateCustomLesson = async (topic: string) => {
    setIsGeneratingLesson(true);
    try {
      const res = await fetch("/api/micro-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customTopic: topic, apiKey }),
      });
      const data = await res.json();
      if (data.lesson) {
        const customLesson: MicroLesson = {
          ...data.lesson,
          id: `custom-${Date.now()}`,
          dateLabel: "Custom Studio Note",
        };
        setLessons((prev) => [customLesson, ...prev]);
        setActiveLesson(customLesson);
      }
    } finally {
      setIsGeneratingLesson(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Studio Header */}
      <header className="sticky top-0 z-30 bg-[#FAF6F0]/90 backdrop-blur-md border-b border-[#E5DEC9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          {/* Brand Persona Identity */}
          <div className="flex items-center gap-3.5">
            <div className="relative shrink-0">
              <img
                src="/noree-logo.png"
                alt="Noree Vance"
                className="w-12 h-12 rounded-2xl object-cover border-2 border-[#E5DEC9] ring-2 ring-[#C86D51]/25 shadow-xs bg-[#F2ECE1]"
              />
              <span
                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#6B8E78] border-2 border-[#FAF6F0]"
                title="Noree Vance is in the studio"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl font-bold tracking-tight text-[#2C2523]">
                  Noree Vance
                </h1>
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#F2ECE1] text-[#7A6B63] border border-[#E5DEC9]">
                  {t.studioBadge}
                </span>
              </div>
              <p className="text-xs text-[#7A6B63]">
                {t.studioSubtitle}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1.5 bg-[#F2ECE1] p-1.5 rounded-2xl border border-[#E5DEC9]">
            <button
              onClick={() => setActiveTab("studio")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === "studio"
                  ? "bg-white text-[#2C2523] shadow-2xs"
                  : "text-[#6E6059] hover:text-[#2C2523]"
              }`}
            >
              <MessageCircleHeart className="w-4 h-4 text-[#C86D51]" />
              {t.tabStudio}
            </button>
            <button
              onClick={() => setActiveTab("lessons")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === "lessons"
                  ? "bg-white text-[#2C2523] shadow-2xs"
                  : "text-[#6E6059] hover:text-[#2C2523]"
              }`}
            >
              <Disc3 className="w-4 h-4 text-[#6B8E78]" />
              {t.tabLessons}
            </button>
            <button
              onClick={() => setActiveTab("notebook")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === "notebook"
                  ? "bg-white text-[#2C2523] shadow-2xs"
                  : "text-[#6E6059] hover:text-[#2C2523]"
              }`}
            >
              <BookOpenCheck className="w-4 h-4 text-[#C86D51]" />
              {t.tabNotebook} ({savedPhrases.length})
            </button>
          </nav>

          {/* Social Links, Language Switcher (TH / EN) & Settings Button */}
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="https://www.youtube.com/@noreevance"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#FF0000]/10 hover:bg-[#FF0000] text-[#B81D13] hover:text-white border border-[#FF0000]/25 text-xs font-semibold transition"
              title="Noree Vance Official YouTube (@noreevance)"
            >
              <span>▶ YouTube</span>
            </a>

            <a
              href="https://www.facebook.com/noreevance.official"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2] text-[#1558B0] hover:text-white border border-[#1877F2]/25 text-xs font-semibold transition"
              title="Noree Vance Official Facebook Fanpage"
            >
              <span>f Facebook</span>
            </a>

            <div
              className="flex items-center bg-[#F2ECE1] p-1 rounded-xl border border-[#DFD6C7]"
              title="Switch Interface Language / สลับภาษา"
            >
              <button
                onClick={() => handleChangeLang("th")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  lang === "th"
                    ? "bg-[#C86D51] text-white shadow-2xs"
                    : "text-[#6E6059] hover:text-[#2C2523]"
                }`}
              >
                🇹🇭 ไทย
              </button>
              <button
                onClick={() => handleChangeLang("en")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  lang === "en"
                    ? "bg-[#C86D51] text-white shadow-2xs"
                    : "text-[#6E6059] hover:text-[#2C2523]"
                }`}
              >
                🇬🇧 EN
              </button>
            </div>

            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5EFE6] border border-[#E5DEC9] text-xs text-[#5C524E]">
              <Flame className="w-3.5 h-3.5 text-[#C86D51]" />
              <span>{t.streakLabel}</span>
            </div>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#F5EFE6] border border-[#DFD6C7] text-xs font-medium text-[#2C2523] transition cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-[#C86D51]" />
              {apiKey ? t.btnSettingsLive : t.btnSettingsConfig}
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Noree's Studio Voice Clips Soundboard */}
        <div className="bg-[#F5EFE6] border border-[#E5DEC9] rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C86D51] animate-pulse" />
            <span className="text-xs font-semibold text-[#2C2523]">
              {lang === "th" ? "🎙️ เสียงพูดของโนรี (Noree’s Voice Clips):" : "🎙️ Noree’s Studio Voice Clips:"}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "greeting", path: "/audio/greeting.wav", label: lang === "th" ? "👋 เสียงต้อนรับ (EN)" : "👋 Welcome (EN)" },
              { id: "greeting_th", path: "/audio/greeting_th.wav", label: lang === "th" ? "🙏 เสียงต้อนรับ (ไทย)" : "🙏 Welcome (TH)" },
              { id: "neighbor", path: "/audio/neighbor.wav", label: lang === "th" ? "🏡 ทักทายเพื่อนบ้าน" : "🏡 Neighbor Greeting" },
              { id: "gentle", path: "/audio/gentle.wav", label: lang === "th" ? "✨ แนะนำแบบอ่อนโยน" : "✨ Gentle Tune-Up" },
              { id: "chat", path: "/audio/chat.wav", label: lang === "th" ? "☕ ชวนคุยสบายๆ" : "☕ Cozy Chat" },
              { id: "closing", path: "/audio/closing.wav", label: lang === "th" ? "🌙 เสียงบอกลา" : "🌙 Warm Goodbye" },
            ].map((clip) => (
              <button
                key={clip.id}
                onClick={() => playStudioClip(clip.path, 1.0)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-[#FAF6F0] text-[#2C2523] border border-[#DFD6C7] transition cursor-pointer"
              >
                {clip.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "studio" && (
          <div className="grid lg:grid-cols-12 gap-6 items-start">
            {/* Left 7 Columns: Free Conversation & Gentle Corrections */}
            <div className="lg:col-span-7">
              <ChatStudio
                topics={CONVERSATION_TOPICS}
                activeTopic={activeTopic}
                onSelectTopic={handleSelectTopic}
                messages={messages}
                onSendMessage={handleSendMessage}
                isSending={isSending}
                inputDraft={inputDraft}
                setInputDraft={setInputDraft}
                suggestions={suggestions}
                onSpeak={speakText}
                onSelectShadowTarget={(t) => setShadowTarget(t)}
                onSaveCorrection={handleSaveFromCorrection}
              />
            </div>

            {/* Right 5 Columns: Active Shadowing Studio + Today's Bite-Sized Tip */}
            <div className="lg:col-span-5 space-y-5">
              <ShadowingDeck
                target={shadowTarget}
                onSpeak={speakText}
                isSpeaking={isSpeaking}
                onSavePhrase={handleSaveFromShadow}
              />

              {/* Mini Daily Micro-Lesson Preview Card */}
              <div className="bg-white border border-[#E5DEC9] rounded-2xl p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#6B8E78]">
                    <Radio className="w-3.5 h-3.5" /> Today’s Micro-Lesson
                  </span>
                  <button
                    onClick={() => setActiveTab("lessons")}
                    className="text-xs font-medium text-[#C86D51] hover:underline cursor-pointer"
                  >
                    Open Full Liner Notes →
                  </button>
                </div>

                <div>
                  <h4 className="font-serif text-base font-bold text-[#2C2523]">
                    “{activeLesson.title}”
                  </h4>
                  <p className="text-xs text-[#6E6059] mt-0.5">
                    {activeLesson.subtitle}
                  </p>
                </div>

                <div className="bg-[#FAF6F0] border border-[#E5DEC9] rounded-xl p-3 text-xs text-[#3D3532]">
                  “{activeLesson.examples[0]?.sentence}”
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() =>
                      speakText(activeLesson.examples[0]?.sentence || activeLesson.title, 1.0)
                    }
                    className="flex items-center gap-1.5 text-xs font-medium bg-[#F5EFE6] hover:bg-[#E5DEC9]/60 text-[#2C2523] px-3 py-1.5 rounded-xl transition cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-[#C86D51]" /> Hear Example
                  </button>
                  <button
                    onClick={() =>
                      handlePracticeLessonInChat(
                        activeLesson.starterReply,
                        activeLesson.title
                      )
                    }
                    className="flex items-center gap-1.5 text-xs font-medium bg-[#6B8E78]/15 hover:bg-[#6B8E78]/25 text-[#4B6B57] px-3 py-1.5 rounded-xl transition cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> {t.useInConversationBtn}
                  </button>
                </div>
              </div>

              {/* Official Social Media & Music Channel Card */}
              <div className="bg-gradient-to-br from-[#F5EFE6] to-[#FAF6F0] border border-[#E5DEC9] rounded-2xl p-5 shadow-2xs space-y-3.5">
                <div className="flex items-center gap-3">
                  <img
                    src="/noree-logo.png"
                    alt="Noree Vance"
                    className="w-10 h-10 rounded-xl object-cover border border-[#C86D51]/30 shrink-0"
                  />
                  <div>
                    <h4 className="font-serif text-sm font-bold text-[#2C2523]">
                      {lang === "th"
                        ? "🎸 ติดตามผลงานเพลงและเพจของ Noree Vance"
                        : "🎸 Follow Noree Vance’s Music & Studio"}
                    </h4>
                    <p className="text-xs text-[#7A6B63]">
                      {lang === "th"
                        ? "แวะไปฟังเพลงอินดี้โฟล์คอบอุ่นๆ และติดตามเรื่องราวใหม่ๆ ได้ที่ช่องทางทางการ"
                        : "Listen to original indie-folk songs and stay connected on official channels"}
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-2.5">
                  <a
                    href="https://www.youtube.com/@noreevance"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#FF0000] hover:bg-[#D90000] text-white text-xs font-semibold shadow-2xs transition"
                  >
                    <span>▶ {lang === "th" ? "YouTube (@noreevance)" : "YouTube Channel"}</span>
                  </a>

                  <a
                    href="https://www.facebook.com/noreevance.official"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#1877F2] hover:bg-[#1464CC] text-white text-xs font-semibold shadow-2xs transition"
                  >
                    <span>f {lang === "th" ? "Facebook Fanpage" : "Official Facebook"}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "lessons" && (
          <MicroLessonCard
            lessons={lessons}
            activeLesson={activeLesson}
            onSelectLesson={setActiveLesson}
            onSpeak={speakText}
            onPracticeInChat={handlePracticeLessonInChat}
            onGenerateCustomLesson={handleGenerateCustomLesson}
            isGenerating={isGeneratingLesson}
          />
        )}

        {activeTab === "notebook" && (
          <div className="space-y-4">
            <div className="bg-[#F5EFE6] border border-[#E5DEC9] rounded-2xl p-5 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#2C2523]">
                  My Studio Phrasebook & Gentle Tune-Ups
                </h2>
                <p className="text-xs text-[#7A6B63]">
                  Review natural phrasings and shadowing rhythms you’ve collected with Noree Vance
                </p>
              </div>
            </div>

            {savedPhrases.length === 0 ? (
              <div className="bg-white border border-[#E5DEC9] rounded-3xl p-10 text-center space-y-2">
                <p className="font-serif text-base text-[#2C2523]">
                  Your Studio Phrasebook is waiting for its first lyric!
                </p>
                <p className="text-xs text-[#7A6B63]">
                  Click “Save” on any Gentle Correction card or Shadowing Target during your chats with Noree.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {savedPhrases.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-[#E5DEC9] rounded-2xl p-5 shadow-2xs flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-[#8C7D75]">
                        <span>{item.savedAt}</span>
                        <button
                          onClick={() => handleDeleteSavedPhrase(item.id)}
                          className="text-[#9A8B82] hover:text-[#D9534F] transition cursor-pointer"
                          title="Remove from Phrasebook"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.original && (
                        <p className="text-xs text-[#8C7D75] line-through">
                          “{item.original}”
                        </p>
                      )}

                      <p className="font-serif text-base font-semibold text-[#2C2523]">
                        “{item.naturalPhrasing}”
                      </p>

                      <p className="text-xs text-[#4B6B57] bg-[#6B8E78]/10 border border-[#6B8E78]/25 rounded-xl p-2.5">
                        {item.note}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => speakText(item.naturalPhrasing, 1.0)}
                        className="flex items-center gap-1.5 text-xs font-medium bg-[#C86D51] text-white px-3 py-1.5 rounded-xl hover:bg-[#B35B40] transition cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" /> Listen (1.0x)
                      </button>
                      <button
                        onClick={() => speakText(item.naturalPhrasing, 0.8)}
                        className="flex items-center gap-1.5 text-xs font-medium bg-[#FAF6F0] text-[#5C524E] border border-[#E5DEC9] px-3 py-1.5 rounded-xl hover:bg-[#F2ECE1] transition cursor-pointer"
                      >
                        Slow (0.8x)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onChangeApiKey={handleSaveApiKey}
        voiceName={voiceName}
        onChangeVoiceName={handleSaveVoiceName}
        autoSpeak={autoSpeak}
        onChangeAutoSpeak={setAutoSpeak}
      />
    </div>
  );
}
