# Security Policy

## Reporting a Vulnerability

Academic integrity systems handle critical student data. We take security seriously. If you find a security vulnerability, please do **not** report it publicly in GitHub issues.

Instead, report it directly to the maintainer:
* **Contact Email**: `security@veritas-ai.org` (or contact Malik Bahawal Shair directly)

Please include:
* The severity and impact of the vulnerability.
* A detailed description with a Proof of Concept (PoC) or reproducible steps.
* Any potential mitigation steps.

We will acknowledge receipt of your report within 48 hours and work with you to patch the issue before making a public disclosure.

## Supported Versions

Only the latest release version is actively supported with security updates:

| Version | Supported |
| ------- | --------- |
| v1.0.x  | Yes       |
| < v1.0  | No        |

## Safe Practices

* **No Server Storage**: Veritas AI is designed to run 100% locally. Do not send document contents or analysis results to third-party endpoints unless explicitly consented to by the user.
* **Database Access**: Ensure your PostgreSQL and Redis database ports are protected and never exposed to the public internet without proper SSL/TLS authentication.
