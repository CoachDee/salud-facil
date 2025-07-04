
export type Language = 'es' | 'it' | 'en' | 'de';

export enum View {
  Home = 'home',
  Medications = 'medications',
  AddMedication = 'addMedication',
  EditMedication = 'editMedication',
  BloodPressure = 'bloodPressure',
  AddBloodPressure = 'addBloodPressure',
  EditBloodPressure = 'editBloodPressure',
  History = 'history',
  Suggestions = 'suggestions',
  AboutApp = 'aboutApp',
  HowToUseApp = 'howToUseApp',
}

export interface Dose {
  date: string;
  identifier: string;
}

export interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: 'daily' | 'weekly' | 'specific_time' | 'meal_time';
  days: string[];
  times: string[];
  mealTimes: ('breakfast' | 'lunch' | 'dinner')[];
  takenDates: Dose[];
}

export interface BloodPressureReading {
  id: number;
  systolic: number;
  diastolic: number;
  pulse: number;
  notes: string;
  date: string; // ISO string
  reminderTime: string;
  reminderDays: string[];
}

export interface ModalState {
  isOpen: boolean;
  message: string;
  onConfirm: (() => void) | null;
  showCancel: boolean;
}
