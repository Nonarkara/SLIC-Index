# AGENTS.md

> **Read [CLAUDE.md](CLAUDE.md) § "Anti-Slop Design Law" before any design or frontend work, and [ANTI-SLOP.md](ANTI-SLOP.md) for the prose source of truth.** These are Dr Non's hard rules against AI design slop: empty space is a decision, subtract before you add, the map comes first, and the page is a sequence of attention ordered by importance — not by habit.

They are **machine-enforced**, not a matter of good intentions. `npm run verify:release` fails the build on a violation, and the gate list is in CLAUDE.md. **If a gate fires, fix the design — do not edit the gate.** A gate that gets edited to go green is worse than no gate: it teaches people to route around it.

**Spatial hallucination is also slop.** An interface that invents a reason for things to occupy space — instead of arranging them around how people read, choose and act — fails the same test, whether or not it looks composed. Ask of every element: *why is this here, why this size, and why this far from that?* "The grid put it there" is not an answer. `npm run check:spatial` measures this in a real browser across 15 routes × 3 widths: dead bands, orphan rows, accidental wrapping, clipped text, scattered actions, false hierarchy, and the cost of the first decision. See CLAUDE.md § "Spatial hallucination".

This file is the entry point for AI agents (Grok Bot, Claude, Cursor, ChatGPT, Copilot) working in this repo. Read the README for what the project is, then CLAUDE.md for the project instructions, the design system, and the anti-slop law.
