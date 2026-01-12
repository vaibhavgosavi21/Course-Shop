# Course Shop
# Created Course Selling & Buying Platform using MERN

A production-ready, role-based Course Selling & Buying Platform built with React.js, Node.js, Express.js, and MongoDB Atlas.

## Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, Instructor, Student)
- Secure password hashing with bcrypt
- Protected routes based on user roles

### 👨‍💼 Admin Module
- Dashboard with statistics (students, instructors, courses, transactions)
- View all instructors and students
- Course approval/rejection system
- Notification system for instructors
- Transaction management
- Course removal capabilities

### 👨‍🏫 Instructor Module
- Course creation with image upload
- Course management (add, edit, update)
- Course approval status tracking
- Notification system for admin feedback
- Dashboard with course analytics

### 👨‍🎓 Student Module
- Browse approved courses
- Search courses by name
- Secure payment integration with Stripe
- Purchase history tracking
- Course access management

### 💳 Payment System
- Stripe payment integration
- Transaction tracking
- Payment success/failure handling
- Secure payment processing

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload
- **Stripe** - Payment processing

### Frontend
- **React.js** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Stripe Elements** - Payment UI
- **React Toastify** - Notifications
- **CSS3** - Styling

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Stripe account (for payments)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.mongodb.net/course-platform
   JWT_SECRET=your-super-secret-jwt-key-here
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
   NODE_ENV=development
   ```

4. **Create Admin User:**
   ```bash
   node createAdmin.js
   ```
   This creates an admin user with:
   - Email: admin@courseplatform.com
   - Password: admin123

5. **Start Backend Server:**
   ```bash
   npm run dev
   ```
   Server will run on http://localhost:5000

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create a `.env` file in the frontend directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
   ```

4. **Start Frontend Server:**
   ```bash
   npm start
   ```
   Application will run on http://localhost:3000

## Database Schema

### Users Collection
```javascript
{
  name: String (required, min: 3 chars),
  email: String (required, unique, valid email),
  mobile: String (required, exactly 10 digits),
  password: String (required, min: 6 chars, hashed),
  role: String (enum: ['admin', 'instructor', 'student']),
  createdAt: Date,
  updatedAt: Date
}
```

### Courses Collection
```javascript
{
  courseName: String (required),
  price: Number (required, min: 0),
  imageUrl: String (required),
  instructorId: ObjectId (ref: User),
  status: String (enum: ['pending', 'approved', 'rejected'], default: 'pending'),
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection
```javascript
{
  studentId: ObjectId (ref: User),
  courseId: ObjectId (ref: Course),
  paymentId: String (required),
  amount: Number (required),
  status: String (enum: ['success', 'failed']),
  createdAt: Date,
  updatedAt: Date
}
```

### Notifications Collection
```javascript
{
  instructorId: ObjectId (ref: User),
  message: String (required),
  status: String (enum: ['read', 'unread'], default: 'unread'),
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Admin Routes (Protected)
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/instructors` - Get all instructors
- `GET /api/admin/students` - Get all students
- `GET /api/admin/courses/pending` - Get pending courses
- `PUT /api/admin/courses/:id/approve` - Approve course
- `PUT /api/admin/courses/:id/reject` - Reject course
- `DELETE /api/admin/courses/:id` - Remove course
- `GET /api/admin/transactions` - Get all transactions

### Instructor Routes (Protected)
- `POST /api/instructor/courses` - Add new course
- `GET /api/instructor/courses` - Get instructor's courses
- `PUT /api/instructor/courses/:id` - Update course
- `GET /api/instructor/notifications` - Get notifications
- `PUT /api/instructor/notifications/:id/read` - Mark notification as read

### Student Routes (Protected)
- `GET /api/student/courses` - Get approved courses
- `POST /api/student/payment/create-intent` - Create payment intent
- `POST /api/student/payment/confirm` - Confirm payment
- `GET /api/student/purchases` - Get purchase history

## User Roles & Permissions

### Admin
- ✅ Login only (no registration)
- ✅ View dashboard statistics
- ✅ Manage instructors and students
- ✅ Approve/reject courses
- ✅ Send notifications to instructors
- ✅ View all transactions
- ✅ Remove courses

### Instructor
- ✅ Register and login
- ✅ Add/edit courses with image upload
- ✅ View course approval status
- ✅ Receive admin notifications
- ✅ View own courses only

### Student
- ✅ Register and login
- ✅ Browse approved courses
- ✅ Search courses by name
- ✅ Purchase courses with Stripe
- ✅ View purchase history
- ✅ Access purchased courses

## Security Features

- **Password Hashing:** bcrypt with salt rounds
- **JWT Authentication:** Secure token-based auth
- **Role-based Access Control:** Route protection by user role
- **Input Validation:** Server-side and client-side validation
- **File Upload Security:** Image file type validation
- **CORS Protection:** Cross-origin request handling
- **Environment Variables:** Sensitive data protection

## Payment Integration

The platform uses Stripe for secure payment processing:

1. **Payment Intent Creation:** Server creates payment intent
2. **Client-side Payment:** React Stripe Elements for card input
3. **Payment Confirmation:** Server confirms payment status
4. **Transaction Recording:** All transactions stored in database
5. **Course Access:** Automatic course access on successful payment

## Validation Rules

### Registration
- **Name:** Minimum 3 characters
- **Mobile:** Exactly 10 digits
- **Email:** Valid email format
- **Password:** Minimum 6 characters

### Course Creation
- **Course Name:** Required
- **Price:** Required, non-negative number
- **Image:** Required image file (max 5MB)

## Error Handling

- **Global Error Middleware:** Centralized error handling
- **Validation Errors:** Detailed validation messages
- **Authentication Errors:** Clear auth failure messages
- **Payment Errors:** Stripe error handling
- **File Upload Errors:** File validation messages

## Default Admin Credentials

After running the admin seeder:
- **Email:** admin@courseplatform.com
- **Password:** admin123

## Production Deployment

### Backend Deployment
1. Set production environment variables
2. Use production MongoDB Atlas cluster
3. Configure production Stripe keys
4. Set secure JWT secret
5. Enable HTTPS

### Frontend Deployment
1. Build production bundle: `npm run build`
2. Configure production API URLs
3. Set production Stripe publishable key
4. Deploy to hosting service (Netlify, Vercel, etc.)

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team.
