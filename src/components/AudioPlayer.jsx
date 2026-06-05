'use client';
import { useState, useRef, useEffect, useCallback } from 'react';

// Translucent Gold-accented Tooltip helper
const Tooltip = ({ text, children, position = "top" }) => {
  const posClass = position === "bottom" ? "top-full mt-2" : "bottom-full mb-2";
  return (
    <div className="relative group flex items-center justify-center">
      {children}
      <span className={`pointer-events-none absolute ${posClass} opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#141414]/98 border border-[#c8a96e]/30 text-[9px] font-mono text-[#c8a96e] px-2.5 py-1 rounded whitespace-nowrap z-40 shadow-2xl tracking-widest uppercase text-center`}>
        {text}
      </span>
    </div>
  );
};

const TRACK_METADATA = {
  1: { timeOfDay: "Amrit Vela" },
  2: { timeOfDay: "Amrit Vela" },
  3: { timeOfDay: "Amrit Vela" },
  4: { timeOfDay: "Amrit Vela" },
  5: { timeOfDay: "Amrit Vela" },
  6: { timeOfDay: "Sunset" },
  7: { timeOfDay: "Nighttime" },
  8: { timeOfDay: "Any Time" },
  // Asa Di Var
  9: { timeOfDay: "Amrit Vela" },
  // Sukhmani Sahib
  10: { timeOfDay: "Amrit Vela" },
  // Sawaiye
  11: { timeOfDay: "Any Time" },
  12: { timeOfDay: "Any Time" },
  13: { timeOfDay: "Any Time" },
  14: { timeOfDay: "Any Time" },
  15: { timeOfDay: "Any Time" },
  16: { timeOfDay: "Any Time" },
  // Bhagta Ki Bani
  17: { timeOfDay: "Any Time" },
  18: { timeOfDay: "Any Time" },
  // Beyant Baniya
  19: { timeOfDay: "Any Time" },
  20: { timeOfDay: "Any Time" },
  21: { timeOfDay: "Any Time" },
  22: { timeOfDay: "Any Time" },
  23: { timeOfDay: "Any Time" },
  24: { timeOfDay: "Any Time" },
  25: { timeOfDay: "Any Time" },
  26: { timeOfDay: "Any Time" }
};

const CATEGORIES = [
  { key: "nitnem", label: "Nitnem (☬ ਨਿਤਨੇਮ)" },
  { key: "asa_di_var", label: "Asa Di Var (☬ ਆਸਾ ਦੀ ਵਾਰ)" },
  { key: "sukhmani_sahib", label: "Sukhmani Sahib (☬ ਸੁਖਮਨੀ ਸਾਹਿਬ)" },
  { key: "sawaiye", label: "Sawaiye (☬ ਸਵਈਏ)" },
  { key: "bhagta_ki_bani", label: "Bhagta Ki Bani (☬ ਭਗਤਾਂ ਕੀ ਬਾਣੀ)" },
  { key: "beyant_baniya", label: "Beyant Baniya (☬ ਬੇਅੰਤ ਬਾਣੀਆਂ)" }
];

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
  
  // Custom Track Ordering State
  const [localTracks, setLocalTracks] = useState(tracks);

  useEffect(() => {
    setLocalTracks(tracks);
  }, [tracks]);

  // Speed Control States
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isSpeedControllerVisible, setIsSpeedControllerVisible] = useState(true);
  const [hudMessage, setHudMessage] = useState("");
  const hudTimeoutRef = useRef(null);

  // Info Guide State
  const [isGuideVisible, setIsGuideVisible] = useState(false);

  const activeTrack = localTracks[currentIndex] || tracks[0];
  const activeMeta = TRACK_METADATA[activeTrack?.id] || { timeOfDay: "Any Time" };
  const prevIndex = useRef(currentIndex);

  // Helper to flash HUD message
  const flashHud = useCallback((message) => {
    setHudMessage(message);
    if (hudTimeoutRef.current) clearTimeout(hudTimeoutRef.current);
    hudTimeoutRef.current = setTimeout(() => {
      setHudMessage("");
    }, 1200);
  }, []);

  // Reorder tracks within their category
  const moveTrack = (trackId, direction) => {
    const index = localTracks.findIndex(t => t.id === trackId);
    if (index === -1) return;
    const track = localTracks[index];
    const category = track.category;
    
    // Get tracks in this category with their current absolute index in localTracks
    const catTracksWithIndices = localTracks
      .map((t, idx) => ({ track: t, originalIndex: idx }))
      .filter(item => item.track.category === category);
      
    const catPos = catTracksWithIndices.findIndex(item => item.track.id === trackId);
    if (catPos === -1) return;
    
    let swapWithCatPos = -1;
    if (direction === 'up' && catPos > 0) {
      swapWithCatPos = catPos - 1;
    } else if (direction === 'down' && catPos < catTracksWithIndices.length - 1) {
      swapWithCatPos = catPos + 1;
    }
    
    if (swapWithCatPos !== -1) {
      const targetIndex = catTracksWithIndices[swapWithCatPos].originalIndex;
      const newTracks = [...localTracks];
      // Swap elements
      newTracks[index] = localTracks[targetIndex];
      newTracks[targetIndex] = track;
      
      setLocalTracks(newTracks);
      
      // Keep playhead on correct track index
      const currentPlayingId = localTracks[currentIndex]?.id;
      const newPlayingIndex = newTracks.findIndex(t => t.id === currentPlayingId);
      if (newPlayingIndex !== -1) {
        setCurrentIndex(newPlayingIndex);
      }
      
      flashHud(`Moved ${direction === 'up' ? 'Up' : 'Down'}`);
    }
  };

  const resetTrackOrder = () => {
    setLocalTracks(tracks);
    const currentPlayingId = localTracks[currentIndex]?.id;
    const defaultIndex = tracks.findIndex(t => t.id === currentPlayingId);
    if (defaultIndex !== -1) {
      setCurrentIndex(defaultIndex);
    }
    flashHud("Order Reset");
  };

  // Sync state changes from parent footer click
  useEffect(() => {
    if (!playerTrigger) return;
    setIsComplete(false);
    
    if (playerTrigger.type === 'nitnem') {
      setActiveSequence([1, 2, 3, 4, 5, 8]);
      const idx = localTracks.findIndex(t => t.id === 1);
      if (idx !== -1) setCurrentIndex(idx);
    } else if (playerTrigger.type === 'reht') {
      setActiveSequence([1, 2, 3, 4, 5, 6, 7, 8]);
      const idx = localTracks.findIndex(t => t.id === 1);
      if (idx !== -1) setCurrentIndex(idx);
    } else if (playerTrigger.type === 'simran') {
      setActiveSequence([8]);
      const idx = localTracks.findIndex(t => t.id === 8);
      if (idx !== -1) setCurrentIndex(idx);
    }
    
    setIsPlaying(true);
  }, [playerTrigger, localTracks, setActiveSequence]);

  // Sync playback speed to HTML5 audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed, currentIndex]);

  // Play/Pause effect
  useEffect(() => {
    if (!audioRef.current) return;
    
    // Check if the current track has an audio URL
    if (!activeTrack.audioUrl) {
      setIsPlaying(false);
      return;
    }

    if (prevIndex.current !== currentIndex) {
      // Changed track
      setIsComplete(false);
      audioRef.current.load();
      prevIndex.current = currentIndex;

      // Autoplay selected track
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        if (audioRef.current) {
          audioRef.current.playbackRate = playbackSpeed;
        }
      }).catch((err) => {
        console.log("Autoplay blocked or interrupted", err);
        setIsPlaying(false);
      });
    } else {
      if (isPlaying) {
        audioRef.current.play().then(() => {
          if (audioRef.current) {
            audioRef.current.playbackRate = playbackSpeed;
          }
        }).catch((err) => {
          console.log("Play failed", err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentIndex, activeTrack.audioUrl, playbackSpeed]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (hudTimeoutRef.current) clearTimeout(hudTimeoutRef.current);
    };
  }, []);

  const togglePlay = useCallback(() => {
    if (!activeTrack.audioUrl) return;
    if (isComplete) {
      setIsComplete(false);
      setCurrentIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(prev => !prev);
    }
  }, [isComplete, activeTrack.audioUrl]);

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeEl = document.activeElement;
      if (
        activeEl && 
        (activeEl.tagName === 'INPUT' || 
         activeEl.tagName === 'TEXTAREA' || 
         activeEl.isContentEditable)
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      
      switch (key) {
        case 's': // Decrease speed (min 0.5x)
          e.preventDefault();
          setPlaybackSpeed(prev => {
            const next = Math.max(0.5, Math.round((prev - 0.05) * 100) / 100);
            flashHud(`${next.toFixed(2)}x Speed`);
            return next;
          });
          break;
        case 'd': // Increase speed (max 2.0x)
          e.preventDefault();
          setPlaybackSpeed(prev => {
            const next = Math.min(2.0, Math.round((prev + 0.05) * 100) / 100);
            flashHud(`${next.toFixed(2)}x Speed`);
            return next;
          });
          break;
        case 'r': // Reset speed
          e.preventDefault();
          setPlaybackSpeed(1.0);
          flashHud("Speed Reset (1.00x)");
          break;
        case 'z': // Rewind 10s
          e.preventDefault();
          if (audioRef.current) {
            const targetTime = Math.max(0, audioRef.current.currentTime - 10);
            audioRef.current.currentTime = targetTime;
            setCurrentTime(targetTime);
            flashHud("-10s");
          }
          break;
        case 'x': // Forward 10s
          e.preventDefault();
          if (audioRef.current) {
            const targetTime = Math.min(duration, audioRef.current.currentTime + 10);
            audioRef.current.currentTime = targetTime;
            setCurrentTime(targetTime);
            flashHud("+10s");
          }
          break;
        case 'g': // Toggle preferred speed (1.25x)
          e.preventDefault();
          setPlaybackSpeed(prev => {
            const next = prev === 1.25 ? 1.0 : 1.25;
            flashHud(`${next.toFixed(2)}x Speed`);
            return next;
          });
          break;
        case 'v': // Toggle controller visibility
          e.preventDefault();
          setIsSpeedControllerVisible(prev => {
            const next = !prev;
            flashHud(next ? "Speed Controls On" : "Speed Controls Off");
            return next;
          });
          break;
        case ' ': // Spacebar: Play/Pause
          e.preventDefault();
          togglePlay();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [duration, isComplete, isPlaying, togglePlay, flashHud]);

  // Handle track ended
  const handleEnded = () => {
    if (isLooping) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => console.log("Loop replay error:", e));
      }
    } else {
      if (activeSequence) {
        const activeTrackId = localTracks[currentIndex].id;
        const seqIndex = activeSequence.indexOf(activeTrackId);
        if (seqIndex !== -1 && seqIndex < activeSequence.length - 1) {
          const nextTrackId = activeSequence[seqIndex + 1];
          const nextIndex = localTracks.findIndex(t => t.id === nextTrackId);
          if (nextIndex !== -1) {
            setCurrentIndex(nextIndex);
          } else {
            setIsComplete(true);
            setIsPlaying(false);
          }
        } else {
          setIsComplete(true);
          setIsPlaying(false);
        }
      } else {
        if (currentIndex < localTracks.length - 1) {
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
      audioRef.current.playbackRate = playbackSpeed;
    }
  };

  const handlePlayEvent = () => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
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
      flashHud("-5s");
    }
  };

  const skipForward = () => {
    if (audioRef.current) {
      const targetTime = Math.min(duration, audioRef.current.currentTime + 5);
      audioRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
      flashHud("+5s");
    }
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    setActiveSequence(null);
    if (currentIndex < localTracks.length - 1) {
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

  // Helper to render the breathing "Waheguru" minimal panel with HUD & Unconfigured state
  const renderGurbaniContent = () => {
    if (!activeTrack.audioUrl) {
      return (
        <div className="w-full h-[240px] bg-black border border-[#1a1a1a] flex flex-col items-center justify-center text-center select-none relative overflow-hidden transition-all duration-500 hover:border-[#c8a96e]/30 group">
          <div className="absolute top-3 left-3 w-1.5 h-1.5 border-t border-l border-[#c8a96e]/20 group-hover:border-[#c8a96e]/60 transition-colors duration-500" />
          <div className="absolute top-3 right-3 w-1.5 h-1.5 border-t border-r border-[#c8a96e]/20 group-hover:border-[#c8a96e]/60 transition-colors duration-500" />
          <div className="absolute bottom-3 left-3 w-1.5 h-1.5 border-b border-l border-[#c8a96e]/20 group-hover:border-[#c8a96e]/60 transition-colors duration-500" />
          <div className="absolute bottom-3 right-3 w-1.5 h-1.5 border-b border-r border-[#c8a96e]/20 group-hover:border-[#c8a96e]/60 transition-colors duration-500" />
          
          <span className="text-[12px] font-mono text-[#c8a96e] px-4 py-2 border border-[#c8a96e]/20 bg-[#161616] uppercase tracking-widest font-semibold">
            [ Audio Not Configured ]
          </span>
          <span className="text-[10px] text-[#444444] uppercase tracking-wider font-mono mt-3 px-8 leading-relaxed">
            Paste the Supabase audio link for<br/>
            <span className="text-[#888888]">"{activeTrack.title}"</span> in tracks.js
          </span>
        </div>
      );
    }

    return (
      <div className="w-full h-[240px] bg-black border border-[#1a1a1a] flex flex-col items-center justify-center text-center select-none relative overflow-hidden transition-all duration-500 hover:border-[#c8a96e]/30 group">
        
        {/* Subtle decorative framing gold corners */}
        <div className="absolute top-3 left-3 w-1.5 h-1.5 border-t border-l border-[#c8a96e]/20 group-hover:border-[#c8a96e]/60 transition-colors duration-500" />
        <div className="absolute top-3 right-3 w-1.5 h-1.5 border-t border-r border-[#c8a96e]/20 group-hover:border-[#c8a96e]/60 transition-colors duration-500" />
        <div className="absolute bottom-3 left-3 w-1.5 h-1.5 border-b border-l border-[#c8a96e]/20 group-hover:border-[#c8a96e]/60 transition-colors duration-500" />
        <div className="absolute bottom-3 right-3 w-1.5 h-1.5 border-b border-r border-[#c8a96e]/20 group-hover:border-[#c8a96e]/60 transition-colors duration-500" />

        {/* HUD Flash Overlay */}
        {hudMessage && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20 transition-opacity duration-300">
            <span className="text-[18px] font-mono text-[#c8a96e] border border-[#c8a96e]/30 px-6 py-2.5 rounded bg-[#141414] tracking-widest font-semibold animate-pulse shadow-2xl">
              {hudMessage}
            </span>
          </div>
        )}

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
        src={activeTrack.audioUrl || undefined}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={handlePlayEvent}
        onEnded={handleEnded}
      />

      {/* ━━━ HEADER ━━━ */}
      <div className="flex justify-between items-start border-b border-[#1e1e1e] pb-6 mb-8 select-none">
        <div>
          <h1 className="font-serif text-[28px] text-[#f5f0e8] font-normal leading-none">Path.io</h1>
          <p className="text-[10px] text-[#444444] uppercase tracking-widest mt-1.5 font-mono">Nitnem &amp; Baanis</p>
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
              Now playing · {currentIndex + 1} of {localTracks.length}
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
                <Tooltip text={isLooping ? "Disable Repeat" : "Repeat Current Path"}>
                  <button 
                    onClick={() => setIsLooping(prev => !prev)}
                    className="p-2 transition-colors focus:outline-none"
                    aria-label="Loop Track"
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
                </Tooltip>

                {/* Speed Controls Toggle Button */}
                <Tooltip text="Toggle Speed Panel (V)">
                  <button 
                    onClick={() => setIsSpeedControllerVisible(prev => !prev)}
                    className="p-2 transition-colors focus:outline-none flex items-center space-x-1"
                    aria-label="Toggle Speed Controls"
                  >
                    <svg 
                      width="16" 
                      height="16" 
                      fill="none" 
                      stroke={isSpeedControllerVisible ? "#c8a96e" : "#555555"} 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span className={`text-[9px] font-mono ${isSpeedControllerVisible ? 'text-[#c8a96e]' : 'text-[#555555]'}`}>
                      {playbackSpeed.toFixed(2)}x
                    </span>
                  </button>
                </Tooltip>

                {/* Prev */}
                <Tooltip text="Previous Path">
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
                </Tooltip>

                {/* Play/Pause */}
                <Tooltip text={isPlaying ? "Pause (Space)" : "Play (Space)"}>
                  <button 
                    onClick={togglePlay}
                    className="w-11 h-11 rounded-full flex items-center justify-center bg-[#f5f0e8] text-[#0d0d0d] hover:bg-[#c8a96e] transition-colors focus:outline-none shadow-md disabled:opacity-40"
                    disabled={!activeTrack.audioUrl}
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
                </Tooltip>

                {/* Next */}
                <Tooltip text="Next Path">
                  <button 
                    onClick={handleNext}
                    disabled={currentIndex === localTracks.length - 1}
                    className="p-2 transition-colors disabled:opacity-20 focus:outline-none"
                    style={{ color: currentIndex === localTracks.length - 1 ? '#272727' : '#555555' }}
                    aria-label="Next Track"
                  >
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6z" />
                    </svg>
                  </button>
                </Tooltip>

                {/* Reset */}
                <Tooltip text="Reset Playhead (R)">
                  <button 
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentTime(0);
                      if (audioRef.current) {
                        audioRef.current.currentTime = 0;
                      }
                      flashHud("Reset");
                    }}
                    className="p-2 transition-colors hover:text-[#888888] focus:outline-none text-[#555555]"
                    aria-label="Reset Track"
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <rect x="5" y="5" width="14" height="14" rx="2"></rect>
                    </svg>
                  </button>
                </Tooltip>

              </div>
            )}
          </div>

          {/* 5. PLAYBACK SPEED WIDGET CONTROLLER */}
          {isSpeedControllerVisible && (
            <div className="flex flex-col items-center space-y-3.5 border-t border-[#1e1e1e] pt-5 select-none animate-fadeIn w-full max-w-sm mx-auto">
              <div className="flex items-center justify-between w-full px-1">
                <span className="text-[10px] text-[#444444] uppercase tracking-widest font-mono">Playback Speed</span>
                <span className="text-[12px] font-mono font-bold text-[#c8a96e] bg-[#161616] border border-[#c8a96e]/30 px-2 py-0.5 rounded">
                  {playbackSpeed.toFixed(2)}x
                </span>
              </div>
              
              {/* Slider for smooth speed control (0.5x - 2.0x) */}
              <div className="w-full flex items-center space-x-3 px-1">
                <span className="text-[9px] font-mono text-[#444444]">0.5x</span>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.01"
                  value={playbackSpeed}
                  onChange={(e) => {
                    const speed = parseFloat(e.target.value);
                    setPlaybackSpeed(speed);
                  }}
                  style={{
                    '--pct': `${((playbackSpeed - 0.5) / 1.5) * 100}%`,
                    background: 'linear-gradient(to right, #c8a96e var(--pct), #1e1e1e var(--pct))'
                  }}
                  className="flex-1 h-[2px] appearance-none cursor-pointer rounded-none outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#c8a96e]"
                />
                <span className="text-[9px] font-mono text-[#444444]">2.0x</span>
              </div>

              {/* Adjustments buttons */}
              <div className="flex items-center justify-center space-x-1.5 w-full mt-1">
                
                <Tooltip text="Slower -0.05x (S)">
                  <button 
                    onClick={() => setPlaybackSpeed(prev => {
                      const next = Math.max(0.5, Math.round((prev - 0.05) * 100) / 100);
                      flashHud(`${next.toFixed(2)}x Speed`);
                      return next;
                    })}
                    className="w-6 h-6 flex items-center justify-center border border-[#1e1e1e] hover:border-[#333333] hover:text-[#c8a96e] transition-colors rounded text-[11px] font-mono text-[#888888] focus:outline-none"
                  >
                    −
                  </button>
                </Tooltip>

                <Tooltip text="Faster +0.05x (D)">
                  <button 
                    onClick={() => setPlaybackSpeed(prev => {
                      const next = Math.min(2.0, Math.round((prev + 0.05) * 100) / 100);
                      flashHud(`${next.toFixed(2)}x Speed`);
                      return next;
                    })}
                    className="w-6 h-6 flex items-center justify-center border border-[#1e1e1e] hover:border-[#333333] hover:text-[#c8a96e] transition-colors rounded text-[11px] font-mono text-[#888888] focus:outline-none"
                  >
                    +
                  </button>
                </Tooltip>

                <Tooltip text="Reset Speed (R)">
                  <button 
                    onClick={() => {
                      setPlaybackSpeed(1.0);
                      flashHud("1.00x Speed");
                    }}
                    className="px-2 h-6 flex items-center justify-center border border-[#1e1e1e] hover:border-[#333333] hover:text-[#c8a96e] transition-colors rounded text-[10px] font-mono text-[#888888] focus:outline-none"
                  >
                    1.0x
                  </button>
                </Tooltip>

                <Tooltip text="Set Average Speed (G)">
                  <button 
                    onClick={() => {
                      setPlaybackSpeed(1.25);
                      flashHud("1.25x Speed");
                    }}
                    className="px-2 h-6 flex items-center justify-center border border-[#1e1e1e] hover:border-[#333333] hover:text-[#c8a96e] transition-colors rounded text-[10px] font-mono text-[#888888] focus:outline-none"
                  >
                    1.25x
                  </button>
                </Tooltip>

                <div className="w-[1px] h-3 bg-[#1e1e1e] mx-1" />

                <Tooltip text="Hide Panel (V)">
                  <button
                    onClick={() => setIsSpeedControllerVisible(false)}
                    className="text-[#444444] hover:text-[#f5f0e8] transition-colors text-[10px] font-mono focus:outline-none"
                  >
                    close
                  </button>
                </Tooltip>
              </div>
            </div>
          )}

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

          {/* 6. PLAYBACK PATH LOCATORS */}
          <div className="border-t border-[#1e1e1e] pt-6 mt-2 flex flex-col items-center space-y-3 select-none">
            <div className="flex items-center space-x-2">
              <span className="text-[9px] text-[#444444] uppercase tracking-[0.2em] font-mono">
                Quick Sequence Paths
              </span>
              <Tooltip text="Toggle Sequence Guide Info" position="top">
                <button 
                  onClick={() => setIsGuideVisible(prev => !prev)}
                  className="w-3.5 h-3.5 rounded-full flex items-center justify-center border border-[#1e1e1e] hover:border-[#c8a96e] hover:text-[#c8a96e] text-[8px] font-mono text-[#555555] transition-colors focus:outline-none"
                  aria-label="Toggle Guide Info"
                >
                  i
                </button>
              </Tooltip>
            </div>
            
            <div className="flex items-center justify-center gap-2 flex-wrap max-w-md">
              
              <button
                onClick={() => {
                  setIsComplete(false);
                  setActiveSequence([1, 2, 3, 4, 5, 8]);
                  const idx = localTracks.findIndex(t => t.id === 1);
                  if (idx !== -1) {
                    setCurrentIndex(idx);
                    setIsPlaying(true);
                  }
                }}
                className={`text-[10px] font-mono py-1.5 px-3 border transition-all duration-300 rounded uppercase tracking-wider ${
                  activeSequence && JSON.stringify(activeSequence) === JSON.stringify([1, 2, 3, 4, 5, 8])
                    ? 'border-[#c8a96e] text-[#c8a96e] bg-[#161310]'
                    : 'border-[#1e1e1e] text-[#888888] hover:border-[#333333] hover:text-[#f5f0e8]'
                }`}
              >
                [ nitnem ]
              </button>

              <button
                onClick={() => {
                  setIsComplete(false);
                  setActiveSequence([1, 2, 3, 4, 5, 6, 7, 8]);
                  const idx = localTracks.findIndex(t => t.id === 1);
                  if (idx !== -1) {
                    setCurrentIndex(idx);
                    setIsPlaying(true);
                  }
                }}
                className={`text-[10px] font-mono py-1.5 px-3 border transition-all duration-300 rounded uppercase tracking-wider ${
                  activeSequence && JSON.stringify(activeSequence) === JSON.stringify([1, 2, 3, 4, 5, 6, 7, 8])
                    ? 'border-[#c8a96e] text-[#c8a96e] bg-[#161310]'
                    : 'border-[#1e1e1e] text-[#888888] hover:border-[#333333] hover:text-[#f5f0e8]'
                }`}
              >
                [ reht ]
              </button>

              <button
                onClick={() => {
                  setIsComplete(false);
                  setActiveSequence([8]);
                  const idx = localTracks.findIndex(t => t.id === 8);
                  if (idx !== -1) {
                    setCurrentIndex(idx);
                    setIsPlaying(true);
                  }
                }}
                className={`text-[10px] font-mono py-1.5 px-3 border transition-all duration-300 rounded uppercase tracking-wider ${
                  activeSequence && JSON.stringify(activeSequence) === JSON.stringify([8])
                    ? 'border-[#c8a96e] text-[#c8a96e] bg-[#161310]'
                    : 'border-[#1e1e1e] text-[#888888] hover:border-[#333333] hover:text-[#f5f0e8]'
                }`}
              >
                [ simran ]
              </button>

              <button
                onClick={() => {
                  setIsComplete(false);
                  setActiveSequence([9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 19, 20, 21, 22, 23, 24, 25, 26]);
                  const idx = localTracks.findIndex(t => t.id === 9);
                  if (idx !== -1) {
                    setCurrentIndex(idx);
                    setIsPlaying(true);
                  }
                }}
                className={`text-[10px] font-mono py-1.5 px-3 border transition-all duration-300 rounded uppercase tracking-wider ${
                  activeSequence && JSON.stringify(activeSequence) === JSON.stringify([9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 19, 20, 21, 22, 23, 24, 25, 26])
                    ? 'border-[#c8a96e] text-[#c8a96e] bg-[#161310]'
                    : 'border-[#1e1e1e] text-[#888888] hover:border-[#333333] hover:text-[#f5f0e8]'
                }`}
              >
                [ amritvela ]
              </button>

              <button
                onClick={() => {
                  setIsComplete(false);
                  setActiveSequence([19, 20, 21, 22, 23, 24, 25, 26]);
                  const idx = localTracks.findIndex(t => t.id === 19);
                  if (idx !== -1) {
                    setCurrentIndex(idx);
                    setIsPlaying(true);
                  }
                }}
                className={`text-[10px] font-mono py-1.5 px-3 border transition-all duration-300 rounded uppercase tracking-wider ${
                  activeSequence && JSON.stringify(activeSequence) === JSON.stringify([19, 20, 21, 22, 23, 24, 25, 26])
                    ? 'border-[#c8a96e] text-[#c8a96e] bg-[#161310]'
                    : 'border-[#1e1e1e] text-[#888888] hover:border-[#333333] hover:text-[#f5f0e8]'
                }`}
              >
                [ beyant baniya ]
              </button>

            </div>

            {/* Devotional Sequence Guide Panel */}
            {isGuideVisible && (
              <div className="w-full bg-[#141414] border border-[#1e1e1e] rounded p-4 text-left text-[11px] font-mono text-[#888888] space-y-3 mt-3 animate-fadeIn max-w-md">
                <div className="flex justify-between items-center border-b border-[#1e1e1e] pb-1.5">
                  <span className="text-[#c8a96e] uppercase tracking-wider text-[10px] font-bold">☬ Sequence Guide</span>
                  <button onClick={() => setIsGuideVisible(false)} className="text-[9px] hover:text-[#f5f0e8] focus:outline-none">[close]</button>
                </div>
                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1.5 custom-playlist-scrollbar">
                  <div>
                    <span className="text-[#f5f0e8] font-semibold">[ nitnem ]</span>
                    <p className="text-[10px] text-[#555555] mt-0.5 leading-relaxed">Queues the core 5 morning Nitnem prayers and Simran: Japji Sahib ➔ Jaap Sahib ➔ Savaiye ➔ Chaupai Sahib ➔ Anand Sahib ➔ Simran.</p>
                  </div>
                  <div>
                    <span className="text-[#f5f0e8] font-semibold">[ reht ]</span>
                    <p className="text-[10px] text-[#555555] mt-0.5 leading-relaxed">Queues the complete 8 original daily prayers in sequence: Japji ➔ Jaap ➔ Savaiye ➔ Chaupai ➔ Anand ➔ Rehras Sahib ➔ Sohaila Sahib ➔ Simran.</p>
                  </div>
                  <div>
                    <span className="text-[#f5f0e8] font-semibold">[ simran ]</span>
                    <p className="text-[10px] text-[#555555] mt-0.5 leading-relaxed">Queues Naam Simran repeat path for continuous focused meditation.</p>
                  </div>
                  <div>
                    <span className="text-[#f5f0e8] font-semibold">[ amritvela ]</span>
                    <p className="text-[10px] text-[#555555] mt-0.5 leading-relaxed">A comprehensive spiritual sequence designed for early morning: Asa Kee Vaar ➔ Sukhmani Sahib ➔ complete 8-Bani Nitnem ➔ all Beyant Baniya.</p>
                  </div>
                  <div>
                    <span className="text-[#f5f0e8] font-semibold">[ beyant baniya ]</span>
                    <p className="text-[10px] text-[#555555] mt-0.5 leading-relaxed">Queues all miscellaneous bani recitations (Baarah Maah, Chaubole, Tve Prashad Chaupai, Salok M:9, Shabad Hazare, Shabad Hazare Patshahi 10, Basant Ki Vaar, and Naam Abhiyaas).</p>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN (320px+): playlist grouped by categories with sorting */}
        <div className="w-full lg:w-[320px] xl:w-[360px] shrink-0 border-t lg:border-t-0 lg:border-l border-[#1e1e1e] pt-8 lg:pt-0 lg:pl-8 flex flex-col justify-between">
          
          <div className="w-full select-none overflow-y-auto max-h-[640px] pr-2 custom-playlist-scrollbar">
            
            {/* Header row */}
            <div className="flex justify-between items-center mb-6 text-[10px] font-mono text-[#444444] tracking-widest uppercase pb-2 border-b border-[#1e1e1e]">
              <span>Grouped Playlist</span>
              
              <Tooltip text="Restore original tracks order" position="bottom">
                <button
                  onClick={resetTrackOrder}
                  className="text-[9px] text-[#c8a96e] hover:text-[#d4b87a] uppercase tracking-wider transition-colors border border-[#c8a96e]/20 hover:border-[#c8a96e]/50 px-1.5 py-0.5 rounded bg-transparent focus:outline-none"
                >
                  Reset Order
                </button>
              </Tooltip>
            </div>

            {/* Categorized Track lists */}
            <div className="flex flex-col space-y-6">
              {CATEGORIES.map(cat => {
                const catTracks = localTracks.filter(t => t.category === cat.key);
                if (catTracks.length === 0) return null;

                return (
                  <div key={cat.key} className="flex flex-col">
                    {/* Category Label */}
                    <div className="text-[10px] font-mono text-[#c8a96e]/70 tracking-wider uppercase mb-2 pb-1 border-b border-[#161616]">
                      {cat.label}
                    </div>

                    {/* Category Tracks */}
                    <div className="flex flex-col space-y-1">
                      {catTracks.map(track => {
                        const trackIndex = localTracks.findIndex(t => t.id === track.id);
                        const isActive = trackIndex === currentIndex;
                        const isUpcoming = trackIndex > currentIndex;
                        const isConfigured = !!track.audioUrl;

                        return (
                          <div
                            key={track.id}
                            style={{ opacity: isUpcoming ? 0.35 : 1 }}
                            className={`w-full group/row flex items-center justify-between py-2 px-2 rounded transition-all duration-300 ${
                              isActive ? 'bg-[#161616] border-l-2 border-[#c8a96e]' : 'bg-transparent hover:bg-[#161616]'
                            }`}
                          >
                            <button
                              onClick={() => selectTrack(trackIndex)}
                              className="flex-1 text-left flex items-center space-x-2.5 min-w-0 focus:outline-none"
                            >
                              {/* Index / Active Dot */}
                              <span className={`text-[9px] font-mono ${isActive ? 'text-[#c8a96e]' : 'text-[#2e2e2e]'}`}>
                                {trackIndex + 1}
                              </span>

                              {/* Dot */}
                              <span 
                                style={{ visibility: isActive ? 'visible' : 'hidden' }}
                                className="w-1 h-1 rounded-full bg-[#c8a96e] shrink-0" 
                              />

                              {/* Track Titles */}
                              <div className="min-w-0">
                                <p className={`text-[13px] font-gurmukhi leading-snug truncate transition-colors duration-300 ${
                                  isActive ? 'text-[#f5f0e8]' : 'text-[#888888]'
                                }`}>
                                  {track.titleGur}
                                </p>
                                <p className="text-[9px] text-[#333333] uppercase tracking-wider font-mono truncate mt-0.5 flex items-center gap-1.5">
                                  <span>{track.title}</span>
                                  {!isConfigured && (
                                    <span className="text-[8px] border border-[#ff4444]/30 text-[#ff4444]/60 px-1 py-0 rounded font-mono lowercase">
                                      no-link
                                    </span>
                                  )}
                                </p>
                              </div>
                            </button>

                            {/* Up/Down buttons (small, visible on hover) */}
                            <div className="flex items-center space-x-1 pl-2 shrink-0 opacity-0 group-hover/row:opacity-100 transition-opacity duration-300">
                              <Tooltip text="Move Up" position="top">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    moveTrack(track.id, 'up');
                                  }}
                                  className="w-4 h-4 flex items-center justify-center border border-[#1e1e1e] hover:border-[#c8a96e] hover:text-[#c8a96e] rounded text-[8px] text-[#444444] transition-colors focus:outline-none"
                                >
                                  ▲
                                </button>
                              </Tooltip>
                              
                              <Tooltip text="Move Down" position="top">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    moveTrack(track.id, 'down');
                                  }}
                                  className="w-4 h-4 flex items-center justify-center border border-[#1e1e1e] hover:border-[#c8a96e] hover:text-[#c8a96e] rounded text-[8px] text-[#444444] transition-colors focus:outline-none"
                                >
                                  ▼
                                </button>
                              </Tooltip>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
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
