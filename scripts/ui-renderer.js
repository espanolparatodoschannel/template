import { CONFIG, UI_LABELS, SECTION_LABELS, SECTION_ICONS, AUDIO_TOOLTIPS } from './config.js';
import { escapeHTML, delay } from './utils.js';
import { Storage } from './storage.js';

export const UIRenderer = {
    // ... (rest of the file until createSection)

    createSection(key, esData, targetData, index, isBilingual, langCode) {
        const sectionId = `section-${key}`;

        // Labels para el título de la sección
        const esLabel = SECTION_LABELS['es'][key] || key.replace(/_/g, ' ').toUpperCase();
        let targetLabel = '';

        if (isBilingual) {
            const labels = SECTION_LABELS[langCode];
            targetLabel = labels ? (labels[key] || '') : '';
        }

        // Icono de la sección: Lógica robusta con Fallback
        const normalizedKey = key.trim();

        // 1. Buscar icono en SECTION_ICONS importado de config.js
        let iconSVG = SECTION_ICONS[normalizedKey];

        // 2. Fallback: Buscar coincidencia parcial si no es exacto
        if (!iconSVG) {
            const fuzzyKey = Object.keys(SECTION_ICONS).find(k => k.includes(normalizedKey) || normalizedKey.includes(k));
            if (fuzzyKey) iconSVG = SECTION_ICONS[fuzzyKey];
        }

        // 3. Fallback Final: Icono genérico (Círculo Plus)
        if (!iconSVG) {
            console.warn(`Missing icon for key: "${normalizedKey}"`);
            iconSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>';
        }

        const sectionEl = document.createElement('section');
        sectionEl.className = 'analysis-section fade-in';
        sectionEl.style.animationDelay = `${index * 100}ms`;

        // Contenido interno (depende de si es array de strings u objetos)
        let innerContent = '';

        if (typeof esData === 'string') {
            // Caso: Campo de texto simple (como narrativa)
            const targetText = (typeof targetData === 'string') ? targetData : esData;

            // Agregar controles de audio si es la sección de narrativa
            const audioControls = key === 'narrativa' ? `
                <div class="narrative-audio-controls">
                    <audio id="narrative-audio" src="./assets/narrativa_web.mp3" preload="metadata"></audio>
                    <div class="audio-player">
                        <button class="audio-control-btn play-pause-btn" onclick="toggleNarrativeAudio()" aria-label="Reproducir">
                            <svg class="play-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                            <svg class="pause-icon hidden" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="6" y="4" width="4" height="16"></rect>
                                <rect x="14" y="4" width="4" height="16"></rect>
                            </svg>
                        </button>
                        <button class="audio-control-btn restart-btn" onclick="restartNarrativeAudio()" aria-label="Reiniciar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="1 4 1 10 7 10"></polyline>
                                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                            </svg>
                        </button>
                        <div class="audio-progress-container">
                            <span class="audio-time current-time">0:00</span>
                            <input type="range" class="audio-progress" min="0" max="100" value="0" step="0.1" oninput="seekNarrativeAudio(this.value)">
                            <span class="audio-time total-time">0:00</span>
                        </div>
                    </div>
                </div>
            ` : '';
            innerContent = `
                ${audioControls}
                <div class="narrative-container">
                    <div class="narrative-text">
                        <p class="narrative-es">${escapeHTML(esData).replace(/\n/g, '<br>')}</p>
                        ${isBilingual && targetText !== esData ? `<p class="narrative-target">${escapeHTML(targetText).replace(/\n/g, '<br>')}</p>` : ''}
                    </div>
                </div>
            `;
        } else if (this.isStringArray(esData)) {
            innerContent = `
                <div class="keywords-container">
                    ${esData.map((word, i) => {
                const targetWord = targetData[i] || word;
                return `<span class="keyword-chip">
                            <span class="es-word">${escapeHTML(word)}</span>
                            ${isBilingual ? `<span class="target-word">(${escapeHTML(targetWord)})</span>` : ''}
                        </span>`;
            }).join('')}
                </div>
            `;
        } else if (Array.isArray(esData)) {
            innerContent = `
                <div class="items-list-accordion">
                    ${esData.map((item, i) => {
                const targetItem = targetData[i] || item;
                return this.createInnerAccordionItem(sectionId, item, targetItem, i, isBilingual);
            }).join('')}
                </div>
            `;
        }

        // Estructura de Acordeón para la Sección Entera
        sectionEl.innerHTML = `
            <div class="section-accordion-container">
                <button type="button" 
                        class="section-header-btn" 
                        aria-expanded="false" 
                        aria-controls="content-${sectionId}" 
                        data-accordion-id="${sectionId}">
                    
                    <div class="section-header-left">
                        <div class="section-titles">
                            <h2 class="section-title-es">${iconSVG ? `<span class="section-category-icon">${iconSVG}</span>` : ''}${esLabel}</h2>
                            ${isBilingual && targetLabel ? `<span class="section-title-target">${targetLabel}</span>` : ''}
                        </div>
                    </div>

                    <span class="accordion-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </span>
                </button>
                <div id="content-${sectionId}" class="section-content" hidden>
                    <div class="section-body">
                        ${innerContent}
                    </div>
                </div>
            </div>
        `;

        return sectionEl;
    },
    /**
     * Elementos del DOM cacheados (se inicializan en init)
     */
    elements: {},

    init() {
        this.elements = {
            title: document.querySelector(CONFIG.SELECTORS.MAIN_TITLE),
            content: document.querySelector(CONFIG.SELECTORS.CONTENT_CONTAINER),
            selector: document.querySelector(CONFIG.SELECTORS.LANGUAGE_SELECTOR),
            credits: document.querySelector(CONFIG.SELECTORS.CREDITS),
            loading: document.querySelector(CONFIG.SELECTORS.LOADING_INDICATOR),
            error: document.querySelector(CONFIG.SELECTORS.ERROR_CONTAINER),
            errorMsg: document.querySelector(CONFIG.SELECTORS.ERROR_MESSAGE)
        };
    },

    /**
     * Renderiza el selector de idiomas
     * @param {Object} config - Datos de configuration de idiomas
     * @param {string} currentLang - Código del idioma actual
     */
    renderLanguageSelector(config, currentLang) {
        if (!this.elements.selector) return;

        this.elements.selector.innerHTML = config.languages.map(lang => {
            const isSelected = lang.code === currentLang ? 'selected' : '';
            return `<option value="${lang.code}" ${isSelected}>
                ${lang.flag} ${lang.name}
            </option>`;
        }).join('');
    },

    /**
     * Muestra el estado de carga
     */
    showLoading() {
        this.elements.content.classList.add('hidden');
        this.elements.error.classList.add('hidden');
        this.elements.loading.classList.remove('hidden');
        this.elements.title.textContent = UI_LABELS.DEFAULT_TITLE;
        this.elements.selector.disabled = true;
    },

    /**
     * Muestra mensaje de error
     * @param {string} message 
     */
    showError(message) {
        this.elements.loading.classList.add('hidden');
        this.elements.content.classList.add('hidden');
        this.elements.error.classList.remove('hidden');
        this.elements.errorMsg.textContent = message || "Error desconocido";
        this.elements.selector.disabled = false;
    },

    /**
     * Renderiza la historia completa
     * @param {Object} data - Datos JSON de la historia
     */
    renderStory(esData, targetData) {
        // Ocultar estados previos
        this.elements.loading.classList.add('hidden');
        this.elements.error.classList.add('hidden');
        this.elements.content.classList.remove('hidden');
        this.elements.selector.disabled = false;

        const effectiveTarget = targetData || esData;
        const isBilingual = !!targetData && targetData !== esData;

        // Obtenemos el código de idioma del targetData (aunque no lo tenemos explícito en el JSON, 
        // lo ideal sería pasarlo a renderStory. Por ahora, inferimos que targetData *es* el target seleccionado en App)
        // Para simplificar, usaremos 'es' como base y buscaremos las etiquetas del target si podemos.
        // HACK: App.js debería pasar el código del idioma actual.
        // Como no lo pasamos, asumimos que estamos renderizando lo que pidió el usuario.
        // Pero necesitamos el código de idioma para buscar en SECTION_LABELS.
        // Vamos a sacar el idioma del selector del DOM.
        const currentLangCode = this.elements.selector.value || 'es';


        // 1. Meta información
        this.elements.title.style.opacity = '0';
        setTimeout(() => {
            let titleHTML = escapeHTML(esData.meta.titulo_historia || esData.titulo);
            if (isBilingual) {
                const targetTitle = escapeHTML(targetData.meta.titulo_historia || targetData.titulo);
                titleHTML += `<br><span class="foreign-title-sub">${targetTitle}</span>`;
            }
            this.elements.title.innerHTML = titleHTML;
            this.elements.title.style.opacity = '1';
        }, 200);

        if (this.elements.credits) {
            this.elements.credits.innerHTML = `
                ${esData.meta.autor ? `Autor: ${escapeHTML(esData.meta.autor)}` : ''} 
                ${esData.meta.fecha ? `| Fecha: ${escapeHTML(esData.meta.fecha)}` : ''}
            `;
        }

        // 2. Generar secciones dinámicamente
        const excludeKeys = ['meta', 'titulo'];
        const sectionsData = Object.entries(esData)
            .filter(([key]) => !excludeKeys.includes(key));

        this.elements.content.innerHTML = '';

        sectionsData.forEach(([key, esValue], index) => {
            const targetValue = effectiveTarget[key] || esValue;
            const section = this.createSection(key, esValue, targetValue, index, isBilingual, currentLangCode);
            this.elements.content.appendChild(section);
        });

        // 3. Restaurar estado de acordeones (ahora son secciones)
        this.restoreAccordionState();
    },

    createSection(key, esData, targetData, index, isBilingual, langCode) {
        const sectionId = `section-${key}`;

        // Labels para el título de la sección
        const esLabel = SECTION_LABELS['es'][key] || key.replace(/_/g, ' ').toUpperCase();
        let targetLabel = '';

        if (isBilingual) {
            const labels = SECTION_LABELS[langCode];
            targetLabel = labels ? (labels[key] || '') : '';
        }

        // Icono de la sección: Lógica robusta con Fallback
        const normalizedKey = key.trim();

        // 1. Buscar icono en SECTION_ICONS importado de config.js
        let iconSVG = SECTION_ICONS[normalizedKey];

        // 2. Fallback: Buscar coincidencia parcial si no es exacto
        if (!iconSVG) {
            const fuzzyKey = Object.keys(SECTION_ICONS).find(k => k.includes(normalizedKey) || normalizedKey.includes(k));
            if (fuzzyKey) iconSVG = SECTION_ICONS[fuzzyKey];
        }

        // 3. Fallback Final: Icono genérico (Círculo Plus)
        if (!iconSVG) {
            console.warn(`Missing icon for key: "${normalizedKey}"`);
            iconSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>';
        }

        const sectionEl = document.createElement('section');
        sectionEl.className = 'analysis-section fade-in';
        sectionEl.style.animationDelay = `${index * 100}ms`;

        // Contenido interno (depende de si es array de strings u objetos)
        let innerContent = '';

        if (typeof esData === 'string') {
            // Caso: Campo de texto simple (como narrativa)
            const targetText = (typeof targetData === 'string') ? targetData : esData;

            // Agregar controles de audio si es la sección de narrativa
            const audioControls = key === 'narrativa' ? `
                <div class="narrative-audio-controls">
                    <audio id="narrative-audio" src="./assets/narrativa_web.mp3" preload="metadata"></audio>
                    <div class="audio-player">
                        <button class="audio-control-btn play-pause-btn" onclick="toggleNarrativeAudio()" aria-label="Reproducir">
                            <svg class="play-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                            <svg class="pause-icon hidden" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="6" y="4" width="4" height="16"></rect>
                                <rect x="14" y="4" width="4" height="16"></rect>
                            </svg>
                        </button>
                        <button class="audio-control-btn restart-btn" onclick="restartNarrativeAudio()" aria-label="Reiniciar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="1 4 1 10 7 10"></polyline>
                                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                            </svg>
                        </button>
                        <div class="audio-progress-container">
                            <span class="audio-time current-time">0:00</span>
                            <input type="range" class="audio-progress" min="0" max="100" value="0" step="0.1" oninput="seekNarrativeAudio(this.value)">
                            <span class="audio-time total-time">0:00</span>
                        </div>
                    </div>
                </div>
            ` : '';
            innerContent = `
                ${audioControls}
                <div class="narrative-container">
                    <div class="narrative-text">
                        <p class="narrative-es">${escapeHTML(esData).replace(/\n/g, '<br>')}</p>
                        ${isBilingual && targetText !== esData ? `<p class="narrative-target">${escapeHTML(targetText).replace(/\n/g, '<br>')}</p>` : ''}
                    </div>
                </div>
            `;
        } else if (this.isStringArray(esData)) {
            const tooltip = AUDIO_TOOLTIPS[langCode] || AUDIO_TOOLTIPS['es'];
            innerContent = `
                <div class="keywords-container">
                    ${esData.map((word, i) => {
                const targetWord = targetData[i] || word;
                const escapedWord = escapeHTML(word).replace(/'/g, "\\'");
                return `<div class="keyword-chip audio-enabled" onclick="speakText('${escapedWord}', 'es')" title="${tooltip}" style="cursor: pointer;">
                            <span class="es-word">${escapeHTML(word)}</span>
                            ${isBilingual ? `<span class="target-word">(${escapeHTML(targetWord)})</span>` : ''}
                            <span class="audio-indicator-icon" aria-hidden="true" style="margin-left: 0;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                                </svg>
                            </span>
                        </div>`;
            }).join('')}
                </div>
            `;
        } else if (Array.isArray(esData)) {
            innerContent = `
                <div class="items-list-accordion">
                    ${esData.map((item, i) => {
                const targetItem = targetData[i] || item;
                return this.createInnerAccordionItem(sectionId, item, targetItem, i, isBilingual, langCode);
            }).join('')}
                </div>
            `;
        }

        // Estructura de Acordeón para la Sección Entera
        sectionEl.innerHTML = `
            <div class="section-accordion-container">
                <button type="button" 
                        class="section-header-btn" 
                        aria-expanded="false" 
                        aria-controls="content-${sectionId}" 
                        data-accordion-id="${sectionId}">
                    
                    <div class="section-header-left">
                        <div class="section-titles">
                            <h2 class="section-title-es">${iconSVG ? `<span class="section-category-icon">${iconSVG}</span>` : ''}${esLabel}</h2>
                            ${isBilingual && targetLabel ? `<span class="section-title-target">${targetLabel}</span>` : ''}
                        </div>
                    </div>

                    <span class="accordion-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </span>
                </button>
                <div id="content-${sectionId}" class="section-content" hidden>
                    <div class="section-body">
                        ${innerContent}
                    </div>
                </div>
            </div>
        `;

        return sectionEl;
    },

    createInnerAccordionItem(sectionId, esItem, targetItem, index, isBilingual, langCode = 'es') {
        const itemId = `${sectionId}-item-${index}`;

        const escapedTerm = escapeHTML(esItem.termino).replace(/'/g, "\\'");
        const tooltip = AUDIO_TOOLTIPS[langCode] || AUDIO_TOOLTIPS['es'];

        // Deshabilitar audio para la sección "Funciones comunicativas"
        const isAudioDisabled = sectionId.includes('funciones_comunicativas');
        const audioAttr = isAudioDisabled ?
            'class="term-es"' :
            `class="term-es audio-enabled" onclick="event.stopPropagation(); speakText('${escapedTerm}', 'es')" title="${tooltip}"`;


        return `
            <div class="item-accordion-card">
                <button type="button" 
                        class="item-header-btn" 
                        aria-expanded="false" 
                        aria-controls="content-${itemId}" 
                        data-accordion-id="${itemId}">
                    
                    <div class="item-titles">
                         <div class="term-wrapper">
                            <span ${audioAttr}>
                                ${escapeHTML(esItem.termino)}
                                ${!isAudioDisabled ? `
                                <span class="audio-indicator-icon" aria-hidden="true">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                                    </svg>
                                </span>` : ''}
                            </span>
                         </div>
                         ${isBilingual ? `<span class="term-target">${escapeHTML(targetItem.termino)}</span>` : ''}
                    </div>
                    
                    <span class="accordion-icon inner-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </span>
                </button>

                <div id="content-${itemId}" class="item-content hidden">
                    <div class="item-body">
                         <div class="content-block">
                            <div class="def-wrapper">
                                <p class="definition-es">${escapeHTML(esItem.explicacion)}</p>
                            </div>
                            ${isBilingual ? `<p class="definition-target">${escapeHTML(targetItem.explicacion)}</p>` : ''}
                        </div>

                        <div class="example-box">
                            <div class="ex-wrapper">
                                 <p class="example-es">"${escapeHTML(esItem.ejemplo)}"</p>
                            </div>
                            ${isBilingual ? `<p class="example-target">"${escapeHTML(targetItem.ejemplo)}"</p>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },



    isStringArray(arr) {
        return Array.isArray(arr) && arr.length > 0 && typeof arr[0] === 'string';
    },

    addAccordionListeners() {
        // Listener para cabeceras de Sección
        const sectionHeaders = document.querySelectorAll('.section-header-btn');
        sectionHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const isExpanded = header.getAttribute('aria-expanded') === 'true';
                const contentId = header.getAttribute('aria-controls');
                const content = document.getElementById(contentId);

                header.setAttribute('aria-expanded', !isExpanded);
                content.hidden = isExpanded; // Si estaba expandido, ahora oculto (hidden=true)

                // Persistencia de Sección
                const id = header.getAttribute('data-accordion-id');
                Storage.setAccordionState(id, !isExpanded);
            });
        });

        // Listener para cabeceras de Items Internos
        const itemHeaders = document.querySelectorAll('.item-header-btn');
        itemHeaders.forEach(header => {
            header.addEventListener('click', (e) => {
                e.stopPropagation(); // Evitar que el clic cierre la sección padre
                const isExpanded = header.getAttribute('aria-expanded') === 'true';
                const contentId = header.getAttribute('aria-controls');
                const content = document.getElementById(contentId);

                header.setAttribute('aria-expanded', !isExpanded);

                // Toggle de clase hidden para items
                if (isExpanded) {
                    content.classList.add('hidden');
                } else {
                    content.classList.remove('hidden');
                }

                // Persistencia de Item
                const id = header.getAttribute('data-accordion-id');
                Storage.setAccordionState(id, !isExpanded);
            });
        });


    },

    restoreAccordionState() {
        const openIds = Storage.getAccordionStates();

        // Si no hay historial, abrir primera sección por defecto
        if (openIds.length === 0) {
            const firstHeader = document.querySelector('.section-header-btn');
            if (firstHeader) {
                firstHeader.setAttribute('aria-expanded', 'true');
                const content = document.getElementById(firstHeader.getAttribute('aria-controls'));
                if (content) content.hidden = false;
            }
        } else {
            // Restaurar estado de Secciones y de Items
            openIds.forEach(id => {
                // Intentar buscar como botón de sección o de item
                const header = document.querySelector(`button[data-accordion-id="${id}"]`);
                if (header) {
                    header.setAttribute('aria-expanded', 'true');

                    const contentId = header.getAttribute('aria-controls');
                    const content = document.getElementById(contentId);

                    if (content) {
                        // Si es sección usa 'hidden' attribute, si es item usa class 'hidden'
                        if (header.classList.contains('section-header-btn')) {
                            content.hidden = false;
                        } else {
                            content.classList.remove('hidden');
                        }
                    }
                }
            });
        }

        this.addAccordionListeners();
    }
};
