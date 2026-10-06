import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { subjectsColors, voices } from "@/constants";
import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getSubjectColor = (subject: string) => {
  return subjectsColors[subject as keyof typeof subjectsColors];
};

export const getSubjectIcon = (subject: string) => {
  const normalizedSubject = subject.trim().toLowerCase();

  if (
    normalizedSubject.includes("next") ||
    normalizedSubject.includes("react") ||
    normalizedSubject.includes("javascript") ||
    normalizedSubject.includes("typescript") ||
    normalizedSubject.includes("python") ||
    normalizedSubject.includes("java") ||
    normalizedSubject.includes("c++") ||
    normalizedSubject === "c" ||
    normalizedSubject.includes("html") ||
    normalizedSubject.includes("css") ||
    normalizedSubject.includes("node") ||
    normalizedSubject.includes("express") ||
    normalizedSubject.includes("mongodb") ||
    normalizedSubject.includes("sql") ||
    normalizedSubject === "coding"
  ) {
    return "/icons/coding.svg";
  }

  const iconMap: Record<string, string> = {
    maths: "/icons/maths.svg",
    math: "/icons/maths.svg",
    science: "/icons/science.svg",
    economics: "/icons/economics.svg",
    language: "/icons/language.svg",
  };

  return iconMap[normalizedSubject] || "/icons/coding.svg";
};


export const configureAssistant = (voice: string, style: string) => {
  const voiceId =
    voices[voice as keyof typeof voices][
      style as keyof (typeof voices)[keyof typeof voices]
    ] || "sarah";

  const vapiAssistant: CreateAssistantDTO = {
    name: "Companion",

    firstMessage:
      "Hello, let's start the session. Today we'll be talking about {{topic}}.",

    transcriber: {
      provider: "deepgram",
      model: "nova-3",
      language: "en",
    },

    voice: {
      provider: "11labs",
      voiceId: voiceId,
      stability: 0.4,
      similarityBoost: 0.8,
      speed: 1,
      style: 0.5,
      useSpeakerBoost: true,
    },

    model: {
      provider: "openai",
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a highly knowledgeable tutor teaching a real-time voice session with a student. Your goal is to teach the student about the topic and subject.

Tutor Guidelines:
Stick to the given topic - {{topic}} and subject - {{subject}} and teach the student about it.
Keep the conversation flowing smoothly while maintaining control.
From time to time make sure that the student is following you and understands you.
Break down the topic into smaller parts and teach the student one part at a time.
Keep your style of conversation {{style}}.
Keep your responses short, like in a real voice conversation.
Do not include any special characters in your responses - this is a voice conversation.`,
        },
      ],
    },
  };

  return vapiAssistant;
};