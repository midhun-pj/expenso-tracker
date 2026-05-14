import React from "react";

interface Props {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

export default function FormFieldWrapper({
  label,
  required,
  error,
  children,
}: Props) {
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