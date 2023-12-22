contents

user manual (reproduction guide + env var)

./backend environment variables
- BACKEND_PORT

./frontend environment variables
- FRONTEND_PORT
- BACKEND_PORT

mono repo design

backend architecture

frontend framework + ui library + redux flux architecture

deployment
- docker compose in both frontend and backend folder
- github actions for CI/CD to deploy both frontend and backend on separate EC2 instances
- backend EC2 instance can only be reached from frontend instance
- backend and frontend EC2 instances are in the same VPC, which allows incoming traffic to reach the frontend instance only
- configure HTTPS?

alternative deployment
- push container to private registry in AWS ECR
- create fargate task in ECS

extensions to project
- migrate docker postgres db to aws aurora managed postgres instance
- setting up jest tests and running pre-commit hook for linting and unit, integration tests

link to report + reflection on project
