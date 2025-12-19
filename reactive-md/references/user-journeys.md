# User Journeys Reference

How to document multi-step user flows using reactive-md. User journeys show how users move through your product to accomplish specific goals.

---

## Signup Flow

### Registration → Verification → Onboarding

```jsx live
function SignupJourney() {
  const [stage, setStage] = React.useState('register'); // register | verify | onboard | complete
  const [email, setEmail] = React.useState('');
  
  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '2rem' }}>
      {/* Progress indicator */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        {['Register', 'Verify', 'Setup', 'Done'].map((label, i) => {
          const stages = ['register', 'verify', 'onboard', 'complete'];
          const currentIndex = stages.indexOf(stage);
          const isActive = i <= currentIndex;
          
          return (
            <div key={label} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                background: isActive ? '#007bff' : '#e0e0e0',
                color: isActive ? 'white' : '#666',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.5rem',
                fontWeight: 'bold'
              }}>
                {i + 1}
              </div>
              <div style={{ fontSize: '0.875rem', color: isActive ? '#007bff' : '#666' }}>
                {label}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Stage content */}
      <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        {stage === 'register' && (
          <div>
            <h2 style={{ margin: '0 0 1rem 0' }}>Create Account</h2>
            <input 
              type="email" 
              placeholder="Email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }} 
            />
            <input 
              type="password" 
              placeholder="Password" 
              style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }} 
            />
            <button 
              onClick={() => setStage('verify')}
              style={{ width: '100%', padding: '0.75rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Sign Up
            </button>
          </div>
        )}
        
        {stage === 'verify' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
            <h2 style={{ margin: '0 0 0.5rem 0' }}>Check Your Email</h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              We sent a verification link to<br />
              <strong>{email || 'your@email.com'}</strong>
            </p>
            <button 
              onClick={() => setStage('onboard')}
              style={{ padding: '0.75rem 2rem', background: '#22c55e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              I Verified My Email
            </button>
            <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
              Didn't get it? <a href="#" style={{ color: '#007bff' }}>Resend</a>
            </div>
          </div>
        )}
        
        {stage === 'onboard' && (
          <div>
            <h2 style={{ margin: '0 0 1rem 0' }}>Tell Us About Yourself</h2>
            <input 
              type="text" 
              placeholder="Full Name" 
              style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }} 
            />
            <select style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
              <option>What describes you best?</option>
              <option>Developer</option>
              <option>Designer</option>
              <option>Product Manager</option>
            </select>
            <button 
              onClick={() => setStage('complete')}
              style={{ width: '100%', padding: '0.75rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Complete Setup
            </button>
          </div>
        )}
        
        {stage === 'complete' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
            <h2 style={{ margin: '0 0 0.5rem 0' }}>Welcome!</h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              Your account is ready to use
            </p>
            <button 
              style={{ padding: '0.75rem 2rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Get Started
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## Checkout Flow

### Cart Review → Shipping → Payment → Confirmation

```jsx live
function CheckoutJourney() {
  const [step, setStep] = React.useState(1); // 1: cart, 2: shipping, 3: payment, 4: confirm
  const [cart] = React.useState([
    { id: 1, name: 'Product A', price: 29.99, qty: 2 },
    { id: 2, name: 'Product B', price: 49.99, qty: 1 },
  ]);
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', fontSize: '0.875rem' }}>
        {['Cart', 'Shipping', 'Payment', 'Review'].map((label, i) => (
          <div key={label} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            color: step > i + 1 ? '#22c55e' : step === i + 1 ? '#007bff' : '#999' 
          }}>
            {i > 0 && <span style={{ margin: '0 0.5rem' }}>→</span>}
            <span style={{ fontWeight: step === i + 1 ? 'bold' : 'normal' }}>{label}</span>
          </div>
        ))}
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Main content */}
        <div>
          {step === 1 && (
            <div style={{ background: 'white', padding: '2rem', borderRadius: '8px' }}>
              <h2 style={{ margin: '0 0 1rem 0' }}>Shopping Cart</h2>
              {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid #eee' }}>
                  <div>
                    <div style={{ fontWeight: 500 }}>{item.name}</div>
                    <div style={{ fontSize: '0.875rem', color: '#666' }}>Qty: {item.qty}</div>
                  </div>
                  <div style={{ fontWeight: 'bold' }}>${(item.price * item.qty).toFixed(2)}</div>
                </div>
              ))}
            </div>
          )}
          
          {step === 2 && (
            <div style={{ background: 'white', padding: '2rem', borderRadius: '8px' }}>
              <h2 style={{ margin: '0 0 1rem 0' }}>Shipping Address</h2>
              <input type="text" placeholder="Full Name" style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }} />
              <input type="text" placeholder="Address Line 1" style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input type="text" placeholder="City" style={{ padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                <input type="text" placeholder="ZIP Code" style={{ padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div style={{ background: 'white', padding: '2rem', borderRadius: '8px' }}>
              <h2 style={{ margin: '0 0 1rem 0' }}>Payment Method</h2>
              <input type="text" placeholder="Card Number" style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input type="text" placeholder="MM/YY" style={{ padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                <input type="text" placeholder="CVV" style={{ padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
            </div>
          )}
          
          {step === 4 && (
            <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
              <h2 style={{ margin: '0 0 0.5rem 0' }}>Order Confirmed!</h2>
              <p style={{ color: '#666', marginBottom: '1rem' }}>
                Order #12345<br />
                Confirmation sent to your email
              </p>
              <button style={{ padding: '0.75rem 2rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Track Order
              </button>
            </div>
          )}
        </div>
        
        {/* Order summary */}
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', height: 'fit-content' }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>Order Summary</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>Shipping</span>
            <span>$5.00</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid #eee', fontWeight: 'bold', fontSize: '1.25rem' }}>
            <span>Total</span>
            <span>${(total + 5).toFixed(2)}</span>
          </div>
          {step < 4 && (
            <button 
              onClick={() => setStep(step + 1)}
              style={{ width: '100%', marginTop: '1rem', padding: '0.75rem', background: '#22c55e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {step === 3 ? 'Place Order' : 'Continue'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## Search-to-Purchase Journey

### Discovery → Product Details → Add to Cart → Checkout

```jsx live
function SearchJourney() {
  const [view, setView] = React.useState('search'); // search | product | cart
  const [query, setQuery] = React.useState('');
  const [results] = React.useState([
    { id: 1, name: 'Wireless Mouse', price: 24.99, rating: 4.5 },
    { id: 2, name: 'Keyboard', price: 79.99, rating: 4.8 },
    { id: 3, name: 'Webcam', price: 59.99, rating: 4.2 },
  ]);
  const [selected, setSelected] = React.useState(null);
  
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      {view === 'search' && (
        <div>
          <div style={{ marginBottom: '2rem' }}>
            <input 
              type="text" 
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ width: '100%', padding: '1rem', fontSize: '1rem', border: '2px solid #ddd', borderRadius: '8px' }}
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {results.map(product => (
              <div key={product.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <div style={{ width: '100%', height: '150px', background: '#f5f5f5', borderRadius: '4px', marginBottom: '1rem' }} />
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>{product.name}</h3>
                <div style={{ marginBottom: '0.5rem' }}>
                  {'⭐'.repeat(Math.floor(product.rating))} {product.rating}
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>${product.price}</div>
                <button 
                  onClick={() => { setSelected(product); setView('product'); }}
                  style={{ width: '100%', padding: '0.75rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {view === 'product' && selected && (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px' }}>
          <button onClick={() => setView('search')} style={{ marginBottom: '1rem', padding: '0.5rem 1rem', background: '#f5f5f5', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            ← Back to Results
          </button>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div style={{ width: '100%', height: '400px', background: '#f5f5f5', borderRadius: '8px' }} />
            <div>
              <h1 style={{ margin: '0 0 1rem 0' }}>{selected.name}</h1>
              <div style={{ marginBottom: '1rem' }}>
                {'⭐'.repeat(Math.floor(selected.rating))} {selected.rating} (127 reviews)
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>${selected.price}</div>
              <p style={{ color: '#666', marginBottom: '2rem' }}>
                High-quality product with excellent features. Perfect for your needs.
              </p>
              <button 
                onClick={() => setView('cart')}
                style={{ width: '100%', padding: '1rem', background: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
      
      {view === 'cart' && (
        <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '2rem', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
          <h2 style={{ margin: '0 0 0.5rem 0' }}>Added to Cart</h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            {selected.name} has been added to your cart
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button 
              onClick={() => setView('search')}
              style={{ padding: '0.75rem 2rem', background: 'white', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}
            >
              Continue Shopping
            </button>
            <button 
              style={{ padding: '0.75rem 2rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Support Ticket Journey

### Issue Submission → Tracking → Resolution

```jsx live
function SupportJourney() {
  const [stage, setStage] = React.useState('submit'); // submit | tracking | resolved
  const [ticketId] = React.useState('TKT-' + Math.floor(Math.random() * 10000));
  
  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem' }}>
      {stage === 'submit' && (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h2 style={{ margin: '0 0 1rem 0' }}>Submit Support Request</h2>
          <select style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
            <option>Select Issue Type</option>
            <option>Technical Problem</option>
            <option>Billing Question</option>
            <option>Feature Request</option>
          </select>
          <input 
            type="text" 
            placeholder="Brief description" 
            style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }} 
          />
          <textarea 
            placeholder="Detailed description of your issue..." 
            rows="6"
            style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical' }}
          />
          <button 
            onClick={() => setStage('tracking')}
            style={{ width: '100%', padding: '0.75rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Submit Ticket
          </button>
        </div>
      )}
      
      {stage === 'tracking' && (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ background: '#e3f2fd', padding: '1rem', borderRadius: '4px', marginBottom: '2rem' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Ticket {ticketId}</div>
            <div style={{ fontSize: '0.875rem' }}>Status: <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>In Progress</span></div>
          </div>
          
          <h3 style={{ margin: '0 0 1rem 0' }}>Activity Timeline</h3>
          <div style={{ borderLeft: '2px solid #ddd', paddingLeft: '1.5rem' }}>
            <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-1.75rem', width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e' }} />
              <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>2 hours ago</div>
              <div style={{ fontWeight: 500 }}>Agent assigned to your ticket</div>
              <div style={{ fontSize: '0.875rem', color: '#666' }}>Support Agent: Sarah Chen</div>
            </div>
            
            <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-1.75rem', width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e' }} />
              <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>3 hours ago</div>
              <div style={{ fontWeight: 500 }}>Ticket created</div>
            </div>
          </div>
          
          <button 
            onClick={() => setStage('resolved')}
            style={{ marginTop: '2rem', padding: '0.75rem 2rem', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}
          >
            Mark as Resolved
          </button>
        </div>
      )}
      
      {stage === 'resolved' && (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ margin: '0 0 0.5rem 0' }}>Issue Resolved</h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            Your ticket {ticketId} has been resolved
          </p>
          <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '4px', marginBottom: '2rem' }}>
            <div style={{ fontWeight: 500, marginBottom: '0.5rem' }}>How was your support experience?</div>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} style={{ padding: '0.5rem 1rem', background: 'white', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontSize: '1.25rem' }}>
                  ⭐
                </button>
              ))}
            </div>
          </div>
          <button 
            onClick={() => setStage('submit')}
            style={{ padding: '0.75rem 2rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Submit New Ticket
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## Tips for User Journeys

### Show State Persistence

Store state across steps using localStorage:

```jsx live
function PersistentJourney() {
  const [name, setName] = React.useState(() => {
    return localStorage.getItem('demo-name') || '';
  });
  
  const saveName = (value) => {
    setName(value);
    localStorage.setItem('demo-name', value);
  };
  
  return (
    <div style={{ padding: '2rem' }}>
      <input 
        type="text" 
        value={name} 
        onChange={(e) => saveName(e.target.value)}
        placeholder="Enter your name"
        style={{ padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
      />
      <div style={{ marginTop: '1rem', color: '#666', fontSize: '0.875rem' }}>
        Refresh the page - your name persists!
      </div>
    </div>
  );
}
```

### Include Navigation

Always provide:
- Back buttons
- Breadcrumbs
- Progress indicators
- "Skip" options for optional steps

### Handle Edge Cases

Document error states and alternative paths:
- Verification email not received
- Payment declined
- Out of stock items
- Session timeouts

---

## When to Use User Journeys

| Journey Type | Use When |
|--------------|----------|
| **Signup** | Documenting account creation, onboarding flows |
| **Checkout** | Designing purchase flows, payment processes |
| **Search-to-Purchase** | Product discovery and conversion flows |
| **Support** | Customer service interactions, ticket systems |

User journeys are best for **multi-step sequences** where users need to complete a series of actions to achieve a goal. Focus on smooth transitions between steps and clear progress indicators.
