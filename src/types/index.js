/**
 * IRIS — Contrats de données (Interface Segregation Principle)
 * Chaque interface est minimale et ciblée sur un domaine précis.
 */

/**
 * @typedef {Object} Category
 * @property {string} id
 * @property {string} label
 * @property {string} icon
 * @property {string} description
 * @property {number} order
 * @property {boolean} builtIn
 */

/**
 * @typedef {Object} DocumentModel
 * @property {string} id
 * @property {string} categoryId
 * @property {string} label
 * @property {string} description
 * @property {string} font
 * @property {string} fontSize
 * @property {string} margins
 * @property {boolean} hasLogo        — ce modèle prévoit un emplacement logo
 * @property {string|null} logoPosition — "top-left" | "top-center" | "top-right"
 * @property {string|null} logoLabel   — libellé de la zone logo
 * @property {string} notes
 * @property {boolean} builtIn        — modèle natif (non supprimable)
 * @property {string|null} uploadedFile — data URL du PDF uploadé (si scan)
 * @property {string} template         — texte brut du modèle
 */

/**
 * @typedef {Object} Division
 * @property {string} id
 * @property {string} code
 * @property {string} label
 * @property {string} subname
 * @property {string} desc
 * @property {string} icon
 * @property {boolean} available
 * @property {string} color
 */

/**
 * @typedef {Object} LogoSlotState
 * @property {string|null} dataUrl     — image uploadée en base64
 * @property {string|null} name        — nom du fichier
 */

/**
 * @typedef {Object} ToastState
 * @property {string} message
 * @property {'success'|'error'|'info'} type
 */

export {};
