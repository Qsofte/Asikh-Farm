import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const [isHindi, setIsHindi] = useState(i18n.language === 'hi');

  useEffect(() => {
    setIsHindi(i18n.language === 'hi');
  }, [i18n.language]);

  const toggleLanguage = () => {
    const newLang = isHindi ? 'en' : 'hi';
    i18n.changeLanguage(newLang);
    setIsHindi(!isHindi);
  };

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only" checked={isHindi} onChange={toggleLanguage} />
      <div className="flex items-center justify-between w-16 h-7 bg-gray-300 rounded-full p-1">
        <span className={`text-xs font-bold ${!isHindi ? 'text-white' : 'text-gray-700'}`}>ENG</span>
        <span className={`text-xs font-bold ${isHindi ? 'text-white' : 'text-gray-700'}`}>हिंदी</span>
      </div>
      <div className={`absolute left-1 top-1 w-6 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out ${isHindi ? 'translate-x-8' : ''}`}></div>
    </label>
  );
};

export default LanguageToggle;
