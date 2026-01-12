# Course Platform - Setup & Troubleshooting Guide

## 🚀 Quick Start

### Option 1: Automated Setup
```bash
# Double-click this file to start everything automatically
start-project.bat
```

### Option 2: Manual Setup
```bash
# Terminal 1 - Backend
cd backend
node createAdmin.js    # Create admin user (run once)
npm run dev           # Start backend server

# Terminal 2 - Frontend  
cd frontend
npm start            # Start frontend server
```

## 📋 System Requirements
- Node.js (v14 or higher)
- npm or yarn
- Internet connection (for in-memory database)

## 🔧 Configuration

### Backend (.env)
```
PORT=5001
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your-super-secret-jwt-key-here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NODE_ENV=development
```

### Frontend (.env)
```
PORT=3001
REACT_APP_API_URL=http://localhost:5001/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

## 👤 Default Users

### Admin
- **Email:** admin2020@gmail.com
- **Password:** Admin@123
- **Access:** http://localhost:3000/auth/admin

### Test Users (Create via registration)
- **Instructor:** http://localhost:3000/auth/instructor
- **Student:** http://localhost:3000/auth/student

## 🌐 URLs
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5001
- **Health Check:** http://localhost:5001/api/health

## 🔍 Troubleshooting

### Database Issues
**Problem:** MongoDB connection failed
**Solutions:**
1. **MongoDB Atlas:** Add your IP to whitelist at https://cloud.mongodb.com/
2. **Local MongoDB:** Install and start MongoDB service
3. **In-Memory:** The app automatically falls back to in-memory database

### Port Issues
**Problem:** Port already in use
**Solutions:**
```bash
# Kill processes using ports
netstat -ano | findstr :5001
taskkill /PID [PID_NUMBER] /F

# Or change ports in .env files
```

### Login Issues
**Problem:** Cannot login with admin credentials
**Solutions:**
1. Recreate admin user: `node createAdmin.js`
2. Test setup: `node testSetup.js`
3. Check console logs for detailed error messages

### Frontend Build Issues
**Problem:** React app won't start
**Solutions:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### API Connection Issues
**Problem:** Frontend can't connect to backend
**Solutions:**
1. Ensure backend is running on port 5001
2. Check REACT_APP_API_URL in frontend/.env
3. Verify CORS settings in backend

## 🧪 Testing

### Test Database Connection
```bash
cd backend
node testSetup.js
```

### Test API Endpoints
```bash
# Health check
curl http://localhost:5001/api/health

# Login test
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin2020@gmail.com","password":"Admin@123","role":"admin"}'
```

## 📁 Project Structure
```
Courses Market/
├── backend/           # Node.js/Express API
│   ├── config/       # Database configuration
│   ├── controllers/  # Route handlers
│   ├── middleware/   # Auth & validation
│   ├── models/       # MongoDB schemas
│   ├── routes/       # API routes
│   └── uploads/      # File uploads
├── frontend/         # React application
│   └── src/
│       ├── components/  # Reusable components
│       ├── context/     # React context
│       ├── pages/       # Page components
│       ├── services/    # API services
│       └── utils/       # Utilities
└── start-project.bat # Quick start script
```

## 🔐 Security Features
- JWT authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation
- CORS protection

## 💳 Payment Integration
- Stripe payment processing
- Secure transaction handling
- Payment history tracking

## 📱 Responsive Design
- Mobile-friendly interface
- Tablet optimization
- Desktop experience

## 🆘 Support
If you encounter issues:
1. Check this troubleshooting guide
2. Review console logs (F12 in browser)
3. Verify all dependencies are installed
4. Ensure ports 3000 and 5001 are available

## 🔄 Reset Everything
```bash
# Backend
cd backend
rm -rf node_modules
npm install
node createAdmin.js

# Frontend
cd frontend
rm -rf node_modules build
npm install
```