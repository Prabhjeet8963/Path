'use client';
import { useState } from "react";
import AudioPlayer from "@/components/AudioPlayer";
import { TRACKS } from "@/lib/tracks";

export default function Home() {
  const [activeSequence, setActiveSequence] = useState(null);
  const [playerTrigger, setPlayerTrigger] = useState(null);
  return (
    <div className="flex flex-col min-h-screen bg-[#0d0d0d] text-[#f5f0e8] relative overflow-hidden font-sans">
      
      {/* Header Deck */}
      <header className="w-full relative z-10 border-b border-[#1e1e1e] bg-[#0d0d0d]">
        <div className="w-full max-w-[96%] 2xl:max-w-[1600px] mx-auto flex items-center justify-between p-6 px-8">
          <div className="flex items-center space-x-3.5 group cursor-pointer">
            <span className="text-[#c8a96e] text-2xl font-bold font-gurmukhi transition-transform duration-500 group-hover:rotate-180 select-none">☬</span>
            <span className="text-lg font-bold tracking-tighter text-[#f5f0e8] font-serif">Path.io</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#c8a96e]/70 uppercase bg-[#161616] border border-[#1e1e1e] px-3 py-1 rounded">
              Dhur ki bani
            </span>
          </div>
        </div>
      </header>

      {/* Hero Workspace */}
      <main className="flex-1 w-full max-w-[96%] 2xl:max-w-[1600px] mx-auto px-6 md:px-8 py-12 md:py-20 relative z-10">
        
        {/* Intro Branding Badge */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24 flex flex-col items-center">
          
          <div className="inline-flex items-center space-x-2 text-[10px] font-bold text-[#c8a96e] bg-[#161616] border border-[#1e1e1e] px-4 py-1.5 rounded tracking-[0.2em] uppercase mb-8 shadow-sm transition-all duration-300">
            <span>☬</span>
            <span>daily spiritual discipline</span>
            <span>☬</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#f5f0e8] mb-2 leading-[1.15] max-w-2xl font-gurmukhi">
            ਵਾਹਿਗੁਰੂ ਜੀ ਕਾ ਖਾਲਸਾ <br />
            <span className="text-[#c8a96e]">
              ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫਤਹਿ ॥
            </span>
          </h2>
        </div>

        {/* Audio Player Deck */}
        <div className="w-full relative rounded bg-[#141414] border border-[#1e1e1e] shadow-2xl mb-24 md:mb-36">
          <AudioPlayer 
            tracks={TRACKS} 
            initialIndex={0} 
            activeSequence={activeSequence}
            setActiveSequence={setActiveSequence}
            playerTrigger={playerTrigger}
            setPlayerTrigger={setPlayerTrigger}
          />
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full py-10 border-t border-[#1e1e1e] bg-[#0d0d0d] relative z-10">
        <div className="w-full max-w-[96%] 2xl:max-w-[1600px] mx-auto px-6 md:px-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-[#444444] font-medium tracking-widest uppercase">
          <p className="mb-4 md:mb-0 normal-case tracking-normal text-center md:text-left">
            © 2026 Path.io — All rights and content ownership held by Prabhjeet Singh (prabhjeetsingh8963@gmail.com). Contact if needed.
          </p>
          <div className="flex space-x-6">
            <button
              onClick={() => {
                setActiveSequence([1, 2, 3, 4, 5, 8]);
                setPlayerTrigger({ type: 'nitnem', timestamp: Date.now() });
              }}
              className={`transition duration-300 uppercase tracking-widest text-[11px] font-medium focus:outline-none ${
                activeSequence && JSON.stringify(activeSequence) === JSON.stringify([1, 2, 3, 4, 5, 8])
                  ? 'text-[#c8a96e]'
                  : 'text-[#444444] hover:text-[#f5f0e8]'
              }`}
            >
              nitnem
            </button>
            <button
              onClick={() => {
                setActiveSequence([1, 2, 3, 4, 5, 6, 7, 8]);
                setPlayerTrigger({ type: 'reht', timestamp: Date.now() });
              }}
              className={`transition duration-300 uppercase tracking-widest text-[11px] font-medium focus:outline-none ${
                activeSequence && JSON.stringify(activeSequence) === JSON.stringify([1, 2, 3, 4, 5, 6, 7, 8])
                  ? 'text-[#c8a96e]'
                  : 'text-[#444444] hover:text-[#f5f0e8]'
              }`}
            >
              reht
            </button>
            <button
              onClick={() => {
                setActiveSequence([8]);
                setPlayerTrigger({ type: 'simran', timestamp: Date.now() });
              }}
              className={`transition duration-300 uppercase tracking-widest text-[11px] font-medium focus:outline-none ${
                activeSequence && JSON.stringify(activeSequence) === JSON.stringify([8])
                  ? 'text-[#c8a96e]'
                  : 'text-[#444444] hover:text-[#f5f0e8]'
              }`}
            >
              simran
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
