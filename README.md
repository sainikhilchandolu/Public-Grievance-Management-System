# Public Grievance Management System

A full-stack web application built using the MERN stack (MongoDB, Express, React, Node.js) with Tailwind CSS for styling. It empowers citizens to submit, track, and manage grievances, while providing a dedicated dashboard for administrators to review and update complaint statuses.

## Features

### Citizen
- Register and log in securely.
- Submit grievances with titles, descriptions, departments, priorities, and locations.
- View all submitted grievances in a dedicated dashboard.
- Delete pending grievances.
- Track real-time status updates via an activity timeline.

### Admin
- Dedicated admin dashboard to view system-wide statistics (total, pending, resolved, etc.).
- Visualize data with beautiful Recharts (Pie and Bar charts).
- Search, filter, and sort all grievances.
- Update complaint status and provide official remarks.
- Re-assign complaints to specific officers.
- View detailed citizen information for each complaint.

## Technology Stack

### Frontend
- **React.js (Vite)**
- **Tailwind CSS** (for styling and responsive design)
- **React Router DOM** (for routing)
- **Recharts** (for data visualization)
- **React Hot Toast** (for notifications)
- **React Icons**
- **Axios** (for API communication)

### Backend
- **Node.js & Express.js**
- **MongoDB & Mongoose**
- **JSON Web Token (JWT)** (for authentication)
- **Bcrypt.js** (for password hashing)
- **Express Validator** (for robust API input validation)

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or MongoDB Atlas)

### Installation

1. **Clone the repository** (or download the files).
2. **Setup the Backend**
   ```bash
   cd backend
   npm install
   ```
   - Create a `.env` file based on `backend/.env.example`.
   - Start the backend server:
     ```bash
     npm run dev
     ```
   - *Optional:* Seed the database with dummy data:
     ```bash
     npm run seed
     ```

3. **Setup the Frontend**
   ```bash
   cd frontend
   npm install
   ```
   - Start the development server:
     ```bash
     npm run dev
     ```

4. **Access the App**
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## Demo Credentials (if seeded)
- **Admin**: admin@grievance.gov / admin123
- **Citizen**: john@example.com / user123

## Screenshots & Designs
*(Add screenshots of the beautiful dashboards and UI here)*
