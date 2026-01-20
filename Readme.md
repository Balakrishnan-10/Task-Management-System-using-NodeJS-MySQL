# Task Management System – Backend (Node.js + Express + MySQL)

A role-based Task Management System backend built using **Node.js, Express, MySQL**, and **JWT authentication**.  
This project supports **Admin** and **User** roles with secure task assignment, management, and user control.

---
## Base URL : http://localhost:5000/

## Railway Host URL : https://task-management-system-using-nodejs-mysql-production.up.railway.app/

## API Documentatioin URL : https://app.swaggerhub.com/apis/ask-56f/task-management-system-api/1.0.0 

## 🚀 Features

### 👤 Authentication
- User Registration with profile image upload
- User Login with JWT
- Protected routes using token verification
- Role-based access (Admin / User)

### 🧑‍💼 Admin Features
- View all users
- Delete any user
- View all tasks
- Assign tasks to users
- Update any task
- Delete any task

### 🙋 User Features
- View own profile
- Update own profile
- Create tasks
- View task by ID
- Update own tasks
- Delete own tasks

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Authentication:** JWT
- **File Upload:** Multer
- **Testing Tool:** Insomnia

---

## 🔐 Authentication Flow

1. User registers → profile image saved
2. User logs in → receives JWT token
3. Token sent in cookies for protected routes
4. Role middleware restricts admin-only APIs

## ▶️ Run the Project

```bash
npm run dev
```
