# Pull Request (PR) Guide - Ranger Med-Core

## Branch Naming
- feature/<feature-name> → New features
- bugfix/<bug-name> → Bug fixes
- hotfix/<hotfix-name> → Critical fixes

## Commit Guidelines
- All commits must be atomic (single purpose)
- Use clear commit messages: `feat: add AI assistant service`

## PR Rules
1. Open PR to `dev` branch
2. Add description of changes
3. Assign reviewers
4. Include screenshots if UI changed
5. Resolve conflicts before merge
6. Each team member should contribute equally (tasks can be tracked in project board)

## Example
1. Create a feature branch:
   git checkout -b feature/<feature-name>

2. Commit changes frequently:
   git commit -m "feat: added capsule scheduler"

3. Push your branch:
   git push origin feature/<feature-name>

4. Open a Pull Request:
   - Title should be descriptive
   - Add screenshots if UI-related
   - Reference issue numbers

5. Review Process:
   - At least 1 approval required
   - Resolve comments

6. Merge only after CI passes.