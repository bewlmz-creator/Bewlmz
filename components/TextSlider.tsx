
import React, { useState, useEffect } from 'react';
import { TEXT_SLIDES } from '../constants';
import { ChevronLeft, ChevronRight, Zap, Target, Sparkles } from 'lucide-react';

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
    }, 8000); // Slightly slower for better reading

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
    <div className="px-4 py-4 md:py-12 bg-white/50">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-[2rem] md:rounded-[5rem] p-6 md:p-20 shadow-[0_30px_70px_rgba(79,70,229,0.08)] border border-indigo-100 relative overflow-hidden group min-h-[220px] md:min-h-[380px] flex flex-col justify-center transition-all hover:shadow-indigo-500/10">
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-50/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50/50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

          <div className="absolute top-6 left-10 md:top-12 md:left-20 z-20">
            <div className="flex items-center space-x-3 bg-indigo-600 text-white px-5 py-2 rounded-full shadow-lg animate-bounce-slow">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">Strategy Guide</span>
            </div>
          </div>

          <div className="flex items-center justify-between relative z-10 w-full">
            <button 
              onClick={() => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)}
              className="p-4 md:p-6 bg-slate-50 hover:bg-indigo-600 text-slate-400 hover:text-white rounded-3xl transition-all hidden md:flex shrink-0 border border-slate-100 shadow-sm active:scale-90 hover:shadow-indigo-500/20"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            
            <div className="flex-grow px-4 md:px-12 flex flex-col items-center justify-center space-y-6 md:space-y-10">
              {currentSlide.step && (
                <div className="flex items-center space-x-4">
                  <div className="bg-slate-950 text-white text-[10px] md:text-sm font-black px-6 py-2.5 rounded-full uppercase tracking-[0.3em] shadow-2xl animate-fade-in flex items-center gap-3">
                    <Zap className="w-4 h-4 fill-current text-amber-400" />
                    {currentSlide.step}
                  </div>
                </div>
              )}
              
              <div className="max-w-4xl mx-auto text-center">
                <p className="text-lg sm:text-2xl md:text-5xl lg:text-6xl font-[1000] leading-[1.15] animate-fade-in tracking-tighter text-slate-900 drop-shadow-sm italic">
                  "{currentSlide.content}"
                </p>
              </div>
            </div>

            <button 
              onClick={() => setCurrentIndex((prev) => (prev + 1) % slides.length)}
              className="p-4 md:p-6 bg-slate-50 hover:bg-indigo-600 text-slate-400 hover:text-white rounded-3xl transition-all hidden md:flex shrink-0 border border-slate-100 shadow-sm active:scale-90 hover:shadow-indigo-500/20"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
          
          <div className="flex justify-center space-x-3 mt-10 md:mt-16 relative z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2.5 rounded-full transition-all duration-700 ${i === currentIndex ? 'w-10 md:w-20 bg-indigo-600' : 'w-2.5 bg-slate-200 hover:bg-indigo-300'}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextSlider;
