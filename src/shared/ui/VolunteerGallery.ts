interface VolunteerImage {
  src: string;
  alt: string;
}

const SLIDE_INTERVAL = 2500;

export class VolunteerGallery {
  private container: HTMLElement | null = null;
  private frame: HTMLElement | null = null;
  private images: VolunteerImage[] = [];
  private currentIndex = 0;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private observer: IntersectionObserver | null = null;
  private disposed = false;

  async mount(parent: HTMLElement): Promise<void> {
    this.container = document.createElement('div');
    this.container.className = 'volunteer-gallery';

    const header = document.createElement('div');
    header.className = 'volunteer-gallery__header';
    const label = document.createElement('span');
    label.className = 'volunteer-gallery__label';
    label.textContent = '●';
    const counter = document.createElement('span');
    counter.className = 'volunteer-gallery__counter';
    counter.textContent = '0/0';
    header.appendChild(label);
    header.appendChild(counter);

    this.frame = document.createElement('div');
    this.frame.className = 'volunteer-gallery__frame';

    const placeholder = document.createElement('div');
    placeholder.className = 'volunteer-gallery__placeholder';
    placeholder.textContent = 'Loading…';
    this.frame.appendChild(placeholder);

    this.container.appendChild(header);
    this.container.appendChild(this.frame);
    parent.appendChild(this.container);

    await this.loadImages();
    this.setupIntersectionObserver();
  }

  private async loadImages(): Promise<void> {
    try {
      const response = await fetch('volunteer/manifest.json');
      if (!response.ok) return;
      const manifest = (await response.json()) as unknown;
      if (!Array.isArray(manifest)) return;
      this.images = manifest
        .filter((item): item is Record<string, unknown> => item !== null && typeof item === 'object')
        .map((item) => ({
          src: typeof item.src === 'string' ? `volunteer/${item.src}` : '',
          alt: typeof item.alt === 'string' ? item.alt : 'Volunteer photo',
        }))
        .filter((img) => Boolean(img.src))
        .sort((a, b) => {
          const na = parseInt(a.src.match(/\d+/)?.[0] ?? '0', 10);
          const nb = parseInt(b.src.match(/\d+/)?.[0] ?? '0', 10);
          return na - nb;
        });
      if (this.images.length === 0) return;
      this.renderSlides();
    } catch {
      if (this.frame) this.frame.textContent = '';
    }
  }

  private renderSlides(): void {
    if (!this.frame || this.images.length === 0) return;
    this.frame.innerHTML = '';

    this.images.forEach((img, i) => {
      const slide = document.createElement('div');
      slide.className = 'volunteer-gallery__slide';
      slide.dataset.index = String(i);
      if (i === 0) slide.classList.add('active');

      const image = document.createElement('img');
      image.src = img.src;
      image.alt = img.alt;
      image.loading = 'lazy';

      slide.appendChild(image);
      this.frame!.appendChild(slide);
    });

    this.updateCounter();
  }

  private setupIntersectionObserver(): void {
    if (!this.container) return;
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) this.play();
          else this.pause();
        }
      },
      { threshold: 0.25 }
    );
    this.observer.observe(this.container);
  }

  private play(): void {
    if (this.disposed || this.intervalId !== null || this.images.length <= 1) return;
    this.intervalId = setInterval(() => this.next(), SLIDE_INTERVAL);
  }

  private pause(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private next(): void {
    if (this.images.length === 0 || !this.frame) return;
    const slides = this.frame.querySelectorAll('.volunteer-gallery__slide');
    slides.forEach((s) => s.classList.remove('active'));
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    const slide = slides[this.currentIndex];
    if (slide) slide.classList.add('active');
    this.updateCounter();
  }

  private updateCounter(): void {
    if (!this.container) return;
    const counter = this.container.querySelector('.volunteer-gallery__counter');
    if (counter) {
      counter.textContent = `${this.currentIndex + 1}/${this.images.length}`;
    }
  }

  destroy(): void {
    this.disposed = true;
    this.pause();
    this.observer?.disconnect();
    this.observer = null;
    this.container?.remove();
    this.container = null;
    this.frame = null;
    this.images = [];
  }
}
