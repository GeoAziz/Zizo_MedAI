
"use client";

import { useState, useEffect } from 'react';
import { Brain } from 'lucide-react';

interface SplashScreenProps {
  onFinished: () => void;
}

export function SplashScreen({ onFinished }: SplashScreenProps) {
  const [loadingText, setLoadingText] = useState("Initializing diagnostic intelligence...");
  const [unmount, setUnmount] = useState(false);

  useEffect(() => {
    const sequence = [
      { text: "Calibrating medical cognition systems...", delay: 2000 },
      { text: "Welcome to Zizo_MediAI...", delay: 1500 },
    ];

    let timer = setTimeout(() => {
      setLoadingText(sequence[0].text);
      timer = setTimeout(() => {
        setLoadingText(sequence[1].text);
        timer = setTimeout(() => {
          setUnmount(true);
          sessionStorage.setItem("splash_seen", "true");
          // Wait for fade-out animation to complete
          setTimeout(onFinished, 1000); 
        }, sequence[1].delay);
      }, sequence[0].delay);
    }, 100); // Initial delay before first text change

    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <div className={`splash-screen ${unmount ? 'fade-out' : ''}`}>
      <div className="neural-web"></div>
      <div className="flex flex-col items-center justify-center text-center text-white z-10">
        
        <div className="ai-core-orb">
          <div className="orb-center">
             <Brain className="w-1/2 h-1/2 text-cyan-400 animate-pulse"/>
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mt-8 mb-2 splash-logo font-headline flex items-center gap-1" style={{ animationDelay: '0.5s', opacity: 0, animation: 'fade-in-text 1s forwards 0.5s' }}>
          MEDI<Brain className="w-10 h-10 md:w-14 md:h-14 -mb-2 text-cyan-300"/>AI
        </h1>
        <p className="text-sm md:text-base tracking-widest text-cyan-300/80 splash-tagline">
          <span style={{ animationDelay: '1.0s' }}>Precision</span>
          <span className="mx-2" style={{ animationDelay: '1.2s' }}>|</span>
          <span style={{ animationDelay: '1.4s' }}>Prediction</span>
          <span className="mx-2" style={{ animationDelay: '1.6s' }}>|</span>
          <span style={{ animationDelay: '1.8s' }}>Prevention</span>
        </p>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center w-full px-4">
            <p className="text-xs text-gray-400 font-code transition-opacity duration-500">{loadingText}</p>
            <div className="loader-dots text-lg mt-1">
                <span>.</span><span>.</span><span>.</span>
            </div>
        </div>
      </div>
    </div>
  );
}
