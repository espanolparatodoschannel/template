# Plantilla Web - Análisis Lingüístico Bilingüe

Esta es una plantilla web reutilizable y agnóstica del contenido diseñada para mostrar análisis lingüístico comparativo entre español y otros idiomas. Utiliza un diseño moderno "Glassmorphism" y está construida con tecnologías web estándar (HTML/CSS/JS) sin dependencias externas.

## Características

*   **Agnóstica del Contenido:** La estructura HTML/CSS/JS es fija. Todo el contenido se carga dinámicamente desde archivos JSON.
*   **Diseño Glassmorphism:** Interfaz moderna y atractiva con efectos de desenfoque y transparencias.
*   **Responsive:** Adaptable a móviles, tablets y escritorio.
*   **Accesible:** Cumple con estándares WCAG 2.1 AA (navegación por teclado, contraste, ARIA).
*   **Persistencia:** Recuerda el último idioma seleccionado y qué acordeones estaban abiertos.
*   **Multilingüe:** Fácilmente escalable a más idiomas editando un archivo de configuración.

## Estructura del Proyecto

```
proyecto/
├── index.html                    # Punto de entrada
├── data/                         # Datos JSON
│   ├── languages-config.json     # Configuración de idiomas
│   ├── es.json                   # Historia en Español
│   └── en.json                   # Historia en Inglés
├── styles/                       # Estilos CSS
│   ├── variables.css             # Configuración de diseño
│   ├── main.css                  # Estilos principales
│   └── ...
└── scripts/                      # Lógica JavaScript
    ├── app.js                    # Orquestador
    ├── data-loader.js            # Carga de datos
    └── ...
```

## Cómo Usar

### 1. Configurar Idiomas
Edita `data/languages-config.json` para definir qué idiomas estarán disponibles en el selector.
```json
{
  "default": "es",
  "languages": [
    { "code": "es", "name": "Español", "flag": "🇪🇸" },
    { "code": "en", "name": "English", "flag": "🇺🇸" }
  ]
}
```

### 2. Crear Contenido (Historias)
Crea un archivo JSON para cada idioma en la carpeta `data/` (ej: `fr.json`, `de.json`). Debe seguir estrictamente la estructura definida (ver `es.json` como ejemplo).

**Campos Requeridos:**
*   `meta`: Información sobre la historia.
*   `titulo`: Título de la historia.
*   `conectores_logicos`: Array de objetos.
*   `verbos`: Array de objetos.
*   `adjetivos`: Array de objetos.
*   `sustantivos_clave`: Array de objetos.
*   `expresiones_idiomaticas`: Array de objetos.
*   `funciones_comunicativas`: Array de objetos.
*   `palabras_clave`: Array de strings.
*   `narrativa`: String con el texto completo de la historia.

### 3. Ejecutar
Dado que usa `fetch` para cargar archivos JSON, necesitas un servidor local para evitar errores de CORS (Cross-Origin Resource Sharing) si usas navegadores modernos estrictos.

**Opción A (VS Code):**
Usa la extensión "Live Server". Click derecho en `index.html` -> "Open with Live Server".

**Opción B (Python):**
```bash
python -m http.server
```

**Opción C (GitHub Pages):**
Sube el código a un repositorio, activa GitHub Pages y funcionará automáticamente.

## Personalización Visual
Todo el diseño se controla desde `styles/variables.css`. Puedes cambiar fácilmente:
*   La paleta de colores.
*   Las fuentes (Google Fonts).
*   El nivel de desenfoque del cristal (`--blur-md`).
*   Los espaciados.

## Créditos
Generado por IA para Análisis Lingüístico Bilingüe.
2026.
