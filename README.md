# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## GSAP plugin

- [GSAP animation library](https://gsap.com)
- [useGSAP() React Hook](https://gsap.com/resources/React)
- [ScrollTrigger plugin](https://gsap.com/docs/v3/Plugins/ScrollTrigger)
- [ScrollToPlugin](https://gsap.com/docs/v3/Plugins/ScrollToPlugin)
- [ScrollSmoother plugin](https://gsap.com/docs/v3/Plugins/ScrollSmoother)

## Project conventions

- Components: PascalCase filenames in `src/sections` and `src/components`.
- Hooks: camelCase starting with `use` in `src/hooks`.
- Assets: kebab-case in `src/assets` (images, icons, vectors, fonts).
- i18n: JSON dictionaries in `src/lang/en.json`, `src/lang/ua.json` using dot-notation (e.g. `home.title.left`).
- Translations fallback: `translate(key, lang)` first resolves JSON dot keys, then falls back to legacy `en.js/ua.js` keys.
- BEM: SCSS classes use BEM (`block__element--modifier`).

## Lint rules

- Filename cases enforced via `eslint-plugin-unicorn`:
	- Code: PascalCase and camelCase allowed.
	- Assets (`src/assets/**`): kebab-case only.

Run lints:

```bash
npm run lint
```

## Suggested folders

- `src/assets/{images,icons,vectors,fonts}`
- `src/content` – статический контент (массивы, конфиги UI-текста)
- `src/styles` – глобальные SCSS (`variables`, `root`, `layout`)

