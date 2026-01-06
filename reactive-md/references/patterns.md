# Code Patterns Reference

Common patterns for reactive-md documents. These examples demonstrate best practices for working with the extension's capabilities.

---

## State Persistence with localStorage

Persist state across page reloads for demo purposes:

```jsx live
function CartDemo() {
  const [cart, setCart] = React.useState(() => {
    const saved = localStorage.getItem('demo-cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const addItem = (item) => {
    const newCart = [...cart, item];
    setCart(newCart);
    localStorage.setItem('demo-cart', JSON.stringify(newCart));
  };
  
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('demo-cart');
  };
  
  return (
    <div>
      <div>Cart: {cart.length} items</div>
      <button onClick={() => addItem({ id: Date.now(), name: 'Item' })}>
        Add Item
      </button>
      <button onClick={clearCart}>Clear</button>
    </div>
  );
}
```

**When to use:** Shopping cart demos, settings persistence, draft state saving

---

## SVG Data Visualization

Create charts without external libraries:

### Bar Chart

```jsx live
function BarChart({ data }) {
  const maxValue = Math.max(...data.map(d => d.value));
  const barWidth = 60;
  const barSpacing = 80;
  const chartHeight = 200;
  
  return (
    <svg width="400" height="250">
      {data.map((item, i) => {
        const barHeight = (item.value / maxValue) * chartHeight;
        const x = i * barSpacing + 20;
        const y = chartHeight - barHeight + 20;
        
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill="#3b82f6"
            />
            <text
              x={x + barWidth / 2}
              y={chartHeight + 35}
              textAnchor="middle"
              fontSize="12"
            >
              {item.label}
            </text>
            <text
              x={x + barWidth / 2}
              y={y - 5}
              textAnchor="middle"
              fontSize="12"
            >
              {item.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// Usage
<BarChart data={[
  { label: 'Q1', value: 65 },
  { label: 'Q2', value: 78 },
  { label: 'Q3', value: 90 },
  { label: 'Q4', value: 85 }
]} />
```

### Line Chart

```jsx live
function LineChart({ data, metric = 'value' }) {
  const values = data.map(d => d[metric]);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = maxValue - minValue;
  
  const width = 500;
  const height = 200;
  const padding = 40;
  
  const xScale = (index) => padding + (index / (data.length - 1)) * (width - 2 * padding);
  const yScale = (value) => height - padding - ((value - minValue) / range) * (height - 2 * padding);
  
  const pathData = data.map((d, i) => {
    const x = xScale(i);
    const y = yScale(d[metric]);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
  
  return (
    <svg width={width} height={height + 20}>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
        const y = height - padding - ratio * (height - 2 * padding);
        return (
          <line
            key={ratio}
            x1={padding}
            y1={y}
            x2={width - padding}
            y2={y}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        );
      })}
      
      {/* Line path */}
      <path
        d={pathData}
        fill="none"
        stroke="#3b82f6"
        strokeWidth="2"
      />
      
      {/* Data points */}
      {data.map((d, i) => {
        const x = xScale(i);
        const y = yScale(d[metric]);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="4"
            fill="#3b82f6"
          />
        );
      })}
    </svg>
  );
}
```

**When to use:** Analytics dashboards, trend visualization, metric comparisons (when recharts isn't available)

---

## Theme System with Elementary Design System

Dark mode support using Elementary's semantic tokens:

```css live
@import '../design-systems/elementary/tokens.css';
```

```jsx live
function ThemedCard() {
  return (
    <div style={{
      color: 'var(--c-text)',
      background: 'var(--bg-surface)',
      border: '1px solid var(--c-border)',
      padding: 'var(--p-card)',
      borderRadius: 'var(--r-card)',
      boxShadow: 'var(--fx-card-shadow)'
    }}>
      <h3 style={{ marginBottom: 'var(--m-stack)' }}>Themed Component</h3>
      <p style={{ color: 'var(--c-text-secondary)' }}>
        Uses Elementary semantic tokens for automatic dark mode support.
      </p>
      <button style={{
        background: 'var(--c-primary)',
        color: 'var(--c-on-primary)',
        padding: 'var(--p-btn)',
        border: 'none',
        borderRadius: 'var(--r-btn)',
        cursor: 'pointer'
      }}>
        Themed Button
      </button>
    </div>
  );
}
```

**When to use:** High-fidelity prototypes, themeable demonstrations, brand exploration

**System Reference:** See [Elementary Design System](https://github.com/million-views/reactive-md/blob/main/recipes/design-systems/elementary/tokens.md) for complete token taxonomy

---

## Remote Data Fetching

**⚠️ IMPORTANT:** `fetch()` only works for **REMOTE URLs** (https://...). For **LOCAL FILES**, use `import` instead (see JSON Data Loading section).

Fetch from mock APIs for realistic prototypes:

```jsx live
function PostsList() {
  const [posts, setPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  
  React.useEffect(() => {
    // ✅ WORKS - Remote URL
    fetch('https://jsonplaceholder.typicode.com/posts?_limit=5')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.body.substring(0, 100)}...</p>
        </article>
      ))}
    </div>
  );
}
```

**Common mock APIs:**
- JSONPlaceholder: https://jsonplaceholder.typicode.com
- ReqRes: https://reqres.in/api
- RandomUser: https://randomuser.me/api

**❌ DON'T DO THIS:**
```jsx
// ❌ BLOCKED - VS Code security prevents fetch() to local files
fetch('./data/products.json')  // Will fail!

// ✅ USE THIS INSTEAD - Static import
import products from './data/products.json' with { type: 'json' };
```

---

## Component Extraction Strategy

When to keep inline vs extract to files:

### Keep Inline (< 50 lines)

```jsx live
function SimpleCard({ title, children }) {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-bold mb-2">{title}</h3>
      <div>{children}</div>
    </div>
  );
}

<SimpleCard title="Example">
  Simple components stay inline
</SimpleCard>
```

### Extract to File (> 50 lines or reused)

**In spec.md:**
```markdown
```jsx live
import { NotificationBell } from './NotificationBell.jsx';

function Demo() {
  return <NotificationBell count={3} />;
}
```
```

**In NotificationBell.jsx:**
```jsx
export function NotificationBell({ count }) {
  // Complex component logic...
  return (...);
}
```

---

## Form Handling with FormData

Native form handling without libraries:

```jsx live
function ContactForm() {
  const [submitted, setSubmitted] = React.useState(null);
  const formRef = React.useRef(null);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Convert to object
    const data = Object.fromEntries(formData.entries());
    
    setSubmitted(data);
    formRef.current.reset();
  };
  
  return (
    <div>
      <form ref={formRef} onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input name="name" required />
        </div>
        
        <div>
          <label>Email</label>
          <input name="email" type="email" required />
        </div>
        
        <div>
          <label>Message</label>
          <textarea name="message" required />
        </div>
        
        <button type="submit">Submit</button>
      </form>
      
      {submitted && (
        <pre>{JSON.stringify(submitted, null, 2)}</pre>
      )}
    </div>
  );
}
```

---

## Animation with motion/react

```jsx live
import { motion } from 'motion/react';

function AnimatedCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 bg-blue-500 text-white rounded-lg"
    >
      This card fades in and slides up
    </motion.div>
  );
}
```

---

## Icon Usage

```jsx live
import { Home, Settings, User } from 'lucide-react';

function IconNav() {
  return (
    <nav className="flex gap-4">
      <button className="p-2"><Home className="w-5 h-5" /></button>
      <button className="p-2"><Settings className="w-5 h-5" /></button>
      <button className="p-2"><User className="w-5 h-5" /></button>
    </nav>
  );
}
```

---

## Date/Time Patterns with dayjs

Create time-aware prototypes with dayjs (includes relativeTime, duration, utc, timezone plugins):

### Relative Time Display

```jsx live
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

function ActivityFeed() {
  const activities = [
    { action: 'User signed up', timestamp: dayjs().subtract(2, 'hours') },
    { action: 'Order placed', timestamp: dayjs().subtract(1, 'day') },
    { action: 'Payment processed', timestamp: dayjs().subtract(3, 'days') },
    { action: 'Email sent', timestamp: dayjs().subtract(1, 'week') },
  ];

  return (
    <div className="space-y-3">
      <h3 className="font-bold">Recent Activity</h3>
      {activities.map((activity, i) => (
        <div key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded">
          <span>{activity.action}</span>
          <span className="text-sm text-gray-500">
            {activity.timestamp.fromNow()}
          </span>
        </div>
      ))}
    </div>
  );
}
```

### Duration Calculations

```jsx live
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

function TestDuration() {
  const testStart = dayjs().subtract(2, 'hours').subtract(30, 'minutes');
  const now = dayjs();
  const testDuration = dayjs.duration(now.diff(testStart));

  return (
    <div className="p-4 bg-blue-50 rounded-lg">
      <h3 className="font-bold mb-2">A/B Test Results</h3>
      <div className="space-y-1 text-sm">
        <div>Test started: {testStart.format('MMM D, h:mm A')}</div>
        <div>Duration: {testDuration.hours()}h {testDuration.minutes()}m</div>
        <div>Status: <span className="text-green-600 font-semibold">Running</span></div>
      </div>
    </div>
  );
}
```

### Timezone Handling

```jsx live
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

function GlobalLaunch() {
  const launchTime = dayjs().add(1, 'week').hour(14).minute(0); // 2 PM next week
  
  return (
    <div className="p-4 bg-green-50 rounded-lg">
      <h3 className="font-bold mb-3">Global Product Launch</h3>
      <div className="space-y-2 text-sm">
        <div>🕐 New York: {launchTime.tz('America/New_York').format('MMM D, h:mm A')}</div>
        <div>🕐 London: {launchTime.tz('Europe/London').format('MMM D, h:mm A')}</div>
        <div>🕐 Tokyo: {launchTime.tz('Asia/Tokyo').format('MMM D, h:mm A')}</div>
        <div>🕐 Sydney: {launchTime.tz('Australia/Sydney').format('MMM D, h:mm A')}</div>
      </div>
    </div>
  );
}
```

**When to use:** Activity feeds, test durations, global launch schedules, time-sensitive notifications, dashboard timestamps

---

## JSON Data Loading (Local Files)

**✅ USE THIS for loading local JSON files:**

```jsx live
// ✅ Static import - loaded at build time, works in all preview modes
import products from './data/products.json' with { type: 'json' };

function ProductGrid() {
  const [filter, setFilter] = React.useState('All');
  
  const filtered = filter === 'All'
    ? products
    : products.filter(p => p.category === filter);
  
  return (
    <div>
      <select onChange={(e) => setFilter(e.target.value)}>
        <option>All</option>
        <option>Electronics</option>
        <option>Clothing</option>
      </select>
      
      <div className="grid grid-cols-3 gap-4">
        {filtered.map(product => (
          <div key={product.id} className="border p-4">
            <h3>{product.name}</h3>
            <p>${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Why import instead of fetch():**
- ✅ Works in both Static and Interactive preview modes
- ✅ No security restrictions
- ✅ Data available immediately (no loading state needed)
- ✅ Type-safe with proper JSON validation

**❌ DON'T use fetch() for local files:**
```jsx
// ❌ THIS WILL FAIL
fetch('./data/products.json')  // VS Code webview blocks this
```
