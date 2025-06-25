export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'date' | 'number';
  placeholder?: string;
  required?: boolean;
  options?: SelectOption[];
  validation?: any;
}

export interface FormError {
  field: string;
  message: string;
}