![Uploading RegisterPage.png…]()
![Uploading loginPage.png…]()
![Uploading AdminDashboardPage.png…]()
# 🌟 Roxiler Store Rating Hub

A modern, role-based store rating platform featuring a responsive glassmorphic React UI. The system supports three distinct user flows: Admins for system management, Store Owners for monitoring analytics, and Users for exploring and rating stores.

## ✨ Features

### 🔒 Role-Based Access Control
- Secure login and registration flows.
- Dynamic routing and UI rendering based on the user's role (`ADMIN`, `STORE_OWNER`, `USER`).

### 👑 Admin Features
- **System Overview:** View total users, total stores, and total ratings metrics.
- **User Management:** View, sort, and filter users by name, email, address, and role. Create new users.
- **Store Management:** View all stores, add new stores, and assign them to specific Store Owners.

### 🏪 Store Owner Features
- **Analytics Dashboard:** View average store rating and rating distribution (1 to 5 stars).
- **Customer Interaction:** Read customer reviews and submit public responses to user ratings.
- **Account Management:** Securely update profile password.

### 👤 Normal User Features
- **Store Discovery:** Search and filter stores by name or address.
- **Rating System:** Submit 1-5 star ratings for any store. Modify previously submitted ratings.

### 🎨 UI / UX
- **Glassmorphism Aesthetic:** A clean, light-blue glass-like theme with backdrop blurs.
- **Responsive Layout:** Built with modern flexbox/grid layouts and inline styling for component isolation.

---

## 🛠️ Tech Stack

- **Frontend Framework:** React.js
- **Routing:** React Router v6
- **State Management:** React Context API (Auth)
- **HTTP Client:** Axios
- **Styling:** Inline CSS / CSS-in-JS (Glassmorphic Theme)

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/roxiler-store-rating-hub.git](https://github.com/your-username/roxiler-store-rating-hub.git)
   cd roxiler-store-rating-hub
