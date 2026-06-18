import type { CommandModule, TerminalAppFacade } from '@/core/types';
import { getAge } from '@/shared/utils/strings';
import './about.css';

const AboutCommand: CommandModule = {
  async execute(terminal: TerminalAppFacade) {
    const { container, content } = terminal.createCommandContainer('about');

    const age = getAge(new Date(1988, 4, 14));

    content.innerHTML = `
      <div class="about-info">
        <div class="about-header">
          <h2 class="section-title">Ismail Haddouche Rhali</h2>
        </div>
        <div class="about-details">
          <div class="about-detail-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span class="detail-label">${terminal.i18n.t('commands.about.age')}</span>
            <span class="detail-value">${age} ${terminal.i18n.t('commands.about.years')}</span>
          </div>
          <div class="about-detail-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span class="detail-label">${terminal.i18n.t('commands.about.location')}</span>
            <span class="detail-value">Murcia, Spain</span>
          </div>
          <div class="about-detail-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
            <span class="detail-label">${terminal.i18n.t('commands.about.role')}</span>
            <span class="detail-value">Full-stack · Mobile Developer</span>
          </div>
        </div>
        <h3 class="about-subtitle">${terminal.i18n.t('commands.about.story')}</h3>
        <p class="about-text">${terminal.i18n.t('commands.about.story1')}</p>
        <p class="about-text">${terminal.i18n.t('commands.about.story2')}</p>
        <p class="about-text">${terminal.i18n.t('commands.about.story3')}</p>
        <h3 class="about-subtitle">${terminal.i18n.t('commands.about.traits')}</h3>
        <ul class="about-traits">
          <li><span class="trait-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="7" rx="2"></rect><rect x="3" y="13" width="18" height="7" rx="2"></rect><path d="M7 8h.01"></path><path d="M7 17h.01"></path><path d="m13 17 2 2 4-4"></path></svg></span><span>${terminal.i18n.t('commands.about.trait1')}</span></li>
          <li><span class="trait-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 9 4.5-9 4.5-9-4.5L12 3Z"></path><path d="m3 12 9 4.5 9-4.5"></path><path d="m3 16.5 9 4.5 9-4.5"></path></svg></span><span>${terminal.i18n.t('commands.about.trait2')}</span></li>
          <li><span class="trait-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"></rect><path d="m8 10 3 2-3 2"></path><path d="M13 15h4"></path></svg></span><span>${terminal.i18n.t('commands.about.trait3')}</span></li>
          <li><span class="trait-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></span><span>${terminal.i18n.t('commands.about.trait4')}</span></li>
        </ul>
        <h3 class="about-subtitle">${terminal.i18n.t('commands.about.beyond')}</h3>
        <p class="about-text">${terminal.i18n.t('commands.about.beyondText')}</p>
        <h3 class="about-subtitle">${terminal.i18n.t('commands.about.contact')}</h3>
        <div class="about-links">
          <a href="https://github.com/ismailhaddouche" target="_blank" rel="noopener noreferrer" class="about-link"><svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg> GitHub</a>
          <a href="https://www.linkedin.com/in/ismail-haddouche-rhali-194305334" target="_blank" rel="noopener noreferrer" class="about-link"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"></path></svg> LinkedIn</a>
          <a href="mailto:ismailhaddoucherhali@gmail.com" class="about-link"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> Email</a>
        </div>
      </div>
    `;

    terminal.autoScrollConsole(container);
  },
};

export default AboutCommand;
