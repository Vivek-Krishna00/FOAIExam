import { useState, useEffect } from 'react';
import { BookOpen, RefreshCw } from 'lucide-react';

export default function FactCard({ updateContext }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFact = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random?language=en');
      const json = await res.json();
      
      const result = {
        text: json.text
      };

      setData(result);
      updateContext(result);
    } catch (err) {
      setError("Failed to fetch city fact.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFact();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="dashboard-card card--fact">
      <div className="card-header">
        <h2>City Fact of the Day</h2>
        <div className="icon-wrapper">
          <BookOpen size={20} />
        </div>
      </div>

      {loading && !data ? (
        <div className="data-hero" style={{ opacity: 0.5 }}>...</div>
      ) : error ? (
        <div className="data-sub" style={{ color: 'var(--accent-currency)' }}>{error}</div>
      ) : data ? (
        <div style={{ 
          fontFamily: 'var(--font-heading)', 
          fontSize: '1.4rem', 
          lineHeight: 1.4, 
          color: 'var(--text-primary)',
          position: 'relative',
          paddingLeft: '24px'
        }}>
          {/* Brutalist quote bar */}
          <div style={{ position: 'absolute', left: 0, top: '4px', bottom: '4px', width: '4px', background: 'var(--accent-fact)' }} />
          "{data.text}"
        </div>
      ) : null}

      <button className={`btn-refresh ${loading ? 'btn-refresh--loading' : ''}`} onClick={fetchFact} disabled={loading} style={{ marginTop: '32px' }}>
        <RefreshCw className="refresh-icon" /> {loading ? 'UPDATING...' : 'NEW FACT'}
      </button>
    </div>
  );
}
