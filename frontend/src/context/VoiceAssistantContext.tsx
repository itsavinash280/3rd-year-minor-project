import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { apiRequest } from '../api/client';

export interface VoiceMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionLink?: string;
  actionLabel?: string;
}

interface VoiceAssistantContextType {
  isOpen: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  language: 'hi' | 'en' | 'hinglish';
  transcript: string;
  messages: VoiceMessage[];
  openVoiceAssistant: () => void;
  closeVoiceAssistant: () => void;
  startListening: () => void;
  stopListening: () => void;
  setLanguage: (lang: 'hi' | 'en' | 'hinglish') => void;
  sendQueryText: (text: string) => Promise<void>;
  speakText: (text: string) => void;
  clearConversation: () => void;
}

const VoiceAssistantContext = createContext<VoiceAssistantContextType | undefined>(undefined);

export const VoiceAssistantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [language, setLanguage] = useState<'hi' | 'en' | 'hinglish'>('hi');
  const [transcript, setTranscript] = useState<string>('');
  const [messages, setMessages] = useState<VoiceMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: 'Namaste Kisan Bhai! Mai AsraVerse AI voice assistant hu. Aap mujhse fasal recommendation, patti ki bimari, mandi bhav, ya mausam ke bare me bol kar puch sakte hain.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Web Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        setTranscript(text);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.warn('[Speech Recognition Error]:', event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  const startListening = () => {
    setTranscript('');
    setIsListening(true);
    try {
      if (recognitionRef.current) {
        recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
        recognitionRef.current.start();
      }
    } catch (e) {
      console.warn('Speech recognition start failed or already active:', e);
    }
  };

  const stopListening = () => {
    setIsListening(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (transcript.trim()) {
      sendQueryText(transcript);
    }
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const sendQueryText = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: VoiceMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setTranscript('');

    const res = await apiRequest('/ai/voice/process', {
      method: 'POST',
      body: JSON.stringify({ transcription: text, language }),
    });

    let answer = 'Namaste Kisan Bhai. Mai aapki baat samajh gaya hu.';
    let actionLabel: string | undefined;
    let actionLink: string | undefined;

    if (res.success && res.response) {
      answer = res.response.responseText;
      if (res.response.suggestedActions && res.response.suggestedActions.length > 0) {
        actionLabel = res.response.suggestedActions[0].label;
        actionLink = res.response.suggestedActions[0].link;
      }
    } else {
      // Fallback intent locally if offline
      const t = text.toLowerCase();
      if (t.includes('fasal') || t.includes('crop') || t.includes('ugaye')) {
        answer = 'Aapke khet ki mitti aur mausam ke anusar Sharbati Gehu (Wheat) aur Sarson (Mustard) lagana sabse labhdayak rahega.';
        actionLabel = 'View AI Crop Recommendation';
        actionLink = '/crop-recommendation';
      } else if (t.includes('bhav') || t.includes('price') || t.includes('daam')) {
        answer = 'Lucknow Mandi me aaj Gehu ka bhav ₹2,275 per quintal aur Sarson ka bhav ₹5,650 per quintal chal raha hai.';
        actionLabel = 'Check Price Prediction';
        actionLink = '/price-prediction';
      } else if (t.includes('patti') || t.includes('leaf') || t.includes('bimari')) {
        answer = 'Patti par dhabbe Early Blight ya fungal rog ho sakte hain. Kripya leaf scan karke treatment check karein.';
        actionLabel = 'Leaf Disease Scanner';
        actionLink = '/disease-detection';
      } else if (t.includes('mausam') || t.includes('weather')) {
        answer = 'Aaj mausam saaf rahega, tapman 31°C hai aur aane wale do din tak sinchai anukool hai.';
        actionLabel = 'Weather Forecast';
        actionLink = '/weather';
      }
    }

    const aiMsg: VoiceMessage = {
      id: 'msg-ai-' + Date.now(),
      sender: 'assistant',
      text: answer,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionLabel,
      actionLink,
    };

    setMessages((prev) => [...prev, aiMsg]);
    speakText(answer);
  };

  const clearConversation = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        text: 'Namaste Kisan Bhai! Mai AsraVerse AI assistant hu. Poochiye apna prashna.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <VoiceAssistantContext.Provider
      value={{
        isOpen,
        isListening,
        isSpeaking,
        language,
        transcript,
        messages,
        openVoiceAssistant: () => setIsOpen(true),
        closeVoiceAssistant: () => setIsOpen(false),
        startListening,
        stopListening,
        setLanguage,
        sendQueryText,
        speakText,
        clearConversation,
      }}
    >
      {children}
    </VoiceAssistantContext.Provider>
  );
};

export const useVoiceAssistant = () => {
  const ctx = useContext(VoiceAssistantContext);
  if (!ctx) throw new Error('useVoiceAssistant must be used within a VoiceAssistantProvider');
  return ctx;
};
