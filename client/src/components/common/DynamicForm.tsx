import type { FormEvent } from "react";

import { useDynamicForm } from "@hooks/useDynamicForm";

import FieldRenderer from "./FieldRenderer";

import type { FormField, FormValues } from "@models/common.model";

interface Props {
  fields: | FormField[] | ((values: FormValues) => FormField[]);

  initialValues?: FormValues;

  submitLabel?: string;
  resetOnSubmit?: boolean;

  onSubmit: (values: FormValues) => void;
}

export default function DynamicForm({ fields, initialValues = {}, submitLabel = "Submit", resetOnSubmit = true, onSubmit }: Props) {

  const initialResolvedFields: FormField[] = typeof fields === "function" ? fields(initialValues) : fields;

  const { values, errors, handleChange, validate, reset } = useDynamicForm(initialResolvedFields, initialValues);


  const resolvedFields: FormField[] =
    typeof fields === "function"
      ? fields(values)
      : fields;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid = validate();

    if (!isValid) return;

    onSubmit(values);

    if (resetOnSubmit) {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4"    >
      {resolvedFields.map((field) => (
        <FieldRenderer
          key={field.name}
          field={field}
          value={values[field.name]}
          error={errors[field.name]}
          onChange={handleChange}
        />
      ))}

      <button type="submit" className="w-full bg-primary bg-primary-hover text-white py-2 rounded-lg">
        {submitLabel}
      </button>
    </form>
  );
}