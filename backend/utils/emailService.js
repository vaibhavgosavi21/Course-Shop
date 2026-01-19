const nodemailer = require('nodemailer');

let transporter;

// Initialize transporter
const initializeTransporter = async () => {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    // Use Gmail
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    console.log('✅ Email service: Gmail');
  } else {
    // Use Ethereal (test email service)
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    console.log('⚠️  Email service: Ethereal (Test Mode)');
    console.log('View emails at: https://ethereal.email/messages');
  }
};

initializeTransporter();

const sendPurchaseEmail = async (studentEmail, studentName, courseName, amount) => {
  const mailOptions = {
    from: process.env.EMAIL_USER || 'noreply@courseshop.com',
    to: studentEmail,
    subject: 'Course Purchase Successful - CourseShop',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #28a745;">Purchase Successful!</h2>
        <p>Dear ${studentName},</p>
        <p>Thank you for your purchase. Your course enrollment has been confirmed.</p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Course Details:</h3>
          <p><strong>Course Name:</strong> ${courseName}</p>
          <p><strong>Amount Paid:</strong> $${amount}</p>
        </div>
        <p>You can now access your course from your dashboard.</p>
        <p>Happy Learning!</p>
        <hr style="margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">CourseShop - Professional IT Training Platform</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Purchase email sent to:', studentEmail);
    if (!process.env.EMAIL_USER) {
      console.log('👁️  Preview URL:', nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error('❌ Error sending purchase email:', error.message);
  }
};

const sendCourseApprovalEmail = async (instructorEmail, instructorName, courseName) => {
  const mailOptions = {
    from: process.env.EMAIL_USER || 'noreply@courseshop.com',
    to: instructorEmail,
    subject: 'Course Approved - CourseShop',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #28a745;">Course Approved!</h2>
        <p>Dear ${instructorName},</p>
        <p>Congratulations! Your course has been approved by the admin.</p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Course Details:</h3>
          <p><strong>Course Name:</strong> ${courseName}</p>
          <p><strong>Status:</strong> <span style="color: #28a745;">Approved</span></p>
        </div>
        <p>Your course is now live and available for students to purchase.</p>
        <p>Best of luck with your teaching!</p>
        <hr style="margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">CourseShop - Professional IT Training Platform</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Approval email sent to:', instructorEmail);
    if (!process.env.EMAIL_USER) {
      console.log('👁️  Preview URL:', nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error('❌ Error sending approval email:', error.message);
  }
};

const sendCourseRejectionEmail = async (instructorEmail, instructorName, courseName, reason) => {
  const mailOptions = {
    from: process.env.EMAIL_USER || 'noreply@courseshop.com',
    to: instructorEmail,
    subject: 'Course Update - CourseShop',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc3545;">Course Needs Revision</h2>
        <p>Dear ${instructorName},</p>
        <p>Your course requires some updates before it can be approved.</p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Course Details:</h3>
          <p><strong>Course Name:</strong> ${courseName}</p>
          <p><strong>Admin Feedback:</strong> ${reason}</p>
        </div>
        <p>Please review the feedback and update your course accordingly.</p>
        <hr style="margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">CourseShop - Professional IT Training Platform</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Rejection email sent to:', instructorEmail);
    if (!process.env.EMAIL_USER) {
      console.log('👁️  Preview URL:', nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error('❌ Error sending rejection email:', error.message);
  }
};

const sendWelcomeEmail = async (userEmail, userName, userRole) => {
  const roleMessages = {
    instructor: {
      title: 'Welcome to CourseShop - Start Teaching!',
      message: 'You can now create and manage your courses. Share your knowledge with students worldwide!',
      features: [
        'Create unlimited courses',
        'Upload course materials and images',
        'Track course approval status',
        'Receive notifications from admin',
        'Manage your course portfolio'
      ]
    },
    student: {
      title: 'Welcome to CourseShop - Start Learning!',
      message: 'Explore thousands of courses and enhance your skills with our expert instructors!',
      features: [
        'Browse approved courses',
        'Secure payment with Stripe',
        'Track your learning progress',
        'Access purchased courses anytime',
        'Search courses by category'
      ]
    }
  };

  const roleData = roleMessages[userRole];
  const featuresList = roleData.features.map(feature => `<li>${feature}</li>`).join('');

  const mailOptions = {
    from: process.env.EMAIL_USER || 'noreply@courseshop.com',
    to: userEmail,
    subject: roleData.title,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #007bff;">Welcome to CourseShop!</h2>
        <p>Dear ${userName},</p>
        <p>Thank you for joining CourseShop as ${userRole === 'instructor' ? 'an' : 'a'} <strong>${userRole}</strong>.</p>
        <p>${roleData.message}</p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">What you can do:</h3>
          <ul style="margin: 0; padding-left: 20px;">
            ${featuresList}
          </ul>
        </div>
        <p>Get started by logging into your account and exploring the platform.</p>
        <p>Happy ${userRole === 'instructor' ? 'Teaching' : 'Learning'}!</p>
        <hr style="margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">CourseShop - Professional IT Training Platform</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${userRole}:`, userEmail);
    if (!process.env.EMAIL_USER) {
      console.log('👁️  Preview URL:', nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error('❌ Error sending welcome email:', error.message);
  }
};

module.exports = {
  sendPurchaseEmail,
  sendCourseApprovalEmail,
  sendCourseRejectionEmail,
  sendWelcomeEmail
};
