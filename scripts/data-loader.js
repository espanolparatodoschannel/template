import { CONFIG } from './config.js';

/**
 * Cache simple en memoria para evitar fetch repetidos
 */
const dataCache = new Map();

/**
 * Valida la estructura del JSON de historia
 * @param {Object} data 
 * @returns {boolean}
 * @throws {Error} Si la estructura es inválida
 */
function validateStoryData(data) {
    const required = [
        'meta',
        'titulo',
        'conectores_logicos',
        'verbos',
        'adjetivos',
        'sustantivos_clave',
        'expresiones_idiomaticas',
        'funciones_comunicativas',
        'palabras_clave'
    ];

    const missing = required.filter(field => !(field in data));

    if (missing.length > 0) {
        throw new Error(`Invalid JSON: Missing fields: ${missing.join(', ')}`);
    }

    // Validar que las listas sean arrays
    const listFields = required.filter(f => f !== 'meta' && f !== 'titulo');
    listFields.forEach(field => {
        if (!Array.isArray(data[field])) {
            throw new Error(`Invalid JSON: '${field}' must be an array`);
        }
    });

    return true;
}

export const DataLoader = {
    /**
     * Carga la configuración de idiomas
     */
    async loadLanguagesConfig() {
        if (dataCache.has('languages-config')) {
            return dataCache.get('languages-config');
        }

        try {
            const response = await fetch(CONFIG.PATHS.LANGUAGES_CONFIG);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            dataCache.set('languages-config', data);
            return data;
        } catch (error) {
            console.error('Error loading language config:', error);
            throw error;
        }
    },

    /**
     * Carga los datos de una historia para un idioma específico
     * @param {string} langCode 
     */
    async loadStoryData(langCode) {
        if (dataCache.has(langCode)) {
            return dataCache.get(langCode);
        }

        try {
            const path = `${CONFIG.PATHS.DATA_DIR}${langCode}.json`;
            const response = await fetch(path);

            if (!response.ok) {
                throw new Error(`No se pudo cargar el archivo para: ${langCode} (${response.status})`);
            }

            const data = await response.json();
            validateStoryData(data);

            dataCache.set(langCode, data);
            return data;

        } catch (error) {
            console.error(`Error loading story data for ${langCode}:`, error);
            throw error;
        }
    },

    /**
     * Limpia el cache (útil si se implementara recarga forzada)
     */
    clearCache() {
        dataCache.clear();
    }
};
