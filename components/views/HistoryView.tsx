
import React, { useMemo } from 'react';
import { Medication, BloodPressureReading } from '../../types';
import { useTranslation, useLanguage } from '../../context/LanguageContext';

type MedicationEvent = { type: 'medication'; name: string; dosage: string; date: string; identifier: string; id: string; };
type BloodPressureEvent = { type: 'bloodPressure'; systolic: number; diastolic: number; pulse: number; notes: string; date: string; time: string; id: string; };
type HistoryEvent = MedicationEvent | BloodPressureEvent;

interface HistoryViewProps {
    medications: Medication[];
    bloodPressureReadings: BloodPressureReading[];
    openModal: (message: string) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ medications, bloodPressureReadings, openModal, searchTerm, setSearchTerm }) => {
    const t = useTranslation();
    const { language } = useLanguage();

    const allEvents: HistoryEvent[] = useMemo(() => {
        const medicationEvents: MedicationEvent[] = medications.flatMap(med =>
            med.takenDates.map(dose => ({
                type: 'medication', name: med.name, dosage: med.dosage, date: dose.date,
                identifier: dose.identifier, id: `${med.id}-${dose.date}-${dose.identifier}`
            }))
        );
        const bpEvents: BloodPressureEvent[] = bloodPressureReadings.map(r => ({
            type: 'bloodPressure', systolic: r.systolic, diastolic: r.diastolic, pulse: r.pulse,
            notes: r.notes, date: new Date(r.date).toISOString().split('T')[0],
            time: new Date(r.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), id: String(r.id)
        }));
        return [...medicationEvents, ...bpEvents]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [medications, bloodPressureReadings]);

    const filteredEvents = useMemo(() => {
        if (!searchTerm) return allEvents;
        const lowercasedTerm = searchTerm.toLowerCase();
        return allEvents.filter(event => {
            if (event.type === 'medication') {
                return event.name.toLowerCase().includes(lowercasedTerm) || event.dosage.toLowerCase().includes(lowercasedTerm);
            } else {
                return String(event.systolic).includes(lowercasedTerm) ||
                       String(event.diastolic).includes(lowercasedTerm) ||
                       (event.notes || '').toLowerCase().includes(lowercasedTerm);
            }
        });
    }, [allEvents, searchTerm]);

    const groupedByDate = useMemo(() => {
        return filteredEvents.reduce((acc, event) => {
            (acc[event.date] = acc[event.date] || []).push(event);
            return acc;
        }, {} as Record<string, HistoryEvent[]>);
    }, [filteredEvents]);

    const exportToCsv = () => {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Tipo,Fecha,Hora/Momento,Medicamento/Sistólica,Dosis/Diastólica,Pulso,Notas\n";
        filteredEvents.forEach(event => {
            let displayIdentifier = '';
            if (event.type === 'medication') {
                if (event.identifier.startsWith('time-')) displayIdentifier = event.identifier.replace('time-', '');
                else if (event.identifier.startsWith('meal-')) displayIdentifier = t(event.identifier.replace('meal-', ''));
                else displayIdentifier = t(event.identifier);
                csvContent += `Medicamento,${event.date},"${displayIdentifier}",${event.name},"${event.dosage}",,\n`;
            } else {
                csvContent += `Tensión Arterial,${event.date},${event.time},${event.systolic},${event.diastolic},${event.pulse},"${(event.notes || '').replace(/"/g, '""')}"\n`;
            }
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "historial_salud_facil.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        openModal(t('exportSuccess'));
    };

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 text-center">{t('fullHistory')}</h2>
            
            <div className="mb-4 sticky top-[80px] z-10 bg-gray-50/90 backdrop-blur-sm py-2">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t('searchHistory')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
                />
            </div>

            {filteredEvents.length > 0 && (
                <button onClick={exportToCsv} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg shadow-md mb-6 transition">
                    {t('exportHistory')}
                </button>
            )}
            
            {Object.keys(groupedByDate).length === 0 ? (
                 <p className="text-center text-gray-500 text-lg mt-10">{searchTerm ? t('noResultsFound') : t('noHistory')}</p>
            ) : (
                <div className="space-y-6">
                    {Object.entries(groupedByDate).map(([date, events]) => (
                        <div key={date} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                                {new Date(new Date(date).getTime() + new Date().getTimezoneOffset() * 60000).toLocaleDateString(language, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </h3>
                            <div className="space-y-3">
                                {events.map(event => (
                                    <div key={event.id} className="flex items-center space-x-3 text-gray-700">
                                        <span className={`text-2xl`}>{event.type === 'medication' ? '💊' : '❤️'}</span>
                                        {event.type === 'medication' ? (
                                            <p className="text-sm sm:text-base">{t('medicationEvent', { name: event.name, dosage: event.dosage })}</p>
                                        ) : (
                                            <p className="text-sm sm:text-base">{t('bpEvent', { systolic: event.systolic, diastolic: event.diastolic, pulse: event.pulse, time: event.time })}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HistoryView;
