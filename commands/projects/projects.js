/**
 * COMANDO PROJECTS - Proyectos desarrollados
 */
window.commands_projects_projects_js = {
    async execute(terminal, animation) {
        const { container, content, sidebar } = terminal.createCommandContainer('projects');

        const projectsData = [
            {
                name: 'El Paredes',
                description: 'Production-grade e-commerce for trailer sales with Redsys gateway (card + Bizum), Google OAuth sign-in, real-time Odoo ERP sync, and automated inventory management.',
                tech: ['Next.js', 'Firebase', 'Firestore', 'Redsys', 'Odoo', 'App Hosting'],
                link: 'https://elparedes.es/',
                linkLabel: 'elparedes.es',
                badge: 'IN PRODUCTION'
            },
            {
                name: 'Disherio',
                description: 'Open-source, self-hosted hospitality suite. QR ordering at the table (no app), real-time kitchen display, role-based POS (admin, kitchen, cashier), menu management with variants/allergens, local or cloud deployment.',
                tech: ['TypeScript', 'Angular', 'Node.js', 'MongoDB', 'Socket.io', 'Docker'],
                link: 'https://github.com/ismailhaddouche/disherio',
                linkLabel: 'GitHub',
                badge: 'OPEN SOURCE'
            },
            {
                name: 'TimeTutor',
                description: 'Native Android app for private tutoring management. Interactive calendar, attendance tracking, automatic invoicing, push notifications, offline sync, and dedicated teacher/student roles.',
                tech: ['Kotlin', 'Jetpack Compose', 'Clean Architecture', 'MVVM', 'Firebase', 'Firebase Functions'],
                link: 'https://github.com/ismailhaddouche/timetutor',
                linkLabel: 'GitHub',
                badge: 'ANDROID'
            },
            {
                name: 'hismar.dev',
                description: 'Interactive portfolio built as a fully functional retro terminal. Vanilla JS/CSS/HTML, physics-based canvas animations, modular architecture, state manager, dynamic commands, and pixel-art design.',
                tech: ['JavaScript', 'HTML5', 'CSS3', 'Canvas API', 'Vanilla JS'],
                link: 'https://github.com/ismailhaddouche/hismar.dev',
                linkLabel: 'GitHub',
                badge: 'VANILLA JS'
            }
        ];

        const defaultTechIconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M8 12h8"></path><path d="M12 8v8"></path></svg>`;

        const customTechIcons = {
            redsys: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" ry="2"></rect><path d="M3 10h18"></path><path d="M7 15h2"></path></svg>`,
            odoo: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="12" r="4"></circle><circle cx="16" cy="12" r="4"></circle></svg>`,
            'app hosting': `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="8" rx="2"></rect><rect x="3" y="14" width="18" height="6" rx="2"></rect><path d="M7 8h.01"></path><path d="M7 18h.01"></path></svg>`,
            'clean architecture': `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 2 9 5-9 5-9-5z"></path><path d="m3 12 9 5 9-5"></path><path d="m3 17 9 5 9-5"></path></svg>`,
            mvvm: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="7" r="3"></circle><circle cx="6" cy="17" r="3"></circle><circle cx="18" cy="17" r="3"></circle><path d="M6 10v4"></path><path d="M9 7h4a4 4 0 0 1 4 4v3"></path><path d="M12 11h3"></path></svg>`,
            retrofit: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-5"></path><path d="M9 7V2"></path><path d="M15 7V2"></path><path d="M7 7h10v4a5 5 0 0 1-10 0z"></path></svg>`,
            room: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5v6c0 1.66 4 3 9 3s9-1.34 9-3V5"></path><path d="M3 11v6c0 1.66 4 3 9 3s9-1.34 9-3v-6"></path></svg>`,
            hilt: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s-8-4-8-10V5l8-3 8 3v7c0 6-8 10-8 10z"></path></svg>`,
            'real-time': `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8.5C5 6 8 4 12 4s7 2 10 4.5"></path><path d="M2 15.5C5 18 8 20 12 20s7-2 10-4.5"></path><path d="M2 12c3-2 6-4 10-4s7 2 10 4"></path></svg>`
        };

        const slugifyTech = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        const techIcons = {
            'next-js': 'devicon-nextjs-plain',
            'firebase': 'devicon-firebase-plain',
            'firestore': 'devicon-firebase-plain',
            'redsys': customTechIcons.redsys,
            'odoo': customTechIcons.odoo,
            'app-hosting': customTechIcons['app hosting'],
            'typescript': 'devicon-typescript-plain',
            'angular': 'devicon-angularjs-plain',
            'node-js': 'devicon-nodejs-plain',
            'mongodb': 'devicon-mongodb-plain',
            'socket-io': 'devicon-socketio-original',
            'docker': 'devicon-docker-plain',
            'kotlin': 'devicon-kotlin-plain',
            'jetpack-compose': 'devicon-android-plain',
            'clean-architecture': customTechIcons['clean architecture'],
            'mvvm': customTechIcons.mvvm,
            'firebase-functions': 'devicon-firebase-plain',
            'retrofit': customTechIcons.retrofit,
            'room': customTechIcons.room,
            'hilt': customTechIcons.hilt,
            'github-actions': 'devicon-githubactions-plain',
            'javascript': 'devicon-javascript-plain',
            'html5': 'devicon-html5-plain',
            'css3': 'devicon-css3-plain',
            'canvas-api': 'devicon-html5-plain',
            'vanilla-js': 'devicon-javascript-plain',
            'real-time': customTechIcons['real-time']
        };

        const buildTechIcon = (iconDef) => {
            if (!iconDef) {
                return `<span class="project-tag-icon project-tag-icon--svg" aria-hidden="true">${defaultTechIconSvg}</span>`;
            }

            const trimmed = iconDef.trim();
            if (trimmed.startsWith('<svg')) {
                return `<span class="project-tag-icon project-tag-icon--svg" aria-hidden="true">${trimmed}</span>`;
            }

            return `<i class="${iconDef} colored project-tag-icon" aria-hidden="true"></i>`;
        };

        // Title
        const title = document.createElement('h2');
        title.className = 'section-title';
        title.textContent = 'Projects';
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
                const techSlug = slugifyTech(t);
                tag.classList.add(`project-tag--${techSlug}`);
                const iconMarkup = buildTechIcon(techIcons[techSlug]);
                tag.innerHTML = `${iconMarkup}<span>${t}</span>`;
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
