import type { CommandModule, TerminalAppFacade } from '@/core/types';
import './experience.css';

interface ExperienceData {
  role: string;
  company: string;
  dates: string;
  status: string;
  statusLabel: string;
  details: string;
}

const ExperienceCommand: CommandModule = {
  async execute(terminal: TerminalAppFacade) {
    const { container, content, sidebar } = terminal.createCommandContainer('experience');

    const items = terminal.i18n.t<ExperienceData[]>('commands.experience.items');

    content.innerHTML = `<h2 class="section-title">${terminal.i18n.t('commands.experience.title')}</h2>`;

    const timeline = document.createElement('div');
    timeline.className = 'experience-timeline';

    if (Array.isArray(items)) {
      items.forEach((item) => {
        const entry = document.createElement('div');
        entry.className = `experience-item experience-item--${item.status}`;
        entry.innerHTML = `
          <div class="experience-marker">
            <span class="experience-dot"></span>
            <span class="experience-status">${item.statusLabel}</span>
          </div>
          <div class="experience-content">
            <h3 class="experience-role">${item.role}</h3>
            <p class="experience-company">${item.company}</p>
            <p class="experience-dates">${item.dates}</p>
            <p class="experience-details">${item.details}</p>
          </div>
        `;
        timeline.appendChild(entry);
      });
    }

    content.appendChild(timeline);
    sidebar.style.display = 'none';
    container.style.gridTemplateColumns = '1fr';
    terminal.autoScrollConsole(container);
  },
};

export default ExperienceCommand;
