
import React, { useState, useEffect } from 'react';
import { ChatMessage, MoodEntry } from './types';
import { generateResponse } from './services/geminiService';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import MoodTracker from './components/MoodTracker';
import MoodHistoryModal from './components/MoodHistoryModal';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      text: "Hello! I'm SereneAI, your personal wellness companion. How are you feeling today? Feel free to share anything on your mind, or even an image that represents your mood.",
      sender: 'bot'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('moodHistory');
      if (savedHistory) {
        setMoodHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error("Failed to load mood history from localStorage", error);
    }
  }, []);

  const handleSendMessage = async (prompt: string, imageFile?: File) => {
    if (!prompt && !imageFile) return;

    let imageUrl: string | undefined;
    if (imageFile) {
        imageUrl = URL.createObjectURL(imageFile);
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: prompt,
      sender: 'user',
      image: imageUrl
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const botResponseText = await generateResponse(prompt, imageFile || null);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        sender: 'bot',
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
        const errorMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            text: 'I seem to be having trouble connecting right now. Please try again in a moment.',
            sender: 'bot',
        };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogMood = (mood: MoodEntry['mood']) => {
    const newEntry: MoodEntry = { mood, timestamp: new Date().toISOString() };
    const updatedHistory = [newEntry, ...moodHistory];
    
    setMoodHistory(updatedHistory);
    try {
        localStorage.setItem('moodHistory', JSON.stringify(updatedHistory));
    } catch (error) {
        console.error("Failed to save mood history to localStorage", error);
    }

    const moodConfirmationMessage: ChatMessage = {
      id: Date.now().toString(),
      text: `Thanks for logging your mood! You're feeling: ${mood}.`,
      sender: 'bot',
    };
    setMessages(prev => [...prev, moodConfirmationMessage]);
  };


  return (
    <div className="h-screen w-screen flex flex-col bg-teal-50/50 font-sans">
        <Header onShowHistory={() => setIsHistoryModalOpen(true)} />
        <ChatWindow messages={messages} isLoading={isLoading} />
        <div className="bg-gray-100/80 backdrop-blur-sm border-t border-gray-200">
            <MoodTracker onLogMood={handleLogMood} />
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
        <MoodHistoryModal 
            history={moodHistory} 
            isOpen={isHistoryModalOpen} 
            onClose={() => setIsHistoryModalOpen(false)} 
        />
    </div>
  );
};

export default App;
