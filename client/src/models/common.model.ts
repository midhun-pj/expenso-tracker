
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

export interface ToggleButtonProps {
  onChange: () => void;
  label: string;
  isActive: boolean;
  isDisabled?: boolean;
}

export interface FilterDropdownProps {
  filterValue: string;
  filterOptions: FieldOption[];
  defaultOption: string;
  onChange: (value: string) => void;
}

export interface AddButtonProps {
  onClick: () => void;
  label: string;
  mobileLabel: string;
  buttonClasses?: string;
}

export interface FormFieldWrapperProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  isDisabled?: boolean;
}

export interface SelectOption {
  value: number;
  label: string;
}


export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}