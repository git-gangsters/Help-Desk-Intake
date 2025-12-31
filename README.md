![Pages](https://img.shields.io/badge/GitHub%20Pages-Live-success)
![Lint](https://github.com/<mr-adonis-jimenez>/<help-desk-intake>/actions/workflows/lint.yml/badge.svg)
![CI Matrix](https://github.com/<mr-adonis-jimenez>/<help-desk-intake>/actions/workflows/test-matrix.yml/badge.svg)
![Lighthouse](https://github.com/<mr-adonis-jimenez>/<help-desk-intake>/actions/workflows/lighthouse.yml/badge.svg)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Lint](https://github.com/<mr-adonis-jimenez>/<hekp-desk-intake>/actions/workflows/lint.yml/badge.svg)
![Lighthouse](https://github.com/<mr-adonis-jimenez>/<hekp-desk-intake>/actions/workflows/lighthouse.yml/badge.svg)

![Lighthouse](https://img.shields.io/badge/Lighthouse-Audited-blue)

# Help Desk Intake & Ticket Tracker

## Overview

This project is a lightweight, browser-based help desk intake and ticket tracking system designed to demonstrate real-world IT support workflows, frontend quality practices, and CI/CD security hygiene.

The application captures structured support requests, tracks ticket lifecycle states, and provides operational analytics through interactive dashboards. The repository intentionally emphasizes correctness, accessibility, and automation over framework complexity.

## Features
- Ticket intake form
- Priority and category tracking
- Local browser storage
- Status updates
- CSV export for reporting

## Tech Stack
- HTML / CSS / JavaScript
- Browser localStorage
- GitHub Pages compatible

  ## Engineering & Quality Practices

This repository mirrors production-quality frontend workflows, including:

- GitHub Actions CI with explicit least-privilege permissions
- Automated linting for HTML, CSS, and JavaScript
- Cross-platform CI test matrix validation
- Lighthouse performance and accessibility audits
- Automated accessibility scanning using axe-core
- Static security analysis with CodeQL
- Pre-commit hooks enforcing quality before commits
- Dependabot for automated dependency monitoring

  ## Security & Governance

Security and governance are treated as first-class concerns:

- CI workflows explicitly scope GITHUB_TOKEN permissions
- Responsible disclosure documented in `SECURITY.md`
- Contribution standards documented in `CONTRIBUTING.md`
- Open-source licensing defined under the MIT License

All automation adheres to the principle of least privilege.

- CI Security Checklist

This project follows security best practices for GitHub Actions and CI/CD pipelines.
The checklist below documents the controls in place.

GitHub Actions Security

 Explicit permissions blocks defined for all workflows

 GITHUB_TOKEN scoped using least privilege (read-only where applicable)

 Write permissions granted only to workflows that require them (e.g., Pages deploy)

 No use of default implicit read-write permissions

Dependency & Supply Chain Security

 Dependabot enabled for automated dependency monitoring

 Dependency updates reviewed via pull requests

 No untrusted third-party GitHub Actions used

Code Quality & Integrity

 CI linting enforced for HTML, CSS, and JavaScript

 Cross-platform CI test matrix validation

 Pre-commit hooks configured to prevent low-quality commits

Performance & Accessibility

 Automated Lighthouse audits executed in CI

 Automated accessibility audits using axe-core

 Semantic HTML and WCAG-aligned accessibility practices enforced

Security Policy & Governance

 Responsible disclosure policy documented in SECURITY.md

 Contribution standards documented in CONTRIBUTING.md

 Open-source licensing clearly defined (MIT License)

Security Philosophy

This project intentionally applies production-grade CI/CD security hygiene while remaining lightweight and framework-free.
All automation is scoped to the minimum permissions required to complete each task, reducing risk and adhering to the principle of least privilege.

## Purpose
Demonstrates IT support workflows, data handling, and frontend fundamentals using a zero-cost, Chromebook-friendly setup.
