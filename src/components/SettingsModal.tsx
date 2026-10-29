"use client";

import React from "react";
import { X, KeyRound, Volume2, ShieldCheck } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onChangeApiKey: (key: string) => void;
  voiceName: string;
  onChangeVoiceName: (voice: string) => void;
  autoSpeak: boolean;
  onChangeAutoSpeak: (auto: boolean) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  apiKey,
  onChangeApiKey,
  voiceName,
  onChangeVoiceName,
  autoSpeak,
  onChangeAutoSpeak,
}: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF6F0] border border-[#E5DEC9] rounded-3xl max-w-md w-full p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#2C2523]">
              Studio Audio & AI Settings
            </h3>
            <p className="text-xs text-[#7A6B63]">
              Configure Noree Vance’s Gemini brain and voice output
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#E5DEC9]/50 text-[#5C524E]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gemini API Key Input */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-[#2C2523]">
            <KeyRound className="w-3.5 h-3.5 text-[#C86D51]" />
            Google Gemini API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => onChangeApiKey(e.target.value)}
            placeholder="AIzaSy... (Saved locally in your browser)"
            className="w-full bg-white border border-[#DFD6C7] rounded-xl px-3.5 py-2.5 text-xs text-[#2C2523] focus:outline-none focus:border-[#C86D51]"
          />
          <p className="text-[11px] text-[#7A6B63] leading-relaxed">
            Without an API key, Noree runs in <strong>Offline Studio Demo Mode</strong> with built-in grammar tune-ups and browser speech. Add a free Gemini API key from Google AI Studio to unlock live Gemini 2.5 Flash conversations & neural TTS.
          </p>
        </div>

        {/* Voice Profile Selector */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-[#2C2523]">
            <Volume2 className="w-3.5 h-3.5 text-[#C86D51]" />
            Noree’s Voice Profile
          </label>
          <select
            value={voiceName}
            onChange={(e) => onChangeVoiceName(e.target.value)}
            className="w-full bg-white border border-[#DFD6C7] rounded-xl px-3.5 py-2.5 text-xs text-[#2C2523] focus:outline-none focus:border-[#C86D51]"
          >
            <option value="Aoede">Aoede — Warm Indie-Folk & Soft Acoustic (Recommended)</option>
            <option value="Kore">Kore — Clear, Comforting & Gentle</option>
            <option value="Leda">Leda — Bright & Encouraging Friend</option>
            <option value="browser">Browser Built-in Voice (Instant / Zero API Quota)</option>
          </select>
        </div>

        {/* Auto-Speak Toggle */}
        <div className="flex items-center justify-between bg-[#F5EFE6] border border-[#E5DEC9] rounded-2xl p-3.5">
          <div>
            <div className="text-xs font-semibold text-[#2C2523]">
              Auto-Play Noree’s Voice Replies
            </div>
            <div className="text-[11px] text-[#7A6B63]">
              Automatically speak Noree’s reply aloud after each turn
            </div>
          </div>
          <input
            type="checkbox"
            checked={autoSpeak}
            onChange={(e) => onChangeAutoSpeak(e.target.checked)}
            className="w-4 h-4 accent-[#C86D51] rounded cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5 text-[11px] text-[#6B8E78]">
            <ShieldCheck className="w-4 h-4" />
            Stored locally on your device only
          </div>
          <button
            onClick={onClose}
            className="bg-[#C86D51] hover:bg-[#B35B40] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition cursor-pointer"
          >
            Save & Return to Studio
          </button>
        </div>
      </div>
    </div>
  );
}
