import FormFieldWrapper from "@components/common/FormFieldWrapper";

import type { BaseInputProps, TextField } from "@models/common.model";

interface Props extends BaseInputProps {
  field: TextField;
}

export default function TextInput({
  field,
  value,
  error,
  onChange,
}: Props) {
  return (
    <FormFieldWrapper
      label={field.label}
      required={field.validation?.required}
      error={error}
    >
      <input
        type={field.type}
        value={String(value ?? "")}
        placeholder={field.placeholder}
        disabled={field.disabled}
        onChange={(e) => {
          const raw = e.target.value;

          if (field.type === "number") {
            onChange(field.name, raw); // keep string
          } else {
            onChange(field.name, raw);
          }
        }}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
      />
    </FormFieldWrapper>
  );
}