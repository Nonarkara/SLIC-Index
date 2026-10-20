# AGENTS.md

> **Read [CLAUDE.md](CLAUDE.md) § "Anti-Slop Design Law" before any design or frontend work, and [ANTI-SLOP.md](ANTI-SLOP.md) for the prose source of truth.** These are Dr Non's hard rules against AI design slop: empty space is a decision, subtract before you add, the map comes first, and the page is a sequence of attention ordered by importance — not by habit.

They are **machine-enforced**, not a matter of good intentions. `npm run verify:release` fails the build on a violation, and the gate list is in CLAUDE.md. **If a gate fires, fix the design — do not edit the gate.** A gate that gets edited to go green is worse than no gate: it teaches people to route around it.

This file is the entry point for AI agents (Grok Bot, Claude, Cursor, ChatGPT, Copilot) working in this repo. Read the README for what the project is, then CLAUDE.md for the project instructions, the design system, and the anti-slop law.
