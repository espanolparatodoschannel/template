const fs = require('fs');
const path = require('path');

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

    const listFields = required.filter(f => f !== 'meta' && f !== 'titulo');
    listFields.forEach(field => {
        if (!Array.isArray(data[field])) {
            throw new Error(`Invalid JSON: '${field}' must be an array`);
        }
    });

    return true;
}

const dataDir = './data';
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') && f !== 'languages-config.json');

files.forEach(file => {
    const filePath = path.join(dataDir, file);
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);
        validateStoryData(data);
        console.log(`✅ ${file} is valid and structurally correct`);
    } catch (e) {
        console.error(`❌ ${file} error: ${e.message}`);
    }
});
