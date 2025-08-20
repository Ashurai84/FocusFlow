import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Sparkles } from 'lucide-react';

interface QuoteCardProps {
  userType: string;
}

const quotes = {
  engineering: [
    { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
    { text: "Design is not just what it looks like and feels like. Design is how it works.", author: "Steve Jobs" },
    { text: "Technology is nothing. What's important is that you have a faith in people.", author: "Steve Jobs" },
    { text: "The desktop metaphor is a revolutionary step forward, but I think it's time we moved beyond it.", author: "Steve Jobs" },
    { text: "We're here to put a dent in the universe. Otherwise why else even be here?", author: "Steve Jobs" }
  ],
  medical: [
    { text: "The good physician treats the disease; the great physician treats the patient who has the disease.", author: "William Osler" },
    { text: "Medicine is not only a science; it is also an art. It does not consist of compounding pills and plasters.", author: "Paracelsus" },
    { text: "Wherever the art of medicine is loved, there is also a love of humanity.", author: "Hippocrates" },
    { text: "The best doctor gives the least medicines.", author: "Benjamin Franklin" },
    { text: "To cure sometimes, to relieve often, to comfort always.", author: "Hippocrates" }
  ],
  arts: [
    { text: "Creativity takes courage.", author: "Henri Matisse" },
    { text: "Art is not what you see, but what you make others see.", author: "Edgar Degas" },
    { text: "Every artist was first an amateur.", author: "Ralph Waldo Emerson" },
    { text: "The aim of art is to represent not the outward appearance of things, but their inward significance.", author: "Aristotle" },
    { text: "Art enables us to find ourselves and lose ourselves at the same time.", author: "Thomas Merton" }
  ],
  science: [
    { text: "The important thing is not to stop questioning. Curiosity has its own reason for existing.", author: "Albert Einstein" },
    { text: "Science is organized knowledge. Wisdom is organized life.", author: "Immanuel Kant" },
    { text: "Research is what I'm doing when I don't know what I'm doing.", author: "Wernher von Braun" },
    { text: "In science there is only physics; all the rest is stamp collecting.", author: "Ernest Rutherford" },
    { text: "Science is not only compatible with spirituality; it is a profound source of spirituality.", author: "Carl Sagan" }
  ],
  commerce: [
    { text: "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.", author: "Steve Jobs" },
    { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
    { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "Quality is more important than quantity. One home run is much better than two doubles.", author: "Steve Jobs" }
  ],
  general: [
    { text: "Stay hungry. Stay foolish.", author: "Steve Jobs" },
    { text: "The people in the Indian countryside don't use their intellect like we do, they use their intuition instead, and their intuition is far more developed than in the rest of the world.", author: "Steve Jobs" },
    { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
    { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
    { text: "Study hard what interests you the most in the most undisciplined, irreverent and original manner possible.", author: "Richard Feynman" }
  ]
};

export function QuoteCard({ userType }: QuoteCardProps) {
  const [currentQuote, setCurrentQuote] = useState(0);
  const userQuotes = quotes[userType as keyof typeof quotes] || quotes.general;

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

// ✅ ADD THIS DEFAULT EXPORT
export default QuoteCard;
