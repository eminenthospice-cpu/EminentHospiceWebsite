type Props = {
  /** Stable id key used to build the deep-link anchor (e.g. "whenConsider" → id="q-whenConsider"). */
  itemKey: string;
  question: string;
  answer: string;
};

/**
 * A single FAQ Q&A rendered as a native <details>/<summary> disclosure.
 * Browsers auto-open the matching <details> when the URL hash matches its id,
 * giving us deep-linkable questions (/faq#q-whenConsider) for free with zero JS.
 *
 * Keyboard a11y is provided by the browser — Tab focuses the summary, Enter/Space
 * toggles open. We add focus-visible styling but no tabIndex.
 */
export function FaqItem({ itemKey, question, answer }: Props) {
  return (
    <details
      id={`q-${itemKey}`}
      className="group bg-white rounded-card shadow-card border border-neutral-200 open:border-primary-300 transition-colors duration-ui"
    >
      <summary
        className="flex items-start justify-between gap-3 cursor-pointer list-none px-5 py-4 min-h-[44px] rounded-card text-text-primary font-semibold leading-snug hover:text-primary-700 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
      >
        <span>{question}</span>
        <span
          aria-hidden
          className="flex-shrink-0 mt-1 inline-block w-3 h-3 border-r-2 border-b-2 border-text-muted -rotate-45 group-open:rotate-45 transition-transform duration-ui"
        />
      </summary>
      <div className="px-5 pb-5 pt-1 text-text-secondary leading-relaxed border-t border-neutral-100">
        <p>{answer}</p>
      </div>
    </details>
  );
}
