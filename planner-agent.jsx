// AI Agent — "Ask Anchor" panel with voice input + output via Web Speech API.
// - Voice input:  webkitSpeechRecognition / SpeechRecognition
// - Voice output: speechSynthesis + SpeechSynthesisUtterance
// The voice toggle in the header enables/disables spoken replies.
// The mic button in the composer starts/stops dictation (interim + final).

const { useState: useAIState, useRef: useAIRef, useEffect: useAIEffect } = React;

// ─────────────────────────────────────────────────────────────
// Web Speech API helpers
// ─────────────────────────────────────────────────────────────
const SpeechRecognitionCtor =
  typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);

const voiceSupported = {
  recognition: !!SpeechRecognitionCtor,
  synthesis: typeof window !== 'undefined' && 'speechSynthesis' in window,
};

// Pick a preferred voice: prefer en-US Google/Samantha-style voices
function pickVoice() {
  if (!voiceSupported.synthesis) return null;
  const voices = window.speechSynthesis.getVoices() || [];
  const prefs = [
    v => /en-US/i.test(v.lang) && /samantha|google us/i.test(v.name),
    v => /en-GB/i.test(v.lang) && /google uk/i.test(v.name),
    v => /en-US/i.test(v.lang),
    v => /^en/i.test(v.lang),
  ];
  for (const p of prefs) {
    const match = voices.find(p);
    if (match) return match;
  }
  return voices[0] || null;
}

// Strip markdown-ish characters so TTS reads cleanly
function speakableText(s) {
  return (s || '')
    .replace(/[*_`#>]/g, '')
    .replace(/—/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ─────────────────────────────────────────────────────────────
// Context & suggestions (same as before)
// ─────────────────────────────────────────────────────────────
function buildAgentContext(tasks) {
  const today = "Saturday, April 18, 2026";
  const openTasks = (tasks || [])
    .filter(t => !t.done)
    .slice(0, 12)
    .map(t => `- [${['low','med','high'][t.priority] || 'med'}] ${t.text}${t.project ? ' ('+t.project+')' : ''}`)
    .join('\n');

  return `
You are "Anchor", an AI assistant embedded in the user's life planner. Answer
briefly, warmly, and concretely. Prefer specifics from the context below over
generic advice. Use short paragraphs or tight bullet lists. Never invent data
the user doesn't have. If asked something you can't answer from context, say so.
Your replies may be spoken aloud — prefer natural sentences over lists when the
user seems to be speaking. Avoid markdown symbols.

TODAY: ${today}

OPEN TASKS:
${openTasks || '(none)'}

SCHEDULE TODAY:
- 09:00 Writing block — Chen proposal
- 10:30 Coffee with Dev
- 13:00 Quiet lunch
- 15:00 Design review — studio site
- 18:30 Run (easy 5k)

UPCOMING DEADLINES:
- Apr 21 — Dentist appointment, 15:00
- Apr 22 — Dad's birthday (call him)
- Apr 24 — Chen proposal due
- Apr 27 — Studio retreat begins

HABITS (streaks):
- Morning pages: 23 days
- Read: 41 days
- Meditate: 12 days
- Move 30 min: 5 days
- No phone before 9: 8 days

HEALTH (7-day avg):
- Sleep 7.3h, steps 4,577/day, mood 7.0/10, 3 of 4 workouts this week

FINANCES (April):
- Income $5,400, spent $2,840 of $3,600 budget, saved $1,290
- Outstanding: Aperture invoice $4,200 due Apr 22
- Business MRR $8,400 (up 5.6% vs March)

READING:
- Currently: "Four Thousand Weeks" (58%), "The Creative Act" (22%)
- 2026 goal: 9 of 24 books

PEOPLE (overdue):
- Marguerite (2 weeks), Priya (3 weeks), Jules (5 weeks)

Keep answers under 120 words unless the user asks for depth.
`.trim();
}

const AGENT_SUGGESTIONS = [
  "What should I focus on today?",
  "Am I on track for the Chen proposal?",
  "Who haven't I reached out to in a while?",
  "How's my sleep trending?",
  "Where am I over budget this month?",
  "Plan my weekend",
];

// ─────────────────────────────────────────────────────────────
// Floating open button
// ─────────────────────────────────────────────────────────────
function AIAgentButton({ t, onOpen }) {
  const { pal, type } = t;
  return (
    <button onClick={onOpen} title="Ask Anchor" style={{
      position: 'absolute', right: 20, bottom: 20, zIndex: 40,
      width: 52, height: 52, borderRadius: '50%',
      border: `1px solid ${pal.ink}`,
      background: pal.ink, color: pal.paper,
      cursor: 'pointer', padding: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 10px 24px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.1)',
      fontFamily: type.display, fontStyle: 'italic', fontSize: 22,
    }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 3 L13.6 10.4 L21 12 L13.6 13.6 L12 21 L10.4 13.6 L3 12 L10.4 10.4 Z"
              fill="currentColor" />
      </svg>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Main panel
// ─────────────────────────────────────────────────────────────
function AIAgentPanel({ t, tasks, onClose, compact }) {
  const { pal, type, theme } = t;
  const [messages, setMessages] = useAIState([
    { role: 'assistant', content: "Morning. I've got your plans in front of me — ask me anything about today, your projects, how you're tracking, or what to do next." }
  ]);
  const [input, setInput] = useAIState('');
  const [interim, setInterim] = useAIState('');
  const [busy, setBusy] = useAIState(false);
  const [listening, setListening] = useAIState(false);
  const [speaking, setSpeaking] = useAIState(false);
  const [voiceOn, setVoiceOn] = useAIState(voiceSupported.synthesis); // TTS toggle
  const [voiceError, setVoiceError] = useAIState(null);

  const recognitionRef = useAIRef(null);
  const scrollRef = useAIRef(null);
  const voiceRef = useAIRef(null); // cached SpeechSynthesisVoice
  const finalTranscriptRef = useAIRef('');

  // Scroll on new messages
  useAIEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, busy, interim]);

  // ESC closes
  useAIEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  // Pre-warm voices list (Chrome populates async)
  useAIEffect(() => {
    if (!voiceSupported.synthesis) return;
    const update = () => { voiceRef.current = pickVoice(); };
    update();
    window.speechSynthesis.onvoiceschanged = update;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      try { window.speechSynthesis.cancel(); } catch (e) {}
    };
  }, []);

  // Stop any speech when panel closes
  useAIEffect(() => () => {
    try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch(e) {}
    try { recognitionRef.current && recognitionRef.current.stop(); } catch(e) {}
  }, []);

  // ─── Speech synthesis (TTS)
  const speak = (text) => {
    if (!voiceSupported.synthesis || !voiceOn) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(speakableText(text));
      const v = voiceRef.current || pickVoice();
      if (v) { u.voice = v; u.lang = v.lang; }
      u.rate = 1.02;
      u.pitch = 1.0;
      u.onstart = () => setSpeaking(true);
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(u);
    } catch (e) {
      setSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    try { window.speechSynthesis.cancel(); } catch (e) {}
    setSpeaking(false);
  };

  // ─── Speech recognition (STT)
  const startListening = () => {
    if (!voiceSupported.recognition) {
      setVoiceError("Voice input isn't supported in this browser. Try Chrome or Safari.");
      return;
    }
    setVoiceError(null);
    stopSpeaking();
    try {
      const rec = new SpeechRecognitionCtor();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = 'en-US';
      finalTranscriptRef.current = '';

      rec.onstart = () => { setListening(true); setInterim(''); };
      rec.onresult = (e) => {
        let finalText = '';
        let interimText = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const r = e.results[i];
          if (r.isFinal) finalText += r[0].transcript;
          else interimText += r[0].transcript;
        }
        if (finalText) finalTranscriptRef.current += finalText;
        setInterim(interimText);
        if (finalText) {
          setInput(prev => (prev ? prev + ' ' : '') + finalText.trim());
        }
      };
      rec.onerror = (e) => {
        if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
          setVoiceError('Microphone access was denied.');
        } else if (e.error === 'no-speech') {
          setVoiceError("Didn't catch that — try again.");
        } else if (e.error !== 'aborted') {
          setVoiceError('Voice input error: ' + e.error);
        }
      };
      rec.onend = () => {
        setListening(false);
        setInterim('');
        // Auto-send if we got a final transcript
        const finalText = finalTranscriptRef.current.trim();
        if (finalText) {
          // Small delay so the user sees what we captured, then send
          setTimeout(() => send(finalText), 150);
        }
      };

      rec.start();
      recognitionRef.current = rec;
    } catch (err) {
      setListening(false);
      setVoiceError('Could not start voice input.');
    }
  };

  const stopListening = () => {
    try { recognitionRef.current && recognitionRef.current.stop(); } catch(e) {}
    setListening(false);
  };

  const toggleListening = () => (listening ? stopListening() : startListening());

  // ─── Send message
  const send = async (text) => {
    const q = (text ?? input).trim();
    if (!q || busy) return;
    setInput('');
    setInterim('');
    finalTranscriptRef.current = '';
    const next = [...messages, { role: 'user', content: q }];
    setMessages(next);
    setBusy(true);
    stopSpeaking();

    try {
      const system = buildAgentContext(tasks);
      const history = next.map(m => `${m.role === 'user' ? 'User' : 'Anchor'}: ${m.content}`).join('\n\n');
      const prompt = `${system}\n\nConversation so far:\n${history}\n\nAnchor:`;
      let reply = '';
      if (window.claude && typeof window.claude.complete === 'function') {
        reply = await window.claude.complete(prompt);
      } else {
        reply = "Based on what I see, I'd start with the Chen proposal diagnostic this morning, then take the Dev coffee, then handle the design review.";
      }
      const finalReply = (reply || '').trim() || 'Hm — no response. Try rephrasing?';
      setMessages(m => [...m, { role: 'assistant', content: finalReply }]);
      if (voiceOn) speak(finalReply);
    } catch (err) {
      const msg = 'Something went sideways reaching the model. Try again in a moment.';
      setMessages(m => [...m, { role: 'assistant', content: msg }]);
      if (voiceOn) speak(msg);
    } finally {
      setBusy(false);
    }
  };

  const w = compact ? '100%' : 420;

  const IconBtn = ({ on, onClick, title, children, pulse, danger }) => (
    <button onClick={onClick} title={title} style={{
      border: `1px solid ${on ? pal.ink : pal.rule}`,
      background: on ? pal.ink : pal.card,
      color: on ? pal.paper : pal.ink2,
      cursor: 'pointer', padding: 0,
      width: 30, height: 30, borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, position: 'relative',
    }}>
      {children}
      {pulse && (
        <span style={{
          position: 'absolute', inset: -3, borderRadius: '50%',
          border: `2px solid ${danger ? '#B45B47' : theme.accent}`,
          animation: 'anchor-ring 1.3s infinite ease-out',
          pointerEvents: 'none',
        }} />
      )}
    </button>
  );

  return (
    <div style={{
      position: 'absolute', right: compact ? 0 : 14, bottom: compact ? 0 : 14,
      top: compact ? 0 : 'auto', left: compact ? 0 : 'auto',
      width: w, height: compact ? '100%' : 580, zIndex: 60,
      background: pal.paper, color: pal.ink,
      border: `1px solid ${pal.rule}`,
      borderRadius: compact ? 0 : 6,
      boxShadow: compact ? 'none' : '0 20px 60px rgba(0,0,0,0.22), 0 4px 12px rgba(0,0,0,0.08)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <style>{`
        @keyframes anchor-pulse { 0%,80%,100% { opacity: 0.2 } 40% { opacity: 1 } }
        @keyframes anchor-ring { 0% { transform: scale(1); opacity: 0.8 } 100% { transform: scale(1.6); opacity: 0 } }
        @keyframes anchor-wave { 0%,100% { height: 6px } 50% { height: 22px } }
      `}</style>

      {/* Header */}
      <div style={{
        padding: '14px 18px', borderBottom: `1px solid ${pal.rule}`,
        display: 'flex', alignItems: 'center', gap: 10,
        background: pal.paperAlt,
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: '50%',
          background: pal.ink, color: pal.paper,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 3 L13.6 10.4 L21 12 L13.6 13.6 L12 21 L10.4 13.6 L3 12 L10.4 10.4 Z" fill="currentColor" />
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: type.display, fontStyle: 'italic', fontSize: 17,
            color: pal.ink, letterSpacing: -0.2, lineHeight: 1,
          }}>Ask Anchor</div>
          <div style={{
            fontFamily: type.mono, fontSize: 9.5, color: pal.ink3,
            letterSpacing: 0.4, textTransform: 'uppercase', marginTop: 4,
          }}>
            {listening ? 'listening…' : speaking ? 'speaking…' : 'your planner, out loud'}
          </div>
        </div>

        {/* Voice output toggle */}
        <IconBtn
          on={voiceOn}
          onClick={() => {
            if (voiceOn) stopSpeaking();
            setVoiceOn(v => !v);
          }}
          title={voiceSupported.synthesis ? (voiceOn ? 'Voice replies on' : 'Voice replies off') : 'Voice output not supported'}
        >
          {voiceOn ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5 L6 9 H3 v6 h3 l5 4 Z" fill="currentColor"/>
              <path d="M15.5 8.5 a5 5 0 0 1 0 7"/>
              <path d="M18.5 6 a9 9 0 0 1 0 12"/>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5 L6 9 H3 v6 h3 l5 4 Z" fill="currentColor"/>
              <path d="M16 9 L21 14 M21 9 L16 14"/>
            </svg>
          )}
        </IconBtn>

        {/* Close */}
        <button onClick={onClose} title="Close (Esc)" style={{
          border: `1px solid ${pal.rule}`, background: pal.card, color: pal.ink2,
          cursor: 'pointer', padding: 0,
          width: 30, height: 30, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M6 6 L18 18 M18 6 L6 18"/>
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{
        flex: 1, overflow: 'auto', padding: '18px 18px 6px',
        display: 'flex', flexDirection: 'column', gap: 14,
      }}>
        {messages.map((m, i) => {
          const isAssistant = m.role === 'assistant';
          const isLast = i === messages.length - 1;
          return (
            <div key={i} style={{
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '86%',
              padding: m.role === 'user' ? '9px 13px' : '0',
              background: m.role === 'user' ? pal.ink : 'transparent',
              color: m.role === 'user' ? pal.paper : pal.ink,
              borderRadius: m.role === 'user' ? 14 : 0,
              fontFamily: type.body, fontSize: 13.5, lineHeight: 1.55,
            }}>
              {isAssistant && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5,
                }}>
                  <div style={{
                    fontFamily: type.mono, fontSize: 9, color: pal.ink4,
                    letterSpacing: 0.5, textTransform: 'uppercase',
                  }}>Anchor</div>
                  {voiceSupported.synthesis && (
                    <button
                      onClick={() => (isLast && speaking ? stopSpeaking() : speak(m.content))}
                      title={speaking && isLast ? 'Stop' : 'Read aloud'}
                      style={{
                        border: 'none', background: 'transparent', cursor: 'pointer',
                        padding: 2, color: (speaking && isLast) ? theme.accent : pal.ink4,
                        display: 'flex', alignItems: 'center',
                      }}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 5 L6 9 H3 v6 h3 l5 4 Z" fill="currentColor"/>
                        <path d="M15.5 8.5 a5 5 0 0 1 0 7"/>
                      </svg>
                    </button>
                  )}
                </div>
              )}
              <div style={{ whiteSpace: 'pre-wrap' }}>{m.content}</div>
            </div>
          );
        })}

        {/* Live interim transcript while listening */}
        {listening && (interim || finalTranscriptRef.current) && (
          <div style={{
            alignSelf: 'flex-end', maxWidth: '86%',
            padding: '9px 13px',
            background: 'transparent', color: pal.ink3,
            border: `1px dashed ${pal.rule}`,
            borderRadius: 14,
            fontFamily: type.body, fontSize: 13.5, lineHeight: 1.55,
            fontStyle: 'italic',
          }}>
            {finalTranscriptRef.current}{interim ? ' ' + interim : ''}
          </div>
        )}

        {busy && (
          <div style={{ alignSelf: 'flex-start', display: 'flex', gap: 5, padding: '4px 0' }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: '50%', background: pal.ink3,
                animation: `anchor-pulse 1.2s ${i * 0.18}s infinite ease-in-out`,
              }} />
            ))}
          </div>
        )}
      </div>

      {/* Voice error banner */}
      {voiceError && (
        <div style={{
          padding: '8px 14px', background: '#F6E4DE', color: '#8A3A28',
          fontFamily: type.body, fontSize: 11.5,
          borderTop: `1px solid ${pal.rule}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8,
        }}>
          <span>{voiceError}</span>
          <button onClick={() => setVoiceError(null)} style={{
            border: 'none', background: 'transparent', color: '#8A3A28',
            cursor: 'pointer', padding: 0, fontSize: 16, lineHeight: 1,
          }}>×</button>
        </div>
      )}

      {/* Suggestions — only on first turn */}
      {messages.length === 1 && !busy && !listening && (
        <div style={{
          padding: '4px 18px 12px',
          display: 'flex', flexWrap: 'wrap', gap: 6,
        }}>
          {AGENT_SUGGESTIONS.map((s, i) => (
            <button key={i} onClick={() => send(s)} style={{
              border: `1px solid ${pal.rule}`, background: pal.card,
              color: pal.ink2, padding: '6px 10px',
              fontFamily: type.body, fontSize: 11.5, cursor: 'pointer',
              borderRadius: 14, lineHeight: 1.2,
            }}>{s}</button>
          ))}
        </div>
      )}

      {/* Composer */}
      <div style={{
        padding: 14, borderTop: `1px solid ${pal.rule}`,
        background: pal.paperAlt,
        display: 'flex', gap: 8, alignItems: 'flex-end',
      }}>
        {/* Mic button */}
        <button
          onClick={toggleListening}
          disabled={busy || !voiceSupported.recognition}
          title={!voiceSupported.recognition ? 'Voice input not supported' : listening ? 'Stop (tap)' : 'Hold a thought — tap to dictate'}
          style={{
            position: 'relative', flexShrink: 0,
            width: 38, height: 38, borderRadius: '50%',
            border: `1px solid ${listening ? '#B45B47' : pal.rule}`,
            background: listening ? '#B45B47' : pal.card,
            color: listening ? '#fff' : (voiceSupported.recognition ? pal.ink : pal.ink4),
            cursor: voiceSupported.recognition && !busy ? 'pointer' : 'default',
            padding: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="3" width="6" height="12" rx="3" fill={listening ? 'currentColor' : 'none'}/>
            <path d="M5 11 a7 7 0 0 0 14 0"/>
            <path d="M12 18 v3"/>
          </svg>
          {listening && (
            <span style={{
              position: 'absolute', inset: -4, borderRadius: '50%',
              border: `2px solid #B45B47`,
              animation: 'anchor-ring 1.3s infinite ease-out',
              pointerEvents: 'none',
            }} />
          )}
        </button>

        <textarea
          value={listening ? (finalTranscriptRef.current + (interim ? ' ' + interim : '')) || input : input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
          }}
          placeholder={listening ? 'Listening…' : 'Ask — or tap the mic to speak'}
          rows={1}
          readOnly={listening}
          style={{
            flex: 1, resize: 'none',
            border: `1px solid ${listening ? theme.accent : pal.rule}`,
            background: pal.card, color: pal.ink,
            padding: '10px 12px', fontFamily: type.body, fontSize: 13,
            outline: 'none', borderRadius: 6, maxHeight: 120, minHeight: 38,
            lineHeight: 1.4,
            fontStyle: listening ? 'italic' : 'normal',
          }}
        />
        <button onClick={() => send()} disabled={busy || !input.trim() || listening} style={{
          border: 'none',
          background: input.trim() && !busy && !listening ? pal.ink : pal.ink4,
          color: pal.paper, padding: '10px 14px',
          cursor: input.trim() && !busy && !listening ? 'pointer' : 'default',
          fontFamily: type.body, fontSize: 12, borderRadius: 6,
          display: 'flex', alignItems: 'center', gap: 6, height: 38,
        }}>
          <span>Ask</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { AIAgentButton, AIAgentPanel, buildAgentContext });
