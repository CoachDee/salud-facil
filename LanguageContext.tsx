
import React, { createContext, useContext, useCallback, Dispatch, SetStateAction } from 'react';
import { translations } from '../constants';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: Dispatch<SetStateAction<Language>>;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const useTranslation = () => {
    const { language } = useLanguage();
    const t = useCallback((key: string, params?: Record<string, string | number>) => {
        let text = (translations[language] as any)[key] || key;
        if (params) {
            for (const [paramKey, value] of Object.entries(params)) {
                text = text.replace(`{${paramKey}}`, String(value));
            }
        }
        return text;
    }, [language]);
    return t;
};
