import type { FormEvent } from "react";

import { useDynamicForm } from "../../hooks/useDynamicForm";
import FieldRenderer from "./FieldRenderer";

import type {
  FormField,
  FormValues,
} from "../../models/common.model";

interface Props {
  fields: FormField[];

  initialValues?: FormValues;

  submitLabel?: string;

  onSubmit: (values: FormValues) => void;
}

export default function DynamicForm({ fields, initialValues = {}, submitLabel = "Submit", onSubmit }: Props) {
  const { values, errors, handleChange, validate, } = useDynamicForm(fields, initialValues);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid = validate();

    if (!isValid) return;

    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4"    >
      {fields.map((field) => (
        <FieldRenderer
          key={field.name}
          field={field}
          value={values[field.name]}
          error={errors[field.name]}
          onChange={handleChange}
        />
      ))}

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-lg"
      >
        {submitLabel}
      </button>
    </form>
  );
}