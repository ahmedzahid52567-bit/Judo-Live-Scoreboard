import React from 'react';

export default function PlayerCard({ player, position }) {
  const isLeft = position === 'left';
  const accentColor = isLeft ? 'var(--accent-blue)' : 'var(--accent-red)';
  const gradientClass = isLeft ? 'text-gradient-blue' : 'text-gradient-red';

  return (
    <div className="glass" style={{
      display: 'flex',
      flexDirection: isLeft ? 'row' : 'row-reverse',
      alignItems: 'stretch',
      borderRadius: '32px',
      overflow: 'hidden',
      height: '400px',
      position: 'relative'
    }}>
      {/* Player Photo Section */}
      <div style={{
        flex: '0 0 300px',
        position: 'relative',
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRight: isLeft ? `4px solid ${accentColor}` : 'none',
        borderLeft: !isLeft ? `4px solid ${accentColor}` : 'none',
      }}>
        {player.photo ? (
          <img 
            src={player.photo} 
            alt={player.name} 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top center'
            }}
          />
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
        
        {/* Name overlay gradient */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '150px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
          zIndex: 1
        }} />
      </div>

      {/* Info Section */}
      <div style={{
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '2rem 3rem',
        textAlign: isLeft ? 'left' : 'right'
      }}>
        <h3 style={{
          fontSize: '1.25rem',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          marginBottom: '0.5rem'
        }}>
          {player.college || 'College'}
        </h3>
        <h2 style={{
          fontSize: '3.5rem',
          fontWeight: '900',
          lineHeight: '1.1',
          marginBottom: '2rem',
          textTransform: 'uppercase'
        }}>
          {player.name || 'Player'}
        </h2>
        
      </div>
    </div>
  );
}
