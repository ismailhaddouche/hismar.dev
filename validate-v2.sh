#!/usr/bin/env bash
set -euo pipefail

# validate-v2.sh - Validación y servidor local para hismar.dev
# Mejoras: acumulación de errores, fallback para comprobación de puertos, salidas con código de error.

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$REPO_ROOT"

echo "🚀 Validando Portfolio Terminal v2.0 - Arquitectura Modular"

error_count=0

# Función para verificar archivos (incrementa error_count si falta)
check_file() {
    if [ -f "$1" ]; then
        echo "✅ $1"
        return 0
    else
        echo "❌ $1 no encontrado"
        error_count=$((error_count + 1))
        return 1
    fi
}

# Función para verificar directorios (incrementa error_count si falta)
check_dir() {
    if [ -d "$1" ]; then
        echo "✅ $1/"
        return 0
    else
        echo "❌ $1/ no encontrado"
        error_count=$((error_count + 1))
        return 1
    fi
}

# Comprueba si un comando existe (no incrementa error_count, solo informa)
require_command() {
    if ! command -v "$1" >/dev/null 2>&1; then
        echo "⚠️  Comando '$1' no encontrado (podría ser necesario en algunas plataformas)."
        return 1
    fi
    return 0
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
check_file "styles/layout.css" || true

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
# Mostrar dependencias útiles
require_command lsof || true
require_command ss || true
require_command netstat || true
require_command python3 || true

# Si hubo errores, reportar y salir con código no-cero
if [ "$error_count" -gt 0 ]; then
    echo ""
    echo "❌ Validación falló con $error_count error(es). Corrige los archivos/directorios indicados antes de continuar."
    exit 1
fi

echo ""
echo "✅ Validación completada: todos los archivos/directorios críticos están presentes."

# Buscar puerto disponible con fallback robusto
PORT=8000
is_port_in_use() {
    local p="$1"
    if command -v lsof >/dev/null 2>&1; then
        lsof -iTCP:"$p" -sTCP:LISTEN >/dev/null 2>&1 && return 0 || return 1
    elif command -v ss >/dev/null 2>&1; then
        ss -ltn | awk '{print $4}' | grep -E "[:.]$p\$" >/dev/null 2>&1 && return 0 || return 1
    elif command -v netstat >/dev/null 2>&1; then
        netstat -tln | awk '{print $4}' | grep -E "[:.]$p\$" >/dev/null 2>&1 && return 0 || return 1
    else
        # Si no hay forma de comprobar, asumimos libre (no ideal)
        return 1
    fi
}

while is_port_in_use "$PORT"; do
    PORT=$((PORT + 1))
done

if command -v python3 >/dev/null 2>&1; then
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
    exec python3 -m http.server "$PORT"
else
    echo "❌ Python3 no encontrado. Instala Python3 para el servidor."
    echo "   Ejemplo (Debian/Ubuntu): sudo apt install python3"
    exit 2
fi
