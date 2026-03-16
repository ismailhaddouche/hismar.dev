/**
 * COMANDO EXPERIENCE - Experiencia laboral
 */
window.commands_experience_experience_js = {
    async execute(terminal, animation) {
        const { container, content, sidebar } = terminal.createCommandContainer('experience');

        const experienceData = [
            {
                role: 'Head of IT',
                company: 'El Paredes Chico SL',
                dates: 'Oct 2025 — Present',
                status: 'current',
                statusLabel: 'CURRENT',
                details: 'Leading the digital transformation: Odoo ERP rollout, corporate web portal (Next.js, Firebase), and system integrations. Linux and Windows Server administration, GCP + Docker infrastructure, CI/CD pipelines, and network/security configuration for full-stack and mobile products.'
            },
            {
                role: 'CEO & Founder',
                company: 'Adoptaunordenador.com · Self-employed',
                dates: 'Jan 2016 — Dec 2020',
                status: 'past',
                statusLabel: 'COMPLETED',
                details: 'Founded and managed a social startup focused on refurbished hardware. Built and operated the e-commerce business, logistics, and customer technical support.'
            },
            {
                role: 'Logistics Manager',
                company: 'Globalatc SL',
                dates: 'Oct 2012 — Aug 2015',
                status: 'past',
                statusLabel: 'COMPLETED',
                details: 'Managed international logistics operations, coordinated suppliers, and optimized routes.'
            }
        ];

        // Title
        const title = document.createElement('h2');
        title.className = 'section-title';
        title.textContent = 'Professional Experience';
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
