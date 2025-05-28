import React, { useState, useEffect, useCallback, useRef } from 'react';
import MessageList from './MessageList'; // Import actual component
import ChatInput from './ChatInput';   // Import actual component

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hola, ¿cómo puedo ayudarte hoy?', sender: 'ai', timestamp: new Date(Date.now() - 180000).toISOString() },
    { id: 2, text: 'Me gustaría saber más sobre las inscripciones.', sender: 'user', timestamp: new Date(Date.now() - 120000).toISOString() },
    { id: 3, text: 'Claro, las inscripciones para el próximo semestre comenzarán el 15 de Agosto. ¿Necesitas detalles específicos?', sender: 'ai', timestamp: new Date(Date.now() - 60000).toISOString() },
  ]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  
  // Simulate AI response
  const getAIResponse = useCallback((userMessageText) => {
    setIsLoadingAI(true);
    // Simulate network delay and AI processing time
    setTimeout(() => {
      let aiResponseText = "Lo siento, no entendí tu pregunta. ¿Podrías reformularla?";
      if (userMessageText.toLowerCase().includes("inscripciones")) {
        aiResponseText = "Las inscripciones están abiertas del 1 al 15 de cada mes. ¿Qué más te gustaría saber?";
      } else if (userMessageText.toLowerCase().includes("horarios")) {
        aiResponseText = "Los horarios de clase se publican una semana antes del inicio de clases en el portal del estudiante.";
      } else if (userMessageText.toLowerCase().includes("ayuda")) {
        aiResponseText = "Estoy aquí para ayudarte. ¿Cuál es tu consulta?";
      } else if (userMessageText.toLowerCase().includes("hola") || userMessageText.toLowerCase().includes("saludos")) {
        aiResponseText = "¡Hola! Es un placer ayudarte hoy. ¿En qué puedo asistirte?";
      }

      setMessages(prevMessages => [
        ...prevMessages,
        { id: Date.now(), text: aiResponseText, sender: 'ai', timestamp: new Date().toISOString() }
      ]);
      setIsLoadingAI(false);
    }, 1200 + Math.random() * 800);
  }, []);

  const handleSendMessage = (text) => {
    if (text.trim() === '') return;

    const newMessage = {
      id: Date.now(), 
      text,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    getAIResponse(text);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-150px)] max-w-2xl mx-auto border rounded shadow-lg bg-white">
      <header className="bg-blue-600 text-white p-4 text-center rounded-t">
        <h1 className="text-xl font-semibold">Asistente Virtual Educacional</h1>
      </header>
      
      <MessageList messages={messages} />
      
      {isLoadingAI && (
        <div className="p-3 text-sm text-gray-500 italic text-center">
          IA Asistente está escribiendo...
        </div>
      )}
      
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoadingAI} />
    </div>
  );
};

export default ChatWindow;