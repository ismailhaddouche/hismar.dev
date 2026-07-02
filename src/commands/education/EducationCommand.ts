import type { CommandModule, TerminalAppFacade } from '@/core/types';
import './education.css';

interface EducationData {
  title: string;
  institution: string;
  status: string;
  statusLabel: string;
  details?: string;
}

const EducationCommand: CommandModule = {
  async execute(terminal: TerminalAppFacade) {
    const { container, content } = terminal.createCommandContainer('education');

    const items = terminal.i18n.t<EducationData[]>('commands.education.items');

    content.innerHTML = `<h2 class="section-title">${terminal.i18n.t('commands.education.title')}</h2>`;

    const list = document.createElement('div');
    list.className = 'education-list';

    if (Array.isArray(items)) {
      items.forEach((item) => {
        const card = document.createElement('div');
        card.className = `education-card education-card--${item.status}`;
        const details = item.details
          ? `<p class="education-card__details">${item.details}</p>`
          : '';

        card.innerHTML = `
          <div class="education-card__header">
            <h3 class="education-card__title">${item.title}</h3>
            <span class="education-card__status education-card__status--${item.status}">${item.statusLabel}</span>
          </div>
          <p class="education-card__institution">${item.institution}</p>
          ${details}
        `;
        list.appendChild(card);
      });
    }

    content.appendChild(list);
    terminal.autoScrollConsole(container);
  },
};

export default EducationCommand;
