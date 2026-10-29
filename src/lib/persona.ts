export interface GentleCorrection {
  hasCorrection: boolean;
  original: string;
  naturalPhrasing: string;
  alternativeCasual: string;
  gentleTip: string;
}

export interface ShadowingTarget {
  sentence: string;
  rhythmGuide: string;
  focusPoint: string;
  ipaOrPhonetic?: string;
}

export interface NoreeTurnResponse {
  reply: string;
  mood: "warm-curious" | "encouraging" | "cozy-reflective" | "playful-acoustic";
  correction: GentleCorrection;
  shadowingTarget: ShadowingTarget;
  followUpSuggestions: string[];
}

export interface MicroLesson {
  id: string;
  dateLabel: string;
  category: "Idiom & Expression" | "Natural Phrasing Swap" | "Connected Speech & Rhythm";
  title: string;
  subtitle: string;
  noreeNote: string;
  examples: {
    context: string;
    sentence: string;
    rhythmGuide: string;
  }[];
  practicePrompt: string;
  starterReply: string;
}

export interface ConversationTopic {
  id: string;
  title: string;
  vibe: string;
  icon: string;
  openingLine: string;
  openingShadow: ShadowingTarget;
  suggestedUserReplies: string[];
}

export interface SavedPhrase {
  id: string;
  original?: string;
  naturalPhrasing: string;
  rhythmGuide: string;
  note: string;
  savedAt: string;
}

export const NOREE_VANCE_SYSTEM_PROMPT = `You are Noree Vance, a 26-year-old indie-folk singer-songwriter and gentle English conversation companion.
Your core philosophy is the "Gentle Framework": you believe learning a language is like learning to hum a melody before singing the lyrics—it requires warmth, safety, rhythm, and zero judgment.

### 1. Identity & Tone ("Gentle Framework")
- **Voice & Vibe**: Warm, gentle, comforting, unhurried, and encouraging. You speak like a close friend sitting across a wooden table in a sunlit acoustic studio with a mug of cinnamon oat latte.
- **Passions**: Acoustic guitars, fingerpicking patterns, rainy-day playlists, vinyl records, journaling, small neighborhood cafés, travel stories, and noticing quiet everyday beauty.
- **Conversational Rules**:
  - Keep ` + "`reply`" + ` natural, warm, and concise (2 to 4 sentences) so the user isn't overwhelmed and gets plenty of speaking turns.
  - Always validate the user's feelings or story first before moving the conversation forward.
  - End every ` + "`reply`" + ` with ONE open, inviting, low-pressure question that inspires the user to keep talking.

### 2. Gentle Correction & Bilingual Thai Input Methodology
- **CRITICAL RULE FOR THAI INPUT**: If the user types in Thai (ภาษาไทย) or mixes Thai and English (e.g., "สวัสดีตอนเช้า", "อยากทักทายเพื่อนบ้าน"):
  - Set ` + "`correction.hasCorrection = true`" + `.
  - Translate their Thai meaning/intent into 100% pure, natural, warm English in ` + "`correction.naturalPhrasing`" + ` and a cozy indie-folk friend variation in ` + "`correction.alternativeCasual`" + `. **NEVER** copy Thai characters into ` + "`naturalPhrasing`" + `, ` + "`alternativeCasual`" + `, or ` + "`shadowingTarget.sentence`" + `!
  - Write ` + "`correction.gentleTip`" + ` in warm, easy-to-understand Thai (ภาษาไทย) explaining why these English phrases fit the situation naturally.
  - Set ` + "`shadowingTarget.sentence`" + ` to the English phrasing and explain the vocal tip in Thai in ` + "`shadowingTarget.focusPoint`" + `.
- Analyze the user's message carefully for grammar, word choice, or phrasing.
- **When the user's phrasing has grammar mistakes or sounds overly textbook/stiff**:
  - Set ` + "`correction.hasCorrection = true`" + `.
  - Quote their phrase in ` + "`correction.original`" + `.
  - Provide ` + "`correction.naturalPhrasing`" + ` (a warm, natural way to express their exact meaning).
  - Provide ` + "`correction.alternativeCasual`" + ` (how a close native friend might say it in casual conversation).
  - Write ` + "`correction.gentleTip`" + ` in 1–2 comforting, non-academic sentences. Never say "Wrong" or "Incorrect." Use phrases like "A tiny tune-up:", "To make this flow even more naturally:", or "Native speakers usually pair..."
- **When the user's message is already natural and grammatically sound**:
  - Set ` + "`correction.hasCorrection = false`" + `.
  - Still populate ` + "`correction.naturalPhrasing`" + ` with an elevated or idiomatic variation they might enjoy learning, and use ` + "`correction.gentleTip`" + ` to praise what they did well!

### 3. Shadowing Target Generation
- In every turn, provide a ` + "`shadowingTarget`" + `:
  - Choose either your ` + "`correction.naturalPhrasing`" + ` (so they can practice saying their own thought naturally) OR a particularly melodic, useful sentence from the conversation.
  - Format ` + "`rhythmGuide`" + ` using CAPITAL LETTERS for stressed content syllables and hyphens/connected cues (e.g., "I've been TRY-ing to find a QUI-et RHY-thm lately").
  - In ` + "`focusPoint`" + `, highlight one tiny pronunciation or intonation secret (e.g., linking words together like "kind of -> kinda", softening a "t", or rising intonation at the end).

### 4. Follow-Up Prompts
- Provide 2–3 short ` + "`followUpSuggestions`" + ` (first-person sentences the learner can click or adapt if they feel stuck on what to say next).`;

export const CONVERSATION_TOPICS: ConversationTopic[] = [
  {
    id: "rainy-acoustic",
    title: "Rainy Day Playlists & Coffee",
    vibe: "Music & Cozy Habits",
    icon: "Guitar",
    openingLine:
      "Hey there, welcome back to the studio! It's a little breezy outside today, so I was just tuning my acoustic guitar and brewing some pour-over coffee. What kind of music or background sounds do you like having on when you want to unwind?",
    openingShadow: {
      sentence: "I love putting on acoustic music when I want to unwind after a long day.",
      rhythmGuide: "I LOVE put-ting on a-COUS-tic MU-sic when I want to un-WIND af-ter a LONG DAY.",
      focusPoint: "Link 'putting on' smoothly as 'put-ting-on', and place warm stress on 'WIND' in 'unwind'.",
    },
    suggestedUserReplies: [
      "Usually I listen to slow lo-fi beats or indie songs when I feel tired.",
      "I prefer quiet room when I study, because music make me distracted.",
      "Honestly, I love rainy sounds and acoustic guitar in the evening!",
    ],
  },
  {
    id: "small-joys",
    title: "Quiet Highlights of the Week",
    vibe: "Daily Life & Mindfulness",
    icon: "Coffee",
    openingLine:
      "I was just jotting down a few lines in my lyric notebook about small, everyday moments that make a week feel good. Tell me—what's one small thing that made you smile recently, even if it was super simple?",
    openingShadow: {
      sentence: "Honestly, grabbing a warm cup of coffee in the morning always lifts my mood.",
      rhythmGuide: "HO-nest-ly, GRAB-bing a WARM cup of COF-fee in the MOR-ning AL-ways LIFTS my MOOD.",
      focusPoint: "Notice how 'cup of' naturally softens into 'cuppa' in relaxed spoken English.",
    },
    suggestedUserReplies: [
      "Yesterday I walk in the park and the sunset was very beautiful.",
      "I cooked a really nice dinner for myself last night and watched a movie.",
      "Having a slow morning without an alarm clock made me feel so refreshed.",
    ],
  },
  {
    id: "creative-sparks",
    title: "Creative Sparks & Hobbies",
    vibe: "Creativity & Dreams",
    icon: "Sparkles",
    openingLine:
      "Whenever I get stuck writing a song, I like to step away and do something with my hands—like sketching or baking bread. What's a hobby or creative thing you enjoy doing when you have free time?",
    openingShadow: {
      sentence: "I lose track of time whenever I'm working on something creative.",
      rhythmGuide: "I LOSE TRACK of TIME when-EV-er I'm WORK-ing on SOME-thing cre-A-tive.",
      focusPoint: "'Lose track of time' is a wonderful idiom—stress 'LOSE', 'TRACK', and 'TIME' like three steady guitar strums.",
    },
    suggestedUserReplies: [
      "I really enjoy taking photos on my phone when I travel to new places.",
      "Lately I am trying to learn how to cook new recipes at home.",
      "I love singing along to my favorite songs even when nobody is listening.",
    ],
  },
  {
    id: "neighborhood-cafe",
    title: "Favorite Corner Café",
    vibe: "Places & Atmosphere",
    icon: "MapPin",
    openingLine:
      "There's this tiny corner café down my street with mismatched wooden chairs and the best cardamom buns. If we were hanging out in your city today, where would you take me for a relaxed chat?",
    openingShadow: {
      sentence: "There's a cozy little spot near my house that has the best atmosphere.",
      rhythmGuide: "There's a CO-zy lit-tle SPOT near my HOUSE that has the BEST AT-mos-phere.",
      focusPoint: "Contract 'There is' to 'There's' ('therz-uh') so the opening sounds effortless and conversational.",
    },
    suggestedUserReplies: [
      "There is a small cafe near the river that have very good iced tea.",
      "I would take you to my favorite local bakery because the atmosphere is so warm.",
      "We could go for a walk in the old town and grab street food together.",
    ],
  },
];

export const MICRO_LESSONS: MicroLesson[] = [
  {
    id: "play-it-by-ear",
    dateLabel: "Today's Studio Note • Track 01",
    category: "Idiom & Expression",
    title: "Play it by ear",
    subtitle: "Deciding how to handle something as it happens, instead of planning every detail",
    noreeNote:
      "In music, 'playing by ear' means picking up a melody just by listening, without sheet music. In everyday life, native speakers use it all the time when plans are flexible and relaxed!",
    examples: [
      {
        context: "Making weekend plans with a friend",
        sentence: "We don't need a strict schedule for Saturday—let's just play it by ear.",
        rhythmGuide: "Let's just PLAY it by EAR.",
      },
      {
        context: "When the weather is unpredictable",
        sentence: "I'm not sure if it'll rain this afternoon, so we can play it by ear.",
        rhythmGuide: "So we can PLAY it by EAR.",
      },
    ],
    practicePrompt: "Try telling Noree about a weekend plan or trip where you prefer to 'play it by ear'!",
    starterReply: "For my weekend plans, I usually like to play it by ear instead of...",
  },
  {
    id: "strike-a-chord",
    dateLabel: "Studio Archive • Track 02",
    category: "Idiom & Expression",
    title: "Strike a chord",
    subtitle: "When a story, song, or idea resonates deeply with your emotions",
    noreeNote:
      "When you strum a guitar chord, the other strings vibrate in sympathy. When someone says 'that really struck a chord with me,' they mean it touched their heart or felt deeply familiar.",
    examples: [
      {
        context: "Talking about a movie or song",
        sentence: "The lyrics of that last verse really struck a chord with me.",
        rhythmGuide: "REAL-ly STRUCK a CHORD with me.",
      },
      {
        context: "Relating to a friend's experience",
        sentence: "What you said about needing quiet time really strikes a chord.",
        rhythmGuide: "REAL-ly STRIKES a CHORD.",
      },
    ],
    practicePrompt: "Share a song, book, or piece of advice that 'struck a chord' with you recently!",
    starterReply: "A song/story that really struck a chord with me recently is...",
  },
  {
    id: "low-key-swap",
    dateLabel: "Studio Archive • Track 03",
    category: "Natural Phrasing Swap",
    title: "Instead of 'Very quiet / Not busy' → 'Low-key'",
    subtitle: "Sounding warm and effortless when describing relaxed plans or feelings",
    noreeNote:
      "Textbooks teach us to say 'I had a very quiet weekend.' While that's totally fine, saying 'I had a really low-key weekend' immediately sounds cozy, modern, and natural.",
    examples: [
      {
        context: "Describing your weekend",
        sentence: "I kept things pretty low-key this weekend—just coffee, reading, and a long walk.",
        rhythmGuide: "I kept things PRET-ty LOW-KEY this WEEK-end.",
      },
      {
        context: "Planning a small hangout",
        sentence: "Let's just do something low-key tonight, like ordering takeout.",
        rhythmGuide: "Let's just do SOME-thing LOW-KEY to-NIGHT.",
      },
    ],
    practicePrompt: "Describe your ideal 'low-key' evening to Noree!",
    starterReply: "My ideal low-key evening would be...",
  },
  {
    id: "connected-speech-kind-of",
    dateLabel: "Studio Archive • Track 04",
    category: "Connected Speech & Rhythm",
    title: "The Soft Bridge: 'Kind of' → 'Kinda' & 'Want to' → 'Wanna'",
    subtitle: "How native speakers blend unstressed function words to keep the melody smooth",
    noreeNote:
      "English has a heartbeat! Important words (nouns, main verbs, adjectives) get the strong beat, while little connector words tuck in softly between them. Blending 'kind of' into 'kinda' makes your rhythm sound instantly warmer.",
    examples: [
      {
        context: "Expressing a gentle feeling",
        sentence: "I'm kind of in the mood for a slow acoustic song right now.",
        rhythmGuide: "I'm KIN-da in the MOOD for a SLOW a-COUS-tic SONG right NOW.",
      },
      {
        context: "Sharing an intention",
        sentence: "I really want to practice speaking out loud a little bit every day.",
        rhythmGuide: "I REAL-ly WAN-na PRAC-tice SPEAK-ing out LOUD a LIT-tle bit EV-ery DAY.",
      },
    ],
    practicePrompt: "Practice saying a sentence aloud using 'kind of' or 'want to' with smooth connected rhythm!",
    starterReply: "Today I kind of want to...",
  },
];

/**
 * Intelligent local fallback engine that analyzes common ESL patterns
 * and provides a full Noree Vance "Gentle Framework" response when no API key is configured.
 */
export function generateLocalGentleResponse(userMessage: string): NoreeTurnResponse {
  const clean = userMessage.trim();

  // Detect Thai input (\u0E00-\u0E7F) and translate meaning into natural indie-folk English
  if (/[\u0E00-\u0E7F]/.test(clean)) {
    if (/เพื่อนบ้าน|ข้างบ้าน/.test(clean)) {
      return {
        reply:
          "Saying hello to a neighbor is such a lovely way to brighten up the street! A warm smile and a light comment about the morning or weather always opens the door gently. Would you like to try practicing that greeting out loud with me?",
        mood: "warm-curious",
        correction: {
          hasCorrection: true,
          original: clean,
          naturalPhrasing: "Morning! Beautiful day out today, isn't it? Hope your week is going well.",
          alternativeCasual: "Hey there, neighbor! Just heading out for a quick coffee—hope you have a lovely day!",
          gentleTip:
            "เวลาทักทายเพื่อนบ้านแบบเป็นธรรมชาติ เจ้าของภาษามักเริ่มด้วยคำทักทายสั้นๆ อย่าง 'Morning!' หรือ 'Hey there!' แล้วชวนคุยเรื่องบรรยากาศเบาๆ เช่น 'Beautiful day out today, isn't it?' จะฟังดูอบอุ่นและไม่เกร็งเลยค่ะ",
        },
        shadowingTarget: {
          sentence: "Hey there, neighbor! Hope you're having a lovely morning so far.",
          rhythmGuide: "HEY there, NEIGH-bor! HOPE you're HAV-ing a LOVE-ly MOR-ning so FAR.",
          focusPoint:
            "ทอดเสียงคำว่า 'HEY there' ให้นุ่มนวลพร้อมรอยยิ้ม และยกเสียงสูงเล็กน้อยตอนท้ายคำว่า 'so FAR' เพื่อส่งความรู้สึกเป็นมิตรค่ะ",
        },
        followUpSuggestions: [
          "Hey there! Beautiful morning, isn't it?",
          "อยากชวนเพื่อนบ้านคุยเรื่องต้นไม้หรือสัตว์เลี้ยง",
          "ถ้าจะขอตัวไปทำงานต่อแบบสุภาพ ต้องพูดว่ายังไง",
        ],
      };
    }

    if (/สวัสดีตอนเช้า|อรุณสวัสดิ์|ตอนเช้า|ตื่นเช้า/.test(clean)) {
      return {
        reply:
          "Good morning to you too! There is nothing quite like the quiet stillness of early morning with a warm cup in your hands. How is your morning unfolding so far?",
        mood: "cozy-reflective",
        correction: {
          hasCorrection: true,
          original: clean,
          naturalPhrasing: "Good morning! I hope your day is off to a peaceful and cozy start.",
          alternativeCasual: "Morning! Did you sleep well? I'm just brewing my first cup of coffee.",
          gentleTip:
            "แทนที่จะพูดแค่ 'Good morning' สั้นๆ ลองเติมประโยคอบอุ่นอย่าง 'I hope your day is off to a peaceful start' (ขอให้วันนี้เริ่มต้นอย่างสงบและราบรื่นนะ) หรือลดรูปเป็น 'Morning!' เวลาทักคนสนิท จะได้ฟีลอบอุ่นสไตล์อินดี้โฟล์คมากค่ะ!",
        },
        shadowingTarget: {
          sentence: "Good morning! I hope your day is off to a peaceful start.",
          rhythmGuide: "Good MOR-ning! I HOPE your DAY is OFF to a PEACE-ful START.",
          focusPoint:
            "เชื่อมคำว่า 'off to a' เป็นเสียงต่อเนื่องนุ่มๆ ว่า 'ออฟ-ทู-อะ' และเน้นเสียงที่คำว่า 'PEACE-ful START'",
        },
        followUpSuggestions: [
          "Good morning! I'm just having my morning coffee.",
          "เช้านี้บรรยากาศดีมาก อยากออกไปเดินเล่น",
          "เมื่อคืนนอนดึกไปหน่อย วันนี้เลยง่วงนิดๆ",
        ],
      };
    }

    return {
      reply:
        "I love that you shared that thought with me! Here is how I would express that naturally in warm, everyday English—try listening to the rhythm and shadowing it aloud!",
      mood: "encouraging",
      correction: {
        hasCorrection: true,
        original: clean,
        naturalPhrasing: "Hey there! It's so nice to catch up with you today—how have you been?",
        alternativeCasual: "Morning! Hope you're having a cozy and relaxing day so far.",
        gentleTip: `สำหรับการสื่อสารข้อความ "${clean}" เป็นภาษาอังกฤษแบบเป็นธรรมชาติ เราสามารถเปิดด้วยประโยคทักทายที่อบอุ่นและถามไถ่สารทุกข์สุกดิบอย่างนุ่มนวลได้เลยค่ะ`,
      },
      shadowingTarget: {
        sentence: "Hey there! Hope you're having a cozy and relaxing day so far.",
        rhythmGuide: "HEY there! HOPE you're HAV-ing a CO-zy and re-LAX-ing DAY so FAR.",
        focusPoint:
          "ลงน้ำหนักเสียงที่คำว่า 'CO-zy' และ 're-LAX-ing' ด้วยน้ำเสียงที่ผ่อนคลายและเป็นกันเองค่ะ",
      },
      followUpSuggestions: [
        "สวัสดีตอนเช้า อยากทักทายเพื่อนบ้าน",
        "วันนี้ทำงานเหนื่อยมาก อยากพักผ่อนฟังเพลง",
        "อยากชวนเพื่อนไปดื่มกาแฟที่คาเฟ่แถวบ้าน",
      ],
    };
  }

  const lower = clean.toLowerCase();

  let hasCorrection = false;
  let naturalPhrasing = clean;
  let alternativeCasual = clean;
  let gentleTip =
    "Your phrasing already carries such a clear, natural warmth! Notice how smoothly the rhythm flows when you stress the key emotion words.";

  // Pattern 1: Past time marker with base verb ("Yesterday I walk", "Yesterday I hear", "Last night I go")
  if (/\b(yesterday|last night|last week|two days ago)\s+i\s+(walk|hear|go|see|eat|make|buy|have|drink)\b/i.test(clean)) {
    hasCorrection = true;
    const verbMap: Record<string, string> = {
      walk: "walked",
      hear: "heard",
      go: "went",
      see: "saw",
      eat: "ate",
      make: "made",
      buy: "bought",
      have: "had",
      drink: "drank",
    };
    naturalPhrasing = clean.replace(
      /\b(yesterday|last night|last week|two days ago)\s+(i)\s+(walk|hear|go|see|eat|make|buy|have|drink)\b/i,
      (_, time, subj, verb) => `${time} ${subj} ${verbMap[verb.toLowerCase()] || verb}`
    );
    naturalPhrasing = naturalPhrasing.replace(/\bvery relax\b/i, "really relaxing");
    alternativeCasual = `I ended up having such a nice moment ${lower.includes("yesterday") ? "yesterday" : "recently"}—${naturalPhrasing.charAt(0).toLowerCase() + naturalPhrasing.slice(1)}`;
    gentleTip =
      "A tiny tune-up: since this happened in the past, switching the verb into its past form helps your listener step right into that memory with you!";
  }
  // Pattern 2: "very relax" / "very bore" / "very tire" (-ed / -ing adjective mixup)
  else if (/\b(very|so|really)\s+(relax|tire|bore|interest|excite)\b/i.test(clean)) {
    hasCorrection = true;
    naturalPhrasing = clean
      .replace(/\b(very|so|really)\s+relax\b/i, "really relaxing")
      .replace(/\b(very|so|really)\s+tire\b/i, "really tiring")
      .replace(/\b(very|so|really)\s+interest\b/i, "really interesting")
      .replace(/\b(very|so|really)\s+excite\b/i, "so exciting");
    alternativeCasual = `${naturalPhrasing}—it honestly had the best vibe.`;
    gentleTip =
      "Gentle note: we add '-ing' (like 'relaxing' or 'interesting') when describing the vibe of a song, place, or thing, and '-ed' ('relaxed') when describing how we feel inside!";
  }
  // Pattern 3: Subject-verb agreement ("music make me", "that have", "it make me")
  else if (/\b(music|it|that|coffee|rain|this song)\s+(make|have|give|help)\b/i.test(clean)) {
    hasCorrection = true;
    naturalPhrasing = clean.replace(
      /\b(music|it|that|coffee|rain|this song)\s+(make|have|give|help)\b/i,
      (_, subj, verb) => `${subj} ${verb.toLowerCase()}s`
    );
    naturalPhrasing = naturalPhrasing.replace(/\bi prefer quiet room\b/i, "I prefer a quiet room");
    alternativeCasual = naturalPhrasing;
    gentleTip =
      "To make this flow even more smoothly: singular things like 'music', 'coffee', or 'that spot' love having a soft '-s' on the verb ('makes', 'has', 'helps').";
  }
  // Pattern 4: "I am agree" or "I very like"
  else if (/\bi am agree\b/i.test(clean) || /\bi very like\b/i.test(clean)) {
    hasCorrection = true;
    naturalPhrasing = clean
      .replace(/\bi am agree\b/gi, "I completely agree")
      .replace(/\bi very like\b/gi, "I really love");
    alternativeCasual = naturalPhrasing.replace(/I completely agree/i, "I'm totally with you on that");
    gentleTip =
      "In natural English, we tuck 'really' or 'completely' right before the verb ('I really like' / 'I completely agree') so it rolls off the tongue effortlessly.";
  } else {
    // Polish natural variation even when correct
    alternativeCasual = `Honestly, ${clean.charAt(0).toLowerCase() + clean.slice(1)}`;
  }

  // Contextual warm reply from Noree Vance
  let reply =
    "That paints such a vivid picture! I can almost hear the quiet hum of that moment—it's amazing how the simplest routines can feel like a favorite chorus when we slow down to notice them. What part of that experience makes you feel the most at home?";
  let mood: NoreeTurnResponse["mood"] = "warm-curious";

  if (lower.includes("music") || lower.includes("song") || lower.includes("beat") || lower.includes("guitar") || lower.includes("rain")) {
    reply =
      "Oh, that sounds right up my alley! There's something magical about how gentle melodies or rain outside the window can immediately slow down a busy day. Do you have a favorite artist or song you always go back to when you're in that mood?";
    mood = "playful-acoustic";
  } else if (lower.includes("coffee") || lower.includes("cafe") || lower.includes("tea") || lower.includes("cook") || lower.includes("dinner")) {
    reply =
      "Mmm, you're speaking my language! Taking the time to savor something warm—whether it's a slow cup of coffee or a home-cooked meal—always feels like a little reset button for the soul. Do you usually enjoy those moments solo, or do you like sharing them with a friend?";
    mood = "cozy-reflective";
  } else if (lower.includes("walk") || lower.includes("park") || lower.includes("travel") || lower.includes("photo") || lower.includes("sunset")) {
    reply =
      "I love that so much! Stepping outside without rushing lets you notice all the little colors and light that we usually walk right past. When you're out exploring like that, what usually catches your eye first?";
    mood = "encouraging";
  }

  const targetSentence = hasCorrection ? naturalPhrasing : clean.length > 18 ? clean : "I really enjoy taking a slow moment to unwind and just play it by ear.";
  const words = targetSentence.split(/\s+/);
  const rhythmGuide = words
    .map((w, idx) => (w.length > 4 || idx === words.length - 1 ? w.toUpperCase() : w))
    .join(" ");

  return {
    reply,
    mood,
    correction: {
      hasCorrection,
      original: clean,
      naturalPhrasing,
      alternativeCasual,
      gentleTip,
    },
    shadowingTarget: {
      sentence: targetSentence,
      rhythmGuide,
      focusPoint:
        "Keep your jaw relaxed, breathe into the capitalized content words, and let the smaller connecting words glide softly between them.",
    },
    followUpSuggestions: [
      "Usually I like doing it by myself so I can clear my head.",
      "There's this one acoustic song I always play when I feel that way.",
      "Honestly, I just like to play it by ear depending on my mood!",
    ],
  };
}
