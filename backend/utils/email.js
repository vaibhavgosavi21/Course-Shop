const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendPurchaseEmail = async (studentEmail, studentName, courseName, amount) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: studentEmail,
    subject: 'Course Purchase Confirmation - CourseShop',
    html: `
      <h2>Purchase Successful!</h2>
      <p>Dear ${studentName},</p>
      <p>Thank you for purchasing <strong>${courseName}</strong>.</p>
      <p><strong>Amount Paid:</strong> ₹${amount}</p>
      <p>You can now access your course content from your dashboard.</p>
      <br>
      <p>Best regards,<br>CourseShop Team</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

const sendCourseApprovalEmail = async (instructorEmail, instructorName, courseName) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: instructorEmail,
    subject: 'Course Approved - CourseShop',
    html: `
      <h2>Course Approved!</h2>
      <p>Dear ${instructorName},</p>
      <p>Congratulations! Your course <strong>${courseName}</strong> has been approved and is now live on CourseShop.</p>
      <p>Students can now browse and purchase your course.</p>
      <br>
      <p>Best regards,<br>CourseShop Team</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendPurchaseEmail, sendCourseApprovalEmail };
