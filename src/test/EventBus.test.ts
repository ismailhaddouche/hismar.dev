import { describe, it, expect, vi } from 'vitest';
import { EventBus } from '@/core/EventBus';

describe('EventBus', () => {
  it('should emit events to registered handlers', () => {
    const bus = new EventBus();
    const handler = vi.fn();
    bus.on('test', handler);
    bus.emit('test', 'arg1', 'arg2');
    expect(handler).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('should not call handler after unregistering', () => {
    const bus = new EventBus();
    const handler = vi.fn();
    bus.on('test', handler);
    bus.off('test', handler);
    bus.emit('test');
    expect(handler).not.toHaveBeenCalled();
  });

  it('should handle multiple handlers for same event', () => {
    const bus = new EventBus();
    const h1 = vi.fn();
    const h2 = vi.fn();
    bus.on('test', h1);
    bus.on('test', h2);
    bus.emit('test');
    expect(h1).toHaveBeenCalledOnce();
    expect(h2).toHaveBeenCalledOnce();
  });

  it('should clear all handlers', () => {
    const bus = new EventBus();
    const handler = vi.fn();
    bus.on('test', handler);
    bus.clear();
    bus.emit('test');
    expect(handler).not.toHaveBeenCalled();
  });

  it('should not throw when handler throws', () => {
    const bus = new EventBus();
    bus.on('test', () => { throw new Error('handler error'); });
    expect(() => bus.emit('test')).not.toThrow();
  });
});
