# RippleRise: A Community Event Platform

## Description
Developed a full-stack MERN application with a modern, responsive UI to enable community event management. Implemented a secure user authentication system using JWTs and bcryptjs, alongside comprehensive CRUD functionality for events.

## Live Demo
Check out the live application here: [https://ripplerise.onrender.com](https://ripplerise.onrender.com)

## Key Features
- **Secure User Authentication:** Implemented a full auth flow with registration, login, and logout.
- **Event Management (CRUD):** Users can create, view, update, and delete events.
- **Event Ownership:** A user can only edit or delete their own events.
- **Public RSVP:** Anyone can RSVP to an event, whether they are logged in or not.
- **User Profiles:** Authenticated users can view and update their profile information.
- **Responsive Design:** The UI is fully responsive for all devices.

## Technologies Used
- **Frontend:** React, React Router, custom CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWTs, bcryptjs

## Installation and Setup
To run this project locally:

1.  Clone the repository:
    `git clone https://github.com/mheeraa/ripplerise.git`

2.  Install dependencies for both frontend and backend:
    `npm install`
    `cd frontend && npm install`

3.  Configure environment variables:
    * Create a `.env` file in the `backend` directory.
    * Add your `MONGO_URI` and `JWT_SECRET`.

4.  Start the development servers:
    * Open one terminal for the backend: `npm run dev`
    * Open another terminal for the frontend: `cd frontend && npm run dev`
