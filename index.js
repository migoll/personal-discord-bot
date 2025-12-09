const { Client, GatewayIntentBits } = require("discord.js");



require("dotenv").config();

console.log("KEY LOADED:", process.env.OPENAI_API_KEY ? "yes" : "no");

const fetch = (...args) =>

  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const client = new Client({

  intents: [

    GatewayIntentBits.Guilds,

    GatewayIntentBits.GuildMessages,

    GatewayIntentBits.MessageContent,

    GatewayIntentBits.GuildMembers,

  ],

});

// --------------------------

// Safe reply wrapper

// --------------------------

async function safeReply(message, text) {

  try {

    if (

      !message.guild?.members.me?.permissionsIn(message.channel)

        ?.has("SendMessages")

    ) {

      console.warn("Bot cannot send messages in this channel.");

      return;

    }

    return await message.reply(text);

  } catch (err) {

    console.warn("Reply failed:", err.code, err.message);

  }

}

// --------------------------

// Helper function to check if message is from "her"

// --------------------------

function isHer(message) {

  return message.author.id === "902614156656660481";

}

// --------------------------

// Dayshanese rules (unchanged)

// --------------------------

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

// --------------------------

// RANDOM SNIPE - Modified (only change)

// --------------------------

async function handleRandomSnipe(message) {

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

    const res = await fetch("https://api.openai.com/v1/responses", {

      method: "POST",

      headers: {

        "Content-Type": "application/json",

        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,

      },

      body: JSON.stringify({

        model: "gpt-5.1",

        input: finalInput,

        max_output_tokens: 150,

        text: { verbosity: "low", format: { type: "text" } }

      }),

    });

    const data = await res.json();

    const msgOutput = data.output?.find(o => o.type === "message");

    if (!msgOutput || !msgOutput.content) {

      console.error("Random snipe: no message output:", data);

      return;

    }

    const text = msgOutput.content.map(c => c.text || "").join("");

    if (text) await safeReply(message, text.slice(0, 500));

  } catch (err) {

    console.error("snipe error:", err);

  }

}

// --------------------------

// Main GPT handler (JSON mode)

// --------------------------

async function handleChatGPT(message) {

  const userInput = message.content.replace(`<@${client.user.id}>`, "").trim();

  if (userInput.length === 0) {

    await safeReply(message, "You tagged me but said nothing...");

    return;

  }

  const fetched = await message.channel.messages.fetch({ limit: 100 });

  const historyArray = [...fetched.values()].reverse();

  const history = historyArray

    .map((m) => {

      const role = m.author.id === client.user.id ? "assistant" : "user";

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

    const res = await fetch("https://api.openai.com/v1/responses", {

      method: "POST",

      headers: {

        "Content-Type": "application/json",

        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,

      },

      body: JSON.stringify({

        model: "gpt-5.1",

        input: finalInput,

        max_output_tokens: 400,

        text: { verbosity: "low", format: { type: "text" } }

      }),

    });

    const data = await res.json();

    const msgOutput = data.output?.find(o => o.type === "message");

    if (!msgOutput || !msgOutput.content) {

      console.error("ChatGPT: no message output:", data);

      await safeReply(message, "GPT returned no message output.");

      return;

    }

    const raw = msgOutput.content.map(c => c.text || "").join("");

    let parsed;

    try {

      parsed = JSON.parse(raw);

    } catch {

      parsed = { reply_to: message.id, text: raw };

    }

    let target;

    try {

      target = await message.channel.messages.fetch(parsed.reply_to);

    } catch {

      target = message;

    }

    await safeReply(target, parsed.text.slice(0, 1000));

  } catch (err) {

    console.error("GPT error:", err);

    await safeReply(message, "GPT error: " + err.message);

  }

}

// --------------------------

// Summary handler

// --------------------------

async function handleSummary(message) {

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

    const res = await fetch("https://api.openai.com/v1/responses", {

      method: "POST",

      headers: {

        "Content-Type": "application/json",

        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,

      },

      body: JSON.stringify({

        model: "gpt-5.1",

        input: finalInput,

        max_output_tokens: 150,

        text: { verbosity: "low", format: { type: "text" } }

      }),

    });

    const data = await res.json();

    const msgOutput = data.output?.find(o => o.type === "message");

    if (!msgOutput || !msgOutput.content) {

      console.error("Summary: no message output:", data);

      return;

    }

    const summary = msgOutput.content.map(c => c.text || "").join("");

    await safeReply(message, `eer we go with la summarize:\n${summary}`);

  } catch (err) {

    console.error("Summary error:", err);

  }

}

// --------------------------

// Listener + random snipe (1 percent)

// --------------------------

client.on("messageCreate", async (message) => {

  if (message.author.bot) return;

  // random snipe at EXACT 0.5%

  if (Math.random() < 0.005) {

    await handleRandomSnipe(message);

    return;

  }

  // summary trigger

  if (

    message.author.id === "617945101620215813" &&

    message.content.length > 200

  ) {

    await handleSummary(message);

    return;

  }

  // mention -> GPT

  if (message.mentions.has(client.user)) {

    await handleChatGPT(message);

  }

});

// --------------------------

// Error resilience

// --------------------------

client.on("error", (err) => {

  console.error("Discord client error:", err);

});

client.on("shardError", (err) => {

  console.error("Websocket shard error:", err);

});

process.on("unhandledRejection", (reason) => {

  console.error("Unhandled rejection:", reason);

});

process.on("uncaughtException", (err) => {

  console.error("Uncaught exception:", err);

});

// --------------------------

client.login(process.env.TOKEN);
