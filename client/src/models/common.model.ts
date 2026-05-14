
export type FieldType =
  | "text"
  | "number"
  | "date"
  | "textarea"
  | "select"
  | "toggle-group";

export interface FieldOption {
  label: string;
  value: string | number;
}

export interface BaseField {
  name: string;
  label: string;
  type: FieldType;

  placeholder?: string;
  disabled?: boolean;

  defaultValue?: unknown;

  validation?: ValidationRules;
}

export interface TextField extends BaseField {
  type: "text" | "number" | "date";
}

export interface TextAreaField extends BaseField {
  type: "textarea";
}

export interface SelectField extends BaseField {
  type: "select";
  options: FieldOption[];
}

export interface ToggleGroupField extends BaseField {
  type: "toggle-group";
  options: FieldOption[];
}

export type FormField =
  | TextField
  | TextAreaField
  | SelectField
  | ToggleGroupField;

export type FormValues = Record<string, unknown>;

export type FormErrors = Record<string, string>;

export interface BaseInputProps {
  field: FormField;
  value: unknown;
  error?: string;

  onChange: (
    name: string,
    value: unknown
  ) => void;
}

export interface ValidationRules {
  required?: boolean;

  min?: number;
  max?: number;

  minLength?: number;
  maxLength?: number;

  pattern?: RegExp;

  custom?: (
    value: unknown,
    values: FormValues
  ) => string | null;
}