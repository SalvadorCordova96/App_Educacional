import React, { createContext, useState, useEffect } from 'react';

const ChatContext = createContext({
  messages: [],
  sendMessage: () => {},
  clearMessages: () => {},
  loading: false,
});

function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Scroll al fondo del chat cuando hay nuevos mensajes
    const chatContainer = document.querySelector('.chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (message) => {
    setLoading(true);
    try {
      // Aquí iría la lógica para enviar el mensaje al backend
      const newMessage = {
        id: Date.now(),
        text: message,
        sender: 'user',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      // Simular respuesta del servidor
      setTimeout(() => {
        const aiResponse = {
          id: Date.now() + 1,
          text: 'Respuesta del asistente...',
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage, clearMessages, loading }}>
      {children}
    </ChatContext.Provider>
  );
}

export { ChatContext, ChatProvider };