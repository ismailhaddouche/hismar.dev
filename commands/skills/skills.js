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
            kotlin: 'fa-brands fa-android skill-icon--kotlin',
            typescript: 'fa-brands fa-codepen skill-icon--typescript',
            javascript: 'fa-brands fa-js skill-icon--javascript',
            java: 'fa-brands fa-java skill-icon--java',
            'c#': 'fa-solid fa-hashtag skill-icon--csharp',
            sql: 'fa-solid fa-database skill-icon--sql',
            'jetpack compose': 'fa-solid fa-mobile-screen skill-icon--jetpack',
            mvvm: 'fa-solid fa-diagram-project skill-icon--mvvm',
            'clean architecture': 'fa-solid fa-layer-group skill-icon--clean-architecture',
            hilt: 'fa-solid fa-shield-halved skill-icon--hilt',
            retrofit: 'fa-solid fa-plug skill-icon--retrofit',
            room: 'fa-solid fa-database skill-icon--room',
            angular: 'fa-brands fa-angular skill-icon--angular',
            react: 'fa-brands fa-react skill-icon--react',
            'next.js': 'fa-solid fa-forward skill-icon--next',
            html5: 'fa-brands fa-html5 skill-icon--html5',
            css3: 'fa-brands fa-css3-alt skill-icon--css3',
            'node.js': 'fa-brands fa-node-js skill-icon--node',
            'rest apis': 'fa-solid fa-network-wired skill-icon--rest',
            'socket.io': 'fa-solid fa-wave-square skill-icon--socket',
            firebase: 'fa-solid fa-fire-flame-simple skill-icon--firebase',
            firestore: 'fa-solid fa-database skill-icon--firestore',
            mongodb: 'fa-solid fa-leaf skill-icon--mongodb',
            postgresql: 'fa-solid fa-database skill-icon--postgres',
            mysql: 'fa-solid fa-database skill-icon--mysql',
            sqlite: 'fa-solid fa-database skill-icon--sqlite',
            gcp: 'fa-solid fa-cloud skill-icon--gcp',
            docker: 'fa-brands fa-docker skill-icon--docker',
            'github actions': 'fa-brands fa-github skill-icon--gha',
            terraform: 'fa-solid fa-cubes skill-icon--terraform',
            'ci/cd': 'fa-solid fa-arrows-rotate skill-icon--cicd',
            git: 'fa-brands fa-git-alt skill-icon--git',
            github: 'fa-brands fa-github skill-icon--github',
            'android studio': 'fa-solid fa-mobile-screen skill-icon--android-studio',
            'vs code': 'fa-solid fa-code skill-icon--vscode',
            'claude code': 'fa-solid fa-wand-magic-sparkles skill-icon--claude',
            linux: 'fa-brands fa-linux skill-icon--linux'
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
