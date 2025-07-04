import React from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { View } from '../../types';

interface HomeViewProps {
  setCurrentView: (view: View) => void;
}

const itemStyles: Record<string, { ring: string; bg: string; text: string }> = {
    blue: { ring: 'focus:ring-blue-400', bg: 'bg-blue-100', text: 'text-blue-600' },
    red: { ring: 'focus:ring-red-400', bg: 'bg-red-100', text: 'text-red-600' },
    purple: { ring: 'focus:ring-purple-400', bg: 'bg-purple-100', text: 'text-purple-600' },
};

const HomeView: React.FC<HomeViewProps> = ({ setCurrentView }) => {
  const t = useTranslation();

  const menuItems = [
    { view: View.Medications, label: t('medications'), description: t('howToUseMedications').substring(0, 60) + '...', icon: <MedsIcon />, color: 'blue' },
    { view: View.BloodPressure, label: t('bloodPressure'), description: t('howToUseBloodPressure').substring(0, 70) + '...', icon: <BPIcon />, color: 'red' },
    { view: View.History, label: t('history'), description: t('howToUseHistory').substring(0, 75) + '...', icon: <HistoryIcon />, color: 'purple' },
  ];

  return (
    <div className="flex flex-col items-center p-4 bg-gray-50 text-center min-h-[calc(100vh-140px)]">
      <div className="w-full max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-2 drop-shadow-sm animate-fade-in-down">
          {t('appTitle')}
        </h1>
        <p className="text-md sm:text-lg text-gray-600 mb-8 animate-fade-in-up">
          {t('appSubtitle')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          {menuItems.map((item, index) => {
            const style = itemStyles[item.color] || itemStyles.blue;
            return (
              <button
                key={item.view}
                onClick={() => setCurrentView(item.view)}
                className={`bg-white p-6 rounded-xl shadow-lg border border-gray-200 text-left w-full transition-transform transform hover:scale-105 active:scale-100 focus:outline-none focus:ring-2 ${style.ring} animate-fade-in-up`}
                style={{ animationDelay: `${index * 100}ms`}}
              >
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${style.bg} ${style.text} mr-4`}>
                    {item.icon}
                  </div>
                  <div>
                    <h2 className={`text-xl font-bold text-gray-800`}>{item.label}</h2>
                    <p className="text-gray-500 text-sm mt-1">{item.description}</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
};

const MedsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7"><path d="M12 2a5 5 0 00-5 5v10a5 5 0 005 5h0a5 5 0 005-5V7a5 5 0 00-5-5z"/><path d="M16 10H8m0 4h8"/></svg>;
const BPIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
const HistoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;


export default HomeView;
