import type { CommandModule, TerminalAppFacade } from '@/core/types';
import './neofetch.css';

const NeofetchCommand: CommandModule = {
  async execute(terminal: TerminalAppFacade) {
    const { container, content } = terminal.createCommandContainer('neofetch');
    container.style.gridTemplateColumns = '1fr 0px';

    const techStack = [
      { name: 'TypeScript', icon: 'fa-solid fa-code' },
      { name: 'Vite', icon: 'fa-solid fa-bolt' },
      { name: 'Modular Commands', icon: 'fa-solid fa-terminal' },
      { name: 'Lazy Loading', icon: 'fa-solid fa-box-open' },
      { name: 'i18n ES/EN', icon: 'fa-solid fa-language' },
      { name: 'Canvas Animations', icon: 'fa-solid fa-wand-magic-sparkles' },
      { name: 'Firebase', icon: 'fa-solid fa-fire' },
      { name: 'Vitest + Playwright', icon: 'fa-solid fa-vial-circle-check' },
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
      { label: 'OS', value: 'Browser Runtime' },
      { label: 'Shell', value: 'Command-driven portfolio' },
      { label: 'Host', value: 'hismar.dev' },
      { label: 'Stack', value: 'TypeScript + Vite' },
      { label: 'UI', value: 'Retro terminal + responsive menu' },
      { label: 'Build', value: 'Static assets + lazy chunks' },
      { label: 'Deploy', value: 'Firebase-ready static output' },
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
          <div class="neo-subline">Interactive terminal portfolio · TypeScript app</div>
          <div class="neo-meta">${specRows}</div>
          <div class="neo-tech-grid">${techRows}</div>
        </div>
      </div>
    `;

    terminal.autoScrollConsole(container);
  },
};

export default NeofetchCommand;
