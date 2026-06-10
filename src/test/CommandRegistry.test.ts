import { describe, it, expect, beforeEach } from 'vitest';
import { CommandRegistry } from '@/core/CommandRegistry';
import type { CommandDefinition } from '@/core/types';

describe('CommandRegistry', () => {
  let registry: CommandRegistry;

  beforeEach(() => {
    registry = new CommandRegistry();
  });

  const createDef = (name: string, showInNav = true): CommandDefinition => ({
    name,
    script: async () => ({ default: { async execute() {} } }),
    showInNav,
  });

  it('should register and retrieve a command', () => {
    registry.register(createDef('about'));
    expect(registry.has('about')).toBe(true);
    expect(registry.get('about')).toBeDefined();
  });

  it('should return undefined for unknown command', () => {
    expect(registry.has('unknown')).toBe(false);
    expect(registry.get('unknown')).toBeUndefined();
  });

  it('should return all registered commands', () => {
    registry.register(createDef('about'));
    registry.register(createDef('help'));
    expect(registry.getAll()).toHaveLength(2);
  });

  it('should return only nav commands', () => {
    registry.register(createDef('about', true));
    registry.register(createDef('clear', false));
    const nav = registry.getNavCommands();
    expect(nav).toHaveLength(1);
    expect(nav[0]?.name).toBe('about');
  });

  it('should autocomplete commands', () => {
    registry.register(createDef('about'));
    registry.register(createDef('experience'));
    registry.register(createDef('education'));
    const matches = registry.autocomplete('exp');
    expect(matches).toEqual(['experience']);
  });

  it('should return multiple autocomplete matches', () => {
    registry.register(createDef('about'));
    registry.register(createDef('abort'));
    const matches = registry.autocomplete('ab');
    expect(matches).toHaveLength(2);
  });

  it('should return empty for autocomplete without matches', () => {
    registry.register(createDef('about'));
    expect(registry.autocomplete('zzz')).toEqual([]);
  });

  it('should return empty for empty partial', () => {
    registry.register(createDef('about'));
    expect(registry.autocomplete('')).toEqual([]);
  });
});
