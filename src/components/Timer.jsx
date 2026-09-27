import React from 'react';

export default function Timer({ time, isRunning }) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 3rem',
      borderRadius: '24px',
      minWidth: '280px',
      position: 'relative',
      zIndex: 10
    }}>
      <h2 style={{
        fontSize: '1.5rem',
        textTransform: 'uppercase',
        letterSpacing: '4px',
        color: 'var(--text-muted)',
        marginBottom: '1rem'
      }}>
        Match Time
      </h2>
      <div className={isRunning ? "animate-pulse-glow" : ""} style={{
        fontSize: '6rem',
        fontWeight: '900',
        lineHeight: '1',
        fontVariantNumeric: 'tabular-nums',
        textShadow: '0 0 20px rgba(255,255,255,0.3)',
        color: time <= 30 ? 'var(--accent-red)' : 'var(--text-main)'
      }}>
        {formatTime(time)}
      </div>
      
      <div style={{
        marginTop: '1.5rem',
        padding: '0.5rem 1.5rem',
        borderRadius: '50px',
        backgroundColor: isRunning ? 'rgba(0, 204, 255, 0.2)' : 'rgba(255, 51, 102, 0.2)',
        color: isRunning ? 'var(--accent-blue)' : 'var(--accent-red)',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        fontSize: '0.875rem'
      }}>
        {isRunning ? 'Running' : 'Paused'}
      </div>
    </div>
  );
}
