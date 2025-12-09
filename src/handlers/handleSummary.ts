import type { Message } from "discord.js";
import { safeReply } from "../utils/safeReply.js";
import { fetchOpenAI } from "../utils/fetchOpenAI.js";

export async function handleSummary(message: Message): Promise<void> {
  const isSerious = message.content.toLowerCase().startsWith("seriously");
  const cleaned = isSerious
    ? message.content.replace(/^seriously,?\s*/i, "")
    : message.content;

  const systemText = isSerious
    ? `Summarize normally under 4 lines.`
    : `Chaotic dayshanese summary. Max 1–2 lines.`;

  const finalInput = `
SYSTEM:
${systemText}

TEXT:
${cleaned}

SUMMARY:
`;

  try {
    const data = await fetchOpenAI({
      model: "gpt-5.1",
      input: finalInput,
      max_output_tokens: 150,
      text: { verbosity: "low", format: { type: "text" } },
    });

    const msgOutput = data.output?.find((o) => o.type === "message");

    if (!msgOutput || !msgOutput.content) {
      console.error("Summary: no message output:", data);
      return;
    }

    const summary = msgOutput.content.map((c) => c.text || "").join("");
    await safeReply(message, `eer we go with la summarize:\n${summary}`);
  } catch (err) {
    console.error("Summary error:", err);
  }
}

