![ ](logo_backup.png)
# AfriLumina Hub

> **Youth Empowerment Platform** — connecting volunteers, mentors, partners, and program applicants across Africa.

---

## 📑 Table of Contents
- [Tech Stack](#-tech-stack)
- [Repository Structure](#-repository-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Running Locally](#running-locally)
- [Development Workflow & Roadmap](#-development-workflow--roadmap)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 💻 Tech Stack

### Backend
- **Core:** Java 21, Spring Boot 3.3
- **Database & Migrations:** MySQL 8, Flyway
- **Security & Payments:** JWT, Stripe, PayPal (M-Pesa integration planned)

### Frontend
- **Core:** React 18, Vite, React Router
- **Networking:** Axios

### Infrastructure & DevOps
- **Current Hosting:** Azure (App Service + ACR)
- **Planned Infrastructure (AWS):** App Runner, S3, CloudFront, RDS, Terraform / CloudFormation
- **CI/CD:** GitHub Actions (Currently Azure, migrating to AWS)

---

## 📁 Repository Structure

This repository is structured as a monorepo containing both the frontend and backend applications, alongside architectural documentation.

```text
afrilumina-hub/
├── backend/               # Spring Boot REST API
├── frontend/              # React + Vite SPA
├── docs/                  # Architecture Decision Records (ADRs), diagrams, drafts
├── infrastructure/        # (Future) Terraform / CloudFormation for AWS
├── docker-compose.yml     # For running both services locally
└── README.md              # Project documentation
```
## Getting Started
### Prerequisites
Before you begin, ensure you have the following installed:

- Java 21 and Maven (or utilize the included Maven wrapper)

- Node.js 20+ and npm

- MySQL 8 (or Docker to run the containerized database)

### Running Locally
#### Option 1: Run Backend + MySQL with Docker Compose (Recommended)
This is the fastest way to get the backend environment running.

```Bash
cd backend
docker compose --env-file .env up --build
```
*Note: This starts the Spring Boot application on port ```8080``` and ```MySQL``` on port ```3306```.*

#### Option 2: Run Backend without Docker
If you prefer to run the application directly on your host machine (requires a local MySQL instance):

```Bash
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

#### Option 3: Run the Frontend
The Vite development server is configured to proxy /api requests to http://localhost:8080, allowing seamless communication with the backend.

```Bash
cd frontend
npm install
npm run dev
```
*Note: The frontend expects the backend to be available on port ```8080```. Adjust the proxy settings in ```vite.config.js``` if necessary.*

### 🔄 Development Workflow & Roadmap
We utilize GitFlow for our development lifecycle:

* ```dev``` branch: Used for ongoing work and feature integration.

* ```main``` branch: Reserved for production-ready releases.

Each phase is developed in a feature branch off ```dev```, merged via Pull Request into ```dev```, and finally merged to ```main``` for deployment.

### Project Phases
- [x] Phase 0: Monorepo consolidation, import of legacy static files, and updated documentation.

- [ ] Phase 1 (Current): Convert legacy HTML pages to React components (Starting with the About page).

- [ ] Phase 2: Implement resume upload feature.

- [ ] Phase 3: M-Pesa integration (Replacing Stripe).

- [ ] Phase 4: AWS migration (App Runner, S3, CloudFront, RDS).

See the ```docs/``` folder for Architecture Decision Records (ADRs) and detailed phase planning.

### ☁️ Deployment
The application is currently hosted on Azure (App Service + Azure Container Registry).

A migration to AWS is planned for improved cost management and scalability. The CI/CD pipelines are defined in .github/workflows/ and will be updated to target AWS environments once the migration is complete.

### 🤝 Contributing
This project is maintained by Reagan Fwamba — The Reggs Limited & Collaboration with Lucy Njenga

For questions, suggestions, or contributions, please open an issue or reach out directly.

### 📄 License
*Built by Reagan Fwamba — The Reggs Limited*