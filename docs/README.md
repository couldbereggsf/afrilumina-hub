# Architecture Decision Records (ADRs)


This directory contains all project documentation, including Architecture Decision Records (ADRs), LinkedIn post drafts, and architecture diagrams.

## Directory Structure
```
docs/
├── adr/ # Architecture Decision Records
│ ├── README.md # ADR index and guidelines
│ ├── 001-migrate-to-aws.md
│ └── 002-choose-app-runner.md
├── linkedin/ # LinkedIn post drafts (archive)
│ └── phase-0-complete.md
├── diagrams/ # Architecture diagrams (PlantUML, Draw.io, etc.)
└── README.md
```

## What is an ADR?

An Architecture Decision Record (ADR) is a document that captures an important architectural decision made along with its context and consequences[reference:2]. ADRs help teams document the reasoning behind architectural choices, making it easier to understand decisions in the future and onboard new team members[reference:3].

## ADR Format

Each ADR follows the **Nygard format**[reference:4]:

```markdown
# Title

## Status
[Proposed | Accepted | Deprecated | Superseded]

## Context
What is the issue that we're seeing that is motivating this decision?

## Decision
What is the change that we're proposing and/or doing?

## Consequences
What becomes easier or more difficult to do because of this change?

## Alternatives Considered
What other options were considered and why were they rejected?

## References
Links to relevant documentation, discussions, or tools
```
### ADR Index
# 📜 Architecture Decision Records (ADRs)

| ID | Title | Status | Date |
| :---: | :--- | :---: | :---: |
| **001** | [Migrate from Azure to AWS](#001-migrate-from-azure-to-aws) | `Accepted` | 2026-07-27 |
| **002** | [Choose AWS App Runner for Backend Hosting](#002-choose-aws-app-runner-for-backend-hosting) | `Accepted` | 2026-07-27 |
| **003** | [S3 + CloudFront for Frontend Hosting](#003-s3--cloudfront-for-frontend-hosting) | `Proposed` | TBD |
| **004** | [M-Pesa Integration via Daraja API](#004-m-pesa-integration-via-daraja-api) | `Proposed` | TBD |

---


## How to Use ADRs

1. When making a significant architectural decision, create a new ADR in `adr/`
2. Use the Nygard format (Context → Decision → Consequences → Alternatives)
3. Update the index in `adr/README.md`
4. Reference ADRs in commit messages and PR descriptions

## LinkedIn Series

I'm documenting this entire build on LinkedIn. Drafts are archived in `linkedin/` for reference and consistency.

- **Phase 0**: Monorepo consolidation + legacy import ([published](https://www.linkedin.com/posts/reagan-f-04a448244_fullstack-springboot-reactjs-activity-7487596613981495296-hm7j))
- **Phase 1**: Converting About page to React (coming soon)
- **Phase 2**: Resume upload feature
- **Phase 3**: M-Pesa integration
- **Phase 4**: AWS deployment