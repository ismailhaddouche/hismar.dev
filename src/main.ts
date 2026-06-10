import { TerminalApp } from './core/TerminalApp';
import { createI18nManager } from './shared/i18n';
import type { CommandDefinition } from './core/types';

import './styles/layout.css';

const COMMAND_DEFINITIONS: CommandDefinition[] = [
  {
    name: 'about',
    script: () => import('./commands/about/AboutCommand'),
    showInNav: true,
  },
  {
    name: 'experience',
    script: () => import('./commands/experience/ExperienceCommand'),
    showInNav: true,
  },
  {
    name: 'skills',
    script: () => import('./commands/skills/SkillsCommand'),
    showInNav: true,
  },
  {
    name: 'neofetch',
    script: () => import('./commands/neofetch/NeofetchCommand'),
    showInNav: true,
  },
  {
    name: 'projects',
    script: () => import('./commands/projects/ProjectsCommand'),
    showInNav: true,
  },
  {
    name: 'education',
    script: () => import('./commands/education/EducationCommand'),
    showInNav: true,
  },
  {
    name: 'cv',
    script: () => import('./commands/cv/CvCommand'),
    showInNav: true,
  },
  {
    name: 'help',
    script: () => import('./commands/help/HelpCommand'),
    showInNav: true,
  },
];

function registerAllCommands(terminal: TerminalApp): void {
  COMMAND_DEFINITIONS.forEach((def) => terminal.registry.register(def));
}

document.addEventListener('DOMContentLoaded', () => {
  const i18n = createI18nManager();
  const terminal = new TerminalApp(i18n);
  registerAllCommands(terminal);
});
