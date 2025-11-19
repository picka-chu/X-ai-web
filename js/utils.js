/**
 * X AI Telegram Mini App - Utility Functions
 * Helper functions for common tasks
 */

// ===== Toast Notifications =====
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, duration);
}

// ===== Loading Overlay =====
function showLoading() {
    document.getElementById('loading-overlay').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loading-overlay').classList.add('hidden');
}

// ===== Format Date =====
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function formatTime(dateString) {
    const date = new Date(dateString);
    const options = { hour: '2-digit', minute: '2-digit' };
    return date.toLocaleTimeString('en-US', options);
}

function formatDateTime(dateString) {
    return `${formatDate(dateString)} at ${formatTime(dateString)}`;
}

// ===== Format Currency =====
function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount);
}

// ===== Copy to Clipboard =====
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy:', err);
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
}

function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showToast('Copied to clipboard!');
    } catch (err) {
        console.error('Fallback copy failed:', err);
        showToast('Failed to copy');
    }
    
    document.body.removeChild(textArea);
}

// ===== Debounce Function =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== Throttle Function =====
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== Calculate Days Remaining =====
function calculateDaysRemaining(expiryDate) {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
}

// ===== Calculate Win Rate =====
function calculateWinRate(predictions) {
    if (!predictions || predictions.length === 0) return 0;
    
    const completedPredictions = predictions.filter(p => p.status === 'win' || p.status === 'loss');
    if (completedPredictions.length === 0) return 0;
    
    const wins = completedPredictions.filter(p => p.status === 'win').length;
    return Math.round((wins / completedPredictions.length) * 100);
}

// ===== Generate Unique ID =====
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ===== Validate Email =====
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ===== Get Status Badge HTML =====
function getStatusBadge(status) {
    const badges = {
        'win': '<span class="badge badge-success">WIN</span>',
        'loss': '<span class="badge badge-danger">LOSS</span>',
        'open': '<span class="badge badge-neutral">OPEN</span>',
        'pending': '<span class="badge badge-neutral">PENDING</span>',
    };
    return badges[status.toLowerCase()] || badges['pending'];
}

// ===== Local Storage Helpers =====
const storage = {
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
        }
    },
    
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error writing to localStorage:', error);
            return false;
        }
    },
    
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    },
    
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }
};

// ===== Session Storage Helpers =====
const sessionStorage = {
    get(key, defaultValue = null) {
        try {
            const item = window.sessionStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error reading from sessionStorage:', error);
            return defaultValue;
        }
    },
    
    set(key, value) {
        try {
            window.sessionStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error writing to sessionStorage:', error);
            return false;
        }
    },
    
    remove(key) {
        try {
            window.sessionStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from sessionStorage:', error);
            return false;
        }
    }
};

// ===== Export for use in other modules =====
window.utils = {
    showToast,
    showLoading,
    hideLoading,
    formatDate,
    formatTime,
    formatDateTime,
    formatCurrency,
    copyToClipboard,
    debounce,
    throttle,
    calculateDaysRemaining,
    calculateWinRate,
    generateId,
    validateEmail,
    getStatusBadge,
    storage,
    sessionStorage
};
