
import React, { useState, useEffect } from 'react';
import { BloodPressureReading, View } from '../../types';
import { useTranslation } from '../../context/LanguageContext';

interface BloodPressureFormProps {
    initialData: BloodPressureReading | null;
    onSubmit: (readingData: Omit<BloodPressureReading, 'id' | 'date'>, id?: number) => void;
    setCurrentView: (view: View) => void;
    openModal: (message: string, onConfirm: (() => void) | null, showCancel?: boolean) => void;
}

const BloodPressureForm: React.FC<BloodPressureFormProps> = ({ initialData, onSubmit, setCurrentView, openModal }) => {
    const t = useTranslation();
    const [systolic, setSystolic] = useState('');
    const [diastolic, setDiastolic] = useState('');
    const [pulse, setPulse] = useState('');
    const [notes, setNotes] = useState('');
    const [reminderTime, setReminderTime] = useState('');
    const [reminderDays, setReminderDays] = useState<string[]>([]);

    useEffect(() => {
        if (initialData && initialData.id) {
            setSystolic(String(initialData.systolic || ''));
            setDiastolic(String(initialData.diastolic || ''));
            setPulse(String(initialData.pulse || ''));
            setNotes(initialData.notes || '');
            setReminderTime(initialData.reminderTime || '');
            setReminderDays(initialData.reminderDays || []);
        } else {
            setSystolic(''); setDiastolic(''); setPulse(''); setNotes(''); setReminderTime(''); setReminderDays([]);
        }
    }, [initialData]);

    const handleReminderDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setReminderDays(prev => checked ? [...prev, value] : prev.filter(day => day !== value));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!systolic || !diastolic || !pulse) { openModal(t('fillAllFields'), null, false); return; }
        onSubmit({ systolic: parseInt(systolic), diastolic: parseInt(diastolic), pulse: parseInt(pulse), notes, reminderTime, reminderDays }, initialData?.id);
    };

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">{initialData?.id ? t('editReading') : t('addReading')}</h2>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-4">
                <div>
                    <label htmlFor="systolic" className="block text-gray-700 text-sm font-semibold mb-2">{t('systolic')}</label>
                    <input type="number" id="systolic" value={systolic} onChange={(e) => setSystolic(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition" required />
                </div>
                <div>
                    <label htmlFor="diastolic" className="block text-gray-700 text-sm font-semibold mb-2">{t('diastolic')}</label>
                    <input type="number" id="diastolic" value={diastolic} onChange={(e) => setDiastolic(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition" required />
                </div>
                <div>
                    <label htmlFor="pulse" className="block text-gray-700 text-sm font-semibold mb-2">{t('pulse')}</label>
                    <input type="number" id="pulse" value={pulse} onChange={(e) => setPulse(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition" required />
                </div>
                <div>
                    <label htmlFor="notes" className="block text-gray-700 text-sm font-semibold mb-2">{t('notesOptional')}</label>
                    <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"></textarea>
                </div>
                <div className="border-t pt-4 mt-4 border-gray-200">
                    <p className="text-gray-700 text-base font-semibold mb-3">{t('setReminder')}</p>
                    <div className="mb-4">
                        <label htmlFor="reminderTime" className="block text-gray-700 text-sm font-semibold mb-2">{t('reminderTime')}</label>
                        <input type="time" id="reminderTime" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition bg-white" />
                    </div>
                    <div>
                        <p className="block text-gray-700 text-sm font-semibold mb-2">{t('reminderDays')}:</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">{['0', '1', '2', '3', '4', '5', '6'].map((day, index) => (<label key={day} className="flex items-center space-x-2"><input type="checkbox" value={day} checked={reminderDays.includes(day)} onChange={handleReminderDayChange} className="form-checkbox h-5 w-5 text-blue-600 rounded" /><span className="text-gray-700 text-base">{[t('sunday'), t('monday'), t('tuesday'), t('wednesday'), t('thursday'), t('friday'), t('saturday')][index]}</span></label>))}</div>
                    </div>
                </div>
                <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition shadow-lg transform hover:scale-105">{initialData?.id ? t('updateReading') : t('saveReading')}</button>
                <button type="button" onClick={() => setCurrentView(View.BloodPressure)} className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-4 rounded-lg mt-2 transition shadow-md">{t('cancel')}</button>
            </form>
        </div>
    );
};

export default BloodPressureForm;
