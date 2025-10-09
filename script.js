// JavaScript para hismar.dev - Portfolio Terminal

// Variables globales
let currentCommand = '';
let commandHistory = [];
let historyIndex = -1;
let isAnimating = false;
let skipAnimation = false;
let activeAnimationTimeouts = [];
let activeAnimationIntervals = [];
let commandExecutionQueue = [];

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    console.log('Terminal cargado - hismar.dev');
    initializeMenuButtons();
    initializeControlButtons();
    initializeCommandInput();
});

// Inicializar botones del menú
function initializeMenuButtons() {
    const menuButtons = document.querySelectorAll('.menu-btn');
    
    menuButtons.forEach(button => {
        button.addEventListener('click', function() {
            const command = this.getAttribute('data-command');
            executeCommand(command);
            
            // Actualizar estado activo
            menuButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Inicializar botones de control
function initializeControlButtons() {
    const skipBtn = document.getElementById('skip-btn');
    const clearBtn = document.getElementById('clear-btn');
    
    skipBtn.addEventListener('click', function() {
        skipAnimation = true;
        console.log('Saltando animación');
    });
    
    clearBtn.addEventListener('click', function() {
        clearConsole();
    });
}

// Función para limpiar la consola
function clearConsole() {
    const consoleOutput = document.getElementById('console-output');
    consoleOutput.innerHTML = '';
    console.log('Consola limpiada');
    
    // Limpiar todas las animaciones activas (sandbox cleanup)
    clearAllAnimations();
    
    // Resetear estados
    isAnimating = false;
    skipAnimation = false;
    
    // Remover estado activo de botones del menú
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.classList.remove('active');
    });
}

// Sistema sandbox: limpiar todas las animaciones activas
function clearAllAnimations() {
    // Limpiar todos los timeouts activos
    activeAnimationTimeouts.forEach(timeout => clearTimeout(timeout));
    activeAnimationTimeouts = [];
    
    // Limpiar todos los intervals activos
    activeAnimationIntervals.forEach(interval => clearInterval(interval));
    activeAnimationIntervals = [];
    
    // Limpiar queue de ejecución
    commandExecutionQueue = [];
}

// Sandbox: wrapper seguro para setTimeout
function safeTimeout(callback, delay) {
    const timeoutId = setTimeout(() => {
        // Remover este timeout de la lista activa
        const index = activeAnimationTimeouts.indexOf(timeoutId);
        if (index > -1) {
            activeAnimationTimeouts.splice(index, 1);
        }
        callback();
    }, delay);
    
    activeAnimationTimeouts.push(timeoutId);
    return timeoutId;
}

// Sandbox: wrapper seguro para setInterval
function safeInterval(callback, delay) {
    const intervalId = setInterval(callback, delay);
    activeAnimationIntervals.push(intervalId);
    return intervalId;
}

// Sandbox: detener interval específico
function clearSafeInterval(intervalId) {
    clearInterval(intervalId);
    const index = activeAnimationIntervals.indexOf(intervalId);
    if (index > -1) {
        activeAnimationIntervals.splice(index, 1);
    }
}

// Inicializar input de comandos
function initializeCommandInput() {
    const commandInput = document.getElementById('command-input');
    const cursor = document.getElementById('cursor');
    
    // Manejar eventos del teclado
    commandInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const command = this.value.trim();
            if (command) {
                executeCommand(command);
                addToHistory(command);
                this.value = '';
                historyIndex = -1;
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            navigateHistory('up');
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            navigateHistory('down');
        } else if (e.key === 'Tab') {
            e.preventDefault();
            autocomplete();
        }
    });
    
    // Mostrar/ocultar cursor basado en focus
    commandInput.addEventListener('focus', function() {
        cursor.style.display = 'inline';
    });
    
    commandInput.addEventListener('blur', function() {
        cursor.style.display = 'inline'; // Mantener cursor visible
    });
}

// Agregar comando al historial
function addToHistory(command) {
    if (commandHistory[commandHistory.length - 1] !== command) {
        commandHistory.push(command);
    }
}

// Navegar por el historial de comandos
function navigateHistory(direction) {
    const commandInput = document.getElementById('command-input');
    
    if (direction === 'up') {
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            commandInput.value = commandHistory[commandHistory.length - 1 - historyIndex];
        }
    } else if (direction === 'down') {
        if (historyIndex > 0) {
            historyIndex--;
            commandInput.value = commandHistory[commandHistory.length - 1 - historyIndex];
        } else if (historyIndex === 0) {
            historyIndex = -1;
            commandInput.value = '';
        }
    }
}

// Autocompletado básico
function autocomplete() {
    const commandInput = document.getElementById('command-input');
    const currentValue = commandInput.value.toLowerCase();
    const availableCommands = ['about', 'skills', 'projects', 'education', 'help'];
    
    for (let command of availableCommands) {
        if (command.startsWith(currentValue) && command !== currentValue) {
            commandInput.value = command;
            break;
        }
    }
}

// Función principal para ejecutar comandos con sistema sandbox
function executeCommand(command) {
    console.log('Ejecutando comando:', command);
    
    // Si hay una animación en progreso, limpiarla primero (sandbox)
    if (isAnimating) {
        clearAllAnimations();
    }
    
    // Marcar como animando
    isAnimating = true;
    
    // Agregar comando al output
    addCommandToOutput(command);
    
    // Ejecutar comando específico de manera segura
    executeSpecificCommand(command.toLowerCase());
}

// Ejecutar comando específico
function executeSpecificCommand(command) {
    switch(command) {
        case 'about':
            executeAboutCommand();
            break;
        case 'skills':
            executeSkillsCommand();
            break;
        case 'projects':
            executeProjectsCommand();
            break;
        case 'education':
            executeEducationCommand();
            break;
        case 'help':
            executeHelpCommand();
            break;
        case 'clear':
            clearConsole();
            break;
        default:
            executeUnknownCommand(command);
            break;
    }
}

// Placeholders para comandos específicos (se implementarán en el siguiente paso)
function executeAboutCommand() {
    addOutputLine("Cargando información personal...", 'info');
    safeTimeout(() => {
        isAnimating = false;
    }, 1000);
}

function executeSkillsCommand() {
    addOutputLine("Mostrando habilidades técnicas...", 'info');
    safeTimeout(() => {
        isAnimating = false;
    }, 1000);
}

function executeProjectsCommand() {
    addOutputLine("Cargando proyectos...", 'info');
    safeTimeout(() => {
        isAnimating = false;
    }, 1000);
}

function executeEducationCommand() {
    addOutputLine("Mostrando formación académica...", 'info');
    safeTimeout(() => {
        isAnimating = false;
    }, 1000);
}

function executeHelpCommand() {
    addOutputLine("Mostrando ayuda...", 'info');
    safeTimeout(() => {
        isAnimating = false;
    }, 1000);
}

function executeUnknownCommand(command) {
    addOutputLine(`Comando no encontrado: ${command}`, 'error');
    addOutputLine('Escribe "help" para ver comandos disponibles', 'hint');
    safeTimeout(() => {
        isAnimating = false;
    }, 500);
}

// Agregar comando al output de la consola
function addCommandToOutput(command) {
    const consoleOutput = document.getElementById('console-output');
    const commandLine = document.createElement('div');
    commandLine.className = 'command-line';
    commandLine.innerHTML = `<span class="prompt-prefix">hismar@dev:~$ </span><span class="command-text">${command}</span>`;
    consoleOutput.appendChild(commandLine);
    
    // Auto-scroll al final
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

// Agregar línea de output con diferentes tipos
function addOutputLine(text, type = 'normal') {
    const consoleOutput = document.getElementById('console-output');
    const outputLine = document.createElement('div');
    outputLine.className = `output-line output-${type}`;
    outputLine.textContent = text;
    consoleOutput.appendChild(outputLine);
    
    // Auto-scroll al final
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
    
    return outputLine;
}