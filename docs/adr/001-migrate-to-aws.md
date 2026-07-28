### ADR 001 — Migrate from Azure to AWS

#### Status
[x] Accepted

#### Context
AfriLumina Hub was initially deployed on Azure App Service with Azure Container Registry (ACR) and GitHub Actions CI/CD. The project now requires:
1. Resume upload functionality requiring object storage
2. M-Pesa payment integration (Safaricom's Daraja API)
3. A simpler, more cost-effective hosting model for a solo-maintained project
4. A learning opportunity to gain AWS expertise for future work at The Reggs Limited

#### Decision
Migrate the entire infrastructure from Azure to AWS, using:
- **Frontend:** S3 + CloudFront (static hosting with CDN)
- **Backend:** AWS App Runner (containerized Spring Boot)
- **Database:** RDS for MySQL
- **Storage:** S3 (resume uploads with pre-signed URLs)
- **CI/CD:** GitHub Actions targeting AWS services

#### Consequences
##### Positive
- Single cloud provider reduces complexity
- App Runner eliminates EC2 management overhead
- S3 + CloudFront provides better global performance for African users
- AWS experience is more valuable for The Reggs Limited's future client work
- Cost optimization through auto-scaling (no idle EC2 costs)

##### Negative
- Requires reworking CI/CD pipelines
- Database migration from Azure MySQL to RDS
- Learning curve for AWS-specific services
- Temporary dual-cloud operation during cutover

#### Alternatives Considered
##### Keep Azure + Add S3 for Storage
- **Pros:** Minimal changes to working infrastructure
- **Cons:** Managing two cloud providers; cross-cloud latency; double the credentials to secure

##### Full Migration to AWS ECS Fargate
- **Pros:** More flexible than App Runner; better for microservices
- **Cons:** Higher operational overhead; more networking configuration; overkill for single-container app

##### Full Migration to AWS Elastic Beanstalk
- **Pros:** Familiar PaaS model like Azure App Service
- **Cons:** Still managing EC2 instances; less "serverless" than App Runner; older technology

#### References
- [AWS App Runner Documentation](https://docs.aws.amazon.com/apprunner/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Build and deploy Spring Boot to App Runner with Terraform](https://aws.amazon.com/blogs/devops/build-and-deploy-a-spring-boot-application-to-aws-app-runner-with-a-ci-cd-pipeline-using-terraform/)

---