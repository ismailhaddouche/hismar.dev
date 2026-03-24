/**
 * COMANDO NEOFETCH - Stack visual de hismar.dev
 */
window.commands_neofetch_neofetch_js = {
    async execute(terminal) {
        const { container, content, sidebar } = terminal.createCommandContainer('neofetch');
        container.style.gridTemplateColumns = '1fr';
        sidebar.style.display = 'none';

        const isEs = window.i18n.current === 'es';

        const techStack = [
            { name: 'JavaScript', icon: 'fa-brands fa-js' },
            { name: 'CSS3', icon: 'fa-brands fa-css3-alt' },
            { name: 'HTML5', icon: 'fa-brands fa-html5' },
            { name: 'Firebase', icon: 'fa-solid fa-fire' },
            { name: 'App Hosting', icon: 'fa-solid fa-cloud' }
        ];

        const techRows = techStack.map((tech) => `
            <div class="neo-tech-chip">
                <i class="${tech.icon}" aria-hidden="true"></i>
                <span>${tech.name}</span>
            </div>
        `).join('');

        content.innerHTML = `
            <h2 class="section-title">${window.i18n.t('commands.neofetch.label')}</h2>
            <div class="neofetch-wrapper">
                <div class="neofetch-specs">
                    <div class="neo-headline">HISMAR.DEV</div>
                    <div class="neo-subline">${isEs ? 'Terminal Portfolio · Salida tipo neofetch' : 'Terminal Portfolio · Neofetch-style output'}</div>

                    <div class="neo-meta">
                        <div><span>${isEs ? 'SO' : 'OS'}</span><strong>${isEs ? 'Web Runtime' : 'Web Runtime'}</strong></div>
                        <div><span>${isEs ? 'Shell' : 'Shell'}</span><strong>hismar-terminal</strong></div>
                        <div><span>${isEs ? 'Host' : 'Host'}</span><strong>hismar.dev</strong></div>
                        <div><span>${isEs ? 'Stack' : 'Stack'}</span><strong>Vanilla + Firebase</strong></div>
                    </div>

                    <div class="neo-tech-grid">
                        ${techRows}
                    </div>
                </div>
            </div>
        `;

        terminal.autoScrollConsole(container);
    }
};
