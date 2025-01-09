# Apollonia Dental Practice Employee Management

## Overview

In this project, you will step into the shoes of an entry-level full-stack developer at Apollonia Dental Practice, helping the team develop a new employee management web application for the company.

## Project Scenario

The team at Apollonia Dental Practice is trying to set the foundations to digitalize their employee management. Over time, they want to have digital records of their employees and departments, assign patients to each member of their medical staff, assign projects to each staff member, and more. To achieve this, they want to create a basic CRUD web app to store and manage information about their employees and departments, which will serve as a foundation for further development.

They are relying on you to develop a database and web app reflecting their current organization, staff members, and departments. Your work will help them create a new digital employee management system to better manage their dental practice and workforce.

## Project Objectives

1. Create a database with employees and departments.
2. Create a web UI for employees and departments management.
3. Perform CRUD (Create, Read, Update, Delete) operations on the employees and departments database using the web UI.

## Your Challenge

Your task is to create a fundamental employee management CRUD web app to store information about employees and departments and perform CRUD operations on the employee data using Node.js and MongoDB. To accomplish this:

- Build a Node.js server and MongoDB database.
- Create collections for employees and departments.
- Design a user interface using HTML, CSS, and JavaScript.
- Enable users to perform CRUD operations on the database via a REST API through the web UI.

The project uses organizational data from the Apollonia Dental Practice and the following technologies: HTML, CSS, JavaScript, Node.js, ExpressJS, MongoDB, REST API.

Additionally, you will package the solution with Docker, and optionally deploy it using Kubernetes, AWS, or GCP.

## Technologies Used

This project is built using the following technologies:

### Full Stack Framework

- **MEAN Stack**: MongoDB, ExpressJS, Angular , Node.js

### Deployment and Containerization

- **Docker**: Used for containerizing the application.
- **Kubernetes**: Used for orchestrating containers in a distributed environment.

### Cloud Platforms

- **AWS**: For deploying and hosting the application.
- **GCP (Google Cloud Platform)**: Alternative cloud deployment.

## Example Projects

Before diving into development, explore these example projects for guidance:

1. **Node.js and MongoDB CRUD Books Management Application**

   - This repository demonstrates a CRUD app for books management using Node.js and MongoDB.

2. **User Management CRUD Application with Node.js and MongoDB**

   - A CRUD app to manage users with fields like name, birth date, email, etc.

3. **Dockerize a Node.js and MongoDB CRUD App**
   - Guidance on packaging a Node.js and MongoDB CRUD app using Docker.

## Instructions: Working Off-Platform

### Getting Started

1. **Install Prerequisites**:

   - **Node.js**: Install Node.js from [Node.js official website](https://nodejs.org/).
   - **MongoDB**: Install MongoDB locally or use a cloud-hosted database like MongoDB Atlas.
   - **Docker**: Install Docker to containerize the application.
   - **Kubernetes**: Set up a Kubernetes cluster for orchestration.

2. **Initialize the Project**:

   - Run `npm init` to initialize the project.
   - Install dependencies such as ExpressJS, dotenv, and Mongoose.

3. **Database Setup**:

   - Create collections for employees and departments in MongoDB.

4. **Dockerize the Application**:

   - Write a `Dockerfile` based on the Node.js image.
   - Use `docker-compose.yml` to link the Node.js app with MongoDB.

5. **Cloud Deployment**:

   - Use AWS or GCP for deployment.

6. **Kubernetes Orchestration**:
   - Create deployment and service YAML files for Kubernetes.

### Required Files

- **Business Briefing Document**: Organizational data and requirements.
- **IDE/Editor**: Use Visual Studio Code or any preferred editor.
- **Docker Images**: Pull Node.js and MongoDB images.

## Debugging Tips + Helpful Resources

- **View Task-by-Task Guides**: Follow a structured development process.
- **Google Your Questions**: Leverage community solutions on StackOverflow.
- **Read Documentation**:
  - [Node.js Documentation](https://nodejs.org/en/docs/)
  - [MongoDB Documentation](https://www.mongodb.com/docs/)
  - [ExpressJS Documentation](https://expressjs.com/)
  - [Mongoose Documentation](https://mongoosejs.com/)
  - [Docker Documentation](https://docs.docker.com/)
  - [Kubernetes Documentation](https://kubernetes.io/docs/)
