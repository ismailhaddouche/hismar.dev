/**
 * COMANDO EXPERIENCE - Experiencia laboral
 */
window.commands_experience_experience_js = {
    async execute(terminal, animation) {
        const { container, content, sidebar } = terminal.createCommandContainer('experience');

        const experienceData = window.i18n.t('commands.experience.items');

        // Title
        const title = document.createElement('h2');
        title.className = 'section-title';
        title.textContent = window.i18n.t('commands.experience.title');
        content.appendChild(title);

        const experienceList = document.createElement('div');
        experienceList.className = 'experience-list'; // Reutilizaremos estilos similares a education

        experienceData.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = `experience-card ${item.status}`;
            card.style.animationDelay = `${index * 0.15}s`;

            card.innerHTML = `
                <div class="experience-header">
                    <span class="experience-status ${item.status}">${item.statusLabel}</span>
                    <span class="experience-dates">${item.dates}</span>
                </div>
                <h3 class="experience-title">${item.role}</h3>
                <div class="experience-company">${item.company}</div>
                ${item.details ? `<p class="experience-details">${item.details}</p>` : ''}
            `;
            experienceList.appendChild(card);
        });

        content.appendChild(experienceList);

        if (animation && animation.init) {
            animation.init(sidebar);
        }

        terminal.autoScrollConsole(container);
    }
};
