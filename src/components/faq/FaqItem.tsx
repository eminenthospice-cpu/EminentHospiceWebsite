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
 * Editorial polish: card-paper aesthetic, animated chevron, oversized question
 * type, accent-warm divider when open. Keyboard a11y is provided by the browser —
 * Tab focuses the summary, Enter/Space toggles open.
 */
export function FaqItem({ itemKey, question, answer }: Props) {
  return (
    <details
      id={`q-${itemKey}`}
      className="group bg-surface-paper rounded-card border border-neutral-200
        open:border-accent-warm-200 open:shadow-paper transition-all duration-base ease-editorial"
    >
      <summary
        className="flex items-start justify-between gap-4 cursor-pointer list-none px-5 py-5 min-h-[44px]
          rounded-card font-heading text-lg text-text-primary font-medium leading-snug
          hover:text-primary-700 transition-colors duration-fast
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
          focus-visible:ring-offset-surface-paper"
      >
        <span className="flex-1">{question}</span>
        <span
          aria-hidden="true"
          className="flex-shrink-0 mt-2 inline-flex h-2.5 w-2.5 -rotate-45 border-r-2 border-b-2 border-primary-500
            transition-transform duration-base ease-editorial group-open:rotate-45 group-open:translate-y-[-2px]"
        />
      </summary>
      <div className="px-5 pb-6 pt-2 text-text-secondary font-prose leading-relaxed
        border-t border-accent-warm-100 mx-5 -mt-1">
        <p className="pt-4">{answer}</p>
      </div>
    </details>
  );
}
