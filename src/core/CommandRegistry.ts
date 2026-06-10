import type { CommandDefinition } from './types';

export class CommandRegistry {
  private commands = new Map<string, CommandDefinition>();

  register(def: CommandDefinition): void {
    this.commands.set(def.name, def);
  }

  get(name: string): CommandDefinition | undefined {
    return this.commands.get(name);
  }

  has(name: string): boolean {
    return this.commands.has(name);
  }

  getAll(): CommandDefinition[] {
    return Array.from(this.commands.values());
  }

  getNavCommands(): CommandDefinition[] {
    return Array.from(this.commands.values()).filter((c) => c.showInNav);
  }

  autocomplete(partial: string): string[] {
    if (!partial) return [];
    return Array.from(this.commands.keys()).filter((k) => k.startsWith(partial));
  }
}
