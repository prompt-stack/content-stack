# Missing Design System Files

When we converted design-system to a submodule, we lost these files that were created locally but not pushed to the design-system repository:

## Files that were in design-system/docs/:
- BACKEND-NAMING-CONVENTIONS.md
- CODEBASE-DIALECT.md
- LLM-QUICK-REFERENCE.md
- NAMING-CONVENTIONS.md

## Files that were in design-system/scripts/:
- audit-backend-naming.sh
- audit-naming.sh

These files need to be:
1. Recreated in the design-system directory
2. Committed to the design-system repository
3. Pushed to https://github.com/prompt-stack/design-system

Or alternatively:
- Remove the submodule approach
- Keep design-system as a regular directory
- Handle syncing manually when needed