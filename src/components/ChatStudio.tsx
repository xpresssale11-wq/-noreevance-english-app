"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ConversationTopic,
  GentleCorrection,
  ShadowingTarget,
} from "@/lib/persona";
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  Sparkles,
  HeartHandshake,
  Headphones,
  BookmarkPlus,
  Music,
  Coffee,
  MapPin,
} from "lucide-react";

export interface ChatMessage {
  id: string;
  role: "noree" | "user";
  text: string;
  mood?: string;
  correction?: GentleCorrection;
  shadowingTarget?: ShadowingTarget;
  timestamp: string;
}

interface ChatStudioProps {
  topics: ConversationTopic[];
  activeTopic: ConversationTopic;
  onSelectTopic: (topic: ConversationTopic) => void;
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isSending: boolean;
  inputDraft: string;
  setInputDraft: (val: string) => void;
  suggestions: string[];
  onSpeak: (text: string, rate?: number) => void;
  onSelectShadowTarget: (target: ShadowingTarget) => void;
  onSaveCorrection: (correction: GentleCorrection) => void;
}

export default function ChatStudio({
  topics,
  activeTopic,
  onSelectTopic,
  messages,
  onSendMessage,
  isSending,
  inputDraft,
  setInputDraft,
  suggestions,
  onSpeak,
  onSelectShadowTarget,
  onSaveCorrection,
}: ChatStudioProps) {
  const [isListeningMic, setIsListeningMic] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const toggleVoiceInput = () => {
    if (isListeningMic) {
      recognitionRef.current?.stop();
      setIsListeningMic(false);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Your browser doesn't support live Speech-to-Text Dictation. Try Chrome or Edge, or type your message below!"
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setInputDraft(transcript);
    };

    recognition.onend = () => {
      setIsListeningMic(false);
    };

    recognition.onerror = () => {
      setIsListeningMic(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListeningMic(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputDraft.trim() || isSending) return;
    const text = inputDraft.trim();
    setInputDraft("");
    await onSendMessage(text);
  };

  const getTopicIcon = (iconName: string) => {
    switch (iconName) {
      case "Guitar":
        return <Music className="w-3.5 h-3.5" />;
      case "Coffee":
        return <Coffee className="w-3.5 h-3.5" />;
      case "MapPin":
        return <MapPin className="w-3.5 h-3.5" />;
      default:
        return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="flex flex-col bg-white border border-[#E5DEC9] rounded-3xl shadow-xs overflow-hidden h-[660px]">
      {/* Topic Bar */}
      <div className="bg-[#F5EFE6] border-b border-[#E5DEC9] px-4 py-3 flex items-center gap-2 overflow-x-auto">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7A6B63] shrink-0 mr-1">
          Cozy Topics:
        </span>
        {topics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => onSelectTopic(topic)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition cursor-pointer ${
              activeTopic.id === topic.id
                ? "bg-[#C86D51] text-white shadow-xs"
                : "bg-white/80 text-[#5C524E] hover:bg-white border border-[#E5DEC9]"
            }`}
          >
            {getTopicIcon(topic.icon)}
            {topic.title}
          </button>
        ))}
      </div>

      {/* Conversation Stream */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-gradient-to-b from-[#FAF6F0]/60 to-white">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.role === "user" ? "items-end" : "items-start"
            }`}
          >
            {/* Sender Label */}
            <div className="flex items-center gap-2 mb-1 px-1">
              {msg.role === "noree" ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-[#C86D51]" />
                  <span className="text-xs font-serif font-semibold text-[#2C2523]">
                    Noree Vance
                  </span>
                  {msg.mood && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F5EFE6] text-[#7A6B63] border border-[#E5DEC9]">
                      {msg.mood}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-xs font-medium text-[#7A6B63]">You</span>
              )}
            </div>

            {/* Message Bubble */}
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3.5 text-sm leading-relaxed ${
                msg.role === "noree"
                  ? "bg-[#FAF6F0] border border-[#E5DEC9] text-[#2C2523] rounded-tl-xs"
                  : "bg-[#2C2523] text-[#FAF6F0] rounded-tr-xs"
              }`}
            >
              <p>{msg.text}</p>

              {msg.role === "noree" && (
                <div className="flex flex-wrap items-center gap-2 mt-3 pt-2.5 border-t border-[#E5DEC9]/80">
                  <button
                    onClick={() => onSpeak(msg.text, 1.0)}
                    className="flex items-center gap-1 text-xs font-medium text-[#C86D51] hover:text-[#A65238] transition cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> Listen
                  </button>
                  <button
                    onClick={() => onSpeak(msg.text, 0.82)}
                    className="flex items-center gap-1 text-xs text-[#7A6B63] hover:text-[#2C2523] transition cursor-pointer"
                  >
                    • 0.8x Slow
                  </button>
                  {msg.shadowingTarget && (
                    <button
                      onClick={() => onSelectShadowTarget(msg.shadowingTarget!)}
                      className="flex items-center gap-1 text-xs font-medium text-[#6B8E78] hover:text-[#4E6E5A] ml-auto transition cursor-pointer"
                    >
                      <Headphones className="w-3.5 h-3.5" /> Load into Shadowing Deck
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Gentle Correction Card (Rendered beneath the user's message or Noree's response) */}
            {msg.correction && (
              <div className="max-w-[85%] mt-2.5 bg-[#6B8E78]/10 border border-[#6B8E78]/30 rounded-2xl p-4 text-xs space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-semibold text-[#4B6B57]">
                    <HeartHandshake className="w-4 h-4 text-[#6B8E78]" />
                    {msg.correction.hasCorrection
                      ? "A Gentle Tune-Up from Noree"
                      : "Natural Flow & Vibe Check"}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onSpeak(msg.correction!.naturalPhrasing, 0.95)}
                      className="flex items-center gap-1 text-[11px] bg-white/90 hover:bg-white text-[#2C2523] px-2.5 py-1 rounded-full border border-[#6B8E78]/30 transition cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3 text-[#C86D51]" /> Hear Natural
                    </button>
                    <button
                      onClick={() => onSaveCorrection(msg.correction!)}
                      className="flex items-center gap-1 text-[11px] bg-white/90 hover:bg-white text-[#4B6B57] px-2.5 py-1 rounded-full border border-[#6B8E78]/30 transition cursor-pointer"
                    >
                      <BookmarkPlus className="w-3 h-3" /> Save
                    </button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-2 pt-1">
                  <div className="bg-white/80 rounded-xl p-2.5 border border-[#6B8E78]/20">
                    <div className="text-[10px] uppercase tracking-wider text-[#6B8E78] font-semibold mb-0.5">
                      Natural Warm Phrasing
                    </div>
                    <p className="text-xs font-medium text-[#2C2523]">
                      “{msg.correction.naturalPhrasing}”
                    </p>
                  </div>
                  <div className="bg-white/80 rounded-xl p-2.5 border border-[#6B8E78]/20">
                    <div className="text-[10px] uppercase tracking-wider text-[#C86D51] font-semibold mb-0.5">
                      Casual Indie Friend Vibe
                    </div>
                    <p className="text-xs font-medium text-[#2C2523]">
                      “{msg.correction.alternativeCasual}”
                    </p>
                  </div>
                </div>

                <p className="text-[#4B5950] leading-relaxed pt-0.5">
                  <span className="font-semibold">Why it works: </span>
                  {msg.correction.gentleTip}
                </p>
              </div>
            )}
          </div>
        ))}

        {isSending && (
          <div className="flex items-center gap-2 text-xs text-[#7A6B63] italic px-2">
            <span className="w-2 h-2 rounded-full bg-[#C86D51] animate-ping" />
            Noree is strumming a chord and thinking...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Clickable Prompt Starters (Lowers speaking anxiety when stuck) */}
      {suggestions.length > 0 && (
        <div className="bg-[#FAF6F0] border-t border-[#E5DEC9] px-4 py-2.5">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#8C7D75] mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#C86D51]" /> Need a spark? Click a phrase to try or edit:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((sug, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setInputDraft(sug)}
                className="text-left text-xs bg-white hover:bg-[#F5EFE6] text-[#4A403C] border border-[#DFD6C7] rounded-xl px-3 py-1.5 transition cursor-pointer"
              >
                “{sug}”
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Voice + Text Composer */}
      <form
        onSubmit={handleSubmit}
        className="p-3.5 bg-[#F5EFE6] border-t border-[#E5DEC9] flex items-center gap-2"
      >
        <button
          type="button"
          onClick={toggleVoiceInput}
          className={`p-3 rounded-2xl transition shrink-0 cursor-pointer ${
            isListeningMic
              ? "bg-[#D9534F] text-white animate-pulse"
              : "bg-white hover:bg-[#FAF6F0] text-[#C86D51] border border-[#DFD6C7]"
          }`}
          title="Speak to Noree using your microphone"
        >
          {isListeningMic ? (
            <MicOff className="w-5 h-5" />
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </button>

        <input
          type="text"
          value={inputDraft}
          onChange={(e) => setInputDraft(e.target.value)}
          placeholder={
            isListeningMic
              ? "Listening to your voice... speak naturally!"
              : "Chat with Noree in English (or tap the mic to speak)..."
          }
          className="flex-1 bg-white border border-[#DFD6C7] rounded-2xl px-4 py-3 text-sm text-[#2C2523] placeholder:text-[#9A8B82] focus:outline-none focus:border-[#C86D51]"
        />

        <button
          type="submit"
          disabled={!inputDraft.trim() || isSending}
          className="bg-[#C86D51] hover:bg-[#B35B40] disabled:opacity-50 text-white px-5 py-3 rounded-2xl font-medium text-xs flex items-center gap-1.5 transition shrink-0 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          Send
        </button>
      </form>
    </div>
  );
}
