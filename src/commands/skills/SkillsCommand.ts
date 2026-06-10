import type { CommandModule, TerminalAppFacade } from '@/core/types';
import { iconRegistry } from '@/shared/icons/IconRegistry';
import './skills.css';

const skills = {
  Languages: ['Kotlin', 'TypeScript', 'JavaScript', 'Java', 'C#', 'SQL'],
  Mobile: ['Jetpack Compose', 'MVVM', 'Clean Architecture', 'Hilt', 'Retrofit', 'Room', 'Firebase'],
  Frontend: ['Angular', 'React', 'Next.js', 'HTML5', 'CSS3'],
  'Backend & APIs': ['Node.js', 'REST APIs', 'Socket.io', 'Firebase'],
  Databases: ['Firestore', 'MongoDB', 'PostgreSQL', 'MySQL', 'SQLite'],
  'Full-stack & Mobile Ops': ['GCP', 'Docker', 'GitHub Actions', 'CI/CD'],
  Tooling: ['Git', 'GitHub', 'Android Studio', 'VS Code', 'Claude Code', 'Linux'],
};

const SkillsCommand: CommandModule = {
  async execute(terminal: TerminalAppFacade) {
    await iconRegistry.ensureDevIconLoaded();

    const { container, content, sidebar } = terminal.createCommandContainer('skills');

    let html = `<h2 class="section-title">${terminal.i18n.t('commands.skills.title')}</h2><div class="skills-content">`;

    for (const [category, skillList] of Object.entries(skills)) {
      const translated = terminal.i18n.t(`commands.skills.categories.${category}`);
      html += `<div class="skill-category"><h3 class="skill-category-title">${translated}</h3><ul class="skill-list">`;
      for (const skill of skillList) {
        const iconMarkup = iconRegistry.buildIconMarkup(iconRegistry.getIcon(skill));
        html += `<li class="skill-item">${iconMarkup}<span>${skill}</span></li>`;
      }
      html += '</ul></div>';
    }
    html += '</div>';

    content.innerHTML = html;
    terminal.autoScrollConsole(container);
  },
};

export default SkillsCommand;
