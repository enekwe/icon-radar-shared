"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = void 0;
exports.generateUUID = generateUUID;
exports.sleep = sleep;
exports.retry = retry;
exports.calculatePagination = calculatePagination;
exports.parsePaginationParams = parsePaginationParams;
exports.getPaginationOffset = getPaginationOffset;
exports.sanitizeString = sanitizeString;
exports.truncate = truncate;
exports.slugify = slugify;
exports.deepClone = deepClone;
exports.isEmpty = isEmpty;
exports.pick = pick;
exports.omit = omit;
exports.groupBy = groupBy;
exports.unique = unique;
exports.chunk = chunk;
exports.formatNumber = formatNumber;
exports.formatCurrency = formatCurrency;
exports.formatPercentage = formatPercentage;
exports.percentageChange = percentageChange;
exports.formatDate = formatDate;
exports.parseDate = parseDate;
exports.isWithinLastHours = isWithinLastHours;
exports.isWithinLast24Hours = isWithinLast24Hours;
exports.getStartOfDay = getStartOfDay;
exports.getEndOfDay = getEndOfDay;
exports.maskEmail = maskEmail;
exports.maskPhone = maskPhone;
exports.randomString = randomString;
exports.hashString = hashString;
exports.debounce = debounce;
exports.throttle = throttle;
exports.toQueryString = toQueryString;
exports.parseQueryString = parseQueryString;
exports.safeJSONParse = safeJSONParse;
exports.safeJSONStringify = safeJSONStringify;
exports.measureTime = measureTime;
const uuid_1 = require("uuid");
function generateUUID() {
    return (0, uuid_1.v4)();
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
async function retry(fn, options = {}) {
    const { maxAttempts = 3, initialDelay = 1000, maxDelay = 10000, factor = 2, onRetry } = options;
    let attempt = 0;
    let delay = initialDelay;
    while (true) {
        try {
            return await fn();
        }
        catch (error) {
            attempt++;
            if (attempt >= maxAttempts) {
                throw error;
            }
            if (onRetry) {
                onRetry(attempt, error);
            }
            await sleep(Math.min(delay, maxDelay));
            delay *= factor;
        }
    }
}
function calculatePagination(total, page, limit) {
    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;
    return {
        page,
        limit,
        total,
        totalPages,
        hasMore,
    };
}
function parsePaginationParams(query) {
    return {
        page: parseInt(query.page) || 1,
        limit: parseInt(query.limit) || 20,
        sort: query.sort || undefined,
        order: query.order === 'desc' ? 'desc' : 'asc',
    };
}
function getPaginationOffset(page, limit) {
    return {
        skip: (page - 1) * limit,
        take: limit,
    };
}
function sanitizeString(str) {
    return str.replace(/<[^>]*>/g, '').trim();
}
function truncate(str, maxLength, suffix = '...') {
    if (str.length <= maxLength) {
        return str;
    }
    return str.substring(0, maxLength - suffix.length) + suffix;
}
function slugify(str) {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
function isEmpty(obj) {
    if (obj === null || obj === undefined)
        return true;
    if (Array.isArray(obj))
        return obj.length === 0;
    if (typeof obj === 'object')
        return Object.keys(obj).length === 0;
    if (typeof obj === 'string')
        return obj.trim().length === 0;
    return false;
}
function pick(obj, keys) {
    const result = {};
    keys.forEach((key) => {
        if (key in obj) {
            result[key] = obj[key];
        }
    });
    return result;
}
function omit(obj, keys) {
    const result = { ...obj };
    keys.forEach((key) => {
        delete result[key];
    });
    return result;
}
function groupBy(array, key) {
    return array.reduce((result, item) => {
        const groupKey = String(item[key]);
        if (!result[groupKey]) {
            result[groupKey] = [];
        }
        result[groupKey].push(item);
        return result;
    }, {});
}
function unique(array) {
    return Array.from(new Set(array));
}
function chunk(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}
function formatNumber(num) {
    return num.toLocaleString('en-US');
}
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
}
function formatPercentage(value, decimals = 2) {
    return `${(value * 100).toFixed(decimals)}%`;
}
function percentageChange(oldValue, newValue) {
    if (oldValue === 0)
        return newValue === 0 ? 0 : 100;
    return ((newValue - oldValue) / oldValue) * 100;
}
function formatDate(date) {
    return date.toISOString();
}
function parseDate(dateString) {
    return new Date(dateString);
}
function isWithinLastHours(date, hours) {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    return diff <= hours * 60 * 60 * 1000;
}
function isWithinLast24Hours(date) {
    return isWithinLastHours(date, 24);
}
function getStartOfDay(date) {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
}
function getEndOfDay(date) {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
}
function maskEmail(email) {
    const [local, domain] = email.split('@');
    if (local.length <= 2) {
        return `${local[0]}***@${domain}`;
    }
    return `${local.substring(0, 2)}***@${domain}`;
}
function maskPhone(phone) {
    if (phone.length < 4)
        return '***';
    return `***${phone.slice(-4)}`;
}
function randomString(length, charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
}
function hashString(str) {
    let hash = 2166136261;
    for (let i = 0; i < str.length; i++) {
        hash ^= str.charCodeAt(i);
        hash *= 16777619;
    }
    return hash >>> 0;
}
function debounce(func, wait) {
    let timeout = null;
    return (...args) => {
        if (timeout)
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
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}
function toQueryString(obj) {
    const params = new URLSearchParams();
    Object.entries(obj).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            params.append(key, String(value));
        }
    });
    return params.toString();
}
function parseQueryString(queryString) {
    const params = new URLSearchParams(queryString);
    const result = {};
    params.forEach((value, key) => {
        result[key] = value;
    });
    return result;
}
function safeJSONParse(str) {
    try {
        return JSON.parse(str);
    }
    catch {
        return null;
    }
}
function safeJSONStringify(obj) {
    try {
        return JSON.stringify(obj);
    }
    catch {
        return '';
    }
}
async function measureTime(fn, label) {
    const start = Date.now();
    const result = await fn();
    const duration = Date.now() - start;
    if (label) {
        console.log(`[${label}] Execution time: ${duration}ms`);
    }
    return { result, duration };
}
exports.delay = sleep;
