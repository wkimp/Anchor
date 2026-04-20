// Settings page — with "Clear demo data" option.
// When demo data is cleared, all pages fall back to empty states.

const { useState: useSetState } = React;

function SettingsPage({ t, compact, demoMode, onClearDemo, onRestoreDemo }) {
  const { pal, type, theme } = t;
  const [confirming, setConfirming] = useSetState(false);
  const [cleared, setCleared] = useSetState(false);

  const doClear = () => {
    onClearDemo();
    setConfirming(false);
    setCleared(true);
    setTimeout(() => setCleared(false), 2200);
  };

  const Row = ({ label, sub, action }) => (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 18px', gap: 18,
      borderBottom: `1px dashed ${pal.rule}`,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: type.body, fontSize: 14, color: pal.ink, fontWeight: 500 }}>{label}</div>
        {sub && <div style={{ fontFamily: type.body, fontSize: 12.5, color: pal.ink3, marginTop: 4, lineHeight: 1.5 }}>{sub}</div>}
      </div>
      {action}
    </div>
  );

  return (
    <PageShell t={t} title="Settings" subtitle="make it yours" compact={compact}>
      <SectionTitle t={t}>Your data</SectionTitle>
      <div style={{ border: `1px solid ${pal.rule}`, background: pal.card }}>
        <Row
          label={demoMode ? "Demo data" : "Demo data — cleared"}
          sub={demoMode
            ? "Anchor is pre-filled with realistic sample data — tasks, habits, finances, people, projects. Clear it to start with a blank planner."
            : "Your planner is empty. You can bring the sample data back to explore how Anchor works."
          }
          action={
            demoMode ? (
              confirming ? (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setConfirming(false)} style={{
                    border: `1px solid ${pal.rule}`, background: pal.card, color: pal.ink2,
                    padding: '8px 14px', cursor: 'pointer',
                    fontFamily: type.body, fontSize: 12,
                  }}>Cancel</button>
                  <button onClick={doClear} style={{
                    border: `1px solid #B45B47`, background: '#B45B47', color: '#fff',
                    padding: '8px 14px', cursor: 'pointer',
                    fontFamily: type.body, fontSize: 12,
                  }}>Yes, clear it</button>
                </div>
              ) : (
                <button onClick={() => setConfirming(true)} style={{
                  border: `1px solid ${pal.ink}`, background: 'transparent', color: pal.ink,
                  padding: '8px 14px', cursor: 'pointer',
                  fontFamily: type.body, fontSize: 12,
                }}>Clear demo data</button>
              )
            ) : (
              <button onClick={onRestoreDemo} style={{
                border: `1px solid ${pal.ink}`, background: pal.ink, color: pal.paper,
                padding: '8px 14px', cursor: 'pointer',
                fontFamily: type.body, fontSize: 12,
              }}>Restore demo</button>
            )
          }
        />
        <Row
          label="Export your planner"
          sub="Download a JSON snapshot of everything — tasks, notes, habits, finances."
          action={
            <button style={{
              border: `1px solid ${pal.rule}`, background: pal.card, color: pal.ink,
              padding: '8px 14px', cursor: 'pointer',
              fontFamily: type.body, fontSize: 12,
            }}>Export .json</button>
          }
        />
        <Row
          label="Import"
          sub="Restore from a previous export, or from another planner tool."
          action={
            <button style={{
              border: `1px solid ${pal.rule}`, background: pal.card, color: pal.ink,
              padding: '8px 14px', cursor: 'pointer',
              fontFamily: type.body, fontSize: 12,
            }}>Choose file…</button>
          }
        />
      </div>

      <SectionTitle t={t}>Appearance</SectionTitle>
      <div style={{
        padding: 18, border: `1px solid ${pal.rule}`, background: pal.card,
        fontFamily: type.body, fontSize: 13, color: pal.ink3, lineHeight: 1.6,
      }}>
        Open <span style={{
          fontFamily: type.mono, fontSize: 11, color: pal.ink2,
          background: pal.paperAlt, padding: '2px 6px', borderRadius: 2,
        }}>Tweaks</span> in the toolbar to change color theme, typography, light/dark mode, layout density, and which widgets appear on your home screen.
      </div>

      <SectionTitle t={t}>About</SectionTitle>
      <div style={{
        padding: 22, border: `1px solid ${pal.rule}`, background: pal.paperAlt,
        borderLeft: `3px solid ${theme.accent}`,
      }}>
        <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 22, color: pal.ink, lineHeight: 1.3, marginBottom: 8 }}>
          Anchor is a quiet life planner.
        </div>
        <div style={{ fontFamily: type.body, fontSize: 13, color: pal.ink2, lineHeight: 1.7 }}>
          Version 0.1 · design prototype. No account, no sync, no telemetry — just a place to think on paper, even when the paper is a screen.
        </div>
      </div>

      {cleared && (
        <div style={{
          position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          background: pal.ink, color: pal.paper,
          padding: '12px 20px', borderRadius: 4,
          fontFamily: type.body, fontSize: 13,
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          zIndex: 1000,
        }}>
          Demo data cleared. Your planner is now a blank page.
        </div>
      )}
    </PageShell>
  );
}

// A reusable empty-state for pages when demo data is cleared
function EmptyState({ t, title, body, action }) {
  const { pal, type, theme } = t;
  return (
    <div style={{
      padding: '60px 40px', textAlign: 'center',
      border: `1px dashed ${pal.rule}`, background: pal.card,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        border: `1px dashed ${pal.ink4}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: pal.ink4, fontFamily: type.display, fontStyle: 'italic', fontSize: 20,
      }}>·</div>
      <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 22, color: pal.ink2 }}>{title}</div>
      {body && <div style={{ fontFamily: type.body, fontSize: 13, color: pal.ink3, maxWidth: 360, lineHeight: 1.6 }}>{body}</div>}
      {action}
    </div>
  );
}

Object.assign(window, { SettingsPage, EmptyState });
