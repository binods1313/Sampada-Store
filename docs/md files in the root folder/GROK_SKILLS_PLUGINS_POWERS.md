# Grok — Skills, Plugins & Powers

**Project:** Sampada-Store  
**Saved:** 2026-07-12  
**Source:** Answers to two session questions about Grok capabilities  

---

## Question 1 — What skills, plugins, and powers do you possess?

### Skills (specialized playbooks)

#### Design / brand / UI

| Skill | Use for |
|--------|---------|
| **ckm-banner-design** | Social/ad/hero/print banners |
| **ckm-brand** | Brand voice, identity, consistency |
| **ckm-design** | Logos, CIP, mockups, banners, icons, social visuals |
| **ckm-design-system** | Tokens, component specs, slides |
| **ckm-slides** | HTML presentations (Chart.js, tokens) |
| **ckm-ui-styling** | shadcn/ui + Tailwind, accessible UI |
| **ui-ux-pro-max** | UI/UX systems across React/Next/Vue/etc. |
| **frontend-design** | Distinctive visual UI direction |

#### Docs / data / media

| Skill | Use for |
|--------|---------|
| **docx** | Word documents |
| **pptx** | PowerPoint decks |
| **xlsx** | Spreadsheets / CSV |
| **imagine** | Image gen/edit guidance (Aurora) |

#### Engineering workflow

| Skill | Use for |
|--------|---------|
| **brainstorming** | Explore before building |
| **writing-plans** | Implementation plans |
| **executing-plans** / **execute-plan** | Run multi-step plans |
| **subagent-driven-development** | Parallel task agents |
| **dispatching-parallel-agents** | Split independent work |
| **using-git-worktrees** | Isolated feature branches |
| **test-driven-development** | Tests first |
| **systematic-debugging** | Structured bugfix |
| **verification-before-completion** | Prove it works before claiming done |
| **check-work** | Verify builds/tests/diffs |
| **review** / **requesting-code-review** / **receiving-code-review** | Code review loops |
| **finishing-a-development-branch** | Merge / PR / cleanup |
| **pr-babysit** | CI, reviews, stack PRs |
| **design** | Design docs + PR plan |
| **build-with-ai** | Wire LLM features (SpaceXAI default) |
| **create-skill** / **writing-skills** | Author new skills |
| **help** | Grok TUI / config / MCP help |
| **resume-claude** | Continue a Claude Code session |

---

### Core powers (tools)

- **Codebase:** read/edit files, search, list dirs, run shell commands  
- **Git / GitHub-style work:** diffs, commits (when asked), PR workflows via skills  
- **Web:** search, open pages, fetch docs  
- **X (Twitter):** search users/posts/threads  
- **Images:** generate (`image_gen`), edit (`image_edit`), animate (`image_to_video` / `reference_to_video`)  
- **Agents:** spawn explore/plan/general subagents, parallel tasks, background monitors  
- **Scheduling:** recurring prompts  
- **MCP:** discover/call connected integration tools (e.g. tasks server)  
- **Planning mode:** enter/exit plan mode for ambiguous builds  

---

### What Grok is optimized for in Sampada-Store

In **Sampada-Store** specifically: Next.js store UI, navbar/brand assets, Tailwind/shadcn patterns, Sanity-related structure, local fixes, and handoffs for the other coder to push to GitHub.

---

### Limits (honest)

- Will not claim capabilities outside tools/skills (e.g. silent push without instruction, real production deploys not set up).  
- Criminal / exploit / malware work is blocked.  
- Some skills only apply when the task matches (e.g. pptx only for presentations).  

---

## Question 2 — If required, can you add skills or plugins to do the required job?

**Yes — when the job needs it**, Grok can extend how it works. What’s possible vs what needs the user:

### Skills — yes, can add them

Grok can **create or update project skills** (e.g. under `.agents/skills/` or via the create-skill flow):

- Custom **SKILL.md** playbooks for the workflow  
- Steps, conventions, scripts, checklists  
- Tuned for Sampada (navbar, brand, Sanity, deploy handoff, etc.)  

**Use when:** the same job will repeat and you want consistent quality without re-explaining.

**Example:**  
“Always hand off cart/UI changes as a 2-file push list for the other coder.”

---

### Plugins / integrations — partly

| Type | Can Grok add it? |
|------|------------------|
| **Project skills** | Yes — create/edit in the repo |
| **npm packages** (app deps) | Yes — with care; confirm for big/shared deps |
| **MCP servers** (Linear, Slack, etc.) | Only if the user configures/connects them in Grok; then Grok can use them |
| **VS Code / IDE plugins** | No — the user installs those; Grok can recommend which |
| **Global Grok marketplace plugins** | Usually the **user** installs/enables; Grok can’t silently install platform plugins |

---

### What does **not** need a skill

Most one-off work (fix icon, edit navbar, debug config) is already covered by tools + existing skills. New skills are for **repeatable** or **team-standard** jobs.

---

### Practical rule

1. **Do the job** with current tools/skills if enough.  
2. If the same process keeps repeating → **propose a small skill** and write it.  
3. If an external app is needed (GitHub issues, design tool API) → **user connects MCP/plugin**; then Grok uses it.  

**Offer:** If a recurring job matters most (e.g. “always brand-safe UI + push handoff”), draft a **Sampada skill** for it.

---

## Related docs

- `docs/SKILLS_AND_AGENTS_REGISTRY.md` — project agents/skills registry  
- `.agents/skills/` — local design/UI skills for this repo  

---

*End of saved responses.*
