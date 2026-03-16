# hismar.dev — Interactive Terminal Portfolio

Interactive retro terminal experience built with vanilla HTML, CSS, and JavaScript. The UI mimics a command-line interface with pixel-art vibes, smooth animations, and a modular command system.

🌐 **Live site:** [https://hismar.dev/](https://hismar.dev/)

---

## 🚀 Key Features
- **Console-style interface:** Sticky prompt at the bottom that accepts commands just like a shell.
- **Quick navigation:** Desktop menu plus mobile hamburger overlay for instant command jumps.
- **Modular command system:** Every command (about, skills, projects, education, help, etc.) lives in its own folder with isolated JS + CSS.
- **Terminal utilities:** Command history (↑ / ↓), autocomplete (Tab), and built-in commands (clear, exit).
- **Sandboxed animations:** Each command can wire up animations while the sandbox automatically cleans them up when switching views.
- **Fully responsive:** Works seamlessly on desktop, tablet, and mobile.

---

## 🛠️ Project Structure
No bundlers required—everything is served as static assets.

`	ext
hismar.dev/
├── index.html           # Entry point
├── main.js              # Terminal core + command loader
├── package.json         # Helper scripts (dev server, etc.)
├── styles/              # Global + layout CSS
├── animations/          # Reusable animation modules
├── commands/            # One folder per command
│   ├── about/
│   │   ├── about.js
│   │   └── about.css
│   └── ...
└── README.md            # This file
`

---

## 💻 Local Development
Spin up any static HTTP server.

1. **Clone the repo**
   `ash
   git clone https://github.com/ismailhaddouche/hismar.dev
   cd hismar.dev
   `

2. **Start a server**
   `ash
   npm run dev        # uses http-server under the hood
   # or with Python
   python3 -m http.server 8000
   `

3. **Open the app**
   Visit http://localhost:8000 and type help in the prompt to see available commands.

---

## 🧩 Adding or Editing Commands
The command sandbox makes extensibility straightforward.

1. **Create a folder:** commands/my-command/
2. **Add the JS module:** commands/my-command/my-command.js
   `javascript
   export default {
     name: 'my-command',
     description: 'Short description of the feature',
     async execute(terminal, animation) {
       const { container, content } = terminal.createCommandContainer('my-command');

       terminal.writeLine('Hello from my command');
       content.innerHTML = '<p>Custom HTML, components, or canvas animations.</p>';
     }
   };
   `
3. **(Optional) Add scoped styles:** commands/my-command/my-command.css
4. **Register the command:** Link script + CSS paths inside main.js so the loader can import them dynamically.

**Best practices**
- Keep styles scoped to the command container returned by createCommandContainer().
- If you spin up intervals, observers, or rAF loops, register cleanup callbacks so the sandbox can dispose them when the user clears the terminal or switches commands.

---

## ✅ Validation Script (Optional)
On Linux/macOS/WSL there is a helper script to confirm required files exist:
`ash
./validate-v2.sh
`
This ensures the core animation + command assets are present before deploying.

---

## 🚀 Deployment
The project is 100% static, so deployment is painless:
- Host on GitHub Pages, Vercel, Netlify, Firebase Hosting, or any static provider.
- Ensure relative paths (/commands/, /styles/, etc.) resolve correctly. For GitHub Pages, deploy from the repository root (/).

---

## 📄 License
Distributed under the MIT License. See LICENSE for details.

## ✉️ Contact
**Ismail Haddouche Rhali** — [GitHub](https://github.com/ismailhaddouche)
