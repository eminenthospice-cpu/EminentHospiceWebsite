import type { UseFormRegister, FieldValues, Path } from 'react-hook-form';

type Props<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'date';
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  errorMessage?: string;
  register: UseFormRegister<T>;
  hidden?: boolean;
};

export function FormField<T extends FieldValues>({
  name,
  label,
  type = 'text',
  autoComplete,
  placeholder,
  required,
  hint,
  errorMessage,
  register,
  hidden,
}: Props<T>) {
  const id = `f-${String(name)}`;
  const errorId = `${id}-error`;
  const hintId = hint ? `${id}-hint` : undefined;
  const describedBy = [hintId, errorMessage ? errorId : undefined].filter(Boolean).join(' ') || undefined;

  if (hidden) {
    return (
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', top: 'auto' }}>
        <label htmlFor={id}>{label}</label>
        <input id={id} type="text" tabIndex={-1} autoComplete="off" {...register(name)} />
      </div>
    );
  }

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-text-primary mb-1.5">
        {label}
        {required ? <span aria-hidden="true" className="text-error ml-0.5">*</span> : null}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-required={required || undefined}
        aria-invalid={errorMessage ? true : undefined}
        aria-describedby={describedBy}
        className={`block w-full min-h-[44px] px-3 py-2.5 rounded-btn border bg-white text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 transition-colors duration-ui ${
          errorMessage ? 'border-error' : 'border-neutral-300 hover:border-neutral-400'
        }`}
        {...register(name)}
      />
      {hint ? (
        <p id={hintId} className="mt-1 text-xs text-text-muted">
          {hint}
        </p>
      ) : null}
      {errorMessage ? (
        <p id={errorId} role="alert" className="mt-1 text-sm text-error">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
