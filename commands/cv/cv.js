/**
 * COMANDO CV - Descarga del Curriculum Vitae
 */
window.commands_cv_cv_js = {
    async execute(terminal) {
        const container = document.createElement('div');
        container.className = 'command-output';

        container.innerHTML = `
            <div class="cv-content">
                <h2 class="section-title">Curriculum Vitae</h2>
                <p class="cv-description">Selecciona la versión que deseas descargar:</p>
                <div class="cv-options">
                    <a href="Curriculum/CV_Ismail_Haddouche.pdf" download class="cv-link">
                        <span class="cv-icon">📄</span>
                        <div class="cv-info">
                            <span class="cv-name">CV Completo</span>
                            <span class="cv-detail">CV_Ismail_Haddouche.pdf</span>
                        </div>
                    </a>
                    <a href="Curriculum/CV_Print_Ismail_Haddouche.pdf" download class="cv-link">
                        <span class="cv-icon">🖨️</span>
                        <div class="cv-info">
                            <span class="cv-name">CV para Imprimir</span>
                            <span class="cv-detail">CV_Print_Ismail_Haddouche.pdf</span>
                        </div>
                    </a>
                </div>
            </div>
        `;

        document.getElementById('console-output').appendChild(container);
        terminal.autoScrollConsole(container);
    }
};
