# Contributing Guidelines

Thank you for your interest in contributing to this project.  
Contributions are welcome and appreciated.

This repository follows lightweight, production-aligned standards to ensure code quality, accessibility, and security.

---

## Project Scope

This project is a static, client-side web application designed to demonstrate:
- IT support workflows
- Frontend quality practices
- Accessibility awareness
- CI/CD hygiene

There is no backend or authentication layer.

---

## Getting Started

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create a feature branch**:

```bash
git checkout -b feature/your-feature-name
```

## Local development

You can run this app without a build step:

- **Option A**: open `index.html` directly in a browser
- **Option B (recommended)**: run a local static server:

```bash
python -m http.server 8000
```

## Linting / quality checks

This repo uses a minimal Node toolchain for deterministic linting:

```bash
npm install
npm run lint
```

## Pre-commit hooks (optional)

If you use `pre-commit`, you can enable local hooks:

```bash
pre-commit install
pre-commit run --all-files
```

## Pull request guidelines

- **Keep PRs focused**: one change/theme per PR when possible.
- **Update docs**: if behavior or UX changes, update `README.md`/`ARCHITECTURE.md`.
- **No secrets**: do not commit credentials, tokens, or personal data.

## Reporting security issues

Please follow `SECURITY.md` for responsible disclosure.
