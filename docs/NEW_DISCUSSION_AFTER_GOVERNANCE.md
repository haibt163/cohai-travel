# CoHai Travel — New Discussion Handover

See `docs/OMP_AUTONOMOUS_ENGINEERING_WORKFLOW.md` for the current multi-agent pipeline, model roles, context-window policy, audit trail, review authority, correction loop, and Product Owner approval gate.

See `docs/AI_ENGINEERING_WORKFLOW.md` for fresh-session and cross-agent handoff rules.

**Current working model:** Laguna S 2.1 FREE → junior/routine/scaffolding; DeepSeek V4 Flash 0731+ → primary implementation; GLM 5.3 Flash+ → backup; Nemotron 3 Ultra FREE → backup/large-context investigation; GPT-5.6-class+ → Chief Engineer; Product Owner → final green light.

**Implementation rule:** one branch/worktree per coding agent. **Read-only audit rule:** multiple agents may inspect the same clean repository.
