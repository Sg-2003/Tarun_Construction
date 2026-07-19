# Tarun Construction 🏗️

**A modern full-stack construction company website built with the MEAN Stack and Three.js.**

![Tarun Construction](https://img.shields.io/badge/MEAN%20Stack-Angular%2019%20%7C%20Express%20%7C%20MongoDB-F4B400?style=for-the-badge)
![Three.js](https://img.shields.io/badge/3D-Three.js-white?style=for-the-badge)

---

## 🚀 Features

- **3D Hero Scene** — Interactive Three.js building, crane, excavator & mixer truck
- **Day/Night Mode** — Toggle 3D scene lighting
- **All Pages** — Home, About, Services, Projects, Gallery, Testimonials, Contact
- **Admin Dashboard** — JWT-protected CRUD for projects & enquiries
- **Responsive** — Mobile-first design for all screen sizes
- **Animations** — GSAP + CSS scroll-reveal animations throughout

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 19, SCSS, Three.js, GSAP |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT + bcryptjs |
| Storage | Cloudinary |

---

## 📁 Project Structure

```
Tarun-Construction/
├── client/          # Angular 19 frontend
│   └── src/app/
│       ├── core/    # Services, guards, interceptors, models
│       ├── shared/  # Navbar, Footer
│       └── pages/   # All page components
│
├── server/          # Node.js + Express backend
│   ├── config/      # DB + Cloudinary
│   ├── controllers/ # Auth, Projects, Enquiries
│   ├── middleware/  # JWT auth, file upload
│   ├── models/      # Mongoose schemas
│   └── routes/      # API routes
│
└── package.json     # Root scripts
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account

### 1. Clone the repo
```bash
cd d:\SG\PROJECT\MEAN\Tarun-Construction
```

### 2. Configure environment
Edit `server/.env`:
```env
MONGO_URI=your_mongodb_atlas_uri
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Install & Run (both server + client)
```bash
npm run dev
```

This runs:
- **Backend** → `http://localhost:5000`
- **Frontend** → `http://localhost:4200`

---

## 🔐 Admin Access

Default credentials (auto-created on first run):

| Field | Value |
|-------|-------|
| Email | `admin@tarunconstruction.com` |
| Password | `Admin@123` |

**Change these immediately in production!**

---

## 🌐 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | No | Admin login |
| GET | `/api/projects` | No | List all projects |
| POST | `/api/projects` | Admin | Create project |
| PUT | `/api/projects/:id` | Admin | Update project |
| DELETE | `/api/projects/:id` | Admin | Delete project |
| POST | `/api/enquiries` | No | Submit contact enquiry |
| GET | `/api/enquiries` | Admin | List all enquiries |
| GET | `/api/enquiries/stats` | Admin | Dashboard statistics |

---

## 🎨 Color Theme

```
Primary   #F4B400  (Construction Yellow)
Accent    #FF6B00  (Orange)
Dark      #1C1C1C
White     #FFFFFF
```

---

## 📦 Deployment

| Component | Platform |
|-----------|----------|
| Frontend | Vercel / Netlify |
| Backend | Render / Railway |
| Database | MongoDB Atlas |
| Images | Cloudinary |

---

## 📄 License

MIT © 2025 Tarun Construction
