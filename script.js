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
    
    // Ejecutar comando about por defecto (página de inicio)
    safeTimeout(() => {
        executeCommand('about');
        document.querySelector('[data-command="about"]').classList.add('active');
    }, 1000);
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

// Comando ABOUT - Información personal con cara pixel art
function executeAboutCommand() {
    addOutputLine("Inicializando perfil personal...", 'info');
    
    safeTimeout(() => {
        createAboutSection();
    }, 800);
}

function createAboutSection() {
    const consoleOutput = document.getElementById('console-output');
    
    // Container principal
    const aboutContainer = document.createElement('div');
    aboutContainer.className = 'about-container';
    
    // Información personal (lado izquierdo)
    const infoSection = document.createElement('div');
    infoSection.className = 'about-info';
    
    // Cara pixel art (lado derecho)
    const faceSection = document.createElement('div');
    faceSection.className = 'about-face';
    faceSection.innerHTML = createPixelFace();
    
    // Contenido de información
    const currentDate = new Date();
    const birthDate = new Date('1988-05-14');
    const age = Math.floor((currentDate - birthDate) / (365.25 * 24 * 60 * 60 * 1000));
    
    infoSection.innerHTML = `
        <div class="info-header">
            <h2 class="name">Ismail Haddouche Rhali</h2>
        </div>
        <div class="info-details">
            <div class="info-item">
                <span class="label">Edad:</span>
                <span class="value">${age} años</span>
            </div>
            <div class="info-item">
                <span class="label">Profesión:</span>
                <span class="value">Developer/DevOp</span>
            </div>
            <div class="info-item">
                <span class="label">GitHub:</span>
                <a href="https://github.com/ismailhaddouche" target="_blank" class="link">github.com/ismailhaddouche</a>
            </div>
            <div class="info-item">
                <span class="label">LinkedIn:</span>
                <a href="https://linkedin.com/in/ismailhaddouche" target="_blank" class="link">linkedin.com/in/ismailhaddouche</a>
            </div>
        </div>
        <div class="info-description">
            <p>Desarrollador apasionado de la tecnología y la informática. Friki de los videojuegos de mesa, el anime y la lectura de fantasía. Fan de Zerocalcare. Y más friki aún del cloud computing, estructura de sistemas y la ciberseguridad.</p>
        </div>
    `;
    
    aboutContainer.appendChild(infoSection);
    aboutContainer.appendChild(faceSection);
    consoleOutput.appendChild(aboutContainer);
    
    // Inicializar seguimiento del mouse para los ojos
    initializeEyeTracking();
    
    // Scroll y finalizar animación
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
    safeTimeout(() => {
        isAnimating = false;
    }, 500);
}

function createPixelFace() {
    return `
        <div class="pixel-face">
            <div class="face-row">
                <div class="pixel bg"></div><div class="pixel bg"></div><div class="pixel head"></div><div class="pixel head"></div><div class="pixel head"></div><div class="pixel bg"></div><div class="pixel bg"></div>
            </div>
            <div class="face-row">
                <div class="pixel bg"></div><div class="pixel head"></div><div class="pixel head"></div><div class="pixel head"></div><div class="pixel head"></div><div class="pixel head"></div><div class="pixel bg"></div>
            </div>
            <div class="face-row">
                <div class="pixel head"></div><div class="pixel head"></div><div class="pixel head"></div><div class="pixel head"></div><div class="pixel head"></div><div class="pixel head"></div><div class="pixel head"></div>
            </div>
            <div class="face-row">
                <div class="pixel head"></div><div class="pixel eye-left eye"><div class="pupil"></div></div><div class="pixel head"></div><div class="pixel head"></div><div class="pixel head"></div><div class="pixel eye-right eye"><div class="pupil"></div></div><div class="pixel head"></div>
            </div>
            <div class="face-row">
                <div class="pixel head"></div><div class="pixel head"></div><div class="pixel head"></div><div class="pixel nose"></div><div class="pixel head"></div><div class="pixel head"></div><div class="pixel head"></div>
            </div>
            <div class="face-row">
                <div class="pixel head"></div><div class="pixel head"></div><div class="pixel mouth"></div><div class="pixel mouth"></div><div class="pixel mouth"></div><div class="pixel head"></div><div class="pixel head"></div>
            </div>
            <div class="face-row">
                <div class="pixel bg"></div><div class="pixel head"></div><div class="pixel head"></div><div class="pixel head"></div><div class="pixel head"></div><div class="pixel head"></div><div class="pixel bg"></div>
            </div>
        </div>
    `;
}

function initializeEyeTracking() {
    const eyeLeft = document.querySelector('.eye-left .pupil');
    const eyeRight = document.querySelector('.eye-right .pupil');
    
    if (!eyeLeft || !eyeRight) return;
    
    function updateEyePosition(e) {
        const eyes = [eyeLeft, eyeRight];
        
        eyes.forEach(pupil => {
            const eye = pupil.parentElement;
            const eyeRect = eye.getBoundingClientRect();
            const eyeCenterX = eyeRect.left + eyeRect.width / 2;
            const eyeCenterY = eyeRect.top + eyeRect.height / 2;
            
            const deltaX = e.clientX - eyeCenterX;
            const deltaY = e.clientY - eyeCenterY;
            const angle = Math.atan2(deltaY, deltaX);
            const distance = Math.min(8, Math.sqrt(deltaX * deltaX + deltaY * deltaY) / 10);
            
            const pupilX = Math.cos(angle) * distance;
            const pupilY = Math.sin(angle) * distance;
            
            pupil.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
        });
    }
    
    document.addEventListener('mousemove', updateEyePosition);
    
    // Limpiar event listener cuando se limpie la consola
    const originalClearConsole = clearConsole;
    clearConsole = function() {
        document.removeEventListener('mousemove', updateEyePosition);
        originalClearConsole();
    };
}

function executeSkillsCommand() {
    addOutputLine("Inicializando matriz de habilidades...", 'info');
    
    safeTimeout(() => {
        createSkillsSection();
    }, 800);
}

function createSkillsSection() {
    const consoleOutput = document.getElementById('console-output');
    
    const skillsContainer = document.createElement('div');
    skillsContainer.className = 'skills-container';
    
    // Crear sección del cerebro pixel art
    const brainSection = document.createElement('div');
    brainSection.className = 'skills-brain-section';
    brainSection.innerHTML = createPixelBrain();
    
    // Crear sección de tecnologías
    const techSection = document.createElement('div');
    techSection.className = 'skills-tech-section';
    
    const skillsData = [
        {
            category: 'Lenguajes',
            color: '#ff6b6b',
            skills: ['Kotlin', 'Python', 'Java', 'C#', 'SQL']
        },
        {
            category: 'Bases de datos',
            color: '#4ecdc4',
            skills: ['SQLite', 'MySQL', 'PostgreSQL', 'MongoDB', 'Firebase']
        },
        {
            category: 'Cloud',
            color: '#45b7d1',
            skills: ['AWS', 'Terraform', 'CI/CD']
        },
        {
            category: 'Control de versiones',
            color: '#96ceb4',
            skills: ['Git', 'GitHub']
        }
    ];
    
    let techHTML = '<div class="skills-categories">';
    skillsData.forEach(category => {
        techHTML += `
            <div class="skill-category">
                <h3 class="category-title" style="color: ${category.color}">${category.category}</h3>
                <div class="skill-badges">
                    ${category.skills.map(skill => `<span class="skill-badge" style="border-color: ${category.color}">${skill}</span>`).join('')}
                </div>
            </div>
        `;
    });
    techHTML += '</div>';
    
    techSection.innerHTML = techHTML;
    
    skillsContainer.appendChild(brainSection);
    skillsContainer.appendChild(techSection);
    consoleOutput.appendChild(skillsContainer);
    
    // Inicializar animación del cerebro
    initializeBrainAnimation();
    
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
    
    safeTimeout(() => {
        isAnimating = false;
    }, 500);
}

function createPixelBrain() {
    return `
        <div class="pixel-brain-container">
            <div class="brain-title">🧠 Absorbiendo conocimientos...</div>
            <div class="pixel-brain" id="brain">
                <div class="brain-row">
                    <div class="brain-pixel bg"></div><div class="brain-pixel bg"></div><div class="brain-pixel brain"></div><div class="brain-pixel brain"></div><div class="brain-pixel brain"></div><div class="brain-pixel bg"></div>
                </div>
                <div class="brain-row">
                    <div class="brain-pixel bg"></div><div class="brain-pixel brain"></div><div class="brain-pixel brain"></div><div class="brain-pixel brain"></div><div class="brain-pixel brain"></div><div class="brain-pixel brain"></div>
                </div>
                <div class="brain-row">
                    <div class="brain-pixel brain"></div><div class="brain-pixel brain"></div><div class="brain-pixel eye brain-eye" id="brain-eye-left"></div><div class="brain-pixel brain"></div><div class="brain-pixel eye brain-eye" id="brain-eye-right"></div><div class="brain-pixel brain"></div>
                </div>
                <div class="brain-row">
                    <div class="brain-pixel brain"></div><div class="brain-pixel brain"></div><div class="brain-pixel brain"></div><div class="brain-pixel brain"></div><div class="brain-pixel brain"></div><div class="brain-pixel brain"></div>
                </div>
                <div class="brain-row">
                    <div class="brain-pixel bg"></div><div class="brain-pixel brain"></div><div class="brain-pixel brain"></div><div class="brain-pixel brain"></div><div class="brain-pixel brain"></div><div class="brain-pixel bg"></div>
                </div>
            </div>
            <div class="tech-particles" id="tech-particles"></div>
        </div>
    `;
}

function initializeBrainAnimation() {
    const brainEyeLeft = document.getElementById('brain-eye-left');
    const brainEyeRight = document.getElementById('brain-eye-right');
    const particlesContainer = document.getElementById('tech-particles');
    
    if (!brainEyeLeft || !brainEyeRight || !particlesContainer) return;
    
    // Crear partículas de tecnologías
    const technologies = ['⚛️', '🐍', '☕', '⚙️', '🗄️', '☁️', '🔧', '📊'];
    
    // Animación de absorción de tecnologías
    safeTimeout(() => {
        technologies.forEach((tech, index) => {
            safeTimeout(() => {
                createTechParticle(tech, particlesContainer);
            }, index * 400);
        });
        
        // Abrir ojos del cerebro después de absorber todo
        safeTimeout(() => {
            brainEyeLeft.classList.add('brain-active');
            brainEyeRight.classList.add('brain-active');
            
            // Inicializar seguimiento del mouse para el cerebro
            initializeBrainEyeTracking();
        }, technologies.length * 400 + 1000);
    }, 1000);
}

function createTechParticle(tech, container) {
    const particle = document.createElement('div');
    particle.className = 'tech-particle';
    particle.textContent = tech;
    
    // Posición inicial aleatoria
    const startX = Math.random() * 300;
    const startY = Math.random() * 200 + 100;
    
    particle.style.left = startX + 'px';
    particle.style.top = startY + 'px';
    
    container.appendChild(particle);
    
    // Animar hacia el cerebro
    safeTimeout(() => {
        particle.style.transform = 'translate(-50px, -100px) scale(0.1)';
        particle.style.opacity = '0';
        
        safeTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 800);
    }, 100);
}

function initializeBrainEyeTracking() {
    const brainEyeLeft = document.getElementById('brain-eye-left');
    const brainEyeRight = document.getElementById('brain-eye-right');
    
    if (!brainEyeLeft || !brainEyeRight) return;
    
    function updateBrainEyePosition(e) {
        const eyes = [brainEyeLeft, brainEyeRight];
        
        eyes.forEach(eye => {
            const eyeRect = eye.getBoundingClientRect();
            const eyeCenterX = eyeRect.left + eyeRect.width / 2;
            const eyeCenterY = eyeRect.top + eyeRect.height / 2;
            
            const deltaX = e.clientX - eyeCenterX;
            const deltaY = e.clientY - eyeCenterY;
            const angle = Math.atan2(deltaY, deltaX);
            const distance = Math.min(3, Math.sqrt(deltaX * deltaX + deltaY * deltaY) / 20);
            
            const pupilX = Math.cos(angle) * distance;
            const pupilY = Math.sin(angle) * distance;
            
            eye.style.setProperty('--pupil-x', pupilX + 'px');
            eye.style.setProperty('--pupil-y', pupilY + 'px');
        });
    }
    
    document.addEventListener('mousemove', updateBrainEyePosition);
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
    addOutputLine("Cargando sistema de ayuda...", 'info');
    
    safeTimeout(() => {
        createHelpSection();
    }, 600);
}

function createHelpSection() {
    const consoleOutput = document.getElementById('console-output');
    
    const helpContainer = document.createElement('div');
    helpContainer.className = 'help-container';
    
    helpContainer.innerHTML = `
        <div class="help-header">
            <h2>📚 Comandos Disponibles</h2>
        </div>
        <div class="help-commands">
            <div class="help-command">
                <span class="cmd-name">about</span>
                <span class="cmd-description">Información personal y contacto</span>
            </div>
            <div class="help-command">
                <span class="cmd-name">skills</span>
                <span class="cmd-description">Habilidades técnicas y tecnologías</span>
            </div>
            <div class="help-command">
                <span class="cmd-name">projects</span>
                <span class="cmd-description">Proyectos y trabajos realizados</span>
            </div>
            <div class="help-command">
                <span class="cmd-name">education</span>
                <span class="cmd-description">Formación académica y certificaciones</span>
            </div>
            <div class="help-command">
                <span class="cmd-name">help</span>
                <span class="cmd-description">Muestra esta ayuda</span>
            </div>
            <div class="help-command">
                <span class="cmd-name">clear</span>
                <span class="cmd-description">Limpia la pantalla de la terminal</span>
            </div>
        </div>
        <div class="help-tips">
            <h3>💡 Tips:</h3>
            <ul>
                <li>Usa las <span class="key">↑</span> <span class="key">↓</span> para navegar por el historial</li>
                <li>Presiona <span class="key">Tab</span> para autocompletar comandos</li>
                <li>Usa los botones del menú superior para navegación rápida</li>
                <li>Botón <span class="key">⏭️</span> para saltar animaciones</li>
                <li>Botón <span class="key">🗑️</span> para limpiar la terminal</li>
            </ul>
        </div>
    `;
    
    consoleOutput.appendChild(helpContainer);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
    
    safeTimeout(() => {
        isAnimating = false;
    }, 300);
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