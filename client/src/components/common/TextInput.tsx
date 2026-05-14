import FormFieldWrapper from "./FormFieldWrapper";

import type {
  BaseInputProps,
  TextField,
} from "../../models/common.model";

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
          const val =
            field.type === "number"
              ? Number(e.target.value)
              : e.target.value;

          onChange(field.name, val);
        }}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
      />
    </FormFieldWrapper>
  );
}