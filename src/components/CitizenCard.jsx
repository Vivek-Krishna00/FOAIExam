import { useState, useEffect } from 'react';
import { User, RefreshCw, Mail, Map } from 'lucide-react';

export default function CitizenCard({ updateContext }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCitizen = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://randomuser.me/api/');
      const json = await res.json();
      const user = json.results[0];

      const result = {
        name: `${user.name.first} ${user.name.last}`,
        email: user.email,
        city: user.location.city,
        country: user.location.country,
        photo: user.picture.large
      };

      setData(result);
      updateContext(result);
    } catch (err) {
      setError("Failed to fetch citizen profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitizen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="dashboard-card card--citizen">
      <div className="card-header">
        <h2>Citizen ID</h2>
        <div className="icon-wrapper">
          <User size={20} />
        </div>
      </div>

      {loading && !data ? (
        <div className="data-hero" style={{ opacity: 0.5 }}>...</div>
      ) : error ? (
        <div className="data-sub" style={{ color: 'var(--accent-currency)' }}>{error}</div>
      ) : data ? (
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          
          <div style={{ position: 'relative' }}>
            <div style={{ 
              width: '100px', height: '100px', 
              borderRadius: '0', // Brutalist square
              overflow: 'hidden', 
              border: '2px solid var(--accent-citizen)',
               // Filter for a more stark, high-contrast look
              filter: 'grayscale(100%) contrast(120%)'
            }}>
              <img src={data.photo} alt={data.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            {/* Tech-y decoration */}
            <div style={{ position: 'absolute', bottom: '-8px', right: '-8px', background: 'var(--accent-citizen)', color: '#000', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', padding: '2px 4px', fontWeight: 'bold' }}>
              ACTV
            </div>
          </div>

          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px', lineHeight: 1.1 }}>
              {data.name}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              <Mail size={12} color="var(--accent-citizen)" /> 
              <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{data.email}</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <Map size={12} color="var(--accent-citizen)" /> 
              {data.city}, {data.country}
            </div>
          </div>

        </div>
      ) : null}

      <button className={`btn-refresh ${loading ? 'btn-refresh--loading' : ''}`} onClick={fetchCitizen} disabled={loading} style={{ marginTop: '32px' }}>
        <RefreshCw className="refresh-icon" /> {loading ? 'SCANNING...' : 'NEW CITIZEN'}
      </button>
    </div>
  );
}
