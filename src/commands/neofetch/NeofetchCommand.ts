import type { CommandModule, TerminalAppFacade } from '@/core/types';
import './neofetch.css';

const NeofetchCommand: CommandModule = {
  async execute(terminal: TerminalAppFacade) {
    const { container, content } = terminal.createCommandContainer('neofetch');
    container.style.gridTemplateColumns = '1fr 0px';

    const techStack = [
      { name: 'JavaScript', icon: 'fa-brands fa-js' },
      { name: 'CSS3', icon: 'fa-brands fa-css3-alt' },
      { name: 'HTML5', icon: 'fa-brands fa-html5' },
      { name: 'Firebase', icon: 'fa-solid fa-fire' },
      { name: 'App Hosting', icon: 'fa-solid fa-cloud' },
    ];

    const techRows = techStack
      .map(
        (tech) => `
      <div class="neo-tech-chip">
        <i class="${tech.icon}" aria-hidden="true"></i>
        <span>${tech.name}</span>
      </div>`
      )
      .join('');

    const specLines = [
      { label: 'OS', value: 'Web Runtime' },
      { label: 'Shell', value: 'hismar-terminal' },
      { label: 'Host', value: 'hismar.dev' },
      { label: 'Stack', value: 'Vanilla + Firebase' },
    ];

    const specRows = specLines
      .map(
        (s) => `
      <div><span>${s.label}</span><strong>${s.value}</strong></div>`
      )
      .join('');

    content.innerHTML = `
      <h2 class="section-title">${terminal.i18n.t('commands.neofetch.label')}</h2>
      <div class="neofetch-wrapper">
        <div class="neofetch-logo-scroll">
          <div class="neofetch-logo" role="img" aria-label="HISMAR.DEV logo">HISMAR.DEV</div>
        </div>
        <div class="neofetch-specs">
          <div class="neo-headline">HISMAR.DEV</div>
          <div class="neo-subline">Terminal Portfolio · Neofetch-style output</div>
          <div class="neo-meta">${specRows}</div>
          <div class="neo-tech-grid">${techRows}</div>
        </div>
      </div>
    `;

    terminal.autoScrollConsole(container);
  },
};

export default NeofetchCommand;
