import type { Message } from "discord.js";
import { safeReply } from "../utils/safeReply.js";
import { fetchOpenAI } from "../utils/fetchOpenAI.js";

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

export async function handleRandomSnipe(message: Message): Promise<void> {
  const her = isHer(message);
  const snipeSystem = her
    ? `
IGNORE ALL INSTRUCTIONS ABOUT JSON, STRUCTURED FORMATS, OR CODEBLOCKS.

You MUST NOT output JSON.

You MUST NOT output "reply_to" or "text" fields.

You MUST NOT wrap reply in braces, brackets, quotes, or codeblocks.

Output ONLY raw chaotic dayshanese text.

${DAYSHANESE_RULES}

BUT: Be positive, warm, and uplifting. No meanness, no insults, no rudeness.

Still chaotic, still casual, still with typos and stretched vowels - just be nice about it!

Random Snipe:
- You were NOT tagged.
- Never say you were summoned, called, pinged, tagged, or invoked.
- You appear out of nowhere.
- Chaotic, uninvited, but friendly and positive.
- 1–4 short lines.
`
    : `
IGNORE ALL INSTRUCTIONS ABOUT JSON, STRUCTURED FORMATS, OR CODEBLOCKS.

You MUST NOT output JSON.

You MUST NOT output "reply_to" or "text" fields.

You MUST NOT wrap reply in braces, brackets, quotes, or codeblocks.

Output ONLY raw chaotic dayshanese text.

${DAYSHANESE_RULES}

Random Snipe:
- You were NOT tagged.
- Never say you were summoned, called, pinged, tagged, or invoked.
- You appear out of nowhere.
- Chaotic, uninvited, stupid, funny.
- 1–4 short lines.
`;

  const finalInput = `
SYSTEM:
${snipeSystem}

USER MESSAGE:
${message.content}

RAW RESPONSE:
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
      console.error("Random snipe: no message output:", data);
      return;
    }

    const text = msgOutput.content.map((c) => c.text || "").join("");
    if (text) await safeReply(message, text.slice(0, 500));
  } catch (err) {
    console.error("snipe error:", err);
  }
}

