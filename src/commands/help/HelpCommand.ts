import type { CommandModule, TerminalAppFacade } from '@/core/types';
import './help.css';

const HelpCommand: CommandModule = {
  async execute(terminal: TerminalAppFacade) {
    const { container, content } = terminal.createCommandContainer('help');

    const helpEl = document.createElement('div');
    helpEl.innerHTML = `
      <h2 class="section-title">${terminal.i18n.t('commands.help.title')}</h2>
      <div class="help-content">
        <div class="command-group">
          <h3 class="group-title">${terminal.i18n.t('commands.help.info_group')}</h3>
          <div class="commands-grid">
            <div class="command-item" data-cmd="about"><span class="command-name">${terminal.i18n.t('commands.about.label')}</span><span class="command-desc">${terminal.i18n.t('commands.help.about_desc')}</span></div>
            <div class="command-item" data-cmd="experience"><span class="command-name">${terminal.i18n.t('commands.experience.label')}</span><span class="command-desc">${terminal.i18n.t('commands.help.exp_desc')}</span></div>
            <div class="command-item" data-cmd="skills"><span class="command-name">${terminal.i18n.t('commands.skills.label')}</span><span class="command-desc">${terminal.i18n.t('commands.help.skills_desc')}</span></div>
            <div class="command-item" data-cmd="projects"><span class="command-name">${terminal.i18n.t('commands.projects.label')}</span><span class="command-desc">${terminal.i18n.t('commands.help.proj_desc')}</span></div>
            <div class="command-item" data-cmd="education"><span class="command-name">${terminal.i18n.t('commands.education.label')}</span><span class="command-desc">${terminal.i18n.t('commands.help.edu_desc')}</span></div>
            <div class="command-item" data-cmd="cv"><span class="command-name">${terminal.i18n.t('commands.cv.label')}</span><span class="command-desc">${terminal.i18n.t('commands.help.cv_desc')}</span></div>
          </div>
        </div>
        <div class="command-group">
          <h3 class="group-title">${terminal.i18n.t('commands.help.sys_group')}</h3>
          <div class="commands-grid">
            <div class="command-item" data-cmd="help"><span class="command-name">${terminal.i18n.t('commands.help.label')}</span><span class="command-desc">${terminal.i18n.t('commands.help.help_desc')}</span></div>
            <div class="command-item" data-cmd="clear"><span class="command-name">${terminal.i18n.t('commands.help.clear.label')}</span><span class="command-desc">${terminal.i18n.t('commands.help.clear.description')}</span></div>
          </div>
        </div>
        <div class="help-tips">
          <h3 class="group-title">${terminal.i18n.t('commands.help.tips_group')}</h3>
          <ul class="tips-list">
            <li>${terminal.i18n.t('commands.help.tip1')}</li>
            <li>${terminal.i18n.t('commands.help.tip2')}</li>
            <li>${terminal.i18n.t('commands.help.tip3')}</li>
            <li>${terminal.i18n.t('commands.help.tip4')}</li>
            <li>${terminal.i18n.t('commands.help.tip5')}</li>
          </ul>
        </div>
        <div class="help-footer">
          <p>${terminal.i18n.t('commands.help.footer')} <a href="https://todocodeacademy.com/" target="_blank" rel="noreferrer">TodoCode</a> + <a href="https://midu.dev/" target="_blank" rel="noreferrer">Midudev</a></p>
        </div>
      </div>
    `;

    content.appendChild(helpEl);

    helpEl.querySelectorAll('.command-item[data-cmd]').forEach((item) => {
      item.addEventListener('click', () => {
        const cmd = (item as HTMLElement).getAttribute('data-cmd');
        if (cmd) terminal.executeCommand(cmd);
      });
    });

    terminal.autoScrollConsole(container);
  },
};

export default HelpCommand;
