import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Trophy, ChevronUp, ChevronDown, User, Image as ImageIcon, Settings2 } from 'lucide-react';

export default function OperatorControls({ 
  players, setPlayers, 
  time, isRunning, toggleTimer, resetTimer, 
  onDeclareWinner 
}) {
  const [isOpen, setIsOpen] = useState(false);

  const updatePlayer = (id, field, value) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const adjustScore = (id, delta) => {
    setPlayers(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, score: Math.max(0, p.score + delta) };
      }
      return p;
    }));
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="glass"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          padding: '1rem',
          borderRadius: '50%',
          cursor: 'pointer',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-main)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}
        title="Open Operator Controls"
      >
        <Settings2 size={24} />
      </button>
    );
  }

  return (
    <div className="glass" style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      width: '400px',
      maxHeight: '80vh',
      overflowY: 'auto',
      borderRadius: '24px',
      padding: '2rem',
      zIndex: 50,
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>
          Operator Controls
        </h3>
        <button 
          onClick={() => setIsOpen(false)}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          Close
        </button>
      </div>

      {/* Timer Controls */}
      <div style={{ padding: '1.5rem', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '16px' }}>
        <h4 style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase' }}>Match Timer</h4>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={toggleTimer}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.75rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: isRunning ? 'var(--accent-red)' : 'var(--accent-blue)',
              color: '#fff',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {isRunning ? <><Pause size={18} /> Pause</> : <><Play size={18} /> Start</>}
          </button>
          <button 
            onClick={resetTimer}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid var(--text-muted)',
              backgroundColor: 'transparent',
              color: 'var(--text-main)',
              cursor: 'pointer'
            }}
            title="Reset Timer"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      {/* Players Edit */}
      {players.map((player, index) => (
        <div key={player.id} style={{ padding: '1.5rem', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '16px' }}>
          <h4 style={{ 
            marginBottom: '1rem', 
            color: index === 0 ? 'var(--accent-blue)' : 'var(--accent-red)', 
            fontSize: '0.875rem', 
            textTransform: 'uppercase',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            Player {index + 1}
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button onClick={() => adjustScore(player.id, -1)} style={scoreBtnStyle}>-</button>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold', width: '30px', textAlign: 'center' }}>{player.score}</span>
              <button onClick={() => adjustScore(player.id, 1)} style={scoreBtnStyle}>+</button>
            </div>
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={inputWrapperStyle}>
              <User size={16} color="var(--text-muted)" />
              <input 
                type="text" 
                value={player.name} 
                onChange={(e) => updatePlayer(player.id, 'name', e.target.value)}
                placeholder="Player Name"
                style={inputStyle}
              />
            </div>
            <div style={inputWrapperStyle}>
              <User size={16} color="var(--text-muted)" />
              <input 
                type="text" 
                value={player.college} 
                onChange={(e) => updatePlayer(player.id, 'college', e.target.value)}
                placeholder="College Name"
                style={inputStyle}
              />
            </div>
            <div style={inputWrapperStyle}>
              <ImageIcon size={16} color="var(--text-muted)" />
              <input 
                type="text" 
                value={player.photo} 
                onChange={(e) => updatePlayer(player.id, 'photo', e.target.value)}
                placeholder="Photo URL"
                style={inputStyle}
              />
            </div>
          </div>
        </div>
      ))}

      {/* Declare Winner */}
      <button 
        onClick={onDeclareWinner}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          padding: '1rem',
          borderRadius: '12px',
          border: 'none',
          background: 'linear-gradient(135deg, #ffd700, #ffaa00)',
          color: '#000',
          fontWeight: '900',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          cursor: 'pointer',
          marginTop: '1rem'
        }}
      >
        <Trophy size={20} />
        Declare Winner
      </button>

    </div>
  );
}

const inputWrapperStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  background: 'rgba(255,255,255,0.05)',
  padding: '0.75rem 1rem',
  borderRadius: '8px'
};

const inputStyle = {
  background: 'transparent',
  border: 'none',
  color: 'var(--text-main)',
  width: '100%',
  outline: 'none',
  fontSize: '0.875rem'
};

const scoreBtnStyle = {
  width: '28px',
  height: '28px',
  borderRadius: '6px',
  border: 'none',
  backgroundColor: 'rgba(255,255,255,0.1)',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  fontWeight: 'bold'
};
