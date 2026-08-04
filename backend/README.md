# AfriLumina Hub — Backend

Spring Boot backend for [afriluminahub.com](https://www.afriluminahub.com/): handles visitor
registrations (volunteers, mentors, partners, program applicants, donors), sandbox payments via
**Stripe** and **PayPal**, and admin reporting with **Excel (.xlsx) export**.

## Stack

- Java 21, Spring Boot 3.3
- MySQL 8 (centralized DB), Flyway migrations
- Spring Security + JWT (admin auth)
- Stripe Java SDK + PayPal REST API (sandbox by default)
- Apache POI (Excel export)
- Docker / docker-compose for local dev
- Kubernetes manifests (`k8s/`) for AKS deployment

## Project structure

```
afrilumina-hub/backend/
├── src/main/java/com/reggs/afrilumina/
│   ├── auth/
│   ├── registration/
│   ├── payment/
│   ├── admin/
│   ├── email/
│   ├── common/
│   └── config/
├── src/main/resources/
│   ├── application.yml / -dev.yml / -prod.yml
│   └── db/migration/
├── k8s/                  # (optional, kept for reference)
├── docker-compose.yml    # (now used from root? We'll discuss later)
├── Dockerfile
└── pom.xml
```

## Running locally

**Note:**
The `docker-compose.yml` may be moved to the root for monorepo convenience

1. Copy `.env.example` to `.env` and fill in **sandbox** values:
   - PayPal sandbox app: https://developer.paypal.com/dashboard/applications/sandbox
2. Start everything:
   ```bash
   docker compose --env-file .env up --build
   ```
3. API is at `http://localhost:8080`. Swagger UI at `http://localhost:8080/docs`.
4. The first admin account is auto-created on boot from `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD`.

## Key endpoints

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/api/registrations` | Public | Submit signup form |
| POST | `/api/payments/initiate` | Public | Start a Stripe or PayPal checkout |
| POST | `/api/payments/stripe/webhook` | Stripe signature | Confirms Stripe payment completion |
| GET | `/api/payments/paypal/capture?token=...` | Public (PayPal redirect) | Captures an approved PayPal order |
| POST | `/api/auth/login` | Public | Admin login -> JWT |
| GET | `/api/admin/registrations` | JWT (ADMIN) | Paginated registration list |
| GET | `/api/admin/registrations/export` | JWT (ADMIN) | Download registrations as `.xlsx` |

## Swapping sandbox -> live payments later

No code changes needed — just update environment variables:
- `STRIPE_SECRET_KEY`: `sk_test_...` → `sk_live_...`
- `STRIPE_WEBHOOK_SECRET`: regenerate for the live webhook endpoint in the Stripe dashboard
- `PAYPAL_BASE_URL`: `https://api-m.sandbox.paypal.com` → `https://api-m.paypal.com`
- `PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_SECRET`: swap to the live app's credentials

## Deployment (Azure)

**Note:**
I'm transitioning to  AWS App Runner🌝.

- **Quick path:** Build the Docker image, push to **Azure Container Registry (ACR)**, run on
  **Azure App Service (container)**, with MySQL on **Azure Database for MySQL Flexible Server**.
- **Kubernetes path:** Push the same image to ACR, deploy to **AKS** using the manifests in `k8s/`.
  Fill in real secrets via `kubectl create secret` (see `k8s/secret.yaml.example`) or, preferably,
  the Azure Key Vault Provider for Secrets Store CSI Driver.

## Tests

```bash
mvn clean verify
```

CI (`.github/workflows/ci.yml`) runs the same against a MySQL service container on every push/PR.
