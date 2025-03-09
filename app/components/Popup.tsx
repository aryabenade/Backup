// // components/Popup.tsx
import React from 'react';

interface PopupProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
}

const Popup: React.FC<PopupProps> = ({ message, onConfirm, onCancel, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <p className="text-lg font-semibold text-gray-800 mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="bg-gray-500 border-2 text-white font-semibold px-6 py-2 border-gray-500 rounded-full hover:bg-gray-600 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-6 py-2 rounded-full font-semibold shadow-md hover:bg-red-700 transition duration-300"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;