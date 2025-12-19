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

### For Claude.ai Users (Pro, Max, Team, Enterprise)

1. Download the skill package: `reactive-md.zip`
2. Go to Settings > Features
3. Upload the skill zip file
4. The skill is now available in your conversations

### For Claude API Users

```bash
# Upload the skill (one-time)
curl -X POST https://api.anthropic.com/v1/skills \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: skills-2025-10-02" \
  -F "file=@reactive-md.zip"

# Use in API requests
curl -X POST https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
  --data '{
    "model": "claude-sonnet-4-20250514",
    "container": {
      "type": "code_execution",
      "skill_id": "reactive-md"
    },
    "messages": [...]
  }'
```

See [Claude Skills API documentation](https://platform.claude.com/docs/en/build-with-claude/skills-guide) for details.

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

## Contributing

We welcome contributions! Whether it's:
- Bug fixes in existing skills
- New skills for Million Views products
- Improved documentation and examples
- Pattern refinements

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

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
