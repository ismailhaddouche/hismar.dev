// JavaScript para hismar.dev - Portfolio Terminal

// Variables globales
let currentCommand = '';
let commandHistory = [];
let historyIndex = -1;
let isAnimating = false;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    console.log('Terminal cargado - hismar.dev');
    initializeMenuButtons();
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

// Función base para ejecutar comandos (se expandirá en pasos siguientes)
function executeCommand(command) {
    console.log('Ejecutando comando:', command);
    // Lógica de comandos se implementará en pasos siguientes
}