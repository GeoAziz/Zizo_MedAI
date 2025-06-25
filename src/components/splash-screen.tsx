
"use client";

import { useState, useEffect } from 'react';

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
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-1/2 h-1/2 text-cyan-400">
                <path d="M12 2C12 2 4 6 4 12C4 18 12 22 12 22C12 22 20 18 20 12C20 6 12 2 12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 2V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 21V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 12H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 12H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mt-8 mb-2 splash-logo" style={{ animationDelay: '0.5s', opacity: 0, animation: 'fade-in-text 1s forwards 0.5s' }}>
          Zizo_MediAI
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
