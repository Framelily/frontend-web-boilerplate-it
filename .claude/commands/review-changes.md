Review code changes before committing:

1. Run `git diff` to see all unstaged changes, or `git diff --staged` if files are staged

2. Analyze the changes for:
   - Bugs or logic errors
   - Security vulnerabilities (XSS, exposed secrets, injection)
   - Performance issues
   - Missing error handling
   - Unused imports or variables

3. Check if changes follow project conventions (CLAUDE.md):
   - Ant Design used instead of custom components
   - styled-components for layout, Tailwind for utility spacing only
   - No `Styled` prefix on styled-components
   - React Query for data fetching (not useEffect)
   - Types in `.ts` files with explicit exports (not `.d.ts`)
   - Imports from `@/configs` (not process.env directly)
   - No `console.log` (use info/warn/error)
   - No `any` types
   - kebab-case files, PascalCase components, `I` prefix interfaces

4. Provide a summary:
   - List of issues found (if any)
   - Suggestions for improvement
   - Overall assessment (ready to commit or needs fixes)

5. If issues found, offer to auto-fix them
