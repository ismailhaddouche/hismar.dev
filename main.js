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
        
        this.init();
    }

    /**
     * Inicialización del terminal
     */
    init() {
        this.setupEventListeners();
        this.displayWelcome();
        this.registerCommands();
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

        const toggleMenu = () => {
            terminalMenu.classList.toggle('active');
            menuOverlay.classList.toggle('active');
        };

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !this.isTyping) {
                this.executeCommand(input.value.trim().toLowerCase());
                input.value = '';
            }

            // Skip typing con Escape
            if (e.key === 'Escape' && this.isTyping) {
                this.skipTyping = true;
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
        badge.innerHTML = '<span>HismaR Dev</span>';
        
        const consoleOutput = document.getElementById('console-output');
        consoleOutput.appendChild(badge);

        const helpText = `Escribe 'help' para ver los comandos disponibles\n\n`;
        this.appendToConsole(helpText);
    }

    /**
     * Ejecución de comandos
     */
    async executeCommand(command) {
        if (!command) return;

        this.appendToConsole(`\n$ ${command}`);

        // Comandos built-in
        if (this.handleBuiltInCommands(command)) {
            return;
        }

        // Comandos modulares
        if (this.commands.has(command)) {
            await this.loadAndExecuteCommand(command);
        } else {
            this.appendToConsole(`Comando no reconocido: ${command}`);
            this.appendToConsole(`Escribe 'help' para ver comandos disponibles.`);
        }

    }

    /**
     * Manejo de comandos integrados
     */
    handleBuiltInCommands(command) {
        switch (command) {
            case 'clear':
                document.getElementById('console-output').innerHTML = '';
                this.displayWelcome();
                return true;
                
            case 'exit':
                this.appendToConsole('Cerrando terminal...');
                setTimeout(() => window.close(), 1000);
                return true;
                
            default:
                return false;
        }
    }

    /**
     * Carga y ejecución de comando modular
     */
    async loadAndExecuteCommand(commandName) {
        try {
            const config = this.commands.get(commandName);
            
            // Cargar CSS específico
            if (config.styles) {
                await this.loadCSS(config.styles);
            }

            // Cargar script del comando
            const commandModule = await this.loadScript(config.script);
            
            // Cargar animación si existe
            let animationModule = null;
            if (config.animation) {
                animationModule = await this.loadScript(config.animation);
            }

            // Ejecutar comando
            if (commandModule && commandModule.execute) {
                await commandModule.execute(this, animationModule);
                this.currentCommand = commandName;
            }

        } catch (error) {
            console.error(`Error loading command ${commandName}:`, error);
            this.appendToConsole(`Error: No se pudo cargar el comando ${commandName}`);
        }
    }

    /**
     * Carga dinámica de CSS
     */
    loadCSS(path) {
        return new Promise((resolve, reject) => {
            const cacheBustingPath = `${path}?v=${new Date().getTime()}`;

            const existingLink = document.querySelector(`link[href^="${path}"]`);
            if (existingLink) {
                existingLink.remove();
            }

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = cacheBustingPath;
            link.onload = resolve;
            link.onerror = reject;
            document.head.appendChild(link);
        });
    }

    /**
     * Carga dinámica de JavaScript
     */
    loadScript(path) {
        return new Promise((resolve, reject) => {
            const cacheBustingPath = `${path}?v=${new Date().getTime()}`;

            const existingScript = document.querySelector(`script[src^="${path}"]`);
            if (existingScript) {
                existingScript.remove();
            }

            const script = document.createElement('script');
            script.src = cacheBustingPath;
            script.onload = () => {
                const moduleName = path.replace(/[^a-zA-Z0-9]/g, '_');
                resolve(window[moduleName] || {});
            };
            script.onerror = reject;
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
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            const console = document.getElementById('console-output');
            console.scrollTop = console.scrollHeight;
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
        const container = document.createElement('div');
        container.className = 'command-container fade-in';
        container.id = `${commandName}-container`;
        
        const content = document.createElement('div');
        content.className = `command-content ${commandName}-content`;
        content.id = `${commandName}-content`;
        
        const sidebar = document.createElement('div');
        sidebar.className = 'command-sidebar';
        sidebar.id = `${commandName}-sidebar`;
        
        container.appendChild(content);
        container.appendChild(sidebar);
        
        document.getElementById('console-output').appendChild(container);
        
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