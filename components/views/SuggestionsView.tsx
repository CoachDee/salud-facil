
import React, { useState } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { translations } from '../../constants';
import { View } from '../../types';

interface SuggestionsViewProps {
    openModal: (message: string) => void;
    setCurrentView: (view: View) => void;
}

const SuggestionsView: React.FC<SuggestionsViewProps> = ({ openModal, setCurrentView }) => {
    const t = useTranslation();
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const recipientEmail = translations.es.emailContact;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject || !message) {
            openModal(t('fillAllFields'));
            return;
        }
        const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
        window.location.href = mailtoLink;
        openModal(t('emailClientWillOpen'));
        setSubject('');
        setMessage('');
    };

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">{t('suggestionsTitle')}</h2>
            <p className="text-center text-gray-600 mb-6">{t('suggestionsSubtitle')}</p>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-4">
                <div>
                    <label htmlFor="suggestionSubject" className="block text-gray-700 text-sm font-semibold mb-2">{t('suggestionSubject')}</label>
                    <input type="text" id="suggestionSubject" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <div>
                    <label htmlFor="suggestionMessage" className="block text-gray-700 text-sm font-semibold mb-2">{t('suggestionMessage')}</label>
                    <textarea id="suggestionMessage" value={message} onChange={(e) => setMessage(e.target.value)} rows={6} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required></textarea>
                </div>
                <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition shadow-lg transform hover:scale-105">{t('sendSuggestion')}</button>
                <button type="button" onClick={() => setCurrentView(View.Home)} className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-4 rounded-lg mt-2 transition shadow-md">{t('back')}</button>
            </form>
        </div>
    );
};

export default SuggestionsView;
