/** Maps editable DOM elements to section_content keys in Supabase. */

export function getContentKeyFromElementId(elementId: string, section: string): string {
  const id = elementId.toLowerCase();

  if (id.includes('hero__title') || (section === 'hero' && id.includes('h1'))) return 'title';
  if (id.includes('hero__description')) return 'description';
  if (id.includes('mission__title') || (section === 'mission' && id.includes('h2'))) return 'title';
  if (id.includes('help__title')) return 'title';
  if (id.includes('help__text')) return 'text';
  if (id.includes('contact__title')) return 'title';
  if (id.includes('contact__text')) return 'text';
  if (id.includes('sparrows-closet__title')) return 'title';
  if (id.includes('sparrows-closet__text')) return 'text';
  if (id.includes('sparrows-closet__button')) return 'cta';
  if (id.includes('mission__text') || id.includes('mission-text')) {
    const match = elementId.match(/mission[-_]text-(\d+)/i);
    return match ? `text-${Number(match[1]) + 1}` : 'text-1';
  }
  if (id.includes('story-section__title')) return 'title';
  if (id.includes('story-section__subtitle')) return 'subtitle';
  if (id.includes('story-section__story-title')) {
    const match = elementId.match(/story-section__story-title-(\d+)/i);
    return match ? `story-title-${match[1]}` : 'story-title-1';
  }
  if (id.includes('story-section__story-text')) {
    const match = elementId.match(/story-section__story-text-(\d+)/i);
    return match ? `story-text-${match[1]}` : 'story-text-1';
  }
  if (id.includes('stats-section__value')) {
    const match = elementId.match(/stats-section__value-(\d+)/i);
    return match ? `stat-value-${match[1]}` : 'stat-value-1';
  }
  if (id.includes('stats-section__label')) {
    const match = elementId.match(/stats-section__label-(\d+)/i);
    return match ? `stat-label-${match[1]}` : 'stat-label-1';
  }
  if (id.includes('impact__stat-value')) {
    const match = elementId.match(/impact__stat-value-(\d+)/i);
    return match ? `stat-value-${match[1]}` : 'stat-value-1';
  }
  if (id.includes('impact__stat-label')) {
    const match = elementId.match(/impact__stat-label-(\d+)/i);
    return match ? `stat-label-${match[1]}` : 'stat-label-1';
  }
  if (id.includes('impact__stat-description')) {
    const match = elementId.match(/impact__stat-description-(\d+)/i);
    return match ? `stat-description-${match[1]}` : 'stat-description-1';
  }
  if (id.includes('impact__title')) return 'title';
  if (id.includes('impact__subtitle')) return 'subtitle';
  if (id.includes('impact__story-title')) return 'story-title';
  if (id.includes('impact__story-text')) {
    const match = elementId.match(/impact__story-text-(\d+)/i);
    return match ? `story-text-${Number(match[1]) + 1}` : 'story-text-1';
  }

  return elementId.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();
}

export function getContentKeyFromElement(element: HTMLElement, elementId: string, section: string): string {
  const fromClass = inferKeyFromClass(element.className);
  if (fromClass) return fromClass;

  if (element.classList.contains('mission__text')) {
    const index = inferIndexFromSiblings(element);
    return `text-${index + 1}`;
  }

  if (element.classList.contains('stats-section__value')) {
    const index = inferIndexFromSiblings(element);
    return `stat-value-${index + 1}`;
  }

  if (element.classList.contains('stats-section__label')) {
    const index = inferIndexFromSiblings(element);
    return `stat-label-${index + 1}`;
  }

  if (element.classList.contains('impact__stat-value')) {
    const index = inferIndexFromSiblings(element);
    return `stat-value-${index}`;
  }

  if (element.classList.contains('impact__stat-label')) {
    const index = inferIndexFromSiblings(element);
    return `stat-label-${index}`;
  }

  if (element.classList.contains('impact__stat-description')) {
    const index = inferIndexFromSiblings(element);
    return `stat-description-${index}`;
  }

  if (element.classList.contains('impact__story-text')) {
    const index = inferIndexFromSiblings(element);
    return `story-text-${index + 1}`;
  }

  if (element.classList.contains('story-section__story-title')) {
    const index = inferIndexFromSiblings(element);
    return `story-title-${index}`;
  }

  if (element.classList.contains('story-section__story-text')) {
    const index = inferIndexFromSiblings(element);
    return `story-text-${index}`;
  }

  return getContentKeyFromElementId(elementId, section);
}

function inferKeyFromClass(className: string): string | null {
  if (className.includes('hero__title')) return 'title';
  if (className.includes('hero__description')) return 'description';
  if (className.includes('mission__title')) return 'title';
  if (className.includes('help__title')) return 'title';
  if (className.includes('help__text')) return 'text';
  if (className.includes('contact__title')) return 'title';
  if (className.includes('contact__text')) return 'text';
  if (className.includes('sparrows-closet__title')) return 'title';
  if (className.includes('sparrows-closet__text')) return 'text';
  if (className.includes('sparrows-closet__button')) return 'cta';
  if (className.includes('impact__title')) return 'title';
  if (className.includes('impact__subtitle')) return 'subtitle';
  if (className.includes('impact__story-title')) return 'story-title';
  if (className.includes('story-section__title')) return 'title';
  if (className.includes('story-section__subtitle')) return 'subtitle';
  return null;
}

function inferIndexFromSiblings(element: HTMLElement): number {
  const classList = element.classList[0];
  if (!classList) return 0;
  const section = element.closest('section') ?? element.parentElement;
  if (!section) return 0;
  const siblings = Array.from(section.querySelectorAll(`.${classList}`));
  return siblings.indexOf(element);
}
