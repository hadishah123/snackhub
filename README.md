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

## 🏗️ Tech Stack (MERN)
### Frontend
- ⚛️ React (Vite)
- React Router
- Axios
- Redux Toolkit (or Zustand)
- Tailwind CSS
- Socket.io-client (for live chat)
- Stripe/Razorpay (optional payment integration)

### Backend
 
- 🟢 Node.js
- 🚀 Express.js
- 🗄️ MongoDB (Mongoose)
- 🔐 JWT Authentication
- Socket.io (real-time chat)
- Cloudinary (for food images)
- Razorpay/Stripe (payment gateway)

---

## 🏗️ Suggested MERN Architecture
## 📦 Backend Structure (Node + Express)

```bash
server/
 ├── models/
 │    ├── User.js
 │    ├── Order.js
 │    ├── Booking.js
 │    ├── FoodItem.js
 │    └── Chat.js
 ├── routes/
 ├── controllers/
 ├── middleware/
 │    ├── authMiddleware.js
 └── server.js
 ```

## 🎨 Frontend Pages Structure (React)

 ```bash
 /pages
 ├── Home
 ├── Menu
 ├── Cart
 ├── Checkout
 ├── Login
 ├── Register
 ├── Dashboard
 ├── AdminPanel
 ├── Booking
 ├── Chat
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