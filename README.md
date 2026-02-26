# hismar.dev — Portfolio Terminal interactivo

Portfolio personal que simula una terminal interactiva. Está implementado con HTML, CSS y JavaScript (sin frameworks). Destaca por tener un diseño pixel-art retro, animaciones fluidas y un sistema de comandos modular.

🌐 **Enlace web:** [https://hismar.dev/](https://hismar.dev/)

---

## 🚀 Características principales
- **Interfaz tipo consola:** Prompt de comandos interactivo en la parte inferior.
- **Menú rápido:** Navegación visual mediante menú clicable (desktop + mobile hamburger).
- **Sistema modular de comandos:** Los comandos se cargan desde su propia carpeta con su CSS y JS aislados:
  - `about` — Información personal con avatar pixel-art.
  - `skills` — Animación interactiva de tecnologías y herramientas.
  - `projects` — Proyectos destacados con tarjetas informativas.
  - `education` — Repaso a la formación académica.
  - `help` — Ayuda y tips de uso.
- **Funciones de terminal:** Historial de comandos (flechas ↑/↓), autocompletado (Tab), y comandos de control (`clear`, `exit`).
- **Sandbox engine:** Lógica que aísla las animaciones para evitar interferencias y fugas de memoria entre comandos.
- **Responsive:** Diseño adaptable que funciona perfectamente tanto en escritorio como en móvil.

---

## 🛠️ Estructura del proyecto
La arquitectura está pensada para ser escalable sin necesidad de herramientas de build complejas (es un proyecto vanilla).

```text
hismar.dev/
├── index.html           # Punto de entrada principal
├── main.js              # Core de la consola y gestor de comandos principal
├── package.json         # Scripts de ayuda
├── styles/              # CSS base y de layout del sistema
├── animations/          # Módulos JS reutilizables para animaciones complejas
├── commands/            # Módulos de cada comando aislado
│   ├── about/
│   │   ├── about.js
│   │   └── about.css
│   └── ...
└── README.md            # Documentación general
```

---

## 💻 Desarrollo local

El proyecto es estático, por lo que no requiere herramientas de build complejas. Sólo necesitas un servidor HTTP básico.

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/ismailhaddouche/hismar.dev
   cd hismar.dev
   ```

2. **Inicia el servidor local**
   Puedes usar el script incluido de `npm` (que usa `http-server`), Python, o cualquier otro servidor estático:
   ```bash
   npm run dev
   # O alternativamente con Python:
   python3 -m http.server 8000
   ```

3. **Prueba la app**
   Abre en tu navegador `http://localhost:8000` y escribe `help` en la consola.

---

## 🧩 Guía para añadir o editar comandos

Añadir un comando nuevo es muy sencillo gracias a la arquitectura modular y al Sandbox de comandos.

1. **Crea el directorio del comando:** `commands/mi-comando/`
2. **Crea el archivo principal JS:** `commands/mi-comando/mi-comando.js` con la siguiente estructura:
   ```javascript
   export default {
     name: 'mi-comando',
     description: 'Descripción corta de lo que hace',
     async execute(terminal, animation) {
       // El terminal crea un entorno aislado en el DOM para este comando
       const { container, content } = terminal.createCommandContainer('mi-comando');
       
       // Escribe texto en la consola
       terminal.writeLine('Hola, mundo desde mi nuevo comando');
       
       // Aquí puedes inyectar HTML, instanciar animaciones, etc. en el "content"
     }
   }
   ```
3. **Crea estilos específicos (Opcional):** `commands/mi-comando/mi-comando.css`. 
4. **Registrar el comando:** El loader en `main.js` se encargará de agrupar y registrar los comandos a la lista general del terminal.

**Buenas prácticas:**
- **No ensucies el global:** No modifiques estilos CSS fuera del container que te provee el método `createCommandContainer()`.
- **Limpieza de procesos:** Si tu comando inicia bucles asíncronos o timers (`setInterval`, `requestAnimationFrame`), asegúrate de manejarlos correctamente mediante el API provista para que se cancelen automáticamente al cambiar de un comando a otro o limpiar la terminal.

---

## ✅ Validación y Tests (Opcional)

Si trabajas en un entorno UNIX (Linux, macOS o WSL), está disponible un script de verificación `.sh` para comprobar la integridad técnica de las carpetas:
```bash
./validate-v2.sh
```
Esto asegurará que están presentes los archivos core de animaciones y comandos antes del despliegue.

---

## 🚀 Despliegue (Producción)

Al ser una aplicación web **estática**, el despliegue es trivial y directo:
- Puede alojarse gratuitamente en **GitHub Pages**, **Vercel**, **Netlify**, o **Firebase Hosting**.
- Asegúrate de que las rutas relativas en tu servidor (`/commands/`, `/styles/`, etc.) coincidan con la ruta raíz configurada. En caso de repositorios de Github Pages, asegúrate de configurar el sitio a través del path `/`.

---

## 📄 Licencia

Este proyecto se distribuye bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.

## ✉️ Contacto
**Ismail Haddouche Rhali** — [GitHub](https://github.com/ismailhaddouche)
