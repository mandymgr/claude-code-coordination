"use strict";
// Utility helper functions
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateId = generateId;
exports.formatDate = formatDate;
exports.formatTime = formatTime;
exports.formatDuration = formatDuration;
exports.formatBytes = formatBytes;
exports.formatCurrency = formatCurrency;
exports.formatPercentage = formatPercentage;
exports.sleep = sleep;
exports.debounce = debounce;
exports.throttle = throttle;
exports.retry = retry;
exports.pick = pick;
exports.omit = omit;
exports.isEmpty = isEmpty;
exports.isObject = isObject;
exports.deepMerge = deepMerge;
exports.clamp = clamp;
exports.random = random;
exports.sanitizeString = sanitizeString;
exports.truncate = truncate;
const uuid_1 = require("uuid");
function generateId() {
    return (0, uuid_1.v4)();
}
function formatDate(date, format = 'medium') {
    const options = {
        short: { month: 'numeric', day: 'numeric', year: '2-digit' },
        medium: { month: 'short', day: 'numeric', year: 'numeric' },
        long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
    }[format];
    return new Intl.DateTimeFormat('en-US', options).format(date);
}
function formatTime(date, includeSeconds = false) {
    const options = {
        hour: 'numeric',
        minute: '2-digit',
        ...(includeSeconds && { second: '2-digit' })
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
}
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
function formatBytes(bytes) {
    if (bytes === 0)
        return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency
    }).format(amount);
}
function formatPercentage(value, decimals = 1) {
    return `${(value * 100).toFixed(decimals)}%`;
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function debounce(func, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}
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
function pick(obj, keys) {
    const result = {};
    keys.forEach(key => {
        if (key in obj) {
            result[key] = obj[key];
        }
    });
    return result;
}
function omit(obj, keys) {
    const result = { ...obj };
    keys.forEach(key => {
        delete result[key];
    });
    return result;
}
function isEmpty(value) {
    if (value == null)
        return true;
    if (typeof value === 'string' || Array.isArray(value))
        return value.length === 0;
    if (typeof value === 'object')
        return Object.keys(value).length === 0;
    return false;
}
function isObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}
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
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
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
function truncate(str, length, suffix = '...') {
    if (str.length <= length)
        return str;
    return str.slice(0, length - suffix.length) + suffix;
}
//# sourceMappingURL=helpers.js.map