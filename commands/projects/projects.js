/**
 * COMANDO PROJECTS - Proyectos desarrollados
 */
window.commands_projects_projects_js = {
    async execute(terminal, animation) {
        const { container, content, sidebar } = terminal.createCommandContainer('projects');


        const projectsData = [
            {
                name: 'TetrisCV',
                description: 'Plantilla printable de estructura y estilo de un CV retro y con temática de tetris fácil de imprimir en DIN A4.',
                tech: ['html', 'css'],
            },
            {
                name: 'hismar.dev',
                description: 'Web personal que simula consola de linux con comandos y estilo retro y pixelart.',
                tech: ['html', 'css', 'javascript'],
            },
            {
                name: 'TimeTutor',
                description: 'Aplicación android para gestión de clases de profesores particulares con horarios y pagos.',
                tech: ['kotlin', 'firebase'],
            },
            {
                name: 'PyControl',
                description: 'Sistema completo de fichaje de jornadas laborales cumpliendo la legislación española en hardware y OS de Raspberry Pi.',
                tech: ['python', 'sqlite', 'linux', 'raspberrypi'],
            }
        ];

        const techIcons = {
            html: 'devicon-html5-plain',
            css: 'devicon-css3-plain',
            javascript: 'devicon-javascript-plain',
            kotlin: 'devicon-kotlin-plain',
            firebase: 'devicon-firebase-plain',
            python: 'devicon-python-plain',
            sqlite: 'devicon-sqlite-plain',
            linux: 'devicon-linux-plain',
            raspberrypi: 'devicon-raspberrypi-line'
        };

        const projectsGrid = document.createElement('div');
        projectsGrid.className = 'projects-grid';
        content.appendChild(projectsGrid);

        for (const project of projectsData) {
            const card = document.createElement('div');
            card.className = 'project-card';

            const titleContainer = document.createElement('div');
            titleContainer.className = 'project-title-container';

            const title = document.createElement('h3');
            title.className = 'project-title';
            title.textContent = project.name;

            const iconsContainer = document.createElement('div');
            iconsContainer.className = 'tech-icons';
            iconsContainer.innerHTML = project.tech.map(t => `<i class="${techIcons[t.toLowerCase()] || ''} tech-icon colored" title="${t}"></i>`).join('');

            titleContainer.appendChild(title);
            titleContainer.appendChild(iconsContainer);

            const description = document.createElement('p');
            description.className = 'project-description';
            description.textContent = project.description;

            card.appendChild(titleContainer);
            card.appendChild(description);
            projectsGrid.appendChild(card);
        }

        if (animation && animation.init) {
            animation.init(sidebar);
        }
        
        terminal.autoScrollConsole(container);
    }
};
