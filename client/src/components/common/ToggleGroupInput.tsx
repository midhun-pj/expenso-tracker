
import FormFieldWrapper from "./FormFieldWrapper";

import type {
  BaseInputProps,
  ToggleGroupField,
} from "../../models/common.model";
interface Props extends BaseInputProps {
  field: ToggleGroupField;
}

export default function ToggleGroupInput({
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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {field.options.map((option) => {
          const isActive =
            value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                onChange(
                  field.name,
                  option.value
                )
              }
              className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                isActive
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </FormFieldWrapper>
  );
}