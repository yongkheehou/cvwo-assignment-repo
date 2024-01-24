# Gossip With Go Submission for CVWO 

I built a web forum in React (frontend) and Go for my CVWO assignment.

- Link to deployed website: http://www.kheehou-cvwo.com.s3-website-ap-southeast-1.amazonaws.com/

- Link to user guide video: 

# Setup Guide
- clone the repo locally

```
git clone https://github.com/yongkheehou/cvwo-assignment-repo.git

cd cvwo-assignment-repo
```
- Create a .env file in the /backend folder, following the format of the sample.env file provided in the /backend folder

- to start the backend service and PostgreSQL database, run `make run` in the /backend folder

- to start the frontend service, run the following in the /frontend folder
```
npm install

npm start
```

# Some considerations I had while working on this project

## Frontend 
- Code is written in TypeScript
  - Used over JavaScript for type safety

- React for frontend framework

- Material UI
  - I was deciding between Tailwind CSS and MUI since I have built web applications with Tailwind CSS before, but ultimately chose MUI since it is the component library of choice of CVWO and I wanted to familiarize myself with it

- Redux
  - State management tool for user authentication + threads + comments states

- Axios
  - HTTP client I used to interface with my backend service and retrieve data from my PostgreSQL database

- Others
  - Tiptap for rich text editor
  - Zod for input validation

## Backend 
- Code written in Go

- Gin ORM
  - High performance and has functions to handle CORS, cookie storage, and authentication
  - Popular Go framework with solid [documentation](https://pkg.go.dev/github.com/gin-gonic/gin)

- PostgreSQL (relational database)
  - my user, thread, comments, and authentication models were structured and had well-defined fields so a relational database made sense for this use case

- MVC framework
  - MVC allows breaks down the tasks required to fetch data from my PostgreSQL database from the backend to the frontend into logical subtasks allowing for good separation of concerns, improving the organization and understandability of my backend logic
  - models found in /backend/models
  - controllers found in /backend/controllers
  - views found in /frontend/src/pages

## Deployment

### Frontend
- AWS S3 static site hosting

### Backend
- My backend server is running on an AWS EC2 instance

## Potential Extensions For My Project
- Configure HTTPS using AWS Cloudfront for Frontend deployed on S3

- Migrate Docker PostgreSQL database to a managed PostgreSQL instance on AWS Aurora

- Setting up jest unit and integration tests 

- Creating pre-commit hooks for linting and testing before any commits

- Setting up GitHub Actions to allow for automatic updates to the backend server/ deployed website whenever a push to the main branch of my repository is made
