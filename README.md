<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1dZCpWQWu5HNnbcRJYxA58Z8gR6Fitgfa

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


## Fix applied
Added `base: '/studenflowai/'` to `vite.config.ts` so the built assets load correctly on GitHub Pages under `username.github.io/studenflowai/`.

## How to build & publish
1. Install dependencies: `npm install`
2. Build: `npm run build`
3. Option A (preferred):
   - Create a `gh-pages` branch and push `dist` contents there, or use the `gh-pages` npm package to deploy.
   - Alternatively, copy the `dist` folder contents into a `docs/` folder on the `main` branch and enable GitHub Pages to serve from the `docs` folder.
4. Make sure GitHub Pages is set to serve the site at `https://<username>.github.io/studenflowai/`.

If your repo name is different, change the `base` value in `vite.config.ts` to `'/your-repo-name/'`.
