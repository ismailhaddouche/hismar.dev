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
                <p class="cv-description">Download the latest PDF version:</p>
                <div class="cv-options single">
                    <a href="Curriculum/CV_Ismail_Haddouche_Rhali_2026.pdf" download class="cv-link">
                        <span class="cv-icon">📄</span>
                        <div class="cv-info">
                            <span class="cv-name">Curriculum Vitae — Ismail Haddouche Rhali</span>
                            <span class="cv-detail">CV_Ismail_Haddouche_Rhali_2026.pdf</span>
                        </div>
                    </a>
                </div>
            </div>
        `;

        document.getElementById('console-output').appendChild(container);
        terminal.autoScrollConsole(container);
    }
};
