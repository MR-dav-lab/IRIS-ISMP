/**
 * LocalDocumentService — Implémentation locale (Liskov Substitution Principle)
 * Lit depuis documents.json + localStorage pour les docs/catégories ajoutés.
 * Remplaçable par ApiDocumentService sans modifier useDocuments.js.
 */
import { DocumentService } from './DocumentService';
import baseData from '../data/documents.json';

const LS_CATEGORIES_KEY = 'iris_categories';
const LS_DOCUMENTS_KEY  = 'iris_documents';

export class LocalDocumentService extends DocumentService {

  _loadFromLS(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  _saveToLS(key, data) {
    try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
  }

  async getCategories() {
    const base    = baseData.categories;
    const added   = this._loadFromLS(LS_CATEGORIES_KEY);
    return [...base, ...added];
  }

  async getDocuments() {
    const base  = baseData.documents;
    const added = this._loadFromLS(LS_DOCUMENTS_KEY);
    return [...base, ...added];
  }

  async addCategory(category) {
    const existing = this._loadFromLS(LS_CATEGORIES_KEY);
    const newCat = { ...category, builtIn: false };
    this._saveToLS(LS_CATEGORIES_KEY, [...existing, newCat]);
    return newCat;
  }

  async deleteCategory(categoryId) {
    const cats = this._loadFromLS(LS_CATEGORIES_KEY)
      .filter(c => c.id !== categoryId);
    this._saveToLS(LS_CATEGORIES_KEY, cats);
    // Supprimer les docs de cette catégorie aussi
    const docs = this._loadFromLS(LS_DOCUMENTS_KEY)
      .filter(d => d.categoryId !== categoryId);
    this._saveToLS(LS_DOCUMENTS_KEY, docs);
  }

  async addDocument(doc) {
    const existing = this._loadFromLS(LS_DOCUMENTS_KEY);
    const newDoc = { ...doc, builtIn: false };
    this._saveToLS(LS_DOCUMENTS_KEY, [...existing, newDoc]);
    return newDoc;
  }

  async deleteDocument(docId) {
    const docs = this._loadFromLS(LS_DOCUMENTS_KEY)
      .filter(d => d.id !== docId);
    this._saveToLS(LS_DOCUMENTS_KEY, docs);
  }
}

// Singleton exporté — swap par ApiDocumentService en changeant ici uniquement
export const documentService = new LocalDocumentService();
