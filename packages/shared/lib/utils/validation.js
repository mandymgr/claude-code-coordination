"use strict";
// Validation utilities
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
exports.validateEmail = validateEmail;
exports.validatePassword = validatePassword;
exports.validateURL = validateURL;
exports.validateUUID = validateUUID;
exports.validateRequired = validateRequired;
exports.validateLength = validateLength;
exports.validateEnum = validateEnum;
exports.validateObject = validateObject;
class ValidationError extends Error {
    constructor(message, field, code) {
        super(message);
        this.field = field;
        this.code = code;
        this.name = 'ValidationError';
    }
}
exports.ValidationError = ValidationError;
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function validatePassword(password) {
    const errors = [];
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
function validateURL(url) {
    try {
        new URL(url);
        return true;
    }
    catch {
        return false;
    }
}
function validateUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}
function validateRequired(value, fieldName) {
    const errors = [];
    if (value === null || value === undefined || value === '') {
        errors.push(new ValidationError(`${fieldName} is required`, fieldName, 'REQUIRED'));
    }
    return {
        isValid: errors.length === 0,
        errors
    };
}
function validateLength(value, min, max, fieldName) {
    const errors = [];
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
function validateEnum(value, enumObject, fieldName) {
    const errors = [];
    const validValues = Object.values(enumObject);
    if (!validValues.includes(value)) {
        errors.push(new ValidationError(`${fieldName} must be one of: ${validValues.join(', ')}`, fieldName, 'INVALID_ENUM'));
    }
    return {
        isValid: errors.length === 0,
        errors
    };
}
function validateObject(obj, schema) {
    const errors = [];
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
//# sourceMappingURL=validation.js.map