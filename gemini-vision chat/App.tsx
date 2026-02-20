
import React, { useRef, useEffect } from 'react';
import { ChatInput } from './components/ChatInput';
import { ChatMessage } from './components/ChatMessage';
import { useChat } from './hooks/useChat';
import { GeminiIcon } from './components/Icons';

const App: React.FC = () => {
  const { messages, sendMessage, isLoading, error } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
      <header className="p-4 border-b border-gray-700 shadow-lg bg-gray-800/50 backdrop-blur-md sticky top-0 z-10">
        <h1 className="text-xl font-bold flex items-center gap-2">
            <GeminiIcon className="w-6 h-6" />
            <span>Gemini Vision Chat</span>
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {/* FIX: Pass isLoading state to the last message if it's a model response placeholder. */}
        {messages.map((msg, index) => (
          <ChatMessage
            key={index}
            message={msg}
            isLoading={isLoading && index === messages.length - 1 && msg.role === 'model'}
          />
        ))}
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 md:p-6 bg-gray-900 border-t border-gray-700">
        {error && <div className="text-red-500 text-center mb-2">{error}</div>}
        <div className="max-w-4xl mx-auto">
          <ChatInput onSend={sendMessage} disabled={isLoading} />
        </div>
      </footer>
    </div>
  );
};

export default App;
