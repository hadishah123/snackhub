## prompt

I want you to act as a senior full-stack MERN developer and software architect.

Help me build a complete production-ready MERN stack web application for a Momos Shop. 
The application should be scalable, cleanly structured, and portfolio-level impressive.

Project Requirements:

1. Tech Stack:
- Frontend: React.js (with functional components and hooks)
- Backend: Node.js + Express.js
- Database: MongoDB (Mongoose ODM)
- Authentication: JWT-based authentication
- Real-time features: Socket.io
- Styling: Tailwind CSS (or modern UI library)
- State Management: Context API or Redux Toolkit
- Deployment-ready structure

2. Core Features:

A) Authentication System:
- User registration & login
- Password hashing using bcrypt
- JWT access tokens
- Role-based access (Customer, Admin)
- Protected routes
- Logout functionality

B) Food Ordering System:
- Admin can CRUD menu items
- Customers can:
  - Browse menu
  - Add to cart
  - Place orders
  - Choose delivery or dine-in
- Order status flow:
  - Placed
  - Accepted
  - Preparing
  - Out for Delivery
  - Delivered
- Order history for users
- Admin order management dashboard

C) Seat Booking System:
- Customers can:
  - Select date & time
  - Book seats
  - View availability
- Admin can:
  - Manage seating capacity
  - View and manage bookings

D) Real-Time Chat:
- Customer ↔ Admin live chat
- Socket.io implementation
- Store chat history in MongoDB
- Show online/offline status

E) Delivery Tracking:
- Real-time order status updates using Socket.io
- Estimated delivery time
- Status timeline UI

F) Admin Dashboard:
- View total orders
- View revenue
- Manage menu
- Manage bookings
- Manage users
- Charts (Chart.js or similar)

3. Database Collections:
- Users
- Orders
- Bookings
- MenuItems
- Chats

4. Advanced Features (Optional but recommended):
- Stripe payment integration (test mode)
- Cloudinary image upload
- Email notifications using Nodemailer
- Dark/Light mode toggle
- Coupon system
- Loyalty points system

5. Architecture:
- Clean folder structure (controllers, models, routes, middleware)
- Error handling middleware
- Input validation
- Proper API structure (RESTful)
- Production-ready environment configuration

6. What I Want From You:
- Full project folder structure
- Backend setup step-by-step
- Database schema design
- API routes with explanation
- Frontend structure
- Example code for key features
- Real-time Socket.io implementation
- Deployment guidance
- Best practices

Generate everything step-by-step and explain clearly like a senior developer mentoring a junior developer.

---

# 🍟 SnackHub – Full Stack Food Delivery App

A modern **MERN stack** application featuring **Firebase Hybrid Authentication**, real-time **MongoDB user synchronization**, and a custom-styled responsive UI.

---

# 🏗️ Tech Stack

## 🎨 Frontend

- ⚛️ **React (Vite)** – Fast, modern build tool  
- 🔥 **Firebase SDK** – Google Auth, Phone (OTP), and Email login  
- 📍 **React Router** – Single Page Application (SPA) routing  
- 🌐 **Context API** – Global state management (Auth & User Sync)  
- ⚡ **Axios** – Backend API communication  
- 🎨 **CSS-in-JS** – Clean, modern custom-styled components  

---

## 🚀 Backend

- 🟢 **Node.js** & 🚀 **Express.js** – Server-side logic and API  
- 🗄️ **MongoDB (Mongoose)** – Database for Users, Orders, and Menu  
- 🛡️ **Firebase Admin SDK** – Secure token verification & server-side authentication  
- 🔐 **JWT & Role-Based Access** – Secure routes for Admins and Customers  

---

# ✨ Key Features

- 🔐 Hybrid Authentication (Google, Email, Phone OTP)  
- 👤 Real-time User Sync (Firebase → MongoDB)  
- 🛒 Role-Based Access (Admin / Customer)  
- 📦 Secure REST API  
- 📱 Fully Responsive UI  

---

SnackHub demonstrates full-stack architecture, authentication security, and production-ready deployment structure.
---

## 🏗️ Suggested MERN Architecture
## 📦 Backend Structure (Node + Express)

```bash
backend/
 ├── config/
 │    ├── db.js             # MongoDB connection logic
 │    └── firebaseAdmin.js  # Firebase Admin SDK (with .env cleaning)
 ├── models/
 │    ├── User.js           # Firebase-synced User schema (Mongoose)
 │    └── Food.js           # Menu items schema
 ├── routes/
 │    ├── userRoutes.js     # /api/users (The Auth & Sync Bridge)
 │    └── FoodRoutes.js     # /api/foods (Menu operations)
 ├── .env                   # API Keys, Mongo URI, Firebase Admin Key
 └── server.js              # Entry point & CORS configuration
 ```

## 🎨 Frontend Pages Structure (React)

 ```bash
frontend/
 ├── src/
 │    ├── context/
 │    │    └── AuthContext.jsx  # Firebase Listener & Backend Sync
 │    ├── components/
 │    │    └── Navbar.jsx       # Dynamic Header (Auth-aware)
 │    ├── pages/
 │    │    ├── Home.jsx         # Landing page
 │    │    ├── Menu.jsx         # Fetching data from MongoDB
 │    │    ├── Login.jsx        # Google, Email, & Phone OTP Logic
 │    │    └── Cart.jsx         # Selection & Checkout logic
 │    ├── firebase.js           # Frontend Firebase configuration
 │    └── App.jsx               # Main Routing
 ```
 Use:
- TailwindCSS or Material UI
- Axios for API calls
- React Router
- Context API or Redux Toolkit

--- 

## 🧠 How To Present This in Your Resume

Instead of writing:
`“Built a food ordering website”`

Write:
`Developed a full-stack restaurant management system using MERN stack featuring JWT authentication, real-time order tracking via Socket.io, seat booking system, and integrated payment gateway with role-based admin dashboard.`

That sounds 🔥 professional.


---
---

# 🔐 Firebase Phone Authentication Policy Update

Firebase changed its policy. While **Google** and **Email/Password** login remain free for up to **50,000 users**, **Phone Authentication (SMS)** now requires a **billing account** to be linked to your project.

---

## 1️⃣ The Reality of Production Phone Login

If you deploy your app right now **without upgrading**:

**You:**  
- Can log in using the **Test Numbers** you added in the console  
- (Because they don't send real SMS)

**Real Users:**  
- When they enter their real number, they will see the same  
  `auth/billing-not-enabled` error  
- The app will effectively be **"broken"** for them

---

## 2️⃣ Is There a Way to Do It for Free?

Technically, yes — but with a catch.

Once you upgrade to the **Blaze Plan**, Firebase gives you a **No-Cost Tier**.

Historically:
- 🔹 10,000 free SMS/month

However (2024–2026 update):
- Many regions now only get about **10 free SMS per day**
- After that, you are charged per message  
- Typically **$0.01 to $0.06 per SMS**, depending on the country

---

## 3️⃣ Recommendation for "SnackHub"

Since this is likely a **portfolio project** or a **small startup**, here’s the best way to handle it without spending money:

### ✅ Stay on the Free Plan
- Don’t add a credit card if you're not ready.

### ✅ Focus on Google & Email Login
- These are **100% free** for up to 50,000 users.
- Your implementation already supports them.

### ✅ Handle Phone Login Smartly

1. Keep the phone authentication code as it is (it’s correctly implemented).
2. Add a small note on your **Login page**, such as:

   > *For testing purposes, use +91 9545267216 with OTP 123456.*

3. Add that number as a **Test Number** inside your Firebase Console.

---

# 🚀 Final Advice

For a portfolio project:
- Google Login is more than enough.
- Email/Password makes it production-ready.
- Phone login can be showcased as a demo feature using test numbers.

If SnackHub becomes a real startup with active users — then upgrading to Blaze makes sense.