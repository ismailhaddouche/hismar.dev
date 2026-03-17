/**
 * COMANDO EDUCATION - Formación académica
 */
window.commands_education_education_js = {
    async execute(terminal, animation) {
        const { container, content, sidebar } = terminal.createCommandContainer('education');

        const educationData = [
            {
                title: 'Bachelor of Science (BSc) in Computer Engineering',
                institution: 'UNED — National Distance Education University | Feb 2026 — Present',
                status: 'in-progress',
                statusLabel: 'IN PROGRESS · LEVEL 6 EQF',
                details: 'Focus: University-level training in software engineering, algorithms, computer architecture, and distributed systems.'
            },
            {
                title: 'Higher National Diploma (HND) in Multi-platform Software Development',
                institution: 'ILERNA Online | Sept 2023 — Feb 2026',
                status: 'completed',
                statusLabel: 'COMPLETED · LEVEL 5 EQF',
                details: 'Focus: Native mobile development (Kotlin/Android), cross-platform architectures, database management, and cloud-native environments.'
            },
            {
                title: 'High School Diploma',
                institution: 'IES Ricardo Ortega | 2004 — 2006',
                status: 'completed',
                statusLabel: 'COMPLETED',
                details: 'Status: Completed'
            }
        ];

        // Title
        const title = document.createElement('h2');
        title.className = 'section-title';
        title.textContent = 'Education';
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
