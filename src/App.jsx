import { useState } from 'react';
import { useLiveContext } from './hooks/useLiveContext';
import WeatherCard from './components/WeatherCard';
import CurrencyCard from './components/CurrencyCard';
import CitizenCard from './components/CitizenCard';
import FactCard from './components/FactCard';
import Chatbot from './components/Chatbot';
import './index.css';

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-chat)' }}>
          <div style={{ width: '8px', height: '8px', background: 'var(--accent-chat)', borderRadius: '50%', animation: 'pulse-glow 2s infinite' }}></div>
          SYSTEM LIVE
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
