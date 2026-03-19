/**
 * COMANDO CV - Descarga del Curriculum Vitae
 */
window.commands_cv_cv_js = {
    async execute(terminal) {
        const container = document.createElement('div');
        container.className = 'command-output';

        container.innerHTML = `
            <div class="cv-content">
                <h2 class="section-title">${window.i18n.t('commands.cv.title')}</h2>
                <p class="cv-description">${window.i18n.t('commands.cv.desc')}</p>
                <div class="cv-options single">
                    <a href="curriculum/CV_Ismail_Haddouche_Rhali_2026.pdf" download class="cv-link">
                        <span class="cv-icon">📄</span>
                        <div class="cv-info">
                            <span class="cv-name">${window.i18n.t('commands.cv.name')}</span>
                            <span class="cv-detail">CV_Ismail_Haddouche_Rhali_2026.pdf</span>
                        </div>
                        <span class="cv-download-indicator" aria-hidden="true">
                            <i class="fa-solid fa-arrow-down"></i>
                        </span>
                    </a>
                </div>
            </div>
        `;

        document.getElementById('console-output').appendChild(container);
        terminal.autoScrollConsole(container);
    }
};
