# hismar.dev — Interactive Terminal Portfolio

hismar.dev is a terminal-inspired portfolio built with vanilla HTML, CSS, and JavaScript. It provides a command-driven user experience with modular features, dynamic loading, and production-focused frontend architecture.

Live site: https://hismar.dev/

## Overview

The project reproduces the interaction model of a terminal while keeping the implementation fully static and framework-free. Commands are loaded on demand, each command has isolated styles, and optional command-specific animations are safely cleaned up when the active view changes.

## Core Features

- Terminal-like UI with command prompt and output stream
- Modular command system (`about`, `experience`, `skills`, `neofetch`, `projects`, `education`, `cv`, `help`)
- Built-in utility commands (`clear`, `exit`)
- Command history navigation (`ArrowUp` / `ArrowDown`)
- Autocomplete support (`Tab`)
- Mobile menu with command shortcuts
- Language support (Spanish and English)
- Accessibility improvements (landmarks, skip link, ARIA labels)
- SEO enhancements (metadata, structured data, `robots.txt`, `sitemap.xml`, `llms.txt`)
- Easter eggs, including `sudo` permission denial behavior

## Technology Stack

- HTML5
- CSS3
- JavaScript (ES modules pattern via dynamic script loading)
- Firebase ecosystem references in product presentation (e.g., Firebase/App Hosting context)
- Static hosting-friendly architecture (no bundler required to run)

## Project Structure

```text
hismar.dev/
├── index.html
├── main.js
├── i18n.js
├── package.json
├── styles/
│   ├── layout.css
│   └── layout.min.css
├── commands/
│   ├── about/
│   ├── experience/
│   ├── skills/
│   ├── neofetch/
│   ├── projects/
│   ├── education/
│   ├── cv/
│   └── help/
├── animations/
├── robots.txt
├── sitemap.xml
├── llms.txt
└── README.md
```

## Command Architecture

Command modules are registered in `main.js` through `COMMAND_DEFINITIONS`.

Each command can define:

- `script`: command logic module path
- `styles`: command-specific stylesheet path
- `animation` (optional): animation module path
- `showInNav`: whether it appears in navigation

At runtime, the terminal loads only what is needed for the executed command, then renders content via `createCommandContainer(commandName)`.

## Available Commands

- `about`: personal background and contact
- `experience`: professional trajectory
- `skills`: technical stack overview
- `neofetch`: graphical neofetch-style summary of website technologies
- `projects`: production and open-source work
- `education`: academic background
- `cv`: curriculum download
- `help`: command guide
- `clear`: clear terminal output
- `exit`: restart terminal session

Easter egg behavior:

- Any command prefixed with `sudo` returns a permission denial message.

## Local Development

### Requirements

- Node.js (recommended for npm scripts)
- Optional: Python 3 for fallback local server

### Start development server

```bash
npm run dev
```

The default development server is available at:

- http://127.0.0.1:8000

Alternative static server (Python):

```bash
python3 -m http.server 8000
```

## Build and Optimization

Generate minified core assets:

```bash
npm run build
```

This updates:

- `styles/layout.min.css`
- `i18n.min.js`
- `animations/character-base.min.js`
- `main.min.js`

## Validation Script

A local validation helper is available as:

```bash
./validate.sh
```

It checks critical files/directories and can start a local Python server on an available port.

## Accessibility and SEO

Implemented improvements include:

- Main landmark and skip link support
- ARIA and accessible naming fixes
- Image/icon accessibility adjustments where applicable
- Structured metadata (Open Graph, Twitter, JSON-LD)
- Crawl directives via `robots.txt`
- `sitemap.xml` for indexing
- `llms.txt` for machine-readable site guidance

## Deployment

The project is static and can be deployed to:

- Firebase Hosting
- Netlify
- Vercel
- GitHub Pages
- Any static file host

Deployment requirement: preserve root-relative asset paths and command directories.

## License

MIT License. See `LICENSE` for details.

## Contact

Ismail Haddouche Rhali

- GitHub: https://github.com/ismailhaddouche
- LinkedIn: https://www.linkedin.com/in/ismail-haddouche-rhali-194305334
