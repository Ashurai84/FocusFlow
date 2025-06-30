import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Sparkles } from 'lucide-react';

interface QuoteCardProps {
  userType: string;
}

const quotes = {
  engineering: [
    { text: "Code is poetry written in logic.", author: "Unknown" },
    { text: "The best error message is the one that never shows up.", author: "Thomas Fuchs" },
    { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
    { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" }
  ],
  medical: [
    { text: "The good physician treats the disease; the great physician treats the patient.", author: "William Osler" },
    { text: "Medicine is not only a science; it is also an art.", author: "Paracelsus" },
    { text: "Wherever the art of medicine is loved, there is also a love of humanity.", author: "Hippocrates" }
  ],
  arts: [
    { text: "Creativity takes courage.", author: "Henri Matisse" },
    { text: "Art is not what you see, but what you make others see.", author: "Edgar Degas" },
    { text: "Every artist was first an amateur.", author: "Ralph Waldo Emerson" }
  ],
  science: [
    { text: "Science is organized knowledge. Wisdom is organized life.", author: "Immanuel Kant" },
    { text: "The important thing is not to stop questioning.", author: "Albert Einstein" },
    { text: "Research is what I'm doing when I don't know what I'm doing.", author: "Wernher von Braun" }
  ],
  commerce: [
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
    { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" }
  ],
  undergraduate: [
    { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
    { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
    { text: "Study hard what interests you the most in the most undisciplined, irreverent and original manner possible.", author: "Richard Feynman" }
  ]
};

export function QuoteCard({ userType }: QuoteCardProps) {
  const [currentQuote, setCurrentQuote] = useState(0);
  const userQuotes = quotes[userType as keyof typeof quotes] || quotes.undergraduate;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % userQuotes.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [userQuotes.length]);

  return (
    <motion.div
      className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 p-1 rounded-2xl"
      animate={{
        background: [
          'linear-gradient(45deg, #fbbf24, #ec4899, #8b5cf6)',
          'linear-gradient(45deg, #10b981, #3b82f6, #8b5cf6)',
          'linear-gradient(45deg, #f59e0b, #ef4444, #ec4899)',
          'linear-gradient(45deg, #fbbf24, #ec4899, #8b5cf6)'
        ]
      }}
      transition={{ duration: 8, repeat: Infinity }}
    >
      <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 text-center">
        <div className="flex items-center justify-center mb-3">
          <Sparkles className="text-yellow-300 mr-2" size={20} />
          <Quote className="text-white" size={20} />
          <Sparkles className="text-yellow-300 ml-2" size={20} />
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuote}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-white font-medium text-sm mb-2 leading-relaxed">
              "{userQuotes[currentQuote].text}"
            </p>
            <p className="text-white/80 text-xs">
              — {userQuotes[currentQuote].author}
            </p>
          </motion.div>
        </AnimatePresence>
        
        <div className="flex justify-center mt-3 space-x-1">
          {userQuotes.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentQuote ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}