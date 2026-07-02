const TRIGGER_THRESHOLD = 70;
const RESISTANCE = 0.45;
const MAX_PULL = 120;

export class PullToRefresh {
  private container: HTMLElement;
  private onRefresh: () => void;
  private indicator: HTMLElement;
  private startY = 0;
  private currentPull = 0;
  private pulling = false;
  private refreshing = false;

  private onTouchStart = (e: TouchEvent): void => {
    if (this.refreshing) return;
    if (this.container.scrollTop > 0) {
      this.pulling = false;
      return;
    }
    if (e.touches.length !== 1 || !e.touches[0]) return;
    this.startY = e.touches[0].clientY;
    this.pulling = true;
    this.currentPull = 0;
  };

  private onTouchMove = (e: TouchEvent): void => {
    if (!this.pulling || this.refreshing) return;
    const touch = e.touches[0];
    if (!touch) return;
    const delta = touch.clientY - this.startY;
    if (delta <= 0) {
      this.currentPull = 0;
      this.applyTransform(0);
      return;
    }
    e.preventDefault();
    this.currentPull = Math.min(delta * RESISTANCE, MAX_PULL);
    this.applyTransform(this.currentPull);
  };

  private onTouchEnd = (): void => {
    if (!this.pulling || this.refreshing) return;
    this.pulling = false;
    if (this.currentPull >= TRIGGER_THRESHOLD) {
      this.triggerRefresh();
    } else {
      this.reset();
    }
  };

  constructor(container: HTMLElement, onRefresh: () => void) {
    this.container = container;
    this.onRefresh = onRefresh;

    this.indicator = document.createElement('div');
    this.indicator.className = 'ptr-indicator';
    this.indicator.setAttribute('aria-hidden', 'true');
    this.indicator.innerHTML = '<span class="ptr-arrow"></span><span class="ptr-spinner"></span>';

    container.style.position = container.style.position || 'relative';
    container.prepend(this.indicator);

    container.addEventListener('touchstart', this.onTouchStart, { passive: true });
    container.addEventListener('touchmove', this.onTouchMove, { passive: false });
    container.addEventListener('touchend', this.onTouchEnd, { passive: true });
  }

  private applyTransform(pull: number): void {
    this.container.style.transform = `translateY(${pull}px)`;
    const progress = Math.min(pull / TRIGGER_THRESHOLD, 1);
    const arrow = this.indicator.querySelector<HTMLElement>('.ptr-arrow');
    if (arrow) {
      arrow.style.transform = `rotate(${progress * 180}deg)`;
      arrow.style.opacity = String(0.4 + progress * 0.6);
    }
    this.indicator.style.opacity = String(progress);
  }

  private triggerRefresh(): void {
    this.refreshing = true;
    this.indicator.classList.add('ptr-indicator--refreshing');
    this.container.style.transform = `translateY(${TRIGGER_THRESHOLD}px)`;

    const spinner = this.indicator.querySelector<HTMLElement>('.ptr-spinner');
    const arrow = this.indicator.querySelector<HTMLElement>('.ptr-arrow');
    if (spinner) spinner.style.display = 'block';
    if (arrow) arrow.style.display = 'none';

    void Promise.resolve(this.onRefresh()).finally(() => this.reset());
  }

  private reset(): void {
    this.refreshing = false;
    this.currentPull = 0;
    this.container.style.transform = '';
    this.indicator.classList.remove('ptr-indicator--refreshing');

    const spinner = this.indicator.querySelector<HTMLElement>('.ptr-spinner');
    const arrow = this.indicator.querySelector<HTMLElement>('.ptr-arrow');
    if (spinner) spinner.style.display = '';
    if (arrow) arrow.style.display = '';
    if (arrow) arrow.style.transform = '';
    if (arrow) arrow.style.opacity = '';
    this.indicator.style.opacity = '';
  }

  destroy(): void {
    this.container.removeEventListener('touchstart', this.onTouchStart);
    this.container.removeEventListener('touchmove', this.onTouchMove);
    this.container.removeEventListener('touchend', this.onTouchEnd);
    this.indicator.remove();
    this.container.style.transform = '';
  }
}