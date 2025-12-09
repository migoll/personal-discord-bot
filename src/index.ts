import { Client, GatewayIntentBits, type Message } from "discord.js";
import dotenv from "dotenv";
import { handleRandomSnipe } from "./handlers/handleRandomSnipe.js";
import { handleChatGPT } from "./handlers/handleChatGPT.js";
import { handleSummary } from "./handlers/handleSummary.js";

dotenv.config();

console.log("KEY LOADED:", process.env.OPENAI_API_KEY ? "yes" : "no");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.on("messageCreate", async (message: Message) => {
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
  if (client.user && message.mentions.has(client.user)) {
    await handleChatGPT(message, client);
  }
});

client.on("error", (err: Error) => {
  console.error("Discord client error:", err);
});

client.on("shardError", (err: Error) => {
  console.error("Websocket shard error:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
});

client.login(process.env.TOKEN);

