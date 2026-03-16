/**
 * COMANDO EDUCATION - Formación académica
 */
window.commands_education_education_js = {
    async execute(terminal, animation) {
        const { container, content, sidebar } = terminal.createCommandContainer('education');

        const educationData = [
            {
                title: 'BSc in Computer Engineering',
                institution: 'UNED — National Distance Education University',
                dates: 'Feb 2026 — Present',
                status: 'in-progress',
                statusLabel: 'IN PROGRESS',
                details: 'University-level training in software engineering, algorithms, computer architecture, and distributed systems.'
            },
            {
                title: 'Higher Technician in Multiplatform Application Development (DAM)',
                institution: 'ILERNA Online',
                dates: 'Sept 2023 — Oct 2025',
                status: 'completed',
                statusLabel: 'COMPLETED',
                details: 'Mobile development (Kotlin/Android), databases, object-oriented programming, computer systems, and development environments.'
            },
            {
                title: 'High School Diploma',
                institution: 'IES Ricardo Ortega',
                dates: '2004 — 2006',
                status: 'completed',
                statusLabel: 'COMPLETED',
                details: ''
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
