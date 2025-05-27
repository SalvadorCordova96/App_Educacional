import React, { useEffect, useState } from 'react';
import ChatInput from './ChatInput';
import MessageBubble from './MessageBubble';

function ChatWin() {
  const [messages, setMessages] = useState([
    { id: 1, text: '¡Hola! ¿En qué puedo ayudarte hoy?', sender: 'ai' }
  ]);

  useEffect(() => {
    // Scroll al fondo del chat cuando hay nuevos mensajes
    const chatContainer = document.querySelector('.chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  const handleMessageSend = (message) => {
    setMessages(prevMessages => [
      ...prevMessages,
      { id: Date.now(), text: message, sender: 'user' }
    ]);
  };

  return (
    <div className="chat-container flex flex-col h-full w-full">
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>
      <ChatInput onSend={handleMessageSend} />
    </div>
  );
}

export default ChatWin;
