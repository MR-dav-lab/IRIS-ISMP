/**
 * PdfParserService — Single Responsibility : lire et analyser un PDF uploadé
 * Extrait les métadonnées utiles pour pré-remplir un modèle importé.
 */

export class PdfParserService {
  /**
   * Convertit un File PDF en data URL base64
   * @param {File} file
   * @returns {Promise<string>} data URL
   */
  static async toDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Lecture du fichier échouée"));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Génère un ID unique pour un document importé
   * @param {string} categoryId
   * @param {string} label
   * @returns {string}
   */
  static generateId(categoryId, label) {
    const slug = label
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    return `${categoryId}-${slug}-${Date.now()}`;
  }
}
