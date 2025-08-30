## Full-Stack Movie App with JWT Authentication and Cloud Deployment

This app is built using the MERN stack (MongoDB, Express, React, Node.js) with secure user authentication and integration with a public movie API.

## Features

User Authentication: Secure login/signup with JWT (JSON Web Tokens).

Movie Search: Search and display movies using the TMDb API.

Favorites: Users can save their favorite movies to their profile.

Cloud Deployment: Hosted backend on AWS EC2 using the Free Tier.

Data Analytics: Dashboards to track the usage of the app.

## 🧩Technologies Used

MongoDB (Database)

Express.js (Backend Framework)

React.js (Frontend Framework)

Node.js (Server Environment)

AWS (EC2)

JWT (Authentication)

Git & GitHub (Version Control)

SQL

Power BI (Data Analytics)



## Prerequisites

Node.js installed on your machine.

MongoDB (for local development) or MongoDB Atlas (cloud database).

AWS account for cloud deployment ( for deployment on EC2).

Setup

Clone the repository:

git clone https://github.com/talhakayanii/Full-stack-movie-app.git
cd movie-app


Install dependencies for both backend and frontend:

For backend (Express.js + Node.js):

cd backend
npm install


For frontend (React.js):

cd frontend
npm install


## Set up environment variables:

Create a .env file in the backend directory.


Run the application locally:

First, start the backend server:

cd backend
npm start


Then, start the frontend server:

cd frontend
npm start


The app should now be running on http://localhost:3000.

## AWS Deployment 

To deploy the backend on AWS EC2, follow these steps:

Launch an EC2 instance (t3.micro for Free Tier).

SSH into your EC2 instance and install Node.js, npm, and MongoDB client tools.

Clone the repository and install the backend dependencies.

Set up  MongoDB on EC2.

Use PM2 to keep the backend server running.

Test the backend API to ensure it’s working properly.





