
import React from 'react';
import { useTranslation } from '../../context/LanguageContext';

interface CustomModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: (() => void) | null;
  showCancel: boolean;
  onClose: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({ isOpen, message, onConfirm, showCancel, onClose }) => {
  const t = useTranslation();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm flex flex-col items-center text-center">
        <p className="text-gray-800 text-lg mb-6">{message}</p>
        <div className="flex space-x-4">
          <button
            onClick={() => { onConfirm && onConfirm(); onClose(); }}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 ease-in-out shadow-md"
          >
            {t('accept')}
          </button>
          {showCancel && (
            <button
              onClick={onClose}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 ease-in-out shadow-md"
            >
              {t('cancel')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
