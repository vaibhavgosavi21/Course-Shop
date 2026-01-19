# Email Setup Guide for CourseShop

## Gmail Configuration for Nodemailer

### Step 1: Enable 2-Step Verification
1. Go to your Google Account: https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Under "Signing in to Google", click on "2-Step Verification"
4. Follow the steps to enable 2-Step Verification

### Step 2: Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" as the app
3. Select "Other (Custom name)" as the device
4. Enter "CourseShop" as the name
5. Click "Generate"
6. Copy the 16-character password (remove spaces)

### Step 3: Update .env File
Add these lines to your `backend/.env` file:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
```

Example:
```env
EMAIL_USER=vaibhavgosavi2003@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
```

### Step 4: Test Email
Run the backend server and test:
- Purchase a course as a student
- Approve a course as admin

You should receive emails for both actions.

## Troubleshooting

### Error: "Invalid login"
- Make sure you're using App Password, not your regular Gmail password
- Verify 2-Step Verification is enabled
- Check if EMAIL_USER and EMAIL_PASS are correct in .env

### Error: "Connection timeout"
- Check your internet connection
- Verify Gmail is not blocked by firewall
- Try using a different network

### Emails not sending
- Check backend console for error messages
- Verify EMAIL_USER and EMAIL_PASS in .env
- Make sure nodemailer is installed: `npm install nodemailer`

## Email Features Implemented

1. **Purchase Confirmation Email**
   - Sent to student after successful course purchase
   - Contains course name and amount paid

2. **Course Approval Email**
   - Sent to instructor when admin approves their course
   - Contains course name and approval status

3. **Course Rejection Email**
   - Sent to instructor when admin rejects their course
   - Contains course name and rejection reason

## Security Notes

- Never commit .env file to Git
- Keep your App Password secure
- Use environment variables for sensitive data
- Regularly rotate App Passwords
