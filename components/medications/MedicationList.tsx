
import React from 'react';
import { Medication } from '../../types';
import { useTranslation } from '../../context/LanguageContext';

interface MedicationListProps {
    medications: Medication[];
    markTaken: (medId: number, identifier: string) => void;
    onDelete: (id: number) => void;
    onEdit: (med: Medication) => void;
}

const MedicationList: React.FC<MedicationListProps> = ({ medications, markTaken, onDelete, onEdit }) => {
    const t = useTranslation();
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const dayOfWeek = now.getDay().toString();

    const isWithinMealTime = (meal: string) => {
        const time = now.getHours() * 60 + now.getMinutes();
        switch (meal) {
            case 'breakfast': return time >= 360 && time < 600; // 06:00 - 10:00
            case 'lunch': return time >= 720 && time < 900; // 12:00 - 15:00
            case 'dinner': return time >= 1080 && time < 1320; // 18:00 - 22:00
            default: return false;
        }
    };

    const generateScheduledDoses = (med: Medication) => {
        const doses: { medId: number; identifier: string; display: string; taken: boolean; isCurrentTimeWindow: boolean }[] = [];
        const isTakenToday = (identifier: string) => med.takenDates.some(d => d.date === today && d.identifier === identifier);

        switch (med.frequency) {
            case 'daily':
                doses.push({ medId: med.id, identifier: 'daily', display: t('daily'), taken: isTakenToday('daily'), isCurrentTimeWindow: true });
                break;
            case 'weekly':
                if (med.days.includes(dayOfWeek)) {
                    doses.push({ medId: med.id, identifier: `weekly-${dayOfWeek}`, display: t('weekly'), taken: isTakenToday(`weekly-${dayOfWeek}`), isCurrentTimeWindow: true });
                }
                break;
            case 'specific_time':
                med.times.forEach(time => {
                    const [hour, minute] = time.split(':').map(Number);
                    const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0).getTime();
                    const timeIdentifier = `time-${time}`;
                    doses.push({ medId: med.id, identifier: timeIdentifier, display: time, taken: isTakenToday(timeIdentifier), isCurrentTimeWindow: (now.getTime() >= targetTime - 1800000 && now.getTime() <= targetTime + 1800000) });
                });
                break;
            case 'meal_time':
                med.mealTimes.forEach(meal => {
                    const mealIdentifier = `meal-${meal}`;
                    doses.push({ medId: med.id, identifier: mealIdentifier, display: t(meal), taken: isTakenToday(mealIdentifier), isCurrentTimeWindow: isWithinMealTime(meal) });
                });
                break;
        }
        return doses;
    };
    
    const medicationsWithDoses = medications
        .map(med => ({ ...med, scheduledDoses: generateScheduledDoses(med) }))
        .sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">{t('yourMedications')}</h2>
            
            {medicationsWithDoses.length === 0 ? (
                <div className="text-center py-10 px-4">
                  <div className="mx-auto w-24 h-24 text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <p className="text-center text-gray-500 text-lg mt-4">{t('noMedications')}</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {medicationsWithDoses.map(med => (
                        <div key={med.id} className="bg-white rounded-lg shadow-md border border-gray-200 transition-all duration-300">
                            <div className="p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">{med.name}</h3>
                                        <p className="text-gray-500">{med.dosage}</p>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <button onClick={() => onEdit(med)} className="p-2 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-gray-100" aria-label={t('editMedication')}><EditIcon /></button>
                                        <button onClick={() => onDelete(med.id)} className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100" aria-label={t('deleteMedication')}><DeleteIcon /></button>
                                    </div>
                                </div>
                            </div>
                            
                            {med.scheduledDoses.length > 0 && (
                                <div className="border-t border-gray-200 px-4 py-3">
                                    <h4 className="text-sm font-semibold text-gray-600 mb-2">{t('dosesForToday')}</h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {med.scheduledDoses.map((dose, index) => (
                                            <button 
                                                key={index}
                                                onClick={() => !dose.taken && markTaken(dose.medId, dose.identifier)}
                                                disabled={dose.taken}
                                                className={`flex items-center justify-center p-2 rounded-lg text-sm font-semibold transition-colors w-full ${dose.taken ? 'bg-green-100 text-green-700 cursor-default' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                                            >
                                                {dose.taken ? <CheckIcon /> : <ClockIcon />}
                                                <span className="ml-2">{dose.display}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            
            <button onClick={() => onEdit({} as Medication)} className="fixed bottom-24 right-4 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300" aria-label={t('addMedication')}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            </button>
        </div>
    );
};

const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;


export default MedicationList;
