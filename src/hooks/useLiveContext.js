import { useState, useCallback } from 'react';

/**
 * Global live context hook — stores latest fetched data from all cards
 * so the chatbot always has access to current dashboard state.
 */
export function useLiveContext() {
  const [liveContext, setLiveContext] = useState({
    weather: null,
    currency: null,
    citizen: null,
    fact: null,
  });

  const updateWeather = useCallback((data) => {
    setLiveContext((prev) => ({ ...prev, weather: data }));
  }, []);

  const updateCurrency = useCallback((data) => {
    setLiveContext((prev) => ({ ...prev, currency: data }));
  }, []);

  const updateCitizen = useCallback((data) => {
    setLiveContext((prev) => ({ ...prev, citizen: data }));
  }, []);

  const updateFact = useCallback((data) => {
    setLiveContext((prev) => ({ ...prev, fact: data }));
  }, []);

  /**
   * Build the system prompt for the chatbot from latest context.
   */
  const buildSystemPrompt = useCallback(() => {
    const w = liveContext.weather;
    const c = liveContext.currency;
    const p = liveContext.citizen;
    const f = liveContext.fact;

    return `You are a helpful SmartCity assistant for the CivicPulse dashboard.
Answer ONLY based on this live dashboard data:

WEATHER: Temperature is ${w ? w.temperature + '°C' : 'loading...'}, Wind speed is ${w ? w.windspeed + ' km/h' : 'loading...'}, Condition: ${w ? w.condition : 'loading...'}, Location: ${w ? w.city : 'loading...'}

CURRENCY: 1 INR = ${c ? c.INR_to_USD.toFixed(6) : '...'} USD, 1 INR = ${c ? c.INR_to_EUR.toFixed(6) : '...'} EUR, 1 INR = ${c ? c.INR_to_GBP.toFixed(6) : '...'} GBP
Also: 1 USD = ${c ? c.USD_to_INR.toFixed(2) : '...'} INR, 1 EUR = ${c ? c.EUR_to_INR.toFixed(2) : '...'} INR, 1 GBP = ${c ? c.GBP_to_INR.toFixed(2) : '...'} INR

CITIZEN ON SCREEN: ${p ? `${p.name}, from ${p.city}, ${p.country}, email: ${p.email}` : 'loading...'}

CITY FACT: ${f ? f.text : 'loading...'}

For math questions (like "how much is 500 rupees in dollars?"), calculate using the above rates.
If the question is outside this data, politely say you only know about what's shown on the dashboard.
Be concise and helpful. Use emojis sparingly for a friendly tone.`;
  }, [liveContext]);

  return {
    liveContext,
    updateWeather,
    updateCurrency,
    updateCitizen,
    updateFact,
    buildSystemPrompt,
  };
}
