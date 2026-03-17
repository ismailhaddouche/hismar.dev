/**
 * COMANDO HELP - Ayuda y comandos disponibles
 */
window.commands_help_help_js = {
    async execute(terminal) {
        const { container, content } = terminal.createCommandContainer('help');

        const groups = [
            {
                title: '<i class="fa-solid fa-terminal" aria-hidden="true"></i> Essentials',
                commands: [
                    { cmd: 'help', desc: 'list every available command' },
                    { cmd: 'about', desc: 'personal background and contact' },
                    { cmd: 'experience', desc: 'professional journey' },
                    { cmd: 'projects', desc: 'production & open-source work' },
                    { cmd: 'skills', desc: 'complete technology stack' },
                    { cmd: 'education', desc: 'academic path' }
                ]
            },
            {
                title: '<i class="fa-solid fa-rocket" aria-hidden="true"></i> Extras',
                commands: [
                    { cmd: 'cv', desc: 'download latest CV PDF' },
                    { cmd: 'tips', desc: 'workflow shortcuts & keyboard tricks', isTip: true },
                    { cmd: 'hesystem', desc: 'system status & retro terminal info' }
                ]
            }
        ];

        const helpSection = document.createElement('div');
        helpSection.innerHTML = `
            <h2 class="section-title">Command Guide</h2>
            <div class="help-content">
                ${groups.map(group => `
                    <div class="command-group">
                        <h3 class="group-title">${group.title}</h3>
                        <div class="commands-grid">
                            ${group.commands.filter(item => !item.isTip).map(item => `
                                <div class="command-item" data-cmd="${item.cmd}">
                                    <span class="command-name">${item.cmd}</span>
                                    <span class="command-desc">${item.desc}</span>
                                </div>
                            `).join('')}
                        </div>
                        ${group.commands.some(item => item.isTip) ? `
                            <div class="help-tips">
                                <h4 class="group-title"><i class="fa-solid fa-lightbulb" aria-hidden="true"></i> Tips</h4>
                                <ul class="tips-list">
                                    <li>help → list every available command</li>
                                    <li>tips → workflow shortcuts & keyboard tricks</li>
                                    <li>hesystem → retro terminal status panel</li>
                                </ul>
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
                <div class="help-footer">
                    <p>// Updated for the retro terminal 2.0 experience</p>
                    <p>// Jump between commands with ↑/↓, autocomplete with Tab</p>
                </div>
            </div>
        `;

        content.appendChild(helpSection);

        const commandItems = helpSection.querySelectorAll('.command-item[data-cmd]');
        commandItems.forEach(item => {
            item.addEventListener('click', () => {
                const cmd = item.getAttribute('data-cmd');
                terminal.executeCommand(cmd);
            });
        });

        terminal.autoScrollConsole(container);
    }
};
