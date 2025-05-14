// SubmitButton.js
import React from 'react';

const SubmitButton = ({ label }) => {
  return (
    <button
      type="submit"
      className="w-full bg-green_700 text-white font-semibold py-2 px-4 rounded-md hover:bg-green_800 focus:outline-none focus:ring-2 focus:ring-green_500 focus:ring-opacity-50"
    >
      {label}
    </button>
  );
};

export default SubmitButton;
