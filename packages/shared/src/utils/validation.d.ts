export declare class ValidationError extends Error {
    field?: string | undefined;
    code?: string | undefined;
    constructor(message: string, field?: string | undefined, code?: string | undefined);
}
export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
}
export declare function validateEmail(email: string): boolean;
export declare function validatePassword(password: string): ValidationResult;
export declare function validateURL(url: string): boolean;
export declare function validateUUID(uuid: string): boolean;
export declare function validateRequired(value: any, fieldName: string): ValidationResult;
export declare function validateLength(value: string, min: number, max: number, fieldName: string): ValidationResult;
export declare function validateEnum<T>(value: any, enumObject: Record<string, T>, fieldName: string): ValidationResult;
export declare function validateObject(obj: any, schema: Record<string, (value: any) => ValidationResult>): ValidationResult;
