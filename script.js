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
    initializeScrollEvents();
    
    // Mensaje de bienvenida con efecto de tipeo
    safeTimeout(() => {
        addOutputLine("Bienvenido a hismar.dev Terminal 1.0", 'info');
        addOutputLine("Sistema inicializado correctamente", 'normal');
        addOutputLine("Escribe 'help' para ver comandos disponibles", 'hint');
        addOutputLine("", 'normal'); // Línea vacía
        
        // Ejecutar comando about por defecto después del mensaje
        safeTimeout(() => {
            executeCommand('about');
            document.querySelector('[data-command="about"]').classList.add('active');
        }, 1500);
    }, 800);
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
        // Resetear después de un momento para próximos comandos
        safeTimeout(() => {
            skipAnimation = false;
        }, 1000);
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

// Función helper para scroll automático mejorado
function autoScrollConsole() {
    const consoleOutput = document.getElementById('console-output');
    if (consoleOutput) {
        setTimeout(() => {
            consoleOutput.scrollTop = consoleOutput.scrollHeight;
            checkScrollIndicator();
        }, 50);
    }
}

// Animación de tipeo letra por letra
function typeText(element, text, speed = 20, callback = null, showCursor = true) {
    let index = 0;
    element.textContent = '';
    element.style.visibility = 'visible';
    
    // Si skip está activado, mostrar todo inmediatamente
    if (skipAnimation) {
        element.textContent = text;
        element.classList.remove('typing-cursor');
        if (callback) callback();
        return null;
    }
    
    // Agregar cursor mientras se escribe
    if (showCursor) {
        element.classList.add('typing-cursor');
    }
    
    const typeInterval = setInterval(() => {
        if (skipAnimation || index >= text.length) {
            // Completar inmediatamente si se activa skip o termina
            element.textContent = text;
            element.classList.remove('typing-cursor');
            clearInterval(typeInterval);
            if (callback) callback();
            return;
        }
        
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            autoScrollConsole();
        }
    }, speed);
    
    // Agregar al sistema de limpieza
    activeAnimationIntervals.push(typeInterval);
    return typeInterval;
}

// Animación de tipeo para HTML
function typeHTML(element, html, speed = 20, callback = null) {
    element.innerHTML = '';
    element.style.visibility = 'visible';
    
    // Crear elemento temporal para procesar HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    let index = 0;
    const typeInterval = setInterval(() => {
        if (index < textContent.length) {
            // Agregar carácter por carácter manteniendo estructura HTML básica
            const currentText = textContent.substring(0, index + 1);
            element.textContent = currentText;
            index++;
            autoScrollConsole();
        } else {
            // Al finalizar, establecer el HTML completo
            element.innerHTML = html;
            clearInterval(typeInterval);
            if (callback) callback();
        }
    }, speed);
    
    activeAnimationIntervals.push(typeInterval);
    return typeInterval;
}

// Animación de tipeo línea por línea
function typeLines(container, lines, lineSpeed = 30, charSpeed = 15, callback = null) {
    let currentLineIndex = 0;
    
    function typeNextLine() {
        if (currentLineIndex >= lines.length) {
            if (callback) callback();
            return;
        }
        
        const line = lines[currentLineIndex];
        const lineElement = document.createElement('div');
        lineElement.className = line.className || 'output-line';
        lineElement.style.visibility = 'hidden';
        container.appendChild(lineElement);
        
        // Pequeño delay antes de empezar a escribir la línea
        safeTimeout(() => {
            typeText(lineElement, line.text, charSpeed, () => {
                currentLineIndex++;
                safeTimeout(typeNextLine, lineSpeed);
            });
        }, 50);
    }
    
    typeNextLine();
}

// Verificar si mostrar indicador de scroll
function checkScrollIndicator() {
    const consoleOutput = document.getElementById('console-output');
    const scrollIndicator = document.getElementById('scroll-indicator');
    
    if (!consoleOutput || !scrollIndicator) return;
    
    const isScrollable = consoleOutput.scrollHeight > consoleOutput.clientHeight;
    const isAtBottom = Math.abs(consoleOutput.scrollHeight - consoleOutput.clientHeight - consoleOutput.scrollTop) < 5;
    
    if (isScrollable && !isAtBottom) {
        scrollIndicator.classList.add('show');
    } else {
        scrollIndicator.classList.remove('show');
    }
}

// Inicializar eventos de scroll
function initializeScrollEvents() {
    const consoleOutput = document.getElementById('console-output');
    const scrollIndicator = document.getElementById('scroll-indicator');
    
    if (consoleOutput) {
        consoleOutput.addEventListener('scroll', checkScrollIndicator);
        
        // Hacer click en el indicador para scroll automático al final
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                autoScrollConsole();
            });
        }
    }
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
    addOutputLine("Cargando información biográfica... ✓", 'info');
    addOutputLine("Activando seguimiento ocular... ✓", 'info');
    
    safeTimeout(() => {
        createAboutSection();
    }, 1000);
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
    
    // Añadir al contenedor
    aboutContainer.appendChild(infoSection);
    aboutContainer.appendChild(faceSection);
    consoleOutput.appendChild(aboutContainer);
    
    // Inicializar seguimiento del mouse para los ojos
    initializeEyeTracking();
    
    // Crear contenido con animación de tipeo
    const currentDate = new Date();
    const birthDate = new Date('1988-05-14');
    const age = Math.floor((currentDate - birthDate) / (365.25 * 24 * 60 * 60 * 1000));
    
    // Crear elementos paso a paso con animación
    const infoHeader = document.createElement('div');
    infoHeader.className = 'info-header';
    const nameElement = document.createElement('h2');
    nameElement.className = 'name';
    infoHeader.appendChild(nameElement);
    infoSection.appendChild(infoHeader);
    
    // Animar nombre
    typeText(nameElement, 'Ismail Haddouche Rhali', 40, () => {
        
        // Crear sección de detalles
        const infoDetails = document.createElement('div');
        infoDetails.className = 'info-details';
        infoSection.appendChild(infoDetails);
        
        // Definir líneas de información
        const infoLines = [
            { text: `Edad: ${age} años`, className: 'info-item' },
            { text: 'Profesión: Developer/DevOp', className: 'info-item' },
            { text: 'GitHub: github.com/ismailhaddouche', className: 'info-item' },
            { text: 'LinkedIn: linkedin.com/in/ismailhaddouche', className: 'info-item' }
        ];
        
        // Animar líneas de información
        typeLines(infoDetails, infoLines, 200, 25, () => {
            
            // Crear descripción
            const descContainer = document.createElement('div');
            descContainer.className = 'info-description';
            const descParagraph = document.createElement('p');
            descContainer.appendChild(descParagraph);
            infoSection.appendChild(descContainer);
            
            // Animar descripción
            const description = 'Desarrollador apasionado de la tecnología y la informática. Friki de los videojuegos de mesa, el anime y la lectura de fantasía. Fan de Zerocalcare. Y más friki aún del cloud computing, estructura de sistemas y la ciberseguridad.';
            
            typeText(descParagraph, description, 20, () => {
                isAnimating = false;
            });
        });
    });
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
    addOutputLine("Activando cerebro pixel art... ✓", 'info');
    addOutputLine("Cargando tecnologías disponibles... ✓", 'info');
    
    safeTimeout(() => {
        createSkillsSection();
    }, 1000);
}

function createSkillsSection() {
    const consoleOutput = document.getElementById('console-output');
    
    const skillsContainer = document.createElement('div');
    skillsContainer.className = 'skills-container';
    
    // Crear sección de tecnologías (panel principal izquierdo)
    const techSection = document.createElement('div');
    techSection.className = 'skills-tech-section';
    
    // Crear sección del cerebro pixel art (sidebar derecho)  
    const brainSection = document.createElement('div');
    brainSection.className = 'skills-brain-section';
    brainSection.innerHTML = createPixelBrain();
    
    // Añadir al contenedor
    skillsContainer.appendChild(techSection);
    skillsContainer.appendChild(brainSection);
    consoleOutput.appendChild(skillsContainer);
    
    // Inicializar animación del cerebro
    initializeBrainAnimation();
    
    // Crear contenido con animación de tipeo
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
    
    // Crear categorías con animación
    const categoriesContainer = document.createElement('div');
    categoriesContainer.className = 'skills-categories';
    techSection.appendChild(categoriesContainer);
    
    let categoryIndex = 0;
    
    function addNextCategory() {
        if (categoryIndex >= skillsData.length) {
            isAnimating = false;
            return;
        }
        
        const categoryData = skillsData[categoryIndex];
        const categoryElement = document.createElement('div');
        categoryElement.className = 'skill-category';
        
        const categoryTitle = document.createElement('h3');
        categoryTitle.className = 'category-title';
        categoryTitle.style.color = categoryData.color;
        
        const badgesContainer = document.createElement('div');
        badgesContainer.className = 'skill-badges';
        
        categoryElement.appendChild(categoryTitle);
        categoryElement.appendChild(badgesContainer);
        categoriesContainer.appendChild(categoryElement);
        
        // Animar título de categoría
        typeText(categoryTitle, categoryData.category, 30, () => {
            
            // Animar badges de habilidades
            let skillIndex = 0;
            
            function addNextSkill() {
                if (skillIndex >= categoryData.skills.length) {
                    categoryIndex++;
                    safeTimeout(addNextCategory, 300);
                    return;
                }
                
                const skill = categoryData.skills[skillIndex];
                const badge = document.createElement('span');
                badge.className = 'skill-badge';
                badge.style.borderColor = categoryData.color;
                badgesContainer.appendChild(badge);
                
                typeText(badge, skill, 20, () => {
                    skillIndex++;
                    safeTimeout(addNextSkill, 100);
                });
            }
            
            safeTimeout(addNextSkill, 200);
        });
    }
    
    safeTimeout(addNextCategory, 500);
}

function createPixelBrain() {
    return `
        <div class="pixel-brain-container">
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
    addOutputLine("Compilando proyectos y trabajos...", 'info');
    addOutputLine("Iniciando simulación Tetris... ✓", 'info');
    addOutputLine("Generando portfolio interactivo... ✓", 'info');
    
    safeTimeout(() => {
        createProjectsSection();
    }, 1000);
}

function createProjectsSection() {
    const consoleOutput = document.getElementById('console-output');
    
    const projectsContainer = document.createElement('div');
    projectsContainer.className = 'projects-container';
    
    // Sección de animación Tetris
    const tetrisSection = document.createElement('div');
    tetrisSection.className = 'projects-tetris-section';
    tetrisSection.innerHTML = createTetrisAnimation();
    
    // Sección de proyectos
    const projectsListSection = document.createElement('div');
    projectsListSection.className = 'projects-list-section';
    
    const projectsData = [
        {
            name: 'TetrisCV',
            description: 'Plantilla printable de estructura y estilo de un CV retro y con temática de tetris fácil de imprimir en DIN A4',
            tech: 'HTML, CSS',
            color: '#ff6b6b'
        },
        {
            name: 'hismar.dev',
            description: 'Web personal que simula consola de linux con comandos y estilo retro y pixelart',
            tech: 'HTML, CSS, JavaScript',
            color: '#4ecdc4'
        },
        {
            name: 'TimeTutor',
            description: 'Aplicación android para gestión de clases de profesores particulares con horarios y pagos',
            tech: 'Kotlin, Firebase',
            color: '#45b7d1'
        },
        {
            name: 'PyControl',
            description: 'Sistema completo de fichaje de jornadas laborales cumpliendo la legislación española en hardware y OS de Raspberry Pi',
            tech: 'Python, SQLite, Linux, Raspberry Pi',
            color: '#96ceb4'
        }
    ];
    
    let projectsHTML = '<div class="projects-list">';
    projectsData.forEach((project, index) => {
        projectsHTML += `
            <div class="project-item" style="border-color: ${project.color}">
                <h3 class="project-name" style="color: ${project.color}">${project.name}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                    <span class="tech-label">Tecnologías:</span>
                    <span class="tech-list" style="color: ${project.color}">${project.tech}</span>
                </div>
            </div>
        `;
    });
    projectsHTML += '</div>';
    
    // Cambiar el orden: contenido izquierda, animación derecha
    projectsContainer.appendChild(projectsListSection);
    projectsContainer.appendChild(tetrisSection);
    consoleOutput.appendChild(projectsContainer);
    
    // Inicializar animación Tetris
    initializeTetrisAnimation();
    
    // Crear lista de proyectos con animación de tipeo
    const projectsList = document.createElement('div');
    projectsList.className = 'projects-list';
    projectsListSection.appendChild(projectsList);
    
    let projectIndex = 0;
    
    function addNextProject() {
        if (projectIndex >= projectsData.length) {
            isAnimating = false;
            return;
        }
        
        const project = projectsData[projectIndex];
        const projectElement = document.createElement('div');
        projectElement.className = 'project-item';
        projectElement.style.borderColor = project.color;
        
        const projectName = document.createElement('h3');
        projectName.className = 'project-name';
        projectName.style.color = project.color;
        
        const projectDesc = document.createElement('p');
        projectDesc.className = 'project-description';
        
        const projectTechContainer = document.createElement('div');
        projectTechContainer.className = 'project-tech';
        
        const techLabel = document.createElement('span');
        techLabel.className = 'tech-label';
        techLabel.textContent = 'Tecnologías: ';
        
        const techList = document.createElement('span');
        techList.className = 'tech-list';
        techList.style.color = project.color;
        
        projectTechContainer.appendChild(techLabel);
        projectTechContainer.appendChild(techList);
        
        projectElement.appendChild(projectName);
        projectElement.appendChild(projectDesc);
        projectElement.appendChild(projectTechContainer);
        projectsList.appendChild(projectElement);
        
        // Animar nombre del proyecto
        typeText(projectName, project.name, 25, () => {
            // Animar descripción
            typeText(projectDesc, project.description, 12, () => {
                // Animar tecnologías
                typeText(techList, project.tech, 20, () => {
                    projectIndex++;
                    safeTimeout(addNextProject, 300);
                });
            });
        });
    }
    
    safeTimeout(addNextProject, 500);
}

function createTetrisAnimation() {
    return `
        <div class="tetris-container">
            <div class="tetris-screen">
                <div class="tetris-grid" id="tetris-grid">
                    <!-- Grid se generará dinámicamente -->
                </div>
                <div class="tetris-character" id="tetris-character">
                    <div class="char-row">
                        <div class="char-pixel bg"></div><div class="char-pixel head"></div><div class="char-pixel head"></div><div class="char-pixel bg"></div>
                    </div>
                    <div class="char-row">
                        <div class="char-pixel head"></div><div class="char-pixel eye"></div><div class="char-pixel eye char-eye" id="char-eye"></div><div class="char-pixel head"></div>
                    </div>
                    <div class="char-row">
                        <div class="char-pixel head"></div><div class="char-pixel mouth"></div><div class="char-pixel mouth"></div><div class="char-pixel head"></div>
                    </div>
                    <div class="char-row">
                        <div class="char-pixel body"></div><div class="char-pixel body"></div><div class="char-pixel body"></div><div class="char-pixel body"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function initializeTetrisAnimation() {
    const tetrisGrid = document.getElementById('tetris-grid');
    const character = document.getElementById('tetris-character');
    const charEye = document.getElementById('char-eye');
    
    if (!tetrisGrid || !character) return;
    
    // Crear grid base
    for (let i = 0; i < 80; i++) {
        const cell = document.createElement('div');
        cell.className = 'tetris-cell';
        tetrisGrid.appendChild(cell);
    }
    
    const cells = tetrisGrid.querySelectorAll('.tetris-cell');
    
    // Animación de piezas cayendo
    const pieces = [
        [0, 1, 8, 9], // Cuadrado
        [0, 1, 2, 3], // Línea horizontal
        [0, 8, 16, 24], // Línea vertical
        [0, 1, 9, 17], // L
        [1, 9, 16, 17], // T
    ];
    
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
    
    safeTimeout(() => {
        let pieceIndex = 0;
        
        function dropPiece() {
            if (pieceIndex >= pieces.length) {
                // Animación completa, activar seguimiento de ojos
                safeTimeout(() => {
                    charEye.classList.add('char-active');
                    initializeCharacterEyeTracking();
                }, 500);
                return;
            }
            
            const piece = pieces[pieceIndex];
            const color = colors[pieceIndex];
            const startRow = 0;
            
            // Animar caída de la pieza
            let currentRow = startRow;
            const dropInterval = safeInterval(() => {
                // Limpiar posición anterior
                piece.forEach(offset => {
                    const prevIndex = (currentRow - 1) * 8 + (offset % 8);
                    if (prevIndex >= 0 && cells[prevIndex]) {
                        cells[prevIndex].style.backgroundColor = '';
                    }
                });
                
                // Dibujar en nueva posición
                piece.forEach(offset => {
                    const cellIndex = currentRow * 8 + (offset % 8);
                    if (cellIndex < 80 && cells[cellIndex]) {
                        cells[cellIndex].style.backgroundColor = color;
                    }
                });
                
                currentRow++;
                
                // Si llegó al final, detener y pasar a la siguiente pieza
                if (currentRow > 8) {
                    clearSafeInterval(dropInterval);
                    pieceIndex++;
                    safeTimeout(dropPiece, 300);
                }
            }, 200);
        }
        
        dropPiece();
    }, 1000);
}

function initializeCharacterEyeTracking() {
    const charEye = document.getElementById('char-eye');
    
    if (!charEye) return;
    
    function updateCharacterEyePosition(e) {
        const eyeRect = charEye.getBoundingClientRect();
        const eyeCenterX = eyeRect.left + eyeRect.width / 2;
        const eyeCenterY = eyeRect.top + eyeRect.height / 2;
        
        const deltaX = e.clientX - eyeCenterX;
        const deltaY = e.clientY - eyeCenterY;
        const angle = Math.atan2(deltaY, deltaX);
        const distance = Math.min(2, Math.sqrt(deltaX * deltaX + deltaY * deltaY) / 30);
        
        const pupilX = Math.cos(angle) * distance;
        const pupilY = Math.sin(angle) * distance;
        
        charEye.style.setProperty('--char-pupil-x', pupilX + 'px');
        charEye.style.setProperty('--char-pupil-y', pupilY + 'px');
    }
    
    document.addEventListener('mousemove', updateCharacterEyePosition);
}

function executeEducationCommand() {
    addOutputLine("Construyendo historial académico...", 'info');
    addOutputLine("Activando grúa de construcción... ✓", 'info');
    addOutputLine("Apilando logros formativos... ✓", 'info');
    
    safeTimeout(() => {
        createEducationSection();
    }, 1000);
}

function createEducationSection() {
    const consoleOutput = document.getElementById('console-output');
    
    const educationContainer = document.createElement('div');
    educationContainer.className = 'education-container';
    
    // Sección de animación grúa
    const craneSection = document.createElement('div');
    craneSection.className = 'education-crane-section';
    craneSection.innerHTML = createCraneAnimation();
    
    // Sección de formación
    const educationListSection = document.createElement('div');
    educationListSection.className = 'education-list-section';
    
    const educationData = [
        {
            title: 'Grado en Informática',
            institution: 'UNED',
            period: '2025/presente',
            color: '#ff6b6b'
        },
        {
            title: 'Desarrollo de aplicaciones multiplataforma',
            institution: 'ILERNA',
            period: '2023/2025',
            color: '#4ecdc4'
        },
        {
            title: 'Bachillerato',
            institution: 'IES Ricardo Ortega',
            period: '2004/2006',
            color: '#45b7d1'
        }
    ];
    
    let educationHTML = '<div class="education-list">';
    educationData.forEach((edu, index) => {
        educationHTML += `
            <div class="education-item brick-${index}" style="border-color: ${edu.color}">
                <h3 class="education-title" style="color: ${edu.color}">${edu.title}</h3>
                <p class="education-institution">${edu.institution}</p>
                <span class="education-period" style="color: ${edu.color}">${edu.period}</span>
            </div>
        `;
    });
    educationHTML += '</div>';
    
    // Cambiar el orden: contenido izquierda, animación derecha
    educationContainer.appendChild(educationListSection);
    educationContainer.appendChild(craneSection);
    consoleOutput.appendChild(educationContainer);
    
    // Inicializar animación de grúa
    initializeCraneAnimation();
    
    // Crear lista de educación con animación de tipeo
    const educationList = document.createElement('div');
    educationList.className = 'education-list';
    educationListSection.appendChild(educationList);
    
    let educationIndex = 0;
    
    function addNextEducation() {
        if (educationIndex >= educationData.length) {
            isAnimating = false;
            return;
        }
        
        const edu = educationData[educationIndex];
        const educationElement = document.createElement('div');
        educationElement.className = `education-item brick-${educationIndex}`;
        educationElement.style.borderColor = edu.color;
        
        const eduTitle = document.createElement('h3');
        eduTitle.className = 'education-title';
        eduTitle.style.color = edu.color;
        
        const eduInstitution = document.createElement('p');
        eduInstitution.className = 'education-institution';
        
        const eduPeriod = document.createElement('span');
        eduPeriod.className = 'education-period';
        eduPeriod.style.color = edu.color;
        
        educationElement.appendChild(eduTitle);
        educationElement.appendChild(eduInstitution);
        educationElement.appendChild(eduPeriod);
        educationList.appendChild(educationElement);
        
        // Animar título
        typeText(eduTitle, edu.title, 25, () => {
            // Animar institución
            typeText(eduInstitution, edu.institution, 20, () => {
                // Animar período
                typeText(eduPeriod, edu.period, 30, () => {
                    educationIndex++;
                    safeTimeout(addNextEducation, 400);
                });
            });
        });
    }
    
    safeTimeout(addNextEducation, 500);
}

function createCraneAnimation() {
    return `
        <div class="crane-container">
            <div class="crane-scene">
                <div class="crane" id="crane">
                    <div class="crane-arm" id="crane-arm">
                        <div class="crane-hook" id="crane-hook">🎓</div>
                    </div>
                    <div class="crane-operator" id="crane-operator">
                        <div class="op-head">
                            <div class="op-eye" id="crane-eye"></div>
                        </div>
                        <div class="op-body"></div>
                    </div>
                </div>
                <div class="brick-stack" id="brick-stack"></div>
            </div>
        </div>
    `;
}

function initializeCraneAnimation() {
    const craneArm = document.getElementById('crane-arm');
    const craneHook = document.getElementById('crane-hook');
    const brickStack = document.getElementById('brick-stack');
    const craneEye = document.getElementById('crane-eye');
    
    if (!craneArm || !craneHook || !brickStack) return;
    
    const bricks = ['📚', '🎯', '🏆'];
    const brickColors = ['#ff6b6b', '#4ecdc4', '#45b7d1'];
    
    safeTimeout(() => {
        let brickIndex = 0;
        
        function stackBrick() {
            if (brickIndex >= bricks.length) {
                // Animación completa, activar seguimiento de ojos
                safeTimeout(() => {
                    craneEye.classList.add('crane-active');
                    initializeCraneEyeTracking();
                }, 500);
                return;
            }
            
            const brick = bricks[brickIndex];
            const color = brickColors[brickIndex];
            
            // Crear ladrillo
            const brickElement = document.createElement('div');
            brickElement.className = 'crane-brick';
            brickElement.textContent = brick;
            brickElement.style.backgroundColor = color;
            
            // Posicionar en el hook
            craneHook.appendChild(brickElement);
            
            // Animar brazo hacia el stack
            safeTimeout(() => {
                craneArm.style.transform = `rotate(45deg) translateY(${brickIndex * 20}px)`;
                
                safeTimeout(() => {
                    // Soltar ladrillo en el stack
                    brickStack.appendChild(brickElement);
                    brickElement.style.position = 'relative';
                    brickElement.style.bottom = `${brickIndex * 30}px`;
                    
                    // Volver brazo a posición original
                    craneArm.style.transform = 'rotate(0deg)';
                    
                    brickIndex++;
                    safeTimeout(stackBrick, 500);
                }, 800);
            }, 300);
        }
        
        stackBrick();
    }, 1000);
}

function initializeCraneEyeTracking() {
    const craneEye = document.getElementById('crane-eye');
    const craneArm = document.getElementById('crane-arm');
    
    if (!craneEye || !craneArm) return;
    
    function updateCranePosition(e) {
        const eyeRect = craneEye.getBoundingClientRect();
        const eyeCenterX = eyeRect.left + eyeRect.width / 2;
        const eyeCenterY = eyeRect.top + eyeRect.height / 2;
        
        const deltaX = e.clientX - eyeCenterX;
        const deltaY = e.clientY - eyeCenterY;
        const angle = Math.atan2(deltaY, deltaX);
        
        // Rotar brazo de la grúa siguiendo el mouse
        const armAngle = (angle * 180 / Math.PI) + 90;
        craneArm.style.transform = `rotate(${Math.max(-45, Math.min(45, armAngle))}deg)`;
        
        // Mover ojo
        const distance = Math.min(2, Math.sqrt(deltaX * deltaX + deltaY * deltaY) / 30);
        const pupilX = Math.cos(angle) * distance;
        const pupilY = Math.sin(angle) * distance;
        
        craneEye.style.setProperty('--crane-pupil-x', pupilX + 'px');
        craneEye.style.setProperty('--crane-pupil-y', pupilY + 'px');
    }
    
    document.addEventListener('mousemove', updateCranePosition);
}

function executeHelpCommand() {
    addOutputLine("Cargando sistema de ayuda...", 'info');
    addOutputLine("Indexando comandos disponibles... ✓", 'info');
    
    safeTimeout(() => {
        createHelpSection();
    }, 800);
}

function createHelpSection() {
    const consoleOutput = document.getElementById('console-output');
    
    const helpContainer = document.createElement('div');
    helpContainer.className = 'help-container';
    consoleOutput.appendChild(helpContainer);
    
    // Header con animación
    const helpHeader = document.createElement('div');
    helpHeader.className = 'help-header';
    const headerTitle = document.createElement('h2');
    helpHeader.appendChild(headerTitle);
    helpContainer.appendChild(helpHeader);
    
    typeText(headerTitle, '📚 Comandos Disponibles', 30, () => {
        
        // Contenedor de comandos
        const commandsContainer = document.createElement('div');
        commandsContainer.className = 'help-commands';
        helpContainer.appendChild(commandsContainer);
        
        // Lista de comandos
        const commands = [
            { name: 'about', desc: 'Información personal y contacto' },
            { name: 'skills', desc: 'Habilidades técnicas y tecnologías' },
            { name: 'projects', desc: 'Proyectos y trabajos realizados' },
            { name: 'education', desc: 'Formación académica y certificaciones' },
            { name: 'help', desc: 'Muestra esta ayuda' },
            { name: 'clear', desc: 'Limpia la pantalla de la terminal' }
        ];
        
        let commandIndex = 0;
        
        function addNextCommand() {
            if (commandIndex >= commands.length) {
                // Agregar tips después de comandos
                addTipsSection();
                return;
            }
            
            const cmd = commands[commandIndex];
            const cmdElement = document.createElement('div');
            cmdElement.className = 'help-command';
            
            const cmdName = document.createElement('span');
            cmdName.className = 'cmd-name';
            const cmdDesc = document.createElement('span');
            cmdDesc.className = 'cmd-description';
            
            cmdElement.appendChild(cmdName);
            cmdElement.appendChild(cmdDesc);
            commandsContainer.appendChild(cmdElement);
            
            // Animar nombre del comando
            typeText(cmdName, cmd.name, 20, () => {
                // Animar descripción
                typeText(cmdDesc, cmd.desc, 15, () => {
                    commandIndex++;
                    safeTimeout(addNextCommand, 100);
                });
            });
        }
        
        function addTipsSection() {
            const tipsContainer = document.createElement('div');
            tipsContainer.className = 'help-tips';
            helpContainer.appendChild(tipsContainer);
            
            const tipsTitle = document.createElement('h3');
            tipsContainer.appendChild(tipsTitle);
            
            typeText(tipsTitle, '💡 Tips:', 30, () => {
                const tipsList = document.createElement('ul');
                tipsContainer.appendChild(tipsList);
                
                const tips = [
                    'Usa las ↑ ↓ para navegar por el historial',
                    'Presiona Tab para autocompletar comandos',
                    'Usa los botones del menú superior para navegación rápida',
                    'Botón ⏭️ para saltar animaciones',
                    'Botón 🗑️ para limpiar la terminal'
                ];
                
                const tipLines = tips.map(tip => ({ text: tip, className: 'tip-line' }));
                
                // Crear elementos li para cada tip
                tipLines.forEach((tip, index) => {
                    const li = document.createElement('li');
                    tipsList.appendChild(li);
                    
                    safeTimeout(() => {
                        typeText(li, tip.text, 12, () => {
                            if (index === tipLines.length - 1) {
                                isAnimating = false;
                            }
                        });
                    }, index * 300);
                });
            });
        }
        
        safeTimeout(addNextCommand, 200);
    });
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
    
    const promptPrefix = document.createElement('span');
    promptPrefix.className = 'prompt-prefix';
    promptPrefix.textContent = 'hismar@dev:~$ ';
    
    const commandText = document.createElement('span');
    commandText.className = 'command-text';
    
    commandLine.appendChild(promptPrefix);
    commandLine.appendChild(commandText);
    consoleOutput.appendChild(commandLine);
    
    // Animar el comando escribiéndose
    typeText(commandText, command, 50);
    autoScrollConsole();
}

// Agregar línea de output con diferentes tipos
function addOutputLine(text, type = 'normal', useTyping = true) {
    const consoleOutput = document.getElementById('console-output');
    const outputLine = document.createElement('div');
    outputLine.className = `output-line output-${type}`;
    consoleOutput.appendChild(outputLine);
    
    if (useTyping) {
        outputLine.style.visibility = 'hidden';
        // Usar velocidad diferente según el tipo
        const speed = type === 'info' ? 25 : 15;
        typeText(outputLine, text, speed);
    } else {
        outputLine.textContent = text;
        autoScrollConsole();
    }
    
    return outputLine;
}