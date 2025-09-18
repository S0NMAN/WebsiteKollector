# Website Kollector

A desktop-first single-page site that showcases the Hobby Kollector studio. The project is now organized with a Vite-friendly
structure so assets, scripts, and styles stay modular without changing the existing look and feel.

## Project structure

```
.
├── src/
│   ├── css/
│   │   ├── animations.css
│   │   ├── base.css
│   │   ├── components.css
│   │   ├── layout.css
│   │   └── utilities.css
│   ├── img/
│   ├── index.html
│   └── js/
│       ├── main.js
│       └── scroll.js
├── package.json
└── vite.config.js
```

## Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start a local dev server:
   ```bash
   npm run dev
   ```
   The Vite server will serve content from the `src/` directory.

## Production build

Create an optimized build in the `dist/` directory:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

All assets remain within the `src/` folder, so the compiled site keeps the same appearance while benefiting from a cleaner
modular structure.
