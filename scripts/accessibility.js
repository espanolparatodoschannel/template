/**
 * Módulo de Accesibilidad
 */
export const Accessibility = {
    /**
     * Anuncia mensajes a screen readers usando aria-live
     * @param {string} message 
     * @param {string} [elementId='content'] 
     */
    announce(message, elementId = 'content') {
        const element = document.getElementById(elementId);
        if (element) {
            // Pequeño hack para forzar re-anuncio si el mensaje es el mismo
            element.setAttribute('aria-live', 'off');
            void element.offsetWidth; // Trigger reflow
            element.setAttribute('aria-live', 'polite');
            // Nota: En una app real compleja, quizá queramos una región específica para anuncios
        }
    },

    /**
     * Mueve el foco a un elemento
     * @param {string|HTMLElement} target 
     */
    setFocus(target) {
        const element = typeof target === 'string'
            ? document.querySelector(target)
            : target;

        if (element) {
            element.focus();
        }
    }
};
