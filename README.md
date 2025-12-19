# Where AI learns to do more

Agent Skills for Million Views products and tools. Each skill provides domain-specific expertise that extends AI agents' capabilities for specific workflows, tools, and methodologies.

---

## Available Skills

### [reactive-md](./reactive-md/)

**Category**: Productivity  
**Version**: 1.0.0

Create functional markdown documents for product collaboration - live specs, interactive prototypes, and design system documentation using the Reactive MD VS Code extension.

[Read skill documentation →](./reactive-md/SKILL.md)

---

## Adding Skills

As we develop more tools and establish consistent methodologies, skills can be added to this marketplace. Each skill should focus on a specific product or workflow, provide clear patterns and examples, and know when to refuse requests outside its scope.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

---

## Installation

### For Claude Code Users

```bash
# Add this marketplace
/plugin marketplace add million-views/skills

# Install specific skills
/plugin install reactive-md@million-views-skills
/plugin install another-skill@million-views-skills
```

### For Other AI Agents (VS Code, etc.)

While Agent Skills are natively understood by Claude Code, they can be used with other AI agents in different environments. For example, in VS Code with GitHub Copilot or other AI assistants, reference skill folders in your workspace's `AGENTS.md` file:

```markdown
# AGENTS.md

## Available Skills

- [Reactive MD Skill](./path/to/skills/reactive-md/) - Create functional markdown documents
- [Another Skill](./path/to/skills/another-skill/) - Description of another skill
```

The AI agent can then read each skill's SKILL.md and references/ to understand the methodology and patterns.

---

## Using Skills

Skills are automatically activated when the AI agent recognizes your request matches a skill's domain. You don't need to explicitly invoke them.

**Example requests:**

```
Create a reactive-md spec for a dark mode toggle
```

```
Use [skill-name] to [accomplish task]
```

The agent will:
1. Recognize the request relates to a specific skill
2. Load the skill's instructions
3. Apply the skill's patterns and best practices
4. Know when to refuse requests outside the skill's scope

---

## About Agent Skills

[Agent Skills](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) are modular capabilities that extend Claude's expertise in specific domains. They use progressive disclosure:

1. **Level 1 (Metadata)**: Claude loads skill name, description, and when to use it
2. **Level 2 (Instructions)**: When relevant, Claude loads the full SKILL.md instructions
3. **Level 3 (Reference)**: Detailed examples and patterns in `references/` folder

**Benefits:**
- ✅ Consistent methodology across conversations
- ✅ Domain-specific expertise without repetitive prompting
- ✅ Composable with other skills
- ✅ Version controlled and shareable

---

## Support

### Skill-Specific Issues

Each skill has its own documentation and troubleshooting:
- [reactive-md skill](./reactive-md/)

### Product/Extension Issues

For issues with the underlying products:
- [Reactive MD Extension Issues](https://github.com/million-views/reactive-md/issues)

---

## License

All skills in this marketplace are licensed under the [MIT License](./LICENSE).

Individual skills may have additional licensing information in their respective folders.

---

## About Million Views

[Million Views](https://m5nv.com) is a research and product development firm exploring ideas worth pursuing.

**Projects:**
- [Reactive MD VS Code Extension](https://marketplace.visualstudio.com/items?itemName=million-views.reactive-md)
