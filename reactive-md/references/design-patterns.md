# Design Patterns Reference

How to create reusable UI components and component libraries using reactive-md. Design patterns are for building consistent, documented component systems.

---

## Navigation Patterns

### Top Navigation Bar

```jsx live
function TopNavbar() {
  const [active, setActive] = React.useState('home');
  
  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '1rem 2rem', 
      background: 'white', 
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
    }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Logo</div>
      <div style={{ display: 'flex', gap: '2rem' }}>
        {['home', 'products', 'about', 'contact'].map(item => (
          <button
            key={item}
            onClick={() => setActive(item)}
            style={{
              background: 'none',
              border: 'none',
              padding: '0.5rem 1rem',
              color: active === item ? '#007bff' : '#666',
              cursor: 'pointer',
              textTransform: 'capitalize',
              fontWeight: active === item ? 'bold' : 'normal',
              borderBottom: active === item ? '2px solid #007bff' : 'none'
            }}
          >
            {item}
          </button>
        ))}
      </div>
      <button style={{ padding: '0.5rem 1.5rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        Sign In
      </button>
    </nav>
  );
}
```

### Sidebar Navigation

```jsx live
function SidebarNav() {
  const [active, setActive] = React.useState('dashboard');
  const [collapsed, setCollapsed] = React.useState(false);
  
  const items = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'users', icon: '👥', label: 'Users' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
    { id: 'reports', icon: '📈', label: 'Reports' },
  ];
  
  return (
    <div style={{ display: 'flex', height: '400px' }}>
      <div style={{ 
        width: collapsed ? '60px' : '250px', 
        background: '#1a1a1a', 
        color: 'white', 
        padding: '1rem',
        transition: 'width 0.3s'
      }}>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          style={{ 
            width: '100%', 
            padding: '0.5rem', 
            background: 'rgba(255,255,255,0.1)', 
            border: 'none', 
            color: 'white', 
            borderRadius: '4px', 
            cursor: 'pointer',
            marginBottom: '1rem'
          }}
        >
          {collapsed ? '→' : '←'}
        </button>
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            style={{
              width: '100%',
              padding: '1rem',
              background: active === item.id ? 'rgba(255,255,255,0.1)' : 'transparent',
              border: 'none',
              color: 'white',
              borderRadius: '4px',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '0.5rem'
            }}
          >
            <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, padding: '2rem', background: '#f5f5f5' }}>
        <h2 style={{ margin: 0 }}>{items.find(i => i.id === active)?.label}</h2>
      </div>
    </div>
  );
}
```

### Breadcrumb Navigation

```jsx live
function Breadcrumbs() {
  const [path, setPath] = React.useState(['Home', 'Products', 'Electronics', 'Laptops']);
  
  return (
    <div style={{ padding: '1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
      {path.map((crumb, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span style={{ color: '#999' }}>/</span>}
          <button
            onClick={() => setPath(path.slice(0, i + 1))}
            style={{
              background: 'none',
              border: 'none',
              color: i === path.length - 1 ? '#333' : '#007bff',
              cursor: i === path.length - 1 ? 'default' : 'pointer',
              textDecoration: i === path.length - 1 ? 'none' : 'underline',
              fontWeight: i === path.length - 1 ? 'bold' : 'normal'
            }}
          >
            {crumb}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}
```

---

## Data Table Patterns

### Sortable Table

```jsx live
function SortableTable() {
  const [data, setData] = React.useState([
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', status: 'Active' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', status: 'Inactive' },
    { id: 3, name: 'Carol Williams', email: 'carol@example.com', status: 'Active' },
  ]);
  const [sortBy, setSortBy] = React.useState('name');
  const [sortDir, setSortDir] = React.useState('asc');
  
  const sort = (field) => {
    const dir = sortBy === field && sortDir === 'asc' ? 'desc' : 'asc';
    setSortBy(field);
    setSortDir(dir);
    setData([...data].sort((a, b) => {
      if (dir === 'asc') return a[field] > b[field] ? 1 : -1;
      return a[field] < b[field] ? 1 : -1;
    }));
  };
  
  return (
    <div style={{ padding: '2rem' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden' }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            {['name', 'email', 'status'].map(field => (
              <th 
                key={field}
                onClick={() => sort(field)}
                style={{ 
                  padding: '1rem', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #ddd',
                  cursor: 'pointer',
                  userSelect: 'none',
                  textTransform: 'capitalize'
                }}
              >
                {field} {sortBy === field && (sortDir === 'asc' ? '↑' : '↓')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '1rem' }}>{row.name}</td>
              <td style={{ padding: '1rem' }}>{row.email}</td>
              <td style={{ padding: '1rem' }}>
                <span style={{ 
                  padding: '0.25rem 0.75rem', 
                  background: row.status === 'Active' ? '#d1fae5' : '#fee2e2',
                  color: row.status === 'Active' ? '#065f46' : '#991b1b',
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

### Filterable Table

```jsx live
function FilterableTable() {
  const allData = [
    { id: 1, name: 'Alice', role: 'Developer', dept: 'Engineering' },
    { id: 2, name: 'Bob', role: 'Designer', dept: 'Design' },
    { id: 3, name: 'Carol', role: 'Developer', dept: 'Engineering' },
    { id: 4, name: 'David', role: 'Manager', dept: 'Product' },
  ];
  
  const [filter, setFilter] = React.useState('');
  const [deptFilter, setDeptFilter] = React.useState('all');
  
  const filtered = allData.filter(row => {
    const matchesSearch = row.name.toLowerCase().includes(filter.toLowerCase()) ||
                         row.role.toLowerCase().includes(filter.toLowerCase());
    const matchesDept = deptFilter === 'all' || row.dept === deptFilter;
    return matchesSearch && matchesDept;
  });
  
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input 
          type="text"
          placeholder="Search..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ flex: 1, padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
        />
        <select 
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          style={{ padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
        >
          <option value="all">All Departments</option>
          <option value="Engineering">Engineering</option>
          <option value="Design">Design</option>
          <option value="Product">Product</option>
        </select>
      </div>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
        <thead>
          <tr style={{ background: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
            <th style={{ padding: '1rem', textAlign: 'left' }}>Name</th>
            <th style={{ padding: '1rem', textAlign: 'left' }}>Role</th>
            <th style={{ padding: '1rem', textAlign: 'left' }}>Department</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(row => (
            <tr key={row.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '1rem' }}>{row.name}</td>
              <td style={{ padding: '1rem' }}>{row.role}</td>
              <td style={{ padding: '1rem' }}>{row.dept}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
        Showing {filtered.length} of {allData.length} results
      </div>
    </div>
  );
}
```

---

## Modal Patterns

### Basic Modal

```jsx live
function BasicModal() {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <div style={{ padding: '2rem' }}>
      <button 
        onClick={() => setIsOpen(true)}
        style={{ padding: '0.75rem 2rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Open Modal
      </button>
      
      {isOpen && (
        <div 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: 'rgba(0,0,0,0.5)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setIsOpen(false)}
        >
          <div 
            style={{ 
              background: 'white', 
              padding: '2rem', 
              borderRadius: '8px', 
              maxWidth: '500px', 
              width: '90%',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ margin: '0 0 1rem 0' }}>Modal Title</h2>
            <p style={{ marginBottom: '2rem', color: '#666' }}>
              This is a modal dialog. Click outside or press the button to close.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ padding: '0.75rem 1.5rem', background: 'white', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ padding: '0.75rem 1.5rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

### Confirmation Dialog

```jsx live
function ConfirmDialog() {
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [result, setResult] = React.useState('');
  
  const handleDelete = () => {
    setResult('Item deleted!');
    setShowConfirm(false);
    setTimeout(() => setResult(''), 2000);
  };
  
  return (
    <div style={{ padding: '2rem' }}>
      <button 
        onClick={() => setShowConfirm(true)}
        style={{ padding: '0.75rem 2rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Delete Item
      </button>
      
      {result && (
        <div style={{ marginTop: '1rem', padding: '1rem', background: '#d1fae5', color: '#065f46', borderRadius: '4px' }}>
          {result}
        </div>
      )}
      
      {showConfirm && (
        <div 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: 'rgba(0,0,0,0.5)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', maxWidth: '400px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '1rem' }}>⚠️</div>
            <h3 style={{ margin: '0 0 1rem 0', textAlign: 'center' }}>Delete Item?</h3>
            <p style={{ marginBottom: '2rem', color: '#666', textAlign: 'center' }}>
              This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => setShowConfirm(false)}
                style={{ flex: 1, padding: '0.75rem', background: 'white', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                style={{ flex: 1, padding: '0.75rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Card Patterns

### Card Grid

```jsx live
function CardGrid() {
  const cards = [
    { id: 1, title: 'Card Title 1', description: 'Brief description of the content', image: '🎨' },
    { id: 2, title: 'Card Title 2', description: 'Another interesting piece', image: '🚀' },
    { id: 3, title: 'Card Title 3', description: 'More content here', image: '💡' },
  ];
  
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', padding: '2rem' }}>
      {cards.map(card => (
        <div 
          key={card.id} 
          style={{ 
            background: 'white', 
            borderRadius: '8px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          }}
        >
          <div style={{ width: '100%', height: '150px', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>
            {card.image}
          </div>
          <div style={{ padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>{card.title}</h3>
            <p style={{ color: '#666', margin: '0 0 1rem 0', fontSize: '0.875rem' }}>{card.description}</p>
            <button style={{ padding: '0.5rem 1rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem' }}>
              Learn More
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
```

### List Cards

```jsx live
function ListCards() {
  const items = [
    { id: 1, title: 'First Item', status: 'completed', date: '2024-01-15' },
    { id: 2, title: 'Second Item', status: 'in-progress', date: '2024-01-16' },
    { id: 3, title: 'Third Item', status: 'pending', date: '2024-01-17' },
  ];
  
  const statusColors = {
    'completed': { bg: '#d1fae5', text: '#065f46' },
    'in-progress': { bg: '#fef3c7', text: '#92400e' },
    'pending': { bg: '#fee2e2', text: '#991b1b' }
  };
  
  return (
    <div style={{ padding: '2rem' }}>
      {items.map(item => (
        <div 
          key={item.id} 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            background: 'white', 
            padding: '1.5rem', 
            marginBottom: '1rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          <div>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>{item.title}</h4>
            <div style={{ fontSize: '0.875rem', color: '#666' }}>{item.date}</div>
          </div>
          <span style={{ 
            padding: '0.5rem 1rem', 
            background: statusColors[item.status].bg,
            color: statusColors[item.status].text,
            borderRadius: '12px',
            fontSize: '0.875rem',
            fontWeight: 500
          }}>
            {item.status.replace('-', ' ')}
          </span>
        </div>
      ))}
    </div>
  );
}
```

---

## Feedback State Patterns

### Loading States

```jsx live
function LoadingStates() {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState(null);
  
  const fetchData = () => {
    setLoading(true);
    setData(null);
    setTimeout(() => {
      setData({ message: 'Data loaded successfully!' });
      setLoading(false);
    }, 2000);
  };
  
  return (
    <div style={{ padding: '2rem' }}>
      <button 
        onClick={fetchData}
        disabled={loading}
        style={{ 
          padding: '0.75rem 2rem', 
          background: loading ? '#ccc' : '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px', 
          cursor: loading ? 'not-allowed' : 'pointer' 
        }}
      >
        {loading ? 'Loading...' : 'Load Data'}
      </button>
      
      {loading && (
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }} />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      )}
      
      {data && (
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          background: '#d1fae5', 
          color: '#065f46', 
          borderRadius: '4px' 
        }}>
          ✓ {data.message}
        </div>
      )}
    </div>
  );
}
```

### Toast Notifications

```jsx live
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

function ToastNotifications() {
  const [toasts, setToasts] = React.useState([]);
  
  const addToast = (type, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message, timestamp: dayjs() }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };
  
  const colors = {
    success: { bg: '#d1fae5', text: '#065f46', icon: '✓' },
    error: { bg: '#fee2e2', text: '#991b1b', icon: '✕' },
    info: { bg: '#dbeafe', text: '#1e40af', icon: 'ℹ' }
  };
  
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => addToast('success', 'Payment processed successfully!')} style={{ padding: '0.75rem 1rem', background: '#22c55e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Success
        </button>
        <button onClick={() => addToast('error', 'Failed to save changes')} style={{ padding: '0.75rem 1rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Error
        </button>
        <button onClick={() => addToast('info', 'New message received')} style={{ padding: '0.75rem 1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Info
        </button>
      </div>
      
      <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 1000 }}>
        {toasts.map(toast => (
          <div 
            key={toast.id}
            style={{ 
              marginBottom: '0.5rem',
              padding: '1rem 1.5rem',
              background: colors[toast.type].bg,
              color: colors[toast.type].text,
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              minWidth: '320px',
              animation: 'slideIn 0.3s ease-out'
            }}
          >
            <span style={{ fontSize: '1.25rem' }}>{colors[toast.type].icon}</span>
            <div style={{ flex: 1 }}>
              <div>{toast.message}</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '0.25rem' }}>
                {toast.timestamp.fromNow()}
              </div>
            </div>
          </div>
        ))}
      </div>
      <style>{`@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </div>
  );
}
```

---

## Tips for Design Patterns

### Keep Components Focused

Each component should do one thing well:
- Navigation → just navigation
- Tables → just data display
- Modals → just overlays

### Document Variants

Show all states:
- Default, hover, active, disabled
- Empty, loading, error, success
- Expanded, collapsed

### Use Consistent Spacing

```jsx
const spacing = {
  xs: '0.25rem',  // 4px
  sm: '0.5rem',   // 8px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem'      // 32px
};
```

---

## When to Use Design Patterns

| Pattern | Use When |
|---------|----------|
| **Navigation** | Building site structure, menu systems |
| **Tables** | Displaying structured data, lists |
| **Modals** | Requiring user decisions, forms |
| **Cards** | Showcasing content items, product listings |
| **Feedback** | Communicating system status to users |

Design patterns are for **reusable components** that appear multiple times across your application. Document variations and states to build a consistent design system.
