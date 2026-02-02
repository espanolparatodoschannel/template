import { CONFIG } from './config.js';
import { DataLoader } from './data-loader.js';
import { UIRenderer } from './ui-renderer.js';
import { Storage } from './storage.js';
import { Accessibility } from './accessibility.js';


class App {
    constructor() {
        this.currentLanguage = 'es';
        this.languagesConfig = null;

    }

    async init() {
        console.log('Iniciando aplicación Analysis Linguistico...');



        // Inicializar UI Renderer (buscando elementos en el DOM)
        UIRenderer.init();



        // Listeners globales
        this.setupEventListeners();

        try {
            // 1. Cargar configuración de idiomas
            this.languagesConfig = await DataLoader.loadLanguagesConfig();

            // 2. Determinar idioma inicial
            this.currentLanguage = this.getInitialLanguage();

            // 3. Renderizar Selector
            UIRenderer.renderLanguageSelector(this.languagesConfig, this.currentLanguage);

            // 4. Cargar datos iniciales
            await this.loadContent(this.currentLanguage);

        } catch (error) {
            console.error('Error crítico de inicialización:', error);
            UIRenderer.showError("No se pudo iniciar la aplicación.");
        }
    }

    getInitialLanguage() {
        // Prioridad: 1. LocalStorage, 2. Default Config
        const stored = Storage.getLanguage();
        if (stored) return stored;

        return this.languagesConfig.default || 'es';
    }

    setupEventListeners() {
        // Selector de cambio de idioma
        const selector = document.querySelector(CONFIG.SELECTORS.LANGUAGE_SELECTOR);
        if (selector) {
            selector.addEventListener('change', (e) => this.handleLanguageChange(e.target.value));
        }

        // Botón de reintentar en error
        const retryBtn = document.querySelector(CONFIG.SELECTORS.RETRY_BUTTON);
        if (retryBtn) {
            retryBtn.addEventListener('click', () => this.loadContent(this.currentLanguage));
        }
    }


    async handleLanguageChange(newLang) {
        if (newLang === this.currentLanguage) return;

        this.currentLanguage = newLang;
        Storage.setLanguage(newLang);
        await this.loadContent(newLang);
    }

    async loadContent(lang) {
        UIRenderer.showLoading();
        Accessibility.announce(`Cargando contenido en ${this.getLanguageName(lang)}...`);

        try {
            // Simular un mínimo delay para evitar parpadeos
            await new Promise(r => setTimeout(r, 300));

            // Cargar SIEMPRE español (base) y el idioma objetivo
            const [esData, targetData] = await Promise.all([
                DataLoader.loadStoryData('es'),
                (lang === 'es') ? Promise.resolve(null) : DataLoader.loadStoryData(lang)
            ]);

            // Si el idioma es español, targetData será null, el UI Renderer lo manejará
            UIRenderer.renderStory(esData, targetData);

            Accessibility.announce(`Contenido cargado exitosamente.`);

        } catch (error) {
            console.error('Error cargando contenido:', error);
            UIRenderer.showError(`Error al cargar los datos: ${error.message}. Verifica los archivos JSON de 'es' y '${lang}'.`);
        }
    }

    getLanguageName(code) {
        const lang = this.languagesConfig?.languages.find(l => l.code === code);
        return lang ? lang.name : code;
    }
}

// Funciones globales para controlar el audio de la narrativa
window.toggleNarrativeAudio = function () {
    const audio = document.getElementById('narrative-audio');
    const playIcon = document.querySelector('.play-pause-btn .play-icon');
    const pauseIcon = document.querySelector('.play-pause-btn .pause-icon');

    if (audio.paused) {
        audio.play();
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
    } else {
        audio.pause();
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
    }
};


window.restartNarrativeAudio = function () {
    const audio = document.getElementById('narrative-audio');
    audio.currentTime = 0;
    audio.play();
    const playIcon = document.querySelector('.play-pause-btn .play-icon');
    const pauseIcon = document.querySelector('.play-pause-btn .pause-icon');
    playIcon.classList.add('hidden');
    pauseIcon.classList.remove('hidden');
};

window.seekNarrativeAudio = function (value) {
    const audio = document.getElementById('narrative-audio');
    const seekTime = (value / 100) * audio.duration;
    audio.currentTime = seekTime;
};

// Función para pronunciación con un solo clic - Versión Optimizada y Robusta
window.speakText = function (text, lang = 'es') {
    if (!window.speechSynthesis) return;

    // Función interna para ejecutar el discurso
    const performSpeak = () => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = 0.95; // Un pelín más lento suele sonar más natural en voces locales
        utterance.pitch = 1.0;

        const voices = window.speechSynthesis.getVoices();
        const esVoices = voices.filter(v => v.lang.startsWith(lang));

        if (esVoices.length > 0) {
            // Buscamos voces de alta calidad por palabras clave
            // Prioridad absoluta: Voces "Natural", "Neural", "Google", "Online"
            const preferredVoice = esVoices.find(v => v.name.toLowerCase().includes('natural'))
                || esVoices.find(v => v.name.toLowerCase().includes('neural'))
                || esVoices.find(v => v.name.includes('Google'))
                || esVoices.find(v => v.name.includes('Online'))
                || esVoices.find(v => v.name.includes('Microsoft'))
                || esVoices[0];

            utterance.voice = preferredVoice;
            console.log(`TTS -> Usando voz: ${preferredVoice.name} (${preferredVoice.lang})`);
        }

        window.speechSynthesis.speak(utterance);
    };

    // Si no hay voces cargadas aún, esperamos un momento
    if (window.speechSynthesis.getVoices().length === 0) {
        console.warn("TTS -> Esperando a que carguen las voces...");
        setTimeout(performSpeak, 100);
    } else {
        performSpeak();
    }
};

// Pre-cargar voces (algunos navegadores las cargan de forma asíncrona)
if (window.speechSynthesis) {
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
}

// Formatear tiempo en formato mm:ss
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Actualizar UI del reproductor
function updateAudioUI() {
    const audio = document.getElementById('narrative-audio');
    if (!audio) return;

    const progressBar = document.querySelector('.audio-progress');
    const currentTimeEl = document.querySelector('.current-time');
    const totalTimeEl = document.querySelector('.total-time');
    const playIcon = document.querySelector('.play-pause-btn .play-icon');
    const pauseIcon = document.querySelector('.play-pause-btn .pause-icon');

    // Actualizar duración total cuando se carga metadata
    audio.addEventListener('loadedmetadata', () => {
        if (totalTimeEl) totalTimeEl.textContent = formatTime(audio.duration);
    });

    // Actualizar progreso durante reproducción
    audio.addEventListener('timeupdate', () => {
        if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
        if (progressBar && audio.duration) {
            progressBar.value = (audio.currentTime / audio.duration) * 100;
        }
    });

    // Resetear cuando termine
    audio.addEventListener('ended', () => {
        if (playIcon) playIcon.classList.remove('hidden');
        if (pauseIcon) pauseIcon.classList.add('hidden');
        if (progressBar) progressBar.value = 0;
    });
}

// Iniciar App cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();

    // Esperar un poco para que se renderice el contenido
    setTimeout(updateAudioUI, 500);
});
