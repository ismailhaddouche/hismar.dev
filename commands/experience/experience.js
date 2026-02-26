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
                details: 'Liderazgo de la transformación digital: implantación de ERP Odoo, desarrollo de portal web corporativo (Next.js, Firebase) e integración de sistemas. Administración de servidores Linux y Windows Server. Infraestructura cloud con GCP, Docker, pipelines CI/CD y configuración de redes y seguridad.'
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
                details: 'Gestión de operaciones logísticas internacionales, coordinación con proveedores y optimización de rutas mediante análisis de datos.'
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
            card.className = `education-card ${item.status}`; // Reutilizando clases de education para consistencia visual rápida, o creamos experience-card en CSS
            card.style.animationDelay = `${index * 0.15}s`;

            card.innerHTML = `
                <div class="education-header">
                    <span class="education-status ${item.status}">${item.statusLabel}</span>
                    <span class="education-dates">${item.dates}</span>
                </div>
                <h3 class="education-title">${item.role}</h3>
                <div class="education-institution">${item.company}</div>
                ${item.details ? `<p class="education-details">${item.details}</p>` : ''}
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
