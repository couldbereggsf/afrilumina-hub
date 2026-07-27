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
afrilumina-backend/
├── src/main/java/com/reggs/afrilumina/
│   ├── auth/            # Admin login, JWT, AdminUser entity
│   ├── registration/    # Public signup form -> Registrant entity
│   ├── payment/          # Stripe + PayPal checkout & webhooks
│   ├── admin/            # Protected dashboard + Excel export
│   ├── email/            # Confirmation/receipt emails
│   ├── common/           # Shared exceptions, response wrapper
│   └── config/           # Security, CORS, Stripe init, OpenAPI, admin seeding
├── src/main/resources/
│   ├── application.yml / -dev.yml / -prod.yml
│   └── db/migration/     # Flyway SQL (MySQL)
├── k8s/                  # AKS manifests (deployment, service, ingress, configmap, secret template)
├── docker-compose.yml     # App + MySQL for local dev
├── Dockerfile
└── .github/workflows/ci.yml
```

## Running locally

1. Copy `.env.example` to `.env` and fill in **sandbox** values:
   - Stripe test keys: https://dashboard.stripe.com/test/apikeys
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
| GET | `/api/admin/registrants` | JWT (ADMIN) | Paginated registrant list |
| GET | `/api/admin/registrants/export` | JWT (ADMIN) | Download registrants as `.xlsx` |

## Swapping sandbox -> live payments later

No code changes needed — just update environment variables:
- `STRIPE_SECRET_KEY`: `sk_test_...` → `sk_live_...`
- `STRIPE_WEBHOOK_SECRET`: regenerate for the live webhook endpoint in the Stripe dashboard
- `PAYPAL_BASE_URL`: `https://api-m.sandbox.paypal.com` → `https://api-m.paypal.com`
- `PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_SECRET`: swap to the live app's credentials

## Deployment (Azure)

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
