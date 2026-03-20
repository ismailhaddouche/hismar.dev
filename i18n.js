/**
 * I18N MANAGER - Sistema de Traducciones
 */
window.i18n = {
    current: localStorage.getItem('hismar_lang') || 'es',
    
    translations: {
        es: {
            welcome: {
                title: "// Bienvenido a mi terminal interactiva.",
                subtitle: "// Explora quién soy, qué construyo y cómo pienso.",
                role: "Full-stack · Mobile · Murcia, España",
                help: "help       → listar todos los comandos disponibles",
                about: "about      → información personal y contacto",
                experience: "experience → trayectoria profesional",
                projects: "projects   → proyectos en producción y open-source",
                skills: "skills     → stack tecnológico completo",
                education: "education  → formación académica",
                cv: "cv         → descargar currículum",
                footer: "// Tab: autodecompletar  ·  ↑↓: historial de comandos  ·  hay easter eggs por descubrir 👀"
            },
            menu: {
                about: "/sobre-mi",
                experience: "/experiencia",
                skills: "/habilidades",
                projects: "/proyectos",
                education: "/educacion",
                cv: "/cv",
                help: "/ayuda"
            },
            commands: {
                about: {
                    label: "Sobre mí",
                    description: "Biografía y contacto",
                    availability: "Disponible para nuevas oportunidades",
                    age: "Edad",
                    years: "años",
                    location: "Ubicación",
                    role: "Rol",
                    story: "Mi historia",
                    story1: "Mi carrera no empezó en la tecnología. Tras varios años en diferentes sectores, decidí dar un giro de 180 grados y apostar todo por el desarrollo de software. Completé mi Grado Superior en Desarrollo de Aplicaciones Multiplataforma en ILERNA mientras construía productos reales por mi cuenta.",
                    story2: "Hoy en día, gestiono un e-commerce en producción, un sistema de gestión de restaurantes open-source y dos aplicaciones Android nativas. Para profundizar aún más en mi oficio y dominar los fundamentos, actualmente estoy cursando el Grado en Ingeniería Informática en la UNED.",
                    story3: "Me muevo con comodidad en todo el stack y en mobile nativo. Mi enfoque es construir software resiliente que prospere en producción, no solo demos que funcionen en localhost.",
                    traits: "Lo que me diferencia",
                    trait1: "<strong>Entrega de nivel producción</strong> — elparedes.es con pagos Redsys, integración ERP y tráfico real.",
                    trait2: "<strong>Arquitecturas limpias</strong> — Clean Architecture, MVVM y patrones sólidos en todo mi trabajo Android.",
                    trait3: "<strong>Desarrollador de ciclo completo</strong> — diseño, desarrollo, despliegue y mantenimiento. Puedo poner en producción sin dependencias externas.",
                    trait4: "<strong>Mentalidad de producto</strong> — el código es un medio, no el fin. Construyo cosas que la gente realmente usa.",
                    beyond: "Más allá del teclado",
                    beyondText: "Nerd de los juegos de mesa, consumidor compulsivo de anime y lector de fantasía épica. Si tu stack incluye café fuerte y debates sobre arquitectura, nos llevaremos bien.",
                    contact: "Contacto"
                },
                experience: {
                    label: "Experiencia",
                    description: "Trayectoria profesional",
                    title: "Experiencia Profesional",
                    items: [
                        {
                            role: 'Responsable de IT (Head of IT)',
                            company: 'El Paredes Chico SL',
                            dates: 'Oct 2025 — Actualidad',
                            status: 'current',
                            statusLabel: 'ACTUAL',
                            details: 'Liderando la transformación digital: despliegue de Odoo ERP, portal web corporativo (Next.js, Firebase) e integraciones de sistemas. Administración de servidores Linux y Windows, infraestructura GCP + Docker, pipelines CI/CD y configuración de redes/seguridad para productos full-stack y móviles.'
                        },
                        {
                            role: 'CEO & Fundador',
                            company: 'Adoptaunordenador.com · Autónomo',
                            dates: 'Ene 2016 — Dic 2020',
                            status: 'past',
                            statusLabel: 'COMPLETADO',
                            details: 'Fundé y gestioné una startup social centrada en hardware reacondicionado. Construí y operé el negocio de e-commerce, la logística y el soporte técnico al cliente.'
                        },
                        {
                            role: 'Responsable de Logística',
                            company: 'Globalatc SL',
                            dates: 'Oct 2012 — Ago 2015',
                            status: 'past',
                            statusLabel: 'COMPLETADO',
                            details: 'Gestión de operaciones logísticas internacionales, coordinación de proveedores y optimización de rutas.'
                        }
                    ]
                },
                skills: {
                    label: "Habilidades",
                    description: "Stack tecnológico completo",
                    title: "Stack Tecnológico",
                    categories: {
                        'Languages': 'Lenguajes',
                        'Mobile': 'Móvil',
                        'Frontend': 'Frontend',
                        'Backend & APIs': 'Backend & APIs',
                        'Databases': 'Bases de Datos',
                        'Full-stack & Mobile Ops': 'Full-stack & Mobile Ops',
                        'Tooling': 'Herramientas'
                    }
                },
                projects: {
                    label: "Proyectos",
                    description: "Producción y OSS",
                    title: "Proyectos",
                    badges: {
                        production: "EN PRODUCCIÓN",
                        oss: "OPEN SOURCE",
                        android: "ANDROID",
                        vanilla: "VANILLA JS"
                    },
                    items: {
                        paredes: "E-commerce de nivel producción para vehículos industriales y maquinaria con pasarela Redsys (Tarjeta y Bizum), Google OAuth y sincronización en tiempo real con Odoo ERP para gestión automatizada de inventario.",
                        disherio: "Suite de gestión de restaurantes de código abierto y auto-hospedada. Con pedidos mediante código QR, Sistema de Visualización de Cocina (KDS) en tiempo real y TPV multi-rol (Admin, Camarero, Cocina y Caja). Soporta gestión de menús con variantes/alérgenos y despliegue flexible en local o nube.",
                        timetutor: "App nativa Android para la gestión de tutorías privadas. Calendario interactivo, control de asistencia, facturación automática, notificaciones push, sincronización offline y roles dedicados para profesor/alumno.",
                        episodeo: "Rastreador personal de series de TV para Android con búsqueda TMDB, listas inteligentes (viendo, pendiente, terminada, abandonada), uso compartido de listas mediante códigos, caché offline-first y cambio de tema. Construida con Clean Architecture + MVVM.",
                        hismar: "Portfolio interactivo construido como una terminal retro totalmente funcional. Vanilla JS/CSS/HTML, animaciones canvas basadas en física, arquitectura modular, gestor de estado, comandos dinámicos y diseño pixel-art."
                    }
                },
                education: {
                    label: "Educación",
                    description: "Formación académica",
                    title: "Educación",
                    items: [
                        {
                            title: 'Grado en Ingeniería Informática',
                            institution: 'UNED — Universidad Nacional de Educación a Distancia | Feb 2026 — Actualidad',
                            status: 'in-progress',
                            statusLabel: 'EN CURSO · NIVEL 6 EQF',
                            details: 'Enfoque: Formación universitaria en ingeniería de software, algoritmos, arquitectura de computadores y sistemas distribuidos.'
                        },
                        {
                            title: 'Técnico Superior (DTS) en Desarrollo de Aplicaciones Multiplataforma',
                            institution: 'ILERNA Online | Sept 2023 — Feb 2026',
                            status: 'completed',
                            statusLabel: 'COMPLETADO · NIVEL 5 EQF',
                            details: 'Enfoque: Desarrollo móvil nativo (Kotlin/Android), arquitecturas multiplataforma, gestión de bases de datos y entornos cloud-native.'
                        },
                        {
                            title: 'Bachillerato',
                            institution: 'IES Ricardo Ortega | 2004 — 2006',
                            status: 'completed',
                            statusLabel: 'COMPLETADO',
                            details: 'Estado: Completado'
                        }
                    ]
                },
                cv: {
                    label: "CV",
                    description: "Descargar currículum",
                    title: "Curriculum Vitae",
                    desc: "Descarga la versión más reciente en PDF:",
                    name: "Curriculum Vitae — Ismail Haddouche Rhali"
                },
                help: {
                    label: "Ayuda",
                    description: "Todos los comandos",
                    title: "Guía de Comandos",
                    info_group: "Información",
                    sys_group: "Sistema",
                    tips_group: "Consejos",
                    tip1: "Haz clic en cualquier comando para ejecutarlo",
                    tip2: "Usa <kbd>Tab</kbd> para autocompletar",
                    tip3: "Navega por el historial con <kbd>↑</kbd> / <kbd>↓</kbd>",
                    tip4: "Pulsa <kbd>Esc</kbd> para saltar animaciones",
                    tip5: "Hay varios easter eggs ocultos en la terminal: pruébala y diviértete encontrándolos",
                    footer: "// Construido con cerebro, demasiado café y viendo a",
                    about_desc: "Quién soy, trayectoria y contacto",
                    exp_desc: "Trayectoria profesional e historial",
                    skills_desc: "Stack tecnológico completo",
                    proj_desc: "Proyectos en producción y open-source",
                    edu_desc: "Formación académica",
                    cv_desc: "Descargar CV en PDF",
                    help_desc: "Mostrar esta guía",
                    clear: {
                        label: "Limpiar",
                        description: "Limpiar la consola"
                    },
                    clear_desc: "Limpiar la consola"
                }
            },
            ui: {
                clear_tooltip: "Limpiar terminal",
                placeholder: "Escribe 'help' para empezar...",
                unrecognized: "Comando no reconocido: ",
                help_hint: "Escribe 'help' para ver la lista de comandos.",
                restarting: "Reiniciando terminal..."
            }
        },
        en: {
            welcome: {
                title: "// Welcome to my interactive terminal.",
                subtitle: "// Explore who I am, what I build, and how I think.",
                role: "Full-stack · Mobile · Murcia, Spain",
                help: "help       → list every available command",
                about: "about      → personal background and contact",
                experience: "experience → professional journey",
                projects: "projects   → production & open-source work",
                skills: "skills     → complete technology stack",
                education: "education  → academic path",
                cv: "cv         → download résumé",
                footer: "// Tab: autocomplete  ·  ↑↓: command history  ·  there are easter eggs to discover 👀"
            },
            menu: {
                about: "/about",
                experience: "/experience",
                skills: "/skills",
                projects: "/projects",
                education: "/education",
                cv: "/cv",
                help: "/help"
            },
            commands: {
                about: {
                    label: "About",
                    description: "Biography & contact",
                    availability: "Available for new opportunities",
                    age: "Age",
                    years: "years old",
                    location: "Location",
                    role: "Role",
                    story: "My story",
                    story1: "I didn’t start my career in tech. After several years in different industries, I decided to pivot and go all-in on software development. I completed my Higher National Diploma (HND) in Multi-platform Software Development at ILERNA while building real-world products on the side.",
                    story2: "Today, I manage an e-commerce platform in production, an open-source restaurant management system, and two native Android apps. To further deepen my craft and master the fundamentals, I am currently pursuing a Bachelor of Science (BSc) in Computer Engineering at UNED.",
                    story3: "I work comfortably across the full stack and native mobile. My focus is on building resilient software that thrives in production, not just demos that run on localhost.",
                    traits: "What sets me apart",
                    trait1: "<strong>Production-grade delivery</strong> — elparedes.es with Redsys payments, ERP integration, and real customer traffic.",
                    trait2: "<strong>Clean architectures</strong> — Clean Architecture, MVVM, and solid patterns across all my Android work.",
                    trait3: "<strong>Full-cycle developer</strong> — design, development, deployment, and maintenance. I can ship to production without external dependencies.",
                    trait4: "<strong>Product mindset</strong> — code is a means, not the end. I build things people actually use.",
                    beyond: "Beyond the keyboard",
                    beyondText: "Board-game nerd, compulsive anime watcher, and epic-fantasy reader. If your stack includes strong coffee and architecture debates, we will get along.",
                    contact: "Contact"
                },
                experience: {
                    label: "Experience",
                    description: "Professional journey",
                    title: "Professional Experience",
                    items: [
                        {
                            role: 'Head of IT',
                            company: 'El Paredes Chico SL',
                            dates: 'Oct 2025 — Present',
                            status: 'current',
                            statusLabel: 'CURRENT',
                            details: 'Leading the digital transformation: Odoo ERP rollout, corporate web portal (Next.js, Firebase), and system integrations. Linux and Windows Server administration, GCP + Docker infrastructure, CI/CD pipelines, and network/security configuration for full-stack and mobile products.'
                        },
                        {
                            role: 'CEO & Founder',
                            company: 'Adoptaunordenador.com · Self-employed',
                            dates: 'Jan 2016 — Dec 2020',
                            status: 'past',
                            statusLabel: 'COMPLETED',
                            details: 'Founded and managed a social startup focused on refurbished hardware. Built and operated the e-commerce business, logistics, and customer technical support.'
                        },
                        {
                            role: 'Logistics Manager',
                            company: 'Globalatc SL',
                            dates: 'Oct 2012 — Aug 2015',
                            status: 'past',
                            statusLabel: 'COMPLETED',
                            details: 'Managed international logistics operations, coordinated suppliers, and optimized routes.'
                        }
                    ]
                },
                skills: {
                    label: "Skills",
                    description: "Tech stack overview",
                    title: "Technology Stack",
                    categories: {
                        'Languages': 'Languages',
                        'Mobile': 'Mobile',
                        'Frontend': 'Frontend',
                        'Backend & APIs': 'Backend & APIs',
                        'Databases': 'Databases',
                        'Full-stack & Mobile Ops': 'Full-stack & Mobile Ops',
                        'Tooling': 'Tooling'
                    }
                },
                projects: {
                    label: "Projects",
                    description: "Production & OSS",
                    title: "Projects",
                    badges: {
                        production: "IN PRODUCTION",
                        oss: "OPEN SOURCE",
                        android: "ANDROID",
                        vanilla: "VANILLA JS"
                    },
                    items: {
                        paredes: "Production-grade e-commerce for industrial vehicles and machinery featuring Redsys gateway (Card & Bizum), Google OAuth, and real-time Odoo ERP synchronization for automated inventory management.",
                        disherio: "Open-source, self-hosted restaurant management suite. Featuring QR-code ordering, real-time Kitchen Display System (KDS), and a multi-role POS (Admin, Waitstaff, Kitchen, and Cashier). Supports menu management with variants/allergens and flexible local or cloud deployment.",
                        timetutor: "Native Android app for private tutoring management. Interactive calendar, attendance tracking, automatic invoicing, push notifications, offline sync, and dedicated teacher/student roles.",
                        episodeo: "Personal TV-series tracker for Android with TMDB search, smart lists (watching, pending, finished, abandoned), list sharing via codes, offline-first cache, and theme switching. Built with Clean Architecture + MVVM.",
                        hismar: "Interactive portfolio built as a fully functional retro terminal. Vanilla JS/CSS/HTML, physics-based canvas animations, modular architecture, state manager, dynamic commands, and pixel-art design."
                    }
                },
                education: {
                    label: "Education",
                    description: "Academic path",
                    title: "Education",
                    items: [
                        {
                            title: 'Bachelor of Science (BSc) in Computer Engineering',
                            institution: 'UNED — National Distance Education University | Feb 2026 — Present',
                            status: 'in-progress',
                            statusLabel: 'IN PROGRESS · LEVEL 6 EQF',
                            details: 'Focus: University-level training in software engineering, algorithms, computer architecture, and distributed systems.'
                        },
                        {
                            title: 'Higher National Diploma (HND) in Multi-platform Software Development',
                            institution: 'ILERNA Online | Sept 2023 — Feb 2026',
                            status: 'completed',
                            statusLabel: 'COMPLETED · LEVEL 5 EQF',
                            details: 'Focus: Native mobile development (Kotlin/Android), cross-platform architectures, database management, and cloud-native environments.'
                        },
                        {
                            title: 'High School Diploma',
                            institution: 'IES Ricardo Ortega | 2004 — 2006',
                            status: 'completed',
                            statusLabel: 'COMPLETED',
                            details: 'Status: Completed'
                        }
                    ]
                },
                cv: {
                    label: "CV",
                    description: "Download résumé",
                    title: "Curriculum Vitae",
                    desc: "Download the latest PDF version:",
                    name: "Curriculum Vitae — Ismail Haddouche Rhali"
                },
                help: {
                    label: "Help",
                    description: "All commands",
                    title: "Command Guide",
                    info_group: "Information",
                    sys_group: "System",
                    tips_group: "Tips",
                    tip1: "Click any command to run it directly",
                    tip2: "Use <kbd>Tab</kbd> to autocomplete",
                    tip3: "Navigate history with <kbd>↑</kbd> / <kbd>↓</kbd>",
                    tip4: "Press <kbd>Esc</kbd> to skip animations",
                    tip5: "There are several hidden easter eggs in this terminal—explore and have fun finding them",
                    footer: "// Built with brain, far too much coffee, and watching",
                    about_desc: "Who I am, background, and contact",
                    exp_desc: "Professional trajectory and history",
                    skills_desc: "Complete technology stack",
                    proj_desc: "Production and open-source projects",
                    edu_desc: "Academic background",
                    cv_desc: "Download the CV in PDF",
                    help_desc: "Show this guide",
                    clear: {
                        label: "Clear",
                        description: "Clear the console"
                    },
                    clear_desc: "Clear the console"
                }
            },
            ui: {
                clear_tooltip: "Clear terminal",
                placeholder: "Type 'help' to begin...",
                unrecognized: "Unrecognized command: ",
                help_hint: "Type 'help' to list the available commands.",
                restarting: "Restarting terminal..."
            }
        }
    },
    
    t(path) {
        const keys = path.split('.');
        let result = this.translations[this.current];
        for (const key of keys) {
            if (result && result[key]) {
                result = result[key];
            } else {
                return path; // Fallback
            }
        }
        return result;
    },
    
    setLanguage(lang) {
        if (this.translations[lang]) {
            this.current = lang;
            localStorage.setItem('hismar_lang', lang);
            document.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
        }
    }
};
