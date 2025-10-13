# hismar.dev

hismar.dev — Portfolio personal que simula una terminal de Linux. Interactivo, retro y pensado para mostrar información personal, habilidades y proyectos mediante comandos y animaciones pixel-art.

---

## Demo rápido
- Abrir `index.html` en un servidor estático.
- En la consola, escribe: `help` para ver la lista de comandos.

---

## Características principales
- Simulación de terminal con prompt en la parte inferior.
- Menú clicable (desktop + mobile hamburger).
- Comandos modulares y extensibles:
  - about — Información personal con avatar pixel-art.
  - skills — Animación de "cerebro" que muestra tecnologías.
  - projects — Muestra proyectos con animación estilo Tetris.
  - education — Animación de apilamiento de badges.
  - help — Ayuda y tips de uso.
- Historial de comandos (flechas ↑/↓).
- Autocompletado (Tab).
- Botones de control: skip (hacer instantáneo el tipeo/animación) y clear (limpiar consola).
- Lógica sandbox para aislar animaciones y evitar interferencias.
- Estilo retro / pixel-art, totalmente responsive.
- Licencia: MIT.

---

## Estructura
- index.html — página principal.
- main.js — loader y runtime de la consola.
- styles/ — CSS modular (layout, componentes, comandos).
- commands/ — cada comando en su carpeta con JS y CSS.
- animations/ — módulos de animación reutilizables.
- validate-v2.sh — script de verificación y servidor de pruebas.

---

## Uso local
1. Clona el repositorio:
   git clone https://github.com/ismailhaddouche/hismar.dev
2. Entra en el directorio:
   cd hismar.dev
3. Servir en local:
   python3 -m http.server 8080
4. Abrir en el navegador:
   http://localhost:8080
5. En la consola de la web, escribe `help`.

---

## Desarrolladores — añadir/editar comandos
Consulte DEVELOPMENT.md para instrucciones completas (estructura, sandbox, template de comando y buenas prácticas).

Resumen rápido:
- Crear carpeta `commands/<nombre>/`.
- Añadir `<nombre>.js` con la función `execute(terminal, animation)`.
- Añadir `<nombre>.css` si necesita estilos específicos.
- Registrar o dejar que el loader dinámico lo recoja.

---

## Validación
Ejecutar:
./validate-v2.sh

El script comprueba la presencia de comandos y animaciones críticas y puede arrancar un servidor de desarrollo.

---

## Despliegue
Es un sitio estático: puede desplegarse directamente en GitHub Pages, Netlify, Vercel u otros hostings estáticos. Asegúrate de que `index.html` y rutas relativas funcionen correctamente.

Sugerencia para GitHub Pages:
- Usar la rama `gh-pages` o configurar Pages desde `main` (root).

---

## License
MIT — ver archivo LICENSE.

---

## Contacto
Ismail Haddouche Rhali — https://github.com/ismailhaddouche

---

Si necesitas que adapte el README para un hosting específico (GitHub Pages, Netlify) o que añada instrucciones de CI/CD (workflow para desplegar automáticamente), dímelo y preparo el archivo de configuración (por ejemplo, GitHub Actions) listo para añadir al repo.