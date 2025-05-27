// frontend/src/components/chat/ChatWindow.jsx
import React, { useRef, useEffect } from 'react';
import ChatInput from './ChatInput';
import MessageBubble from './MessageBubble';

function ChatWindow() {
  const messages = [
    { id: 1, text: 'Hola, ¿en qué puedo ayudarte?', sender: 'ai' },
    { id: 2, text: 'Hola, tengo una pregunta sobre matemáticas.', sender: 'user' },
    // ... más mensajes
  ];
  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Scroll al fondo del chat cuando hay nuevos mensajes
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col overflow-hidden border rounded-lg h-96">
      <div className="flex-grow px-4 py-2 overflow-y-auto" ref={chatContainerRef}>
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>
      <ChatInput />
    </div>
  );
}

export default ChatWindow;