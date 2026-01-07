# Wireframes Reference

How to create low-fidelity visual concepts using reactive-md. Wireframes use the **Wireframe Design System** for structure-focused mockups that prioritize speed over polish.

**Recipe source**: https://github.com/million-views/reactive-md/tree/main/recipes/wireframes

**When to use**: Early exploration, structural communication, layout validation

---

## System Setup

The Wireframe Design System uses **monospace typography**, **flat grayscale colors**, and **minimal effects** to create a deliberate "sketch on paper" aesthetic.

**Required imports**:
```css live
@import '../design-systems/wireframe/tokens.css';
@import '../wireframes/wireframe.css';
```

**Design philosophy**: Identical token names as Elementary (high-fidelity) system, but low-fidelity values. This allows system-swapping by changing one import line.

---

## Landing Page Components

### Hero Section

```jsx live
export default function HeroSection() {
  return (
    <header className="wf-hero">
      <div className="content">
        <span className="badge">
          🎉 Now available for teams
        </span>
        <h1 className="title">
          Build products faster with AI
        </h1>
        <p className="description">
          The modern platform for product teams. Design, prototype, 
          and ship — all in one place.
        </p>
        <div className="actions">
          <button className="wf-btn primary">
            Get Started Free
          </button>
          <button className="wf-btn secondary">
            Watch Demo
          </button>
        </div>
        <p className="footnote">
          No credit card required · Free for individuals
        </p>
      </div>
    </header>
  );
}
```

### Social Proof Bar

```jsx live
const Logo = ({ name }) => (
  <span className="logo">{name}</span>
);

export default function SocialProof() {
  const logos = ['Acme Inc', 'TechCorp', 'StartupXYZ', 'Enterprise Co', 'ScaleUp'];
  
  return (
    <section className="wf-social-proof">
      <p className="label">
        Trusted by 10,000+ teams at companies like
      </p>
      <div className="logos">
        {logos.map(logo => (
          <Logo key={logo} name={logo} />
        ))}
      </div>
    </section>
  );
}
```

### Feature Grid

```jsx live
function FeatureCard({ icon, title, description }) {
  return (
    <article className="wf-card">
      <div className="icon">{icon}</div>
      <h3 className="title">{title}</h3>
      <p className="description">{description}</p>
    </article>
  );
}

export default function FeatureGrid() {
  const features = [
    { icon: '⚡', title: 'Lightning Fast', desc: 'Built for speed. See changes in milliseconds.' },
    { icon: '🔒', title: 'Secure by Default', desc: 'Enterprise-grade security out of the box.' },
    { icon: '🎨', title: 'Beautiful Design', desc: 'Stunning templates to get started quickly.' },
    { icon: '🔄', title: 'Real-time Sync', desc: 'Collaborate with your team in real-time.' },
    { icon: '📊', title: 'Analytics Built-in', desc: 'Track performance without extra tools.' },
    { icon: '🌐', title: 'Global CDN', desc: 'Deploy to 300+ edge locations worldwide.' },
  ];
  
  return (
    <section className="wf-features">
      {features.map(f => (
        <FeatureCard key={f.title} icon={f.icon} title={f.title} description={f.desc} />
      ))}
    </section>
  );
}
```

---

## Dashboard Components

### Dashboard Layout with Sidebar

```jsx live
function NavItem({ item, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`item ${isActive ? 'active' : ''}`}
    >
      <span>{item.icon}</span>
      <span>{item.label}</span>
    </button>
  );
}

function MetricCard({ label, value }) {
  return (
    <article className="wf-card">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
    </article>
  );
}

export default function DashboardLayout() {
  const [activeNav, setActiveNav] = React.useState('overview');
  
  const navItems = [
    { id: 'overview', icon: '📊', label: 'Overview' },
    { id: 'analytics', icon: '📈', label: 'Analytics' },
    { id: 'reports', icon: '📋', label: 'Reports' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ];
  
  const metrics = [
    { label: 'Total Users', value: '2,345' },
    { label: 'Active Now', value: '127' },
    { label: 'Revenue', value: '$45.2K' },
  ];
  
  return (
    <div className="wf-dashboard">
      <aside className="sidebar">
        <h2 className="title">Dashboard</h2>
        <nav className="nav">
          {navItems.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              isActive={activeNav === item.id}
              onClick={() => setActiveNav(item.id)}
            />
          ))}
        </nav>
      </aside>
      
      <main className="main">
        <h1 className="heading">{activeNav}</h1>
        <div className="wf-grid metrics">
          {metrics.map((metric, i) => (
            <MetricCard key={i} label={metric.label} value={metric.value} />
          ))}
        </div>
      </main>
    </div>
  );
}
```

### Stat Cards with Trend Indicators

```jsx live
function StatCard({ stat }) {
  return (
    <article className="wf-card">
      <div className="label">{stat.label}</div>
      <div className="value">{stat.value}</div>
      <div className={`change ${stat.up ? 'positive' : ''}`}>
        {stat.change} vs last month
      </div>
    </article>
  );
}

export default function StatCards() {
  const stats = [
    { label: 'Total Revenue', value: '$45,231', change: '+12.5%', up: true },
    { label: 'Active Users', value: '2,350', change: '+4.2%', up: true },
    { label: 'Bounce Rate', value: '32%', change: '-2.1%', up: false },
    { label: 'Conversion', value: '3.2%', change: '+0.5%', up: true },
  ];
  
  return (
    <section className="wf-grid stats">
      {stats.map((stat) => (
        <StatCard key={stat.label} stat={stat} />
      ))}
    </section>
  );
}
```

---

## Empty States

### Zero Data State

```jsx live
export default function EmptyState() {
  return (
    <section className="wf-empty-state">
      <div className="icon">📋</div>
      <h3 className="title">No items yet</h3>
      <p className="description">
        Get started by creating your first item
      </p>
      <button className="wf-btn primary">
        + Create Item
      </button>
    </section>
  );
}
```

---

## Settings Pages

### Tabbed Settings Interface

```jsx live
export default function SettingsPage() {
  const [tab, setTab] = React.useState('profile');
  
  const tabs = ['profile', 'security', 'notifications'];
  
  return (
    <div className="wf-settings">
      <nav className="tabs">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`tab ${tab === t ? 'active' : ''}`}
          >
            {t}
          </button>
        ))}
      </nav>
      
      <section className="wf-card">
        {tab === 'profile' && (
          <div>
            <h2 className="title">Profile Settings</h2>
            <input type="text" placeholder="Name" className="wf-input" />
            <input type="email" placeholder="Email" className="wf-input" />
            <button className="wf-btn primary">Save Changes</button>
          </div>
        )}
        {tab === 'security' && (
          <div>
            <h2 className="title">Security Settings</h2>
            <input type="password" placeholder="Current Password" className="wf-input" />
            <input type="password" placeholder="New Password" className="wf-input" />
            <button className="wf-btn primary">Update Password</button>
          </div>
        )}
        {tab === 'notifications' && (
          <div>
            <h2 className="title">Notification Preferences</h2>
            <label><input type="checkbox" /> Email notifications</label>
            <label><input type="checkbox" /> Push notifications</label>
            <button className="wf-btn primary">Save Preferences</button>
          </div>
        )}
      </section>
    </div>
  );
}
```

---

## Onboarding Flows

### Multi-Step Wizard

```jsx live
export default function OnboardingWizard() {
  const [step, setStep] = React.useState(1);
  const totalSteps = 3;
  
  return (
    <div className="wf-onboarding">
      {/* Progress indicator */}
      <div className="progress">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`step ${i + 1 <= step ? 'active' : ''}`}
          >
            {i + 1}
          </div>
        ))}
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
      <div className="actions">
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

---

## Component Classes

The Wireframe Design System provides these component classes:

**Layout Containers:**
- `.wf-hero` - Hero section wrapper
- `.wf-dashboard` - Dashboard layout with sidebar
- `.wf-settings` - Settings page layout
- `.wf-onboarding` - Onboarding wizard layout
- `.wf-grid` - Responsive grid container

**Components:**
- `.wf-card` - Card component
- `.wf-btn` - Button (add `.primary` for primary variant)
- `.wf-input` - Form input
- `.wf-empty-state` - Empty state container
- `.wf-social-proof` - Social proof bar
- `.wf-features` - Feature grid

**Utility Classes:**
- `.badge` - Badge/label
- `.title` - Section title
- `.description` - Description text
- `.actions` - Button group
- `.footnote` - Small helper text

---

## Tips for Velocity

### Focus on Structure, Not Polish

- Monospace typography creates "sketch" feel
- Flat grayscale prevents color distractions
- Simple borders and spacing
- Emoji for icons (fast and recognizable)

### Show Real Interactions

```jsx live
function InteractiveExample() {
  const [expanded, setExpanded] = React.useState(false);
  
  return (
    <div className="wf-card">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="wf-btn"
      >
        {expanded ? '▼' : '▶'} {expanded ? 'Collapse' : 'Expand'}
      </button>
      {expanded && (
        <div style={{ marginTop: '1rem', padding: '1rem', background: '#f5f5f5' }}>
          Hidden content revealed on click
        </div>
      )}
    </div>
  );
}
```

### Use Plausible Content

Not "Lorem ipsum" - use realistic data:
- **Names**: "Sarah Chen", "Marcus Johnson"
- **Emails**: "sarah@company.com"
- **Metrics**: "$45.2K", "2,345 users", "+12.5%"

Makes wireframes believable for stakeholder review.

---

## System Swapping

Upgrade from wireframe to high-fidelity by changing one line:

```css live
/* Low-fidelity wireframe */
@import '../design-systems/wireframe/tokens.css';

/* High-fidelity polished */
@import '../design-systems/elementary/tokens.css';
```

All component code using semantic tokens works with both systems.

---

## When to Use Wireframes

| Use Case | Why Wireframe System |
|----------|---------------------|
| **Landing pages** | Validate structure before visual design |
| **Dashboards** | Test data layout and hierarchy |
| **Onboarding flows** | Prototype step sequence |
| **Settings pages** | Design configuration interfaces |
| **Empty states** | Handle zero-data scenarios |

**Speed over polish** - Get stakeholder alignment on structure before investing in visual design. Iterate fast on layouts, then graduate to Elementary system for high-fidelity prototypes.
