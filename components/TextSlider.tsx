
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
    <div className="px-4 py-1 md:py-2">
      <div className="max-w-7xl mx-auto">
        {/* Slightly more compact Slider Box */}
        <div className="bg-white rounded-xl md:rounded-[2rem] p-3 md:p-6 shadow-sm border border-indigo-50 relative overflow-hidden group min-h-[80px] md:min-h-[120px] flex flex-col justify-center transition-all hover:shadow-indigo-100/50">
          
          {/* Subtle Decorative Gradient */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/30 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

          <div className="flex items-center justify-between relative z-10 w-full">
            <button 
              onClick={() => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)}
              className="p-1.5 md:p-2 bg-slate-50 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-lg transition-all hidden md:flex shrink-0 border border-slate-100 active:scale-90"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex-grow px-2 md:px-6 flex flex-col items-center justify-center space-y-1.5 md:space-y-3">
              {currentSlide.step && (
                <div className="flex items-center gap-1.5 bg-indigo-600 text-[7px] md:text-[9px] text-white px-2.5 py-0.5 rounded-full font-black uppercase tracking-widest shadow-sm">
                  <Zap className="w-2 h-2 fill-current text-amber-300" />
                  {currentSlide.step}
                </div>
              )}
              
              <div className="max-w-3xl mx-auto text-center">
                <p className="text-xs md:text-xl font-black leading-tight animate-fade-in tracking-tight text-slate-900 italic">
                  "{currentSlide.content}"
                </p>
              </div>
            </div>

            <button 
              onClick={() => setCurrentIndex((prev) => (prev + 1) % slides.length)}
              className="p-1.5 md:p-2 bg-slate-50 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-lg transition-all hidden md:flex shrink-0 border border-slate-100 active:scale-90"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          {/* Even more compact Pagination */}
          <div className="flex justify-center space-x-1 mt-3 md:mt-4 relative z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1 rounded-full transition-all duration-500 ${i === currentIndex ? 'w-4 md:w-8 bg-indigo-600' : 'w-1 bg-slate-200'}`}
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
