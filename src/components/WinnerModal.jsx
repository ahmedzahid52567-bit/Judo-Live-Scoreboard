import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy } from 'lucide-react';

export default function WinnerModal({ winner, onClose }) {
  useEffect(() => {
    // Fire confetti bursts
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff3366', '#00ccff', '#ffffff']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff3366', '#00ccff', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(11, 15, 25, 0.9)',
      backdropFilter: 'blur(10px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    }}>
      <div className="glass" style={{
        padding: 'clamp(2rem, 5vw, 4rem)',
        borderRadius: '40px',
        maxWidth: '800px',
        width: '95%',
        textAlign: 'center',
        position: 'relative',
        boxShadow: '0 20px 60px rgba(0, 204, 255, 0.2), 0 20px 60px rgba(255, 51, 102, 0.2)'
      }}>
        <div className="animate-glow-pulse-gold" style={{
          position: 'absolute',
          top: '-40px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, #ffd700, #ffaa00)',
          borderRadius: '50%',
          padding: '20px',
          boxShadow: '0 10px 30px rgba(255, 215, 0, 0.5)'
        }}>
          <Trophy size={48} color="#000" />
        </div>

        <h1 style={{
          fontSize: 'clamp(1.5rem, 4vw, 3rem)',
          fontWeight: '900',
          textTransform: 'uppercase',
          letterSpacing: '4px',
          marginTop: '2rem',
          marginBottom: '1rem',
          background: 'linear-gradient(to right, #ff3366, #00ccff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: '1.2',
          whiteSpace: 'nowrap'
        }}>
          Congratulations!
        </h1>

        <div className="animate-pulse-border" style={{
          width: '240px',
          height: '240px',
          margin: '2rem auto',
          borderRadius: '50%',
          overflow: 'hidden',
          border: '6px solid var(--text-main)',
          boxShadow: '0 0 30px rgba(255,255,255,0.3)',
          backgroundColor: '#222'
        }}>
          {winner.photo ? (
            <img src={winner.photo} alt={winner.name} style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }} />
          ) : (
             <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              fontSize: '4rem',
              opacity: 0.3
            }}>
              ?
            </div>
          )}
        </div>

        <h2 className="animate-fade-in-up" style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '0.5rem', textTransform: 'uppercase', animationDelay: '0.2s', animationFillMode: 'both' }}>
          {winner.name}
        </h2>
        <h3 className="animate-fade-in-up" style={{ fontSize: '1.5rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '4px', animationDelay: '0.4s', animationFillMode: 'both' }}>
          {winner.college}
        </h3>
        


        {onClose && (
          <button 
            onClick={onClose}
            style={{
              marginTop: '3rem',
              padding: '1rem 3rem',
              fontSize: '1.25rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              backgroundColor: 'transparent',
              color: 'var(--text-main)',
              border: '2px solid var(--text-main)',
              borderRadius: '50px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={e => {
              e.currentTarget.style.backgroundColor = 'var(--text-main)';
              e.currentTarget.style.color = 'var(--bg-color)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--text-main)';
            }}
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}
