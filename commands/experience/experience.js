/**
 * COMANDO EXPERIENCE - Experiencia laboral
 */
window.commands_experience_experience_js = {
    async execute(terminal, animation) {
        const { container, content, sidebar } = terminal.createCommandContainer('experience');

        const experienceData = [
            {
                role: 'Responsable de TI',
                company: 'El Paredes Chico SL',
                dates: 'Oct 2025 — Actualidad',
                status: 'current',
                statusLabel: 'ACTUAL',
                details: 'Liderazgo de la transformación digital: implantación de ERP Odoo, desarrollo de portal web corporativo (Next.js, Firebase) e integración de sistemas. Administración de servidores Linux y Windows Server. Infraestructura en GCP, Docker, pipelines CI/CD y configuración de redes y seguridad orientadas a fullstack y mobile.'
            },
            {
                role: 'CEO & Fundador',
                company: 'Adoptaunordenador.com · Autónomo',
                dates: 'Ene 2016 — Dic 2020',
                status: 'past',
                statusLabel: 'COMPLETADO',
                details: 'Fundación y dirección de startup social de reacondicionamiento de hardware. Desarrollo y gestión de e-commerce, logística y soporte técnico a clientes.'
            },
            {
                role: 'Responsable de Logística',
                company: 'Globalatc SL',
                dates: 'Oct 2012 — Ago 2015',
                status: 'past',
                statusLabel: 'COMPLETADO',
                details: 'Gestión de operaciones logísticas internacionales, coordinación con proveedores y optimización de rutas.'
            }
        ];

        // Title
        const title = document.createElement('h2');
        title.className = 'section-title';
        title.textContent = 'Experiencia Laboral';
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
