# Complete Cybrancee Deployment Guide

## ✅ Your TypeScript Bot is Ready!

Your project has been successfully converted to TypeScript with the following structure:
- `/src/index.ts` - Main entry point
- `/src/handlers/` - All handler functions
- `/src/utils/` - Utility functions
- `/types/` - Type definitions

---

## Step 1: Install Dependencies Locally (Optional - for testing)

If you want to test locally first:

```bash
npm install
```

This will install all dependencies and the linter errors will disappear.

---

## Step 2: Create GitHub Personal Access Token

1. Go to: https://github.com/settings/tokens?type=beta
2. Click **"Generate new token"** → **"Generate new token (fine-grained)"**
3. Configure the token:
   - **Token name**: `Cybrancee Bot Deploy`
   - **Expiration**: Choose your preference (90 days recommended)
   - **Repository access**: Select **"Only select repositories"**
   - **Select your bot repository**: `personal-discord-bot` (or whatever your repo is named)
   - **Permissions**:
     - ✅ **Contents**: Read-only
     - ✅ **Metadata**: Read-only (usually auto-selected)
4. Click **"Generate token"**
5. **COPY THE TOKEN IMMEDIATELY** - you won't see it again!

---

## Step 3: Configure Cybrancee Startup Settings

Go to your Cybrancee server panel → **Startup** tab

### Fill in these fields:

#### **GIT REPO ADDRESS**
```
https://github.com/YOUR_USERNAME/personal-discord-bot.git
```
Replace `YOUR_USERNAME` with your actual GitHub username.

#### **INSTALL BRANCH**
```
main
```
(Or `master` if that's your default branch)

#### **GIT USERNAME**
```
YOUR_GITHUB_USERNAME
```
Just your GitHub username, not your email.

#### **GIT ACCESS TOKEN**
```
PASTE_YOUR_TOKEN_HERE
```
Paste the token you created in Step 2.

#### **ADDITIONAL NODE PACKAGES**
```
discord.js dotenv node-fetch typescript ts-node @types/node @types/node-fetch
```

#### **BOT TS FILE**
```
src/index.ts
```

#### **STARTUP COMMAND**
Replace the default command with:
```bash
if [[ -d .git ]] && [[ 0 == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; npx ts-node /home/container/src/index.ts
```

**Important**: The last part (`npx ts-node /home/container/src/index.ts`) must point to your TypeScript file.

#### **AUTO UPDATE**
✅ **Toggle ON** - This will auto-deploy when you push to GitHub

#### **USER UPLOADED FILES**
❌ **Toggle OFF** - We're using GitHub, not manual uploads

---

## Step 4: Set Environment Variables

Since Cybrancee uses Pterodactyl panel, environment variables might be in a different location. Here are two methods:

### Method 1: Using .env file (Recommended)

1. In Cybrancee panel, go to **File Manager**
2. Navigate to the root directory (where your bot files are)
3. Create a new file called `.env`
4. Add these lines:
   ```
   TOKEN=your_discord_bot_token_here
   OPENAI_API_KEY=your_openai_api_key_here
   ```
5. Replace the placeholder values with your actual tokens
6. Save the file

### Method 2: Environment Variables Tab (if available)

If you see an **Environment** or **Variables** tab in Cybrancee:
- Add `TOKEN` = Your Discord bot token
- Add `OPENAI_API_KEY` = Your OpenAI API key

**Important**: Never commit `.env` to GitHub! It's already in `.gitignore`.

---

## Step 5: Commit and Push to GitHub

Make sure all your TypeScript files are committed:

```bash
git add .
git commit -m "Convert to TypeScript with clean architecture"
git push origin main
```

---

## Step 6: Start Your Bot on Cybrancee

1. Go to **Console** tab
2. Click **Stop** (if running)
3. Click **Start**
4. Watch the console for:
   - ✅ Git clone success
   - ✅ npm install success
   - ✅ Bot starting
   - ✅ "KEY LOADED: yes" message
   - ✅ "Ready!" or bot login success

---

## Step 7: Troubleshooting

### Error: "Cannot find module 'discord.js'"
**Fix**: Make sure `discord.js` is in "Additional Node Packages" field

### Error: "fatal: could not read Username"
**Fix**: Your GitHub token is wrong or expired. Generate a new one.

### Error: "Cannot find module 'src/index.ts'"
**Fix**: Check that "BOT TS FILE" is set to `src/index.ts` (not `index.ts`)

### Error: "npm not found"
**Fix**: Make sure Docker Image is set to **NodeJS 23** (or latest Node version)

### Bot doesn't respond
**Fix**: 
1. Check console for errors
2. Verify `TOKEN` environment variable is set correctly
3. Check that bot has proper Discord permissions
4. Verify intents are enabled in Discord Developer Portal

### TypeScript errors in console
**Fix**: Make sure all TypeScript packages are in "Additional Node Packages":
```
typescript ts-node @types/node @types/node-fetch
```

---

## Step 8: Verify Auto-Deploy Works

1. Make a small change to your code (add a comment)
2. Commit and push:
   ```bash
   git add .
   git commit -m "Test auto-deploy"
   git push
   ```
3. Check Cybrancee console - it should automatically:
   - Pull the latest code
   - Restart the bot
   - Show your changes working

---

## Your Project Structure (for reference)

```
personal-discord-bot/
├── src/
│   ├── index.ts              ← Main entry point
│   ├── handlers/
│   │   ├── handleRandomSnipe.ts
│   │   ├── handleChatGPT.ts
│   │   └── handleSummary.ts
│   └── utils/
│       ├── safeReply.ts
│       └── fetchOpenAI.ts
├── types/
│   └── MessageHistory.ts
├── package.json
├── tsconfig.json
├── .env (not in git)
└── index.js (old file - can delete)
```

---

## Next Steps After Deployment

1. ✅ Test the bot in Discord
2. ✅ Verify random snipe works (0.5% chance)
3. ✅ Test ChatGPT handler (mention the bot)
4. ✅ Test summary handler (long messages from specific user)
5. ✅ Monitor console for any errors
6. ✅ Check RAM usage (should be ~150-200 MB)

---

## Need Help?

If you encounter issues:
1. Check the Cybrancee console logs
2. Verify all environment variables are set
3. Make sure GitHub token has correct permissions
4. Ensure all packages are listed in "Additional Node Packages"

Your bot is production-ready! 🚀

