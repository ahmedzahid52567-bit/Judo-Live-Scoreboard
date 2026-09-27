import React from 'react';
import { useMatchState } from '../hooks/useMatchState';
import { 
  Play, Pause, RotateCcw, Plus, Minus, Trophy, 
  Settings, Clock, History, User, Save, FastForward, Image as ImageIcon, Trash2
} from 'lucide-react';

const inputStyle = {
  background: 'rgba(0,0,0,0.3)',
  border: '1px solid var(--glass-border)',
  color: 'white',
  padding: '0.8rem',
  borderRadius: '0.5rem',
  outline: 'none',
  width: '100%',
  fontFamily: 'inherit',
  fontSize: '1rem'
};

export default function AdminScreen() {
  const { state, updateState } = useMatchState(true); // Admin mode
  const { players, time, isRunning, showWinner, winner, matchStatus, matchDuration, matchNumber, history } = state;

  const handlePlayerChange = (playerIndex, field, value) => {
    updateState(prev => {
      const newPlayers = [...prev.players];
      newPlayers[playerIndex] = { ...newPlayers[playerIndex], [field]: value };
      return { players: newPlayers };
    });
  };

  const handleImageUpload = (playerIndex, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handlePlayerChange(playerIndex, 'photo', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const adjustScore = (playerIndex, amount) => {
    updateState(prev => {
      const newPlayers = [...prev.players];
      const newScore = Math.max(0, newPlayers[playerIndex].score + amount); // prevent negative score
      newPlayers[playerIndex] = { ...newPlayers[playerIndex], score: newScore };
      return { players: newPlayers };
    });
  };

  const toggleTimer = () => {
    updateState(prev => {
      if (prev.time === 0 && prev.matchStatus !== 'OVERTIME') return prev; // Cannot start if 0 unless we reset
      const newIsRunning = !prev.isRunning;
      let newStatus = prev.matchStatus;
      
      if (newIsRunning && prev.matchStatus === 'READY') newStatus = 'LIVE';
      else if (!newIsRunning && prev.matchStatus === 'LIVE') newStatus = 'PAUSED';
      else if (newIsRunning && prev.matchStatus === 'PAUSED') newStatus = 'LIVE';
      
      return { isRunning: newIsRunning, matchStatus: newStatus };
    });
  };

  const resetTimer = () => {
    updateState({ 
      time: matchDuration, 
      isRunning: false,
      matchStatus: 'READY'
    });
  };

  const adjustTime = (amount) => {
    updateState(prev => ({ time: Math.max(0, prev.time + amount) }));
  };

  const declareWinner = (winPlayer) => {
    updateState(prev => {
      const newHistory = [...prev.history, {
        matchNumber: prev.matchNumber,
        p1Name: prev.players[0].name,
        p1College: prev.players[0].college,
        p1Score: prev.players[0].score,
        p2Name: prev.players[1].name,
        p2College: prev.players[1].college,
        p2Score: prev.players[1].score,
        winner: winPlayer ? winPlayer.name : 'DRAW',
        duration: prev.matchDuration - prev.time,
        overtime: prev.matchStatus === 'OVERTIME',
        date: new Date().toISOString()
      }];

      return {
        showWinner: true,
        winner: winPlayer,
        isRunning: false,
        matchStatus: 'FINISHED',
        history: newHistory
      };
    });
  };

  const startOvertime = () => {
    updateState({
      time: 60 * 2, // e.g., 2 mins golden score
      isRunning: false,
      matchStatus: 'OVERTIME'
    });
  };

  const nextMatch = () => {
    updateState(prev => ({
      players: [
        { ...prev.players[0], score: 0, name: 'Player 1', college: 'College A', photo: null },
        { ...prev.players[1], score: 0, name: 'Player 2', college: 'College B', photo: null }
      ],
      time: prev.matchDuration,
      isRunning: false,
      showWinner: false,
      winner: null,
      matchStatus: 'READY',
      matchNumber: prev.matchNumber + 1
    }));
  };
  
  const resetMatch = () => {
    updateState(prev => ({
      players: [
        { ...prev.players[0], score: 0 },
        { ...prev.players[1], score: 0 }
      ],
      time: prev.matchDuration,
      isRunning: false,
      showWinner: false,
      winner: null,
      matchStatus: 'READY'
    }));
  };

  const deleteHistoryEntry = (indexToDelete) => {
    if (window.confirm("Are you sure you want to delete this match from history?")) {
      updateState(prev => {
        const newHistory = prev.history.filter((_, i) => i !== indexToDelete);
        const nextMatchNumber = newHistory.length > 0 
          ? Math.max(...newHistory.map(h => h.matchNumber)) + 1 
          : 1;
          
        return {
          history: newHistory,
          matchNumber: nextMatchNumber
        };
      });
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', color: 'white' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Settings /> Admin Dashboard - Match #{matchNumber}
        </h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => window.open('/display', '_blank')} className="admin-btn" style={{ background: 'var(--accent-blue)', color: 'white' }}>
             Open Audience Display
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* PLAYER 1 SETUP */}
        <div className="glass" style={{ padding: '2rem', borderRadius: '1rem' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--accent-blue)' }}>Player 1 (Left)</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input 
              type="text" 
              placeholder="Name" 
              value={players[0].name}
              onChange={(e) => handlePlayerChange(0, 'name', e.target.value)}
              style={inputStyle}
            />
            <input 
              type="text" 
              placeholder="College" 
              value={players[0].college}
              onChange={(e) => handlePlayerChange(0, 'college', e.target.value)}
              style={inputStyle}
            />
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Player Photo</label>
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(0, e)} style={{color: 'white'}} />
            </div>
            
            <div style={{ marginTop: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
              <h3 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '1rem' }}>{players[0].score}</h3>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <button onClick={() => adjustScore(0, -1)} className="admin-btn"><Minus size={20} /> Score</button>
                <button onClick={() => adjustScore(0, 1)} className="admin-btn" style={{ background: 'var(--accent-blue)', color: 'white' }}><Plus size={20} /> Score</button>
              </div>
            </div>
            <button onClick={() => declareWinner(players[0])} className="admin-btn" style={{ marginTop: '1rem', width: '100%' }}>
              <Trophy size={16} /> Declare {players[0].name} Winner
            </button>
          </div>
        </div>

        {/* PLAYER 2 SETUP */}
        <div className="glass" style={{ padding: '2rem', borderRadius: '1rem' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--accent-red)' }}>Player 2 (Right)</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input 
              type="text" 
              placeholder="Name" 
              value={players[1].name}
              onChange={(e) => handlePlayerChange(1, 'name', e.target.value)}
              style={inputStyle}
            />
            <input 
              type="text" 
              placeholder="College" 
              value={players[1].college}
              onChange={(e) => handlePlayerChange(1, 'college', e.target.value)}
              style={inputStyle}
            />
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Player Photo</label>
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(1, e)} style={{color: 'white'}} />
            </div>

            <div style={{ marginTop: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
              <h3 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '1rem' }}>{players[1].score}</h3>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <button onClick={() => adjustScore(1, -1)} className="admin-btn"><Minus size={20} /> Score</button>
                <button onClick={() => adjustScore(1, 1)} className="admin-btn" style={{ background: 'var(--accent-red)', color: 'white' }}><Plus size={20} /> Score</button>
              </div>
            </div>
            <button onClick={() => declareWinner(players[1])} className="admin-btn" style={{ marginTop: '1rem', width: '100%' }}>
              <Trophy size={16} /> Declare {players[1].name} Winner
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* TIMER CONTROLS */}
        <div className="glass" style={{ padding: '2rem', borderRadius: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2><Clock style={{ display: 'inline', verticalAlign: 'middle' }} /> Timer ({matchStatus})</h2>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
              {formatTime(time)}
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <button 
              onClick={toggleTimer} 
              className="admin-btn" 
              style={{ background: isRunning ? '#ffaa00' : '#00cc77', color: '#111', flex: 1, minWidth: '150px' }}
            >
              {isRunning ? <><Pause size={20} /> Pause</> : <><Play size={20} /> Start/Resume</>}
            </button>
            <button onClick={resetTimer} className="admin-btn" style={{ flex: 1, minWidth: '150px' }}>
              <RotateCcw size={20} /> Reset Time
            </button>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => adjustTime(-1)} className="admin-btn" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>-1s</button>
            <button onClick={() => adjustTime(-10)} className="admin-btn" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>-10s</button>
            <button onClick={() => adjustTime(10)} className="admin-btn" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>+10s</button>
            <button onClick={() => adjustTime(1)} className="admin-btn" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>+1s</button>
          </div>
        </div>

        {/* MATCH ACTIONS */}
        <div className="glass" style={{ padding: '2rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2>Match Actions</h2>
          <button onClick={() => declareWinner(null)} className="admin-btn">
             Declare Draw
          </button>
          <button onClick={startOvertime} className="admin-btn" style={{ background: '#ffaa00', color: '#111' }}>
            Start Overtime (Golden Score)
          </button>
          <hr style={{ borderColor: 'var(--glass-border)', margin: '1rem 0' }} />
          <button onClick={resetMatch} className="admin-btn" style={{ borderColor: 'var(--accent-red)' }}>
            Reset Match
          </button>
          <button onClick={nextMatch} className="admin-btn" style={{ background: '#00cc77', color: '#111' }}>
            <FastForward size={16} /> Setup Next Match
          </button>
        </div>
      </div>

      {/* MATCH HISTORY */}
      <div className="glass" style={{ padding: '2rem', borderRadius: '1rem' }}>
        <h2 style={{ marginBottom: '1rem' }}><History style={{ display: 'inline', verticalAlign: 'middle' }} /> Match History</h2>
        {history.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No matches recorded yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <th style={{ padding: '1rem 0.5rem' }}>Match</th>
                  <th>Player 1</th>
                  <th>Score</th>
                  <th>Score</th>
                  <th>Player 2</th>
                  <th>Winner</th>
                  <th>Overtime</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '1rem 0.5rem' }}>#{h.matchNumber}</td>
                    <td>{h.p1Name} <small style={{color:'var(--text-muted)'}}>({h.p1College})</small></td>
                    <td style={{ fontWeight: 'bold' }}>{h.p1Score}</td>
                    <td style={{ fontWeight: 'bold' }}>{h.p2Score}</td>
                    <td>{h.p2Name} <small style={{color:'var(--text-muted)'}}>({h.p2College})</small></td>
                    <td style={{ color: h.winner !== 'DRAW' ? 'var(--accent-blue)' : 'white' }}>{h.winner}</td>
                    <td>{h.overtime ? 'Yes' : 'No'}</td>
                    <td>
                      <button 
                        onClick={() => deleteHistoryEntry(i)} 
                        className="admin-btn" 
                        style={{ padding: '0.4rem', background: 'transparent', borderColor: 'var(--accent-red)', minWidth: 'auto' }}
                        title="Delete Match"
                      >
                        <Trash2 size={16} color="var(--accent-red)" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
