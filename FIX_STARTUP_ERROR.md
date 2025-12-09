# 🔧 Fix: "Cannot find module './index.ts'" Error

## The Problem
Cybrancee is trying to use `${BOT_TS_FILE}` variable, but it's not resolving correctly, causing ts-node to fail.

## ✅ The Solution

### Step 1: Update Your Startup Command

Go to **Cybrancee Panel → Startup Tab** and replace the **STARTUP COMMAND** with this:

```bash
if [[ -d .git ]] && [[ ${AUTO_UPDATE} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; npx ts-node --esm /home/container/src/index.ts
```

**Key changes:**
- ✅ Uses `${AUTO_UPDATE} == "1"` (matches Cybrancee's variable)
- ✅ Uses `--esm` flag for ES modules
- ✅ Uses **hardcoded path** `/home/container/src/index.ts` (not `${BOT_TS_FILE}`)

### Step 2: Verify BOT TS FILE Field

In the **BOT TS FILE** field, make sure it says:
```
src/index.ts
```

(Even though we're not using the variable, this field should still be set correctly)

### Step 3: Save and Restart

1. Click **Save** (if there's a save button)
2. Go to **Console** tab
3. Click **Stop** (if running)
4. Click **Start**
5. Watch for success messages

---

## Alternative Solution (If Above Doesn't Work)

If `ts-node` still has issues, try using `tsx` instead:

### Step 1: Update ADDITIONAL NODE PACKAGES
Add `tsx` to the list:
```
discord.js dotenv node-fetch typescript tsx @types/node @types/node-fetch
```

### Step 2: Update STARTUP COMMAND
Replace the last part with:
```bash
npx tsx /home/container/src/index.ts
```

Full command:
```bash
if [[ -d .git ]] && [[ ${AUTO_UPDATE} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; npx tsx /home/container/src/index.ts
```

---

## Verify Your Files Are There

1. Go to **File Manager** in Cybrancee
2. Check that you see:
   - `/home/container/src/index.ts` ✅
   - `/home/container/src/handlers/` ✅
   - `/home/container/src/utils/` ✅
   - `/home/container/package.json` ✅
   - `/home/container/tsconfig.json` ✅

If files are missing, your GitHub repo might not have synced. Check:
- Git repo address is correct
- Branch name is correct
- GitHub token has proper permissions
- Click **Start** to trigger a fresh pull

---

## Expected Success Output

After fixing, you should see:
```
✅ npm install completes successfully
✅ npx ts-node --esm /home/container/src/index.ts
✅ KEY LOADED: yes
✅ Bot logs in successfully
✅ No "Cannot find module" errors
```

---

## Still Having Issues?

1. **Check Console Logs**: Look for any other error messages
2. **Verify .env File**: Make sure `.env` exists with `TOKEN` and `OPENAI_API_KEY`
3. **Check File Permissions**: Files should be readable
4. **Try Manual Test**: In console, try: `ls -la /home/container/src/` to see if files exist

