import type { UseFormRegister, FieldValues, Path } from 'react-hook-form';

type Props<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  hint?: string;
  errorMessage?: string;
  register: UseFormRegister<T>;
};

export function FormTextarea<T extends FieldValues>({
  name,
  label,
  placeholder,
  rows = 5,
  required,
  hint,
  errorMessage,
  register,
}: Props<T>) {
  const id = `f-${String(name)}`;
  const errorId = `${id}-error`;
  const hintId = hint ? `${id}-hint` : undefined;
  const describedBy = [hintId, errorMessage ? errorId : undefined].filter(Boolean).join(' ') || undefined;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-text-primary mb-1.5">
        {label}
        {required ? <span aria-hidden="true" className="text-error ml-0.5">*</span> : null}
      </label>
      <textarea
        id={id}
        rows={rows}
        placeholder={placeholder}
        aria-required={required || undefined}
        aria-invalid={errorMessage ? true : undefined}
        aria-describedby={describedBy}
        className={`block w-full px-3 py-2.5 rounded-btn border bg-white text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 transition-colors duration-ui ${
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
