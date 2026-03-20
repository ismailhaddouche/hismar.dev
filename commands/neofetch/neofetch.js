/**
 * COMANDO NEOFETCH - Stack visual de hismar.dev
 */
window.commands_neofetch_neofetch_js = {
    async execute(terminal) {
        const { container, content, sidebar } = terminal.createCommandContainer('neofetch');

        const isEs = window.i18n.current === 'es';

        const techStack = [
            { name: 'JavaScript', icon: 'fa-brands fa-js', level: 96 },
            { name: 'CSS3', icon: 'fa-brands fa-css3-alt', level: 94 },
            { name: 'HTML5', icon: 'fa-brands fa-html5', level: 95 },
            { name: 'Firebase', icon: 'fa-solid fa-fire', level: 92 },
            { name: 'App Hosting', icon: 'fa-solid fa-cloud', level: 88 }
        ];

        const techRows = techStack.map((tech) => `
            <div class="neo-tech-row">
                <div class="neo-tech-label">
                    <i class="${tech.icon}" aria-hidden="true"></i>
                    <span>${tech.name}</span>
                </div>
                <div class="neo-tech-bar-wrap" aria-label="${tech.name} ${tech.level}%">
                    <div class="neo-tech-bar" style="width: ${tech.level}%"></div>
                </div>
                <span class="neo-tech-value">${tech.level}%</span>
            </div>
        `).join('');

        const paletteBlocks = [
            '#f7df1e', '#1572b6', '#e34f26', '#ff6f00', '#039be5', '#00c853', '#7c4dff', '#ff3d00'
        ].map((color) => `<span class="neo-swatch" style="background:${color}"></span>`).join('');

        content.innerHTML = `
            <h2 class="section-title">${window.i18n.t('commands.neofetch.label')}</h2>
            <div class="neofetch-wrapper">
                <pre class="neofetch-logo" aria-label="HISMAR.DEV logo">
██╗  ██╗██╗███████╗███╗   ███╗ █████╗ ██████╗ 
██║  ██║██║██╔════╝████╗ ████║██╔══██╗██╔══██╗
███████║██║███████╗██╔████╔██║███████║██████╔╝
██╔══██║██║╚════██║██║╚██╔╝██║██╔══██║██╔══██╗
██║  ██║██║███████║██║ ╚═╝ ██║██║  ██║██║  ██║
╚═╝  ╚═╝╚═╝╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝
                </pre>

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

        sidebar.innerHTML = `
            <div class="neo-sidecard">
                <h3>${isEs ? 'Paleta' : 'Palette'}</h3>
                <div class="neo-palette">${paletteBlocks}</div>
                <p>${isEs ? 'Inspirado en neofetch, pero con ADN hismar.dev.' : 'Inspired by neofetch, but with hismar.dev DNA.'}</p>
            </div>
        `;

        terminal.autoScrollConsole(container);
    }
};
