"use client";

import React, { useState, useRef } from "react";
import { ShadowingTarget } from "@/lib/persona";
import {
  Volume2,
  Mic,
  Square,
  Play,
  Sparkles,
  BookmarkPlus,
  Gauge,
  Check,
} from "lucide-react";

interface ShadowingDeckProps {
  target: ShadowingTarget;
  onSpeak: (text: string, rate?: number) => void;
  isSpeaking: boolean;
  onSavePhrase: (target: ShadowingTarget) => void;
}

export default function ShadowingDeck({
  target,
  onSpeak,
  isSpeaking,
  onSavePhrase,
}: ShadowingDeckProps) {
  const [speed, setSpeed] = useState<number>(1.0);
  const [isRecording, setIsRecording] = useState(false);
  const [userAudioUrl, setUserAudioUrl] = useState<string | null>(null);
  const [savedToast, setSavedToast] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const toggleSpeed = () => {
    setSpeed((prev) => (prev === 1.0 ? 0.8 : 1.0));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setUserAudioUrl(url);
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch {
      alert(
        "Microphone access is needed to record your shadowing take. Please check your browser permissions."
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSave = () => {
    onSavePhrase(target);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  // Highlight ALL-CAPS rhythm tokens in warm terracotta
  const renderRhythmTokens = (guide: string) => {
    return guide.split(" ").map((word, idx) => {
      const hasCaps = /[A-Z]{2,}/.test(word);
      return (
        <span
          key={idx}
          className={`inline-block mr-1.5 mb-1 px-1.5 py-0.5 rounded-md transition-all ${
            hasCaps
              ? "bg-[#C86D51]/15 text-[#A85035] font-semibold tracking-wide border border-[#C86D51]/30"
              : "text-[#5C524E]"
          }`}
        >
          {word}
        </span>
      );
    });
  };

  return (
    <div className="bg-[#F5EFE6] border border-[#E5DEC9] rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C86D51] animate-pulse" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#7A6B63]">
            Active Shadowing Studio
          </h3>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 text-xs font-medium text-[#6B8E78] hover:text-[#52735E] bg-white/80 px-2.5 py-1 rounded-full border border-[#6B8E78]/30 transition"
        >
          {savedToast ? (
            <>
              <Check className="w-3.5 h-3.5" /> Saved to Notebook
            </>
          ) : (
            <>
              <BookmarkPlus className="w-3.5 h-3.5" /> Save Phrase
            </>
          )}
        </button>
      </div>

      {/* Target Sentence */}
      <p className="font-serif text-lg text-[#2C2523] leading-relaxed mb-3">
        “{target.sentence}”
      </p>

      {/* Syllable & Stress Rhythm Guide */}
      <div className="bg-[#FAF6F0] border border-[#E5DEC9] rounded-xl p-3 mb-3">
        <div className="text-[11px] uppercase tracking-wider text-[#8C7D75] mb-1.5 font-medium">
          Acoustic Rhythm & Stress Beat (CAPS = Strong Beat)
        </div>
        <div className="font-mono text-sm leading-relaxed">
          {renderRhythmTokens(target.rhythmGuide)}
        </div>
      </div>

      {/* Noree's Coaching Tip */}
      <div className="flex items-start gap-2 text-xs text-[#5C524E] bg-[#6B8E78]/10 border border-[#6B8E78]/25 rounded-xl p-3 mb-4">
        <Sparkles className="w-4 h-4 text-[#6B8E78] shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-[#4B6B57]">Noree’s Vocal Cue: </span>
          {target.focusPoint}
        </div>
      </div>

      {/* Controls: Listen, Speed Toggle, and Record User Take */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => onSpeak(target.sentence, speed)}
          disabled={isSpeaking}
          className="flex items-center gap-2 bg-[#C86D51] hover:bg-[#B35B40] text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-xs transition cursor-pointer disabled:opacity-60"
        >
          <Volume2 className="w-4 h-4" />
          {isSpeaking ? "Playing Noree..." : "1. Listen to Noree"}
        </button>

        <button
          onClick={toggleSpeed}
          className="flex items-center gap-1.5 bg-white hover:bg-[#FAF6F0] text-[#5C524E] border border-[#DFD6C7] text-xs font-medium px-3 py-2.5 rounded-xl transition cursor-pointer"
          title="Toggle between 1.0x natural speed and 0.8x slow acoustic speed"
        >
          <Gauge className="w-3.5 h-3.5 text-[#C86D51]" />
          {speed === 1.0 ? "1.0x Natural" : "0.8x Slow Acoustic"}
        </button>

        {!isRecording ? (
          <button
            onClick={startRecording}
            className="flex items-center gap-1.5 bg-[#2C2523] hover:bg-[#3F3633] text-[#FAF6F0] text-xs font-medium px-4 py-2.5 rounded-xl transition cursor-pointer"
          >
            <Mic className="w-3.5 h-3.5 text-[#E89980]" />
            2. Shadow Out Loud
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex items-center gap-1.5 bg-[#D9534F] hover:bg-[#C9302C] text-white text-xs font-medium px-4 py-2.5 rounded-xl animate-pulse transition cursor-pointer"
          >
            <Square className="w-3.5 h-3.5" />
            Stop Recording
          </button>
        )}

        {userAudioUrl && (
          <button
            onClick={() => {
              const audio = new Audio(userAudioUrl);
              audio.play();
            }}
            className="flex items-center gap-1.5 bg-[#6B8E78] hover:bg-[#577864] text-white text-xs font-medium px-3.5 py-2.5 rounded-xl transition cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            Play My Take
          </button>
        )}
      </div>
    </div>
  );
}
