# Complete Cybrancee Setup Guide

This guide provides **every single step** and **every single configuration** needed to deploy your Discord bot on Cybrancee.

## ⚠️ IMPORTANT: Fixed Startup Command

Cybrancee has a **FIXED/UNCHANGEABLE** startup command that you cannot modify. It automatically:

1. Runs `git pull` if it's a git repository
2. Installs packages from `NODE_PACKAGES` env var (if set)
3. Uninstalls packages from `UNNODE_PACKAGES` env var (if set)
4. Runs `npm install` if `package.json` exists
5. **Runs `npx ts-node /home/container/index.ts`** (this is the key part!)

This means:

- ✅ Your main file **MUST** be `index.ts` in the root directory
- ✅ `ts-node` **MUST** be in your `dependencies` (not devDependencies)
- ✅ No build step needed - TypeScript runs directly
- ✅ The startup command field is **READ-ONLY** - don't try to change it

---

## Prerequisites

Before starting, make sure you have:

1. A Discord Bot Token (from https://discord.com/developers/applications)
2. An OpenAI API Key (from https://platform.openai.com/api-keys)
3. Your GitHub repository connected to Cybrancee

---

## Step 1: Repository Setup

### Files in Your Repository

Your repository should have these files:

```
personal-discord-bot/
├── package.json          (Node.js dependencies - includes ts-node)
├── tsconfig.json         (TypeScript configuration)
├── .gitignore           (Files to ignore in git)
└── index.ts             (Main bot code - MUST be in root!)
```

**All files are already created in your repo!**

**Key Points:**

- `index.ts` is in the **root directory**, not in `src/`
- `ts-node` is in `dependencies` (not `devDependencies`)
- No `dist/` folder needed - TypeScript runs directly

---

## Step 2: Cybrancee Dashboard Configuration

### A. Project Settings

1. **Navigate to your project on Cybrancee**
2. **Go to "Settings" or "Configuration"**

### B. Startup Command (READ-ONLY)

**⚠️ DO NOT CHANGE THIS** - It's fixed and unchangeable:

```
if [[ -d .git ]] && [[ 1 == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; npx ts-node /home/container/index.ts
```

This command:

- Pulls latest code from git
- Installs npm packages automatically
- Runs `npx ts-node /home/container/index.ts` (your bot)

**You don't need to configure this - it's already set!**

### C. Node Version (if available)

- **Node Version**: `18.x` or `20.x` (select the latest LTS version available)
  - Your `package.json` specifies `>=18.0.0`

### D. Environment Variables

Find the **"Environment Variables"** or **"Secrets"** section and add these **TWO** variables:

1. **Variable Name**: `TOKEN`

   - **Value**: Your Discord bot token (starts with something like `MTIzNDU2Nzg5...`)
   - **Type**: Secret/Encrypted (if option available)

2. **Variable Name**: `OPENAI_API_KEY`
   - **Value**: Your OpenAI API key (starts with `sk-...`)
   - **Type**: Secret/Encrypted (if option available)

**⚠️ IMPORTANT**:

- Make sure these are marked as **environment variables**, not build-time variables
- They should be available at **runtime** (when the bot is running)
- Never commit these to your repository!

### E. Port Configuration (if applicable)

Some platforms require a port. Discord bots don't use HTTP ports, but if Cybrancee requires one:

- **Port**: Leave empty or set to `3000` (won't be used, but may be required)

### F. Root Directory (if applicable)

- **Root Directory**: `/` or leave empty
  - This means the root of your repository

---

## Step 3: Deployment Settings

### A. Branch to Deploy

- **Branch**: `main` (or `master` if that's your default branch)
  - This should match your GitHub repository's main branch

### B. Auto-Deploy

- **Auto-Deploy**: Enable if you want automatic deployments on git push
  - Recommended: **ON**

---

## Step 4: Advanced Settings (if available)

### A. Node.js Settings

- **NPM Version**: Latest (or leave default)
- **Node Modules Caching**: Enable (speeds up installs)

### B. Logs

- **Log Level**: `info` or `debug` (for troubleshooting)
- **Log Retention**: 7 days (or as needed)

---

## Step 5: Verification Checklist

Before deploying, verify:

- [ ] `package.json` exists with `ts-node` in `dependencies` (not devDependencies)
- [ ] `tsconfig.json` exists with correct configuration
- [ ] `index.ts` exists in the **root directory** (not in `src/`)
- [ ] Environment variable `TOKEN` is set with your Discord bot token
- [ ] Environment variable `OPENAI_API_KEY` is set with your OpenAI API key
- [ ] Node.js version is set to 18.x or 20.x (if option available)
- [ ] Startup command is **NOT changed** (it's fixed/read-only)

---

## Step 6: Deploy

1. **Click "Deploy"** or **"Save and Deploy"** button
2. **Watch the build logs** for any errors
3. **Check the runtime logs** to see if the bot connects

### Expected Log Output

When the bot starts successfully, you should see:

```
KEY LOADED: yes
[Discord.js ready event - bot is online]
```

If you see `KEY LOADED: no`, your `OPENAI_API_KEY` environment variable is not set correctly.

---

## Step 7: Troubleshooting

### Build Fails

**Error**: `Cannot find module 'discord.js'`

- **Fix**: Make sure build command includes `npm install`

**Error**: `TypeScript compilation errors`

- **Fix**: Check `tsconfig.json` and ensure all TypeScript syntax is correct

### Bot Doesn't Start

**Error**: `Missing TOKEN`

- **Fix**: Verify `TOKEN` environment variable is set correctly in Cybrancee dashboard

**Error**: `Invalid token`

- **Fix**: Regenerate your Discord bot token and update the environment variable

### Bot Starts But Doesn't Respond

**Check**:

1. Bot is invited to your Discord server with correct permissions:
   - Send Messages
   - Read Message History
   - View Channels
2. Bot has the correct intents enabled in Discord Developer Portal
3. Check runtime logs for error messages

---

## Step 8: Discord Bot Permissions

Make sure your bot has these permissions in Discord:

1. Go to https://discord.com/developers/applications
2. Select your bot application
3. Go to "Bot" → "Privileged Gateway Intents"
4. Enable:
   - ✅ **MESSAGE CONTENT INTENT** (Required!)
   - ✅ **SERVER MEMBERS INTENT** (Optional, but used in code)
5. Go to "OAuth2" → "URL Generator"
6. Select scopes: `bot`
7. Select permissions:
   - ✅ Send Messages
   - ✅ Read Message History
   - ✅ View Channels
   - ✅ Read Messages/View Channels
8. Copy the generated URL and invite the bot to your server

---

## Summary: What Goes Where on Cybrancee

| Setting                    | Value                                    | Notes                                                                         |
| -------------------------- | ---------------------------------------- | ----------------------------------------------------------------------------- |
| **Startup Command**        | _(Fixed/Read-Only)_                      | Cannot be changed - automatically runs `npx ts-node /home/container/index.ts` |
| **Node Version**           | `18.x` or `20.x`                         | Select latest LTS if option available                                         |
| **Environment Variable 1** | `TOKEN` = (your Discord bot token)       | Required                                                                      |
| **Environment Variable 2** | `OPENAI_API_KEY` = (your OpenAI API key) | Required                                                                      |
| **Branch**                 | `main`                                   | Your default branch                                                           |
| **Root Directory**         | `/` (empty)                              | Root of repository                                                            |
| **File Location**          | `index.ts` in root                       | **MUST** be in root, not in `src/`                                            |

### What the Fixed Startup Command Does:

The startup command (which you **cannot change**) automatically:

1. ✅ Runs `git pull` to get latest code
2. ✅ Runs `npm install` (if `package.json` exists)
3. ✅ Runs `npx ts-node /home/container/index.ts` to start your bot

**You don't need to configure build commands or start commands - it's all automatic!**

---

## Need Help?

If something doesn't work:

1. Check the build logs in Cybrancee
2. Check the runtime logs in Cybrancee
3. Verify all environment variables are set
4. Verify your Discord bot token is valid
5. Verify your OpenAI API key is valid

---

**That's it! Your bot should now be running on Cybrancee.**
