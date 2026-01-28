
import React, { useState, useEffect } from 'react';
import { TEXT_SLIDES } from '../constants';
import { ChevronLeft, ChevronRight, Zap, Sparkles } from 'lucide-react';

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
    <div className="px-4 py-2 md:py-4">
      <div className="max-w-7xl mx-auto">
        {/* Compact Slider Box */}
        <div className="bg-white rounded-2xl md:rounded-[2.5rem] p-4 md:p-8 shadow-sm border border-indigo-50 relative overflow-hidden group min-h-[100px] md:min-h-[150px] flex flex-col justify-center transition-all hover:shadow-indigo-100/50">
          
          {/* Subtle Decorative Gradient */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/30 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

          <div className="flex items-center justify-between relative z-10 w-full">
            <button 
              onClick={() => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)}
              className="p-2 md:p-3 bg-slate-50 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-xl transition-all hidden md:flex shrink-0 border border-slate-100 active:scale-90"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex-grow px-2 md:px-8 flex flex-col items-center justify-center space-y-2 md:space-y-4">
              {currentSlide.step && (
                <div className="flex items-center gap-2 bg-indigo-600 text-[8px] md:text-[10px] text-white px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-sm">
                  <Zap className="w-2.5 h-2.5 fill-current text-amber-300" />
                  {currentSlide.step}
                </div>
              )}
              
              <div className="max-w-3xl mx-auto text-center">
                <p className="text-sm md:text-2xl font-black leading-tight animate-fade-in tracking-tight text-slate-900 italic">
                  "{currentSlide.content}"
                </p>
              </div>
            </div>

            <button 
              onClick={() => setCurrentIndex((prev) => (prev + 1) % slides.length)}
              className="p-2 md:p-3 bg-slate-50 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-xl transition-all hidden md:flex shrink-0 border border-slate-100 active:scale-90"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          {/* Compact Pagination */}
          <div className="flex justify-center space-x-1.5 mt-4 md:mt-6 relative z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${i === currentIndex ? 'w-6 md:w-10 bg-indigo-600' : 'w-1.5 bg-slate-200'}`}
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
