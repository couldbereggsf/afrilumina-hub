# AfriLumina Hub — Frontend

React + Vite frontend for [AfriLumina Hub](https://www.afriluminahub.com/) — a youth empowerment platform connecting volunteers, mentors, partners, and program applicants across Africa.

---

## Tech Stack

- **React 18** with **Vite** (JavaScript)
- **React Router v6** — client-side routing
- **Axios** — HTTP client with JWT interceptor
- **Nginx** — serves the production build inside Docker

---

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Site-wide navigation, auth-aware
│   └── ProtectedRoute.jsx  # Redirects unauthenticated users to /admin/login
├── context/
│   └── AuthContext.jsx     # JWT state management (login/logout/persist)
├── pages/
│   ├── Home.jsx            # Landing page + public registration form
│   ├── PaymentPage.jsx     # Stripe / PayPal payment selection
│   ├── PaymentSuccess.jsx  # Post-payment success screen
│   ├── PaymentCancelled.jsx
│   └── admin/
│       ├── AdminLogin.jsx      # Admin login (JWT)
│       └── AdminDashboard.jsx  # Registrants table + Excel export
└── services/
    └── api.js              # All backend API calls in one place
```

---

## Pages & Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Landing page with registration form |
| `/payment` | Public | Choose Stripe or PayPal to pay |
| `/payment-success` | Public | Stripe/PayPal redirect on success |
| `/payment-cancelled` | Public | Stripe/PayPal redirect on cancel |
| `/admin/login` | Public | Admin login → JWT |
| `/admin/dashboard` | Protected (JWT) | Registrants table + Excel export |

---

## Running Locally

**Prerequisites:** Node.js 20+, and the [backend](https://github.com/couldbereggsf/afrilumina-backend) running on port 8080.

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev
```

The Vite dev server proxies all `/api` requests to `http://localhost:8080` automatically — no CORS issues, no extra config needed.

---

## Environment Variables

For production builds, set:

```bash
VITE_API_BASE_URL=https://afrilumina-backend.azurewebsites.net
```

Locally this isn't needed — the Vite proxy handles it.

---

## Building for Production

```bash
npm run build
```

Output goes to `dist/`. The `Dockerfile` in this repo uses Nginx to serve this folder.

---

## Docker

```bash
# Build the image
docker build -t afrilumina-frontend .

# Run it
docker run -p 80:80 afrilumina-frontend
```

---

## Deployment

Pushes to `main` trigger the GitHub Actions CD pipeline (`.github/workflows/cd.yml`) which:
1. Installs dependencies and builds the React app
2. Builds a Docker image and pushes it to Azure Container Registry
3. Deploys the new image to Azure App Service

Live URL: `https://afrilumina-frontend.azurewebsites.net`

---

## Related

- **Backend repo:** [afrilumina-backend](https://github.com/couldbereggsf/afrilumina-backend) — Spring Boot 3.3, MySQL, Flyway, JWT, Stripe, PayPal
- **Live site:** [afriluminahub.com](https://www.afriluminahub.com/)

---

*Built by [Reagan Fwamba](https://github.com/couldbereggsf) — The Reggs Limited*