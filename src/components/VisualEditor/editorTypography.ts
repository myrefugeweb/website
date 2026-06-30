/**
 * Constrained typography roles for the visual editor.
 * Editors may only apply approved format tokens — never arbitrary sizes or colors.
 */

export type TextRole = 'display' | 'heading' | 'subheading' | 'body' | 'stat' | 'label';

export type FormatTokenId = 'accent' | 'bold';

export interface FormatToken {
  id: FormatTokenId;
  label: string;
  /** Wraps selection in this markup (class must be on an allowed list for the role). */
  wrapTag: string;
  wrapClass?: string;
}

export interface TextRoleMeta {
  role: TextRole;
  label: string;
  hint: string;
  allowsHtml: boolean;
  allowedTags: string[];
  allowedClasses: string[];
  tokens: FormatToken[];
}

const ROLE_META: Record<TextRole, Omit<TextRoleMeta, 'role'>> = {
  display: {
    label: 'Display title',
    hint: 'Main hero headline — largest text on the page',
    allowsHtml: true,
    allowedTags: ['span'],
    allowedClasses: ['hero__title-accent', 'editor-accent'],
    tokens: [{ id: 'accent', label: 'Highlight', wrapTag: 'span', wrapClass: 'hero__title-accent' }],
  },
  heading: {
    label: 'Section heading',
    hint: 'H2-level section title',
    allowsHtml: false,
    allowedTags: [],
    allowedClasses: [],
    tokens: [],
  },
  subheading: {
    label: 'Subheading',
    hint: 'Supporting headline below the section title',
    allowsHtml: false,
    allowedTags: [],
    allowedClasses: [],
    tokens: [],
  },
  body: {
    label: 'Body text',
    hint: 'Paragraph copy — keep concise and readable',
    allowsHtml: true,
    allowedTags: ['strong'],
    allowedClasses: [],
    tokens: [{ id: 'bold', label: 'Emphasis', wrapTag: 'strong' }],
  },
  stat: {
    label: 'Stat value',
    hint: 'Numeric or short impact figure',
    allowsHtml: false,
    allowedTags: [],
    allowedClasses: [],
    tokens: [],
  },
  label: {
    label: 'Label',
    hint: 'Short descriptor under a stat or list item',
    allowsHtml: false,
    allowedTags: [],
    allowedClasses: [],
    tokens: [],
  },
};

const CLASS_ROLE_MAP: Array<{ pattern: RegExp; role: TextRole }> = [
  { pattern: /hero__title|^h1$/i, role: 'display' },
  { pattern: /story-section__title|mission__title|help__title|contact__title|impact__title|sparrows-closet__title/i, role: 'heading' },
  { pattern: /story-section__subtitle|contact__subtitle|impact__subtitle|story-section__story-title|impact__story-title/i, role: 'subheading' },
  { pattern: /hero__description|mission__text|help__text|contact__text|sparrows-closet__text|story-section__story-text|impact__story-text|impact__stat-description/i, role: 'body' },
  { pattern: /stats-section__value|impact__stat-value/i, role: 'stat' },
  { pattern: /stats-section__label|impact__stat-label|sparrows-closet__button/i, role: 'label' },
  { pattern: /^h2$/i, role: 'heading' },
  { pattern: /^p$/i, role: 'body' },
];

export function getTextRoleFromElement(element: HTMLElement): TextRoleMeta {
  const className = element.className || '';
  const tag = element.tagName.toLowerCase();
  const haystack = `${className} ${tag}`;

  for (const { pattern, role } of CLASS_ROLE_MAP) {
    if (pattern.test(haystack)) {
      return { role, ...ROLE_META[role] };
    }
  }

  return { role: 'body', ...ROLE_META.body };
}

export function sanitizeEditorHtml(raw: string, meta: TextRoleMeta): string {
  const trimmed = raw.trim();
  if (!meta.allowsHtml && meta.allowedTags.length === 0) {
    const doc = new DOMParser().parseFromString(trimmed, 'text/html');
    return (doc.body.textContent || '').trim();
  }

  const doc = new DOMParser().parseFromString(trimmed, 'text/html');
  const allowedTags = new Set(meta.allowedTags.map((t) => t.toLowerCase()));

  const walk = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || '';
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return '';

    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();

    if (!allowedTags.has(tag)) {
      return Array.from(el.childNodes).map(walk).join('');
    }

    const classAttr = el.getAttribute('class') || '';
    const classes = classAttr.split(/\s+/).filter(Boolean);
    const safeClasses = classes.filter((c) => meta.allowedClasses.includes(c));
    const classStr = safeClasses.length ? ` class="${safeClasses.join(' ')}"` : '';

    return `<${tag}${classStr}>${Array.from(el.childNodes).map(walk).join('')}</${tag}>`;
  };

  return Array.from(doc.body.childNodes).map(walk).join('').trim();
}

export function applyFormatToken(token: FormatToken): void {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;

  const range = selection.getRangeAt(0);
  const wrapper = document.createElement(token.wrapTag);
  if (token.wrapClass) wrapper.className = token.wrapClass;

  try {
    range.surroundContents(wrapper);
  } catch {
    // Selection spans multiple blocks — extract and re-insert
    const fragment = range.extractContents();
    wrapper.appendChild(fragment);
    range.insertNode(wrapper);
  }

  selection.removeAllRanges();
  const newRange = document.createRange();
  newRange.selectNodeContents(wrapper);
  selection.addRange(newRange);
}
