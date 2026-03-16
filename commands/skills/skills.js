/**
 * COMANDO SKILLS - Habilidades técnicas
 */
window.commands_skills_skills_js = {
    async execute(terminal, animation) {
        const { container, content, sidebar } = terminal.createCommandContainer('skills');

        
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
            kotlin: 'fa-brands fa-android',
            typescript: 'fa-brands fa-codepen',
            javascript: 'fa-brands fa-js',
            java: 'fa-brands fa-java',
            'c#': 'fa-solid fa-hashtag',
            sql: 'fa-solid fa-database',
            'jetpack compose': 'fa-solid fa-mobile-screen',
            mvvm: 'fa-solid fa-diagram-project',
            'clean architecture': 'fa-solid fa-layer-group',
            hilt: 'fa-solid fa-shield-halved',
            retrofit: 'fa-solid fa-plug',
            room: 'fa-solid fa-database',
            angular: 'fa-brands fa-angular',
            react: 'fa-brands fa-react',
            'next.js': 'fa-solid fa-forward',
            html5: 'fa-brands fa-html5',
            css3: 'fa-brands fa-css3-alt',
            'node.js': 'fa-brands fa-node-js',
            'rest apis': 'fa-solid fa-network-wired',
            'socket.io': 'fa-solid fa-wave-square',
            firebase: 'fa-solid fa-fire-flame-simple',
            firestore: 'fa-solid fa-database',
            mongodb: 'fa-solid fa-leaf',
            postgresql: 'fa-solid fa-database',
            mysql: 'fa-solid fa-database',
            sqlite: 'fa-solid fa-database',
            gcp: 'fa-solid fa-cloud',
            docker: 'fa-brands fa-docker',
            'github actions': 'fa-brands fa-github',
            terraform: 'fa-solid fa-cubes',
            'ci/cd': 'fa-solid fa-arrows-rotate',
            git: 'fa-brands fa-git-alt',
            github: 'fa-brands fa-github',
            'android studio': 'fa-solid fa-mobile-screen',
            'vs code': 'fa-solid fa-code',
            'claude code': 'fa-solid fa-wand-magic-sparkles',
            linux: 'fa-brands fa-linux'
        };

        const buildIconMarkup = (iconClasses) => {
            const classes = iconClasses || 'fa-solid fa-circle';
            return `<i class="skill-icon ${classes}" aria-hidden="true"></i>`;
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
