// frontend/src/components/common/Button.jsx
import React from 'react';

function Button({ children, onClick, type = 'button', className = '', ...props }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full py-2 px-4 rounded-lg bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900 text-white font-bold shadow-md transition-all duration-300 hover:from-blue-800 hover:to-blue-800 hover:shadow-blue-400/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black/60 ${className}`}
      style={{boxShadow: '0 0 8px 2px rgba(0, 30, 80, 0.3)'}}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;