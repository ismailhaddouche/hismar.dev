/**
 * COMANDO EDUCATION
 */
window.commands_education_education_js = {
    async execute(terminal, animation) {
        const { container, content, sidebar } = terminal.createCommandContainer('education');
        
        
        
        const educationData = [
            {
                title: 'Bachillerato',
                institution: 'IES Ricardo Ortega',
                dates: '2004/2006'
            },
            {
                title: 'Desarrollo de aplicaciones multiplataforma',
                institution: 'ILERNA',
                dates: '2023/2025'
            },
            {
                title: 'Grado en Informática',
                institution: 'UNED',
                dates: '2025/presente'
            }
        ];

        const educationList = document.createElement('ul');
        educationList.className = 'education-list';

        const diplomaIcon = `
            <svg class="education-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-award"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
        `;

        educationData.forEach(item => {
            const listItem = document.createElement('li');
            listItem.className = 'education-item';
            listItem.innerHTML = `
                ${diplomaIcon}
                <div class="education-title">${item.title}</div>
                <div class="education-institution">${item.institution}</div>
                <div class="education-dates">${item.dates}</div>
            `;
            educationList.appendChild(listItem);
        });

        content.appendChild(educationList);
        
        if (animation && animation.init) {
            animation.init(sidebar);
        }
        
        terminal.autoScrollConsole(container);
    }
};
