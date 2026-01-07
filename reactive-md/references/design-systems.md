# Design System Integration Reference

**CRITICAL**: Never generate design system CSS from assumptions. Always fetch from canonical sources.

## Fetching Design Systems

Before using any design system patterns, fetch the actual CSS files from the public repository:

**Canonical Source**: `https://github.com/million-views/reactive-md/tree/main/recipes/design-systems`

**Available Systems:**
1. **Wireframe Design System** - Low-fidelity structural mockups
   - Tokens: `recipes/design-systems/wireframe/tokens.css`
   - Classes: `recipes/wireframes/wireframe.css`
   - Use for: Early exploration, structural communication

2. **Elementary Design System** - High-fidelity themeable components
   - Tokens: `recipes/design-systems/elementary/tokens.css`
   - Use for: Polished demos, themeable UIs, dark mode support

3. **Tailwind CSS** - Utility-first styling
   - Loaded via CDN (no fetch needed)
   - Use for: Quick prototypes, one-off examples

## Fetch Workflow

```bash
# Fetch design system files
curl -o design-systems/wireframe/tokens.css \
  https://raw.githubusercontent.com/million-views/reactive-md/main/recipes/design-systems/wireframe/tokens.css

curl -o design-systems/elementary/tokens.css \
  https://raw.githubusercontent.com/million-views/reactive-md/main/recipes/design-systems/elementary/tokens.css

curl -o wireframes/wireframe.css \
  https://raw.githubusercontent.com/million-views/reactive-md/main/recipes/wireframes/wireframe.css
```

Once fetched, use `@import` statements in your markdown:

```css live
@import './design-systems/elementary/tokens.css';
```

## System Selection Guide

Choose styling approach based on use case:

### Use Wireframe System When:
- Early-stage wireframes or low-fidelity mockups
- Structural communication without visual polish
- Speed is priority, aesthetics are secondary

```jsx live
function WireframeCard() {
  return (
    <div className="wf-card">
      <h3 className="title">Card Title</h3>
      <p className="description">Description</p>
    </div>
  );
}
```

### Use Elementary System When:
- High-fidelity feature demos
- Themeable components (light/dark mode)
- Brand-specific prototypes
- Polished visual communication

```jsx live
function ThemedCard() {
  return (
    <div style={{ 
      padding: 'var(--p-card)', 
      background: 'var(--bg-surface)',
      color: 'var(--c-text)',
      borderRadius: 'var(--r-card)'
    }}>
      <h3>Card Title</h3>
      <p>Description</p>
    </div>
  );
}
```

### Use Tailwind CSS When:
- Quick throwaway prototypes
- No theming requirements
- Speed is absolute priority

```jsx live
function TailwindCard() {
  return (
    <div className="p-4 bg-white border rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-2">Card Title</h3>
      <p className="text-gray-600">Description</p>
    </div>
  );
}
```

## Documentation Links

- Elementary Design System: https://github.com/million-views/reactive-md/tree/main/recipes/design-systems/elementary
- Wireframe Design System: https://github.com/million-views/reactive-md/tree/main/recipes/design-systems/wireframe
- Design Systems Overview: https://github.com/million-views/reactive-md/blob/main/recipes/design-systems/README.md
