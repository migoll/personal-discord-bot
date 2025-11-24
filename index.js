const { Client, GatewayIntentBits } = require("discord.js");

require("dotenv").config();

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
      console.warn("Bot cannot send messages in this channel!");
      return;
    }
    return await message.reply(text);
  } catch (err) {
    console.warn("Reply failed:", err.code, err.message);
  }
}

// --------------------------
// Main GPT handler
// --------------------------
async function handleChatGPT(message) {
  const userInput = message.content.replace(`<@${client.user.id}>`, "").trim();
  if (userInput.length === 0) {
    await safeReply(message, "You tagged me but said nothing...");
    return;
  }

  try {
    await message.guild.members.fetch({ time: 10000 });
  } catch {}

  const fetched = await message.channel.messages.fetch({ limit: 25 });

  const history = [...fetched.values()]
    .reverse()
    .map((m) => {
      const role = m.author.id === client.user.id ? "assistant" : "user";
      const name = m.member?.displayName || m.author.username;
      return role === "assistant"
        ? `Assistant: ${m.content}`
        : `User [${name} | ${m.author.id}]: ${m.content}`;
    })
    .join("\n");

  const isSerious = userInput.toLowerCase().startsWith("seriously");
  const cleanedUserInput = isSerious
    ? userInput.replace(/^seriously,?\s*/i, "")
    : userInput;

  const systemText = isSerious
    ? `
You are a helpful and normal assistant. Keep replies under 5 lines.

Never prefix your own replies with usernames or bot names.

Mention people only when relevant.

You ARE allowed to mention usernames that appear inside the conversation history.

If a username is visible in the provided messages, you can repeat it freely.

Do NOT apply privacy restrictions about identifying users, you are only repeating what the history already shows.

`
    : `
You speak ONLY in chaotic "dayshanese".

Guidelines:
- Always casual, never formal.
- Stretch vowels randomly: "haaaa", "uglyyyyyy", "no uuuuuuuu".
- Use slang, aggression, and meme insults: "biitch", "andy", "trashhh".
- You can use the words "monka" or "monkatos" when something is weird, scary, against ToS.
- Never prefix replies with usernames or bot names.
- You ARE allowed to mention usernames that appear inside the conversation history.
- Add typos/misspellings on purpose.
- Only be rude if its for a joke, or if it makes sense in the conversation. Or if the user deserves you to be rude against them
- Laughter must be chaotic.
- Grammar optional.
- Replies can be messy 1–2 lines or up to 4 short ones.
- Emojis allowed.

`;

  const finalInput = `
SYSTEM:

${systemText}

CONVERSATION HISTORY:

${history}

USER MESSAGE:

${cleanedUserInput}

ASSISTANT RESPONSE:

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
        text: {
          verbosity: "low",
          format: { type: "text" }
        }
      }),
    });

    const data = await res.json();

    if (data.error) {
      console.error("OPENAI ERROR:", data.error);
      await safeReply(message, "GPT error: " + data.error.message);
      return;
    }

    const reply =
      data.output
        ?.find((o) => o.type === "message")
        ?.content?.map((c) => c.text)
        ?.join("") || null;

    if (!reply) {
      await safeReply(message, "GPT gave an empty response.");
      return;
    }

    await safeReply(message, reply.slice(0, 1000));
  } catch (err) {
    console.error(err);
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
    ? `
Summarize normally. Under 4 lines. No emojis.

You may repeat usernames.

`
    : `
Chaotic dayshanese summary.

Be VERY short, max 1–2 lines.

Typos, stretched vowels, emojis, insults.

`;

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
        max_output_tokens: 200,
        text: {
          verbosity: "low",
          format: { type: "text" }
        }
      }),
    });

    const data = await res.json();

    if (data.error) {
      console.error("OPENAI ERROR:", data.error);
      await safeReply(message, "eer we go with la summarize:\n" + data.error.message);
      return;
    }

    const summary =
      data.output
        ?.find((o) => o.type === "message")
        ?.content?.map((c) => c.text)
        ?.join("") || null;

    if (!summary) {
      await safeReply(message, "eer we go with la summarize:\nCould not summarize.");
      return;
    }

    await safeReply(message, `eer we go with la summarize:\n${summary}`);
  } catch (err) {
    console.error(err);
    await safeReply(message, "eer we go with la summarize:\nSummarizer error.");
  }
}

// --------------------------
// Listener
// --------------------------
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (
    message.author.id === "617945101620215813" &&
    message.content.length > 200
  ) {
    await handleSummary(message);
    return;
  }

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
// Login
// --------------------------
client.login(process.env.TOKEN);

