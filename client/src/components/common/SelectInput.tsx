import FormFieldWrapper from "./FormFieldWrapper";

import type {
  BaseInputProps,
  SelectField,
} from "../../models/common.model";

interface Props extends BaseInputProps {
  field: SelectField;
}

export default function SelectInput({
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
      <select
        value={String(value ?? "")}
        disabled={field.disabled}
        onChange={(e) =>
          onChange(field.name, e.target.value)
        }
        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
      >
        <option value="">
          Select {field.label}
        </option>

        {field.options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </FormFieldWrapper>
  );
}