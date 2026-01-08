---
name: reactive-md
description: Literate UI/UX for product teams - accelerate from idea to working prototype in minutes using markdown with embedded interactive React components. Use for fast iteration on product specs, wireframes, user flows, feature demos, and design documentation. Replaces Figma/Storybook with executable specs in version control. Optimizes for velocity and async collaboration.
license: MIT
---

# Reactive MD

Generate functional markdown documents with embedded interactive React components for product collaboration.

## When to Use This Skill

Use reactive-md when the user asks to create:

**Primary Use Cases:**
- Product specs with working prototypes
- Design system documentation with live examples
- User flow wireframes and interactive demos
- Feature prototypes, concept exploration, and visual demos
- A/B tests, dashboards, component galleries
- Interactive documentation and living specifications

**Workflow**: Before generating content, check if a recipe exists for the job (see Recipe-First Approach section). Adapt existing recipes rather than creating from scratch.

**Recognized Keywords & Aliases:**

This skill responds to requests using any of these terms:
- **"reactive-md"** / **"reactive md"** (canonical name)
- **"live doc"** / **"living doc"** / **"live document"** (documentation style)
- **"prototype"** / **"proof-of-concept"** / **"POC"** (prototyping)
- **"interactive spec"** / **"interactive prototype"** (specification style)

All these terms refer to creating primary document types (`.md` or `.jsx/.tsx`) with embedded interactive components.

**Do NOT use** for production code, testing, deployment, or backend integration.

---

## Core Capabilities

Reactive-md documents support:

**Two Preview Modes:**
1. **Static Preview** (Markdown Preview): Offline, bundled packages only, server-side rendering
2. **Interactive Preview** (`Cmd+K P`): Browser-based webview, supports CDN packages and platform APIs

**Live Fences (CRITICAL):**

**When to use `live` annotation:**
- User wants to **see/interact** with the component
- Creating a working demo or prototype
- Showing how something works in practice
- All primary use cases (prototypes, specs, wireframes, demos)

**When to use regular fences (no `live`):**
- Explaining **how** something works (discourse about the code)
- Showing anti-patterns or broken examples
- Comparing different approaches side-by-side
- Code snippets that are incomplete or won't run standalone

**Syntax:**
- `` ```jsx live `` - JavaScript + JSX components (executable)
- `` ```tsx live `` - TypeScript + JSX components (executable)
- `` ```css live `` - CSS stylesheets (executable)
- `` ```jsx `` - Code examples for discussion (non-executable)
- `` ```tsx `` - Code snippets for illustration (non-executable)
- `` ```css `` - CSS snippets for illustration (non-executable)

**Default behavior:** When in doubt, use `live` - reactive-md's purpose is interactive demos.

**File Types:**
- Markdown (`.md`) - Primary document only (entry point)
- JSX/TSX with exports - Can be primary OR imported
- CSS (`.css`) - Dependent only (imported by other files)
- JSON (`.json`) - Data files (imported or used inline)

**Hot Module Reload:** Edit `.jsx`, `.tsx`, `.css`, `.json` → preview updates automatically

---

## Package Constraints

### Bundled Packages (Always Available, Offline)

Use these in both preview modes:
- `dayjs` - Date manipulation (includes relativeTime, duration, utc, timezone plugins)
- `motion/react` - Animations (framer-motion)
- `lucide-react` - Icon library
- `clsx` - Class name utilities
- `es-toolkit` - Lodash alternative
- `uuid` - Unique identifiers

### CDN Packages (Interactive Preview Only, Online)

Require internet connection, only work in Interactive Preview:
- `@heroicons/react` - Heroicons
- `zustand` - State management
- `jotai` - Atomic state
- `tailwind-merge` - Tailwind utilities
- `react-hook-form` - Form handling

**Pro tip:** When you try unsupported packages, clear error messages show available alternatives, helping teams prototype within the tool's capabilities.

### Known Broken (Refuse These)

Do NOT suggest:
- ❌ `recharts` - Missing dependencies
- ❌ `swr` - Missing shims
- ❌ `@tanstack/react-query` - React instance conflicts

**Alternative:** Use native SVG or Canvas for data visualization instead of charting libraries.

---

## Data Loading Patterns

### ✅ Static JSON Imports (Local Files)

**USE THIS for local data files:**

```jsx live
import products from './data/products.json' with { type: 'json' };

function ProductList() {
  return <ul>{products.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
}
```

✅ Works in both Static and Interactive preview
✅ Data loaded at build time
✅ No security restrictions

### ✅ Remote Fetch (External APIs)

**USE THIS for remote data:**

```jsx live
function Posts() {
  const [posts, setPosts] = React.useState([]);
  
  React.useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts?_limit=5')
      .then(r => r.json())
      .then(setPosts);
  }, []);
  
  return <div>{posts.map(p => <div key={p.id}>{p.title}</div>)}</div>;
}
```

✅ Works in Interactive Preview only
✅ Requires internet connection
✅ Use mock APIs: jsonplaceholder.typicode.com, reqres.in
✅ Or user specified REST API

### ❌ Runtime Fetch to Local Files (BLOCKED)

**DO NOT use fetch() for local files:**

```jsx
// ❌ THIS WILL FAIL - VS Code webview security blocks local fetch()
function BrokenExample() {
  React.useEffect(() => {
    fetch('./data/products.json')  // ❌ SECURITY BLOCKED
      .then(r => r.json())
      .then(setData);
  }, []);
}
```

**Why it fails:** VS Code webview security policy blocks runtime fetch() to local files

**Solution:** Use static import instead:
```jsx
import products from './data/products.json' with { type: 'json' };  // ✅ WORKS
```

---

## Error Handling & Guidance

Reactive MD provides contextual help when code uses unsupported features:

### Error Intercept Placeholders (EIP)
When code hits limitations, you'll see helpful guidance cards instead of cryptic errors:
- **Package not bundled?** → "Use Interactive Preview for external packages"
- **Local file fetch blocked?** → "Use import statements instead"  
- **Browser APIs unavailable?** → "Use Interactive Preview for localStorage"

### Blank Animation Placeholders (BAP)
Motion components with `initial={{ opacity: 0 }}` show guidance to use Interactive Preview where animations work fully.

**Why this helps:** Product teams can quickly understand limitations and switch to the right preview mode without getting stuck.

---

## Platform APIs (Interactive Preview Only)

Available in `Cmd+K P` mode:
- ✅ `localStorage`, `sessionStorage` - State persistence
- ✅ `setTimeout`, `setInterval` - Timers
- ✅ `fetch('https://...')` - **REMOTE URLs ONLY** (not local files)
- ✅ `FormData`, `URLSearchParams` - Form handling
- ✅ `Canvas` - Data visualization

NOTE: `SVG` renders in both Static and Interactive preview modes.

Not available:
- ❌ WebSockets, Service Workers, Notifications API
- ❌ File System Access API
- ❌ `fetch('./local-file.json')` - Use `import` instead

---

## Design System Integration

Reactive-md supports three styling approaches:

1. **Wireframe Design System** - Low-fidelity structural mockups
2. **Elementary Design System** - High-fidelity themeable components (light/dark mode)
3. **Tailwind CSS** - Utility-first rapid prototyping (loaded via CDN)

**CRITICAL**: Never generate design system CSS from assumptions. Always fetch from canonical source:
`https://github.com/million-views/reactive-md/tree/main/recipes/design-systems`

**See [references/design-systems.md](references/design-systems.md)** for:
- Fetch workflows and curl commands
- System selection guide with examples
- When to use each approach

---

## File Organization

### Single File (Inline Code)

**When:** Simple concepts, manifestos, quick demos

**Pattern for inline live fences:**

✅ **With helper components** - Wrap in parent component:
```jsx live
function Demo() {
  function Button({ children, variant = 'primary' }) {
    return (
      <button className={`px-4 py-2 rounded ${variant === 'primary' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
        {children}
      </button>
    );
  }
  
  return (
    <div className="flex gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
    </div>
  );
}
```

✅ **Without helpers** - Pure JSX at top level:
```jsx live
<div className="flex gap-4">
  <button className="px-4 py-2 rounded bg-blue-500 text-white">Primary</button>
  <button className="px-4 py-2 rounded bg-gray-200 text-gray-800">Secondary</button>
</div>
```

❌ **Don't mix** helper functions with top-level JSX:
```jsx
// This creates ambiguous entry point - renderer doesn't know what to render
function Button({ children }) { return <button>{children}</button>; }
<div><Button>Click me</Button></div>
```

### Folder Structure

**When:** Complex features, reusable components, design systems

```
notification-system/
  spec.md              (primary document)
  NotificationBell.jsx (component)
  NotificationItem.jsx (component)
  styles.css           (shared styles)
  data.json            (mock notifications)
```

**In spec.md:**

# Notification System

```jsx live
import NotificationBell from './NotificationBell.jsx';
import notifications from './data.json' with { type: 'json' };

function Demo() {
  return <NotificationBell items={notifications} />;
}
```

**Naming Convention:** Kebab-case, hierarchical context
- `checkout-flow-payment-form.jsx` (grandparent-parent-child)
- Use context when components might be confused across features
- Drop redundant context when folder provides it

**Complexity Threshold:**
- < 50 lines → Keep inline
- 50-100 lines → Extract to `.jsx` file
- \> 100 lines → Create folder structure

---

## Recipe-First Approach

**Before generating from scratch**, check if a recipe exists:

### Recipe Categories

The [public recipes repository](https://github.com/million-views/reactive-md/tree/main/recipes) contains proven templates organized by job type:

| Job To Be Done | Recipe Category | When To Use |
|----------------|----------------|-------------|
| **Define features** | [PRD Templates](https://github.com/million-views/reactive-md/tree/main/recipes/prd-templates) | Feature specs, A/B tests, competitive analysis, user flows |
| **Design layouts** | [Wireframes](https://github.com/million-views/reactive-md/tree/main/recipes/wireframes) | Landing pages, dashboards, empty states, settings |
| **Map user flows** | [User Journeys](https://github.com/million-views/reactive-md/tree/main/recipes/user-journeys) | Signup flows, checkout, search-to-purchase, support tickets |
| **Prototype features** | [Feature Concepts](https://github.com/million-views/reactive-md/tree/main/recipes/feature-concepts) | Notifications, dark mode, infinite scroll, drag-drop, real-time |
| **Build UI libraries** | [Design Patterns](https://github.com/million-views/reactive-md/tree/main/recipes/design-patterns) | Navigation, tables, modals, cards, feedback states |
| **Document products** | [Case Studies](https://github.com/million-views/reactive-md/tree/main/recipes/case-studies) | E-commerce PDPs, SaaS dashboards, social feeds, mobile concepts |

### Workflow Guidance

1. **Check for existing recipe**: Browse category matching user's job
2. **Adapt, don't generate**: Modify existing recipe rather than creating from scratch
3. **Preserve design system**: Keep original styling approach unless user specifies otherwise
4. **Reference recipe URLs**: Include GitHub links for attribution and further exploration

**Example Response Pattern**:
```
I found an existing recipe that matches your request:
[Recipe Name](URL)

Let me adapt this for your specific needs:
- [Modification 1]
- [Modification 2]

Would you like me to generate this adapted version?
```

---

## Document Structure Template

Follow this pattern for primary documents:

````markdown
# [Title]

## Problem Statement

[Why this matters, user research, pain points]

## Proposed Solution

[High-level approach]

---

## [Design Tokens - if applicable]

```css live
@import './styles.css';

:root {
  --custom-property: value;
}
```

---

## [Component Demo]

```jsx live
import Component from './Component.jsx';
import data from './data.json' with { type: 'json' };

function Demo() {
  return <Component data={data} />;
}
```

---

## Next Steps

- [ ] Action item 1
- [ ] Action item 2
````

**Key Elements:**
1. Problem → Solution → Live Code → Next Steps
2. Short fences that import from files (not monolithic inline code)
3. Semantic section headings
4. Prose explaining intent

---

## Clarifying Questions

When context is ambiguous, ASK instead of guessing:

### Ambiguous Scope
**User:** "Make a dashboard"  
**Ask:** "What's the dashboard's purpose? Analytics, admin panel, or monitoring? What data should it show?"

**User:** "Create a form"  
**Ask:** "What type of form? Contact, signup, checkout, or settings? Should it persist data with localStorage?"

### Ambiguous Styling
**User:** "Create a signup form"  
**Ask:** "Should this use Tailwind (quick prototype) or CSS custom properties (brandable design system)?"

### Ambiguous File Context

When user says "improve this" or "add feature X":
1. Check if they have a `.md` file open → modify primary document
2. Check if they have `.jsx` open → determine if primary-capable or dependent
3. Check if they have text selected → modify selection
4. If still ambiguous → ask which file to modify

---

## Refusal Boundaries

Reactive-md is a powerful prototyping tool with real capabilities. Refuse only when requests require infrastructure or services outside the extension's scope.

### What Reactive-MD CAN Do

- ✅ **Complex interactive UIs** - Dashboards with real data, multi-step forms, stateful components
- ✅ **Real API integration** - Fetch from actual REST APIs, handle responses, show loading states
- ✅ **Error handling** - Try/catch blocks, error states, retry logic in React components
- ✅ **Authentication UI** - Login screens, registration forms, password reset flows
- ✅ **Data persistence** - localStorage/sessionStorage for user preferences, cart state, drafts
- ✅ **Form validation** - Client-side validation, error messages, field constraints
- ✅ **Local mock API consumption** - Fetch from localhost servers (if provided separately)
- ✅ **Complex state management** - Multiple components, shared state, async operations

### Refuse: Production Infrastructure

**Triggers:**
- "Deploy this to production"
- "Set up CI/CD pipeline"
- "Add Docker containerization"
- "Configure AWS/Azure infrastructure"
- "Set up production monitoring and logging services"

**Why refuse:** Reactive-md runs in VS Code, not in production environments. It can't deploy, configure cloud services, or set up infrastructure.

**Response:**
```
🚫 Infrastructure Boundary

Reactive-md prototypes run in VS Code, not production infrastructure.

What you're asking requires:
- [Deployment platform, CI/CD, containerization, cloud services, etc.]

This prototype CAN demonstrate:
- The complete UI/UX flow
- Real API integration (if APIs are accessible)
- All interactive behavior and state management

To productionize:
1. Use this document to validate the design with stakeholders
2. Graduate to a proper project (create-react-app, vite, next.js)
3. Add infrastructure tooling (Docker, CI/CD, monitoring)

Would you like me to focus on making the prototype more complete instead?
```

---

### Refuse: Backend Implementation

**Triggers:**
- "Build a Node.js/Express backend"
- "Implement JWT authentication logic"
- "Create a database schema"
- "Write API endpoints with database persistence"
- "Add server-side validation and security"

**Why refuse:** Reactive-md is frontend-only. It can consume APIs but not implement backend services.

**Response:**
```
🚫 Backend Boundary

Reactive-md is a frontend prototyping tool. It can integrate with backends but not implement them.

What you're asking requires:
- [Backend framework, database, authentication service, etc.]

This prototype CAN demonstrate:
- UI that integrates with your real API (via fetch)
- Authentication screens (login/register forms)
- How the frontend handles API responses
- Mock data flows (using local JSON or existing mock API servers)

For backend implementation:
Use existing APIs, public mock services (jsonplaceholder, mockapi), or set up a separate mock server.

Would you like me to show how the UI integrates with an API instead?
```

---

### Refuse: Testing Infrastructure

**Triggers:**
- "Set up Jest/Vitest"
- "Write unit tests with testing-library"
- "Add E2E tests with Playwright/Cypress"
- "Configure test coverage reporting"

**Why refuse:** Reactive-md documents aren't packaged projects. They can't run test frameworks.

**Response:**
```
🚫 Testing Framework Boundary

Reactive-md documents aren't packaged projects and can't run test frameworks.

What you're asking requires:
- [Test framework, test configuration, CI integration, etc.]

This prototype CAN help with:
- Manual testing of all user flows
- Demonstrating edge cases and error states
- Validating UX with stakeholders

To add automated testing:
Graduate to a proper project with package.json and test infrastructure.

Would you like me to add more interactive demonstrations of edge cases instead?
```

---

### Caution: Complexity Without Clear Scope

**Triggers:**
- Vague requests like "make it production-ready" without specifics
- Requests for "enterprise-grade" features without defining them
- Requests that would require 1000+ lines of code

**Why caution:** These requests are ambiguous and may exceed prototyping scope.

**Response:**
```
⚠️ Scope Clarification Needed

This request is broad. Let me help narrow it down:

For "production-ready":
- Do you mean polished UI? (I can do that)
- Do you mean error handling and loading states? (I can do that)
- Do you mean deployment and infrastructure? (That's outside reactive-md)

For "enterprise features":
- Which specific features? (Authentication UI, data tables, dashboards?)
- What's the primary user flow to demonstrate?

Let's break this into:
1. Core workflow (what's the main job to be done?)
2. Essential interactions (what must work?)
3. Nice-to-haves (what can be simplified?)

What's most important to demonstrate first?
```

---

### When to Push Forward vs. Refuse

**Push forward when:**
- Request involves UI/UX, even if complex
- Request needs real API integration via fetch (remote or localhost)
- Request involves React patterns (error boundaries, suspense, context)
- Request asks for "authentication" meaning login screens
- Request needs client-side validation or error handling
- Request wants to consume from existing local mock server

**Refuse when:**
- Request needs deployment, CI/CD, or cloud infrastructure
- Request needs backend implementation (databases, auth services, mock servers)
- Request needs testing framework setup
- Request needs packages that aren't bundled or CDN-available
- Request exceeds what can be demonstrated in a prototype

**Ask for clarification when:**
- "Production-ready" (could mean polished UI or infrastructure)
- "Add authentication" (could mean UI or backend logic)
- "Real backend" (could mean fetch from API or build server)
- Ambiguous scope that could go either direction

---

### Always Refuse: Unsupported Packages

**Triggers:** User asks for `recharts`, `swr`, `@tanstack/react-query`

**Response:**
```
⚠️ Package Not Supported

[package-name] doesn't work in reactive-md due to [dependency/compatibility issues].

Alternative Approaches:
- For charts: Use native SVG or Canvas API
- For data fetching: Use native fetch() with remote APIs or mock services
- For state management: Use bundled zustand or jotai (Interactive Preview only)

Would you like me to show you how to achieve this with supported alternatives?
```

---

## Quality Standards

Good output must:

1. ✅ **Use existing recipes** - Adapt proven templates before generating from scratch
2. ✅ **Preserve design systems** - Keep Elementary/Wireframe imports from original recipes
3. ✅ **Run without errors** - Code executes in appropriate preview mode
4. ✅ **Follow conventions** - File organization, naming, import patterns match reactive-md style
5. ✅ **Respect boundaries** - Uses allowed packages, refuses infrastructure/backend requests
6. ✅ **Embrace capabilities** - Use fetch for real APIs, error handling, complex state, local servers
7. ✅ **Explain decisions** - Provide context for choices to enable faster iteration
8. ✅ **Complete structure** - Problem → Solution → Live Code → Next Steps
9. ✅ **Readable fences** - Short code blocks (< 50 lines), clear imports, semantic naming
10. ✅ **Include attribution** - Link to recipe sources when adapting existing templates

### Examples of Quality

**Good: Complex dashboard with API**
```jsx live
function Dashboard() {
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  
  React.useEffect(() => {
    fetch('https://api.example.com/metrics')
      .then(res => res.ok ? res.json() : Promise.reject('API error'))
      .then(setData)
      .catch(err => setError(err.message || String(err)))
      .finally(() => setLoading(false));
  }, []);
  
  if (loading) return <div>Loading metrics...</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>{data ? JSON.stringify(data) : 'No data'}</div>;
}

<Dashboard />
```
✅  API integration, error handling, loading states

**Good: Authentication UI with validation**
```jsx live
function LoginForm() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errors, setErrors] = React.useState({});
  
  const validate = () => {
    const errs = {};
    if (!email.includes('@')) errs.email = 'Invalid email';
    if (password.length < 8) errs.password = 'Password too short';
    return errs;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    // Call real auth API
    const res = await fetch('https://api.example.com/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    // Handle response...
  };
  
  return <form onSubmit={handleSubmit}>{/* form fields */}</form>;
}
```
✅ Client-side validation, error handling, API integration

**Bad: Refusing valid requests**
```
User: "Add error handling to this fetch call"
Agent: "⚠️ That's production code, reactive-md is just for prototypes"
```
❌ Error handling is a valid React pattern, not "production infrastructure"

**Bad: Refusing authentication UI**
```
User: "Create a login screen"
Agent: "⚠️ Authentication requires backend services, I can't help with that"
```
❌ Login screens are UI/UX, perfectly valid for reactive-md

---

## Reference Documentation

**When to dive into Level 3 (references/):**
- User needs specific code patterns or templates
- Request matches a document category (PRD, wireframe, user journey, component pattern)
- User asks "show me an example of..."
- Implementation requires detailed patterns beyond this overview

### Available References

**[Technical Patterns](references/patterns.md)** - Low-level code patterns
- State persistence with localStorage
- SVG data visualization without charting libraries
- Theme systems with CSS custom properties and light-dark()
- Remote data fetching from mock APIs
- Component extraction strategies
- Form handling with FormData
- Animation patterns with motion/react
- Icon usage with lucide-react
- JSON data loading patterns

**[PRD Templates](references/prd-templates.md)** - Product requirement documents
- Feature specifications with interactive prototypes
- User flow documentation (multi-step processes)
- Competitive analysis with side-by-side demos
- A/B test proposals with variant switching

**[Wireframes](references/wireframes.md)** - Page layouts and structure
- Landing pages (hero sections, feature grids, pricing tables)
- Dashboards (metrics, data tables)
- Onboarding flows (wizards, progress indicators)
- Settings pages (tabbed interfaces, form layouts)
- Empty states (zero data, errors, loading states)
- **Contains**: Wireframe Design System CSS classes (wf-card, wf-grid, wf-hero, etc.) and styling patterns
- **Note**: Wireframes typically use the Wireframe Design System for low-fidelity mockups

**[User Journeys](references/user-journeys.md)** - Multi-step flows
- Signup flows (registration → verification → onboarding)
- Checkout sequences (cart → shipping → payment → confirmation)
- Search-to-purchase journeys
- Support ticket flows with state tracking

**[Design Patterns](references/design-patterns.md)** - Reusable components
- Navigation patterns (navbars, sidebars, breadcrumbs, tabs)
- Data tables (sortable, filterable, paginated)
- Modal patterns (basic modals, confirmation dialogs)
- Card layouts (grid, list, masonry)
- Feedback states (loading spinners, toast notifications)
- **Contains**: Component implementation patterns and UI building blocks

**[Design Systems](references/design-systems.md)** - Token definitions and usage patterns
- **Contains**: Elementary token definitions (--c-primary, --c-text, --p-card) AND usage examples in components
- **Contains**: Correct import paths (./design-systems/elementary/tokens.css, ./design-systems/wireframe/tokens.css)
- **Contains**: Token usage patterns for themed buttons, cards, and other components
- **Use when**: Building themed components, need token names, or integrating design system styling
- System selection guide (Elementary vs Wireframe vs Tailwind)

**For AI Agents:** 
1. **Check public recipes first**: Browse [recipes repository](https://github.com/million-views/reactive-md/tree/main/recipes) for existing templates matching the job
2. **Use references for patterns**: Load reference files when adapting recipes or building from scratch
3. **Preserve design systems**: Keep Elementary/Wireframe imports from original recipes
4. **Generate recipe URLs**: Include GitHub links for user attribution and exploration

**For Humans:** 
- **Recipe Repository**: [recipes/](https://github.com/million-views/reactive-md/tree/main/recipes) - Browse complete templates by job type
- **Design Systems**: [design-systems/README.md](https://github.com/million-views/reactive-md/blob/main/recipes/design-systems/README.md) - Complete styling guide with decision framework
- **Extension Docs**: [README.md](https://github.com/million-views/reactive-md) - Installation and configuration

---

## Success Criteria

**Tagline: Literate UI/UX for Product Teams**

### JTBD Completion (Primary Success)

User has succeeded when they can:
1. **Iterate fast** - Go from idea to interactive prototype in minutes, not days
2. **Communicate visually** - Replace static mocks with executable specs that run in VS Code
3. **Collaborate async** - Share `.md` files that PMs/designers/engineers can all edit and preview
4. **Make decisions faster** - Use working prototypes to resolve debates and validate concepts
5. **Ship confident specs** - Hand off living documentation that shows exact intended behavior

### Friction Points Eliminated

The SKILL succeeds when it removes these common blockers:
- ❌ "Wait for designer to mock this up" → ✅ Adapt wireframe recipe in 2 minutes
- ❌ "Is this technically feasible?" → ✅ Build working prototype to validate
- ❌ "What did we decide in that meeting?" → ✅ Executable spec captures exact intent
- ❌ "Figma export is out of sync" → ✅ Single source of truth in version control
- ❌ "Can you show me how it works?" → ✅ Interactive demo runs on anyone's machine

### Velocity Metrics

**Target**: Complete common JTBDs in <10 minutes:
- Feature spec with working demo: 5-10 minutes
- Wireframe for new page layout: 2-5 minutes
- User flow with multi-step interaction: 10-15 minutes
- A/B test proposal with variants: 5-10 minutes
- Component pattern with live examples: 5-10 minutes

**Goal:** Make reactive-md the fastest path from product idea to shared understanding.
