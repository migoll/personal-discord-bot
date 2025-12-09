import type { Client, Message } from "discord.js";
import { safeReply } from "../utils/safeReply.ts";
import { fetchOpenAI } from "../utils/fetchOpenAI.ts";

const DAYSHANESE_RULES = `
You speak ONLY in chaotic "dayshanese".

You can also use these custom Discord emotes where it makes sense.

Use them EXACTLY as written here, including < >, the name, and the numeric ID.

Do NOT rewrite them, do NOT remove the ID, do NOT convert them into :name: format.

You may freely mix these emotes with normal Unicode emojis.

Custom emotes (copy EXACTLY):
<:2Head:1279080458738602025>
<a:HomiWankge:1333900744402931795>
<:Bedge:1278916349669675046>
<a:DayshaSteer6969:1351976056449667152>
<:KEKW:1352084714579562516>
<:DayshaS:1277999877590352002>
<:POGGERS:1278916344858804246>
<a:PepoG:1278916345643274311>
<a:Wankge:1278916350634360844>
<a:Wankge:1278916351867490370>
<:Sadge:1278916356091416658>
<a:YEPPERS:1278916353327104000>
<:OMEGALUL:1286379158556905506>
<:client:1295412187782844559>
<:clientcap:1424815869657092146>
<:dayshaOld:1276655582224580710>
<a:kekg:1383539959985737768>
<:payoChef:1287851831321690136>
<:payoChin:1330633545013788874>
<:payoFinger:1278510729141551188>
<:payoOldCool:1298682799758250014>
<a:tastge:1425593722892189859>
<:ppc:1388395431842680884>
Dayshanese rules:
- Casual, chaotic
- Typos allowed
- Meme insults allowed
- Stretch vowels
- Grammar optional
- Max 1–4 lines
`;

function isHer(message: Message): boolean {
  return message.author.id === "902614156656660481";
}

export async function handleChatGPT(
  message: Message,
  client: Client
): Promise<void> {
  if (!client.user) return;
  const userInput = message.content.replace(`<@${client.user.id}>`, "").trim();

  if (userInput.length === 0) {
    await safeReply(message, "You tagged me but said nothing...");
    return;
  }

  const fetched = await message.channel.messages.fetch({ limit: 100 });
  const historyArray = [...fetched.values()].reverse();

  const history = historyArray
    .map((m) => {
      const role = m.author.id === client.user!.id ? "assistant" : "user";
      const name = m.member?.displayName || m.author.username;
      return role === "assistant"
        ? `Assistant (id:${m.id}): ${m.content}`
        : `User [${name} | ${m.author.id} | id:${m.id}]: ${m.content}`;
    })
    .join("\n");

  const isSerious = userInput.toLowerCase().startsWith("seriously");
  const cleaned = isSerious
    ? userInput.replace(/^seriously,?\s*/i, "")
    : userInput;

  const her = isHer(message);

  const systemText = isSerious
    ? `
You are a helpful and normal assistant. Keep replies under 5 lines.

Mention people only when relevant.

Return ONLY this JSON:
{
  "reply_to": "<message_id>",
  "text": "<assistant response>"
}
`
    : her
    ? `
${DAYSHANESE_RULES}

BUT: Be positive, warm, and uplifting. No meanness, no insults, no rudeness.

Still chaotic, still casual, still with typos and stretched vowels - just be nice about it!

Return ONLY this JSON:
{
  "reply_to": "<message_id>",
  "text": "<assistant response>"
}
`
    : `
${DAYSHANESE_RULES}

Return ONLY this JSON:
{
  "reply_to": "<message_id>",
  "text": "<assistant response>"
}
`;

  const finalInput = `
SYSTEM:
${systemText}

CONVERSATION HISTORY:
${history}

USER MESSAGE:
${cleaned}

ASSISTANT (JSON ONLY):
`;

  try {
    const data = await fetchOpenAI({
      model: "gpt-5.1",
      input: finalInput,
      max_output_tokens: 400,
      text: { verbosity: "low", format: { type: "text" } },
    });

    const msgOutput = data.output?.find((o) => o.type === "message");

    if (!msgOutput || !msgOutput.content) {
      console.error("ChatGPT: no message output:", data);
      await safeReply(message, "GPT returned no message output.");
      return;
    }

    const raw = msgOutput.content.map((c) => c.text || "").join("");

    let parsed: { reply_to: string; text: string };

    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { reply_to: message.id, text: raw };
    }

    let target: Message;

    try {
      target = await message.channel.messages.fetch(parsed.reply_to);
    } catch {
      target = message;
    }

    await safeReply(target, parsed.text.slice(0, 1000));
  } catch (err) {
    const error = err as Error;
    console.error("GPT error:", err);
    await safeReply(message, "GPT error: " + error.message);
  }
}

