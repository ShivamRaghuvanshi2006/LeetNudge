# LeetNudge

LeetNudge is a React + Vite web project exploring a guided LeetCode/DSA learning experience. The current interface includes a landing page, feature and demo sections, a local display-name login flow, and an in-app dashboard.

> **Prototype security note:** the current login and admin-mode logic runs entirely in the browser. It is not production authentication and must not be used to protect real accounts or privileged data. Do not deploy real credentials or sensitive data in this client-side app.

## Tech stack

- React 18
- Vite 5
- Tailwind CSS
- Framer Motion
- Three.js with React Three Fiber and Drei
- GSAP
- Lucide React

## Requirements

- Node.js 20 or later
- npm

## Run locally

```bash
git clone https://github.com/ShivamRaghuvanshi2006/LeetNudge.git
cd LeetNudge
npm ci
npm run dev
```

Vite prints the local development URL in the terminal.

## Production build

```bash
npm run build
npm run preview
```

The production files are generated in `dist/`.

## Deployment

The GitHub Pages workflow builds the Vite app and publishes the `dist/` directory. It runs on pushes to `main` and can also be started manually from the Actions tab.

## Project structure

```text
LeetNudge/
├── .github/workflows/  # GitHub Pages deployment
├── public/             # Static public assets
├── src/
│   ├── components/     # UI components
│   ├── data/           # App data
│   ├── utils/          # Utility modules
│   ├── App.jsx         # Main application
│   ├── index.css       # Global styles
│   └── main.jsx        # React entry point
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

## Current limitations

- User and admin session state is stored in browser local storage.
- No server-side authentication or authorization is configured.
- Automated application tests are not currently defined in `package.json`.

## License

No license file is currently included. Contact the repository owner before reusing this project.
