// frontend/src/components/chat/MessageBubble.jsx
import React from 'react';

function MessageBubble({ message }) {
  const isUser = message.sender === 'user';
  const bubbleClass = isUser ? 'bg-blue-100 self-end' : 'bg-gray-100 self-start';
  const textClass = isUser ? 'text-blue-800' : 'text-gray-800';

  return (
    <div className={`flex w-full my-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`${bubbleClass} rounded-xl px-4 py-2 max-w-2xl`}>
        <p className={`${textClass} text-sm`}>{message.text}</p>
      </div>
    </div>
  );
}

export default MessageBubble;