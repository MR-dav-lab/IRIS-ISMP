/**
 * useCopyToClipboard — Hook SRP : copie de texte dans le presse-papier
 */
import { useState, useCallback } from 'react';

export function useCopyToClipboard(timeout = 2500) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback IE/Safari
        const el = document.createElement('textarea');
        el.value = text;
        el.style.position = 'fixed';
        el.style.opacity = '0';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), timeout);
      return true;
    } catch {
      return false;
    }
  }, [timeout]);

  return { copied, copy };
}
