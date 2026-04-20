// Team 1:1 Manager — Professional Services, Managed Services, Sales Operations, Project Coordinator
// Service Delivery Team Project Module

const { useState: useState1o1 } = React;

// ─── Shared sub-components ───────────────────────────────────────────────────

function AgendaTab({ t, compact, items }) {
  const { pal, type, theme } = t;
  const priorityColor = (p) => ({ high: '#B45B47', medium: theme.accent, low: pal.ink3 }[p] || pal.ink3);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <SmallCaps color={pal.ink3}>This week's agenda</SmallCaps>
        <button style={{
          border: `1px dashed ${pal.rule}`, background: 'transparent',
          padding: '5px 10px', color: pal.ink3,
          fontFamily: type.body, fontSize: 11, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <Icon name="plus" size={11} /> Add item
        </button>
      </div>
      <div style={{ border: `1px solid ${pal.rule}`, background: pal.card }}>
        {items.map((item, i) => (
          <div key={i} style={{
            display: 'flex', gap: 14, alignItems: 'flex-start',
            padding: '14px 18px',
            borderBottom: i === items.length - 1 ? 'none' : `1px dashed ${pal.rule}`,
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: priorityColor(item.priority),
              marginTop: 7, flexShrink: 0,
            }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: type.body, fontSize: 14, color: pal.ink, marginBottom: item.context ? 4 : 0 }}>
                {item.topic}
              </div>
              {item.context && (
                <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 12, color: pal.ink3, lineHeight: 1.4 }}>
                  {item.context}
                </div>
              )}
            </div>
            <div style={{ flexShrink: 0, textAlign: 'right' }}>
              <div style={{
                fontFamily: type.mono, fontSize: 9, color: pal.ink4,
                textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4,
              }}>{item.owner}</div>
              <div style={{
                fontFamily: type.mono, fontSize: 9, color: priorityColor(item.priority),
                textTransform: 'uppercase', letterSpacing: 0.5,
              }}>{item.priority}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotesTab({ t, compact, notes }) {
  const { pal, type, theme } = t;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <SmallCaps color={pal.ink3}>Meeting notes</SmallCaps>
        <button style={{
          border: `1px solid ${pal.ink}`, background: pal.ink, color: pal.paper,
          padding: '6px 12px',
          fontFamily: type.body, fontSize: 11, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <Icon name="pen" size={11} /> New note
        </button>
      </div>
      <div style={{ display: 'grid', gap: 14 }}>
        {notes.map((note, i) => (
          <div key={i} style={{
            padding: 20, border: `1px solid ${pal.rule}`, background: pal.card,
            borderLeft: i === 0 ? `3px solid ${theme.accent}` : `1px solid ${pal.rule}`,
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12,
            }}>
              <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 17, color: pal.ink }}>
                {note.date}
              </div>
              {i === 0 && <SmallCaps color={theme.accent}>Latest</SmallCaps>}
            </div>
            <div style={{ fontFamily: type.body, fontSize: 13.5, color: pal.ink2, lineHeight: 1.7 }}>
              {note.content}
            </div>
            {note.keyPoints && (
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px dashed ${pal.rule}` }}>
                <SmallCaps color={pal.ink3} style={{ marginBottom: 8 }}>Key points</SmallCaps>
                {note.keyPoints.map((kp, j) => (
                  <div key={j} style={{
                    display: 'flex', gap: 8, marginBottom: 6,
                    fontFamily: type.body, fontSize: 13, color: pal.ink2,
                  }}>
                    <span style={{ color: theme.accent, fontFamily: type.display, fontStyle: 'italic' }}>·</span>
                    {kp}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ActionItemsTab({ t, compact, items }) {
  const { pal, type, theme } = t;
  const [actionItems, setActionItems] = useState1o1(items);

  const statusColor = (s) => ({
    done: pal.ink4, 'in-progress': theme.accent, blocked: '#B45B47', open: pal.ink3,
  }[s] || pal.ink3);

  const toggleDone = (idx) => {
    setActionItems(prev => prev.map((item, i) =>
      i === idx ? { ...item, status: item.status === 'done' ? 'open' : 'done' } : item
    ));
  };

  const open = actionItems.map((a, i) => ({ ...a, _idx: i })).filter(a => a.status !== 'done');
  const done = actionItems.map((a, i) => ({ ...a, _idx: i })).filter(a => a.status === 'done');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <SmallCaps color={pal.ink3}>{open.length} open · {done.length} done</SmallCaps>
        <button style={{
          border: `1px dashed ${pal.rule}`, background: 'transparent',
          padding: '5px 10px', color: pal.ink3,
          fontFamily: type.body, fontSize: 11, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <Icon name="plus" size={11} /> Add action
        </button>
      </div>

      <div style={{ border: `1px solid ${pal.rule}`, background: pal.card, marginBottom: 14 }}>
        {open.map((item, i) => (
          <div key={i} style={{
            display: 'flex', gap: 14, alignItems: 'center',
            padding: '13px 18px',
            borderBottom: i === open.length - 1 ? 'none' : `1px dashed ${pal.rule}`,
          }}>
            <button onClick={() => toggleDone(item._idx)} style={{
              width: 16, height: 16,
              border: `1.5px solid ${statusColor(item.status)}`,
              background: 'transparent', borderRadius: 2, cursor: 'pointer',
              flexShrink: 0, padding: 0,
            }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: type.body, fontSize: 14, color: pal.ink, marginBottom: item.context ? 2 : 0 }}>
                {item.task}
              </div>
              {item.context && (
                <div style={{ fontFamily: type.mono, fontSize: 10.5, color: pal.ink4 }}>{item.context}</div>
              )}
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontFamily: type.mono, fontSize: 11, color: pal.ink3 }}>{item.owner}</div>
              <div style={{
                fontFamily: type.mono, fontSize: 9.5,
                color: item.due === 'overdue' ? '#B45B47' : pal.ink4,
                marginTop: 2,
              }}>due {item.due}</div>
            </div>
            <div style={{
              fontFamily: type.mono, fontSize: 9, color: statusColor(item.status),
              textTransform: 'uppercase', letterSpacing: 0.5,
              width: 74, textAlign: 'right', flexShrink: 0,
            }}>{item.status}</div>
          </div>
        ))}
      </div>

      {done.length > 0 && (
        <div>
          <SmallCaps color={pal.ink4} style={{ marginBottom: 8 }}>Completed</SmallCaps>
          <div style={{ border: `1px solid ${pal.rule}`, background: pal.card, opacity: 0.6 }}>
            {done.map((item, i) => (
              <div key={i} style={{
                display: 'flex', gap: 14, alignItems: 'center',
                padding: '10px 18px',
                borderBottom: i === done.length - 1 ? 'none' : `1px dashed ${pal.rule}`,
              }}>
                <button onClick={() => toggleDone(item._idx)} style={{
                  width: 16, height: 16, border: `1.5px solid ${pal.ink4}`,
                  background: pal.ink4, borderRadius: 2, cursor: 'pointer',
                  flexShrink: 0, padding: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name="check" size={10} style={{ color: pal.paper }} />
                </button>
                <div style={{
                  flex: 1, fontFamily: type.body, fontSize: 13, color: pal.complete,
                  textDecoration: 'line-through',
                }}>{item.task}</div>
                <div style={{ fontFamily: type.mono, fontSize: 11, color: pal.ink4, flexShrink: 0 }}>
                  {item.owner}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function HistoryTab({ t, compact, history }) {
  const { pal, type, theme } = t;

  return (
    <div>
      <SmallCaps color={pal.ink3} style={{ marginBottom: 14 }}>Past meetings</SmallCaps>
      <div style={{ border: `1px solid ${pal.rule}`, background: pal.card }}>
        {history.map((h, i) => (
          <div key={i} style={{
            padding: '16px 20px',
            borderBottom: i === history.length - 1 ? 'none' : `1px dashed ${pal.rule}`,
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8,
            }}>
              <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 15, color: pal.ink }}>
                {h.date}
              </div>
              <div style={{ fontFamily: type.mono, fontSize: 10, color: pal.ink4 }}>{h.duration}</div>
            </div>
            <div style={{ fontFamily: type.body, fontSize: 13, color: pal.ink2, lineHeight: 1.6 }}>
              {h.summary}
            </div>
            {h.completedActions > 0 && (
              <div style={{ fontFamily: type.mono, fontSize: 10, color: theme.accent, marginTop: 8 }}>
                {h.completedActions} action{h.completedActions !== 1 ? 's' : ''} completed
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Core 1:1 page ───────────────────────────────────────────────────────────

function Team1o1Page({ t, compact, teamId }) {
  const { pal, type, theme } = t;
  const [activeTab, setActiveTab] = useState1o1('agenda');

  const teamData = TEAM_1O1_DATA[teamId];
  if (!teamData) return null;

  const tabs = ['agenda', 'notes', 'action items', 'history'];
  const openActions = teamData.actionItems.filter(a => a.status !== 'done').length;

  return (
    <PageShell t={t} title={teamData.name} subtitle={`weekly 1:1 · ${teamData.manager}`} compact={compact}
      action={
        <button style={{
          padding: '8px 14px', border: `1px solid ${pal.ink}`, background: pal.ink, color: pal.paper,
          fontFamily: type.body, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <Icon name="plus" size={12} /> Schedule meeting
        </button>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: compact ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: 14, marginBottom: 22 }}>
        <StatCard t={t} label="Next meeting" big={teamData.nextMeeting} sub="weekly cadence" />
        <StatCard t={t} label="Last meeting" big={teamData.lastMeeting} sub={teamData.lastMeetingDate} />
        <StatCard t={t} label="Open actions" big={openActions} sub={`${teamData.actionItems.length} total items`} />
        <StatCard t={t} label="Team size" big={teamData.teamSize} sub="direct reports" />
      </div>

      <div style={{
        display: 'flex', gap: 0, marginBottom: 22,
        borderBottom: `1px solid ${pal.rule}`,
      }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            border: 'none', background: 'transparent',
            padding: '10px 18px',
            fontFamily: type.body, fontSize: 13,
            color: activeTab === tab ? pal.ink : pal.ink3,
            fontWeight: activeTab === tab ? 500 : 400,
            cursor: 'pointer', textTransform: 'capitalize',
            borderBottom: activeTab === tab ? `2px solid ${theme.accent}` : '2px solid transparent',
            marginBottom: -1,
          }}>{tab}</button>
        ))}
        {openActions > 0 && (
          <div style={{
            marginLeft: 'auto', display: 'flex', alignItems: 'center', padding: '0 4px',
            fontFamily: type.mono, fontSize: 10, color: theme.accent,
          }}>{openActions} open</div>
        )}
      </div>

      {activeTab === 'agenda'       && <AgendaTab      t={t} compact={compact} items={teamData.agenda} />}
      {activeTab === 'notes'        && <NotesTab       t={t} compact={compact} notes={teamData.notes} />}
      {activeTab === 'action items' && <ActionItemsTab t={t} compact={compact} items={teamData.actionItems} />}
      {activeTab === 'history'      && <HistoryTab     t={t} compact={compact} history={teamData.history} />}
    </PageShell>
  );
}

// ─── Individual team pages ────────────────────────────────────────────────────

function ProfessionalServicesPage({ t, compact }) {
  return <Team1o1Page t={t} compact={compact} teamId="professional-services" />;
}

function ManagedServicesPage({ t, compact }) {
  return <Team1o1Page t={t} compact={compact} teamId="managed-services" />;
}

function SalesOperationsPage({ t, compact }) {
  return <Team1o1Page t={t} compact={compact} teamId="sales-operations" />;
}

function ProjectCoordinatorPage({ t, compact }) {
  return <Team1o1Page t={t} compact={compact} teamId="project-coordinator" />;
}

// ─── Service Delivery Goals ───────────────────────────────────────────────────

function ServiceDeliveryGoalsPage({ t, compact }) {
  const { pal, type, theme } = t;
  const goals = SERVICE_DELIVERY_GOALS;

  const statusColor = (s) => ({
    'on-track': theme.accent, 'at-risk': '#febc2e', 'off-track': '#B45B47', 'complete': pal.ink3,
  }[s] || pal.ink3);
  const statusLabel = (s) => ({
    'on-track': 'On Track', 'at-risk': 'At Risk', 'off-track': 'Off Track', 'complete': 'Complete',
  }[s] || s);

  return (
    <PageShell t={t} title="Service Delivery" subtitle="company goals · Q2 2026" compact={compact}
      action={
        <button style={{
          padding: '8px 14px', border: `1px solid ${pal.rule}`, background: pal.card, color: pal.ink,
          fontFamily: type.body, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <Icon name="plus" size={12} /> Add goal
        </button>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: compact ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard t={t} label="Goals"     big={goals.length}                                             sub="Q2 2026" />
        <StatCard t={t} label="On track"  big={goals.filter(g => g.status === 'on-track').length}        trend="↗ strong quarter" />
        <StatCard t={t} label="At risk"   big={goals.filter(g => g.status === 'at-risk').length}         sub="needs attention" />
        <StatCard t={t} label="Avg progress" big={`${Math.round(goals.reduce((a, g) => a + g.progress, 0) / goals.length)}%`} sub="across all goals" />
      </div>

      <SectionTitle t={t}>Q2 Objectives</SectionTitle>
      <div style={{ display: 'grid', gap: 16 }}>
        {goals.map((goal, i) => (
          <div key={i} style={{
            padding: 22, border: `1px solid ${pal.rule}`, background: pal.card,
            borderLeft: `3px solid ${statusColor(goal.status)}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: type.display, fontStyle: 'italic', fontSize: 19, color: pal.ink,
                  marginBottom: 6, letterSpacing: -0.2, lineHeight: 1.2,
                }}>{goal.objective}</div>
                <div style={{ fontFamily: type.body, fontSize: 13, color: pal.ink3, lineHeight: 1.5 }}>
                  {goal.description}
                </div>
              </div>
              <div style={{
                fontFamily: type.mono, fontSize: 9, color: statusColor(goal.status),
                textTransform: 'uppercase', letterSpacing: 0.6, flexShrink: 0, marginLeft: 20,
              }}>{statusLabel(goal.status)}</div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <SmallCaps color={pal.ink3}>Progress</SmallCaps>
                <span style={{ fontFamily: type.mono, fontSize: 10, color: pal.ink3 }}>{goal.progress}%</span>
              </div>
              <div style={{ height: 5, background: pal.rule, position: 'relative' }}>
                <div style={{
                  position: 'absolute', inset: 0, right: `${100 - goal.progress}%`,
                  background: statusColor(goal.status),
                }} />
              </div>
            </div>

            <div style={{ paddingTop: 14, borderTop: `1px dashed ${pal.rule}` }}>
              <SmallCaps color={pal.ink3} style={{ marginBottom: 10 }}>Key results</SmallCaps>
              <div style={{ display: 'grid', gap: 10 }}>
                {goal.keyResults.map((kr, j) => (
                  <div key={j} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 14, height: 14, border: `1.5px solid ${kr.done ? theme.accent : pal.rule}`,
                      background: kr.done ? theme.accent : 'transparent',
                      borderRadius: 2, flexShrink: 0, marginTop: 2,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {kr.done && <Icon name="check" size={9} style={{ color: pal.paper }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontFamily: type.body, fontSize: 13, color: kr.done ? pal.complete : pal.ink,
                        textDecoration: kr.done ? 'line-through' : 'none',
                      }}>{kr.result}</div>
                      {kr.metric && (
                        <div style={{ fontFamily: type.mono, fontSize: 10.5, color: pal.ink4, marginTop: 2 }}>
                          {kr.metric}
                        </div>
                      )}
                    </div>
                    {kr.owner && (
                      <div style={{ fontFamily: type.mono, fontSize: 10, color: pal.ink4, flexShrink: 0 }}>
                        {kr.owner}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginTop: 14, paddingTop: 12, borderTop: `1px dashed ${pal.rule}`,
            }}>
              <div style={{ fontFamily: type.mono, fontSize: 10, color: pal.ink4 }}>Owner: {goal.owner}</div>
              <div style={{ fontFamily: type.mono, fontSize: 10, color: pal.ink4 }}>Due: {goal.dueDate}</div>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

Object.assign(window, {
  ProfessionalServicesPage,
  ManagedServicesPage,
  SalesOperationsPage,
  ProjectCoordinatorPage,
  ServiceDeliveryGoalsPage,
});
