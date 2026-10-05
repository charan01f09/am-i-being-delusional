# AM I BEING DELUSIONAL? 🧠

> Paste your 3AM overthinking. A council of unqualified raccoons will roast it. Scientists have been notified.

**Live demo:** _add your Vercel/Netlify link_ · **Entertainment only. Not therapy. Not medical advice. Not a sign.**

![screenshot](./docs/screenshot.png)

## What is this?
You describe a situation ("they viewed my story in 2 minutes and didn't reply"). The app returns a **Delusion Score**, an **Overthinking Score**, a verdict, a reality check and brutally honest advice. Then you can **Make It Worse 💀** or **Touch Grass 🌱**.

## Features
- Delusion + overthinking meters, tier labels, 100+ original lines matched to topics (read receipts, likes, signs, exes, work, friends, 3AM brain...)
- Different joke every run (no more "same text = same answer")
- Categories, random situation generator, history (12 saved locally), copy/share
- **Make It Worse** escalates through 5 stages. **Touch Grass** literally grows grass at the bottom of the page.
- **Secrets dex** (14 hidden discoveries): secret phrases, Konami code, 3AM detection, repeat-offender detection, meltdown mode at 95%+, 1-in-100 and 1-in-1000 outcomes. Spoilers intentionally absent.
- Optional AI mode with automatic fallback to the local engine
- Safety: distress/self-harm phrases get a kind, joke-free response
- Responsive (320px to desktop), keyboard accessible, reduced-motion friendly

## Run it
No install. Any static server works:
```bash
git clone <your-repo-url> && cd am-i-being-delusional
python3 -m http.server 3000   # or: npm start
```
Open http://localhost:3000 (double-clicking `index.html` also works).

## Optional: AI mode
`api/analyze.js` is a Vercel serverless function. Set `ANTHROPIC_API_KEY` in your Vercel project's environment variables (never in the repo). Without it, the site just uses the local brain. The UI states which one roasted you.

## Deploy
Vercel: `npm i -g vercel && vercel` (static + `/api` work out of the box). Netlify/GitHub Pages also host the static site (AI mode needs a function host).

## Structure
`index.html` page · `styles.css` look · `engine.js` jokes, scoring, easter eggs (edit this to add humor) · `app.js` UI · `api/analyze.js` optional AI

## Contributing
Add jokes to the arrays in `engine.js`. Keep them roasting the *thought*, never the person.

MIT License
