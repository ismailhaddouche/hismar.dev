interface AnimationModule {
  cleanup?(): void;
}

export class AnimationManager {
  private cleanups: (() => void)[] = [];
  private currentAnimation: AnimationModule | null = null;

  registerCleanup(fn: () => void): void {
    if (typeof fn === 'function') {
      this.cleanups.push(fn);
    }
  }

  cleanup(): void {
    this.cleanups.forEach((fn) => {
      try {
        fn();
      } catch (e) {
        console.error('Animation cleanup error:', e);
      }
    });
    this.cleanups = [];

    if (this.currentAnimation?.cleanup) {
      try {
        this.currentAnimation.cleanup();
      } catch (e) {
        console.error('Animation module cleanup error:', e);
      }
      this.currentAnimation = null;
    }
  }

  setCurrentAnimation(module: AnimationModule | null): void {
    this.currentAnimation = module;
  }
}
