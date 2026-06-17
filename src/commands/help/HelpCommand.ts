import type { CommandModule, TerminalAppFacade } from '@/core/types';
import './help.css';

const HelpCommand: CommandModule = {
  async execute(terminal: TerminalAppFacade) {
    const { container, content } = terminal.createCommandContainer('help');
    const t = <T = string>(path: string): T => terminal.i18n.t<T>(path);

    const infoEntries = [
      { cmd: 'about',       label: t('commands.about.label'),       desc: t('commands.help.about_desc') },
      { cmd: 'experience',  label: t('commands.experience.label'),  desc: t('commands.help.exp_desc') },
      { cmd: 'skills',      label: t('commands.skills.label'),      desc: t('commands.help.skills_desc') },
      { cmd: 'projects',    label: t('commands.projects.label'),    desc: t('commands.help.proj_desc') },
      { cmd: 'education',   label: t('commands.education.label'),   desc: t('commands.help.edu_desc') },
      { cmd: 'cv',          label: t('commands.cv.label'),          desc: t('commands.help.cv_desc') },
    ];

    const sysEntries = [
      { cmd: 'help',  label: t('commands.help.label'),         desc: t('commands.help.help_desc') },
      { cmd: 'clear', label: t('commands.help.clear.label'),   desc: t('commands.help.clear.description') },
    ];

    const buildItems = (entries: { cmd: string; label: string; desc: string }[]) =>
      entries
        .map(
          (e) => `
      <div class="command-item" data-cmd="${e.cmd}">
        <div class="command-item__header">
          <span class="command-name">${e.label}</span>
          <span class="command-cmd">/${e.cmd}</span>
        </div>
        <span class="command-desc">${e.desc}</span>
      </div>`
        )
        .join('');

    const helpEl = document.createElement('div');
    helpEl.innerHTML = `
      <h2 class="section-title">${t('commands.help.title')}</h2>
      <div class="help-content">
        <div class="command-group">
          <h3 class="group-title">${t('commands.help.info_group')}</h3>
          <div class="commands-grid">${buildItems(infoEntries)}</div>
        </div>
        <div class="command-group">
          <h3 class="group-title">${t('commands.help.sys_group')}</h3>
          <div class="commands-grid">${buildItems(sysEntries)}</div>
        </div>
        <div class="help-tips">
          <h3 class="group-title">${t('commands.help.tips_group')}</h3>
          <ul class="tips-list">
            <li>${t('commands.help.tip1')}</li>
            <li>${t('commands.help.tip2')}</li>
            <li>${t('commands.help.tip3')}</li>
            <li>${t('commands.help.tip4')}</li>
            <li>${t('commands.help.tip5')}</li>
          </ul>
        </div>
        <div class="help-footer">
          <p>${t('commands.help.footer')} <a href="https://todocodeacademy.com/" target="_blank" rel="noreferrer">TodoCode</a> + <a href="https://midu.dev/" target="_blank" rel="noreferrer">Midudev</a></p>
        </div>
      </div>
    `;

    content.appendChild(helpEl);

    helpEl.querySelectorAll('.command-item[data-cmd]').forEach((item) => {
      item.addEventListener('click', () => {
        const cmd = (item as HTMLElement).getAttribute('data-cmd');
        if (cmd) void terminal.executeCommand(cmd);
      });
    });

    terminal.autoScrollConsole(container);
  },
};

export default HelpCommand;
