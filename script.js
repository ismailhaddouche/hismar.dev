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

// Función base para ejecutar comandos (se expandirá en pasos siguientes)
function executeCommand(command) {
    console.log('Ejecutando comando:', command);
    // Lógica de comandos se implementará en pasos siguientes
}