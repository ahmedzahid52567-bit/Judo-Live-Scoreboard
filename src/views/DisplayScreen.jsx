import React, { useState, useEffect, useCallback } from 'react';
import { Maximize, Minimize } from 'lucide-react';
import { useMatchState } from '../hooks/useMatchState';
import PlayerCard from '../components/PlayerCard';
import WinnerModal from '../components/WinnerModal';

export default function DisplayScreen() {
  const { state } = useMatchState(false); // Display mode (passive)
  const { players, showWinner, winner } = state;
  const [hideWinner, setHideWinner] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const videos = ['/bg-video.mp4', '/bg-video-2.mp4'];
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const handleVideoEnded = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  useEffect(() => {
    if (showWinner) {
      setHideWinner(false);
    }
  }, [showWinner, winner]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(e => console.error(e));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if typing in an input (though there shouldn't be any in display mode)
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Video */}
      <video 
        autoPlay 
        muted 
        playsInline
        src={videos[currentVideoIndex]}
        onEnded={handleVideoEnded}
        style={{
          position: 'absolute',
          top: 0, left: 0, 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover', 
          zIndex: 0
        }}
      />


      {/* Dark Overlay matching User Interface Opacity to make text readable */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(20, 25, 40, 0.7)',
        zIndex: 0
      }} />

      {/* Judo Watermark Prop */}
      <div className="animate-pulse-glow" style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '35vw',
        fontWeight: '900',
        color: 'rgba(255, 255, 255, 0.04)',
        zIndex: 0,
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
        userSelect: 'none'
      }}>
        柔道
      </div>

      {/* Main Content Container (z-index above background) */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1 }}>

        {/* Fullscreen Toggle Button */}
        <button 
          onClick={toggleFullscreen}
          style={{
            position: 'absolute',
            top: '0',
            right: '0',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s',
            zIndex: 10
          }}
          onMouseOver={e => e.currentTarget.style.color = 'var(--text-main)'}
          onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
          title="Toggle Fullscreen (F)"
        >
          {isFullscreen ? <Minimize size={28} /> : <Maximize size={28} />}
        </button>

        {/* HEADER: Institution Logo */}
        <div className="animate-slide-down" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
          <img src="/sambhram-wide-logo.jpeg" alt="Sambhram Logo" style={{ height: '160px', objectFit: 'contain', borderRadius: '15px' }} />
        </div>

        {/* SCOREBOARD AREA */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}>

          {/* TOP ROW: P1, VS, P2 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
            width: '100%'
          }}>
            <div className="animate-slide-in-left" style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <div className="animate-float" style={{ animationDelay: '0s' }}>
                <PlayerCard player={players[0]} position="left" />
              </div>
            </div>

            <div className="animate-zoom-in animate-pulse-glow" style={{
              fontSize: '5rem',
              fontWeight: '900',
              fontStyle: 'italic',
              color: 'var(--text-main)',
              textTransform: 'uppercase',
              letterSpacing: '8px',
              textShadow: '0 0 20px rgba(255,255,255,0.3)',
              opacity: 0.9,
              animationDelay: '0.3s', // delay slightly after players slide in
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <span>VS</span>
              <span className="animate-float" style={{ fontSize: '2.5rem', marginTop: '1rem', opacity: 0.8, animationDelay: '1s' }}>🥋</span>
            </div>

            <div className="animate-slide-in-right" style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
              <div className="animate-float" style={{ animationDelay: '2s' }}>
                <PlayerCard player={players[1]} position="right" />
              </div>
            </div>
          </div>

        </div>
      </div>

      {!hideWinner && showWinner && winner && (
        <WinnerModal winner={winner} onClose={() => setHideWinner(true)} />
      )}
    </div>
  );
}
