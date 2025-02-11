// components/FormReminder.tsx
import React from 'react';

type FormReminderProps = {
  message: string;
};

const FormReminder: React.FC<FormReminderProps> = ({ message }) => {
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
      <p className="font-bold">Important Reminder</p>
      <p>{message}</p>
    </div>
  );
};

export default FormReminder;
