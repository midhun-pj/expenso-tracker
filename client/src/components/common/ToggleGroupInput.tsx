
import FormFieldWrapper from "@components/common/FormFieldWrapper";
import ToggleButton from "@components/common/ToggleButton";

import type { BaseInputProps, ToggleGroupField } from "@models/common.model";

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
      <div className="flex flex-wrap gap-2 ">
        {field.options.map((option) => {
          const isActive =
            value === option.value;

          return (
            <ToggleButton
              key={option.value}
              onChange={() => onChange(field.name, option.value)}
              label={option.label}
              isActive={isActive}
              isDisabled={field.disabled}
            />

          );
        })}
      </div>
    </FormFieldWrapper>
  );
}