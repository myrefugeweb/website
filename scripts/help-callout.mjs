/**
 * Shared browser-side logic for Help Center screenshots.
 *
 * Instead of capturing a single element tightly cropped (which makes a button
 * fill the whole frame with no context), we:
 *   1. draw a callout box around the target element, and
 *   2. return a "medium" clip rect (the element plus surrounding context),
 *      clamped to the viewport with sensible min/max sizes.
 *
 * The source is exported as a string so the exact same logic can run both via
 * Playwright `page.evaluate` and via a raw CDP `Runtime.evaluate` expression.
 */

export const HELP_CALLOUT_SOURCE = `(opts) => {
  const selector = opts.selector;
  const label = opts.label || '';
  const el = document.querySelector(selector);
  if (!el) return null;
  el.scrollIntoView({ block: 'center', inline: 'center' });
  document.querySelectorAll('[data-help-callout]').forEach(function (n) { n.remove(); });

  const r = el.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const pad = 8;

  const box = document.createElement('div');
  box.setAttribute('data-help-callout', '1');
  const s = box.style;
  s.position = 'fixed';
  s.left = (r.left - pad) + 'px';
  s.top = (r.top - pad) + 'px';
  s.width = (r.width + pad * 2) + 'px';
  s.height = (r.height + pad * 2) + 'px';
  s.border = '3px solid #F97316';
  s.borderRadius = '12px';
  s.boxShadow = '0 0 0 5px rgba(249,115,22,0.25), 0 10px 30px rgba(15,23,42,0.18)';
  s.zIndex = '2147483647';
  s.pointerEvents = 'none';
  s.boxSizing = 'border-box';
  document.body.appendChild(box);

  if (label) {
    const tag = document.createElement('div');
    tag.setAttribute('data-help-callout', '1');
    const t = tag.style;
    const above = r.top - pad - 30;
    t.position = 'fixed';
    t.left = Math.max(4, r.left - pad) + 'px';
    t.top = (above < 4 ? (r.bottom + pad + 8) : above) + 'px';
    t.background = '#F97316';
    t.color = '#ffffff';
    t.font = '600 12px/1.4 system-ui, -apple-system, Segoe UI, sans-serif';
    t.padding = '4px 10px';
    t.borderRadius = '999px';
    t.boxShadow = '0 6px 16px rgba(249,115,22,0.35)';
    t.zIndex = '2147483647';
    t.pointerEvents = 'none';
    t.whiteSpace = 'nowrap';
    tag.textContent = label;
    document.body.appendChild(tag);
  }

  const padX = Math.min(Math.max(r.width * 0.6, 150), 420);
  const padY = Math.min(Math.max(r.height * 0.9, 130), 320);
  let w = r.width + padX * 2;
  let h = r.height + padY * 2;

  // Never crop the callout itself: the cap must fit element + box + label.
  const fitW = r.width + pad * 2 + 24;
  const fitH = r.height + pad * 2 + 48;
  const minW = 560;
  const minH = 360;
  const maxW = Math.min(Math.max(1200, fitW), vw);
  const maxH = Math.min(Math.max(760, fitH), vh);
  w = Math.min(Math.max(w, minW), maxW);
  h = Math.min(Math.max(h, minH), maxH);

  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  let x = cx - w / 2;
  let y = cy - h / 2;
  if (x < 0) x = 0;
  if (y < 0) y = 0;
  if (x + w > vw) x = vw - w;
  if (y + h > vh) y = vh - h;
  if (x < 0) { x = 0; w = Math.min(w, vw); }
  if (y < 0) { y = 0; h = Math.min(h, vh); }

  return { x: Math.round(x), y: Math.round(y), width: Math.round(w), height: Math.round(h) };
}`;

export const REMOVE_CALLOUT_SOURCE = `() => { document.querySelectorAll('[data-help-callout]').forEach(function (n) { n.remove(); }); return true; }`;
