
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
    <div className="px-4 py-1 md:py-2 bg-transparent">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-[1rem] md:rounded-[2rem] p-2 md:p-4 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-indigo-100/30 relative overflow-hidden group">
          
          <div className="absolute top-1.5 left-6 z-20">
            <div className="flex items-center space-x-1.5 bg-indigo-50/80 border border-indigo-100/50 px-2 py-0.5 rounded-full">
              <Target className="w-2 h-2 text-indigo-600" />
              <span className="text-[6px] md:text-[7px] font-black text-indigo-600 uppercase tracking-widest">Guide</span>
            </div>
          </div>

          <div className="flex items-center justify-between relative z-10">
            <button 
              onClick={() => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)}
              className="p-1.5 md:p-2.5 bg-slate-50 hover:bg-indigo-600 text-slate-400 hover:text-white rounded-lg transition-all hidden sm:flex shrink-0 border border-slate-100 shadow-sm active:scale-90"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex-grow px-4 md:px-12 min-h-[70px] md:min-h-[85px] flex flex-col items-center justify-center space-y-2 md:space-y-3">
              {currentSlide.step && (
                <div className="flex items-center space-x-2">
                  <div className="bg-slate-900 text-white text-[6px] md:text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-[0.1em] shadow-sm animate-fade-in flex items-center gap-1">
                    <Zap className="w-2 h-2 fill-current text-amber-400" />
                    {currentSlide.step}
                  </div>
                </div>
              )}
              <p className="text-[11px] sm:text-sm md:text-lg lg:text-xl font-black leading-tight animate-fade-in tracking-tight text-slate-800 text-center italic line-clamp-2">
                "{currentSlide.content}"
              </p>
            </div>

            <button 
              onClick={() => setCurrentIndex((prev) => (prev + 1) % slides.length)}
              className="p-1.5 md:p-2.5 bg-slate-50 hover:bg-indigo-600 text-slate-400 hover:text-white rounded-lg transition-all hidden sm:flex shrink-0 border border-slate-100 shadow-sm active:scale-90"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex justify-center space-x-1.5 mt-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-0.5 rounded-full transition-all duration-700 ${i === currentIndex ? 'w-4 md:w-8 bg-indigo-500' : 'w-1 bg-slate-200'}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/30 rounded-full blur-[40px] pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export default TextSlider;
