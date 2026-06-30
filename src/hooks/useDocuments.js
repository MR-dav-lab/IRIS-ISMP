/**
 * useDocuments — Hook SRP : toute la logique CRUD documents + catégories
 * Les composants n'accèdent jamais directement au service ou à documents.json
 */
import { useState, useEffect, useCallback } from 'react';
import { documentService } from '../services/LocalDocumentService';

export function useDocuments() {
  const [categories, setCategories] = useState([]);
  const [documents,  setDocuments]  = useState([]);
  const [loading,    setLoading]    = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const [cats, docs] = await Promise.all([
      documentService.getCategories(),
      documentService.getDocuments(),
    ]);
    setCategories(cats.sort((a, b) => (a.order ?? 99) - (b.order ?? 99)));
    setDocuments(docs);
    setLoading(false);
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const addCategory = useCallback(async (cat) => {
    await documentService.addCategory(cat);
    await reload();
  }, [reload]);

  const deleteCategory = useCallback(async (catId) => {
    await documentService.deleteCategory(catId);
    await reload();
  }, [reload]);

  const addDocument = useCallback(async (doc) => {
    await documentService.addDocument(doc);
    await reload();
  }, [reload]);

  const deleteDocument = useCallback(async (docId) => {
    await documentService.deleteDocument(docId);
    await reload();
  }, [reload]);

  /** Docs filtrés par catégorie */
  const getDocsByCategory = useCallback((categoryId) =>
    documents.filter(d => d.categoryId === categoryId),
  [documents]);

  return {
    categories, documents, loading,
    getDocsByCategory,
    addCategory, deleteCategory,
    addDocument, deleteDocument,
    reload,
  };
}
