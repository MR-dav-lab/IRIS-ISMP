/**
 * useLogoSlot — Hook SRP : gestion du logo uploadé par l'utilisateur
 * Stocké en mémoire session (pas de persistance — le logo change selon le doc)
 */
import { useState, useCallback, useRef } from 'react';

export function useLogoSlot() {
  const [logoDataUrl, setLogoDataUrl] = useState(null);
  const [logoName,    setLogoName]    = useState(null);
  const fileInputRef = useRef(null);

  const openPicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      setLogoDataUrl(reader.result);
      setLogoName(file.name);
    };
    reader.readAsDataURL(file);
    // Reset input pour permettre de re-sélectionner le même fichier
    e.target.value = '';
  }, []);

  const clearLogo = useCallback(() => {
    setLogoDataUrl(null);
    setLogoName(null);
  }, []);

  return {
    logoDataUrl,
    logoName,
    fileInputRef,
    openPicker,
    handleFileChange,
    clearLogo,
  };
}
