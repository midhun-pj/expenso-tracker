import type { FormFieldWrapperProps } from "@models/common.model";

export default function FormFieldWrapper({
  label,
  required,
  error,
  children,
}: FormFieldWrapperProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}

        {required && (
          <span className="text-red-500 ml-1">
            *
          </span>
        )}
      </label>

      {children}

      {error && (
        <p className="text-red-500 text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  );
}