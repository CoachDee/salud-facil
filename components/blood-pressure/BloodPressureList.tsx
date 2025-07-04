
import React from 'react';
import { BloodPressureReading } from '../../types';
import { useTranslation, useLanguage } from '../../context/LanguageContext';
import BloodPressureChart from './BloodPressureChart';

interface BloodPressureListProps {
    readings: BloodPressureReading[];
    onDelete: (id: number) => void;
    onEdit: (reading: BloodPressureReading) => void;
    onAnalyze: () => void;
    isAnalyzing: boolean;
    analysisResult: string | null;
    analysisError: string | null;
    clearAnalysis: () => void;
}

const BloodPressureList: React.FC<BloodPressureListProps> = ({ readings, onDelete, onEdit, onAnalyze, isAnalyzing, analysisResult, analysisError, clearAnalysis }) => {
    const t = useTranslation();
    const { language } = useLanguage();
    const sortedReadings = [...readings].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">{t('bloodPressureLog')}</h2>
            
            <BloodPressureChart readings={readings} />

            {readings.length > 0 && (
                <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-6">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl">✨</span>
                            <h3 className="text-lg font-semibold text-gray-800">{t('aiAnalysisTitle')}</h3>
                        </div>
                        {analysisResult && (
                             <button onClick={clearAnalysis} className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100" aria-label={t('cancel')}>
                                <CloseIcon />
                            </button>
                        )}
                    </div>
                    
                    {isAnalyzing && (
                        <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                        <p className="mt-2 text-gray-600">{t('aiAnalysisLoading')}</p>
                        </div>
                    )}

                    {analysisError && <p className="text-red-500 text-center p-4">{analysisError}</p>}
                    
                    {analysisResult && (
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                             <div className="space-y-2 text-gray-800">
                                {analysisResult.split('\n').filter(line => line.trim() !== '').map((line, i) => (
                                    <p key={i} className="flex items-start">
                                    <span className="mr-2 text-purple-500 mt-1">•</span>
                                    <span>{line.replace(/^\s*[-*]\s*/, '')}</span>
                                    </p>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-4 italic">{t('aiAnalysisDisclaimer')}</p>
                        </div>
                    )}

                    {!isAnalyzing && !analysisResult && !analysisError &&(
                         <button
                            onClick={onAnalyze}
                            disabled={isAnalyzing}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 ease-in-out shadow-md disabled:bg-purple-300"
                        >
                            {t('analyzeWithAI')}
                        </button>
                    )}
                </div>
            )}

            {sortedReadings.length === 0 ? (
                <div className="text-center py-10 px-4">
                  <div className="mx-auto w-24 h-24 text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
                  </div>
                  <p className="text-center text-gray-500 text-lg mt-4">{t('noReadings')}</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {sortedReadings.map(reading => (
                        <div key={reading.id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center space-x-4">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-red-500">{reading.systolic}</div>
                                        <div className="text-xl font-semibold text-blue-500">{reading.diastolic}</div>
                                        <div className="text-xs text-gray-500">mmHg</div>
                                    </div>
                                    <div>
                                        <p className="text-gray-700 flex items-center"><PulseIcon /> <span className="ml-1">{reading.pulse} bpm</span></p>
                                        <p className="text-gray-500 text-sm mt-1">{new Date(reading.date).toLocaleString(language, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end space-y-1">
                                    <button onClick={() => onEdit(reading)} className="p-2 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-gray-100" aria-label={t('editReading')}><EditIcon /></button>
                                    <button onClick={() => onDelete(reading.id)} className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100" aria-label={t('deleteReading')}><DeleteIcon /></button>
                                </div>
                            </div>
                            {reading.notes && <p className="text-gray-600 text-sm mt-3 pt-3 border-t border-gray-100">{reading.notes}</p>}
                        </div>
                    ))}
                </div>
            )}
            <button onClick={() => onEdit({} as BloodPressureReading)} className="fixed bottom-24 right-4 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300" aria-label={t('addReading')}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            </button>
        </div>
    );
};

const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const PulseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 8h4l2-4 2 4h4" /><path strokeLinecap="round" strokeLinejoin="round" d="M4 16h4l2 4 2-4h4" /></svg>
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>;

export default BloodPressureList;