/**
 * COMANDO EDUCATION - Formación académica
 */
window.commands_education_education_js = {
    async execute(terminal, animation) {
        const { container, content, sidebar } = terminal.createCommandContainer('education');

        const educationData = [
            {
                title: 'Grado en Ingeniería Informática',
                institution: 'UNED — Universidad Nacional de Educación a Distancia',
                dates: '2026 — presente',
                status: 'in-progress',
                statusLabel: 'EN CURSO',
                details: 'Formación universitaria en ingeniería del software, algoritmos, arquitectura de computadores y sistemas distribuidos.'
            },
            {
                title: 'Técnico Superior en Desarrollo de Aplicaciones Multiplataforma (DAM)',
                institution: 'ILERNA Online',
                dates: '2023 — 2026',
                status: 'completed',
                statusLabel: 'COMPLETADO',
                details: 'Desarrollo móvil (Kotlin/Android), bases de datos, programación orientada a objetos, sistemas informáticos y entornos de desarrollo.'
            },
            {
                title: 'Bachillerato',
                institution: 'IES Ricardo Ortega',
                dates: '2004 — 2006',
                status: 'completed',
                statusLabel: 'COMPLETADO',
                details: ''
            }
        ];

        // Title
        const title = document.createElement('h2');
        title.className = 'section-title';
        title.textContent = 'Formación Académica';
        content.appendChild(title);

        const educationList = document.createElement('div');
        educationList.className = 'education-list';

        educationData.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = `education-card ${item.status}`;
            card.style.animationDelay = `${index * 0.15}s`;

            card.innerHTML = `
                <div class="education-header">
                    <span class="education-status ${item.status}">${item.statusLabel}</span>
                    <span class="education-dates">${item.dates}</span>
                </div>
                <h3 class="education-title">${item.title}</h3>
                <div class="education-institution">${item.institution}</div>
                ${item.details ? `<p class="education-details">${item.details}</p>` : ''}
            `;
            educationList.appendChild(card);
        });

        content.appendChild(educationList);

        if (animation && animation.init) {
            animation.init(sidebar);
        }

        terminal.autoScrollConsole(container);
    }
};
