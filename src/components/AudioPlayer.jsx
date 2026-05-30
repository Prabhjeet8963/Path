'use client';
import { useState, useRef, useEffect } from 'react';

const TRACK_METADATA = {
  1: { timeOfDay: "Amrit Vela" },
  2: { timeOfDay: "Amrit Vela" },
  3: { timeOfDay: "Amrit Vela" },
  4: { timeOfDay: "Amrit Vela" },
  5: { timeOfDay: "Amrit Vela" },
  6: { timeOfDay: "Sunset" },
  7: { timeOfDay: "Nighttime" },
  8: { timeOfDay: "Any Time" }
};

// Custom play sequence paths are managed dynamically below.

export default function AudioPlayer({ 
  tracks, 
  initialIndex = 0,
  activeSequence,
  setActiveSequence,
  playerTrigger,
  setPlayerTrigger
}) {
  const audioRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Sync state changes from parent footer click
  useEffect(() => {
    if (!playerTrigger) return;
    setIsComplete(false);
    if (playerTrigger.type === 'nitnem') {
      setCurrentIndex(0);
    } else if (playerTrigger.type === 'rehatnama') {
      setCurrentIndex(5);
    } else if (playerTrigger.type === 'simran') {
      setCurrentIndex(7);
    }
    setIsPlaying(true);
  }, [playerTrigger]);

  const activeTrack = tracks[currentIndex];
  const activeMeta = TRACK_METADATA[activeTrack.id] || { timeOfDay: "Any Time" };
  const prevIndex = useRef(currentIndex);

  // Play/Pause effect
  useEffect(() => {
    if (!audioRef.current) return;

    if (prevIndex.current !== currentIndex) {
      // Changed track
      setIsComplete(false);
      audioRef.current.load();
      prevIndex.current = currentIndex;

      // Autoplay selected track
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.log("Autoplay blocked or interrupted", err);
      });
    } else {
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.log("Play failed", err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentIndex]);

  // Removed dynamic GurbaniNow API fetchers. Keeping it lightweight and static.

  // Handle track ended
  const handleEnded = () => {
    if (isLooping) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => console.log("Loop replay error:", e));
      }
    } else {
      if (activeSequence) {
        const seqIndex = activeSequence.indexOf(currentIndex);
        if (seqIndex !== -1 && seqIndex < activeSequence.length - 1) {
          setCurrentIndex(activeSequence[seqIndex + 1]);
        } else {
          setIsComplete(true);
          setIsPlaying(false);
        }
      } else {
        if (currentIndex < tracks.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          setIsComplete(true);
          setIsPlaying(false);
        }
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleScrub = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      const targetTime = Math.max(0, audioRef.current.currentTime - 5);
      audioRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  const skipForward = () => {
    if (audioRef.current) {
      const targetTime = Math.min(duration, audioRef.current.currentTime + 5);
      audioRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (isComplete) {
      setIsComplete(false);
      setCurrentIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(prev => !prev);
    }
  };

  const handleNext = () => {
    setActiveSequence(null);
    if (currentIndex < tracks.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setActiveSequence(null);
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const selectTrack = (index) => {
    setIsComplete(false);
    setActiveSequence(null);
    setCurrentIndex(index);
  };

  // Helper to render the breathing "Waheguru" minimal panel
  const renderGurbaniContent = () => {
    return (
      <div className="w-full h-[240px] bg-black border border-[#1a1a1a] flex flex-col items-center justify-center text-center select-none relative overflow-hidden transition-all duration-500 hover:border-[#c8a96e]/30 group">
        
        {/* Subtle decorative framing gold corners */}
        <div className="absolute top-3 left-3 w-1.5 h-1.5 border-t border-l border-[#c8a96e]/20 group-hover:border-[#c8a96e]/60 transition-colors duration-500" />
        <div className="absolute top-3 right-3 w-1.5 h-1.5 border-t border-r border-[#c8a96e]/20 group-hover:border-[#c8a96e]/60 transition-colors duration-500" />
        <div className="absolute bottom-3 left-3 w-1.5 h-1.5 border-b border-l border-[#c8a96e]/20 group-hover:border-[#c8a96e]/60 transition-colors duration-500" />
        <div className="absolute bottom-3 right-3 w-1.5 h-1.5 border-b border-r border-[#c8a96e]/20 group-hover:border-[#c8a96e]/60 transition-colors duration-500" />

        {/* Breathing Gurmukhi Waheguru Text */}
        <span 
          className={`text-[32px] font-gurmukhi text-[#c8a96e] tracking-widest font-semibold transition-all duration-[1500ms] ${
            isPlaying ? 'animate-pulse opacity-90 scale-[1.02] drop-shadow-[0_0_15px_rgba(200,169,110,0.15)]' : 'opacity-40 scale-100'
          }`}
        >
          ਵਾਹਿਗੁਰੂ
        </span>

        {/* Dynamic subtitle reflection */}
        <span className="text-[9px] font-mono text-[#444444] uppercase tracking-[0.25em] mt-3 group-hover:text-[#888888] transition-colors duration-500">
          Waheguru
        </span>

      </div>
    );
  };

  return (
    <div className="w-full bg-[#0d0d0d] p-8 text-[#f5f0e8] flex flex-col justify-start">
      {/* Native Audio Element */}
      <audio
        ref={audioRef}
        src={activeTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* ━━━ HEADER ━━━ */}
      <div className="flex justify-between items-start border-b border-[#1e1e1e] pb-6 mb-8 select-none">
        <div>
          <h1 className="font-serif text-[28px] text-[#f5f0e8] font-normal leading-none">Path.io</h1>
          <p className="text-[10px] text-[#444444] uppercase tracking-widest mt-1.5 font-mono">Nitnem</p>
        </div>
        <span className="text-[10px] text-[#2e2e2e] select-none font-gurmukhi">☬</span>
      </div>

      {/* Two column grid on desktop. Stack on mobile. */}
      <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
        
        {/* LEFT COLUMN (flex-1): player */}
        <div className="flex-1 w-full flex flex-col space-y-8">
          
          {/* 1. MINIMAL BREATHING CARD */}
          <div className="w-full">
            {renderGurbaniContent()}
          </div>

          {/* 2. NOW PLAYING */}
          <div className="flex flex-col select-none">
            <span className="text-[10px] text-[#444444] uppercase tracking-widest font-mono">
              Now playing · {currentIndex + 1} of 8
            </span>
            <h2 className="text-[22px] text-[#f5f0e8] font-normal tracking-wide mt-2 leading-tight">
              {activeTrack.titleGur}
            </h2>
            <div className="flex items-center space-x-3 mt-1.5">
              <span className="text-[11px] text-[#555555] uppercase tracking-wider font-mono">
                {activeTrack.title}
              </span>
              <span className="text-[10px] text-[#3a3a3a] uppercase font-mono tracking-widest bg-[#161616] px-2 py-0.5 rounded border border-[#1e1e1e]">
                {activeMeta.timeOfDay}
              </span>
            </div>
          </div>

          {/* 3. SEEK BAR */}
          <div className="flex flex-col space-y-2 w-full">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleScrub}
              style={{
                '--pct': `${(currentTime / (duration || 1)) * 100}%`,
                background: 'linear-gradient(to right, #c8a96e var(--pct), #1e1e1e var(--pct))'
              }}
              className="w-full h-[2px] appearance-none cursor-pointer rounded-none outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#c8a96e]"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#444444] tracking-widest">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* 4 & 6. PLAYBACK CONTROLS / COMPLETE STATE */}
          <div className="flex flex-col items-center">
            {isComplete ? (
              <div className="flex flex-col items-center py-2 select-none">
                <span className="text-[18px] font-serif text-[#c8a96e]">ਵਾਹਿਗੁਰੂ</span>
                <span className="text-[10px] text-[#444444] uppercase tracking-widest mt-1 font-mono">Playlist complete</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-5 w-full">
                
                {/* Loop */}
                <button 
                  onClick={() => setIsLooping(prev => !prev)}
                  className="p-2 transition-colors focus:outline-none"
                  aria-label="Loop Track"
                  title="Repeat Track"
                >
                  <svg 
                    width="16" 
                    height="16" 
                    fill="none" 
                    stroke={isLooping ? "#c8a96e" : "#555555"} 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M17 1l4 4-4 4" /><path d="M3 11V9a4 4 0 014-4h14" />
                    <path d="M7 23l-4-4 4-4" /><path d="M21 13v2a4 4 0 01-4 4H3" />
                  </svg>
                </button>

                {/* Prev */}
                <button 
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="p-2 transition-colors disabled:opacity-20 focus:outline-none"
                  style={{ color: currentIndex === 0 ? '#272727' : '#555555' }}
                  aria-label="Previous Track"
                >
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
                  </svg>
                </button>

                {/* Play/Pause */}
                <button 
                  onClick={togglePlay}
                  className="w-11 h-11 rounded-full flex items-center justify-center bg-[#f5f0e8] text-[#0d0d0d] hover:bg-[#c8a96e] transition-colors focus:outline-none shadow-md"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="7" y="5" width="3" height="14" rx="0.5"></rect>
                      <rect x="14" y="5" width="3" height="14" rx="0.5"></rect>
                    </svg>
                  ) : (
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" className="ml-0.5">
                      <polygon points="7 4 19 12 7 20 7 4"></polygon>
                    </svg>
                  )}
                </button>

                {/* Next */}
                <button 
                  onClick={handleNext}
                  disabled={currentIndex === tracks.length - 1}
                  className="p-2 transition-colors disabled:opacity-20 focus:outline-none"
                  style={{ color: currentIndex === tracks.length - 1 ? '#272727' : '#555555' }}
                  aria-label="Next Track"
                >
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6z" />
                  </svg>
                </button>

                {/* Reset */}
                <button 
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentTime(0);
                    if (audioRef.current) {
                      audioRef.current.currentTime = 0;
                    }
                  }}
                  className="p-2 transition-colors hover:text-[#888888] focus:outline-none text-[#555555]"
                  aria-label="Reset Track"
                  title="Reset"
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect x="5" y="5" width="14" height="14" rx="2"></rect>
                  </svg>
                </button>

              </div>
            )}
          </div>

          {/* 5. SKIP BUTTONS */}
          <div className="flex justify-center items-center gap-2 select-none">
            <button 
              onClick={skipBackward}
              className="border border-[#1e1e1e] bg-transparent text-[#444444] text-[10px] font-mono py-1 px-2.5 rounded hover:border-[#333333] hover:text-[#888888] transition-colors focus:outline-none"
            >
              − 5s
            </button>
            <button 
              onClick={skipForward}
              className="border border-[#1e1e1e] bg-transparent text-[#444444] text-[10px] font-mono py-1 px-2.5 rounded hover:border-[#333333] hover:text-[#888888] transition-colors focus:outline-none"
            >
              + 5s
            </button>
          </div>

          {/* 6. PLAYBACK PATH LOCATORS (Nitnem, Rehatnama, Simran) */}
          <div className="border-t border-[#1e1e1e] pt-6 mt-2 flex flex-col items-center space-y-3 select-none">
            <span className="text-[9px] text-[#444444] uppercase tracking-[0.2em] font-mono">
              Quick Sequence Paths
            </span>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              
              <button
                onClick={() => {
                  setIsComplete(false);
                  setActiveSequence([0, 1, 2, 3, 4, 7]);
                  setCurrentIndex(0); // Japji Sahib
                  setIsPlaying(true);
                }}
                className={`text-[10px] font-mono py-1.5 px-3 border transition-all duration-300 rounded uppercase tracking-wider ${
                  activeSequence && JSON.stringify(activeSequence) === JSON.stringify([0, 1, 2, 3, 4, 7])
                    ? 'border-[#c8a96e] text-[#c8a96e] bg-[#161310]'
                    : 'border-[#1e1e1e] text-[#888888] hover:border-[#333333] hover:text-[#f5f0e8]'
                }`}
              >
                [ nitnem ]
              </button>

              <button
                onClick={() => {
                  setIsComplete(false);
                  setActiveSequence([5, 6, 7]);
                  setCurrentIndex(5); // Rehras Sahib
                  setIsPlaying(true);
                }}
                className={`text-[10px] font-mono py-1.5 px-3 border transition-all duration-300 rounded uppercase tracking-wider ${
                  activeSequence && JSON.stringify(activeSequence) === JSON.stringify([5, 6, 7])
                    ? 'border-[#c8a96e] text-[#c8a96e] bg-[#161310]'
                    : 'border-[#1e1e1e] text-[#888888] hover:border-[#333333] hover:text-[#f5f0e8]'
                }`}
              >
                [ rehatnama ]
              </button>

              <button
                onClick={() => {
                  setIsComplete(false);
                  setActiveSequence([7]);
                  setCurrentIndex(7); // Simran
                  setIsPlaying(true);
                }}
                className={`text-[10px] font-mono py-1.5 px-3 border transition-all duration-300 rounded uppercase tracking-wider ${
                  activeSequence && JSON.stringify(activeSequence) === JSON.stringify([7])
                    ? 'border-[#c8a96e] text-[#c8a96e] bg-[#161310]'
                    : 'border-[#1e1e1e] text-[#888888] hover:border-[#333333] hover:text-[#f5f0e8]'
                }`}
              >
                [ simran ]
              </button>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (280px): playlist */}
        <div className="w-full lg:w-[280px] shrink-0 border-t lg:border-t-0 lg:border-l border-[#1e1e1e] pt-8 lg:pt-0 lg:pl-8 flex flex-col justify-between">
          
          <div className="w-full select-none">
            
            {/* Header row */}
            <div className="flex justify-between items-center mb-6 text-[10px] font-mono text-[#444444] tracking-widest uppercase pb-2 border-b border-[#1e1e1e]">
              <span>Sequence</span>
              <span>8 paths</span>
            </div>

            {/* Track rows */}
            <div className="flex flex-col space-y-1">
              {tracks.map((track, index) => {
                const isActive = index === currentIndex;
                const isUpcoming = index > currentIndex;
                
                return (
                  <button
                    key={track.id}
                    onClick={() => selectTrack(index)}
                    style={{ opacity: isUpcoming ? 0.35 : 1 }}
                    className={`w-full text-left flex items-center justify-between py-2.5 px-2 rounded transition-all duration-300 ${isActive ? 'bg-[#161616]' : 'bg-transparent hover:bg-[#161616]'}`}
                  >
                    
                    {/* Index + Active Dot + Names */}
                    <div className="flex items-center space-x-3.5 min-w-0">
                      
                      {/* Active Indicator or Index Number */}
                      <span className={`text-[10px] font-mono ${isActive ? 'text-[#c8a96e]' : 'text-[#2e2e2e]'}`}>
                        {index + 1}
                      </span>

                      {/* Dot */}
                      <span 
                        style={{ visibility: isActive ? 'visible' : 'hidden' }}
                        className="w-1 h-1 rounded-full bg-[#c8a96e] shrink-0" 
                      />

                      {/* Track Titles */}
                      <div className="min-w-0">
                        <p className={`text-[13px] font-gurmukhi leading-snug truncate transition-colors duration-300 ${isActive ? 'text-[#f5f0e8]' : 'text-[#888888]'}`}>
                          {track.titleGur}
                        </p>
                        <p className="text-[9px] text-[#333333] uppercase tracking-wider font-mono truncate mt-0.5">
                          {track.title}
                        </p>
                      </div>

                    </div>

                  </button>
                );
              })}
            </div>

          </div>

          {/* Footer note */}
          <div className="mt-8 text-center text-[10px] text-[#2e2e2e] tracking-[0.2em] font-mono select-none">
            ☬ ਵਾਹਿਗੁਰੂ ☬
          </div>

        </div>

      </div>
    </div>
  );
}
