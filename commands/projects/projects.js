/**
 * COMANDO PROJECTS - Proyectos desarrollados
 */
window.commands_projects_projects_js = {
    async execute(terminal, animation) {
        const { container, content, sidebar } = terminal.createCommandContainer('projects');

        const projectsData = [
            {
                name: 'El Paredes',
                description: 'E-commerce en producción real. Tienda online de remolques con pasarela de pago Redsys (tarjeta + Bizum), autenticación Google OAuth, sincronización en tiempo real con ERP Odoo y gestión de inventario automática.',
                tech: ['Next.js', 'Firebase', 'Firestore', 'Redsys', 'Odoo', 'App Hosting'],
                link: 'https://elparedes.es/',
                linkLabel: 'elparedes.es',
                badge: 'EN PRODUCCIÓN'
            },
            {
                name: 'Disherio',
                description: 'Plataforma open-source y self-hosted para gestión de hostelería. Pedidos por QR en mesa (sin app), Kitchen Display System en tiempo real, POS con roles (admin, cocina, caja), gestión de menú con variantes y alérgenos, y despliegue local o en la nube.',
                tech: ['TypeScript', 'Angular', 'Node.js', 'MongoDB', 'Socket.io', 'Docker'],
                link: 'https://github.com/ismailhaddouche/disherio',
                linkLabel: 'GitHub',
                badge: 'OPEN SOURCE'
            },
            {
                name: 'TimeTutor',
                description: 'Aplicación Android nativa para gestión integral de clases particulares. Calendario interactivo, seguimiento de asistencia, generación automática de facturas, notificaciones push y sincronización offline. Roles diferenciados para profesores y alumnos.',
                tech: ['Kotlin', 'Jetpack Compose', 'Clean Architecture', 'MVVM', 'Firebase', 'Cloud Functions'],
                link: 'https://github.com/ismailhaddouche/timetutor',
                linkLabel: 'GitHub',
                badge: 'ANDROID'
            },
            {
                name: 'hismar.dev',
                description: 'Portfolio interactivo simulado como una terminal retro completamente funcional. Creado sin frameworks (Vanilla JS/CSS/HTML), animaciones físicas complejas en el canvas integradas con arquitectura modular, gestor de estado, comandos dinámicos y diseño pixel-art.',
                tech: ['JavaScript', 'HTML5', 'CSS3', 'Canvas API', 'Vanilla JS'],
                link: 'https://github.com/ismailhaddouche/hismar.dev',
                linkLabel: 'GitHub',
                badge: 'VANILLA JS'
            }
        ];

        const techIcons = {
            'next.js': 'devicon-nextjs-plain',
            'firebase': 'devicon-firebase-plain',
            'firestore': 'devicon-firebase-plain',
            'redsys': '',
            'odoo': '',
            'app hosting': '',
            'typescript': 'devicon-typescript-plain',
            'angular': 'devicon-angularjs-plain',
            'node.js': 'devicon-nodejs-plain',
            'mongodb': 'devicon-mongodb-plain',
            'socket.io': 'devicon-socketio-original',
            'docker': 'devicon-docker-plain',
            'kotlin': 'devicon-kotlin-plain',
            'jetpack compose': 'devicon-android-plain',
            'clean architecture': '',
            'mvvm': '',
            'cloud functions': 'devicon-firebase-plain',
            'retrofit': '',
            'room': '',
            'hilt': '',
            'github actions': 'devicon-githubactions-plain',
            'javascript': 'devicon-javascript-plain',
            'html5': 'devicon-html5-plain',
            'css3': 'devicon-css3-plain',
            'canvas api': 'devicon-html5-plain',
            'vanilla js': 'devicon-javascript-plain',
            'real-time': ''
        };

        // Title
        const title = document.createElement('h2');
        title.className = 'section-title';
        title.textContent = 'Proyectos';
        content.appendChild(title);

        const projectsGrid = document.createElement('div');
        projectsGrid.className = 'projects-grid';
        content.appendChild(projectsGrid);

        for (const project of projectsData) {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.setAttribute('role', 'link');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `${project.name}: ${project.description}`);
            const openLink = () => window.open(project.link, '_blank', 'noopener,noreferrer');
            card.onclick = openLink;
            card.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLink(); } };

            // Badge
            const badge = document.createElement('span');
            badge.className = 'project-badge';
            badge.textContent = project.badge;
            card.appendChild(badge);

            // Title
            const titleEl = document.createElement('h3');
            titleEl.className = 'project-title';
            titleEl.textContent = project.name;
            card.appendChild(titleEl);

            // Description
            const desc = document.createElement('p');
            desc.className = 'project-description';
            desc.textContent = project.description;
            card.appendChild(desc);

            // Tech tags
            const tagsContainer = document.createElement('div');
            tagsContainer.className = 'project-tags';
            project.tech.forEach(t => {
                const tag = document.createElement('span');
                tag.className = 'project-tag';
                const iconClass = techIcons[t.toLowerCase()] || '';
                tag.innerHTML = iconClass ? `<i class="${iconClass} colored"></i> ${t}` : t;
                tagsContainer.appendChild(tag);
            });
            card.appendChild(tagsContainer);

            // Link
            const linkEl = document.createElement('div');
            linkEl.className = 'project-link-row';
            linkEl.innerHTML = `<span class="project-link-text">→ ${project.linkLabel}</span>`;
            card.appendChild(linkEl);

            projectsGrid.appendChild(card);
        }

        if (animation && animation.init) {
            animation.init(sidebar);
        }

        terminal.autoScrollConsole(container);
    }
};
