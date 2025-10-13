# hismar.dev — Guía de desarrollo

Este documento recoge las decisiones, el flujo de trabajo y las instrucciones para desarrollar, extender y desplegar el proyecto hismar.dev (portfolio terminal). Está pensado para mantener coherencia en la estructura modular, la lógica sandbox y las animaciones pixel-art.

---

## Índice
- Resumen
- Estructura del proyecto
- Requisitos
- Ejecutar en desarrollo
- Validación y tests locales
- Arquitectura de comandos y sandbox
- Añadir un nuevo comando
- Estilos y animaciones
- Accesibilidad y responsive
- Despliegue (producción)
- Buenas prácticas y contribución

---

## Resumen
hismar.dev es un portfolio personal que simula una terminal interactiva. Está implementado con HTML, CSS y JavaScript (sin frameworks). Ofrece:
- Interfaz tipo consola con prompt.
- Menú clicable.
- Comandos modulares (about, skills, projects, education, help, ...).
- Animaciones pixel-art y seguimiento del puntero del ratón.
- Sistema sandbox para aislar la ejecución de animaciones y evitar interferencias.

---

## Estructura del proyecto (resumen)
Raíz del repositorio — archivos clave:
- index.html — entrada principal del sitio.
- main.js — script principal que inicializa la consola, el menú y carga módulos.
- styles/ — CSS modular (layout.css, components, comandos específicos).
- commands/ — carpetas por comando (ej. commands/about/about.js, about.css).
- animations/ — animaciones modulares reutilizables.
- validate-v2.sh / validate.sh — scripts de validación y checks.
- README.md — documentación pública.
- DEVELOPMENT.md — este documento.
- LICENSE — MIT.

Ejemplo (simplificado):
hismar.dev/
├── index.html
├── main.js
├── styles/
│   ├── layout.css
│   └── ...
├── commands/
│   ├── about/
│   │   ├── about.js
│   │   └── about.css
│   └── skills/
├── animations/
├── validate-v2.sh
├── README.md
└── DEVELOPMENT.md

---

## Requisitos
- Navegador moderno (Chrome, Firefox, Edge, Safari recientes).
- Node no es necesario para ejecutar (sitio estático), pero puedes usarlo para herramientas auxiliares.
- Python (opcional) para servir localmente: python3 -m http.server
- Bash para ejecutar validate-v2.sh en entornos UNIX-like.

---

## Ejecutar en desarrollo (rápido)
1. Clona el repositorio:
   git clone https://github.com/ismailhaddouche/hismar.dev
2. Abre la carpeta:
   cd hismar.dev
3. Servidor estático (opción sencilla):
   python3 -m http.server 8080
4. Navega a:
   http://localhost:8080
5. Usa el prompt: escribe `help` para ver comandos disponibles.

Nota: main.js y la estructura modular ya cargan los módulos de `commands/` automáticamente; no hay build step.

---

## Validación y tests locales
- Ejecuta el script de validación para comprobar estructura mínima:
  ./validate-v2.sh
- El script revisa la presencia de archivos y directorios críticos (commands/*, animations/*) y lanza un servidor de desarrollo para pruebas.
- Añade validaciones extras al script según crezcan los módulos (linting, checks de accesibilidad).

---

## Arquitectura de comandos y sandbox
- Cada comando vive en su propio directorio dentro de `commands/`.
  - files típicos: commands/<cmd>/<cmd>.js, commands/<cmd>/<cmd>.css
- main.js importa o carga dinámicamente los módulos de comando y registra una interfaz unificada.
- Sandbox:
  - Se ejecutan las animaciones y lógica de cada comando en un ámbito controlado (objetos/container DOM creados por la consola).
  - La API mínima que un comando debe usar:
    - terminal.createCommandContainer(name) -> { container, content, sidebar }
    - terminal.writeLine(htmlOrText)
    - terminal.clear()
    - terminal.registerAnimation(handle) (opcional, para permitir cancelación)
  - Todos los timeouts/intervals/animationFrames deben almacenarse y limpiarse cuando el comando termina o cuando se pulsa "skip" o se lanza otro comando.

Buenas prácticas sandbox:
- No tocar elementos globales fuera del container proporcionado.
- Exponer solo methods públicos de la API `terminal`.
- Devolver una promesa en execute() si la ejecución es asíncrona, y limpiar en finally.

---

## Añadir un nuevo comando (pasos)
1. Crear carpeta: commands/<nombre>/
2. Archivo JS: commands/<nombre>/<nombre>.js con estructura:
   - export default {
       name: '<nombre>',
       description: 'Descripción corta',
       async execute(terminal, animation) { ... }
     }
3. Archivo CSS (opcional): commands/<nombre>/<nombre>.css
4. Registrar: Si el loader es dinámico, colocar la carpeta y el sistema la detectará; si es estático, agregar import en el loader (main.js).
5. Tests manuales: ejecutar el comando desde el prompt y probar skip/clear y el comportamiento si se lanza repetidamente.

Template mínimo (pseudocódigo):
```js
export default {
  name: 'mi-comando',
  description: 'Haz X',
  async execute(terminal, animation) {
    const { container, content } = terminal.createCommandContainer('mi-comando');
    // lógica, animaciones, await promesas
    return; // opcional
  }
}
```
---

## Estilos y animaciones
- CSS modular: preferir archivos por componente/command.
- Variables CSS globales para tema (colores de texto, color de acento, fondo).
- Animaciones: colocar en `animations/` funciones JS reutilizables que reciben el container y manejan su propio ciclo de vida (iniciar/parar).
- Evitar animaciones pesadas que bloqueen el hilo principal; usar CSS transitions y transform donde sea posible.
- Optimizar assets (SVG inline para logos y badges).

---

## Accesibilidad y responsive
- Input del prompt debe soportar:
  - Navegación por historial (flechas ↑/↓).
  - Autocompletado con Tab.
  - Labels y atributos ARIA cuando aplique.
- Contraste: mantener contraste suficiente en el tema oscuro.
- Mobile: layout responsivo; el menú colapsa a un "hamburger" como ya implementado.

---

## Despliegue (producción)
- Sitio estático: puede desplegarse en GitHub Pages, Netlify, Vercel u otros hostings estáticos.
- Para GitHub Pages: push a branch `gh-pages` o usar `main` con Pages desde la carpeta root.
- Asegúrate de que `index.html` y rutas relativas a CSS/JS funcionen correctamente en el entorno de publicación.
- Consideraciones:
  - Habilitar minificación de CSS/JS si se desea (herramientas externas).
  - Comprobar performance y mobile.

---

## Buenas prácticas y contribución
- Mantener modularidad: un comando = una carpeta.
- Documentar cada comando con descripción y parámetros (README local en la carpeta del comando si es necesario).
- Nombrado consistente: kebab-case para carpetas y archivos de comandos.
- Tests manuales del flujo: ejecutar `help`, `about`, `skills`, `projects`, `education`.
- Pull Requests: incluir pasos para reproducir y capturas/GIFs si la PR añade animación.

---

## Checklist antes de merge / publicación
- [ ] validate-v2.sh pasa sin errores.
- [ ] No leaks de timeouts/intervals al cambiar comando.
- [ ] Accesibilidad básica validada.
- [ ] Assets optimizados (SVGs, icons).
- [ ] README actualizado con las instrucciones de ejecución y comandos (archivo README.md principal).

---

## Notas finales
Este fichero debe actualizarse siempre que se:
- Cambie la API de `terminal`.
- Se añadan nuevos comandos o animaciones reutilizables.
- Se modifique el flujo de deployment.

Gracias por mantener la coherencia del proyecto. ¡A seguir construyendo!