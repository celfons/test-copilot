# CI/CD Pipeline Documentation

## Overview

This project uses GitHub Actions for Continuous Integration and Continuous Deployment (CI/CD). The pipeline ensures code quality, test coverage, and successful builds before merging to the main branch.

## Workflow: Run Tests

**File**: `.github/workflows/test.yml`

### Trigger Events

The workflow runs automatically on:
- **Pull Requests** targeting the `main` branch
- **Push events** to the `main` branch

### Jobs

#### 1. Test Job
Runs unit tests and code quality checks.

**Steps**:
1. **Checkout Code** - Checks out the repository code
2. **Setup Node.js** - Installs Node.js v20 with npm caching
3. **Install Dependencies** - Runs `npm ci` for clean install
4. **Run Linter** - Executes ESLint to check code quality
5. **Run Tests** - Executes all unit tests (76 tests)
6. **Run Coverage** - Generates code coverage report
7. **Upload Coverage** - Optionally uploads to Codecov (requires token)

**Success Criteria**:
- ✅ Linting passes (no ESLint errors)
- ✅ All 76 tests pass
- ✅ Coverage report generated successfully

#### 2. Build Job
Compiles TypeScript and validates build artifacts.

**Dependencies**: Runs only after `test` job succeeds

**Steps**:
1. **Checkout Code** - Checks out the repository code
2. **Setup Node.js** - Installs Node.js v20 with npm caching
3. **Install Dependencies** - Runs `npm ci` for clean install
4. **Build TypeScript** - Compiles TS to JS using `npm run build`
5. **Check Artifacts** - Verifies `dist/` directory was created

**Success Criteria**:
- ✅ TypeScript compilation succeeds
- ✅ `dist/` directory contains compiled files

## Branch Protection

### Recommended Settings

To enforce tests before merging, configure branch protection rules for `main`:

1. Go to **Settings** → **Branches** → **Branch protection rules**
2. Add rule for `main` branch
3. Enable:
   - ✅ **Require status checks to pass before merging**
     - Select: `Run Unit Tests`
     - Select: `Build Application`
   - ✅ **Require branches to be up to date before merging**
   - ✅ **Require linear history** (optional)
   - ✅ **Include administrators** (applies to everyone)

### Result
- PRs cannot be merged until all tests pass
- Direct pushes to `main` trigger the workflow
- Failed tests block the merge

## Workflow Badges

Add these badges to your README.md:

```markdown
![Tests](https://github.com/celfons/test-copilot/actions/workflows/test.yml/badge.svg)
```

## Local Development

Before pushing, run the same checks locally:

```bash
# Run linter
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Build the project
npm run build
```

## Troubleshooting

### Test Failures

If tests fail in CI but pass locally:
1. Ensure you've committed all changes
2. Check for environment-specific issues
3. Verify Node.js version matches (v20)
4. Clear cache: `npm ci` instead of `npm install`

### Build Failures

If build fails:
1. Check TypeScript compilation errors
2. Verify all dependencies are in `package.json`
3. Ensure `tsconfig.json` is properly configured
4. Run `npm run build` locally first

### Linting Failures

If linting fails:
1. Run `npm run lint` locally
2. Fix errors with `npm run lint:fix`
3. Review `.eslintrc.json` configuration
4. Commit the fixes

## Coverage Reports

The workflow generates coverage reports in the `coverage/` directory:
- `coverage/lcov.info` - LCOV format for Codecov
- `coverage/lcov-report/index.html` - HTML report for local viewing

### Viewing Coverage Locally

After running `npm run test:coverage`:

```bash
# Open HTML coverage report
open coverage/lcov-report/index.html  # macOS
xdg-open coverage/lcov-report/index.html  # Linux
start coverage/lcov-report/index.html  # Windows
```

## Optimization Tips

### Speed Up CI

1. **Use npm ci instead of npm install** - ✅ Already implemented
2. **Cache node_modules** - ✅ Already implemented via `cache: 'npm'`
3. **Run tests in parallel** - Jest already does this by default
4. **Skip optional dependencies** - Already handled by `npm ci`

### Current Performance

- **Test Job**: ~1-2 minutes
- **Build Job**: ~1 minute
- **Total Pipeline**: ~2-3 minutes

## Future Enhancements

Consider adding:

- [ ] **Code Quality Gates** - Fail if coverage drops below threshold
- [ ] **Security Scanning** - Add Snyk or Dependabot
- [ ] **Deployment** - Auto-deploy to staging/production
- [ ] **Performance Tests** - Add load testing
- [ ] **E2E Tests** - Add end-to-end browser tests
- [ ] **Docker Build** - Build and push Docker images
- [ ] **Release Automation** - Auto-create releases with semantic versioning

## Required Secrets

For full functionality, configure these secrets in GitHub:

- `CODECOV_TOKEN` - For uploading coverage to Codecov (optional)

To add secrets:
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add the secret name and value

## Monitoring

### Workflow Status

Check workflow runs:
1. Go to **Actions** tab in GitHub
2. Select **Run Tests** workflow
3. View run history and logs

### Notifications

GitHub automatically notifies:
- PR authors when checks fail
- Repository admins for workflow failures
- Can configure Slack/email notifications

## Conclusion

This CI/CD pipeline ensures:
- ✅ Code quality through automated linting
- ✅ Test coverage through comprehensive unit tests
- ✅ Build verification before deployment
- ✅ Protection of the main branch
- ✅ Consistent development environment

All changes are automatically validated before merge! 🚀
