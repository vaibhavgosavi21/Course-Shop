# 🚀 QUICK START GUIDE

## Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)

## 🎯 Quick Start (Windows)

### Option 1: Use Startup Script (Easiest)
```bash
# Double-click this file:
START_PROJECT.bat
```

### Option 2: Manual Start

#### Step 1: Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

#### Step 2: Create Admin User
```bash
cd backend
node createAdmin.js
```

#### Step 3: Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will run on: http://localhost:5001

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Frontend will run on: http://localhost:3001

#### Step 4: Access Application
Open browser: http://localhost:3001

## 🔑 Default Login Credentials

### Admin
- Email: admin@courseplatform.com
- Password: admin123

### Test Student (Register first)
- Use the signup form to create a student account

### Test Instructor (Register first)
- Use the signup form to create an instructor account

## ✅ Verify Installation

### Test Backend:
```bash
# In browser or curl:
http://localhost:5001/api/health

# Or run test script:
cd backend
node testBackend.js
```

### Test Frontend:
Open: http://localhost:3001

## 🐛 Troubleshooting

### Backend not starting?
1. Check MongoDB connection in backend/.env
2. Verify port 5001 is available
3. Check backend terminal for errors

### Frontend not starting?
1. Verify port 3001 is available
2. Check REACT_APP_API_URL in frontend/.env
3. Clear npm cache: `npm cache clean --force`

### Login not working?
1. Check browser console (F12) for errors
2. Verify backend is running: http://localhost:5001/api/health
3. Check Network tab in browser DevTools
4. Clear browser cache and cookies

### MongoDB connection failed?
1. Go to MongoDB Atlas: https://cloud.mongodb.com/
2. Network Access → Add IP Address → 0.0.0.0/0
3. Wait 2-3 minutes
4. Restart backend server

## 📁 Project Structure
```
Course Shop/
├── backend/          # Node.js + Express API
│   ├── controllers/  # Business logic
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   ├── .env          # Environment variables
│   └── server.js     # Entry point
├── frontend/         # React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── services/
│   └── .env          # Frontend config
└── START_PROJECT.bat # Startup script
```

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
```

### Frontend (.env)
```env
PORT=3001
REACT_APP_API_URL=http://localhost:5001/api
```

## 📚 More Help
- See TROUBLESHOOTING.md for detailed error solutions
- See README.md for full documentation
