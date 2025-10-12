#!/bin/bash

echo "🚀 Validando Portfolio Terminal v2.0 - Arquitectura Modular"

# Función para verificar archivos
check_file() {
    if [ -f "$1" ]; then
        echo "✅ $1"
        return 0
    else
        echo "❌ $1 no encontrado"
        return 1
    fi
}

# Función para verificar directorios
check_dir() {
    if [ -d "$1" ]; then
        echo "✅ $1/"
        return 0
    else
        echo "❌ $1/ no encontrado"
        return 1
    fi
}

echo ""
echo "📁 Estructura Principal:"
check_file "index.html"
check_file "main.js"
check_file "README.md"
check_file "DEVELOPMENT.md"

echo ""
echo "🎨 CSS Modular:"
check_dir "styles"
check_file "styles/layout.css"

echo ""
echo "⚙️ Comandos Modulares:"
check_dir "commands"

echo "  📝 About:"
check_dir "commands/about"
check_file "commands/about/about.js"
check_file "commands/about/about.css"

echo "  🧠 Skills:"
check_dir "commands/skills"
check_file "commands/skills/skills.js"
check_file "commands/skills/skills.css"

echo "  🚀 Projects:"
check_dir "commands/projects"
check_file "commands/projects/projects.js"
check_file "commands/projects/projects.css"

echo "  🎓 Education:"
check_dir "commands/education"
check_file "commands/education/education.js"
check_file "commands/education/education.css"

echo "  ❓ Help:"
check_dir "commands/help"
check_file "commands/help/help.js"
check_file "commands/help/help.css"

echo ""
echo "🎬 Animaciones Modulares:"
check_dir "animations"
check_file "animations/face-animation.js"
check_file "animations/skills-animation.js"
check_file "animations/projects-animation.js"
check_file "animations/education-animation.js"

echo ""
echo "🧪 Iniciando servidor de desarrollo..."

# Buscar puerto disponible
PORT=8000
while lsof -i:$PORT >/dev/null 2>&1; do
    PORT=$((PORT + 1))
done

if command -v python3 &> /dev/null; then
    echo ""
    echo "🌐 Servidor iniciado en http://localhost:$PORT"
    echo ""
    echo "📋 COMANDOS DISPONIBLES:"
    echo "   💫 about     → Información personal con animación de cara"
    echo "   🧠 skills    → Stack técnico con cerebro animado"
    echo "   🚀 projects  → Portfolio con Tetris interactivo"
    echo "   🎓 education → Formación con grúa constructora"
    echo "   ❓ help      → Guía completa de comandos"
    echo "   🧹 clear     → Limpiar terminal"
    echo "   🚪 exit      → Cerrar aplicación"
    echo ""
    echo "🎮 CARACTERÍSTICAS:"
    echo "   ⌨️  Tipeo letter-by-letter con skip (ESC)"
    echo "   🖱️  Animaciones interactivas al hover/click"
    echo "   📱 Layout responsivo con CSS Grid"
    echo "   🎯 Arquitectura modular y escalable"
    echo "   💨 Carga dinámica de módulos"
    echo ""
    echo "🚀 ¡Abre http://localhost:$PORT y prueba 'help'!"
    echo ""
    
    python3 -m http.server $PORT
else
    echo "❌ Python3 no encontrado. Instala Python3 para el servidor."
    echo "   sudo apt install python3"
fi