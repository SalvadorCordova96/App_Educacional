import React, { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';

const MessageList = ({ messages }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Scroll to bottom every time messages update

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-grow p-4 overflow-y-auto h-96 bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">No hay mensajes aún. ¡Comienza la conversación!</p>
      </div>
    );
  }

  return (
    <div className="flex-grow p-4 overflow-y-auto h-96 bg-gray-100 border rounded-md">
      {messages.map((msg, index) => (
        // Assuming messages have a unique 'id' property for keys
        // If not, using index is a fallback but less ideal for dynamic lists
        <MessageItem key={msg.id || index} message={msg} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
