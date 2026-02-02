import { CONFIG } from './config.js';

export const Storage = {
    /**
     * Guarda el idioma seleccionado
     * @param {string} langCode 
     */
    setLanguage(langCode) {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEYS.LANGUAGE, langCode);
        } catch (e) {
            console.warn('LocalStorage no disponible:', e);
        }
    },

    /**
     * Recupera el idioma guardado
     * @returns {string|null}
     */
    getLanguage() {
        try {
            return localStorage.getItem(CONFIG.STORAGE_KEYS.LANGUAGE);
        } catch (e) {
            return null;
        }
    },

    /**
     * Guarda el estado de un acordeón
     * @param {string} id - ID del acordeón
     * @param {boolean} isOpen 
     */
    setAccordionState(id, isOpen) {
        try {
            const current = this.getAccordionStates();
            if (isOpen) {
                current.add(id);
            } else {
                current.delete(id);
            }
            localStorage.setItem(CONFIG.STORAGE_KEYS.ACCORDIONS, JSON.stringify([...current]));
        } catch (e) {
            console.warn('LocalStorage no disponible:', e);
        }
    },

    /**
     * Recupera los estados de los acordeones
     * @returns {Set<string>} Set de IDs abiertos
     */
    getAccordionStates() {
        try {
            const data = localStorage.getItem(CONFIG.STORAGE_KEYS.ACCORDIONS);
            return data ? new Set(JSON.parse(data)) : new Set();
        } catch (e) {
            return new Set();
        }
    }
};
