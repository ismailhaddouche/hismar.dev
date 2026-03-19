/**
 * COMANDO HELP - Ayuda y comandos disponibles
 */
window.commands_help_help_js = {
    async execute(terminal) {
        const { container, content } = terminal.createCommandContainer('help');

        const helpSection = document.createElement('div');
        helpSection.innerHTML = `
            <h2 class="section-title">${window.i18n.t('commands.help.title')}</h2>
            <div class="help-content">
                <div class="command-group">
                    <h3 class="group-title">${window.i18n.t('commands.help.info_group')}</h3>
                    <div class="commands-grid">
                        <div class="command-item" data-cmd="about">
                            <span class="command-name">about</span>
                            <span class="command-desc">${window.i18n.t('commands.help.about_desc')}</span>
                        </div>
                        <div class="command-item" data-cmd="experience">
                            <span class="command-name">experience</span>
                            <span class="command-desc">${window.i18n.t('commands.help.exp_desc')}</span>
                        </div>
                        <div class="command-item" data-cmd="skills">
                            <span class="command-name">skills</span>
                            <span class="command-desc">${window.i18n.t('commands.help.skills_desc')}</span>
                        </div>
                        <div class="command-item" data-cmd="projects">
                            <span class="command-name">projects</span>
                            <span class="command-desc">${window.i18n.t('commands.help.proj_desc')}</span>
                        </div>
                        <div class="command-item" data-cmd="education">
                            <span class="command-name">education</span>
                            <span class="command-desc">${window.i18n.t('commands.help.edu_desc')}</span>
                        </div>
                        <div class="command-item" data-cmd="cv">
                            <span class="command-name">cv</span>
                            <span class="command-desc">${window.i18n.t('commands.help.cv_desc')}</span>
                        </div>
                    </div>
                </div>

                <div class="command-group">
                    <h3 class="group-title">${window.i18n.t('commands.help.sys_group')}</h3>
                    <div class="commands-grid">
                        <div class="command-item" data-cmd="help">
                            <span class="command-name">help</span>
                            <span class="command-desc">${window.i18n.t('commands.help.help_desc')}</span>
                        </div>
                        <div class="command-item" data-cmd="clear">
                            <span class="command-name">clear</span>
                            <span class="command-desc">${window.i18n.t('commands.help.clear_desc')}</span>
                        </div>
                    </div>
                </div>

                <div class="help-tips">
                    <h3 class="group-title">${window.i18n.t('commands.help.tips_group')}</h3>
                    <ul class="tips-list">
                        <li>${window.i18n.t('commands.help.tip1')}</li>
                        <li>${window.i18n.t('commands.help.tip2')}</li>
                        <li>${window.i18n.t('commands.help.tip3')}</li>
                        <li>${window.i18n.t('commands.help.tip4')}</li>
                        <li>${window.i18n.t('commands.help.tip5')}</li>
                    </ul>
                </div>

                <div class="help-footer">
                    <p>${window.i18n.t('commands.help.footer')} <a href="https://todocodeacademy.com/" target="_blank" rel="noreferrer">TodoCode</a> + <a href="https://midu.dev/" target="_blank" rel="noreferrer">Midudev</a></p>
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
