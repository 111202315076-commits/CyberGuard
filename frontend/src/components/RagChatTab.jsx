import React, { useState } from 'react';
import { Send, Sparkles, User, Bot, RefreshCw } from 'lucide-react';

export default function RagChatTab() {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Halo! Saya Asisten AI SiberGuard. Ada yang bisa saya bantu terkait analisis URL, fitur keamanan, atau dokumen?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/chat-rag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage })
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: data.answer || 'Maaf, terjadi kendala saat memproses jawaban.' }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Sistem RAG offline/tidak merespon. Pastikan backend Flask sudah aktif.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#0f172a] rounded-2xl border border-slate-800/80 h-[calc(100vh-140px)] flex flex-col overflow-hidden">
      {/* Header Chat */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/10 border border-blue-500/20 text-sky-400 rounded-xl">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Asisten AI</h3>
            <p className="text-[11px] text-slate-400">Context-Aware Phishing Threat Intelligence</p>
          </div>
        </div>
      </div>

      {/* Bubble Chat Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start space-x-3 ${
              msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div
              className={`p-2 rounded-xl text-xs ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 border border-slate-700/60'
              }`}
            >
              {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div
              className={`max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-600/15 text-sky-200 border border-blue-500/30'
                  : 'bg-slate-800/80 text-slate-200 border border-slate-700/50'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2 text-slate-400 text-xs">
            <RefreshCw size={14} className="animate-spin text-sky-400" />
            <span>Asisten AI sedang berpikir...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tanyakan sesuatu tentang analisis Phishing, Shannon Entropy, atau RAG..."
          className="flex-1 bg-[#0b0f19] border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-xl text-xs flex items-center space-x-1 transition-all shadow-md shadow-blue-600/30"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}