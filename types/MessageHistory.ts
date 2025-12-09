import type { Message } from "discord.js";

export interface MessageHistoryEntry {
  role: "assistant" | "user";
  name: string;
  content: string;
  messageId: string;
  userId: string;
}

export type MessageHistory = MessageHistoryEntry[];

