# Design Patterns Reference

How to create reusable UI components using reactive-md. Design patterns use **Tailwind CSS** for rapid, consistent component development.

**When to use**: Reusable component libraries, quick demonstrations, documentation snippets

---

## Navigation Patterns

### Top Navigation Bar

```jsx live
function TopNavbar() {
  const [active, setActive] = React.useState('home');
  
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-md">
      <div className="text-2xl font-bold">Logo</div>
      <div className="flex gap-8">
        {['home', 'products', 'about', 'contact'].map(item => (
          <button
            key={item}
            onClick={() => setActive(item)}
            className={`px-4 py-2 capitalize transition-colors ${
              active === item 
                ? 'text-blue-600 border-b-2 border-blue-600 font-bold' 
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
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
    <div className="flex h-96">
      <div className={`${
        collapsed ? 'w-16' : 'w-64'
      } bg-gray-900 text-white p-4 transition-all duration-300`}>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="w-full p-2 bg-white/10 rounded hover:bg-white/20 mb-4"
        >
          {collapsed ? '→' : '←'}
        </button>
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`w-full p-4 flex items-center gap-3 rounded transition-colors ${
              active === item.id ? 'bg-white/10' : 'hover:bg-white/5'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </div>
      <div className="flex-1 p-8 bg-gray-50">
        <h1 className="text-2xl font-bold capitalize">{active}</h1>
        <p className="text-gray-600 mt-2">Content for {active} section</p>
      </div>
    </div>
  );
}
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
    <nav className="flex items-center gap-2 py-4 text-sm">
      {path.map((crumb, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="text-gray-400">/</span>}
          <button
            onClick={() => setPath(path.slice(0, i + 1))}
            className={`transition-colors ${
              i === path.length - 1 
                ? 'text-gray-900 font-semibold cursor-default' 
                : 'text-blue-600 hover:text-blue-700 underline'
            }`}
          >
            {crumb}
          </button>
        </React.Fragment>
      ))}
    </nav>
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
    <div className="p-8">
      <table className="w-full bg-white rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-50">
            {['name', 'email', 'status'].map(field => (
              <th 
                key={field}
                onClick={() => sort(field)}
                className="px-4 py-3 text-left border-b border-gray-200 cursor-pointer select-none capitalize hover:bg-gray-100 transition-colors"
              >
                {field} {sortBy === field && (sortDir === 'asc' ? '↑' : '↓')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">{row.name}</td>
              <td className="px-4 py-3">{row.email}</td>
              <td className="px-4 py-3">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  row.status === 'Active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
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
    <div className="p-8">
      <div className="flex gap-4 mb-4">
        <input 
          type="text"
          placeholder="Search..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select 
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Departments</option>
          <option value="Engineering">Engineering</option>
          <option value="Design">Design</option>
          <option value="Product">Product</option>
        </select>
      </div>
      
      <table className="w-full bg-white border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Role</th>
            <th className="px-4 py-3 text-left">Department</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(row => (
            <tr key={row.id} className="border-b border-gray-100">
              <td className="px-4 py-3">{row.name}</td>
              <td className="px-4 py-3">{row.role}</td>
              <td className="px-4 py-3">{row.dept}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="mt-4 text-sm text-gray-600">
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
    <div className="p-8">
      <button 
        onClick={() => setIsOpen(true)}
        className="px-8 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Open Modal
      </button>
      
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-white p-8 rounded-lg max-w-md w-11/12 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4">Modal Title</h2>
            <p className="mb-8 text-gray-600">
              This is a modal dialog. Click outside or press the button to close.
            </p>
            <div className="flex justify-end gap-4">
              <button 
                onClick={() => setIsOpen(false)}
                className="px-6 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
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
    <div className="p-8">
      <button 
        onClick={() => setShowConfirm(true)}
        className="px-8 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      >
        Delete Item
      </button>
      
      {result && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded">
          {result}
        </div>
      )}
      
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-sm shadow-2xl">
            <div className="text-6xl text-center mb-4">⚠️</div>
            <h3 className="text-xl font-bold mb-4 text-center">Delete Item?</h3>
            <p className="mb-8 text-gray-600 text-center">
              This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-6 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
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
