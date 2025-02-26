// components/Popup.tsx
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-md w-96">
        <p className="text-lg font-semibold mb-4">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="bg-gray-400 text-gray-900 px-4 py-2 rounded-md hover:bg-gray-500 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;

