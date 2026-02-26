/**
 * TERMINAL PRINCIPAL - ORQUESTADOR MODULAR
 * Gestiona la carga dinámica de comandos y sus dependencias
 */

class TerminalApp {
    constructor() {
        this.commands = new Map();
        this.loadedStyles = new Set();
        this.currentCommand = null;
        this.isTyping = false;
        this.commandHistory = [];
        this.historyIndex = -1;
        this.activeAnimationCleanups = [];

        this.init();
    }

    /**
     * Inicialización del terminal
     */
    init() {
        this.setupEventListeners();
        this.displayWelcome();
        this.registerCommands();
        this.handleResize();
    }

    /**
     * Ajusta la altura del terminal para solucionar el problema de 100vh en móviles
     */
    handleResize() {
        const terminal = document.querySelector('.terminal');
        const setTerminalHeight = () => {
            terminal.style.height = `${window.innerHeight}px`;
        };

        window.addEventListener('resize', setTerminalHeight);
        setTerminalHeight();
    }

    /**
     * Registro de comandos disponibles
     */
    registerCommands() {
        const availableCommands = {
            'about': {
                script: 'commands/about/about.js',
                styles: 'commands/about/about.css',
                animation: 'animations/face-animation.js'
            },
            'skills': {
                script: 'commands/skills/skills.js',
                styles: 'commands/skills/skills.css',
                animation: 'animations/skills-animation.js'
            },
            'projects': {
                script: 'commands/projects/projects.js',
                styles: 'commands/projects/projects.css',
                animation: 'animations/projects-animation.js'
            },
            'education': {
                script: 'commands/education/education.js',
                styles: 'commands/education/education.css',
                animation: 'animations/education-animation.js'
            },
            'experience': {
                script: 'commands/experience/experience.js',
                styles: 'commands/experience/experience.css',
                animation: 'animations/experience-animation.js'
            },
            'help': {
                script: 'commands/help/help.js',
                styles: 'commands/help/help.css'
            },
            'clear': { built_in: true },
            'exit': { built_in: true }
        };

        Object.entries(availableCommands).forEach(([name, config]) => {
            this.commands.set(name, config);
        });
    }

    /**
     * Setup de event listeners
     */
    setupEventListeners() {
        const input = document.getElementById('command-input');
        const menuItems = document.querySelectorAll('.menu-item');
        const hamburgerBtn = document.getElementById('hamburger-btn');
        const terminalMenu = document.getElementById('terminal-menu');
        const menuOverlay = document.getElementById('menu-overlay');
        const closeBtn = document.querySelector('.control-btn.close');
        const maximizeBtn = document.querySelector('.control-btn.maximize');

        const toggleMenu = () => {
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

            // Navegación del historial con flechas
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

            // Autocompletion con Tab
            if (e.key === 'Tab') {
                e.preventDefault();
                const partial = input.value.trim().toLowerCase();
                if (!partial) return;
                const matches = [...this.commands.keys()].filter(k => k.startsWith(partial));
                if (matches.length === 1) {
                    input.value = matches[0];
                } else if (matches.length > 1) {
                    this.appendToConsole(`\nComandos: ${matches.join('  ')}`);
                }
                return;
            }

        });

        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const command = item.getAttribute('href').substring(1);
                this.executeCommand(command);
                if (terminalMenu.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });

        hamburgerBtn.addEventListener('click', toggleMenu);
        menuOverlay.addEventListener('click', toggleMenu);

        closeBtn.addEventListener('click', () => window.location.reload());
        maximizeBtn.addEventListener('click', () => this.executeCommand('clear'));

        // Auto-focus en el input
        input.focus();
        document.addEventListener('click', (e) => {
            if (e.target.tagName.toLowerCase() !== 'a' && e.target.id !== 'hamburger-btn') {
                input.focus();
            }
        });
    }

    /**
     * Mensaje de bienvenida
     */
    displayWelcome() {
        const badge = document.createElement('div');
        badge.className = 'retro-badge';
        badge.innerHTML = `
            <span>HismaR Dev</span>
            <div class="welcome-subtitle">Ismail Haddouche Rhali</div>
            <div class="welcome-role">Full Stack · Mobile · Cloud · Murcia, España</div>
        `;

        const consoleOutput = document.getElementById('console-output');
        consoleOutput.appendChild(badge);

        const welcomeLines = [
            { text: `// Bienvenido a mi terminal interactivo.`, type: 'comment' },
            { text: `// Explora quién soy, qué construyo y cómo pienso.`, type: 'comment' },
            { text: ``, type: 'blank' },
            { text: `  help       → ver todos los comandos disponibles`, type: 'cmd', cmd: 'help' },
            { text: `  about      → mi historia y contacto`, type: 'cmd', cmd: 'about' },
            { text: `  experience → trayectoria laboral`, type: 'cmd', cmd: 'experience' },
            { text: `  projects   → proyectos reales en producción y open source`, type: 'cmd', cmd: 'projects' },
            { text: `  skills     → stack tecnológico completo`, type: 'cmd', cmd: 'skills' },
            { text: `  education  → formación académica`, type: 'cmd', cmd: 'education' },
            { text: ``, type: 'blank' },
            { text: `// Tab: autocompletar  ·  ↑↓: historial de comandos`, type: 'comment' },
            { text: ``, type: 'blank' }
        ];

        const welcomeOutput = document.getElementById('console-output');
        welcomeLines.forEach(line => {
            const pre = document.createElement('pre');
            pre.textContent = line.text;
            if (line.type === 'comment') {
                pre.className = 'welcome-comment';
            } else if (line.type === 'cmd') {
                pre.className = 'welcome-cmd';
                pre.addEventListener('click', () => this.executeCommand(line.cmd));
            }
            welcomeOutput.appendChild(pre);
        });
    }

    /**
     * Ejecución de comandos
     */
    async executeCommand(command) {
        if (!command) return;

        this.appendToConsole(`\n$ ${command}`);

        if (this.handleBuiltInCommands(command)) {
            return;
        }

        if (this.commands.has(command)) {
            await this.loadAndExecuteCommand(command);
        } else {
            this.appendToConsole(`Comando no reconocido: '${command}'`);
            this.appendToConsole(`Escribe 'help' para ver los comandos disponibles.`);
        }
    }

    /**
     * Manejo de comandos integrados
     */
    handleBuiltInCommands(command) {
        switch (command) {
            case 'clear':
                this.cleanupAnimations();
                document.getElementById('console-output').innerHTML = '';
                this.currentCommand = null;
                this.displayWelcome();
                return true;

            case 'exit':
                this.appendToConsole('Reiniciando terminal...');
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
     * Registra una función de cleanup de animación
     */
    registerAnimationCleanup(fn) {
        if (typeof fn === 'function') {
            this.activeAnimationCleanups.push(fn);
        }
    }

    /**
     * Carga y ejecución de comando modular
     */
    async loadAndExecuteCommand(commandName) {
        try {
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
            this.appendToConsole(`Error: No se pudo cargar el módulo '${commandName}'`);
        }
    }

    /**
     * Carga dinámica de CSS (sin caché busting innecesario)
     */
    loadCSS(path) {
        return new Promise((resolve, reject) => {
            // Reusar hoja ya cargada
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
     * Carga dinámica de JavaScript (reutiliza módulos ya cargados)
     */
    loadScript(path) {
        return new Promise((resolve, reject) => {
            const moduleName = path.replace(/[^a-zA-Z0-9]/g, '_');

            // Si el módulo ya está en memoria, reutilizarlo
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

    /**
     * Añadir texto al console con efecto typing
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
     * Añadir texto directo al console
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

// Utilidades globales para los módulos
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

// Inicializar aplicación cuando se cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
    window.terminal = new TerminalApp();
});
