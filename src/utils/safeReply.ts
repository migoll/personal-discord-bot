import type { Message } from "discord.js";

export async function safeReply(
  message: Message,
  text: string
): Promise<Message | void> {
  try {
    if (
      !message.guild?.members.me?.permissionsIn(message.channel)?.has("SendMessages")
    ) {
      console.warn("Bot cannot send messages in this channel.");
      return;
    }
    return await message.reply(text);
  } catch (err) {
    const error = err as { code?: string; message?: string };
    console.warn("Reply failed:", error.code, error.message);
  }
}

