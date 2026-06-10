# Arquitectura de hismar.dev v3.0

## Stack

| Capa | Tecnología |
|------|-----------|
| Lenguaje | TypeScript (strict) |
| Bundler | Vite 5 |
| UI | Vanilla DOM + CSS3 |
| Animaciones | Canvas 2D (migración a Three.js evaluada) |
| Testing | Vitest (unit/integration) + Playwright (E2E) |
| Hosting | Firebase Hosting |
| CI/CD | GitHub Actions |

## Estructura

```
src/
├── main.ts                # Entry point — bootstrap + registro de comandos
├── core/                  # Núcleo del sistema
│   ├── TerminalApp.ts     # Orquestador principal
│   ├── CommandRegistry.ts # Registro tipado de comandos
│   ├── AnimationManager.ts # Lifecycle de animaciones
│   └── EventBus.ts        # Eventos tipados
├── commands/              # Comandos lazy-loaded (cada uno importa su CSS)
├── shared/                # Código compartido
│   ├── i18n/             # Sistema de internacionalización
│   ├── icons/            # Registro centralizado de iconos
│   ├── ui/               # Componentes UI reutilizables (GalleryModal)
│   └── utils/            # Utilidades (dom, strings, async)
└── styles/               # CSS global importado en main.ts
```

## Flujo de Carga

1. `index.html` → `<script type="module" src="/src/main.ts">`
2. Vite transpila + bundlea en dev/production
3. `main.ts` importa `layout.css` global y crea `TerminalApp`
4. `TerminalApp` muestra pantalla de bienvenida
5. Usuario escribe comando → `executeCommand()`
6. `CommandRegistry` resuelve comando → `import()` dinámico carga módulo
7. Módulo ejecuta → pinta en `createCommandContainer()`

## Inyección de Dependencias

- `TerminalApp` recibe `I18nManager` vía constructor
- `CommandRegistry`, `AnimationManager`, `EventBus` son internos
- Cada comando recibe `TerminalAppFacade` (interfaz acotada)
- Los comandos importan su propio CSS directamente (Vite lo inyecta)

## Animaciones

- `AnimationManager` gestiona cleanup al cambiar de comando
- Arquitectura preparada para Three.js: `AnimationModule` interfaz con `init()`/`cleanup()`
- Fallback Canvas 2D disponible

## Tests

```bash
npm run test        # Vitest unit/integration
npm run test:watch  # Modo watch
npm run e2e         # Playwright (multi-browser)
npm run e2e:ui      # Playwright UI mode
```

## CI/CD Pipeline

1. `npm run lint` — ESLint
2. `npm run typecheck` — TypeScript strict
3. `npm run test` — Vitest
4. `npm run e2e` — Playwright
5. `npm run build` — Vite build
6. `lhci autorun` — Lighthouse CI
7. Firebase Deploy (solo en `main`)
