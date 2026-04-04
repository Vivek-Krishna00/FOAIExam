import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Trash2 } from 'lucide-react';
import { useLiveContext } from '../hooks/useLiveContext';

export default function Chatbot({ isOpen, setIsOpen, buildSystemPrompt }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'SYSTEM ONLINE. How can I assist you with CivicPulse metrics today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_HUGGINGFACE_KEY;
      if (!apiKey) {
        throw new Error("Missing VITE_HUGGINGFACE_KEY in environment.");
      }

      const systemPrompt = buildSystemPrompt();

      // Using Hugging Face Router v1 API with OpenAI-compatible schema
      const messagesPayload = [
        { role: 'system', content: buildSystemPrompt() },
        ...messages.slice(-4),
        userMessage
      ];

      const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          model: "meta-llama/Llama-3.1-8B-Instruct",
          messages: messagesPayload,
          max_tokens: 250,
          temperature: 0.3
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const result = await response.json();
      let botContent = result.choices?.[0]?.message?.content || "Error generating response.";

      setMessages(prev => [...prev, { role: 'assistant', content: botContent }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: `[ERROR]: ${error.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const clearChat = () => {
    setMessages([
      { role: 'assistant', content: 'SYSTEM ONLINE. How can I assist you with CivicPulse metrics today?' }
    ]);
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          width: '64px',
          height: '64px',
          borderRadius: '0', // Brutalist box
          background: 'var(--text-primary)',
          color: 'var(--bg-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '8px 8px 0px var(--accent-chat)',
          zIndex: 50,
          transition: 'transform var(--transition-fast)'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translate(-2px, -2px)'; e.currentTarget.style.boxShadow = '10px 10px 0px var(--accent-chat)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translate(0, 0)'; e.currentTarget.style.boxShadow = '8px 8px 0px var(--accent-chat)'; }}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '120px',
          right: '32px',
          width: '380px',
          height: '500px',
          background: 'var(--bg-card)',
          border: '2px solid var(--border-stark)',
          borderTop: '6px solid var(--accent-chat)',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '12px 12px 0px rgba(0,0,0,0.5)',
          animation: 'fadeInUp 0.3s ease-out'
        }}>
          
          {/* Chat Header */}
          <div style={{
            padding: '16px',
            borderBottom: '2px solid var(--border-stark)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--bg-card-hover)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', background: 'var(--accent-chat)', borderRadius: '50%', animation: 'pulse-glow 2s infinite' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-primary)' }}>SYS_ASSISTANT</span>
            </div>
            <button onClick={clearChat} style={{ color: 'var(--text-secondary)' }} title="Clear Chat">
              <Trash2 size={16} />
            </button>
          </div>

          {/* Messages Area */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%'
              }}>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '4px',
                  textAlign: msg.role === 'user' ? 'right' : 'left'
                }}>
                  {msg.role === 'user' ? 'USER' : 'AI'}
                </div>
                <div style={{
                  background: msg.role === 'user' ? 'var(--text-primary)' : 'transparent',
                  color: msg.role === 'user' ? 'var(--bg-primary)' : 'var(--text-primary)',
                  border: msg.role === 'user' ? 'none' : '1px solid var(--border-stark)',
                  padding: '12px',
                  fontSize: '0.9rem',
                  borderRadius: msg.role === 'user' ? '0' : '0 12px 12px 12px',
                  borderTopLeftRadius: msg.role === 'user' ? '12px' : '0',
                  borderBottomLeftRadius: msg.role === 'user' ? '12px' : '0',
                  borderBottomRightRadius: msg.role === 'user' ? '0' : '12px',
                  borderTopRightRadius: msg.role === 'user' ? '0' : '12px'
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            
            {loading && (
              <div style={{ alignSelf: 'flex-start' }}>
                 <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>AI</div>
                 <div style={{ padding: '12px', border: '1px solid var(--border-stark)', display: 'flex', gap: '4px' }}>
                   <div style={{ width: '6px', height: '6px', background: 'var(--text-secondary)', borderRadius: '50%', animation: 'dotBounce 1.4s infinite ease-in-out both' }} />
                   <div style={{ width: '6px', height: '6px', background: 'var(--text-secondary)', borderRadius: '50%', animation: 'dotBounce 1.4s infinite ease-in-out both', animationDelay: '0.2s' }} />
                   <div style={{ width: '6px', height: '6px', background: 'var(--text-secondary)', borderRadius: '50%', animation: 'dotBounce 1.4s infinite ease-in-out both', animationDelay: '0.4s' }} />
                 </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div style={{
            padding: '16px',
            borderTop: '2px solid var(--border-stark)',
            display: 'flex',
            gap: '8px'
          }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Query metrics..."
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px',
                border: '1px solid var(--border-stark)',
                background: 'transparent',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)'
              }}
            />
            <button 
              onClick={handleSend}
              disabled={loading || !input.trim()}
              style={{
                background: 'var(--accent-chat)',
                color: '#000',
                padding: '0 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: (loading || !input.trim()) ? 0.5 : 1
              }}
            >
              <Send size={18} />
            </button>
          </div>

        </div>
      )}
    </>
  );
}
