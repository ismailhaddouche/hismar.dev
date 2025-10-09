// JavaScript para hismar.dev - Portfolio Terminal

// Variables globales
let currentCommand = '';
let commandHistory = [];
let historyIndex = -1;
let isAnimating = false;
let skipAnimation = false;

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
    
    // Resetear estados
    isAnimating = false;
    skipAnimation = false;
    
    // Remover estado activo de botones del menú
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.classList.remove('active');
    });
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

// Función base para ejecutar comandos (se expandirá en pasos siguientes)
function executeCommand(command) {
    console.log('Ejecutando comando:', command);
    addCommandToOutput(command);
    // Lógica de comandos específicos se implementará en pasos siguientes
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