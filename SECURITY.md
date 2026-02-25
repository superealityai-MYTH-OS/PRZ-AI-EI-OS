# Security Policy

## Supported Versions

We release security patches for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |

## Reporting a Vulnerability

We take the security of PRZ AI/EI/OS seriously. If you believe you have found a security vulnerability, please report it to us as described below.

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them by opening a [GitHub Security Advisory](https://github.com/wv2v47pq4z-create/prz-ai-ei-os-anthropic/security/advisories/new) in this repository.

You should receive a response within 48 hours. If for some reason you do not, please follow up to ensure we received your original message.

Please include the following information in your report:

- Type of issue (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit the issue

This information will help us triage your report more quickly.

## Disclosure Policy

When we receive a security bug report, we will:

1. Confirm the problem and determine the affected versions.
2. Audit code to find any similar issues.
3. Prepare fixes for all still-supported releases.
4. Release patched versions as soon as possible.

## Security Best Practices

When using PRZ AI/EI/OS:

- **Never commit secrets** or API keys to the repository.
- **Validate all user input** before passing it to the pipeline.
- Rotate database credentials regularly if using the database adapters.
- Keep all optional database driver dependencies up to date.

---
Part of the **Super Reality OS** project ecosystem.
