"use client";

import React, { useState } from "react";
import { MicroLesson } from "@/lib/persona";
import {
  Disc3,
  Volume2,
  MessageCircleHeart,
  Sparkles,
  RefreshCw,
} from "lucide-react";

interface MicroLessonCardProps {
  lessons: MicroLesson[];
  activeLesson: MicroLesson;
  onSelectLesson: (lesson: MicroLesson) => void;
  onSpeak: (text: string, rate?: number) => void;
  onPracticeInChat: (starterText: string, lessonTitle: string) => void;
  onGenerateCustomLesson: (topic: string) => Promise<void>;
  isGenerating: boolean;
}

export default function MicroLessonCard({
  lessons,
  activeLesson,
  onSelectLesson,
  onSpeak,
  onPracticeInChat,
  onGenerateCustomLesson,
  isGenerating,
}: MicroLessonCardProps) {
  const [customTopic, setCustomTopic] = useState("");

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTopic.trim()) return;
    await onGenerateCustomLesson(customTopic.trim());
    setCustomTopic("");
  };

  return (
    <div className="space-y-6">
      {/* Track Selector Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F5EFE6] border border-[#E5DEC9] rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C86D51]/15 flex items-center justify-center text-[#C86D51]">
            <Disc3 className="w-5 h-5 animate-spin" style={{ animationDuration: "10s" }} />
          </div>
          <div>
            <h2 className="font-serif text-lg font-semibold text-[#2C2523]">
              Noree’s Lyric & Liner Notes
            </h2>
            <p className="text-xs text-[#7A6B63]">
              Bite-sized daily idioms, natural swaps, and connected-speech rhythm tips
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {lessons.map((lesson, idx) => (
            <button
              key={lesson.id}
              onClick={() => onSelectLesson(lesson)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                activeLesson.id === lesson.id
                  ? "bg-[#C86D51] text-white shadow-xs"
                  : "bg-white/80 text-[#5C524E] hover:bg-white border border-[#E5DEC9]"
              }`}
            >
              Track 0{idx + 1}: {lesson.title.split("→")[0].slice(0, 20)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Liner Note Card */}
      <div className="bg-white border border-[#E5DEC9] rounded-3xl p-6 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-medium text-[#7A6B63]">
            {activeLesson.dateLabel}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#6B8E78]/15 text-[#4B6B57]">
            {activeLesson.category}
          </span>
        </div>

        <div>
          <h3 className="font-serif text-2xl font-bold text-[#2C2523] mb-1">
            “{activeLesson.title}”
          </h3>
          <p className="text-sm text-[#6E6059]">{activeLesson.subtitle}</p>
        </div>

        {/* Noree's Personal Explanation */}
        <div className="bg-[#FAF6F0] border-l-4 border-[#C86D51] rounded-r-2xl p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#C86D51] mb-1">
            Noree’s Studio Note
          </div>
          <p className="text-sm text-[#3D3532] leading-relaxed">
            {activeLesson.noreeNote}
          </p>
        </div>

        {/* Audio Examples */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#7A6B63]">
            Listen & Repeat Examples
          </h4>
          <div className="grid md:grid-cols-2 gap-3">
            {activeLesson.examples.map((ex, i) => (
              <div
                key={i}
                className="bg-[#FAF6F0] border border-[#E5DEC9] rounded-2xl p-4 flex flex-col justify-between gap-3"
              >
                <div>
                  <span className="inline-block text-[11px] font-medium text-[#8C7D75] mb-1">
                    {ex.context}
                  </span>
                  <p className="text-sm font-medium text-[#2C2523] mb-2">
                    “{ex.sentence}”
                  </p>
                  <p className="font-mono text-xs text-[#C86D51] bg-white/80 px-2.5 py-1 rounded-lg border border-[#E5DEC9]">
                    Beat: {ex.rhythmGuide}
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => onSpeak(ex.sentence, 1.0)}
                    className="flex items-center gap-1.5 text-xs font-medium bg-[#2C2523] text-white px-3 py-1.5 rounded-xl hover:bg-[#433936] transition cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> Listen (1.0x)
                  </button>
                  <button
                    onClick={() => onSpeak(ex.sentence, 0.8)}
                    className="flex items-center gap-1.5 text-xs font-medium bg-white text-[#5C524E] border border-[#DFD6C7] px-3 py-1.5 rounded-xl hover:bg-[#F5EFE6] transition cursor-pointer"
                  >
                    Slow (0.8x)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Practice Call-to-Action */}
        <div className="bg-[#6B8E78]/10 border border-[#6B8E78]/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-[#4B6B57] uppercase tracking-wider mb-0.5">
              Try It With Noree
            </div>
            <p className="text-sm text-[#2C2523]">{activeLesson.practicePrompt}</p>
          </div>
          <button
            onClick={() =>
              onPracticeInChat(activeLesson.starterReply, activeLesson.title)
            }
            className="flex items-center gap-2 bg-[#6B8E78] hover:bg-[#577864] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shrink-0 transition cursor-pointer"
          >
            <MessageCircleHeart className="w-4 h-4" />
            Practice in Chat
          </button>
        </div>
      </div>

      {/* Custom AI Micro-Lesson Generator */}
      <form
        onSubmit={handleCustomSubmit}
        className="bg-[#F5EFE6] border border-[#E5DEC9] rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-3"
      >
        <div className="flex items-center gap-2 text-xs font-medium text-[#5C524E] shrink-0">
          <Sparkles className="w-4 h-4 text-[#C86D51]" />
          Ask Noree for a custom micro-lesson on:
        </div>
        <input
          type="text"
          value={customTopic}
          onChange={(e) => setCustomTopic(e.target.value)}
          placeholder="e.g., Ordering coffee smoothly, talking about indie music, polite small talk..."
          className="flex-1 w-full bg-white border border-[#DFD6C7] rounded-xl px-3.5 py-2 text-xs text-[#2C2523] focus:outline-none focus:border-[#C86D51]"
        />
        <button
          type="submit"
          disabled={isGenerating || !customTopic.trim()}
          className="flex items-center gap-1.5 bg-[#C86D51] hover:bg-[#B35B40] text-white text-xs font-medium px-4 py-2 rounded-xl transition shrink-0 disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`} />
          {isGenerating ? "Writing Note..." : "Create Note"}
        </button>
      </form>
    </div>
  );
}
