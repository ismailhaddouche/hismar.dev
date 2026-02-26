/**
 * COMANDO SKILLS - Habilidades técnicas
 */
window.commands_skills_skills_js = {
    async execute(terminal, animation) {
        const { container, content, sidebar } = terminal.createCommandContainer('skills');

        const skills = {
            'Lenguajes': ['Kotlin', 'TypeScript', 'JavaScript', 'Java', 'Python', 'C#', 'SQL'],
            'Mobile': ['Jetpack Compose', 'MVVM', 'Clean Architecture', 'Hilt', 'Retrofit', 'Room'],
            'Frontend': ['Angular', 'React', 'Next.js', 'HTML5', 'CSS3'],
            'Backend & APIs': ['Node.js', 'Express', 'REST APIs', 'Socket.io'],
            'Bases de datos': ['Firebase', 'Firestore', 'MongoDB', 'PostgreSQL', 'MySQL', 'SQLite'],
            'Cloud & DevOps': ['AWS', 'Google Cloud', 'Docker', 'GitHub Actions', 'Terraform', 'CI/CD'],
            'Herramientas': ['Git', 'GitHub', 'Android Studio', 'Linux']
        };

        const skillIcons = {
            kotlin: 'devicon-kotlin-plain',
            typescript: 'devicon-typescript-plain',
            javascript: 'devicon-javascript-plain',
            java: 'devicon-java-plain',
            python: 'devicon-python-plain',
            'c#': 'devicon-csharp-plain',
            sql: 'devicon-azuresql-plain',
            'jetpack compose': 'devicon-android-plain',
            mvvm: '',
            'clean architecture': '',
            hilt: '',
            retrofit: '',
            room: '',
            angular: 'devicon-angularjs-plain',
            react: 'devicon-react-original',
            'next.js': 'devicon-nextjs-plain',
            html5: 'devicon-html5-plain',
            css3: 'devicon-css3-plain',
            'node.js': 'devicon-nodejs-plain',
            express: 'devicon-express-original',
            'rest apis': 'devicon-fastapi-plain',
            'socket.io': 'devicon-socketio-original',
            firebase: 'devicon-firebase-plain',
            firestore: 'devicon-firebase-plain',
            mongodb: 'devicon-mongodb-plain',
            postgresql: 'devicon-postgresql-plain',
            mysql: 'devicon-mysql-plain',
            sqlite: 'devicon-sqlite-plain',
            aws: 'devicon-amazonwebservices-original',
            'google cloud': 'devicon-googlecloud-plain',
            docker: 'devicon-docker-plain',
            'github actions': 'devicon-githubactions-plain',
            terraform: 'devicon-terraform-plain',
            'ci/cd': 'devicon-githubactions-plain',
            git: 'devicon-git-plain',
            github: 'devicon-github-original',
            'android studio': 'devicon-androidstudio-plain',
            linux: 'devicon-linux-plain'
        };

        let html = '<h2 class="section-title">Stack Tecnológico</h2>';
        html += '<div class="skills-content">';

        for (const category in skills) {
            html += '<div class="skill-category">';
            html += `<h3 class="skill-category-title">${category}</h3>`;
            html += '<ul class="skill-list">';
            for (const skill of skills[category]) {
                const iconClass = skillIcons[skill.toLowerCase()] || '';
                html += `<li class="skill-item"><i class="${iconClass} colored skill-icon"></i>${skill}</li>`;
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
