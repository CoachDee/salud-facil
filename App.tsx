import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { LanguageContext } from './context/LanguageContext';
import { View, Language, Medication, BloodPressureReading, ModalState } from './types';
import { MEDICATION_STORAGE_KEY, BLOOD_PRESSURE_STORAGE_KEY, LANGUAGE_STORAGE_KEY, translations } from './constants';

import Layout from './components/layout/Layout';
import HomeView from './components/views/HomeView';
import MedicationList from './components/medications/MedicationList';
import MedicationForm from './components/medications/MedicationForm';
import BloodPressureList from './components/blood-pressure/BloodPressureList';
import BloodPressureForm from './components/blood-pressure/BloodPressureForm';
import HistoryView from './components/views/HistoryView';
import SuggestionsView from './components/views/SuggestionsView';
import AboutView from './components/views/AboutView';
import HowToUseView from './components/views/HowToUseView';
import CustomModal from './components/shared/CustomModal';

const App: React.FC = () => {
    const getInitialLanguage = (): Language => {
        try {
            const storedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY);
            if (storedLang && ['es', 'it', 'en', 'de'].includes(storedLang)) {
                return storedLang as Language;
            }
        } catch (e) {
            console.error("Could not access localStorage to get language, defaulting to 'es'.", e);
        }
        return 'es';
    };

    const [language, setLanguage] = useState<Language>(getInitialLanguage);

    const t = useCallback((key: string, params?: Record<string, string | number>) => {
        let text = (translations[language] as any)[key] || key;
        if (params) {
            for (const [paramKey, value] of Object.entries(params)) {
                text = text.replace(`{${paramKey}}`, String(value));
            }
        }
        return text;
    }, [language]);

    useEffect(() => {
        try {
            localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
            document.documentElement.lang = language;
        } catch (e) {
            console.error("Could not access localStorage to set language.", e);
        }
    }, [language]);
    
    const [currentView, setCurrentView] = useState<View>(View.Home);
    const [medications, setMedications] = useState<Medication[]>([]);
    const [bloodPressureReadings, setBloodPressureReadings] = useState<BloodPressureReading[]>([]);
    const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
    const [editingBloodPressure, setEditingBloodPressure] = useState<BloodPressureReading | null>(null);
    const [modal, setModal] = useState<ModalState>({ isOpen: false, message: '', onConfirm: null, showCancel: false });
    const [historySearchTerm, setHistorySearchTerm] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);
    const [analysisError, setAnalysisError] = useState<string | null>(null);

    const openModal = useCallback((message: string, onConfirm: (() => void) | null = null, showCancel = false) => {
        setModal({ isOpen: true, message, onConfirm, showCancel });
    }, []);

    const closeModal = () => {
        setModal({ isOpen: false, message: '', onConfirm: null, showCancel: false });
    };

    useEffect(() => {
        try {
            const storedMeds = localStorage.getItem(MEDICATION_STORAGE_KEY);
            if (storedMeds) setMedications(JSON.parse(storedMeds));
            const storedBp = localStorage.getItem(BLOOD_PRESSURE_STORAGE_KEY);
            if (storedBp) setBloodPressureReadings(JSON.parse(storedBp));
        } catch (error) {
            console.error("Failed to load data from storage:", error);
            openModal(t('dataLoadError'), null, false);
        }
    }, [t, openModal]);

    useEffect(() => {
        try {
            localStorage.setItem(MEDICATION_STORAGE_KEY, JSON.stringify(medications));
        } catch (error) {
            console.error("Failed to save medications:", error);
        }
    }, [medications]);

    useEffect(() => {
        try {
            localStorage.setItem(BLOOD_PRESSURE_STORAGE_KEY, JSON.stringify(bloodPressureReadings));
        } catch (error) {
            console.error("Failed to save blood pressure readings:", error);
        }
    }, [bloodPressureReadings]);

    const handleAddOrUpdateMedication = (medData: Omit<Medication, 'id' | 'takenDates'>, id?: number) => {
        if (id) {
            setMedications(meds => meds.map(m => m.id === id ? { ...m, ...medData } : m));
            openModal(t('medicationUpdatedSuccess'), () => setCurrentView(View.Medications));
        } else {
            const newMed = { ...medData, id: Date.now(), takenDates: [] };
            setMedications(meds => [...meds, newMed]);
            openModal(t('medicationAddedSuccess'), () => setCurrentView(View.Medications));
        }
        setEditingMedication(null);
    };

    const handleEditMedication = (med: Medication) => {
        setEditingMedication(med);
        setCurrentView(View.EditMedication);
    };

    const handleDeleteMedication = (id: number) => {
        openModal(t('confirmDeleteMedication'), () => {
            setMedications(meds => meds.filter(m => m.id !== id));
            openModal(t('medicationDeleted'));
        }, true);
    };
    
    const handleMarkTaken = (medId: number, identifier: string) => {
        setMedications(meds => meds.map(m => {
            if (m.id === medId) {
                const today = new Date().toISOString().split('T')[0];
                const newTakenDates = [...m.takenDates, { date: today, identifier }];
                return { ...m, takenDates: newTakenDates };
            }
            return m;
        }));
    };
    
    const handleAddOrUpdateBloodPressure = (readingData: Omit<BloodPressureReading, 'id' | 'date'>, id?: number) => {
        if (id) {
            setBloodPressureReadings(readings => readings.map(r => r.id === id ? { ...r, ...readingData, date: new Date().toISOString() } : r));
            openModal(t('bpReadingUpdatedSuccess'), () => setCurrentView(View.BloodPressure));
        } else {
            const newReading = { ...readingData, id: Date.now(), date: new Date().toISOString() };
            setBloodPressureReadings(readings => [...readings, newReading]);
            openModal(t('bpReadingAddedSuccess'), () => setCurrentView(View.BloodPressure));
        }
        setEditingBloodPressure(null);
    };
    
    const handleEditBloodPressure = (reading: BloodPressureReading) => {
        setEditingBloodPressure(reading);
        setCurrentView(View.EditBloodPressure);
    };

    const handleDeleteBloodPressure = (id: number) => {
        openModal(t('confirmDeleteReading'), () => {
            setBloodPressureReadings(readings => readings.filter(r => r.id !== id));
            openModal(t('readingDeleted'));
        }, true);
    };
    
    const handleBackup = () => {
        try {
            const dataToBackup = {
                medications: medications,
                bloodPressureReadings: bloodPressureReadings,
            };
            const dataStr = JSON.stringify(dataToBackup, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            const exportFileDefaultName = `salud_facil_backup_${new Date().toISOString().split('T')[0]}.json`;
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
            openModal(t('backupSuccess'));
        } catch (error) {
            openModal(t('backupFailed'));
        }
    };
    
    const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        
        openModal(t('confirmRestore'), () => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const text = e.target?.result;
                    if (typeof text !== 'string') {
                        throw new Error('Invalid file content');
                    }
                    const data = JSON.parse(text);
                    if (data.medications && data.bloodPressureReadings) {
                        setMedications(data.medications);
                        setBloodPressureReadings(data.bloodPressureReadings);
                        openModal(t('restoreSuccess'), () => window.location.reload());
                    } else {
                        throw new Error('Invalid backup file structure');
                    }
                } catch (error) {
                    openModal(t('restoreFailed'));
                }
            };
            reader.readAsText(file);
        }, true);
        event.target.value = ''; // Reset file input
    };

    const handleAnalyzeBloodPressure = async () => {
        if (bloodPressureReadings.length < 5) {
            openModal(t('needMoreReadingsForAI'));
            return;
        }

        setIsAnalyzing(true);
        setAnalysisError(null);
        setAnalysisResult(null);

        try {
            if (!process.env.API_KEY) {
                throw new Error("API key is not configured.");
            }
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const readingsForPrompt = bloodPressureReadings
                .slice(-20) // Use last 20 readings for analysis
                .map(r => `${new Date(r.date).toLocaleDateString(language)}: ${r.systolic}/${r.diastolic} mmHg, ${r.pulse} bpm. Notes: ${r.notes || 'N/A'}`)
                .join('\n');
            
            const systemInstruction = `You are a helpful health assistant. Your role is to analyze blood pressure data provided by a user and present observations in a clear, easy-to-understand, and neutral way. You MUST NOT provide medical advice, diagnoses, or treatment recommendations. Your analysis should focus only on identifying patterns, trends, and notable points within the data provided. Your entire response must be in the language: ${language}. Use markdown for formatting, like bullet points.`;
            
            const contents = `Please analyze these blood pressure readings:\n${readingsForPrompt}`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-preview-04-17',
                contents: contents,
                config: {
                    systemInstruction: systemInstruction,
                }
            });

            setAnalysisResult(response.text);

        } catch (error) {
            console.error("AI analysis failed:", error);
            setAnalysisError(t('aiAnalysisError'));
        } finally {
            setIsAnalyzing(false);
        }
    };

    const clearAnalysis = () => {
        setAnalysisResult(null);
        setAnalysisError(null);
    };

    const renderView = () => {
        switch (currentView) {
            case View.Home:
                return <HomeView setCurrentView={setCurrentView} />;
            case View.Medications:
                return <MedicationList medications={medications} markTaken={handleMarkTaken} onDelete={handleDeleteMedication} onEdit={handleEditMedication} />;
            case View.AddMedication:
            case View.EditMedication:
                return <MedicationForm initialData={editingMedication} onSubmit={handleAddOrUpdateMedication} setCurrentView={setCurrentView} openModal={openModal} />;
            case View.BloodPressure:
                return <BloodPressureList readings={bloodPressureReadings} onDelete={handleDeleteBloodPressure} onEdit={handleEditBloodPressure} onAnalyze={handleAnalyzeBloodPressure} isAnalyzing={isAnalyzing} analysisResult={analysisResult} analysisError={analysisError} clearAnalysis={clearAnalysis}/>;
            case View.AddBloodPressure:
            case View.EditBloodPressure:
                return <BloodPressureForm initialData={editingBloodPressure} onSubmit={handleAddOrUpdateBloodPressure} setCurrentView={setCurrentView} openModal={openModal} />;
            case View.History:
                return <HistoryView medications={medications} bloodPressureReadings={bloodPressureReadings} openModal={openModal} searchTerm={historySearchTerm} setSearchTerm={setHistorySearchTerm} />;
            case View.Suggestions:
                return <SuggestionsView openModal={openModal} setCurrentView={setCurrentView} />;
            case View.AboutApp:
                return <AboutView onBackup={handleBackup} onRestore={handleRestore} />;
            case View.HowToUseApp:
                return <HowToUseView />;
            default:
                return <HomeView setCurrentView={setCurrentView} />;
        }
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            <Layout currentView={currentView} setCurrentView={setCurrentView}>
                {renderView()}
                <CustomModal {...modal} onClose={closeModal} />
            </Layout>
        </LanguageContext.Provider>
    );
};

export default App;