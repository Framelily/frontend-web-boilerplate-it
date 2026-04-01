Help create a git commit:

1. Run `git status` and `git diff --staged` to see changed files
2. If no staged files, run `git add -A` to stage all files automatically
3. Generate an English commit message using conventional commits format:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `refactor:` for refactoring
   - `style:` for styling changes
   - `docs:` for documentation
   - `test:` for adding/updating tests
   - `chore:` for maintenance tasks
4. Keep the message concise (max 72 chars for subject line)
5. Add a body if the change needs explanation (what and why, not how)
6. Show the commit message and present these choices using AskUserQuestion:
   - **1) Commit & Push** — commit and push to remote
   - **2) Commit only** — commit without pushing
   - **3) Edit message** — let the user revise the message, then show choices again
   - **4) Cancel** — abort, do nothing
7. Execute based on the user's choice
