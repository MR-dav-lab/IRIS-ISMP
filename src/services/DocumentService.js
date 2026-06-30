/**
 * DocumentService — Interface abstraite (Dependency Inversion Principle)
 * Les composants dépendent de cette interface, pas de l'implémentation concrète.
 * Remplaçable par ApiDocumentService sans changer les consommateurs.
 */
export class DocumentService {
  /** @returns {Promise<import('../types').Category[]>} */
  async getCategories() { throw new Error("Not implemented"); }

  /** @returns {Promise<import('../types').DocumentModel[]>} */
  async getDocuments() { throw new Error("Not implemented"); }

  /** @param {import('../types').Category} category @returns {Promise<import('../types').Category>} */
  async addCategory(category) { throw new Error("Not implemented"); }

  /** @param {string} categoryId @returns {Promise<void>} */
  async deleteCategory(categoryId) { throw new Error("Not implemented"); }

  /** @param {import('../types').DocumentModel} doc @returns {Promise<import('../types').DocumentModel>} */
  async addDocument(doc) { throw new Error("Not implemented"); }

  /** @param {string} docId @returns {Promise<void>} */
  async deleteDocument(docId) { throw new Error("Not implemented"); }
}
