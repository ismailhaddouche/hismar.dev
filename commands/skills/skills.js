/**
 * COMANDO SKILLS - Habilidades técnicas
 */
window.commands_skills_skills_js = {
    async execute(terminal, animation) {
        const { container, content, sidebar } = terminal.createCommandContainer('skills');

        const skills = {
            'Lenguajes': ['Kotlin', 'Python', 'Java', 'C#', 'SQL'],
            'Bases de datos': ['Sqlite', 'Mysql', 'Postgresql', 'MongoDB', 'Firebase'],
            'Cloud': ['AWS', 'Terraform', 'CI/CD'],
            'Control de versiones': ['Git', 'Github']
        };

        const skillIcons = {
            kotlin: 'devicon-kotlin-plain',
            python: 'devicon-python-plain',
            java: 'devicon-java-plain',
            'c#': 'devicon-csharp-plain',
            sql: 'devicon-azuresql-plain',
            sqlite: 'devicon-sqlite-plain',
            mysql: 'devicon-mysql-plain',
            postgresql: 'devicon-postgresql-plain',
            mongodb: 'devicon-mongodb-plain',
            firebase: 'devicon-firebase-plain',
            aws: 'devicon-amazonwebservices-original',
            terraform: 'devicon-terraform-plain',
            'ci/cd': 'devicon-githubactions-plain',
            git: 'devicon-git-plain',
            github: 'devicon-github-original'
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