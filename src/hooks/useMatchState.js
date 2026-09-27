import { useState, useEffect, useCallback, useRef } from 'react';

const DEFAULT_TIME = 4 * 60; // 4 minutes

const initialState = {
  players: [
    {
      id: 'p1',
      name: 'Player 1',
      college: 'College A',
      score: 0,
      photo: null
    },
    {
      id: 'p2',
      name: 'Player 2',
      college: 'College B',
      score: 0,
      photo: null
    }
  ],
  time: DEFAULT_TIME,
  isRunning: false,
  showWinner: false,
  winner: null,
  matchStatus: 'READY', // READY, LIVE, PAUSED, OVERTIME, FINISHED
  matchDuration: DEFAULT_TIME,
  matchNumber: 1,
  history: []
};

// We create a singleton channel so we don't recreate it on every render
const channel = new BroadcastChannel('judo_match_sync');

export function useMatchState(isAdmin = false) {
  const [state, setState] = useState(initialState);
  
  // Ref to hold the latest state to avoid dependency issues in callbacks
  const stateRef = useRef(state);
  
  // Update stateRef whenever state changes
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Load history from local storage initially
  useEffect(() => {
    if (isAdmin) {
      try {
        const storedHistory = localStorage.getItem('judoMatchHistory');
        if (storedHistory && storedHistory !== 'undefined' && storedHistory !== 'null') {
          const parsed = JSON.parse(storedHistory);
          if (Array.isArray(parsed)) {
            setState(prev => {
              const nextMatchNumber = parsed.length > 0 
                ? Math.max(...parsed.map(h => h.matchNumber)) + 1 
                : 1;
              return { ...prev, history: parsed, matchNumber: nextMatchNumber };
            });
          } else {
            localStorage.removeItem('judoMatchHistory');
          }
        }
      } catch (e) {
        console.error("Failed to load history", e);
        localStorage.removeItem('judoMatchHistory');
      }
    }
  }, [isAdmin]);

  // Handle messages from channel
  useEffect(() => {
    const handleMessage = (event) => {
      const { type, payload } = event.data;
      
      if (isAdmin) {
        // Admin responds to requests for full state (e.g. when display connects)
        if (type === 'REQUEST_STATE') {
          channel.postMessage({ type: 'SYNC_STATE', payload: stateRef.current });
        }
      } else {
        // Display listens for state updates
        if (type === 'SYNC_STATE' || type === 'STATE_UPDATE') {
          setState(payload);
        }
      }
    };
    
    channel.addEventListener('message', handleMessage);
    
    // If we are display, ask for the state initially
    if (!isAdmin) {
      channel.postMessage({ type: 'REQUEST_STATE' });
    }
    
    return () => {
      channel.removeEventListener('message', handleMessage);
    };
  }, [isAdmin]);

  // Admin-only state updater that also broadcasts
  const updateState = useCallback((updater) => {
    if (!isAdmin) return;
    
    setState(prev => {
      const partialState = typeof updater === 'function' ? updater(prev) : updater;
      const nextState = { ...prev, ...partialState };
      
      // Save history to local storage if it changed
      if (nextState.history !== prev.history) {
        localStorage.setItem('judoMatchHistory', JSON.stringify(nextState.history));
      }
      
      channel.postMessage({ type: 'STATE_UPDATE', payload: nextState });
      return nextState;
    });
  }, [isAdmin]);

  // Timer logic (only runs on admin)
  useEffect(() => {
    if (!isAdmin) return;
    
    let interval;
    if (state.isRunning && state.time > 0) {
      interval = setInterval(() => {
        updateState(prev => {
          const nextTime = prev.time - 1;
          if (nextTime <= 0) {
            return {
              ...prev,
              time: 0,
              isRunning: false,
              matchStatus: prev.matchStatus === 'OVERTIME' ? 'FINISHED' : 'FINISHED'
            };
          }
          return { ...prev, time: nextTime };
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAdmin, state.isRunning, state.time, updateState]);

  return {
    state,
    updateState,
    isAdmin
  };
}
