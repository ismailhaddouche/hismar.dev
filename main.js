/**
 * MAIN TERMINAL - MODULAR ORCHESTRATOR
 * Handles dynamic command loading and dependencies
 */

const COMMAND_DEFINITIONS = [
    {
        name: 'about',
        label: 'About',
        description: 'Biography & contact',
        script: 'commands/about/about.js',
        styles: 'commands/about/about.css',
        animation: 'animations/face-animation.js',
        showInNav: true
    },
    {
        name: 'experience',
        label: 'Experience',
        description: 'Professional journey',
        script: 'commands/experience/experience.js',
        styles: 'commands/experience/experience.css',
        animation: 'animations/experience-animation.js',
        showInNav: true
    },
    {
        name: 'skills',
        label: 'Skills',
        description: 'Tech stack overview',
        script: 'commands/skills/skills.js',
        styles: 'commands/skills/skills.css',
        animation: 'animations/skills-animation.js',
        showInNav: true
    },
    {
        name: 'projects',
        label: 'Projects',
        description: 'Production & OSS',
        script: 'commands/projects/projects.js',
        styles: 'commands/projects/projects.css',
        animation: 'animations/projects-animation.js',
        showInNav: true
    },
    {
        name: 'education',
        label: 'Education',
        description: 'Academic path',
        script: 'commands/education/education.js',
        styles: 'commands/education/education.css',
        animation: 'animations/education-animation.js',
        showInNav: true
    },
    {
        name: 'cv',
        label: 'CV',
        description: 'Download résumé',
        script: 'commands/cv/cv.js',
        styles: 'commands/cv/cv.css',
        showInNav: true
    },
    {
        name: 'help',
        label: 'Help',
        description: 'All commands',
        script: 'commands/help/help.js',
        styles: 'commands/help/help.css',
        showInNav: true
    },
    { name: 'clear', builtIn: true, showInNav: false },
    { name: 'exit', builtIn: true, showInNav: false }
];

class TerminalApp {
    constructor() {
        this.commands = new Map();
        this.loadedStyles = new Set();
        this.currentCommand = null;
        this.isTyping = false;
        this.commandHistory = [];
        this.historyIndex = -1;
        this.activeAnimationCleanups = [];
        this.mode = 'gui';
        this.navTabs = [];
        this.dom = this.cacheDomElements();
        document.body.classList.add('mode-gui');

        this.init();
    }

    /**
     * Terminal initialization
     */
    init() {
        this.setupEventListeners();
        this.displayWelcome();
        this.registerCommands();
        this.renderCommandTabs();
        this.setupModeToggle();
        this.handleResize();
    }

    cacheDomElements() {
        return {
            terminal: document.querySelector('.terminal'),
            consoleOutput: document.getElementById('console-output'),
            input: document.getElementById('command-input'),
            menuItems: document.querySelectorAll('.menu-item'),
            hamburgerBtn: document.getElementById('hamburger-btn'),
            terminalMenu: document.getElementById('terminal-menu'),
            menuOverlay: document.getElementById('menu-overlay'),
            closeBtn: document.querySelector('.control-btn.close'),
            maximizeBtn: document.querySelector('.control-btn.maximize'),
            modeToggleButtons: document.querySelectorAll('.mode-toggle .toggle-btn'),
            commandTabsContainer: document.getElementById('command-tabs')
        };
    }

    /**
     * Adjust terminal height to work around the 100vh mobile issue
     */
    handleResize() {
        const { terminal } = this.dom;
        if (!terminal) return;
        const setTerminalHeight = () => {
            terminal.style.height = `${window.innerHeight}px`;
        };

        window.addEventListener('resize', setTerminalHeight);
        setTerminalHeight();
    }

    /**
     * Register available commands
     */
    registerCommands() {
        COMMAND_DEFINITIONS.forEach(def => {
            this.commands.set(def.name, {
                script: def.script,
                styles: def.styles,
                animation: def.animation,
                built_in: def.builtIn
            });
        });
    }

    /**
     * Setup de event listeners
     */
    setupEventListeners() {
        const {
            input,
            menuItems,
            hamburgerBtn,
            terminalMenu,
            menuOverlay,
            closeBtn,
            maximizeBtn
        } = this.dom;

        if (!input) return;

        const toggleMenu = () => {
            if (!terminalMenu || !menuOverlay || !hamburgerBtn) return;
            const isOpen = terminalMenu.classList.toggle('active');
            menuOverlay.classList.toggle('active');
            hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
        };

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !this.isTyping) {
                const cmd = input.value.trim().toLowerCase();
                if (cmd) {
                    if (this.commandHistory[0] !== cmd) {
                        this.commandHistory.unshift(cmd);
                        if (this.commandHistory.length > 50) this.commandHistory.pop();
                    }
                    this.historyIndex = -1;
                }
                this.executeCommand(cmd);
                input.value = '';
                return;
            }

            // History navigation with arrows
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (this.historyIndex < this.commandHistory.length - 1) {
                    this.historyIndex++;
                    input.value = this.commandHistory[this.historyIndex];
                    // Mover cursor al final
                    setTimeout(() => input.setSelectionRange(input.value.length, input.value.length), 0);
                }
                return;
            }

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (this.historyIndex > 0) {
                    this.historyIndex--;
                    input.value = this.commandHistory[this.historyIndex];
                } else {
                    this.historyIndex = -1;
                    input.value = '';
                }
                return;
            }

            // Autocomplete with Tab
            if (e.key === 'Tab') {
                e.preventDefault();
                const partial = input.value.trim().toLowerCase();
                if (!partial) return;
                const matches = [...this.commands.keys()].filter(k => k.startsWith(partial));
                if (matches.length === 1) {
                    input.value = matches[0];
                } else if (matches.length > 1) {
                    this.appendToConsole(`\nCommands: ${matches.join('  ')}`);
                }
                return;
            }

        });

        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const command = item.getAttribute('href').substring(1);
                this.executeCommand(command);
                if (terminalMenu && terminalMenu.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });

        if (hamburgerBtn) {
            hamburgerBtn.addEventListener('click', toggleMenu);
        }
        if (menuOverlay) {
            menuOverlay.addEventListener('click', toggleMenu);
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => window.location.reload());
        }
        if (maximizeBtn) {
            maximizeBtn.addEventListener('click', () => this.executeCommand('clear'));
        }

        // Esc: skip typing / close menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.isTyping) {
                    this.skipTyping = true;
                }
                if (terminalMenu && terminalMenu.classList.contains('active')) {
                    toggleMenu();
                }
            }
        });

        // Auto-focus en el input
        input.focus();
        document.addEventListener('click', (e) => {
            if (input && e.target.tagName.toLowerCase() !== 'a' && e.target.id !== 'hamburger-btn') {
                input.focus();
            }
        });
    }

    /**
     * Mensaje de bienvenida
     */
    displayWelcome() {
        const consoleOutput = this.dom.consoleOutput;
        if (!consoleOutput) return;
        const badge = document.createElement('div');
        badge.className = 'retro-badge';
        badge.innerHTML = `
            <span>HismaR Dev</span>
            <div class="welcome-subtitle">Ismail Haddouche Rhali</div>
            <div class="welcome-role">Full-stack · Mobile · Murcia, Spain</div>
        `;

        consoleOutput.appendChild(badge);

        const welcomeLines = [
            { text: `// Welcome to my interactive terminal.`, type: 'comment' },
            { text: `// Explore who I am, what I build, and how I think.`, type: 'comment' },
            { text: ``, type: 'blank' },
            { text: `  help       → list every available command`, type: 'cmd', cmd: 'help' },
            { text: `  about      → personal background and contact`, type: 'cmd', cmd: 'about' },
            { text: `  experience → professional journey`, type: 'cmd', cmd: 'experience' },
            { text: `  projects   → production & open-source work`, type: 'cmd', cmd: 'projects' },
            { text: `  skills     → complete technology stack`, type: 'cmd', cmd: 'skills' },
            { text: `  education  → academic path`, type: 'cmd', cmd: 'education' },
            { text: ``, type: 'blank' },
            { text: `// Tab: autocomplete  ·  ↑↓: command history`, type: 'comment' },
            { text: ``, type: 'blank' }
        ];

        welcomeLines.forEach(line => {
            const pre = document.createElement('pre');
            pre.textContent = line.text;
            if (line.type === 'comment') {
                pre.className = 'welcome-comment';
            } else if (line.type === 'cmd') {
                pre.className = 'welcome-cmd';
                pre.addEventListener('click', () => this.executeCommand(line.cmd));
            }
            consoleOutput.appendChild(pre);
        });
    }

    /**
     * Command execution
     */
    async executeCommand(command) {
        if (!command) return;

        this.appendToConsole(`\n$ ${command}`);

        if (this.handleBuiltInCommands(command)) {
            return;
        }

        if (this.commands.has(command)) {
            this.setActiveTab(command);
            await this.loadAndExecuteCommand(command);
        } else {
            this.setActiveTab(null);
            this.appendToConsole(`Unrecognized command: '${command}'`);
            this.appendToConsole(`Type 'help' to list the available commands.`);
        }
    }

    /**
     * Handle built-in commands
     */
    handleBuiltInCommands(command) {
        switch (command) {
            case 'clear':
                this.cleanupAnimations();
                if (this.dom.consoleOutput) {
                    this.dom.consoleOutput.innerHTML = '';
                }
                this.currentCommand = null;
                this.displayWelcome();
                return true;

            case 'exit':
                this.appendToConsole('Restarting terminal...');
                setTimeout(() => window.location.reload(), 800);
                return true;

            default:
                return false;
        }
    }

    /**
     * Detiene y limpia todas las animaciones activas
     */
    cleanupAnimations() {
        this.activeAnimationCleanups.forEach(fn => {
            try { fn(); } catch (e) { /* ignora errores de cleanup */ }
        });
        this.activeAnimationCleanups = [];
    }

    /**
     * Register animation cleanup callbacks
     */
    registerAnimationCleanup(fn) {
        if (typeof fn === 'function') {
            this.activeAnimationCleanups.push(fn);
        }
    }

    /**
     * Load and execute command modules
     */
    async loadAndExecuteCommand(commandName) {
        try {
            this.cleanupAnimations();

            const config = this.commands.get(commandName);

            if (config.styles) {
                await this.loadCSS(config.styles);
            }

            const commandModule = await this.loadScript(config.script);

            let animationModule = null;
            if (config.animation) {
                animationModule = await this.loadScript(config.animation);
            }

            if (commandModule && commandModule.execute) {
                await commandModule.execute(this, animationModule);
                this.currentCommand = commandName;

                // Registrar cleanup de animaciones que hayan definido _cleanup
                const sidebar = this.lastCreatedSidebar;
                if (sidebar && typeof sidebar._cleanup === 'function') {
                    this.registerAnimationCleanup(sidebar._cleanup);
                }
            }

        } catch (error) {
            console.error(`Error loading command ${commandName}:`, error);
            this.appendToConsole(`Error: Could not load module '${commandName}'`);
        }
    }

    /**
     * Dynamically load CSS (without unnecessary cache busting)
     */
    loadCSS(path) {
        return new Promise((resolve, reject) => {
            // Reuse already loaded stylesheet
            if (this.loadedStyles.has(path)) {
                resolve();
                return;
            }

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = path + '?v=1.0.5'; // cache busting
            link.onload = () => {
                this.loadedStyles.add(path);
                resolve();
            };
            link.onerror = () => reject(new Error(`Failed to load CSS: ${path}`));
            document.head.appendChild(link);
        });
    }

    /**
     * Dynamically load JavaScript (reuse loaded modules)
     */
    loadScript(path) {
        return new Promise((resolve, reject) => {
            const moduleName = path.replace(/[^a-zA-Z0-9]/g, '_');

            // If the module is already in memory, reuse it
            if (window[moduleName]) {
                resolve(window[moduleName]);
                return;
            }

            const script = document.createElement('script');
            script.src = path + '?v=1.0.5'; // cache busting
            script.onload = () => {
                resolve(window[moduleName] || {});
            };
            script.onerror = () => reject(new Error(`Failed to load script: ${path}`));
            document.head.appendChild(script);
        });
    }

    renderCommandTabs() {
        const { commandTabsContainer } = this.dom;
        if (!commandTabsContainer) return;

        commandTabsContainer.innerHTML = '';
        this.navTabs = [];

        const navDefinitions = COMMAND_DEFINITIONS.filter(def => !def.builtIn && def.showInNav !== false);
        navDefinitions.forEach(def => {
            const tab = document.createElement('button');
            tab.className = 'command-tab';
            tab.dataset.command = def.name;
            tab.setAttribute('role', 'tab');
            tab.setAttribute('aria-selected', 'false');
            tab.innerHTML = `
                <span class="command-tab-title">/${def.name}</span>
                <span class="command-tab-desc">${def.description || ''}</span>
            `;
            tab.addEventListener('click', () => {
                if (this.mode === 'cli') {
                    this.setMode('gui');
                }
                this.executeCommand(def.name);
            });
            commandTabsContainer.appendChild(tab);
            this.navTabs.push(tab);
        });
    }

    setActiveTab(commandName) {
        if (!this.navTabs.length) return;
        this.navTabs.forEach(tab => {
            const isActive = !!commandName && tab.dataset.command === commandName;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', String(isActive));
        });
    }

    setupModeToggle() {
        const { modeToggleButtons, input } = this.dom;
        if (!modeToggleButtons || !modeToggleButtons.length) return;

        modeToggleButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.dataset.mode;
                this.setMode(mode);
            });
        });

        // Initialize states
        this.applyModeState();
        if (input) input.placeholder = "Click a card or type 'help' to begin...";
    }

    setMode(mode) {
        if (mode !== 'cli' && mode !== 'gui') return;
        if (this.mode === mode) return;
        this.mode = mode;
        this.applyModeState();
    }

    applyModeState() {
        const { modeToggleButtons, input } = this.dom;
        document.body.classList.toggle('mode-cli', this.mode === 'cli');
        document.body.classList.toggle('mode-gui', this.mode === 'gui');

        if (modeToggleButtons && modeToggleButtons.length) {
            modeToggleButtons.forEach(btn => {
                const isActive = btn.dataset.mode === this.mode;
                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-pressed', String(isActive));
            });
        }

        if (input) {
            if (this.mode === 'cli') {
                input.placeholder = "Type a command (e.g. 'help')";
                input.focus();
            } else {
                input.placeholder = "Click a card or type 'help' to begin...";
            }
        }
    }

    /**
     * Append text to the console with typing effect
     */
    async typeText(text, speed = 30) {
        this.isTyping = true;
        this.skipTyping = false;

        const consoleOutput = document.getElementById('console-output');
        const textContainer = document.createElement('span');
        consoleOutput.appendChild(textContainer);

        for (let i = 0; i < text.length; i++) {
            if (this.skipTyping) {
                textContainer.textContent = text;
                break;
            }

            textContainer.textContent = text.slice(0, i + 1);
            this.autoScrollConsole();

            if (text[i] !== ' ') {
                await this.sleep(speed);
            }
        }

        this.isTyping = false;
        this.skipTyping = false;
    }

    /**
     * Append raw text to the console instantly
     */
    appendToConsole(text) {
        const consoleOutput = document.getElementById('console-output');
        const textNode = document.createElement('pre');
        textNode.textContent = text;
        consoleOutput.appendChild(textNode);
        this.autoScrollConsole();
    }

    /**
     * Auto-scroll del console
     */
    autoScrollConsole(element = null) {
        const output = document.getElementById('console-output');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            output.scrollTop = output.scrollHeight;
        }
    }

    /**
     * Utilidad sleep
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Crear container para comando con grid layout
     */
    createCommandContainer(commandName) {
        const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2);

        const container = document.createElement('div');
        container.className = 'command-container fade-in';
        container.id = `${commandName}-container-${uniqueId}`;

        const content = document.createElement('div');
        content.className = `command-content ${commandName}-content`;
        content.id = `${commandName}-content-${uniqueId}`;

        const sidebar = document.createElement('div');
        sidebar.className = 'command-sidebar';
        sidebar.id = `${commandName}-sidebar-${uniqueId}`;

        container.appendChild(content);
        container.appendChild(sidebar);

        document.getElementById('console-output').appendChild(container);

        this.lastCreatedSidebar = sidebar;

        return { container, content, sidebar };
    }
}

// Global utilities for command modules
window.TerminalUtils = {
    sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

    createElement: (tag, className, content) => {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (content) element.textContent = content;
        return element;
    },

    createList: (items, className = 'content-list') => {
        const ul = document.createElement('ul');
        ul.className = className;
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            ul.appendChild(li);
        });
        return ul;
    }
};

// Initialize the application when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.terminal = new TerminalApp();
});
