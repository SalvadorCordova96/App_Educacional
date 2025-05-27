// frontend/src/components/common/TextInput.jsx
import React from 'react';

function TextInput({ label, type = 'text', value, onChange, placeholder, error, required, ...props }) {
  return (
    <div className="mb-4">
      {label && <label htmlFor={label} className="block text-white text-sm font-semibold mb-2">{label}</label>}
      <input
        type={type}
        id={label}
        className={`w-full px-4 py-2 rounded-lg bg-black bg-opacity-70 border-2 border-transparent focus:border-blue-900 focus:ring-2 focus:ring-blue-400 focus:outline-none text-white transition-all duration-300 shadow-md hover:shadow-blue-900/30 ${error ? 'border-red-500' : ''}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default TextInput;