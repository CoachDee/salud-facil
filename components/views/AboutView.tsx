
import React, { useRef } from 'react';
import { useTranslation } from '../../context/LanguageContext';

interface AboutViewProps {
    onBackup: () => void;
    onRestore: (event: React.ChangeEvent<HTMLInputElement>) => void;
}


const AboutView: React.FC<AboutViewProps> = ({ onBackup, onRestore }) => {
    const t = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleRestoreClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">{t('aboutTitle')}</h2>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-4 text-gray-700">
                <p className="text-justify">{t('copyrightText')}</p>
            </div>
            
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4">{t('backupAndRestore')}</h3>
                <p className="text-gray-600 mb-4 text-sm">{t('backupDescription')}</p>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <button
                        onClick={onBackup}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition"
                    >
                        {t('createBackup')}
                    </button>
                    <button
                        onClick={handleRestoreClick}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition"
                    >
                        {t('restoreFromBackup')}
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={onRestore}
                        className="hidden"
                        accept="application/json"
                    />
                </div>
            </div>
        </div>
    );
};

export default AboutView;
