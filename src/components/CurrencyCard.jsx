import { useState, useEffect } from 'react';
import { ArrowRightLeft, RefreshCw, DollarSign } from 'lucide-react';

export default function CurrencyCard({ updateContext }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [inrInput, setInrInput] = useState('1000');

  const fetchRates = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      const json = await res.json();
      
      const rates = json.rates;
      const inrRate = rates.INR;
      
      // Calculate 1 INR to Target
      const INR_to_USD = 1 / inrRate;
      const INR_to_EUR = (1 / inrRate) * rates.EUR;
      const INR_to_GBP = (1 / inrRate) * rates.GBP;

      const result = {
        INR_to_USD,
        INR_to_EUR,
        INR_to_GBP,
        USD_to_INR: rates.INR,
        EUR_to_INR: rates.INR / rates.EUR,
        GBP_to_INR: rates.INR / rates.GBP,
      };

      setData(result);
      updateContext(result);
    } catch (err) {
      setError("Failed to fetch exchange rates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (!isNaN(val)) setInrInput(val);
  };

  const amount = parseFloat(inrInput) || 0;

  return (
    <div className="dashboard-card card--currency">
      <div className="card-header">
        <h2>Exchange</h2>
        <div className="icon-wrapper">
          <ArrowRightLeft size={20} />
        </div>
      </div>

      {loading && !data ? (
        <div className="data-hero" style={{ opacity: 0.5 }}>...</div>
      ) : error ? (
        <div className="data-sub" style={{ color: 'var(--accent-currency)' }}>{error}</div>
      ) : data ? (
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Rates Table */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', borderBottom: '1px solid var(--border-stark)', paddingBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>1 USD</div>
                <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-currency)' }}>₹{data.USD_to_INR.toFixed(2)}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>1 EUR</div>
                <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-currency)' }}>₹{data.EUR_to_INR.toFixed(2)}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>1 GBP</div>
                <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-currency)' }}>₹{data.GBP_to_INR.toFixed(2)}</div>
              </div>
            </div>

            {/* Quick Converter */}
            <div style={{ background: 'var(--border-stark)', padding: '16px', borderRadius: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>₹</span>
                <input 
                  type="text" 
                  value={inrInput} 
                  onChange={handleInputChange} 
                  style={{ width: '100%', fontSize: '1.25rem', padding: '4px', border: 'none', borderBottom: '2px solid var(--accent-currency)', borderRadius: 0 }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                <div>${(amount * data.INR_to_USD).toFixed(2)}</div>
                <div>€{(amount * data.INR_to_EUR).toFixed(2)}</div>
                <div>£{(amount * data.INR_to_GBP).toFixed(2)}</div>
              </div>
            </div>

          </div>
        </div>
      ) : null}

      <button className={`btn-refresh ${loading ? 'btn-refresh--loading' : ''}`} onClick={fetchRates} disabled={loading}>
        <RefreshCw className="refresh-icon" /> {loading ? 'FETCHING...' : 'REFRESH RATES'}
      </button>
    </div>
  );
}
