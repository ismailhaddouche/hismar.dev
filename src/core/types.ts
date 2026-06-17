import type { EventBus } from './EventBus';

export interface CommandDefinition {
  name: string;
  script: () => Promise<{ default: CommandModule }>;
  showInNav: boolean;
  builtIn?: boolean;
  animation?: () => Promise<unknown>;
}

export interface CommandModule {
  execute(terminal: TerminalAppFacade): Promise<void>;
}

export interface I18n {
  readonly current: string;
  t<T = string>(path: string): T;
  setLanguage(lang: string): void;
}

export interface TerminalAppFacade {
  readonly eventBus: EventBus;
  readonly i18n: I18n;
  readonly animations: AnimationManagerFacade;
  createCommandContainer(commandName: string): CommandContainer;
  executeCommand(command: string): Promise<void>;
  typeText(text: string, speed?: number): Promise<void>;
  appendToConsole(text: string): void;
  autoScrollConsole(element?: HTMLElement): void;
  setActiveMenuItem(commandName: string | null): void;
  cleanupAnimations(): void;
}

export interface AnimationManagerFacade {
  registerCleanup(fn: () => void): void;
  cleanup(): void;
}

export interface CommandContainer {
  container: HTMLElement;
  content: HTMLElement;
  sidebar: HTMLElement;
}

export type I18nTranslations = Record<string, Record<string, unknown>>;

export interface ProjectData {
  name: string;
  description: string;
  tech: string[];
  link: string;
  linkLabel: string;
  badge: string;
}

