# 🍟 SnackHub – Full Stack Food Delivery App

A modern **MERN stack** application featuring **Firebase Hybrid Authentication**, real-time **MongoDB user synchronization**, and a custom-styled responsive UI.

---

## 🌐 Live Demo & API
- **Frontend (Vercel)**: [https://snackhub-nagpur.vercel.app](https://snackhub-nagpur.vercel.app)  
- **Backend API**: [https://snackhub-backend.onrender.com](https://snackhub-backend.onrender.com)

---
## 🌟 Project Preview

![SnackHub Preview](./frontend/public/snackhub-preview.png "SnackHub Full Stack Food Delivery App Preview")

*Screenshot of the SnackHub frontend showcasing the landing page, menu, and cart.*

SnackHub demonstrates **full-stack architecture**, **secure authentication**, and a **production-ready deployment structure**.

---

# 🏗️ Tech Stack

## 🎨 Frontend
- ⚛️ **React (Vite)** – Fast modern build tool  
- 🔥 **Firebase SDK** – Google Auth, Email login, Phone OTP  
- 📍 **React Router** – SPA routing  
- 🌐 **Context API** – Global state management  
- ⚡ **Axios** – Backend API communication  
- 🎨 **CSS / Tailwind / Material UI** – UI styling  

## 🚀 Backend
- 🟢 **Node.js** & 🚀 **Express.js** – Server-side API  
- 🗄️ **MongoDB (Mongoose)** – Database for Users, Orders, Menu  
- 🛡️ **Firebase Admin SDK** – Secure token verification  
- 🔐 **JWT & Role-Based Access** – Admin & Customer routes  

---

# ✨ Key Features

- 🔐 Hybrid Authentication (Google, Email, Phone OTP)  
- 👤 Real-time User Sync (Firebase → MongoDB)  
- 🛒 Role-Based Access (Admin / Customer)  
- 📦 Secure REST API  
- 📱 Fully Responsive UI  

---

# 📦 Project Structure

## Backend (Node + Express)

```bash
backend/
 ├── config/
 │    ├── db.js
 │    └── firebaseAdmin.js
 ├── models/
 │    ├── User.js
 │    └── Food.js
 ├── routes/
 │    ├── userRoutes.js
 │    └── foodRoutes.js
 ├── .env
 └── server.js 
```
---

## Frontend (React)

```bash
frontend/
 ├── src/
 │    ├── context/
 │    │    └── AuthContext.jsx
 │    ├── components/
 │    │    └── Navbar.jsx
 │    ├── pages/
 │    │    ├── Home.jsx
 │    │    ├── Menu.jsx
 │    │    ├── Login.jsx
 │    │    └── Cart.jsx
 │    ├── firebase.js
 │    └── App.jsx
 ```

---

## 🔐 Firebase Phone Auth Note (Free Tier)

Firebase now requires **billing (Blaze plan)** for real **Phone Authentication (SMS)**.

- **Google** and **Email/Password** login are still free (up to ~50k users).
- **Phone login works only with Firebase Test Numbers** on the free tier.
- Real users will get `auth/billing-not-enabled` unless billing is enabled.

### For this project
- Using **Firebase Free Tier**
- Phone login is **demo/testing only**
- Use Firebase **Test Numbers + fixed OTP**

If the project goes production later, upgrade to **Blaze Plan** to enable real SMS.