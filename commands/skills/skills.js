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
            kotlin: 'lucide-code-2',
            typescript: 'lucide-file-text',
            javascript: 'lucide-file-text',
            java: 'lucide-coffee',
            'c#': 'lucide-file-text',
            sql: 'lucide-database',
            'jetpack compose': 'lucide-smartphone',
            mvvm: 'lucide-layers',
            'clean architecture': 'lucide-box',
            hilt: 'lucide-shield',
            retrofit: 'lucide-zap',
            room: 'lucide-hard-drive',
            angular: 'lucide-triangle',
            react: 'lucide-atom',
            'next.js': 'lucide-triangle',
            html5: 'lucide-file-text',
            css3: 'lucide-palette',
            'node.js': 'lucide-server',
            'rest apis': 'lucide-globe',
            'socket.io': 'lucide-wifi',
            firebase: 'lucide-flame',
            firestore: 'lucide-database',
            mongodb: 'lucide-database',
            postgresql: 'lucide-database',
            mysql: 'lucide-database',
            sqlite: 'lucide-database',
            gcp: 'lucide-cloud',
            docker: 'lucide-box',
            'github actions': 'lucide-git-branch',
            terraform: 'lucide-package',
            'ci/cd': 'lucide-git-merge',
            git: 'lucide-git-branch',
            github: 'lucide-github',
            'android studio': 'lucide-smartphone',
            'vs code': 'lucide-code',
            'claude code': 'lucide-sparkles',
            linux: 'lucide-terminal'
        };

        const buildIconMarkup = (iconDef) => {
            const iconName = iconDef || 'lucide-circle';
            return `<i class="lucide ${iconName} skill-icon" aria-hidden="true"></i>`;
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
