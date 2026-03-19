/**
 * COMANDO EDUCATION - Formación académica
 */
window.commands_education_education_js = {
    async execute(terminal, animation) {
        const { container, content, sidebar } = terminal.createCommandContainer('education');

        const educationData = window.i18n.t('commands.education.items');

        // Title
        const title = document.createElement('h2');
        title.className = 'section-title';
        title.textContent = window.i18n.t('commands.education.title');
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
