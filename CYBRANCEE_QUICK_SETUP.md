# Cybrancee Quick Setup Reference

## Copy-Paste Values for Cybrancee Panel

### GIT REPO ADDRESS
```
https://github.com/YOUR_USERNAME/personal-discord-bot.git
```
*(Replace YOUR_USERNAME with your GitHub username)*

### INSTALL BRANCH
```
main
```

### GIT USERNAME
```
YOUR_GITHUB_USERNAME
```
*(Just your username, not email)*

### GIT ACCESS TOKEN
```
[Paste token from GitHub Settings → Developer settings → Personal access tokens]
```

### ADDITIONAL NODE PACKAGES
```
discord.js dotenv node-fetch typescript ts-node @types/node @types/node-fetch
```

### BOT TS FILE
```
src/index.ts
```

### STARTUP COMMAND
```bash
if [[ -d .git ]] && [[ 0 == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; npx ts-node /home/container/src/index.ts
```

### Environment Variables

**Option 1: Create .env file in File Manager**
1. Go to **File Manager** in Cybrancee
2. Create file `.env` in root directory
3. Add:
   ```
   TOKEN=your_discord_bot_token_here
   OPENAI_API_KEY=your_openai_api_key_here
   ```

**Option 2: Environment Tab (if available)**
- Look for **Environment** or **Variables** tab
- Add `TOKEN` and `OPENAI_API_KEY` there

### Toggles
- ✅ **AUTO UPDATE**: ON
- ❌ **USER UPLOADED FILES**: OFF

---

## GitHub Token Creation (Quick Steps)

1. Go to: https://github.com/settings/tokens?type=beta
2. Click "Generate new token" → "Generate new token (fine-grained)"
3. Name: `Cybrancee Bot Deploy`
4. Repository: Select your bot repo
5. Permissions: **Contents** (Read) + **Metadata** (Read)
6. Generate → Copy token immediately

---

## First Deploy Checklist

- [ ] GitHub token created and copied
- [ ] All Cybrancee fields filled in
- [ ] Environment variables set (TOKEN, OPENAI_API_KEY)
- [ ] Code committed and pushed to GitHub
- [ ] Bot started in Cybrancee console
- [ ] Console shows "KEY LOADED: yes"
- [ ] Bot appears online in Discord

