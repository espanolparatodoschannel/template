/**
 * Utilidades generales
 */

/**
 * Función de debounce para optimizar eventos frecuentes
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} Función debounced
 */
export function debounce(func, wait) {
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

/**
 * Sanitiza strings para insertar en HTML de forma segura
 * (Aunque se recomienda usar textContent, esto es útil para innerHTML si fuera estrictamente necesario)
 * @param {string} str 
 * @returns {string} String sanitizado
 */
export function escapeHTML(str) {
    if (!str) return '';
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/**
 * Espera un tiempo determinado (útil para animaciones secuenciales)
 * @param {number} ms 
 * @returns {Promise}
 */
export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Identifica si el dispositivo prefiere animación reducida
 * @returns {boolean}
 */
export function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
