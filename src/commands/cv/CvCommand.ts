import type { CommandModule, TerminalAppFacade } from '@/core/types';
import './cv.css';

const CvCommand: CommandModule = {
  async execute(terminal: TerminalAppFacade) {
    const { container, content } = terminal.createCommandContainer('cv');

    content.innerHTML = `
      <h2 class="section-title">${terminal.i18n.t('commands.cv.title')}</h2>
      <div class="cv-content">
        <p class="cv-description">${terminal.i18n.t('commands.cv.desc')}</p>
        <a href="curriculum/CV_Ismail_Haddouche_Rhali_2026.pdf" target="_blank" rel="noopener noreferrer" class="cv-download-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><polyline points="9 15 12 18 15 15"></polyline></svg>
          <span>${terminal.i18n.t('commands.cv.name')}</span>
        </a>
      </div>
    `;

    terminal.autoScrollConsole(container);
  },
};

export default CvCommand;
