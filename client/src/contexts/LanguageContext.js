import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations } from '../translations';

// Create a context for language
const LanguageContext = createContext();

// Create a provider component
export const LanguageProvider = ({ children }) => {
  // Get saved language from localStorage or default to French
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || 'fr';
  });
  
  // Current translation based on selected language
  const [t, setT] = useState(translations[language]);
  
  // Update translations when language changes
  useEffect(() => {
    setT(translations[language]);
    localStorage.setItem('language', language);
    
    // Set document direction for Arabic (right-to-left)
    if (language === 'ar') {
      document.documentElement.dir = 'rtl';
      document.body.style.fontFamily = "'Amiri', 'Arial', sans-serif";
      
      // Add CSS to ensure doors maintain left/right orientation
      const style = document.createElement('style');
      style.id = 'rtl-override';
      style.innerHTML = `
        /* Keep doors in the same visual position */
        .doors-container {
          flex-direction: row !important;
        }
      `;
      document.head.appendChild(style);
    } else {
      document.documentElement.dir = 'ltr';
      document.body.style.fontFamily = "'Roboto', 'Arial', sans-serif";
      
      // Remove RTL override styles if they exist
      const rtlStyle = document.getElementById('rtl-override');
      if (rtlStyle) {
        rtlStyle.remove();
      }
    }
  }, [language]);
  
  // Change language function
  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang);
    }
  };
  
  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);
