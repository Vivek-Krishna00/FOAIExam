import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useLiveContext } from './hooks/useLiveContext';
import WeatherCard from './components/WeatherCard';
import CurrencyCard from './components/CurrencyCard';
import CitizenCard from './components/CitizenCard';
import FactCard from './components/FactCard';
import Chatbot from './components/Chatbot';
import './index.css';

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(() => {
    // Check local storage on mount
    return localStorage.getItem('theme') === 'light';
  });

  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    }
  }, [isLightMode]);

  const { 
    updateWeather, 
    updateCurrency, 
    updateCitizen, 
    updateFact,
    buildSystemPrompt
  } = useLiveContext();

  return (
    <div className={`app-container ${isChatOpen ? 'chat-open' : ''}`}>
      <header className="app-header">
        <div>
          <h1>CIVIC_PULSE</h1>
          <p>Real-time telemetry and citizen metrics dashboard</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          
          {/* Theme Toggle */}
          <button 
            onClick={() => setIsLightMode(!isLightMode)}
            style={{
              padding: '8px',
              border: '1px solid var(--border-stark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              transition: 'background var(--transition-fast)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--text-muted)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            title="Toggle Theme"
          >
            {isLightMode ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* System Live Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-chat)' }}>
            <div style={{ width: '8px', height: '8px', background: 'var(--accent-chat)', borderRadius: '50%', animation: 'pulse-glow 2s infinite' }}></div>
            SYSTEM LIVE
          </div>
        </div>
      </header>

      <main className="dashboard-grid">
        <WeatherCard updateContext={updateWeather} />
        <CurrencyCard updateContext={updateCurrency} />
        <CitizenCard updateContext={updateCitizen} />
        <FactCard updateContext={updateFact} />
      </main>

      {/* Global context automatically consumed and used by Chatbot inside */}
      <Chatbot isOpen={isChatOpen} setIsOpen={setIsChatOpen} buildSystemPrompt={buildSystemPrompt} />
    </div>
  );
}

export default App;
