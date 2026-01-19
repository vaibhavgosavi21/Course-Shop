# TROUBLESHOOTING GUIDE

## Issue: Login/Signup Not Working

### Quick Fixes:

1. **Check if servers are running:**
   - Backend should be on: http://localhost:5001
   - Frontend should be on: http://localhost:3001
   - Test backend: http://localhost:5001/api/health

2. **Start the servers:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

3. **Check MongoDB Connection:**
   - Go to https://cloud.mongodb.com/
   - Navigate to "Network Access"
   - Add your IP address or use 0.0.0.0/0 for all IPs
   - Wait 2-3 minutes for changes to apply

4. **Clear Browser Cache:**
   - Press Ctrl+Shift+Delete
   - Clear cookies and cached files
   - Restart browser

5. **Check Console Errors:**
   - Press F12 in browser
   - Check Console tab for errors
   - Check Network tab for failed requests

6. **Verify Environment Files:**
   
   Backend (.env):
   ```
   PORT=5001
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your-super-secret-jwt-key-here
   NODE_ENV=development
   ```

   Frontend (.env):
   ```
   PORT=3001
   REACT_APP_API_URL=http://localhost:5001/api
   ```

7. **Reinstall Dependencies:**
   ```bash
   # Backend
   cd backend
   rm -rf node_modules package-lock.json
   npm install

   # Frontend
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

8. **Create Admin User:**
   ```bash
   cd backend
   node createAdmin.js
   ```
   Default credentials:
   - Email: admin@courseplatform.com
   - Password: admin123

## Common Error Messages:

### "Network Error" or "Failed to fetch"
- Backend server is not running
- Wrong API URL in frontend .env
- CORS issue (check backend CORS configuration)

### "Invalid credentials"
- Wrong email/password
- User doesn't exist (register first)
- Wrong role selected

### "MongoDB connection failed"
- Check MongoDB Atlas IP whitelist
- Verify MONGODB_URI in backend .env
- Check internet connection

### "Port already in use"
- Kill the process using the port:
  ```bash
  # Windows
  netstat -ano | findstr :5001
  taskkill /PID <PID> /F
  ```

## Test API Endpoints:

### Health Check:
```bash
curl http://localhost:5001/api/health
```

### Register Student:
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Student",
    "email": "student@test.com",
    "mobile": "9876543210",
    "password": "test123",
    "role": "student"
  }'
```

### Login:
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@test.com",
    "password": "test123",
    "role": "student"
  }'
```

## Still Not Working?

1. Check if ports 3001 and 5001 are available
2. Disable antivirus/firewall temporarily
3. Try running on different ports
4. Check Node.js version (should be v14 or higher)
5. Restart your computer

## Contact Support:
If issues persist, provide:
- Error messages from console
- Network tab screenshots
- Backend terminal output
