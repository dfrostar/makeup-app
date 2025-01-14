# Git Workflow Guide

## Branch Strategy

### Main Branches
- `main` - Production code
- `develop` - Development code
- `staging` - Pre-production testing

### Feature Branches
```bash
feature/feature-name
bugfix/bug-description
hotfix/urgent-fix
release/version-number
```

## Workflow Steps

### 1. Starting New Work

```bash
# Update main branch
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/new-feature

# Push branch to remote
git push -u origin feature/new-feature
```

### 2. Daily Development

```bash
# Get latest changes
git pull origin develop

# Stage changes
git add .

# Create commit
git commit -m "feat: add new feature"

# Push changes
git push origin feature/new-feature
```

### 3. Preparing for Pull Request

```bash
# Ensure tests pass
npm run test

# Run linter
npm run lint

# Update branch with latest changes
git checkout develop
git pull origin develop
git checkout feature/new-feature
git rebase develop
```

### 4. Creating Pull Request

```bash
# Push final changes
git push origin feature/new-feature -f

# Create PR on GitHub
# Follow PR template
# Request reviews
```

## Commit Message Convention

### Format
```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

### Examples
```bash
feat(auth): add user authentication
fix(api): handle null response
docs(readme): update installation steps
style(lint): apply prettier formatting
```

## Branch Naming Convention

### Format
```
<type>/<description>
```

### Types
- `feature`: New feature
- `bugfix`: Bug fix
- `hotfix`: Urgent fix
- `release`: Version release
- `docs`: Documentation

### Examples
```bash
feature/user-profile
bugfix/login-error
hotfix/security-patch
release/1.2.0
docs/api-guide
```

## Pull Request Process

### 1. PR Template
```markdown
## Description
[Description of changes]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual testing

## Checklist
- [ ] Code follows style guide
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] PR title follows convention
```

### 2. Review Process
1. Submit PR
2. Request reviews
3. Address feedback
4. Update branch if needed
5. Get approvals
6. Merge PR

## Release Process

### 1. Create Release Branch
```bash
git checkout develop
git pull origin develop
git checkout -b release/1.2.0
```

### 2. Prepare Release
```bash
# Update version
npm version 1.2.0

# Run tests
npm run test

# Build documentation
npm run docs
```

### 3. Merge to Main
```bash
git checkout main
git merge release/1.2.0
git tag v1.2.0
git push origin main --tags
```

## Hotfix Process

### 1. Create Hotfix Branch
```bash
git checkout main
git checkout -b hotfix/critical-bug
```

### 2. Fix and Test
```bash
# Make fixes
git commit -m "fix: critical bug"

# Run tests
npm run test
```

### 3. Merge to Main and Develop
```bash
# Merge to main
git checkout main
git merge hotfix/critical-bug
git tag v1.2.1

# Merge to develop
git checkout develop
git merge hotfix/critical-bug

# Push changes
git push origin main --tags
git push origin develop
```

## Best Practices

### 1. Commits
- Write clear commit messages
- Keep commits focused
- Commit often
- Squash when needed

### 2. Branches
- Keep branches up to date
- Delete old branches
- Use descriptive names
- Branch from correct base

### 3. Pull Requests
- Keep PRs small
- Write clear descriptions
- Link related issues
- Request appropriate reviewers

### 4. Code Review
- Review thoroughly
- Provide constructive feedback
- Address all comments
- Approve when satisfied

## Troubleshooting

### 1. Merge Conflicts
```bash
# Get latest changes
git fetch origin

# Rebase on target branch
git rebase origin/develop

# Resolve conflicts
git add .
git rebase --continue

# Force push if needed
git push origin feature/name -f
```

### 2. Reset Changes
```bash
# Soft reset (keep changes staged)
git reset --soft HEAD~1

# Hard reset (discard changes)
git reset --hard HEAD~1

# Reset to remote
git reset --hard origin/branch-name
```

### 3. Stash Changes
```bash
# Stash changes
git stash

# List stashes
git stash list

# Apply stash
git stash apply

# Pop stash
git stash pop
```

## Tools and Integration

### 1. Git Hooks
```bash
# Pre-commit hook
#!/bin/sh
npm run lint
npm run test
```

### 2. CI/CD Integration
```yaml
# GitHub Actions example
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm test
```

## Additional Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Flow Guide](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Actions](https://docs.github.com/en/actions)
