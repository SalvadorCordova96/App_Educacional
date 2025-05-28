import React from 'react';

const MessageItem = ({ message }) => {
  const { text, sender, timestamp } = message;
  const isUser = sender === 'user';

  // Basic styling for message bubbles
  const bubbleClasses = isUser 
    ? 'bg-blue-500 text-white self-end ml-auto' 
    : 'bg-gray-200 text-gray-800 self-start mr-auto';
  
  const containerClasses = isUser ? 'flex justify-end' : 'flex justify-start';

  return (
    <div className={`mb-3 ${containerClasses}`}>
      <div className={`p-3 rounded-lg shadow-md max-w-xs md:max-w-md ${bubbleClasses}`}>
        <p className="text-sm font-semibold mb-1">
          {isUser ? 'Tú' : 'IA Asistente'}
        </p>
        <p className="text-base">{text}</p>
        {timestamp && (
          <p className={`text-xs mt-1 ${isUser ? 'text-blue-200' : 'text-gray-500'}`}>
            {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
