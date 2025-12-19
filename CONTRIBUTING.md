# Contributing to Million Views Skills

Thank you for your interest in contributing to the Million Views Skills Marketplace! This guide will help you add new skills or improve existing ones.

---

## Before You Start

### What Makes a Good Skill?

A good Claude Agent Skill:

- **Domain-specific**: Focuses on a specific product, tool, or methodology
- **Actionable**: Provides clear patterns and examples, not just information
- **Progressive**: Uses progressive disclosure (metadata → instructions → detailed examples)
- **Boundary-aware**: Knows when to refuse requests outside its scope
- **Teachable**: Helps users understand the methodology, not just generates output

### Repository Structure

```
million-views/skills/
├── .claude-plugin/
│   └── marketplace.json          # Marketplace catalog (update when adding skills)
├── your-skill/                    # Your skill folder (kebab-case name)
│   ├── SKILL.md                   # Main skill file (required)
│   ├── LICENSE                    # MIT license (required)
│   └── references/                # Optional detailed examples
│       ├── patterns.md            # Code patterns and examples
│       ├── workflows.md           # End-to-end workflows
│       └── troubleshooting.md     # Common issues
├── README.md                      # This marketplace README
├── CONTRIBUTING.md                # You are here
└── LICENSE                        # Marketplace MIT license
```

---

## Adding a New Skill

### Step 1: Create Your Skill Folder

```bash
cd million-views/skills
mkdir your-skill-name
cd your-skill-name
```

Use **kebab-case** for folder names (e.g., `reactive-md`, `design-tokens`, `api-client`).

### Step 2: Create SKILL.md

Your skill must follow the [Agent Skills specification](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview):

```markdown
---
name: your-skill-name
description: One-line description of what the skill does
license: MIT
---

# Skill Name

[Clear introduction to the skill's purpose]

## When to Use This Skill

[Specific use cases where this skill applies]

## When NOT to Use This Skill

[Boundary conditions - what the skill refuses]

## Core Capabilities

[Main features and patterns]

## Examples

[Concrete examples of skill usage]

## Refusal Boundaries

[Specific conditions that trigger refusal]
```

**Requirements:**
- YAML frontmatter with `name`, `description`
- `license: MIT` in frontmatter
- Main content < 500 lines
- Clear use cases and boundaries
- Concrete examples

**Tips:**
- Use progressive disclosure: keep SKILL.md focused, move detailed examples to `references/`
- Be specific about when to refuse (e.g., "Don't generate production code")
- Include anti-patterns (what NOT to do)
- Teach the methodology, don't just describe it

### Step 3: Add LICENSE File

```bash
cp ../reactive-md/LICENSE ./LICENSE
```

All skills must use the MIT license.

### Step 4: Add Optional References

If your skill has detailed examples, create a `references/` folder:

```bash
mkdir references
```

**Common reference files:**
- `patterns.md` - Code patterns and examples
- `workflows.md` - End-to-end workflows
- `troubleshooting.md` - Common issues and solutions
- `api-reference.md` - API or CLI reference

### Step 5: Update marketplace.json

Add your skill to `.claude-plugin/marketplace.json`:

```json
{
  "plugins": [
    {
      "name": "your-skill-name",
      "source": "./your-skill-name",
      "description": "One-line description matching SKILL.md",
      "version": "1.0.0",
      "category": "productivity",
      "keywords": ["keyword1", "keyword2", "keyword3"],
      "strict": false,
      "agents": ["./your-skill-name/SKILL.md"]
    }
  ]
}
```

**Categories:**
- `productivity` - Workflow tools
- `development` - Developer tools
- `design` - Design systems and UI tools
- `documentation` - Documentation tools
- `testing` - Testing and QA tools

### Step 6: Test Your Skill

Before submitting, test your skill:

1. **Format validation**: Check YAML frontmatter is valid
2. **Length check**: Main SKILL.md should be < 500 lines
3. **Clarity test**: Can someone unfamiliar with your tool understand it?
4. **Boundary test**: Does it refuse inappropriate requests?

### Step 7: Update Marketplace README

Add your skill to the "Available Skills" section in `README.md`:

```markdown
### [your-skill-name](./your-skill-name/)

**Category**: Productivity  
**Version**: 1.0.0

[One-line description]

**Use it for:**
- Use case 1
- Use case 2
- Use case 3

**Requires**: [Any dependencies or extensions]

[Read full skill documentation →](./your-skill-name/SKILL.md)
```

### Step 8: Submit Pull Request

```bash
git checkout -b add-your-skill-name
git add your-skill-name/ .claude-plugin/marketplace.json README.md
git commit -m "feat: add your-skill-name skill"
git push origin add-your-skill-name
```

Then create a pull request with:
- **Title**: `feat: add [skill-name] skill`
- **Description**: What the skill does and why it's useful
- **Testing**: How you tested it

---

## Improving Existing Skills

### Small Fixes (Typos, Clarity)

1. Fork the repository
2. Make your changes
3. Submit a pull request with description of what you fixed

### Pattern Additions

If you have new patterns or examples:

1. Add to `references/patterns.md` (not main SKILL.md)
2. Keep main SKILL.md focused and < 500 lines
3. Link from SKILL.md if appropriate

### Boundary Refinements

If you discover the skill accepts/refuses incorrectly:

1. Update "When to Use" / "When NOT to Use" sections
2. Add examples of the edge case
3. Explain the reasoning in your PR

---

## Skill Quality Guidelines

### Progressive Disclosure

**Level 1 (Metadata)**: Name, description, when to use
**Level 2 (Main SKILL.md)**: Core patterns, key examples, boundaries
**Level 3 (references/)**: Detailed examples, complete workflows, troubleshooting

**Good:**
```
SKILL.md (400 lines):
- When to use
- Core patterns
- Key examples
- Refusal boundaries

references/patterns.md (unlimited):
- 20+ detailed code examples
- Complete component library
- API reference
```

**Bad:**
```
SKILL.md (800 lines):
- Everything stuffed in one file
- Overwhelming detail upfront
- Claude loads too much context
```

### Specificity Over Generality

**Good:**
```markdown
## When to Use This Skill

Use reactive-md for:
- Product specs with interactive prototypes
- Design system component documentation
- User flow wireframes with state management

DON'T use for:
- Production-ready applications
- Complex backend integration
- Testing and deployment
```

**Bad:**
```markdown
## When to Use This Skill

Use this skill when you need help with frontend development.
```

### Examples Over Descriptions

**Good:**
```markdown
## Loading Data

JSON imports work in both preview modes:

```jsx live
import products from './data.json' with { type: 'json' };

function ProductList() {
  return products.map(p => <div key={p.id}>{p.name}</div>);
}
```

Fetch APIs require Interactive Preview:

```jsx live
function PostsList() {
  const [posts, setPosts] = React.useState([]);
  React.useEffect(() => {
    fetch('https://api.example.com/posts')
      .then(r => r.json())
      .then(setPosts);
  }, []);
  return posts.map(p => <div key={p.id}>{p.title}</div>);
}
```
```

**Bad:**
```markdown
## Loading Data

You can load data using JSON imports or fetch APIs. Both work but have different use cases.
```

---

## Review Process

### What We Look For

1. **Clarity**: Can users understand the skill without prior knowledge?
2. **Boundaries**: Does it know when to refuse?
3. **Examples**: Are there concrete, runnable examples?
4. **Length**: Is SKILL.md < 500 lines?
5. **License**: MIT license present?
6. **Consistency**: Does it follow existing skill patterns?

### Review Timeline

- **Small fixes**: 1-2 days
- **New skills**: 3-7 days (more thorough review)
- **Breaking changes**: Requires discussion first

---

## Getting Help

### Questions About Contributing

- [GitHub Discussions](https://github.com/million-views/skills/discussions) - Ask questions
- [Existing Skills](./reactive-md/) - See examples

### Questions About Agent Skills Spec

- [Anthropic Agent Skills Documentation](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- [Agent Skills Best Practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)

---

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).

Be respectful, constructive, and helpful. We're all here to make better tools.

---

**Ready to contribute?** Pick a skill to improve or create a new one! 🚀
