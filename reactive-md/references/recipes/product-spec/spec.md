---
title: Product Spec Recipe — Focus Timer
status: reference
instruction: "Follow the literate structure strictly: WHO this is for → THE PROBLEM → WHY NOW → each screen as a live demo → design decisions block after every fence → end-to-end integration with navigation state table and FTUE/daily-use scenario fixtures. Never produce a fence without prose that earns it and a design decisions block that follows it."
---

# Focus Timer: Product Vision

**A mobile-first app that makes deep work feel possible again**

---

## Who This Is For

The knowledge worker who opens their laptop at 9am with every intention of doing focused work, and looks up at 11am to find they've answered emails, read Slack, and started three browser tabs — but produced nothing. They know about Pomodoro. They've tried it. The problem isn't the technique. It's the friction of the tools.

---

## The Problem

Pomodoro apps ask you to manage your work *inside* the app. Pick a task, start a timer, log your sessions. That's backwards. The timer should disappear when you're working. The app should get out of the way.

The gap is mechanical, not motivational:
- Every interruption-to-recovery costs 23 minutes (Microsoft Research, 2008)
- Most people already know *what* to work on — they just can't *start*
- The ritual of sitting down matters more than the tracking of what you did

---

## Why Now

Remote work normalized interruption. Notification APIs made every app a distraction engine. "Focus mode" is built into every OS — but it's opt-in, buried in settings. An app that makes friction visible and intentional has no incumbent.

---

## The Solution: One Tap to Context Switch

Set a duration. State your intention. Go. The app steps aside until the session ends.

### Session Setup

The only inputs: duration (default 25 min, adjustable) and an optional intention field. The intention is not a task — it is a sentence you finish: *"By the end of this session, I will have..."* Different framing, different output.

```jsx live id="session-setup" device=mobile orientation=portrait zoom=auto
export default function SessionSetup() {
  const [minutes, setMinutes] = React.useState(25);
  const [intention, setIntention] = React.useState('');
  const durations = [15, 25, 45, 60, 90];

  return (
    <div className="h-full bg-slate-950 text-white flex flex-col font-sans">
      <div className="flex-1 flex flex-col items-center justify-center gap-8 px-6">
        <div className="text-center">
          <h1 className="text-3xl font-black tracking-tight mb-1">Focus Timer</h1>
          <p className="text-slate-400 text-sm">Start a session. Get out of the way.</p>
        </div>

        <div className="w-full flex flex-col gap-2">
          <label className="text-slate-400 text-xs uppercase tracking-widest">Duration</label>
          <div className="flex gap-2">
            {durations.map(d => (
              <button
                key={d}
                onClick={() => setMinutes(d)}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-colors ${
                  minutes === d
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {d}m
              </button>
            ))}
          </div>
        </div>

        <div className="w-full flex flex-col gap-2">
          <label className="text-slate-400 text-xs uppercase tracking-widest">
            By the end of this session, I will have...
          </label>
          <textarea
            rows={3}
            placeholder="finished the first draft of the proposal"
            value={intention}
            onChange={e => setIntention(e.target.value)}
            className="bg-slate-800 text-white rounded-xl px-4 py-3 text-sm resize-none border border-slate-700 focus:border-indigo-500 focus:outline-none placeholder-slate-600"
          />
          <p className="text-slate-600 text-xs">Optional — but it works.</p>
        </div>
      </div>

      <div className="px-6 pb-10">
        <button className="w-full py-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-lg font-bold transition-colors">
          Start {minutes}-minute session →
        </button>
      </div>
    </div>
  );
}
```

**Design decisions:**
- **Five preset durations, not a slider**: Sliders invite micro-optimization. Five presets force a committed choice. The moment of choosing 45 vs 60 *is* the intention-setting — it primes the brain for depth.
- **Optional intention field**: "By the end of this session, I will have..." is a completion sentence, not a task name. It demands specificity without becoming a task management system. Optional because some work is exploratory — forcing the field would add friction where none is needed.
- **No task list**: The app doesn't own your productivity system. It assumes you already know what to work on. If you don't, no timer will help.

---

### The Active Session

The screen goes quiet. A large countdown. Your intention, if you set one. A single abort path — requiring deliberate confirmation to prevent accidental taps.

```jsx live id="active-session" device=mobile orientation=portrait zoom=auto
export default function ActiveSession() {
  const TOTAL = 25 * 60;
  const [remaining, setRemaining] = React.useState(TOTAL);
  const [running, setRunning] = React.useState(true);
  const [confirming, setConfirming] = React.useState(false);
  const intention = "finished the first draft of the proposal";

  React.useEffect(() => {
    if (!running || remaining <= 0) return;
    const id = setInterval(() => setRemaining(r => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, [running, remaining]);

  const mins = String(Math.floor(remaining / 60)).padStart(2, '0');
  const secs = String(remaining % 60).padStart(2, '0');
  const progress = 1 - remaining / TOTAL;

  if (remaining === 0) {
    return (
      <div className="h-full bg-slate-950 text-white flex flex-col items-center justify-center gap-6 font-sans px-8">
        <div className="text-6xl">🎯</div>
        <h2 className="text-2xl font-bold text-center">Session complete</h2>
        <p className="text-slate-400 text-center text-sm">"{intention}"</p>
        <button
          onClick={() => setRemaining(TOTAL)}
          className="mt-4 px-8 py-4 rounded-2xl bg-indigo-600 text-white font-bold"
        >
          Take a break →
        </button>
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-950 text-white flex flex-col items-center justify-center gap-8 font-sans px-6">
      <div className="relative w-52 h-52">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill="none" stroke="#1e293b" strokeWidth="6" />
          <circle
            cx="50" cy="50" r="44" fill="none"
            stroke="#6366f1" strokeWidth="6"
            strokeDasharray={`${2 * Math.PI * 44}`}
            strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress)}`}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-black tabular-nums">{mins}:{secs}</span>
          <span className="text-slate-400 text-xs mt-1">remaining</span>
        </div>
      </div>

      <div className="text-center max-w-xs">
        <p className="text-slate-500 text-xs uppercase tracking-widest mb-2">Focus intention</p>
        <p className="text-slate-200 text-sm italic">"{intention}"</p>
      </div>

      <button
        onClick={() => setRunning(r => !r)}
        className="px-6 py-2 rounded-full bg-slate-800 text-slate-400 text-sm"
      >
        {running ? 'Pause' : 'Resume'}
      </button>

      {!confirming ? (
        <button onClick={() => setConfirming(true)} className="text-slate-600 text-xs underline">
          End session early
        </button>
      ) : (
        <div className="flex gap-3">
          <button onClick={() => setConfirming(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm">
            Keep going
          </button>
          <button onClick={() => setRemaining(0)} className="px-4 py-2 rounded-xl bg-red-900 text-red-300 text-sm">
            End session
          </button>
        </div>
      )}
    </div>
  );
}
```

**Design decisions:**
- **Circular progress, not a progress bar**: The ring format lets the eye gauge remaining time in two dimensions simultaneously — the number AND the visual arc. A bar requires reading the number. The ring can be understood in a peripheral glance, which matters when you check the screen mid-thought.
- **Two-step abort**: Accidental taps on "End session" would corrupt the ritual. The confirmation step adds 0.5 seconds of friction. That friction is the feature — it makes stopping feel like a choice, not an accident.
- **Pause is visible but demoted**: Available, never removed — pausing for a bathroom break is legitimate. But it's small and grey so it doesn't tempt the user to rationalize stopping.

---

### Session Summary

When the session ends, the app offers a lightweight review. Not a rating scale — a single yes/no question: did you do what you set out to do? This primes the next session and builds a sparse-but-honest data set.

```jsx live id="session-summary" device=mobile orientation=portrait zoom=auto
export default function SessionSummary() {
  const [answered, setAnswered] = React.useState(null);

  if (answered !== null) {
    return (
      <div className="h-full bg-slate-950 text-white flex flex-col items-center justify-center gap-6 font-sans px-8">
        <div className="text-5xl">{answered ? '✅' : '📝'}</div>
        <h2 className="text-xl font-bold text-center">
          {answered ? 'Logged. Good work.' : 'Logged. Next session will be sharper.'}
        </h2>
        <button
          onClick={() => setAnswered(null)}
          className="mt-4 px-8 py-4 rounded-2xl bg-indigo-600 text-white font-bold"
        >
          New session
        </button>
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-950 text-white flex flex-col font-sans px-6">
      <div className="flex-1 flex flex-col justify-center gap-8">
        <div className="text-center">
          <div className="text-slate-400 text-sm mb-2">25 minutes · just now</div>
          <h2 className="text-2xl font-bold">Session complete</h2>
          <p className="text-slate-400 text-sm mt-2 italic">
            "finished the first draft of the proposal"
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-slate-300 text-center text-sm">Did you do what you set out to do?</p>
          <div className="flex gap-3">
            <button
              onClick={() => setAnswered(true)}
              className="flex-1 py-5 rounded-2xl bg-green-900 border-2 border-green-700 text-green-200 font-bold text-lg hover:bg-green-800 transition-colors"
            >
              Yes
            </button>
            <button
              onClick={() => setAnswered(false)}
              className="flex-1 py-5 rounded-2xl bg-slate-800 border-2 border-slate-700 text-slate-300 font-bold text-lg hover:bg-slate-700 transition-colors"
            >
              Not quite
            </button>
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-4 flex justify-between text-center">
          <div><div className="text-2xl font-black text-indigo-400">8</div><div className="text-slate-500 text-xs">sessions this week</div></div>
          <div><div className="text-2xl font-black text-green-400">6</div><div className="text-slate-500 text-xs">completed as intended</div></div>
          <div><div className="text-2xl font-black text-slate-300">75%</div><div className="text-slate-500 text-xs">completion rate</div></div>
        </div>
      </div>

      <div className="pb-10">
        <button className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold">
          Start next session
        </button>
      </div>
    </div>
  );
}
```

**Design decisions:**
- **Binary review, not a scale**: "Did you do it? Yes / Not quite." captures the only variable that matters for recalibration. A 1–5 scale generates data that will never be analyzed. The binary answer trains the user to set tighter intentions next time.
- **"Not quite" not "No"**: The phrasing matters. "No" feels like failure. "Not quite" frames it as calibration. The data is identical; the user's relationship with it is different.
- **Stats visible but secondary**: Completion rate shows after review, not before. Showing it before would let the user rationalize cutting a session short to "protect" their streak. Order is a design decision.

---

## End to End

All three screens connected. State flows through one top-level component.

```jsx live id="focus-app" device=mobile orientation=portrait zoom=auto
const DURATIONS = [15, 25, 45, 60, 90];

function SetupScreen({ onStart }) {
  const [minutes, setMinutes] = React.useState(25);
  const [intention, setIntention] = React.useState('');
  return (
    <div className="h-full bg-slate-950 text-white flex flex-col font-sans">
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-5">
        <div className="text-center">
          <h1 className="text-2xl font-black">Focus Timer</h1>
          <p className="text-slate-500 text-xs mt-1">Start a session. Get out of the way.</p>
        </div>
        <div className="w-full flex flex-col gap-2">
          <label className="text-slate-500 text-xs uppercase tracking-wider">Duration</label>
          <div className="flex gap-1">
            {DURATIONS.map(d => (
              <button key={d} onClick={() => setMinutes(d)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${minutes === d ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                {d}m
              </button>
            ))}
          </div>
        </div>
        <div className="w-full flex flex-col gap-2">
          <label className="text-slate-500 text-xs uppercase tracking-wider">By the end of this session, I will have...</label>
          <textarea rows={2} placeholder="shipped the PR" value={intention}
            onChange={e => setIntention(e.target.value)}
            className="bg-slate-800 text-white rounded-xl px-3 py-2 text-sm resize-none border border-slate-700 focus:border-indigo-500 focus:outline-none placeholder-slate-600" />
        </div>
      </div>
      <div className="px-5 pb-10">
        <button onClick={() => onStart(minutes, intention)}
          className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold">
          Start {minutes}-minute session →
        </button>
      </div>
    </div>
  );
}

function TimerScreen({ minutes, intention, onComplete }) {
  const TOTAL = minutes * 60;
  const [remaining, setRemaining] = React.useState(TOTAL);
  const [running, setRunning] = React.useState(true);
  const [confirming, setConfirming] = React.useState(false);

  React.useEffect(() => {
    if (!running || remaining <= 0) return;
    const id = setInterval(() => setRemaining(r => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, [running, remaining]);

  React.useEffect(() => { if (remaining === 0) onComplete(); }, [remaining]);

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');
  const r = 44;
  const circ = 2 * Math.PI * r;
  const prog = 1 - remaining / TOTAL;

  return (
    <div className="h-full bg-slate-950 text-white flex flex-col items-center justify-center gap-6 font-sans px-6">
      <div className="relative w-44 h-44">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={r} fill="none" stroke="#1e293b" strokeWidth="7" />
          <circle cx="50" cy="50" r={r} fill="none" stroke="#6366f1" strokeWidth="7"
            strokeDasharray={circ} strokeDashoffset={circ * (1 - prog)}
            strokeLinecap="round" className="transition-all duration-1000" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black tabular-nums">{mm}:{ss}</span>
        </div>
      </div>
      {intention && <p className="text-slate-400 text-xs italic text-center max-w-xs">"{intention}"</p>}
      <div className="flex gap-3">
        <button onClick={() => setRunning(r => !r)} className="px-4 py-2 rounded-full bg-slate-800 text-slate-400 text-sm">
          {running ? 'Pause' : 'Resume'}
        </button>
        {!confirming ? (
          <button onClick={() => setConfirming(true)} className="px-4 py-2 rounded-full bg-slate-800 text-red-400 text-sm">End early</button>
        ) : (
          <>
            <button onClick={() => setConfirming(false)} className="px-3 py-2 rounded-full bg-slate-800 text-slate-300 text-sm">Keep going</button>
            <button onClick={onComplete} className="px-3 py-2 rounded-full bg-red-900 text-red-300 text-sm">End</button>
          </>
        )}
      </div>
    </div>
  );
}

function SummaryScreen({ minutes, intention, sessions, onNewSession }) {
  const [answered, setAnswered] = React.useState(null);
  const completed = sessions.filter(s => s.completed).length;

  if (answered !== null) {
    return (
      <div className="h-full bg-slate-950 text-white flex flex-col items-center justify-center gap-5 font-sans px-6">
        <div className="text-5xl">{answered ? '✅' : '📝'}</div>
        <p className="text-white font-bold text-center">{answered ? 'Great session.' : 'Noted. Calibrate next time.'}</p>
        <button onClick={onNewSession} className="mt-2 px-8 py-4 rounded-2xl bg-indigo-600 text-white font-bold">New session</button>
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-950 text-white flex flex-col font-sans px-5">
      <div className="flex-1 flex flex-col justify-center gap-6">
        <div className="text-center">
          <div className="text-slate-500 text-xs mb-1">{minutes} minutes · just now</div>
          <h2 className="text-xl font-bold">Session complete</h2>
          {intention && <p className="text-slate-400 text-xs mt-1 italic">"{intention}"</p>}
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-slate-300 text-sm text-center">Did you do what you set out to do?</p>
          <div className="flex gap-3">
            <button onClick={() => setAnswered(true)} className="flex-1 py-4 rounded-2xl bg-green-900 border-2 border-green-700 text-green-200 font-bold">Yes</button>
            <button onClick={() => setAnswered(false)} className="flex-1 py-4 rounded-2xl bg-slate-800 border-2 border-slate-700 text-slate-300 font-bold">Not quite</button>
          </div>
        </div>
        <div className="bg-slate-900 rounded-2xl p-4 flex justify-between text-center">
          <div><div className="text-xl font-black text-indigo-400">{sessions.length}</div><div className="text-slate-500 text-xs">this week</div></div>
          <div><div className="text-xl font-black text-green-400">{completed}</div><div className="text-slate-500 text-xs">completed</div></div>
          <div><div className="text-xl font-black text-slate-300">{sessions.length ? Math.round(completed / sessions.length * 100) : 0}%</div><div className="text-slate-500 text-xs">rate</div></div>
        </div>
      </div>
      <div className="pb-10">
        <button onClick={onNewSession} className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold">Start next session</button>
      </div>
    </div>
  );
}

export default function FocusApp() {
  const [screen, setScreen] = React.useState('setup');
  const [config, setConfig] = React.useState({ minutes: 25, intention: '' });
  const [sessions, setSessions] = React.useState([
    { minutes: 25, completed: true }, { minutes: 45, completed: true },
    { minutes: 25, completed: false }, { minutes: 25, completed: true },
  ]);

  function handleStart(minutes, intention) {
    setConfig({ minutes, intention });
    setScreen('timer');
  }

  function handleComplete() {
    setSessions(s => [...s, { minutes: config.minutes, completed: true }]);
    setScreen('summary');
  }

  return (
    <>
      {screen === 'setup' && <SetupScreen onStart={handleStart} />}
      {screen === 'timer' && <TimerScreen minutes={config.minutes} intention={config.intention} onComplete={handleComplete} />}
      {screen === 'summary' && <SummaryScreen minutes={config.minutes} intention={config.intention} sessions={sessions} onNewSession={() => setScreen('setup')} />}
    </>
  );
}
```

**Navigation state:**

| From | Trigger | To |
|------|---------|-----|
| Setup | Start | Timer |
| Timer | Session ends or "End early" | Summary |
| Summary | Answered → "New session" | Setup |

**Scenario — first session:** Arrives at Setup with no prior history. Picks 25 minutes, leaves intention blank, taps Start. Timer counts down. Completion rate shows 0% in summary until first answer is given.

**Scenario — returning user:** Session history pre-populated from `localStorage`. Completion rate immediately visible. Intent field does not recall previous text — starting fresh is intentional.

**What persists:** Sessions held in React state here. In production: `localStorage`, keyed by ISO week, restored on mount. Last-used duration is not persisted — choosing again is part of the ritual.

---

## Decision

Ship MVP with three screens: Setup → Timer → Summary. Analytics and streaks are v2 — the core habit loop must prove itself before gamification earns its place.

**Next step:** User test with 5 people. Watch whether they set an intention or skip it. That split determines whether the field stays prominent or moves to a "tap to add" collapsed state.

---
*Created with [Reactive MD](https://marketplace.visualstudio.com/items?itemName=million-views.reactive-md)*
