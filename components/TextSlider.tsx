
import React, { useState, useEffect } from 'react';
import { TEXT_SLIDES } from '../constants';
import { ChevronLeft, ChevronRight, Zap, Target } from 'lucide-react';

const TextSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slides, setSlides] = useState<string[]>(TEXT_SLIDES);

  useEffect(() => {
    const loadSlides = () => {
      const savedSlides = localStorage.getItem('vault_slides');
      if (savedSlides) {
        setSlides(JSON.parse(savedSlides));
      } else {
        setSlides(TEXT_SLIDES);
      }
    };

    loadSlides();
    window.addEventListener('storage', loadSlides);

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => {
      clearInterval(timer);
      window.removeEventListener('storage', loadSlides);
    };
  }, [slides.length]);

  const formatSlide = (text: string) => {
    const parts = text.split(':');
    if (parts.length > 1) {
      return {
        step: parts[0].trim(),
        content: parts[1].trim()
      };
    }
    return { step: '', content: text };
  };

  const currentSlide = formatSlide(slides[currentIndex] || "");

  return (
    <div className="px-4 py-2 md:py-6 bg-transparent">
      <div className="max-w-6xl mx-auto">
        {/* Increased padding and height of the container */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] p-4 md:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.05)] border border-indigo-100/40 relative overflow-hidden group min-h-[140px] md:min-h-[200px] flex flex-col justify-center">
          
          <div className="absolute top-3 left-8 z-20">
            <div className="flex items-center space-x-2 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
              <Target className="w-3 h-3 md:w-4 md:h-4 text-indigo-600" />
              <span className="text-[8px] md:text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Strategy Guide</span>
            </div>
          </div>

          <div className="flex items-center justify-between relative z-10">
            <button 
              onClick={() => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)}
              className="p-2 md:p-4 bg-slate-50 hover:bg-indigo-600 text-slate-400 hover:text-white rounded-2xl transition-all hidden md:flex shrink-0 border border-slate-100 shadow-sm active:scale-90"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            {/* Increased minimum height for the text area and removed line-clamping */}
            <div className="flex-grow px-4 md:px-16 flex flex-col items-center justify-center space-y-3 md:space-y-6">
              {currentSlide.step && (
                <div className="flex items-center space-x-3">
                  <div className="bg-slate-950 text-white text-[8px] md:text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg animate-fade-in flex items-center gap-2">
                    <Zap className="w-3 h-3 fill-current text-amber-400" />
                    {currentSlide.step}
                  </div>
                </div>
              )}
              {/* Increased font size for better visibility */}
              <p className="text-sm sm:text-lg md:text-3xl lg:text-4xl font-black leading-snug animate-fade-in tracking-tight text-slate-800 text-center italic">
                "{currentSlide.content}"
              </p>
            </div>

            <button 
              onClick={() => setCurrentIndex((prev) => (prev + 1) % slides.length)}
              className="p-2 md:p-4 bg-slate-50 hover:bg-indigo-600 text-slate-400 hover:text-white rounded-2xl transition-all hidden md:flex shrink-0 border border-slate-100 shadow-sm active:scale-90"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
          
          {/* Bigger pagination dots */}
          <div className="flex justify-center space-x-2 mt-4 md:mt-8">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-700 ${i === currentIndex ? 'w-6 md:w-12 bg-indigo-500' : 'w-2 bg-slate-200 hover:bg-slate-300'}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/40 rounded-full blur-[60px] pointer-events-none opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50/40 rounded-full blur-[60px] pointer-events-none opacity-50"></div>
        </div>
      </div>
    </div>
  );
};

export default TextSlider;
