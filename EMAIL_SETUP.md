# Email Setup Instructions

## Gmail SMTP Configuration

### Step 1: Enable 2-Step Verification
1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to Security
3. Enable 2-Step Verification

### Step 2: Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" and "Other (Custom name)"
3. Enter "CourseShop" as the name
4. Click "Generate"
5. Copy the 16-character password

### Step 3: Update .env File
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
```

### Step 4: Install Dependencies
```bash
cd backend
npm install
```

## Email Features

### 1. Purchase Confirmation Email
- Sent to student after successful course purchase
- Includes: Student name, Course name, Amount paid
- Triggered automatically on payment confirmation

### 2. Course Approval Email
- Sent to educator when admin approves their course
- Includes: Educator name, Course name, Approval message
- Triggered automatically when admin clicks "Approve"

## Testing
After configuration, test by:
1. Student purchasing a course (check student email)
2. Admin approving a course (check educator email)

## Troubleshooting
- Ensure 2-Step Verification is enabled
- Use App Password, not regular Gmail password
- Check spam folder if emails not received
- Verify EMAIL_USER and EMAIL_PASS in .env file
