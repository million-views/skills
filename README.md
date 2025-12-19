# Million Views Skills Marketplace

Claude Agent Skills for Million Views products and tools. This marketplace provides domain-specific expertise that extends Claude's capabilities for product development, design systems, and interactive documentation.

---

## Available Skills

### [reactive-md](./reactive-md/)

**Category**: Productivity  
**Version**: 1.0.0

Create functional markdown documents for product collaboration - live specs, interactive prototypes, and design system documentation.

**Use it for:**
- Product specs with working prototypes
- Design system documentation with live examples
- User flow wireframes with interactive demos
- Feature proposals with visual concepts
- A/B test mockups with real interactivity

**Requires**: [Reactive MD VS Code Extension](https://marketplace.visualstudio.com/items?itemName=million-views.reactive-md)

[Read full skill documentation →](./reactive-md/SKILL.md)

---

## Installation

### For Claude Code Users

```bash
# Add this marketplace
/plugin marketplace add million-views/skills

# Install the reactive-md skill
/plugin install reactive-md@million-views-skills
```

### For Other AI Agents (VS Code, etc.)

While Agent Skills are natively understood by Claude Code, they can be used by other AI agents in different environments. For example, in VS Code with GitHub Copilot or other AI assistants, reference the skill folder in your workspace's `AGENTS.md` file:

```markdown
# AGENTS.md

## Available Skills

- [Reactive MD Skill](./path/to/skills/reactive-md/) - Create functional markdown documents for product collaboration
```

The AI agent can then read the skill's SKILL.md and references/ to understand the methodology and patterns.

---

## Using Skills

Skills are automatically activated when Claude recognizes your request matches the skill's domain. You don't need to explicitly invoke them.

**Example requests:**

```
"Create a reactive-md spec for a dark mode toggle"
```

```
"Prototype a checkout flow with cart persistence"
```

```
"Generate a design system color tokens reference"
```

Claude will:
1. Recognize the request relates to reactive-md
2. Load the skill's instructions
3. Generate appropriate reactive-md documents
4. Follow the skill's best practices and patterns

---

## About Agent Skills

[Agent Skills](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) are modular capabilities that extend Claude's expertise in specific domains. Skills use progressive disclosure:

1. **Level 1 (Metadata)**: Claude loads skill name, description, and when to use it
2. **Level 2 (Instructions)**: When relevant, Claude loads the full SKILL.md instructions
3. **Level 3 (Reference)**: Detailed examples and patterns in `references/` folder

**Benefits:**
- ✅ Consistent methodology across conversations
- ✅ Domain-specific expertise without repetitive prompting
- ✅ Composable with other skills
- ✅ Version controlled and shareable

---

## Internal Development

This marketplace is maintained internally by Million Views for our product team. If you're part of the team and need to:
- Add a new skill for a Million Views product
- Update existing skill patterns
- Improve documentation

See [CONTRIBUTING.md](./CONTRIBUTING.md) for internal guidelines.

---

## Support

### For Skill-Specific Issues

Each skill has its own documentation:
- [reactive-md skill documentation](./reactive-md/)

### For Extension Issues

If you encounter issues with the underlying VS Code extensions:
- [Reactive MD Extension](https://github.com/million-views/reactive-md/issues)

### For Marketplace Issues

For problems with the marketplace itself:
- [GitHub Issues](https://github.com/million-views/skills/issues)
- [GitHub Discussions](https://github.com/million-views/skills/discussions)

---

## License

All skills in this marketplace are licensed under the [MIT License](./LICENSE).

Individual skills may have additional licensing information in their respective folders.

---

## About Million Views

[Million Views](https://m5nv.com) builds tools for product teams who believe in rapid iteration and living documentation. Our extensions and skills help teams move from static specs to interactive prototypes without leaving their development environment.

**Other Million Views Projects:**
- [Reactive MD VS Code Extension](https://marketplace.visualstudio.com/items?itemName=million-views.reactive-md)
- [Product Documentation](https://m5nv.com/docs)

---

**Ready to try?** Install the marketplace and start creating live documents! 🚀
