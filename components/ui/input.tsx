import { forwardRef, useId, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, icon, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-2 block text-sm font-semibold tracking-[0.01em] text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              block min-h-[48px] w-full rounded-2xl border bg-white/95 px-4 py-3 text-slate-900 shadow-[0_8px_24px_rgba(15,23,42,0.05)] outline-none transition-all duration-200
              placeholder:text-slate-400
              focus:-translate-y-px focus:border-blue-500 focus:ring-4 focus:ring-blue-100
              dark:bg-slate-800/95 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-900/30
              disabled:cursor-not-allowed disabled:opacity-50
              ${icon ? "pl-11" : ""}
              ${error ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "border-slate-200 dark:border-slate-700"}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", label, error, id, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="mb-2 block text-sm font-semibold tracking-[0.01em] text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`
            block min-h-[120px] w-full rounded-2xl border bg-white/95 px-4 py-3 text-slate-900 shadow-[0_8px_24px_rgba(15,23,42,0.05)] outline-none transition-all duration-200
            placeholder:text-slate-400
            focus:-translate-y-px focus:border-blue-500 focus:ring-4 focus:ring-blue-100
            dark:bg-slate-800/95 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-900/30
            disabled:cursor-not-allowed disabled:opacity-50
            ${error ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "border-slate-200 dark:border-slate-700"}
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", label, error, options, placeholder, id, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id || generatedId;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="mb-2 block text-sm font-semibold tracking-[0.01em] text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`
            block min-h-[48px] w-full rounded-2xl border bg-white/95 px-4 py-3 text-slate-900 shadow-[0_8px_24px_rgba(15,23,42,0.05)] outline-none transition-all duration-200
            focus:-translate-y-px focus:border-blue-500 focus:ring-4 focus:ring-blue-100
            dark:bg-slate-800/95 dark:text-white
            disabled:cursor-not-allowed disabled:opacity-50
            ${error ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "border-slate-200 dark:border-slate-700"}
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
