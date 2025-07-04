
import React from 'react';
import { useTranslation, useLanguage } from '../../context/LanguageContext';
import { View, Language } from '../../types';

interface LayoutProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, setCurrentView, children }) => {
  const t = useTranslation();
  const { language, setLanguage } = useLanguage();

  const handleBack = () => {
    if (currentView === View.AddMedication || currentView === View.EditMedication) {
      setCurrentView(View.Medications);
    } else if (currentView === View.AddBloodPressure || currentView === View.EditBloodPressure) {
      setCurrentView(View.BloodPressure);
    } else {
      setCurrentView(View.Home);
    }
  };

  const navItems = [
    { view: View.Home, labelKey: 'home', icon: <HomeIcon />, activeViews: [View.Home] },
    { view: View.Medications, labelKey: 'medications', icon: <MedsIcon />, activeViews: [View.Medications, View.AddMedication, View.EditMedication] },
    { view: View.BloodPressure, labelKey: 'bloodPressure', icon: <BPIcon />, activeViews: [View.BloodPressure, View.AddBloodPressure, View.EditBloodPressure] },
    { view: View.History, labelKey: 'history', icon: <HistoryIcon />, activeViews: [View.History] },
    { view: View.Suggestions, labelKey: 'suggestions', icon: <SuggestionsIcon />, activeViews: [View.Suggestions] },
    { view: View.HowToUseApp, labelKey: 'howToUseApp', icon: <HowToIcon />, activeViews: [View.HowToUseApp] },
    { view: View.AboutApp, labelKey: 'aboutApp', icon: <AboutIcon />, activeViews: [View.AboutApp] }
  ];

  return (
    <div className="font-inter antialiased bg-gray-50 text-gray-800 min-h-screen">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 shadow-lg flex items-center justify-between sticky top-0 z-30">
        {currentView !== View.Home ? (
          <button onClick={handleBack} className="flex items-center space-x-2 text-white text-lg font-semibold focus:outline-none rounded-md p-1 -ml-1 hover:bg-white/20 transition-colors" aria-label={t('back')}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        ) : (
          <div className="w-10 h-7"></div>
        )}
        <h1 className="text-white text-xl sm:text-2xl font-bold text-center flex-grow truncate px-2">{t('appTitle')}</h1>
        <select value={language} onChange={(e) => setLanguage(e.target.value as Language)} className="bg-white/20 text-white p-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-white/50" aria-label="Seleccionar idioma">
          <option value="es" style={{color: 'black'}}>ES</option>
          <option value="it" style={{color: 'black'}}>IT</option>
          <option value="en" style={{color: 'black'}}>EN</option>
          <option value="de" style={{color: 'black'}}>DE</option>
        </select>
      </header>

      <main className="pb-24 transition-opacity duration-300 ease-in-out">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] border-t border-gray-200 flex justify-around p-1 z-40">
        {navItems.map(item => {
          const isActive = item.activeViews.includes(currentView);
          return (
            <button
              key={item.view}
              onClick={() => setCurrentView(item.view)}
              className={`flex flex-col items-center justify-center p-1 rounded-lg transition-all duration-200 flex-1 ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500 hover:bg-blue-50'}`}
              aria-label={t(item.labelKey)}
              style={{ transform: isActive ? 'scale(1.1)' : 'scale(1)', color: isActive ? '#2563eb' : '' }}
            >
              {React.cloneElement(item.icon, { isActive })}
              <span className="text-xs mt-1">{t(item.labelKey)}</span>
            </button>
          )
        })}
      </nav>
    </div>
  );
};

// Icons with active state handling
const HomeIcon = ({ isActive = false }) => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isActive ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m0 0l7 7m-7-7v10a1 1 0 01-1 1h-3" /></svg>;
const MedsIcon = ({ isActive = false }) => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isActive ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M7.5 21H12a1.5 1.5 0 0 0 1.5-1.5v-6A1.5 1.5 0 0 0 12 12h-4.5a1.5 1.5 0 0 1-1.5-1.5v-3A1.5 1.5 0 0 1 10.5 6H12a1.5 1.5 0 0 1 1.5 1.5v2.25" /><path d="M12 21h4.5a1.5 1.5 0 0 0 1.5-1.5v-6a1.5 1.5 0 0 0-1.5-1.5H12a1.5 1.5 0 0 0-1.5 1.5v6a1.5 1.5 0 0 0 1.5 1.5zM10.5 6a1.5 1.5 0 0 0-1.5-1.5H7.5A1.5 1.5 0 0 0 6 6v3a1.5 1.5 0 0 0 1.5 1.5h.5" /><path d="M12 3v1.5" /><path d="M12 21v-1.5" /><path d="M3 12h1.5" /><path d="M21 12h-1.5" /><path d="M5.636 5.636l1.06 1.06" /><path d="M18.364 18.364l-1.06-1.06" /><path d="M5.636 18.364l1.06-1.06" /><path d="M18.364 5.636l-1.06 1.06" /></svg>;
const BPIcon = ({ isActive = false }) => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isActive ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
const HistoryIcon = ({ isActive = false }) => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isActive ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const SuggestionsIcon = ({ isActive = false }) => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isActive ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.105A9.795 9.795 0 0112 3c4.97 0 9 3.582 9 8z" /></svg>;
const HowToIcon = ({ isActive = false }) => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isActive ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><path d="M12 17h.01" /></svg>;
const AboutIcon = ({ isActive = false }) => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isActive ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

export default Layout;
