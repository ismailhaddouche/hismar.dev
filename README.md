# hismar.dev - Interactive Terminal Portfolio

hismar.dev is a terminal-inspired portfolio built with TypeScript, Vite, HTML, and CSS. It provides a command-driven user experience with modular commands, lazy loading, project galleries, i18n, and static-hosting friendly output.

Live site: https://hismar.dev/

## Core Features

- Terminal-like UI with command prompt and output stream
- Modular command system: `about`, `experience`, `skills`, `neofetch`, `projects`, `education`, `cv`, `help`
- Built-in utility commands: `clear`, `exit`
- Command history navigation with `ArrowUp` / `ArrowDown`
- Autocomplete support with `Tab`
- Mobile menu with command shortcuts
- Spanish and English language support
- Project screenshot galleries with fullscreen modal
- Accessibility improvements: landmarks, skip link, ARIA labels, keyboard navigation
- SEO metadata, structured data, `robots.txt`, `sitemap.xml`, and `llms.txt`
- Easter eggs, including `sudo` permission denial behavior

## Technology Stack

- TypeScript
- Vite
- HTML5
- CSS3
- Canvas API
- Three.js
- Vitest
- Playwright

## Project Structure

```text
hismar.dev/
├── index.html
├── package.json
├── vite.config.ts
├── src/
│   ├── animations/
│   ├── commands/
│   ├── core/
│   ├── shared/
│   ├── styles/
│   └── main.ts
├── images/
│   └── projects/
├── public/
│   ├── curriculum/
│   ├── images/
│   ├── robots.txt
│   ├── sitemap.xml
│   └── llms.txt
├── e2e/
└── curriculum/
```

## Command Architecture

Command modules are registered in `src/main.ts` through `COMMAND_DEFINITIONS`.

Each command can define:

- `script`: command logic module path
- `styles`: command-specific stylesheet imported by the command
- `animation`: optional command-specific animation module
- `showInNav`: whether it should be exposed as a navigable command

At runtime, the terminal loads only what is needed for the executed command, then renders content through `createCommandContainer(commandName)`.

## Local Development

### Requirements

- Node.js
- npm

### Start Development Server

```bash
npm run dev
```

Vite prints the local URL when the server starts.

## Validation

Create a production build:

```bash
npm run build
```

Run unit tests:

```bash
npm test
```

Run end-to-end tests:

```bash
npm run e2e
```

## Deployment

The app builds to static files in `dist/` and can be hosted on Firebase Hosting or any static file host.

```bash
npm run deploy
```

## License

MIT License. See `LICENSE` for details.

## Contact

Ismail Haddouche Rhali

- GitHub: https://github.com/ismailhaddouche
- LinkedIn: https://www.linkedin.com/in/ismail-haddouche-rhali-194305334
