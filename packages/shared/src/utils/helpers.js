"use strict";
// Utility helper functions
Object.defineProperty(exports, "__esModule", { value: true });
exports.truncate = exports.sanitizeString = exports.random = exports.clamp = exports.deepMerge = exports.isObject = exports.isEmpty = exports.omit = exports.pick = exports.retry = exports.throttle = exports.debounce = exports.sleep = exports.formatPercentage = exports.formatCurrency = exports.formatBytes = exports.formatDuration = exports.formatTime = exports.formatDate = exports.generateId = void 0;
const uuid_1 = require("uuid");
function generateId() {
    return (0, uuid_1.v4)();
}
exports.generateId = generateId;
function formatDate(date, format = 'medium') {
    const options = {
        short: { month: 'numeric', day: 'numeric', year: '2-digit' },
        medium: { month: 'short', day: 'numeric', year: 'numeric' },
        long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
    }[format];
    return new Intl.DateTimeFormat('en-US', options).format(date);
}
exports.formatDate = formatDate;
function formatTime(date, includeSeconds = false) {
    const options = {
        hour: 'numeric',
        minute: '2-digit',
        ...(includeSeconds && { second: '2-digit' })
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
}
exports.formatTime = formatTime;
function formatDuration(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0)
        return `${days}d ${hours % 24}h`;
    if (hours > 0)
        return `${hours}h ${minutes % 60}m`;
    if (minutes > 0)
        return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
}
exports.formatDuration = formatDuration;
function formatBytes(bytes) {
    if (bytes === 0)
        return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
exports.formatBytes = formatBytes;
function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency
    }).format(amount);
}
exports.formatCurrency = formatCurrency;
function formatPercentage(value, decimals = 1) {
    return `${(value * 100).toFixed(decimals)}%`;
}
exports.formatPercentage = formatPercentage;
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
exports.sleep = sleep;
function debounce(func, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}
exports.debounce = debounce;
function throttle(func, limit) {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
exports.throttle = throttle;
function retry(fn, maxAttempts, delay = 1000) {
    return new Promise((resolve, reject) => {
        let attempt = 0;
        const executeAttempt = async () => {
            try {
                const result = await fn();
                resolve(result);
            }
            catch (error) {
                attempt++;
                if (attempt >= maxAttempts) {
                    reject(error);
                }
                else {
                    setTimeout(executeAttempt, delay * attempt);
                }
            }
        };
        executeAttempt();
    });
}
exports.retry = retry;
function pick(obj, keys) {
    const result = {};
    keys.forEach(key => {
        if (key in obj) {
            result[key] = obj[key];
        }
    });
    return result;
}
exports.pick = pick;
function omit(obj, keys) {
    const result = { ...obj };
    keys.forEach(key => {
        delete result[key];
    });
    return result;
}
exports.omit = omit;
function isEmpty(value) {
    if (value == null)
        return true;
    if (typeof value === 'string' || Array.isArray(value))
        return value.length === 0;
    if (typeof value === 'object')
        return Object.keys(value).length === 0;
    return false;
}
exports.isEmpty = isEmpty;
function isObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}
exports.isObject = isObject;
function deepMerge(target, source) {
    const result = { ...target };
    for (const key in source) {
        if (source.hasOwnProperty(key)) {
            if (isObject(result[key]) && isObject(source[key])) {
                result[key] = deepMerge(result[key], source[key]);
            }
            else {
                result[key] = source[key];
            }
        }
    }
    return result;
}
exports.deepMerge = deepMerge;
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
exports.clamp = clamp;
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
exports.random = random;
function sanitizeString(str) {
    return str.replace(/[<>\"'/]/g, char => {
        const charMap = {
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#x2F;'
        };
        return charMap[char] || char;
    });
}
exports.sanitizeString = sanitizeString;
function truncate(str, length, suffix = '...') {
    if (str.length <= length)
        return str;
    return str.slice(0, length - suffix.length) + suffix;
}
exports.truncate = truncate;
//# sourceMappingURL=helpers.js.map