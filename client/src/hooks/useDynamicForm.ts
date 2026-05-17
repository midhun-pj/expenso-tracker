import { useEffect, useState } from "react";
import type { FormErrors, FormField, FormValues } from "@models/common.model";

interface UseDynamicFormReturn {
  values: FormValues;
  errors: FormErrors;

  handleChange: (name: string, value: unknown) => void;

  validate: () => boolean;

  reset: () => void;

  setValues: React.Dispatch<React.SetStateAction<FormValues>>;
}

export function useDynamicForm(fields: FormField[], initialValues: FormValues = {}): UseDynamicFormReturn {
  const generateInitialValues = (): FormValues => {
    const values: FormValues = {};

    fields.forEach((field) => {
      values[field.name] =
        initialValues[field.name] ??
        field.defaultValue ??
        "";
    });

    return values;
  };

  const [values, setValues] = useState<FormValues>(generateInitialValues);



  const [errors, setErrors] = useState<FormErrors>({});

  // ONLY hydrate when edit data changes
  useEffect(() => {
    if (Object.keys(initialValues).length === 0) {
      return;
    }

    setValues((prev) => ({
      ...prev,
      ...initialValues,
    }));
  }, [initialValues]);

  const handleChange = (name: string, value: unknown) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    fields.forEach((field) => {
      const value = values[field.name];

      const rules = field.validation;

      if (!rules) return;

      // REQUIRED
      if (rules.required) {
        const isEmpty =
          value === "" ||
          value === undefined ||
          value === null;

        if (isEmpty) {
          newErrors[field.name] =
            `${field.label} is required`;

          return;
        }
      }

      // MIN LENGTH
      if (
        rules.minLength &&
        typeof value === "string"
      ) {
        if (value.length < rules.minLength) {
          newErrors[field.name] =
            `${field.label} must be at least ${rules.minLength} characters`;

          return;
        }
      }

      // MAX LENGTH
      if (
        rules.maxLength &&
        typeof value === "string"
      ) {
        if (value.length > rules.maxLength) {
          newErrors[field.name] =
            `${field.label} must be less than ${rules.maxLength} characters`;

          return;
        }
      }

      // MIN
      if (
        rules.min !== undefined &&
        typeof value === "number"
      ) {
        if (value < rules.min) {
          newErrors[field.name] =
            `${field.label} must be greater than ${rules.min}`;

          return;
        }
      }

      // MAX
      if (
        rules.max !== undefined &&
        typeof value === "number"
      ) {
        if (value > rules.max) {
          newErrors[field.name] =
            `${field.label} must be less than ${rules.max}`;

          return;
        }
      }

      // REGEX
      if (
        rules.pattern &&
        typeof value === "string"
      ) {
        if (!rules.pattern.test(value)) {
          newErrors[field.name] =
            `${field.label} is invalid`;

          return;
        }
      }

      // CUSTOM
      if (rules.custom) {
        const customError =
          rules.custom(value, values);

        if (customError) {
          newErrors[field.name] =
            customError;
        }
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const reset = () => {
    setValues(generateInitialValues());
    setErrors({});
  };

  return {
    values,
    errors,
    handleChange,
    validate,
    reset,
    setValues,
  };
}