import type { TerminalAppFacade, I18n, AnimationManagerFacade, CommandContainer } from './types';
import { CommandRegistry } from './CommandRegistry';
import { AnimationManager } from './AnimationManager';
import { EventBus } from './EventBus';
import { formatTimestamp } from '@/shared/utils/strings';
import { sleep } from '@/shared/utils/async';

const MAX_CONSOLE_NODES = 140;
const SHELL_PROMPT = 'visitor@hismar.dev:~$';

interface DOMCache {
  terminal: HTMLElement | null;
  consoleOutput: HTMLElement | null;
  input: HTMLInputElement | null;
  menuItems: NodeListOf<HTMLElement>;
  hamburgerBtn: HTMLElement | null;
  terminalMenu: HTMLElement | null;
  menuOverlay: HTMLElement | null;
  clearBtn: HTMLElement | null;
  headerSocial: HTMLElement | null;
  commandContainers: Map<string, HTMLElement>;
}

export class TerminalApp implements TerminalAppFacade {
  readonly eventBus: EventBus;
  readonly i18n: I18n;
  readonly animations: AnimationManagerFacade;
  readonly registry: CommandRegistry;

  private animationManager: AnimationManager;
  private dom!: DOMCache;
  private isTyping = false;
  private skipTyping = false;
  private pendingCommands = 0;
  private commandQueue: Promise<void> = Promise.resolve();
  private commandHistory: string[] = [];
  private historyIndex = -1;

  constructor(i18n: I18n) {
    this.eventBus = new EventBus();
    this.i18n = i18n;
    this.animationManager = new AnimationManager();
    this.animations = this.animationManager as AnimationManagerFacade;
    this.registry = new CommandRegistry();

    this.init();
  }

  private init(): void {
    this.dom = this.cacheDomElements();
    this.setupEventListeners();
    this.displayWelcome();
    this.handleResize();
    this.refreshUIStrings();
  }

  private cacheDomElements(): DOMCache {
    return {
      terminal: document.querySelector('.terminal'),
      consoleOutput: document.getElementById('console-output'),
      input: document.getElementById('command-input') as HTMLInputElement | null,
      menuItems: document.querySelectorAll('.menu-item'),
      hamburgerBtn: document.getElementById('hamburger-btn'),
      terminalMenu: document.getElementById('terminal-menu'),
      menuOverlay: document.getElementById('menu-overlay'),
      clearBtn: document.querySelector('.control-btn--clear'),
      headerSocial: document.querySelector('.header-social'),
      commandContainers: new Map(),
    };
  }

  refreshUIStrings(): void {
    const { input, menuItems } = this.dom;
    if (input) input.placeholder = this.i18n.t('ui.placeholder');
    menuItems.forEach((item) => {
      const cmd = item.dataset.command;
      if (cmd) item.textContent = this.i18n.t(`menu.${cmd}`);
    });
  }

  private handleResize(): void {
    const { terminal } = this.dom;
    if (!terminal) return;
    const setHeight = (): void => {
      terminal.style.height = `${window.visualViewport?.height ?? window.innerHeight}px`;
    };
    window.addEventListener('resize', setHeight);
    window.visualViewport?.addEventListener('resize', setHeight);
    setHeight();
  }

  private setupEventListeners(): void {
    const { headerSocial, input, menuItems, hamburgerBtn, terminalMenu, menuOverlay, clearBtn } =
      this.dom;

    this.setupLangToggle(headerSocial);
    this.setupLanguageListener();
    if (!input) return;

    const coarsePointer = window.matchMedia('(pointer: coarse)');
    let autoFocusEnabled = !coarsePointer.matches;

    coarsePointer.addEventListener?.('change', () => {
      autoFocusEnabled = !coarsePointer.matches;
    });

    input.addEventListener('keydown', (e) => this.handleInputKeydown(e));
    menuItems.forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const cmd = item.dataset.command;
        if (cmd) void this.executeCommand(cmd);
        if (terminalMenu?.classList.contains('active')) this.toggleMobileMenu(false);
      });
    });

    hamburgerBtn?.addEventListener('click', () => this.toggleMobileMenu());
    menuOverlay?.addEventListener('click', () => this.toggleMobileMenu(false));
    clearBtn?.addEventListener('click', () => {
      void this.executeCommand('clear');
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.isTyping) this.skipTyping = true;
        if (terminalMenu?.classList.contains('active')) this.toggleMobileMenu(false);
      }
    });

    if (autoFocusEnabled) input.focus();
    document.addEventListener('click', (e) => {
      if (!autoFocusEnabled || !input) return;
      const target = e.target as HTMLElement;
      if (target.closest('.console-output') ?? target.closest('.input-line')) {
        input.focus();
      }
    });
  }

  private toggleMobileMenu(force?: boolean): void {
    const { hamburgerBtn, terminalMenu, menuOverlay } = this.dom;
    if (!hamburgerBtn || !terminalMenu || !menuOverlay) return;
    const shouldOpen =
      typeof force === 'boolean' ? force : !terminalMenu.classList.contains('active');
    terminalMenu.classList.toggle('active', shouldOpen);
    menuOverlay.classList.toggle('active', shouldOpen);
    hamburgerBtn.setAttribute('aria-expanded', String(shouldOpen));
    menuOverlay.setAttribute('aria-hidden', String(!shouldOpen));
    document.body.classList.toggle('no-scroll', shouldOpen);
  }

  private setupLangToggle(headerSocial: HTMLElement | null): void {
    if (!headerSocial) return;
    const existingBtn = headerSocial.querySelector<HTMLButtonElement>('.lang-toggle');
    const langBtn = existingBtn ?? document.createElement('button');
    if (!existingBtn) {
      langBtn.type = 'button';
      langBtn.className = 'social-btn lang-toggle';
    }
    const updateLabel = (): void => {
      const label = this.i18n.current === 'es' ? 'ES' : 'EN';
      langBtn.innerHTML = `<span class="lang-label">${label}</span>`;
      langBtn.setAttribute('aria-label', `${label} - Toggle language`);
    };
    updateLabel();
    langBtn.onclick = () => {
      const next = this.i18n.current === 'es' ? 'en' : 'es';
      this.i18n.setLanguage(next);
      updateLabel();
    };
    if (!existingBtn) headerSocial.appendChild(langBtn);
  }

  private setupLanguageListener(): void {
    document.addEventListener('languageChanged', () => {
      this.refreshUIStrings();
      this.cleanupAnimations();
      if (this.dom.consoleOutput) this.dom.consoleOutput.innerHTML = '';
      this.displayWelcome();
    });
  }

  private handleInputKeydown(e: KeyboardEvent): void {
    const input = this.dom.input;
    if (!input) return;

    if (e.key === 'Enter' && !this.isTyping) {
      const cmd = input.value.trim().toLowerCase();
      if (cmd) {
        if (this.commandHistory[0] !== cmd) {
          this.commandHistory.unshift(cmd);
          if (this.commandHistory.length > 50) this.commandHistory.pop();
        }
        this.historyIndex = -1;
      }
      void this.executeCommand(cmd);
      input.value = '';
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this.historyIndex < this.commandHistory.length - 1) {
        this.historyIndex++;
        input.value = this.commandHistory[this.historyIndex] ?? '';
        setTimeout(() => input.setSelectionRange(input.value.length, input.value.length), 0);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this.historyIndex > 0) {
        this.historyIndex--;
        input.value = this.commandHistory[this.historyIndex] ?? '';
      } else {
        this.historyIndex = -1;
        input.value = '';
      }
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const partial = input.value.trim().toLowerCase();
      if (!partial) return;
      const matches = this.registry.autocomplete(partial);
      if (matches.length === 1) {
        input.value = matches[0]!;
      } else if (matches.length > 1) {
        this.appendToConsole(`\n${matches.join('  ')}`);
      }
    }
  }

  displayWelcome(): void {
    const consoleOutput = this.dom.consoleOutput;
    if (!consoleOutput) return;

    const badge = document.createElement('div');
    badge.className = 'retro-badge';
    badge.innerHTML = `
      <span>HismaR Dev</span>
      <div class="welcome-subtitle">Ismail Haddouche Rhali</div>
      <div class="welcome-role">${this.i18n.t('welcome.role')}</div>
    `;
    consoleOutput.appendChild(badge);

    const lines = [
      { text: this.i18n.t('welcome.title'), type: 'comment' },
      { text: this.i18n.t('welcome.subtitle'), type: 'comment' },
      { text: '', type: 'blank' },
      { text: `  ${this.i18n.t('welcome.help')}`, type: 'cmd', cmd: 'help' },
      { text: `  ${this.i18n.t('welcome.about')}`, type: 'cmd', cmd: 'about' },
      { text: `  ${this.i18n.t('welcome.experience')}`, type: 'cmd', cmd: 'experience' },
      { text: `  ${this.i18n.t('welcome.projects')}`, type: 'cmd', cmd: 'projects' },
      { text: `  ${this.i18n.t('welcome.skills')}`, type: 'cmd', cmd: 'skills' },
      { text: `  ${this.i18n.t('welcome.neofetch')}`, type: 'cmd', cmd: 'neofetch' },
      { text: `  ${this.i18n.t('welcome.education')}`, type: 'cmd', cmd: 'education' },
      { text: `  ${this.i18n.t('welcome.cv')}`, type: 'cmd', cmd: 'cv' },
      { text: '', type: 'blank' },
      { text: this.i18n.t('welcome.footer'), type: 'comment' },
      { text: '', type: 'blank' },
    ];

    lines.forEach((line) => {
      const pre = document.createElement('pre');
      pre.textContent = line.text;
      if (line.type === 'comment') pre.className = 'welcome-comment';
      else if (line.type === 'cmd' && line.cmd) {
        pre.className = 'welcome-cmd';
        const command = line.cmd;
        pre.addEventListener('click', () => {
          void this.executeCommand(command);
        });
      }
      consoleOutput.appendChild(pre);
    });
  }

  executeCommand(command: string): Promise<void> {
    const normalizedCommand = command.trim().toLowerCase().replace(/^\/+/, '');
    if (!normalizedCommand) return Promise.resolve();

    this.pendingCommands += 1;
    this.setBusyState(true);

    const run = async (): Promise<void> => {
      try {
        await this.runCommand(normalizedCommand);
      } finally {
        this.pendingCommands -= 1;
        if (this.pendingCommands === 0) {
          this.setBusyState(false);
        }
      }
    };

    this.commandQueue = this.commandQueue.then(run, run);
    return this.commandQueue;
  }

  private async runCommand(command: string): Promise<void> {
    this.appendToConsole(`\n${SHELL_PROMPT} ${command}`);

    if (/^sudo(\s+|$)/i.test(command)) {
      this.setActiveMenuItem(null);
      this.appendToConsole(this.i18n.t('ui.sudo_denied'));
      return;
    }

    if (this.handleBuiltIn(command)) return;

    if (this.registry.has(command)) {
      this.setActiveMenuItem(command);
      const spinnerEl = this.showSpinner(command);
      const def = this.registry.get(command)!;
      try {
        this.cleanupAnimations();
        const cmdModule = (await def.script()).default;
        await cmdModule.execute(this);
        if (def.animation) {
          const module = (await def.animation()) as { init?: (container: HTMLElement) => void | (() => void) };
          const initFn = module.init;
          if (initFn) {
            const container = this.dom.commandContainers.get(command) ?? this.dom.consoleOutput;
            if (container) {
              const sidebar = container.querySelector<HTMLElement>(`.command-sidebar`);
              if (sidebar) {
                const cleanup = initFn(sidebar);
                if (typeof cleanup === 'function') {
                  this.animations.registerCleanup(cleanup);
                }
              }
            }
          }
        }
      } catch (error) {
        console.error(`Error loading command ${command}:`, error);
        this.appendToConsole(`Error: Could not load module '${command}'`);
      } finally {
        (spinnerEl as HTMLElement & { _cleanup?: () => void })._cleanup?.();
        spinnerEl.remove();
        this.autoScrollConsole();
      }
    } else {
      this.setActiveMenuItem(null);
      this.appendToConsole(`${this.i18n.t('ui.unrecognized')}'${command}'`);
      this.appendToConsole(this.i18n.t('ui.help_hint'));
    }
  }

  private showSpinner(command: string): HTMLElement {
    const frames = ['/', '-', '\\', '|'] as const;
    let i = 0;
    const el = document.createElement('pre');
    el.className = 'command-loading';
    el.setAttribute('aria-live', 'polite');
    el.textContent = `${frames[0]} loading /${command}`;
    const interval = setInterval(() => {
      i = (i + 1) % frames.length;
      el.textContent = `${frames[i] ?? frames[0]} loading /${command}`;
    }, 120);
    (el as HTMLElement & { _cleanup?: () => void })._cleanup = () => clearInterval(interval);
    this.dom.consoleOutput?.appendChild(el);
    this.autoScrollConsole();
    return el;
  }

  private handleBuiltIn(command: string): boolean {
    switch (command) {
      case 'clear':
        this.cleanupAnimations();
        if (this.dom.consoleOutput) this.dom.consoleOutput.innerHTML = '';
        this.dom.commandContainers.clear();
        this.displayWelcome();
        return true;
      case 'exit':
        this.appendToConsole(this.i18n.t('ui.restarting'));
        setTimeout(() => window.location.reload(), 800);
        return true;
      default:
        return false;
    }
  }

  cleanupAnimations(): void {
    this.animationManager.cleanup();
  }

  setActiveMenuItem(commandName: string | null): void {
    this.dom.menuItems.forEach((item) => {
      const cmd = item.dataset.command;
      item.classList.toggle('active', !!commandName && cmd === commandName);
    });
  }

  async typeText(text: string, speed = 30): Promise<void> {
    this.isTyping = true;
    this.skipTyping = false;
    const consoleOutput = this.dom.consoleOutput;
    if (!consoleOutput) {
      this.isTyping = false;
      this.skipTyping = false;
      return;
    }
    const textContainer = document.createElement('span');
    consoleOutput.appendChild(textContainer);

    try {
      for (let i = 0; i < text.length; i++) {
        if (this.skipTyping) {
          textContainer.textContent = text;
          break;
        }
        textContainer.textContent = text.slice(0, i + 1);
        this.autoScrollConsole();
        if (text[i] !== ' ') await sleep(speed);
      }
    } finally {
      this.isTyping = false;
      this.skipTyping = false;
    }
  }

  appendToConsole(text: string): void {
    const consoleOutput = this.dom.consoleOutput;
    if (!consoleOutput) return;
    const pre = document.createElement('pre');
    pre.textContent = text;
    pre.className = 'console-line';
    const cleanText = text.trimStart();
    if (cleanText.startsWith(SHELL_PROMPT)) {
      pre.classList.add('console-line--command');
    } else if (/error|unrecognized|no reconocido|permission|permisos/i.test(cleanText)) {
      pre.classList.add('console-line--alert');
    }
    consoleOutput.appendChild(pre);
    this.pruneConsoleOutput();
    this.autoScrollConsole();
  }

  autoScrollConsole(element?: HTMLElement): void {
    const output = this.dom.consoleOutput;
    if (!output) return;
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      output.scrollTop = output.scrollHeight;
    }
  }

  createCommandContainer(commandName: string): CommandContainer {
    const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    const timestamp = formatTimestamp();
    const container = document.createElement('div');
    container.className = 'command-container fade-in';
    container.id = `${commandName}-container-${uniqueId}`;

    const metaBar = document.createElement('div');
    metaBar.className = 'command-meta';
    metaBar.innerHTML = `
      <span class="command-chip">
        <span class="chip-icon" aria-hidden="true">$</span>
        <span class="chip-text">/${commandName}</span>
      </span>
      <span class="command-status" aria-label="Command status">exit 0</span>
      <span class="command-timestamp" aria-label="Execution time">${timestamp}</span>
    `;

    const content = document.createElement('div');
    content.className = `command-content ${commandName}-content`;
    content.id = `${commandName}-content-${uniqueId}`;

    const sidebar = document.createElement('div');
    sidebar.className = 'command-sidebar';
    sidebar.id = `${commandName}-sidebar-${uniqueId}`;

    container.appendChild(metaBar);
    container.appendChild(content);
    container.appendChild(sidebar);
    this.dom.consoleOutput?.appendChild(container);
    this.dom.commandContainers.set(commandName, container);
    this.pruneConsoleOutput();

    return { container, content, sidebar };
  }

  private setBusyState(isBusy: boolean): void {
    const input = this.dom.input;
    if (!input) return;
    input.disabled = isBusy;
    input.setAttribute('aria-busy', String(isBusy));
    input.closest('.input-line')?.classList.toggle('is-busy', isBusy);
    if (!isBusy) input.focus();
  }

  private pruneConsoleOutput(): void {
    const consoleOutput = this.dom.consoleOutput;
    if (!consoleOutput) return;
    while (consoleOutput.childElementCount > MAX_CONSOLE_NODES) {
      consoleOutput.firstElementChild?.remove();
    }
  }

}
