# 🔧 Fix for Non-Editable Startup Command

## The Problem
Cybrancee's startup command is hardcoded to `/home/container/index.ts`, but your bot code is in `src/index.ts`. You can't edit the startup command.

## ✅ Solution: Create Root-Level index.ts

I've created an `index.ts` file at the root level that imports your actual bot code from `src/index.ts`.

### What This Does
- The startup command will find `/home/container/index.ts` ✅
- That file imports and runs `/home/container/src/index.ts` ✅
- Your bot works exactly the same ✅

### Steps to Deploy

1. **Commit the new index.ts file:**
   ```bash
   git add index.ts
   git commit -m "Add root index.ts for Cybrancee compatibility"
   git push origin main
   ```

2. **In Cybrancee Panel:**
   - Make sure **BOT TS FILE** is set to: `index.ts` (or leave it as is)
   - Make sure **AUTO UPDATE** is **ON** ✅
   - The startup command should already be: `npx ts-node /home/container/index.ts`

3. **Restart the bot:**
   - Go to **Console** tab
   - Click **Stop** (if running)
   - Click **Start**
   - Watch for success!

### Expected Output
You should see:
```
✅ npm install completes
✅ npx ts-node /home/container/index.ts
✅ Bot imports from src/index.ts
✅ KEY LOADED: yes
✅ Bot logs in successfully
```

---

## Alternative: If You Can Change BOT TS FILE

If Cybrancee actually uses the **BOT TS FILE** variable in the startup command:

1. Change **BOT TS FILE** to: `src/index.ts`
2. Save and restart
3. If it works, you can delete the root `index.ts` file

---

## File Structure After Fix

```
personal-discord-bot/
├── index.ts              ← NEW: Workaround file (imports src/index.ts)
├── src/
│   ├── index.ts          ← Your actual bot code
│   ├── handlers/
│   └── utils/
├── package.json
└── tsconfig.json
```

The root `index.ts` is just a thin wrapper that runs your real bot code.

