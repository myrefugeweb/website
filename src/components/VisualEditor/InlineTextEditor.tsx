import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  applyFormatToken,
  getTextRoleFromElement,
  sanitizeEditorHtml,
  type TextRoleMeta,
} from './editorTypography';
import './InlineTextEditor.css';

export interface InlineTextEditSession {
  element: HTMLElement;
  section: string;
  contentKey: string;
  elementId: string;
  initialValue: string;
}

interface InlineTextEditorProps {
  session: InlineTextEditSession;
  onSave: (value: string) => Promise<void>;
  onCancel: () => void;
}

export const InlineTextEditor: React.FC<InlineTextEditorProps> = ({ session, onSave, onCancel }) => {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [roleMeta, setRoleMeta] = useState<TextRoleMeta>(() => getTextRoleFromElement(session.element));
  const [toolbarPos, setToolbarPos] = useState({ top: 0, left: 0 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const originalHtmlRef = useRef(session.initialValue);

  const updateToolbarPosition = useCallback(() => {
    const rect = session.element.getBoundingClientRect();
    const toolbarHeight = toolbarRef.current?.offsetHeight ?? 48;
    const top = Math.max(8, rect.top - toolbarHeight - 10);
    const left = Math.min(Math.max(8, rect.left), window.innerWidth - 320);
    setToolbarPos({ top, left });
  }, [session.element]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      const meta = getTextRoleFromElement(session.element);
      const raw = meta.allowsHtml
        ? session.element.innerHTML
        : session.element.textContent || '';
      const value = sanitizeEditorHtml(raw, meta);
      await onSave(value);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Could not save changes.';
      setError(message);
      setSaving(false);
    }
  }, [onSave, session.element]);

  useLayoutEffect(() => {
    updateToolbarPosition();
  }, [updateToolbarPosition]);

  useEffect(() => {
    const el = session.element;
    const meta = getTextRoleFromElement(el);
    setRoleMeta(meta);

    el.setAttribute('contenteditable', 'true');
    el.setAttribute('spellcheck', 'true');
    el.classList.add('visual-editor__inline-editing');
    el.focus();

    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);

    const onScrollOrResize = () => updateToolbarPosition();
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);

    return () => {
      el.removeAttribute('contenteditable');
      el.removeAttribute('spellcheck');
      el.classList.remove('visual-editor__inline-editing');
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [session.element, updateToolbarPosition]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        const meta = getTextRoleFromElement(session.element);
        if (meta.allowsHtml) {
          session.element.innerHTML = originalHtmlRef.current;
        } else {
          session.element.textContent = originalHtmlRef.current;
        }
        onCancel();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        void handleSave();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [handleSave, onCancel, session.element]);

  const toolbar = (
    <div
      ref={toolbarRef}
      className="inline-text-editor"
      style={{ top: toolbarPos.top, left: toolbarPos.left }}
      role="toolbar"
      aria-label="Text formatting"
      onMouseDown={(e) => e.preventDefault()}
    >
      <div className="inline-text-editor__role">
        <span className={`inline-text-editor__badge inline-text-editor__badge--${roleMeta.role}`}>
          {roleMeta.label}
        </span>
        <span className="inline-text-editor__hint">{roleMeta.hint}</span>
      </div>

      {roleMeta.tokens.length > 0 && (
        <div className="inline-text-editor__tokens">
          {roleMeta.tokens.map((token) => (
            <button
              key={token.id}
              type="button"
              className="inline-text-editor__token"
              title={`Apply ${token.label}`}
              onClick={() => applyFormatToken(token)}
            >
              {token.label}
            </button>
          ))}
        </div>
      )}

      <div className="inline-text-editor__actions">
        <button
          type="button"
          className="inline-text-editor__btn inline-text-editor__btn--ghost"
          onClick={() => {
            const meta = getTextRoleFromElement(session.element);
            if (meta.allowsHtml) {
              session.element.innerHTML = originalHtmlRef.current;
            } else {
              session.element.textContent = originalHtmlRef.current;
            }
            onCancel();
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          className="inline-text-editor__btn inline-text-editor__btn--primary"
          onClick={() => void handleSave()}
          disabled={saving}
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>

      {error && <p className="inline-text-editor__error">{error}</p>}
    </div>
  );

  return createPortal(toolbar, document.body);
};
