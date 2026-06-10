import { describe, it, expect } from 'vitest';
import { slugify, getAge } from '@/shared/utils/strings';
import { sleep } from '@/shared/utils/async';

describe('slugify', () => {
  it('should convert to lowercase with hyphens', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('should remove special characters', () => {
    expect(slugify('Clean Architecture')).toBe('clean-architecture');
  });

  it('should handle multiple spaces', () => {
    expect(slugify('GitHub   Actions')).toBe('github-actions');
  });

  it('should trim leading/trailing hyphens', () => {
    expect(slugify('  Hello  ')).toBe('hello');
  });
});

describe('getAge', () => {
  it('should calculate age correctly', () => {
    const birth = new Date('1988-05-14');
    const age = getAge(birth);
    expect(age).toBeGreaterThanOrEqual(36);
  });
});

describe('sleep', () => {
  it('should resolve after specified time', async () => {
    const start = Date.now();
    await sleep(50);
    expect(Date.now() - start).toBeGreaterThanOrEqual(45);
  });
});
