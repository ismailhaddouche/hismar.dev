/**
 * COMANDO HELP - Ayuda y comandos disponibles
 */
window.commands_help_help_js = {
    async execute(terminal) {
        const { container, content } = terminal.createCommandContainer('help');

        const helpSection = document.createElement('div');
        helpSection.innerHTML = `
            <h2 class="section-title">Command Guide</h2>
            <div class="help-content">
                <div class="command-group">
                    <h3 class="group-title">📋 Information</h3>
                    <div class="commands-grid">
                        <div class="command-item" data-cmd="about">
                            <span class="command-name">about</span>
                            <span class="command-desc">Who I am, background, and contact</span>
                        </div>
                        <div class="command-item" data-cmd="experience">
                            <span class="command-name">experience</span>
                            <span class="command-desc">Professional trajectory and work history</span>
                        </div>
                        <div class="command-item" data-cmd="skills">
                            <span class="command-name">skills</span>
                            <span class="command-desc">Complete technology stack</span>
                        </div>
                        <div class="command-item" data-cmd="projects">
                            <span class="command-name">projects</span>
                            <span class="command-desc">Production and open-source projects</span>
                        </div>
                        <div class="command-item" data-cmd="education">
                            <span class="command-name">education</span>
                            <span class="command-desc">Academic background (DAM + UNED)</span>
                        </div>
                        <div class="command-item" data-cmd="cv">
                            <span class="command-name">cv</span>
                            <span class="command-desc">Download the CV in PDF</span>
                        </div>
                    </div>
                </div>

                <div class="command-group">
                    <h3 class="group-title">⚙️ System</h3>
                    <div class="commands-grid">
                        <div class="command-item" data-cmd="help">
                            <span class="command-name">help</span>
                            <span class="command-desc">Show this guide</span>
                        </div>
                        <div class="command-item" data-cmd="clear">
                            <span class="command-name">clear</span>
                            <span class="command-desc">Clear the console</span>
                        </div>
                    </div>
                </div>

                <div class="help-tips">
                    <h3 class="group-title">💡 Tips</h3>
                    <ul class="tips-list">
                        <li>Click any command above to run it directly</li>
                        <li>Use <kbd>Tab</kbd> to autocomplete while typing</li>
                        <li>Navigate command history with <kbd>↑</kbd> / <kbd>↓</kbd></li>
                        <li>Press <kbd>Esc</kbd> to skip the typing animations</li>
                        <li>Hover over the sidebar animations — they are interactive</li>
                    </ul>
                </div>

                <div class="help-footer">
                    <p>// Built with 🧠 and far too much coffee in Murcia, Spain</p>
                    <p>// If you made it here, you already speak terminal. That makes us peers.</p>
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
