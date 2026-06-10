export class ModuleLoader {
  private loadedStyles = new Set<string>();

  async loadCSS(path: string): Promise<void> {
    if (this.loadedStyles.has(path)) return;

    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `${path}?v=${getBuildHash()}`;
      link.onload = () => {
        this.loadedStyles.add(path);
        resolve();
      };
      link.onerror = () => reject(new Error(`Failed to load CSS: ${path}`));
      document.head.appendChild(link);
    });
  }

  clearLoadedStyles(): void {
    this.loadedStyles.clear();
  }
}

function getBuildHash(): string {
  if (typeof __BUILD_HASH__ !== 'undefined') return __BUILD_HASH__;
  return Date.now().toString(36);
}

