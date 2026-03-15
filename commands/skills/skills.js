/**
 * COMANDO SKILLS - Habilidades técnicas
 */
window.commands_skills_skills_js = {
    async execute(terminal, animation) {
        const { container, content, sidebar } = terminal.createCommandContainer('skills');

        const defaultIconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M8 12h8"></path><path d="M12 8v8"></path></svg>`;

        const customIcons = {
            layers: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 2 9 5-9 5-9-5 9-5Z"></path><path d="M3 12l9 5 9-5"></path><path d="M3 17l9 5 9-5"></path></svg>`,
            flow: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="7" r="3"></circle><circle cx="6" cy="17" r="3"></circle><circle cx="18" cy="17" r="3"></circle><path d="M6 10v4"></path><path d="M9 7h4a4 4 0 0 1 4 4v3"></path><path d="M12 11h3"></path></svg>`,
            shield: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s-8-4-8-10V5l8-3 8 3v7c0 6-8 10-8 10Z"></path></svg>`,
            plug: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-5"></path><path d="M9 7V2"></path><path d="M15 7V2"></path><path d="M7 7h10v4a5 5 0 0 1-10 0V7Z"></path></svg>`,
            database: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5v6c0 1.66 4 3 9 3s9-1.34 9-3V5"></path><path d="M3 11v6c0 1.66 4 3 9 3s9-1.34 9-3v-6"></path></svg>`,
            pen: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3Z"></path><path d="M18 13l-3-3"></path><path d="M2 22l4-1 11-11-3-3L3 18l-1 4Z"></path></svg>`,
            stack: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 2 9 4-9 4-9-4 9-4Z"></path><path d="m3 10 9 4 9-4"></path><path d="m3 16 9 4 9-4"></path></svg>`,
            nodes: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="5" cy="5" r="3"></circle><circle cx="19" cy="5" r="3"></circle><circle cx="12" cy="19" r="3"></circle><path d="M7 7l3 8"></path><path d="m17 7-3 8"></path><path d="m5 5 14 0"></path></svg>`,
            spark: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 2 1.8 5.5L19 9l-5.2 1.5L12 16l-1.8-5.5L5 9l5.2-1.5Z"></path><path d="m5 19 2-2"></path><path d="m19 19-2-2"></path></svg>`
        };

        const skills = {
            'Lenguajes': ['Kotlin', 'TypeScript', 'JavaScript', 'Java', 'C#', 'SQL'],
            'Mobile': ['Jetpack Compose', 'MVVM', 'Clean Architecture', 'Hilt', 'Retrofit', 'Room', 'Firebase'],
            'Frontend': ['Angular', 'React', 'Next.js', 'HTML5', 'CSS3'],
            'Backend & APIs': ['Node.js', 'REST APIs', 'Socket.io', 'Firebase'],
            'Bases de datos': ['Firestore', 'MongoDB', 'PostgreSQL', 'MySQL', 'SQLite'],
            'Fullstack & Mobile Ops': ['GCP', 'Docker', 'GitHub Actions', 'CI/CD'],
            'Herramientas': ['Git', 'GitHub', 'Android Studio', 'VS Code', 'Claude Code', 'Linux']
        };

        const skillIcons = {
            kotlin: 'devicon-kotlin-plain',
            typescript: 'devicon-typescript-plain',
            javascript: 'devicon-javascript-plain',
            java: 'devicon-java-plain',
            'c#': 'devicon-csharp-plain',
            sql: 'devicon-azuresql-plain',
            'jetpack compose': 'devicon-android-plain',
            mvvm: customIcons.flow,
            'clean architecture': customIcons.layers,
            hilt: customIcons.shield,
            retrofit: customIcons.plug,
            room: customIcons.database,
            angular: 'devicon-angularjs-plain',
            react: 'devicon-react-original',
            'next.js': 'devicon-nextjs-plain',
            html5: 'devicon-html5-plain',
            css3: 'devicon-css3-plain',
            'node.js': 'devicon-nodejs-plain',
            'rest apis': 'devicon-fastapi-plain',
            'socket.io': 'devicon-socketio-original',
            firebase: 'devicon-firebase-plain',
            firestore: 'devicon-firebase-plain',
            mongodb: 'devicon-mongodb-plain',
            postgresql: 'devicon-postgresql-plain',
            mysql: 'devicon-mysql-plain',
            sqlite: 'devicon-sqlite-plain',
            gcp: 'devicon-googlecloud-plain',
            docker: 'devicon-docker-plain',
            'github actions': 'devicon-githubactions-plain',
            terraform: 'devicon-terraform-plain',
            'ci/cd': 'devicon-githubactions-plain',
            git: 'devicon-git-plain',
            github: 'devicon-github-original',
            'android studio': 'devicon-androidstudio-plain',
            'vs code': 'devicon-vscode-plain',
            'claude code': customIcons.spark,
            linux: 'devicon-linux-plain'
        };

        const buildIconMarkup = (iconDef) => {
            if (!iconDef) {
                return `<span class="skill-icon skill-icon-svg" aria-hidden="true">${defaultIconSvg}</span>`;
            }

            const trimmed = iconDef.trim();
            if (trimmed.startsWith('<svg')) {
                return `<span class="skill-icon skill-icon-svg" aria-hidden="true">${trimmed}</span>`;
            }

            return `<i class="${iconDef} colored skill-icon" aria-hidden="true"></i>`;
        };

        let html = '<h2 class="section-title">Stack Tecnológico</h2>';
        html += '<div class="skills-content">';

        for (const category in skills) {
            html += '<div class="skill-category">';
            html += `<h3 class="skill-category-title">${category}</h3>`;
            html += '<ul class="skill-list">';
            for (const skill of skills[category]) {
                const iconMarkup = buildIconMarkup(skillIcons[skill.toLowerCase()]);
                html += `<li class="skill-item">${iconMarkup}<span>${skill}</span></li>`;
            }
            html += '</ul></div>';
        }

        html += '</div>';

        const skillsSection = document.createElement('div');
        skillsSection.innerHTML = html;

        content.appendChild(skillsSection);

        if (animation && animation.init) {
            animation.init(sidebar, skills);
        }

        terminal.autoScrollConsole(container);
    }
};
