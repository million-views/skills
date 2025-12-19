# Wireframes Reference

How to create quick visual concepts and page layouts using reactive-md. Wireframes focus on structure and flow, not visual polish.

---

## Landing Page Wireframes

### Hero Section

```jsx live
function HeroWireframe() {
  return (
    <div style={{ padding: '4rem 2rem', textAlign: 'center', background: '#f5f5f5' }}>
      <h1 style={{ fontSize: '3rem', margin: '0 0 1rem 0' }}>
        [Product Name]
      </h1>
      <p style={{ fontSize: '1.25rem', color: '#666', margin: '0 0 2rem 0' }}>
        [One-line value proposition]
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button style={{ padding: '1rem 2rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Primary CTA
        </button>
        <button style={{ padding: '1rem 2rem', background: 'white', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>
          Secondary CTA
        </button>
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
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', padding: '4rem 2rem' }}>
      {features.map((f, i) => (
        <div key={i} style={{ textAlign: 'center', padding: '2rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{f.icon}</div>
          <h3 style={{ margin: '0 0 0.5rem 0' }}>{f.title}</h3>
          <p style={{ color: '#666', margin: 0 }}>{f.description}</p>
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
    <div style={{ display: 'flex', gap: '2rem', padding: '4rem 2rem', justifyContent: 'center' }}>
      {plans.map((plan, i) => (
        <div key={i} style={{ 
          padding: '2rem', 
          background: plan.highlighted ? '#007bff' : 'white', 
          color: plan.highlighted ? 'white' : 'black',
          borderRadius: '8px', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          flex: '1',
          maxWidth: '300px'
        }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>{plan.name}</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0 0 1rem 0' }}>{plan.price}</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0' }}>
            {plan.features.map((f, j) => (
              <li key={j} style={{ padding: '0.5rem 0' }}>✓ {f}</li>
            ))}
          </ul>
          <button style={{ 
            width: '100%', 
            padding: '1rem', 
            background: plan.highlighted ? 'white' : '#007bff', 
            color: plan.highlighted ? '#007bff' : 'white',
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            Choose Plan
          </button>
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
function DashboardMetrics() {
  const metrics = [
    { label: 'Revenue', value: '$45,231', change: '+12%', positive: true },
    { label: 'Users', value: '2,345', change: '+8%', positive: true },
    { label: 'Bounce Rate', value: '42%', change: '-3%', positive: true },
    { label: 'Avg Session', value: '4m 23s', change: '+1m', positive: true },
  ];
  
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', padding: '2rem' }}>
      {metrics.map((m, i) => (
        <div key={i} style={{ 
          padding: '1.5rem', 
          background: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
        }}>
          <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>{m.label}</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{m.value}</div>
          <div style={{ fontSize: '0.875rem', color: m.positive ? '#22c55e' : '#ef4444' }}>
            {m.change}
          </div>
        </div>
      ))}
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
    <div style={{ padding: '2rem' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden' }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Name</th>
            <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Email</th>
            <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.id}>
              <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>{row.name}</td>
              <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>{row.email}</td>
              <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
                <span style={{ 
                  padding: '0.25rem 0.75rem', 
                  background: row.status === 'Active' ? '#d1fae5' : '#fef3c7',
                  color: row.status === 'Active' ? '#065f46' : '#92400e',
                  borderRadius: '12px',
                  fontSize: '0.875rem'
                }}>
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
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '3rem 2rem' }}>
      {/* Progress bar */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          {[...Array(totalSteps)].map((_, i) => (
            <div key={i} style={{ 
              flex: 1, 
              height: '4px', 
              background: i < step ? '#007bff' : '#e0e0e0',
              borderRadius: '2px'
            }} />
          ))}
        </div>
        <div style={{ fontSize: '0.875rem', color: '#666' }}>Step {step} of {totalSteps}</div>
      </div>
      
      {/* Step content */}
      <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
        {step === 1 && (
          <div>
            <h2 style={{ margin: '0 0 1rem 0' }}>Welcome!</h2>
            <p>Let's get you set up. This will only take a minute.</p>
          </div>
        )}
        {step === 2 && (
          <div>
            <h2 style={{ margin: '0 0 1rem 0' }}>Your Information</h2>
            <input type="text" placeholder="Full Name" style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }} />
            <input type="email" placeholder="Email" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }} />
          </div>
        )}
        {step === 3 && (
          <div>
            <h2 style={{ margin: '0 0 1rem 0' }}>All Set!</h2>
            <p>You're ready to get started.</p>
          </div>
        )}
      </div>
      
      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button 
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
          style={{ 
            padding: '0.75rem 1.5rem', 
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
