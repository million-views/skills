# Wireframes Reference

How to create quick visual concepts and page layouts using reactive-md. Wireframes use the **Wireframe Design System** for low-fidelity, structure-focused mockups.

**System Import**:
```css live
@import '../design-systems/wireframe/tokens.css';
@import '../wireframes/wireframe.css';
```

**When to use**: Early exploration, low-fidelity mockups, structural communication

---

## Landing Page Wireframes

### Hero Section

```jsx live
function HeroWireframe() {
  return (
    <div className="wf-hero">
      <div className="content">
        <span className="wf-label">[Hero Section]</span>
        <h1 className="title">Product Name</h1>
        <p className="description">One-line value proposition</p>
        <div className="wf-actions">
          <button className="wf-btn primary">Primary CTA</button>
          <button className="wf-btn">Secondary CTA</button>
        </div>
      </div>
    </div>
  );
}
```

### Feature Grid

```jsx live
function FeatureGrid() {
  const features = [
    { icon: '🚀', title: 'Fast', description: 'Lightning quick performance' },
    { icon: '🔒', title: 'Secure', description: 'Enterprise-grade security' },
    { icon: '📱', title: 'Mobile', description: 'Works on any device' },
  ];
  
  return (
    <div className="wf-grid three-col">
      {features.map((f, i) => (
        <div key={i} className="wf-card">
          <div className="icon">{f.icon}</div>
          <h3 className="title">{f.title}</h3>
          <p className="description">{f.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### Pricing Table

```jsx live
function PricingWireframe() {
  const plans = [
    { name: 'Basic', price: '$9', features: ['Feature 1', 'Feature 2'] },
    { name: 'Pro', price: '$29', features: ['Everything in Basic', 'Feature 3', 'Feature 4'], highlighted: true },
    { name: 'Enterprise', price: '$99', features: ['Everything in Pro', 'Feature 5', 'Feature 6'] },
  ];
  
  return (
    <div className="wf-pricing">
      {plans.map((plan, i) => (
        <div key={i} className={`wf-card ${plan.highlighted ? 'highlighted' : ''}`}>
          <h3 className="title">{plan.name}</h3>
          <div className="price">{plan.price}</div>
          <ul className="features">
            {plan.features.map((f, j) => (
              <li key={j}>✓ {f}</li>
            ))}
          </ul>
          <button className="wf-btn primary">Choose Plan</button>
        </div>
      ))}
    </div>
  );
}
```

---

## Dashboard Wireframes

### Metrics Overview

```jsx live
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

function DashboardMetrics() {
  const lastUpdated = dayjs().subtract(2, 'hours');
  const dataPeriod = dayjs().subtract(7, 'days');
  
  const metrics = [
    { label: 'Revenue', value: '$45,231', change: '+12%', positive: true },
    { label: 'Users', value: '2,345', change: '+8%', positive: true },
    { label: 'Bounce Rate', value: '42%', change: '-3%', positive: true },
    { label: 'Avg Session', value: '4m 23s', change: '+1m', positive: true },
  ];
  
  return (
    <div className="wf-container">
      {/* Header with time info */}
      <div className="wf-header">
        <h2 className="title">Dashboard Overview</h2>
        <div className="wf-meta">
          Last updated {lastUpdated.fromNow()} • Data from {dataPeriod.format('MMM D')} - {dayjs().format('MMM D')}
        </div>
      </div>
      
      {/* Metrics grid */}
      <div className="wf-grid four-col">
        {metrics.map((m, i) => (
          <div key={i} className="wf-card">
            <div className="wf-label">{m.label}</div>
            <div className="metric-value">{m.value}</div>
            <div className={`metric-change ${m.positive ? 'positive' : 'negative'}`}>
              {m.change}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Data Table

```jsx live
function DashboardTable() {
  const [data] = React.useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Pending' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Active' },
  ]);
  
  return (
    <div className="wf-container">
      <table className="wf-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td>{row.email}</td>
              <td>
                <span className={`wf-badge ${row.status === 'Active' ? 'success' : 'warning'}`}>
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## Onboarding Flow Wireframes

### Step-by-Step Wizard

```jsx live
function OnboardingWizard() {
  const [step, setStep] = React.useState(1);
  const totalSteps = 3;
  
  return (
    <div className="wf-wizard">
      {/* Progress bar */}
      <div className="wf-progress">
        <div className="progress-bar">
          {[...Array(totalSteps)].map((_, i) => (
            <div key={i} className={`segment ${i < step ? 'active' : ''}`} />
          ))}
        </div>
        <div className="wf-meta">Step {step} of {totalSteps}</div>
      </div>
      
      {/* Step content */}
      <div className="wf-card">
        {step === 1 && (
          <div>
            <h2 className="title">Welcome!</h2>
            <p>Let's get you set up. This will only take a minute.</p>
          </div>
        )}
        {step === 2 && (
          <div>
            <h2 className="title">Your Information</h2>
            <input type="text" placeholder="Full Name" className="wf-input" />
            <input type="email" placeholder="Email" className="wf-input" />
          </div>
        )}
        {step === 3 && (
          <div>
            <h2 className="title">All Set!</h2>
            <p>You're ready to get started.</p>
          </div>
        )}
      </div>
      
      {/* Navigation */}
      <div className="wf-actions">
        <button 
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
          className="wf-btn"
        >
          Back
        </button>
        <button 
          onClick={() => setStep(Math.min(totalSteps, step + 1))}
          disabled={step === totalSteps}
          className="wf-btn primary"
        >
          {step === totalSteps ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
}
``` 
            background: step === 1 ? '#e0e0e0' : 'white', 
            border: '1px solid #ddd', 
            borderRadius: '4px', 
            cursor: step === 1 ? 'not-allowed' : 'pointer' 
          }}
        >
          Back
        </button>
        <button 
          onClick={() => setStep(Math.min(totalSteps, step + 1))}
          disabled={step === totalSteps}
          style={{ 
            padding: '0.75rem 1.5rem', 
            background: step === totalSteps ? '#22c55e' : '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
        >
          {step === totalSteps ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
}
```

---

## Settings Page Wireframes

### Tabbed Settings

```jsx live
function SettingsWireframe() {
  const [tab, setTab] = React.useState('profile');
  
  return (
    <div style={{ padding: '2rem' }}>
      {/* Tabs */}
      <div style={{ borderBottom: '1px solid #ddd', marginBottom: '2rem' }}>
        {['profile', 'security', 'notifications'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '1rem 2rem',
              background: 'none',
              border: 'none',
              borderBottom: tab === t ? '2px solid #007bff' : '2px solid transparent',
              color: tab === t ? '#007bff' : '#666',
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {t}
          </button>
        ))}
      </div>
      
      {/* Content */}
      <div style={{ maxWidth: '600px' }}>
        {tab === 'profile' && (
          <div>
            <h3>Profile Settings</h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Name</label>
              <input type="text" defaultValue="John Doe" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email</label>
              <input type="email" defaultValue="john@example.com" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }} />
            </div>
            <button style={{ padding: '0.75rem 2rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Save Changes
            </button>
          </div>
        )}
        {tab === 'security' && (
          <div>
            <h3>Security Settings</h3>
            <div style={{ padding: '1rem', background: '#f5f5f5', borderRadius: '4px', marginBottom: '1rem' }}>
              <div style={{ fontWeight: 500, marginBottom: '0.5rem' }}>Two-Factor Authentication</div>
              <div style={{ fontSize: '0.875rem', color: '#666' }}>Add an extra layer of security</div>
            </div>
            <button style={{ padding: '0.75rem 2rem', background: '#22c55e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Enable 2FA
            </button>
          </div>
        )}
        {tab === 'notifications' && (
          <div>
            <h3>Notification Preferences</h3>
            {['Email notifications', 'Push notifications', 'Weekly digest'].map((pref, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: i < 2 ? '1px solid #eee' : 'none' }}>
                <div>
                  <div style={{ fontWeight: 500 }}>{pref}</div>
                  <div style={{ fontSize: '0.875rem', color: '#666' }}>Receive updates about your account</div>
                </div>
                <input type="checkbox" defaultChecked />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## Empty State Wireframes

### Zero Data State

```jsx live
function EmptyState() {
  return (
    <div style={{ 
      padding: '4rem 2rem', 
      textAlign: 'center', 
      background: '#f9f9f9', 
      borderRadius: '8px',
      border: '2px dashed #ddd'
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📋</div>
      <h3 style={{ margin: '0 0 0.5rem 0' }}>No items yet</h3>
      <p style={{ color: '#666', margin: '0 0 1.5rem 0' }}>
        Get started by creating your first item
      </p>
      <button style={{ 
        padding: '0.75rem 2rem', 
        background: '#007bff', 
        color: 'white', 
        border: 'none', 
        borderRadius: '4px', 
        cursor: 'pointer' 
      }}>
        + Create Item
      </button>
    </div>
  );
}
```

---

## Tips for Wireframing

### Focus on Structure, Not Polish

- Use simple colors (grays, blues)
- Skip custom fonts
- Use basic shapes and spacing
- Emoji for icons (fast and clear)

### Show Interactions

```jsx live
function InteractiveWireframe() {
  const [expanded, setExpanded] = React.useState(false);
  
  return (
    <div style={{ padding: '1rem', background: 'white', borderRadius: '8px' }}>
      <button onClick={() => setExpanded(!expanded)} style={{ padding: '0.75rem 1rem', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>
        {expanded ? '▼' : '▶'} Click to {expanded ? 'collapse' : 'expand'}
      </button>
      {expanded && (
        <div style={{ marginTop: '1rem', padding: '1rem', background: '#f9f9f9', borderRadius: '4px' }}>
          Hidden content revealed!
        </div>
      )}
    </div>
  );
}
```

### Use Real-ish Data

Not "Lorem ipsum" - use plausible content:
- Names: "Sarah Chen", "John Smith"
- Emails: "sarah@company.com"
- Metrics: "$45,231", "2,345 users"

Makes wireframes more believable for stakeholder review.

---

## When to Use Wireframes

| Scenario | Use When |
|----------|----------|
| **Landing Pages** | Designing marketing pages, showcasing features |
| **Dashboards** | Organizing data visualization, metrics displays |
| **Onboarding** | Planning step-by-step user flows |
| **Settings** | Designing configuration interfaces |
| **Empty States** | Handling zero-data scenarios |

Wireframes are for **structure and flow**, not pixel-perfect design. Get stakeholder alignment on layout before investing in visual design.
