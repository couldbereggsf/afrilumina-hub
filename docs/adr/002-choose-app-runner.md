# ADR 002: Choose AWS App Runner for Backend Hosting

## Status
Accepted

## Context
The Spring Boot backend needs to be deployed on AWS in a way that is:

1. Easy to manage for a solo developer
2. Cost-effective (no 24/7 EC2 costs during low traffic)
3. Auto-scaling capable
4. Secure (private database access)
5. Easy to integrate with CI/CD

## Decision
Use **AWS App Runner** as the container orchestration service for the Spring Boot backend.

## Consequences

### Positive
- **Zero infrastructure management**: No EC2 instances, load balancers, or cluster configuration[reference:6]
- **Auto-scaling**: Scales to zero during low traffic, scales up automatically when needed
- **Built-in HTTPS**: Automatic SSL/TLS termination via ACM
- **Simple deployments**: `aws apprunner start-deployment` or GitHub Actions integration
- **VPC Connector**: Can securely connect to RDS in a private subnet[reference:7]
- **Cost-effective**: Pay only for active compute time

### Negative
- **Less control**: Can't SSH into instances or customize the underlying OS
- **Slightly higher per-unit cost** compared to reserved EC2 instances
- **Limited to container workloads** (no native support for non-containerized apps)
- **Fewer configuration options** compared to ECS

## Alternatives Considered

### Elastic Beanstalk
- **Pros**: Familiar PaaS model; more configuration options
- **Cons**: Still runs on EC2; requires managing environment configs; less "serverless"

### ECS with Fargate
- **Pros**: More flexible; better for multi-service architectures
- **Cons**: Requires VPC, ALB, security groups, and task definitions to be manually configured; higher operational overhead for a single service

### EC2 (manual)
- **Pros**: Full control
- **Cons**: Highest operational overhead; not cost-effective for low-traffic periods

## References
- [AWS App Runner Overview](https://aws.amazon.com/apprunner/)
- [App Runner with Custom VPC and RDS using Terraform](https://github.com/OneUptime/blog)[reference:8]
- [Terraform AWS App Runner Module](https://github.com/terraform-aws-modules/terraform-aws-app-runner)[reference:9]