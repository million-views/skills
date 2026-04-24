---
title: Competitive Analysis Recipe
status: reference
instruction: "Structure the document conclusion-first: the executive summary leads with the verdict — do not build to it. Then: score matrix (import ComparisonMatrix.jsx), competitor profiles (import CompetitorCard.jsx), feature comparison (import FeatureMatrix.jsx with ✓ / ◑ / — three-state values), numbered insights with implication framing, and a recommendation as a time-boxed checklist. Never recreate the sidecar components inline. The document must make a call, not just show data."
---

# Competitive Analysis: [Market / Category Name]

> **Pattern note**: Competitive analysis is **conclusion-first**. The executive summary leads with the verdict. The rest of the document is the evidence. A reader who only reads the summary should walk away knowing where you stand and what to do next.

---

## Executive Summary

[2–3 sentences. State the verdict immediately: who leads, who is gaining, where your gaps are, what the strategic response should be. This is not a teaser — it is the full argument compressed.]

**Example**: We analyzed four players in the async-collaboration space. Our platform scores highest on feature depth and API access, but Competitor A is gaining SMB traction with a simpler product at lower cost. The strategic response is a starter tier and an accelerated mobile roadmap — not more features.

---

## Score Matrix

One number per competitor. Make the relative position unmistakable.

```tsx live id="score-matrix"
import ComparisonMatrix from './ComparisonMatrix.tsx';

export function ScoreMatrix() {
  const competitors = [
    { name: 'Our Product',  score: 85, highlight: true  },
    { name: 'Competitor A', score: 70, highlight: false },
    { name: 'Competitor B', score: 65, highlight: false },
    { name: 'Competitor C', score: 52, highlight: false },
  ];

  return <ComparisonMatrix data={competitors} title="Feature depth score (out of 100)" />;
}
```

**Design decisions:**
- **Single aggregate score per competitor**: Forces a ranking. Composite scores hide disagreement; a single number forces the author to decide what matters most. Document the weighting in a footnote if stakeholders will challenge it.
- **Our product highlighted**: Readers scan for "us" first. Make it effortless.

---

## Competitor Profiles

One card per competitor. Strengths and weaknesses in plain language — not feature lists.

```tsx live id="competitor-profiles"
import CompetitorCard from './CompetitorCard.tsx';

export function CompetitorProfiles() {
  const profiles = [
    {
      name: 'Our Product',
      score: 85,
      highlight: true,
      strengths: [
        'Best-in-class API depth with webhooks and SDK',
        'Enterprise security: SOC 2, SSO, audit logs',
        'Most extensive analytics and custom dashboards',
      ],
      weaknesses: [
        'Web-only — no native iOS/Android app',
        'Higher price point limits SMB adoption',
      ],
      pricing: '$79/seat/month',
    },
    {
      name: 'Competitor A',
      score: 70,
      highlight: false,
      strengths: [
        'Native mobile apps (iOS + Android)',
        'Simple onboarding — live in under 10 minutes',
        'Aggressive SMB pricing',
      ],
      weaknesses: [
        'No API or webhooks',
        'Basic analytics only',
        'No SSO or enterprise security tier',
      ],
      pricing: '$29/seat/month',
    },
    {
      name: 'Competitor B',
      score: 65,
      highlight: false,
      strengths: [
        'Strong offline mode',
        'Good mobile experience',
      ],
      weaknesses: [
        'Limited integrations',
        'No real-time collaboration',
      ],
      pricing: '$49/seat/month',
    },
    {
      name: 'Competitor C',
      score: 52,
      highlight: false,
      strengths: [
        'Lowest price in the market',
        'Good cloud storage integration',
      ],
      weaknesses: [
        'No API access',
        'No AI features',
        'Weak enterprise support',
      ],
      pricing: '$15/seat/month',
    },
  ];

  return (
    <div className="grid @md:grid-cols-2 gap-4 p-2">
      {profiles.map(p => (
        <CompetitorCard key={p.name} {...p} />
      ))}
    </div>
  );
}
```

**Design decisions:**
- **Strengths and weaknesses as sentences, not keywords**: "No native iOS/Android app" is a real statement. "Mobile" is not. Write what a decision-maker needs to relay to their leadership, not a tag cloud.
- **Grid layout**: Two-column at container `@md` breakpoint. Competitors are compared, not ranked — side-by-side scanning is the natural motion.

---

## Feature Comparison

Row per capability. Column per competitor. Three states: ✓ (full), ◑ (partial), — (absent).

```tsx live id="feature-matrix"
import FeatureMatrix from './FeatureMatrix.tsx';

export function Features() {
  // Column order here defines value order in every feature row
  const columns = [
    { label: 'Us',     highlight: true  },
    { label: 'Comp A'                   },
    { label: 'Comp B'                   },
    { label: 'Comp C'                   },
  ];

  // values: SupportLevel[] — positional, matches column order above
  // SupportLevel: 'full' | 'partial' | 'none'
  const categories = [
    {
      label: 'Core',
      features: [
        { name: 'Real-time collaboration',  values: ['full', 'full',    'partial', 'none'   ] },
        { name: 'Mobile app (iOS/Android)', values: ['none', 'full',    'full',    'partial'] },
        { name: 'Offline mode',             values: ['partial', 'none', 'full',    'none'   ] },
      ],
    },
    {
      label: 'Enterprise',
      features: [
        { name: 'SSO / SCIM',    values: ['full', 'partial', 'none', 'none'] },
        { name: 'Audit logs',    values: ['full', 'none',    'none', 'none'] },
        { name: 'API + webhooks', values: ['full', 'full',   'partial', 'none'] },
      ],
    },
    {
      label: 'Analytics',
      features: [
        { name: 'Custom dashboards',      values: ['full', 'none',    'none',    'none'] },
        { name: 'Usage analytics',        values: ['full', 'partial', 'partial', 'none'] },
        { name: 'AI-powered suggestions', values: ['full', 'full',    'full',    'none'] },
      ],
    },
  ];

  return <FeatureMatrix columns={columns} categories={categories} />;
}
```

**Design decisions:**
- **Three-state legend (✓ / ◑ / —)**: Binary yes/no hides important nuance (partial implementations). Three states is the minimum that captures the real competitive picture without becoming subjective.
- **Grouped by category**: Category grouping lets a reader skim to the dimension they care about. Flat lists are scannable but lose the "where does it matter most" signal.

---

## Key Insights

Write 3–5 numbered insights. Each insight: **observation** (what the data shows) + **implication** (what it means for strategy). No bullet lists of features — those belong in the matrix above.

1. **[Competitor A] is winning on price in SMB**: [X]% of churn last quarter cited cost. We're not losing on features — we're losing on the buy decision before evaluation begins.
2. **Mobile is a hard gap**: All three competitors have native apps. Our web-only approach limits field sales and customer success workflows — roles that are growing, not shrinking.
3. **Enterprise is our moat**: No competitor matches our API depth + audit infrastructure. This is why we retain large accounts even when cost is raised. Lean into it.

---

## Our Strategic Advantages

Enumerate strengths that will not change in the next 12 months. These are the basis of differentiation, not just "better features."

- **[Advantage 1]**: Why it creates durable value.
- **[Advantage 2]**: Why it is hard to replicate.

---

## Recommendation

Concrete. Prioritized. Time-boxed. A reviewer should be able to say yes or no to each item without a follow-up meeting.

- [ ] **[Action 1]** *(Q[n])*: [What, and why it moves the needle.]
- [ ] **[Action 2]** *(Q[n+1])*: [What, and the constraint it addresses.]
- [ ] **[Action 3]** *(ongoing)*: [What to stop doing or deprioritize.]

**Design decisions:**
- **Checkboxes, not bullets**: The recommendation is a decision list, not an observation. Checkboxes signal that someone should own each item.
- **Time-boxed**: Undated recommendations are wishes. Quarters force prioritization.

---
*Created with [Reactive MD](https://marketplace.visualstudio.com/items?itemName=million-views.reactive-md)*
