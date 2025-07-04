
import React, { useState, useEffect } from 'react';
import { Medication, View } from '../../types';
import { useTranslation } from '../../context/LanguageContext';

interface MedicationFormProps {
    initialData: Medication | null;
    onSubmit: (medData: Omit<Medication, 'id' | 'takenDates'>, id?: number) => void;
    setCurrentView: (view: View) => void;
    openModal: (message: string, onConfirm: (() => void) | null, showCancel?: boolean) => void;
}

const MedicationForm: React.FC<MedicationFormProps> = ({ initialData, onSubmit, setCurrentView, openModal }) => {
    const t = useTranslation();
    const [name, setName] = useState('');
    const [dosage, setDosage] = useState('');
    const [frequency, setFrequency] = useState<Medication['frequency']>('daily');
    const [days, setDays] = useState<string[]>([]);
    const [times, setTimes] = useState<string[]>(['08:00']);
    const [mealTimes, setMealTimes] = useState<Medication['mealTimes']>([]);

    useEffect(() => {
        if (initialData && initialData.id) {
            setName(initialData.name || '');
            setDosage(initialData.dosage || '');
            setFrequency(initialData.frequency || 'daily');
            setDays(initialData.days || []);
            setTimes(initialData.times?.length > 0 ? initialData.times : ['08:00']);
            setMealTimes(initialData.mealTimes || []);
        } else {
            setName('');
            setDosage('');
            setFrequency('daily');
            setDays([]);
            setTimes(['08:00']);
            setMealTimes([]);
        }
    }, [initialData]);

    const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setDays(prev => checked ? [...prev, value] : prev.filter(day => day !== value));
    };

    const handleTimeChange = (index: number, value: string) => {
        const newTimes = [...times];
        newTimes[index] = value;
        setTimes(newTimes);
    };
    
    const addTimeField = () => setTimes(prev => [...prev, '']);
    const removeTimeField = (index: number) => setTimes(prev => prev.filter((_, i) => i !== index));

    const handleMealTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setMealTimes(prev => checked ? [...prev, value as Medication['mealTimes'][0]] : prev.filter(meal => meal !== value));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !dosage) { openModal(t('fillAllFields'), null, false); return; }
        if (frequency === 'weekly' && days.length === 0) { openModal(t('selectAtLeastOneDay'), null, false); return; }
        if (frequency === 'specific_time' && times.some(time => !time)) { openModal(t('enterAllTimes'), null, false); return; }
        if (frequency === 'meal_time' && mealTimes.length === 0) { openModal(t('selectMealTime'), null, false); return; }

        onSubmit({ name, dosage, frequency, days, times, mealTimes }, initialData?.id);
    };

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">{initialData?.id ? t('editMedication') : t('addMedication')}</h2>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-4">
                <div>
                    <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-2">{t('medicationName')}</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150" required />
                </div>
                <div>
                    <label htmlFor="dosage" className="block text-gray-700 text-sm font-semibold mb-2">{t('dosage')}</label>
                    <input type="text" id="dosage" value={dosage} onChange={(e) => setDosage(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150" required />
                </div>
                <div>
                    <label htmlFor="frequency" className="block text-gray-700 text-sm font-semibold mb-2">{t('frequency')}</label>
                    <select id="frequency" value={frequency} onChange={(e) => setFrequency(e.target.value as Medication['frequency'])} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 bg-white">
                        <option value="daily">{t('daily')}</option>
                        <option value="weekly">{t('weekly')}</option>
                        <option value="specific_time">{t('specificTime')}</option>
                        <option value="meal_time">{t('withMeals')}</option>
                    </select>
                </div>
                {frequency === 'weekly' && <div><p className="block text-gray-700 text-sm font-semibold mb-2">{t('daysOfWeek')}</p><div className="grid grid-cols-2 sm:grid-cols-4 gap-2">{['0', '1', '2', '3', '4', '5', '6'].map((day, index) => (<label key={day} className="flex items-center space-x-2"><input type="checkbox" value={day} checked={days.includes(day)} onChange={handleDayChange} className="form-checkbox h-5 w-5 text-blue-600 rounded" /><span className="text-gray-700 text-base">{[t('sunday'), t('monday'), t('tuesday'), t('wednesday'), t('thursday'), t('friday'), t('saturday')][index]}</span></label>))}</div></div>}
                {frequency === 'specific_time' && <div><label className="block text-gray-700 text-sm font-semibold mb-2">{t('times')}:</label>{times.map((time, index) => (<div key={index} className="flex items-center mb-2"><input type="time" value={time} onChange={(e) => handleTimeChange(index, e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 mr-2" required />{times.length > 1 && (<button type="button" onClick={() => removeTimeField(index)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full focus:outline-none transition duration-150 shadow-md" aria-label={t('removeTime')}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg></button>)}</div>))}<button type="button" onClick={addTimeField} className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 ease-in-out shadow-md">{t('addAnotherTime')}</button></div>}
                {frequency === 'meal_time' && <div><p className="block text-gray-700 text-sm font-semibold mb-2">{t('mealTimes')}</p><div className="flex flex-col space-y-2">{['breakfast', 'lunch', 'dinner'].map((meal) => (<label key={meal} className="flex items-center space-x-2"><input type="checkbox" value={meal} checked={mealTimes.includes(meal as any)} onChange={handleMealTimeChange} className="form-checkbox h-5 w-5 text-blue-600 rounded" /><span className="text-gray-700 text-base">{t(meal)}</span></label>))}</div></div>}
                <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200 ease-in-out shadow-lg transform hover:scale-105">{initialData?.id ? t('updateMedication') : t('saveMedication')}</button>
                <button type="button" onClick={() => setCurrentView(View.Medications)} className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-4 rounded-lg mt-2 transition duration-200 ease-in-out shadow-md">{t('cancel')}</button>
            </form>
        </div>
    );
};

export default MedicationForm;
