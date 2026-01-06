# PRD Templates Reference

How to structure Product Requirement Documents using reactive-md. PRDs combine narrative documentation with interactive prototypes to create living specifications.

---

## Feature Specification

Document a single feature with working prototype.

### Structure

```markdown
# Feature: [Feature Name]

## Problem Statement

[What problem does this solve? Who experiences it?]

## Proposed Solution

[High-level approach]

## Interactive Prototype

```jsx live
// Working demonstration of the feature
function FeatureDemo() {
  const [state, setState] = React.useState(initialValue);
  
  return (
    <div>
      {/* Interactive feature demonstration */}
    </div>
  );
}
```

## User Stories

- As a [user type], I want [goal] so that [benefit]
- As a [user type], I want [goal] so that [benefit]

## Success Metrics

- Metric 1: [target]
- Metric 2: [target]

## Technical Considerations

[API changes, data models, edge cases]

## Open Questions

- Question 1?
- Question 2?
```

### Example: Dark Mode Toggle

```markdown
# Feature: Dark Mode Toggle

## Problem Statement

Users working late hours experience eye strain from bright interfaces. Industry standard is theme switching.

## Proposed Solution

Add theme toggle with system preference detection and localStorage persistence.

## Interactive Prototype

```jsx live
function DarkModeDemo() {
  const [theme, setTheme] = React.useState(() => {
    return localStorage.getItem('demo-theme') || 'light';
  });
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('demo-theme', newTheme);
  };
  
  return (
    <div className={`demo-card ${theme}`}>
      <style>{`
        @import '../design-systems/elementary/tokens.css';
        
        .demo-card {
          padding: var(--p-card);
          border-radius: var(--r-card);
          background: var(--bg-surface);
          color: var(--c-text);
        }
        
        .demo-card h3 {
          color: var(--c-heading);
          margin-bottom: var(--s-4);
        }
        
        .demo-card button {
          padding: var(--s-3) var(--s-4);
          background: var(--bg-surface-raised);
          color: var(--c-text);
          border: 1px solid var(--c-border);
          border-radius: var(--r-button);
          cursor: pointer;
        }
        
        .demo-card button:hover {
          background: var(--bg-surface-hover);
        }
      `}</style>
      
      <h3>Theme: {theme}</h3>
      <button onClick={toggleTheme}>
        Toggle Theme
      </button>
    </div>
  );
}
```
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Toggle Theme
      </button>
      <p>Preference persists across page reloads</p>
    </div>
  );
}
```

## User Stories

- As a night-time user, I want dark mode so that I reduce eye strain
- As a user with light sensitivity, I want to choose my theme so that I can use the app comfortably

## Success Metrics

- 40% of users enable dark mode within first week
- 80% retention of theme preference

## Technical Considerations

- CSS custom properties with `light-dark()` function
- System preference detection via `prefers-color-scheme`
- localStorage for persistence
- Respect user's OS theme by default
```

---

## User Flow Documentation

Document multi-step user journeys.

### Structure

```markdown
# User Flow: [Flow Name]

## Overview

[What is this flow? When does it occur?]

## Steps

### Step 1: [Entry Point]

[Description]

```jsx live
function Step1() {
  // Interactive demo of step 1
}
```

### Step 2: [Action]

[Description]

```jsx live
function Step2() {
  // Interactive demo of step 2
}
```

### Step 3: [Completion]

[Description]

```jsx live
function Step3() {
  // Interactive demo of step 3
}
```

## Edge Cases

- What if user goes back?
- What if user closes browser?
- What if validation fails?

## Technical Notes

[State management, API calls, error handling]
```

---

## Competitive Analysis

Compare features across products.

### Structure

```markdown
# Competitive Analysis: [Feature]

## Products Compared

- Product A: [Brief description]
- Product B: [Brief description]
- Product C: [Brief description]

## Feature Matrix

| Feature | Product A | Product B | Product C | Our Approach |
|---------|-----------|-----------|-----------|--------------|
| Feature 1 | ✅ | ✅ | ❌ | ✅ Better |
| Feature 2 | Basic | Advanced | ❌ | Advanced+ |

## Interactive Comparisons

### Product A Approach

```jsx live
function ProductA() {
  // Demo of Product A's pattern
}
```

### Product B Approach

```jsx live
function ProductB() {
  // Demo of Product B's pattern
}
```

### Our Proposed Approach

```jsx live
function OurApproach() {
  // Demo of our improved pattern
}
```

## Key Insights

- Insight 1
- Insight 2
- Insight 3

## Recommendation

[Which approach to take and why]
```

---

## A/B Test Proposal

Document test variants with interactive previews and time-aware results.

### Structure

```markdown
# A/B Test: [Hypothesis]

## Hypothesis

[What we believe and why]

## Metrics

- Primary: [metric]
- Secondary: [metric]

## Variant A (Control)

Current implementation

```jsx live
function VariantA() {
  // Current version
}
```

## Variant B (Treatment)

Proposed change

```jsx live
function VariantB() {
  // New version
}
```

## Test Results

```jsx live
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';

dayjs.extend(relativeTime);
dayjs.extend(duration);

function TestResults() {
  const testStart = dayjs().subtract(14, 'days');
  const testEnd = dayjs().subtract(2, 'days');
  const testDuration = dayjs.duration(testEnd.diff(testStart));
  
  const results = {
    variantA: { conversions: 1247, rate: '2.4%', confidence: '95%' },
    variantB: { conversions: 1389, rate: '2.7%', confidence: '95%' }
  };
  
  const improvement = ((results.variantB.conversions - results.variantA.conversions) / results.variantA.conversions * 100).toFixed(1);
  
  return (
    <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '8px' }}>
      <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>Test Results Summary</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ padding: '1rem', background: 'white', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Variant A (Control)</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>{results.variantA.rate}</div>
          <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{results.variantA.conversions} conversions</div>
        </div>
        
        <div style={{ padding: '1rem', background: 'white', borderRadius: '6px', border: '2px solid #22c55e' }}>
          <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Variant B (Treatment)</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#22c55e' }}>{results.variantB.rate}</div>
          <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{results.variantB.conversions} conversions</div>
        </div>
      </div>
      
      <div style={{ background: 'white', padding: '1rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontWeight: 'bold', color: '#1e293b' }}>+{improvement}% improvement</span>
          <span style={{ fontSize: '0.875rem', color: '#64748b' }}>{results.variantB.confidence} confidence</span>
        </div>
        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
          Test ran for {testDuration.days()} days • Completed {testEnd.fromNow()}
        </div>
      </div>
    </div>
  );
}
```

## Analysis

| Aspect | Variant A | Variant B |
|--------|-----------|-----------|
| Pros | Familiar UX, lower risk | Better conversion, modern design |
| Cons | Lower performance | Learning curve for users |
| Risk | Low | Medium |

## Test Plan

- Traffic split: 50/50
- Duration: 2 weeks
- Success criteria: 10% lift in [metric]
```

---

## Tips for PRDs

### Use Folder Structure for Complex Features

```
notification-feature/
├── spec.md              # Main PRD
├── NotificationBell.jsx # Component
├── NotificationItem.jsx # Component
├── styles.css           # Shared styles
└── data.json            # Mock data
```

In `spec.md`:
```markdown
```jsx live
import NotificationBell from './NotificationBell.jsx';
import notifications from './data.json' with { type: 'json' };

function Demo() {
  return <NotificationBell items={notifications} />;
}
```
```

### Start with Low-Fidelity

Don't over-polish prototypes. Use:
- Simple colors (no design system needed)
- Basic layouts (flexbox, no fancy grid)
- Essential interactions only
- Placeholder data

**Goal:** Communicate concept, not ship production code

### Focus on "Why" Not "How"

PRDs explain:
- ✅ Why this feature matters
- ✅ What problem it solves
- ✅ What success looks like

PRDs don't specify:
- ❌ Implementation details
- ❌ File structure
- ❌ Testing strategy
- ❌ Deployment plan

---

## Common Patterns

### State Management

```jsx live
function FeatureDemo() {
  // Use useState for simple demos
  const [value, setValue] = React.useState(initial);
  
  // Persist to localStorage for multi-step demos
  const [cart, setCart] = React.useState(() => {
    const saved = localStorage.getItem('demo-cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  return <div>{/* demo */}</div>;
}
```

### Mock Data Loading

```jsx live
import mockData from './data.json' with { type: 'json' };

function DataDemo() {
  // Simulate loading state
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState([]);
  
  React.useEffect(() => {
    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 1000);
  }, []);
  
  if (loading) return <div>Loading...</div>;
  return <div>{/* render data */}</div>;
}
```

### Interactive Variants

```jsx live
function VariantComparison() {
  const [variant, setVariant] = React.useState('A');
  
  return (
    <div>
      <div>
        <button onClick={() => setVariant('A')}>Variant A</button>
        <button onClick={() => setVariant('B')}>Variant B</button>
      </div>
      
      {variant === 'A' ? <VariantA /> : <VariantB />}
    </div>
  );
}
```

---

## When to Use Each Template

| Template | Use When |
|----------|----------|
| **Feature Spec** | Proposing a new feature or change |
| **User Flow** | Documenting multi-step processes |
| **Competitive Analysis** | Evaluating market approaches |
| **A/B Test** | Comparing design alternatives |

All templates emphasize **working prototypes** over static mockups. The goal is stakeholder alignment through interaction, not pixel perfection.
