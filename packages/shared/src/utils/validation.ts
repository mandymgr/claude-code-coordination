// Validation utilities

export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): ValidationResult {
  const errors: ValidationError[] = [];
  
  if (password.length < 8) {
    errors.push(new ValidationError('Password must be at least 8 characters long', 'password', 'MIN_LENGTH'));
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push(new ValidationError('Password must contain at least one uppercase letter', 'password', 'UPPERCASE_REQUIRED'));
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push(new ValidationError('Password must contain at least one lowercase letter', 'password', 'LOWERCASE_REQUIRED'));
  }
  
  if (!/\d/.test(password)) {
    errors.push(new ValidationError('Password must contain at least one number', 'password', 'NUMBER_REQUIRED'));
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push(new ValidationError('Password must contain at least one special character', 'password', 'SPECIAL_CHAR_REQUIRED'));
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function validateUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export function validateRequired(value: any, fieldName: string): ValidationResult {
  const errors: ValidationError[] = [];
  
  if (value === null || value === undefined || value === '') {
    errors.push(new ValidationError(`${fieldName} is required`, fieldName, 'REQUIRED'));
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateLength(
  value: string,
  min: number,
  max: number,
  fieldName: string
): ValidationResult {
  const errors: ValidationError[] = [];
  
  if (value.length < min) {
    errors.push(new ValidationError(`${fieldName} must be at least ${min} characters long`, fieldName, 'MIN_LENGTH'));
  }
  
  if (value.length > max) {
    errors.push(new ValidationError(`${fieldName} must be no more than ${max} characters long`, fieldName, 'MAX_LENGTH'));
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateEnum<T>(
  value: any,
  enumObject: Record<string, T>,
  fieldName: string
): ValidationResult {
  const errors: ValidationError[] = [];
  const validValues = Object.values(enumObject);
  
  if (!validValues.includes(value)) {
    errors.push(new ValidationError(
      `${fieldName} must be one of: ${validValues.join(', ')}`,
      fieldName,
      'INVALID_ENUM'
    ));
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateObject(obj: any, schema: Record<string, (value: any) => ValidationResult>): ValidationResult {
  const errors: ValidationError[] = [];
  
  for (const [field, validator] of Object.entries(schema)) {
    const result = validator(obj[field]);
    if (!result.isValid) {
      errors.push(...result.errors);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}