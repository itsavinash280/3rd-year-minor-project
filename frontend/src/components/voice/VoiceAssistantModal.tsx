import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mic,
  MicOff,
  Volume2,
  X,
  Send,
  Sparkles,
  RotateCcw,
  Languages,
  ArrowUpRight,
} from 'lucide-react';
import { useVoiceAssistant } from '../../context/VoiceAssistantContext';

export const VoiceAssistantModal: React.FC = () => {
  const {
    isOpen,
    isListening,
    isSpeaking,
    language,
    transcript,
    messages,
    closeVoiceAssistant,
    startListening,
    stopListening,
    setLanguage,
    sendQueryText,
    speakText,
    clearConversation,
  } = useVoiceAssistant();

  const [inputVal, setInputVal] = useState('');

  if (!isOpen) return null;

  const quickPrompts = [
    '🌾 Mere khet ke liye kaunsi fasal achhi rahegi?',
    '💰 Aaj Gehu (Wheat) ka mandi bhav kya hai?',
    '🍂 Patti par peele dhabbe hain, kya dawa daalein?',
    '☀️ Agle 3 din ka mausam kaisa rahega?',
    '📋 PM Kisan Yojana ki kist kab aayegi?',
  ];

  const handleSend = () => {
    if (inputVal.trim()) {
      sendQueryText(inputVal);
      setInputVal('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col h-[640px] max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-agro-900 via-agro-800 to-emerald-800 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-agro-600/50 border border-agro-400/30 flex items-center justify-center text-white relative shadow">
              <Sparkles className="w-6 h-6 text-amber-300" />
              {isSpeaking && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full animate-ping" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">AsraVerse AI Voice Assistant</h3>
                <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                  Live STT/TTS
                </span>
              </div>
              <p className="text-xs text-agro-200">
                Speak in Hindi, Hinglish, or English for instant farming assistance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="flex items-center bg-agro-950/60 rounded-xl p-1 border border-agro-700/50 text-xs">
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  language === 'hi' ? 'bg-amber-400 text-slate-950' : 'text-slate-300 hover:text-white'
                }`}
              >
                हिंदी
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  language === 'en' ? 'bg-amber-400 text-slate-950' : 'text-slate-300 hover:text-white'
                }`}
              >
                English
              </button>
            </div>

            <button
              onClick={clearConversation}
              className="p-2 rounded-xl text-agro-200 hover:bg-agro-800/60 transition"
              title="Reset Conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={closeVoiceAssistant}
              className="p-2 rounded-xl text-agro-200 hover:bg-agro-800/60 transition"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                  m.sender === 'user'
                    ? 'bg-agro-600 text-white rounded-br-none'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                    {m.sender === 'user' ? 'Aapka Prashna (You)' : 'AsraVerse AI'}
                  </span>
                  <span className="text-[10px] opacity-60">{m.timestamp}</span>
                </div>

                <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>

                {/* Suggested Action Link */}
                {m.actionLink && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800">
                    <Link
                      to={m.actionLink}
                      onClick={closeVoiceAssistant}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-agro-100 dark:bg-agro-950 text-agro-700 dark:text-agro-300 text-xs font-bold hover:bg-agro-200 dark:hover:bg-agro-900 transition"
                    >
                      <span>{m.actionLabel || 'View Recommended Action'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}

                {/* Audio re-listen button */}
                {m.sender === 'assistant' && (
                  <button
                    onClick={() => speakText(m.text)}
                    className="mt-2 text-[11px] text-agro-600 dark:text-agro-400 font-semibold flex items-center gap-1 hover:underline"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    Listen Again (फिर से सुनें)
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Real-time Listening Wave Animation */}
          {isListening && (
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 animate-pulse">
              <div className="flex items-center gap-1">
                <span className="wave-bar" />
                <span className="wave-bar" />
                <span className="wave-bar" />
                <span className="wave-bar" />
                <span className="wave-bar" />
              </div>
              <p className="text-xs font-medium text-emerald-800 dark:text-emerald-300">
                Listening... {transcript || 'Boliye, mai sun raha hu...'}
              </p>
            </div>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 overflow-x-auto whitespace-nowrap flex gap-2">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => sendQueryText(prompt)}
              className="text-xs px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-agro-50 hover:text-agro-700 dark:hover:bg-agro-950 dark:hover:text-agro-300 text-slate-700 dark:text-slate-300 transition font-medium border border-slate-200 dark:border-slate-700"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Bottom Voice & Text Input Bar */}
        <div className="p-4 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
          {/* Big Speak Mic Button */}
          <button
            onClick={isListening ? stopListening : startListening}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all transform active:scale-90 shadow-lg ${
              isListening
                ? 'bg-rose-600 hover:bg-rose-700 text-white ring-4 ring-rose-300 animate-pulse'
                : 'bg-gradient-to-r from-agro-600 to-emerald-600 hover:from-agro-700 hover:to-emerald-700 text-white shadow-agro-600/30'
            }`}
            title={isListening ? 'Stop Recording' : 'Press to Speak'}
          >
            {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
          </button>

          {/* Text Input */}
          <div className="flex-1 flex items-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-700 px-4 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-agro-500">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Or type your agricultural question here..."
              className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!inputVal.trim()}
              className="ml-2 p-2 rounded-xl bg-agro-600 text-white disabled:opacity-40 hover:bg-agro-700 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
