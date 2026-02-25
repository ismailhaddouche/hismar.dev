/**
 * COMANDO HELP - Ayuda y comandos disponibles
 */
window.commands_help_help_js = {
    async execute(terminal) {
        const { container, content } = terminal.createCommandContainer('help');

        const helpSection = document.createElement('div');
        helpSection.innerHTML = `
            <h2 class="section-title">Guía de Comandos</h2>
            <div class="help-content">
                <div class="command-group">
                    <h3 class="group-title">📋 Información</h3>
                    <div class="commands-grid">
                        <div class="command-item" data-cmd="about">
                            <span class="command-name">about</span>
                            <span class="command-desc">Quién soy, mi historia y contacto</span>
                        </div>
                        <div class="command-item" data-cmd="skills">
                            <span class="command-name">skills</span>
                            <span class="command-desc">Stack tecnológico completo</span>
                        </div>
                        <div class="command-item" data-cmd="projects">
                            <span class="command-name">projects</span>
                            <span class="command-desc">Proyectos reales (producción + open source)</span>
                        </div>
                        <div class="command-item" data-cmd="education">
                            <span class="command-name">education</span>
                            <span class="command-desc">Formación académica (DAM + UNED)</span>
                        </div>
                    </div>
                </div>

                <div class="command-group">
                    <h3 class="group-title">⚙️ Sistema</h3>
                    <div class="commands-grid">
                        <div class="command-item" data-cmd="help">
                            <span class="command-name">help</span>
                            <span class="command-desc">Mostrar esta guía</span>
                        </div>
                        <div class="command-item" data-cmd="clear">
                            <span class="command-name">clear</span>
                            <span class="command-desc">Limpiar la consola</span>
                        </div>
                    </div>
                </div>

                <div class="help-tips">
                    <h3 class="group-title">💡 Tips</h3>
                    <ul class="tips-list">
                        <li>Haz clic en cualquier comando de arriba para ejecutarlo directamente</li>
                        <li>Usa <kbd>Tab</kbd> para autocompletar comandos mientras escribes</li>
                        <li>Navega el historial de comandos con <kbd>↑</kbd> / <kbd>↓</kbd></li>
                        <li>Presiona <kbd>Esc</kbd> para saltar las animaciones de escritura</li>
                        <li>Pasa el ratón sobre las animaciones de la derecha — son interactivas</li>
                    </ul>
                </div>

                <div class="help-footer">
                    <p>// Hecho con 🧠 y demasiado café en Murcia, España</p>
                    <p>// Si llegas hasta aquí, ya sabes cómo funciona un terminal. Eso nos hace compañeros.</p>
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
