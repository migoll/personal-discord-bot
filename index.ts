// This file is a workaround for Cybrancee's hardcoded startup command
// Since the startup command points to /home/container/index.ts, 
// this file imports and executes the actual bot code from src/index.ts
import './src/index.js';

