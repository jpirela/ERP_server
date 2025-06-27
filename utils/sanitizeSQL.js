// utils/sanitizeSQL.js

/**
 * Función para sanitizar las entradas de SQL y prevenir inyecciones SQL.
 * Escapa caracteres peligrosos en las consultas.
 * @param {string|number} input - La cadena o número de entrada SQL a sanitizar.
 * @returns {string} - La cadena sanitizada.
 */
const sanitizeSQL = (input) => {
    if (typeof input === 'number') {
        return input.toString(); // Devuelve números como cadenas
    }
    
    if (typeof input !== 'string') {
        throw new Error('El valor de entrada debe ser una cadena o número');
    }

    // Remover comentarios SQL y caracteres peligrosos
    return input
        .replace(/(--|\/*|\*\/|;)/g, '')  // Remueve comentarios y punto y coma
        .replace(/['"]/g, '');            // Remueve comillas simples y dobles
};

export default sanitizeSQL;
