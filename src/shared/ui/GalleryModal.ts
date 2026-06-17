export interface GalleryImage {
  src: string;
  alt: string;
  orientation?: string;
}

export class GalleryModal {
  private modal: HTMLDivElement | null = null;
  private modalImg!: HTMLImageElement;
  private modalCounter!: HTMLElement;
  private modalTitle!: HTMLElement;
  private prevBtn!: HTMLButtonElement;
  private nextBtn!: HTMLButtonElement;
  private closeBtn!: HTMLButtonElement;
  private currentImages: GalleryImage[] = [];
  private currentIndex = 0;
  private isListening = false;

  open(images: GalleryImage[], startIndex: number, title: string): void {
    if (!images.length) return;
    this.ensureModal();
    this.currentImages = images;
    this.currentIndex = startIndex || 0;
    this.modalTitle.textContent = title;
    this.listenForKeys();
    this.modal?.classList.add('active');
    document.body.classList.add('gallery-modal-open');
    this.update();
  }

  close(): void {
    if (!this.modal) return;
    this.modal.classList.remove('active');
    document.body.classList.remove('gallery-modal-open');
    this.destroy();
  }

  destroy(): void {
    this.stopListeningForKeys();
    this.modal?.remove();
    this.modal = null;
    this.currentImages = [];
    document.body.classList.remove('gallery-modal-open');
  }

  private ensureModal(): void {
    if (this.modal) return;

    this.modal = document.createElement('div');
    this.modal.className = 'project-gallery-modal';
    this.modal.innerHTML = `
      <div class="project-gallery-modal__backdrop"></div>
      <div class="project-gallery-modal__dialog" role="dialog" aria-modal="true">
        <button class="project-gallery-modal__close" aria-label="Close gallery">&times;</button>
        <div class="project-gallery-modal__title-row">
          <span class="project-gallery-modal__title"></span>
          <span class="project-gallery-modal__counter"></span>
        </div>
        <div class="project-gallery-modal__frame">
          <button class="project-gallery-modal__nav project-gallery-modal__nav--prev" aria-label="Previous image">⟵</button>
          <img src="" alt="Project gallery image preview">
          <button class="project-gallery-modal__nav project-gallery-modal__nav--next" aria-label="Next image">⟶</button>
        </div>
      </div>
    `;
    document.body.appendChild(this.modal);

    this.modalImg = this.modal.querySelector('img')!;
    this.modalCounter = this.modal.querySelector('.project-gallery-modal__counter')!;
    this.modalTitle = this.modal.querySelector('.project-gallery-modal__title')!;
    this.prevBtn = this.modal.querySelector('.project-gallery-modal__nav--prev')!;
    this.nextBtn = this.modal.querySelector('.project-gallery-modal__nav--next')!;
    this.closeBtn = this.modal.querySelector('.project-gallery-modal__close')!;
    const backdrop = this.modal.querySelector('.project-gallery-modal__backdrop')!;

    this.prevBtn.addEventListener('click', (e) => { e.stopPropagation(); this.show(-1); });
    this.nextBtn.addEventListener('click', (e) => { e.stopPropagation(); this.show(1); });
    this.closeBtn.addEventListener('click', (e) => { e.stopPropagation(); this.close(); });
    backdrop.addEventListener('click', () => this.close());
  }

  private handleKeydown = (event: KeyboardEvent): void => {
    if (!this.modal?.classList.contains('active')) return;
    if (event.key === 'Escape') this.close();
    else if (event.key === 'ArrowLeft') this.show(-1);
    else if (event.key === 'ArrowRight') this.show(1);
  };

  private update(): void {
    if (!this.currentImages.length) {
      this.close();
      return;
    }
    const current = this.currentImages[this.currentIndex];
    if (!current) return;
    this.modalImg.src = current.src;
    this.modalImg.alt = current.alt ?? this.modalTitle.textContent ?? '';
    this.modalImg.dataset.orientation = current.orientation ?? 'landscape';
    this.modalCounter.textContent = `${this.currentIndex + 1}/${this.currentImages.length}`;
    this.prevBtn.disabled = this.currentImages.length <= 1;
    this.nextBtn.disabled = this.currentImages.length <= 1;
  }

  private show(step: number): void {
    if (this.currentImages.length <= 1) return;
    this.currentIndex =
      (this.currentIndex + step + this.currentImages.length) % this.currentImages.length;
    this.update();
  }

  private listenForKeys(): void {
    if (this.isListening) return;
    document.addEventListener('keydown', this.handleKeydown);
    this.isListening = true;
  }

  private stopListeningForKeys(): void {
    if (!this.isListening) return;
    document.removeEventListener('keydown', this.handleKeydown);
    this.isListening = false;
  }
}
