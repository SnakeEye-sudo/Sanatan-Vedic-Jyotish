import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { Sunrise, Moon, Star } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  lang: Language;
  setLang: (l: Language) => void;
  goHome: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, lang, setLang, goHome }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="min-h-screen flex flex-col font-sans text-saffron-900">
      {/* Header */}
      <header className="bg-saffron-800 text-white shadow-lg border-b-4 border-gold-500 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <div 
            onClick={goHome} 
            className="flex items-center space-x-2 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <Sunrise size={32} className="text-gold-400" />
            <h1 className="text-xl md:text-2xl font-display font-bold tracking-wide">
              {t.appTitle}
            </h1>
          </div>
          
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value as Language)}
            className="bg-saffron-900 border border-gold-500 text-white text-sm rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gold-400"
          >
            <option value={Language.ENGLISH}>English</option>
            <option value={Language.HINDI}>हिंदी</option>
            <option value={Language.SANSKRIT}>संस्कृतम्</option>
          </select>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col relative">
        <div className="absolute inset-0 z-0 opacity-5 pointer-events-none bg-mandala bg-repeat"></div>
        <div className="relative z-10 w-full max-w-4xl mx-auto p-4 md:p-6 flex-grow flex flex-col">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-saffron-900 text-saffron-100 py-6 border-t-4 border-gold-600">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
             <Moon size={20} />
             <Star size={20} />
             <span className="font-display text-lg">शुभम भवतु</span>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm opacity-80">Developed with Devotion by</p>
            <p className="font-display text-lg font-bold text-gold-400 tracking-wider">
              {t.footerName}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
