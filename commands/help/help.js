/**
 * COMANDO HELP - Ayuda y comandos disponibles
 */
window.commands_help_help_js = {
    async execute(terminal) {
        // Crear container del comando
        const { container, content } = terminal.createCommandContainer('help');
        

        // Crear sección de ayuda
        const helpSection = document.createElement('div');
        helpSection.innerHTML = `
            <h2 class="section-title">Guía de Comandos</h2>
            <div class="help-content">
                <div class="command-group">
                    <h3 class="group-title">📋 Comandos de Información</h3>
                    <div class="commands-grid">
                        <div class="command-item">
                            <span class="command-name">about</span>
                            <span class="command-desc">Información personal y contacto</span>
                        </div>
                        <div class="command-item">
                            <span class="command-name">skills</span>
                            <span class="command-desc">Habilidades técnicas y stack</span>
                        </div>
                        <div class="command-item">
                            <span class="command-name">projects</span>
                            <span class="command-desc">Portfolio de proyectos</span>
                        </div>
                        <div class="command-item">
                            <span class="command-name">education</span>
                            <span class="command-desc">Formación académica</span>
                        </div>
                    </div>
                </div>
                
                <div class="command-group">
                    <h3 class="group-title">⚙️ Comandos del Sistema</h3>
                    <div class="commands-grid">
                        <div class="command-item">
                            <span class="command-name">help</span>
                            <span class="command-desc">Mostrar esta ayuda</span>
                        </div>
                        <div class="command-item">
                            <span class="command-name">clear</span>
                            <span class="command-desc">Limpiar la consola</span>
                        </div>
                        <div class="command-item">
                            <span class="command-name">exit</span>
                            <span class="command-desc">Cerrar el terminal</span>
                        </div>
                    </div>
                </div>
                
                <div class="help-tips">
                    <h3 class="group-title">💡 Consejos de Uso</h3>
                    <ul class="tips-list">
                        <li>Presiona <kbd>Enter</kbd> para ejecutar comandos</li>
                        <li>Presiona <kbd>Escape</kbd> para saltar animaciones de texto</li>
                        <li>Haz click en las animaciones para interactuar</li>
                        <li>Usa el mouse para efectos especiales en algunas animaciones</li>
                        <li>El terminal es completamente responsivo</li>
                    </ul>
                </div>
                
            </div>
        `;
        
        content.appendChild(helpSection);

        terminal.autoScrollConsole(container);
    }
};