/**
 * Configuración Global
 */
export const CONFIG = {
    PATHS: {
        LANGUAGES_CONFIG: './data/languages-config.json',
        DATA_DIR: './data/'
    },
    SELECTORS: {
        LANGUAGE_SELECTOR: '#language-selector',
        MAIN_TITLE: '#main-title',
        CONTENT_CONTAINER: '#content',
        LOADING_INDICATOR: '#loading-indicator',
        ERROR_CONTAINER: '#error-container',
        ERROR_MESSAGE: '#error-message',
        RETRY_BUTTON: '#retry-button',
        CREDITS: '#credits'
    },
    STORAGE_KEYS: {
        LANGUAGE: 'selected_language',
        ACCORDIONS: 'expanded_accordions'
    },
    ANIMATION: {
        DURATION: 250
    }
};

export const UI_LABELS = {
    LOADING: "Cargando datos...",
    ERROR_TITLE: "Ocurrió un error",
    RETRY: "Reintentar",
    DEFAULT_TITLE: "Análisis Lingüístico"
};

export const SECTION_LABELS = {
    es: { conectores_logicos: "Conectores Lógicos", verbos: "Verbos", adjetivos: "Adjetivos", sustantivos_clave: "Sustantivos Clave", expresiones_idiomaticas: "Expresiones Idiomáticas", funciones_comunicativas: "Funciones Comunicativas", palabras_clave: "Palabras Clave", narrativa: "Narrativa" },
    en: { conectores_logicos: "Logical Connectors", verbos: "Verbs", adjetivos: "Adjectives", sustantivos_clave: "Key Nouns", expresiones_idiomaticas: "Idiomatic Expressions", funciones_comunicativas: "Communicative Functions", palabras_clave: "Keywords", narrativa: "Narrative" },
    fr: { conectores_logicos: "Connecteurs Logiques", verbos: "Verbes", adjetivos: "Adjectifs", sustantivos_clave: "Noms Clés", expresiones_idiomaticas: "Expressions Idiomatiques", funciones_comunicativas: "Fonctions Communicatives", palabras_clave: "Mots-clés", narrativa: "Récit" },
    de: { conectores_logicos: "Logische Konnektoren", verbos: "Verben", adjetivos: "Adjektive", sustantivos_clave: "Schlüsselwörter", expresiones_idiomaticas: "Redewendungen", funciones_comunicativas: "Kommunikative Funktionen", palabras_clave: "Stichworte", narrativa: "Erzählung" },
    pt: { conectores_logicos: "Conectores Lógicos", verbos: "Verbos", adjetivos: "Adjetivos", sustantivos_clave: "Substantivos Chave", expresiones_idiomaticas: "Expressões Idiomáticas", funciones_comunicativas: "Funções Comunicativas", palabras_clave: "Palavras-chave", narrativa: "Narrativa" },
    ru: { conectores_logicos: "Логические Коннекторы", verbos: "Глаголы", adjetivos: "Прилагательные", sustantivos_clave: "Ключевые Существительные", expresiones_idiomaticas: "Идиоматические Выражения", funciones_comunicativas: "Коммуникативные Функции", palabras_clave: "Ключевые Слова", narrativa: "Повествование" },
    zh: { conectores_logicos: "逻辑连接词", verbos: "动词", adjetivos: "形容词", sustantivos_clave: "关键名词", expresiones_idiomaticas: "成语表达", funciones_comunicativas: "交际功能", palabras_clave: "关键词", narrativa: "叙述" },
    ja: { conectores_logicos: "論理的接続詞", verbos: "動詞", adjetivos: "形容詞", sustantivos_clave: "重要な名詞", expresiones_idiomaticas: "慣用句", funciones_comunicativas: "コミュニケーション機能", palabras_clave: "キーワード", narrativa: "物語" },
    ar: { conectores_logicos: "الروابط المنطقية", verbos: "الأفعال", adjetivos: "الصفات", sustantivos_clave: "الأسماء الرئيسية", expresiones_idiomaticas: "التعبيرات الاصطلاحية", funciones_comunicativas: "الوظائف التواصلية", palabras_clave: "الكلمات الدالة", narrativa: "السرد" },
    hi: { conectores_logicos: "तार्किक संयोजक", verbos: "क्रिया", adjetivos: "विशेषण", sustantivos_clave: "मुख्य संज्ञाएं", expresiones_idiomaticas: "मुहावरेदार अभिव्यक्ति", funciones_comunicativas: "संचार कार्य", palabras_clave: "कीवर्ड", narrativa: "कथा" }
};

export const AUDIO_TOOLTIPS = {
    es: "Hacer clic para escuchar",
    en: "Click to listen",
    fr: "Cliquer pour écouter",
    de: "Klicken zum Anhören",
    pt: "Clique para ouvir",
    ru: "Нажмите, чтобы прослушать",
    zh: "点击收听",
    ja: "クリックで聞く",
    ar: "انقر للاستماع",
    hi: "सुनने के लिए क्लिक करें"
};

export const SECTION_ICONS = {
    conectores_logicos: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`, // Link
    verbos: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`, // Zap/Action
    adjetivos: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line><line x1="12" y1="8" x2="12" y2="16"></line></svg>`, // Plus Circle
    sustantivos_clave: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`, // Box/Cube
    expresiones_idiomaticas: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>`, // Message/Chat
    funciones_comunicativas: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`, // Users
    palabras_clave: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>`, // Key
    narrativa: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>` // Book
};
