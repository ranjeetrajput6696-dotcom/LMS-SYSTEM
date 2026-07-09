/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  User, 
  Send, 
  Mic, 
  ChevronRight, 
  Sparkles, 
  Calculator, 
  History as HistoryIcon, 
  Biohazard, 
  Loader2, 
  Volume2
} from 'lucide-react';
import { ChatMessage } from '../types';

export default function AITutor() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: "Welcome back! I've analyzed your academic schedule and upcoming midterms. Shall we start with Newton's Laws of Motion, or continue with Thermodynamics?",
      timestamp: 'Just now'
    }
  ]);
  
  const [inputValue, setInputValue] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Create user message
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Fetch response from server-side Gemini endpoint
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: textToSend,
          history: messages.map(m => ({
            role: m.sender === 'user' ? 'user' : 'model',
            text: m.text
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Gemini server error');
      }

      const data = await response.json();
      
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.text || "I apologize, I'm having trouble connecting right now. Let's try again in a moment.",
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: "I encountered a little hiccup while looking that up. Please check your internet connection or your API key settings in the secrets panel.",
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      // Simulate listening speech-to-text
      setTimeout(() => {
        setIsListening(false);
        setInputValue("Explain Newton's Second Law of Motion.");
      }, 2500);
    }
  };

  const handleChipClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleRecentQueryClick = (query: string) => {
    handleSendMessage(`Can you review "${query}" with me?`);
  };

  const handleTextToSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel existing speech
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] pb-16">
      {/* Welcome Panel */}
      <section className="bg-gradient-to-r from-[#1a237e] to-[#283593] text-white p-5 rounded-2xl shadow-sm relative overflow-hidden mb-4 flex-shrink-0">
        <div className="absolute right-4 top-2 opacity-15">
          <Bot size={100} />
        </div>
        <div className="relative z-10 space-y-1">
          <h2 className="text-xl font-bold tracking-tight">AI Tutor Workspace 👋</h2>
          <p className="text-xs text-indigo-100 font-light">What are we learning today? I'm ready to help you crush your exams.</p>
        </div>
      </section>

      {/* Suggestion Chips */}
      <section className="mb-4 flex-shrink-0 overflow-x-auto py-1 scrollbar-hide">
        <div className="flex gap-2.5 whitespace-nowrap">
          <button 
            onClick={() => handleChipClick("Explain the Pythagoras Theorem in simple terms.")}
            className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 rounded-full text-xs font-semibold text-[#1a237e] shadow-sm transition-all active:scale-95"
          >
            <Calculator size={14} className="text-amber-500" />
            Explain Math Theorem
          </button>
          <button 
            onClick={() => handleChipClick("Summarize the causes of the French Revolution.")}
            className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 rounded-full text-xs font-semibold text-[#1a237e] shadow-sm transition-all active:scale-95"
          >
            <HistoryIcon size={14} className="text-indigo-500" />
            Summarize History Chapter
          </button>
          <button 
            onClick={() => handleChipClick("Give me a 3-question quiz on photosynthesis.")}
            className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 rounded-full text-xs font-semibold text-[#1a237e] shadow-sm transition-all active:scale-95"
          >
            <Biohazard size={14} className="text-emerald-500" />
            Quiz Me on Science
          </button>
        </div>
      </section>

      {/* Chat Messages Log */}
      <div className="flex-grow overflow-y-auto pr-1 space-y-4 scrollbar-hide">
        {messages.map((m) => (
          <div 
            key={m.id} 
            className={`flex gap-3 max-w-[85%] ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm ${
              m.sender === 'user' 
                ? 'bg-indigo-700 text-white' 
                : 'bg-amber-500 text-amber-950'
            }`}>
              {m.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>

            <div className="space-y-1">
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                m.sender === 'user' 
                  ? 'bg-gradient-to-br from-[#1a237e] to-indigo-800 text-white rounded-tr-none' 
                  : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none shadow-sm'
              }`}>
                {m.text}
                
                {/* Speech read-out for bot response */}
                {m.sender === 'ai' && (
                  <div className="mt-2.5 pt-2 border-t border-slate-50 flex justify-end">
                    <button 
                      onClick={() => handleTextToSpeech(m.text)}
                      className="text-indigo-600 hover:text-indigo-800 p-1 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1 text-[10px] font-bold"
                      title="Speak Text"
                    >
                      <Volume2 size={12} />
                      Read Aloud
                    </button>
                  </div>
                )}
              </div>
              <p className={`text-[10px] text-slate-400 font-medium px-1 ${
                m.sender === 'user' ? 'text-right' : ''
              }`}>
                {m.timestamp}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 max-w-[85%]">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-amber-950 flex items-center justify-center shadow-sm">
              <Bot size={16} />
            </div>
            <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Loader2 size={14} className="animate-spin text-amber-500" />
              AI Study Buddy is thinking...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />

        {/* Recent Queries Grid Section (Static references that populate search) */}
        {messages.length === 1 && (
          <div className="pt-6 border-t border-slate-100 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Recent Queries</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div 
                onClick={() => handleRecentQueryClick("Photosynthesis stages")}
                className="p-3.5 bg-white border border-slate-100 rounded-2xl flex items-center justify-between hover:shadow-md cursor-pointer transition-all active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
                    <Biohazard size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Photosynthesis stages</p>
                    <p className="text-[10px] text-slate-400">Yesterday • 15 min chat</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-400" />
              </div>

              <div 
                onClick={() => handleRecentQueryClick("Calculus Derivatives")}
                className="p-3.5 bg-white border border-slate-100 rounded-2xl flex items-center justify-between hover:shadow-md cursor-pointer transition-all active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
                    <Calculator size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Calculus Derivatives</p>
                    <p className="text-[10px] text-slate-400">2 days ago • 42 min chat</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-400" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Input sticky block */}
      <section className="mt-4 flex-shrink-0">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }}
          className={`flex items-center gap-2 bg-white p-1.5 rounded-full border border-slate-200 shadow-md ${
            isListening ? 'ring-2 ring-red-500/50' : 'focus-within:ring-2 focus-within:ring-indigo-500/30'
          } transition-all`}
        >
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isListening ? "Listening... Speak now" : "Ask anything about your curriculum..."}
            disabled={isListening}
            className="flex-grow bg-transparent border-none outline-none focus:ring-0 text-sm font-medium px-4 text-slate-800"
          />
          <div className="flex items-center gap-1 pr-1.5">
            <button 
              type="button"
              onClick={handleMicClick}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isListening 
                  ? 'bg-rose-500 text-white animate-pulse' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
              title="Voice Input (STT)"
            >
              <Mic size={18} />
            </button>
            <button 
              type="submit"
              disabled={!inputValue.trim() && !isListening}
              className="w-10 h-10 rounded-full bg-[#1a237e] hover:bg-indigo-800 disabled:bg-slate-100 text-white disabled:text-slate-400 flex items-center justify-center shadow-sm hover:shadow active:scale-95 transition-all"
            >
              <Send size={16} />
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
