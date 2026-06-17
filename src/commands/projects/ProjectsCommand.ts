import type { CommandModule, TerminalAppFacade, ProjectData } from '@/core/types';
import { iconRegistry } from '@/shared/icons/IconRegistry';
import { GalleryModal } from '@/shared/ui/GalleryModal';
import type { GalleryImage } from '@/shared/ui/GalleryModal';
import { slugify } from '@/shared/utils/strings';
import './projects.css';

const projectsData: ProjectData[] = [
  {
    name: 'El Paredes',
    description: 'commands.projects.items.paredes',
    tech: ['Next.js', 'Firebase', 'Firestore', 'Redsys', 'Odoo', 'App Hosting'],
    link: 'https://elparedes.es/',
    linkLabel: 'elparedes.es',
    badge: 'commands.projects.badges.production',
  },
  {
    name: 'Disherio',
    description: 'commands.projects.items.disherio',
    tech: ['TypeScript', 'Angular', 'Node.js', 'MongoDB', 'Socket.io', 'Docker'],
    link: 'https://github.com/ismailhaddouche/disherio',
    linkLabel: 'GitHub',
    badge: 'commands.projects.badges.oss',
  },
  {
    name: 'TimeTutor',
    description: 'commands.projects.items.timetutor',
    tech: ['Kotlin', 'Jetpack Compose', 'Clean Architecture', 'MVVM', 'Firebase', 'Firebase Functions'],
    link: 'https://github.com/ismailhaddouche/timetutor',
    linkLabel: 'GitHub',
    badge: 'commands.projects.badges.android',
  },
  {
    name: 'Episodeo',
    description: 'commands.projects.items.episodeo',
    tech: ['Kotlin', 'Jetpack Compose', 'Firebase', 'Room', 'Retrofit', 'TMDB API', 'Clean Architecture', 'MVVM', 'GitHub Actions'],
    link: 'https://github.com/ismailhaddouche/episodeo',
    linkLabel: 'GitHub',
    badge: 'commands.projects.badges.android',
  },
  {
    name: 'hismar.dev',
    description: 'commands.projects.items.hismar',
    tech: ['JavaScript', 'HTML5', 'CSS3', 'Canvas API', 'Vanilla JS'],
    link: 'https://github.com/ismailhaddouche/hismar.dev',
    linkLabel: 'GitHub',
    badge: 'commands.projects.badges.vanilla',
  },
];

interface ProjectManifestItem {
  src?: string;
  alt?: string;
  orientation?: string;
}

const ProjectsCommand: CommandModule = {
  async execute(terminal: TerminalAppFacade) {
    await iconRegistry.ensureDevIconLoaded();

    const { container, content } = terminal.createCommandContainer('projects');
    const galleryModal = new GalleryModal();
    const manifestController = new AbortController();
    let disposed = false;

    terminal.animations.registerCleanup(() => {
      disposed = true;
      manifestController.abort();
      galleryModal.destroy();
    });

    const title = document.createElement('h2');
    title.className = 'section-title';
    title.textContent = terminal.i18n.t('commands.projects.title');
    content.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'projects-grid';
    content.appendChild(grid);

    for (const project of projectsData) {
      const card = document.createElement('div');
      card.className = 'project-card';
      const openLink = (event: Event) => {
        const target = event.target as HTMLElement | null;
        if (isGalleryTarget(target)) return;
        window.open(project.link, '_blank', 'noopener,noreferrer');
      };
      card.addEventListener('click', openLink);
      card.addEventListener('keydown', (e) => {
        const target = e.target as HTMLElement | null;
        if (isGalleryTarget(target)) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.open(project.link, '_blank', 'noopener,noreferrer');
        }
      });
      card.tabIndex = 0;
      card.setAttribute('role', 'link');

      const badge = document.createElement('span');
      badge.className = 'project-badge';
      badge.textContent = terminal.i18n.t(project.badge);
      card.appendChild(badge);

      const titleEl = document.createElement('h3');
      titleEl.className = 'project-title';
      titleEl.textContent = project.name;
      card.appendChild(titleEl);

      const gallery = buildProjectGallery(
        project,
        galleryModal,
        manifestController.signal,
        () => disposed
      );
      card.appendChild(gallery);

      const desc = document.createElement('p');
      desc.className = 'project-description';
      desc.textContent = terminal.i18n.t(project.description);
      card.appendChild(desc);

      const tagsContainer = document.createElement('div');
      tagsContainer.className = 'project-tags';
      project.tech.forEach((t) => {
        const tag = document.createElement('span');
        tag.className = 'project-tag';
        tag.classList.add(`project-tag--${slugify(t)}`);
        const iconMarkup = iconRegistry.buildIconMarkup(iconRegistry.getIcon(t));
        tag.innerHTML = `${iconMarkup}<span>${t}</span>`;
        tagsContainer.appendChild(tag);
      });
      card.appendChild(tagsContainer);

      const linkRow = document.createElement('div');
      linkRow.className = 'project-link-row';
      linkRow.innerHTML = `<span class="project-link-text">→ ${project.linkLabel}</span>`;
      card.appendChild(linkRow);

      grid.appendChild(card);
    }

    terminal.autoScrollConsole(container);
  },
};

function buildProjectGallery(
  project: ProjectData,
  galleryModal: GalleryModal,
  signal: AbortSignal,
  isDisposed: () => boolean
): HTMLElement {
  const gallery = document.createElement('div');
  gallery.className = 'project-gallery';

  const prevBtn = document.createElement('button');
  prevBtn.type = 'button';
  prevBtn.className = 'gallery-nav gallery-nav--prev';
  prevBtn.setAttribute('aria-label', `Previous screenshot for ${project.name}`);
  prevBtn.innerHTML = '<span aria-hidden="true">⟵</span>';

  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'gallery-nav gallery-nav--next';
  nextBtn.setAttribute('aria-label', `Next screenshot for ${project.name}`);
  nextBtn.innerHTML = '<span aria-hidden="true">⟶</span>';

  const frame = document.createElement('div');
  frame.className = 'project-gallery-frame';
  frame.tabIndex = 0;
  frame.setAttribute('role', 'button');
  frame.setAttribute('aria-label', `Open ${project.name} gallery in fullscreen`);

  const img = document.createElement('img');
  img.loading = 'lazy';
  img.decoding = 'async';
  img.alt = `${project.name} screenshot preview`;

  const counter = document.createElement('span');
  counter.className = 'project-gallery-counter';

  let images: GalleryImage[] = [
    {
      src: `https://dummyimage.com/900x520/050b13/39ff14&text=${encodeURIComponent(project.name)}`,
      alt: `${project.name} preview`,
      orientation: 'landscape',
    },
  ];
  let currentIndex = 0;

  const applyImage = (index: number) => {
    const current = images[index];
    if (!current) return;
    img.src = current.src;
    img.alt = current.alt ?? `${project.name} screenshot ${index + 1}`;
    frame.dataset.orientation = current.orientation ?? 'landscape';
    counter.textContent = `${index + 1}/${images.length}`;
  };

  applyImage(currentIndex);

  const showNext = (direction: number) => {
    if (images.length <= 1) return;
    currentIndex = (currentIndex + direction + images.length) % images.length;
    applyImage(currentIndex);
  };

  prevBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    event.preventDefault();
    showNext(-1);
  });

  nextBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    event.preventDefault();
    showNext(1);
  });

  const updateNavState = () => {
    const single = images.length <= 1;
    prevBtn.disabled = single;
    nextBtn.disabled = single;
    counter.hidden = single;
  };

  updateNavState();

  frame.appendChild(img);
  frame.appendChild(counter);
  gallery.appendChild(prevBtn);
  gallery.appendChild(frame);
  gallery.appendChild(nextBtn);

  frame.addEventListener('click', (event) => {
    event.preventDefault();
    if (!images.length) return;
    galleryModal.open(images, currentIndex, project.name);
  });

  frame.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      if (!images.length) return;
      galleryModal.open(images, currentIndex, project.name);
    }
  });

  void loadProjectImages(project, signal).then((remoteImages) => {
    if (isDisposed() || signal.aborted || !gallery.isConnected) return;
    if (Array.isArray(remoteImages) && remoteImages.length) {
      images = remoteImages;
      currentIndex = 0;
      applyImage(currentIndex);
      updateNavState();
    }
  });

  return gallery;
}

async function loadProjectImages(project: ProjectData, signal: AbortSignal): Promise<GalleryImage[]> {
  try {
    const slug = slugify(project.name);
    const response = await fetch(`images/projects/${slug}/manifest.json`, { signal });
    if (!response.ok) throw new Error('Manifest not found');
    const manifest = (await response.json()) as unknown;
    if (isProjectManifest(manifest) && manifest.length > 0) {
      return manifest
        .map<GalleryImage>((item) => ({
          src: item.src ? `images/projects/${slug}/${item.src}` : '',
          alt: item.alt ?? `${project.name} image`,
          orientation: item.orientation ?? 'landscape',
        }))
        .filter((img) => Boolean(img.src));
    }
    return [];
  } catch {
    return [];
  }
}

function isGalleryTarget(target: HTMLElement | null): boolean {
  return Boolean(target?.closest('.project-gallery-frame') ?? target?.closest('.gallery-nav'));
}

function isProjectManifest(value: unknown): value is ProjectManifestItem[] {
  if (!Array.isArray(value)) return false;
  return value.every((item) => {
    if (!item || typeof item !== 'object') return false;
    const candidate = item as Record<string, unknown>;
    return (
      (candidate.src === undefined || typeof candidate.src === 'string') &&
      (candidate.alt === undefined || typeof candidate.alt === 'string') &&
      (candidate.orientation === undefined || typeof candidate.orientation === 'string')
    );
  });
}

export default ProjectsCommand;
