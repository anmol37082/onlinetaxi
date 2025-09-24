import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // app password recommended
  },
});

export async function sendOtpEmail(toEmail, code) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: `Your OTP code`,
    text: `Your OTP code is: ${code}. It will expire in 5 minutes.`,
    html: `<p>Your OTP code is: <b>${code}</b></p><p>It will expire in 5 minutes.</p>`,
  };

  return transporter.sendMail(mailOptions);
}

export async function sendBookingCancellationEmail(bookingData) {
  const { userEmail, userName, bookingReference, title, travelDate, cancelledAt } = bookingData;

  const formattedDate = new Date(travelDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formattedCancelledDate = new Date(cancelledAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `Booking Cancelled - ${bookingReference}`,
    text: `
Dear ${userName},

We regret to inform you that your booking has been cancelled.

Booking Details:
- Reference: ${bookingReference}
- Service: ${title}
- Original Travel Date: ${formattedDate}
- Cancelled At: ${formattedCancelledDate}

Reason: Your booking has been cancelled because it's not available. We sincerely apologize for any inconvenience this may have caused.

Please book for another date that suits your schedule. We would be happy to assist you with new booking arrangements.

If you have any questions or need assistance with rebooking, please don't hesitate to contact us. We're here to help!

We apologize again for the inconvenience.

Best regards,
Online Taxi Team
    `,
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #e74c3c;">❌ Booking Cancelled</h2>
  <p>Dear ${userName},</p>

  <p>We regret to inform you that your booking has been cancelled.</p>

  <div style="background-color: #fff5f5; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #e74c3c;">
    <h3 style="margin-top: 0; color: #333;">Booking Details:</h3>
    <p><strong>Reference:</strong> ${bookingReference}</p>
    <p><strong>Service:</strong> ${title}</p>
    <p><strong>Original Travel Date:</strong> ${formattedDate}</p>
    <p><strong>Cancelled At:</strong> ${formattedCancelledDate}</p>
  </div>

  <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <h3 style="margin-top: 0; color: #e74c3c;">Reason for Cancellation:</h3>
    <p style="margin-bottom: 0;">Your booking has been cancelled because it's not available. We sincerely apologize for any inconvenience this may have caused.</p>
  </div>

  <p><strong>Please book for another date</strong> that suits your schedule. We would be happy to assist you with new booking arrangements.</p>

  <p>If you have any questions or need assistance with rebooking, please don't hesitate to contact us. We're here to help!</p>

  <p>We apologize again for the inconvenience.</p>

  <p>Best regards,<br><strong>Online Taxi Team</strong></p>
</div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

export async function sendTripStartedEmail(bookingData) {
  const { userEmail, userName, bookingReference, title, travelDate, driverName, driverPhone } = bookingData;

  const formattedDate = new Date(travelDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `Trip Started - ${bookingReference}`,
    text: `
Dear ${userName},

Great news! Your trip has started!

Trip Details:
- Reference: ${bookingReference}
- Service: ${title}
- Travel Date: ${formattedDate}
${driverName ? `- Driver: ${driverName}` : ''}
${driverPhone ? `- Driver Contact: ${driverPhone}` : ''}

Your driver is on the way. Please be ready at your pickup location.

If you have any questions, feel free to contact us.

Safe travels!
Online Taxi Team
    `,
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #27ae60;">🚗 Trip Started!</h2>
  <p>Dear ${userName},</p>

  <p>Great news! Your trip has started!</p>

  <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <h3 style="margin-top: 0; color: #333;">Trip Details:</h3>
    <p><strong>Reference:</strong> ${bookingReference}</p>
    <p><strong>Service:</strong> ${title}</p>
    <p><strong>Travel Date:</strong> ${formattedDate}</p>
    ${driverName ? `<p><strong>Driver:</strong> ${driverName}</p>` : ''}
    ${driverPhone ? `<p><strong>Driver Contact:</strong> ${driverPhone}</p>` : ''}
  </div>

  <p>Your driver is on the way. Please be ready at your pickup location.</p>

  <p>If you have any questions, feel free to contact us.</p>

  <p>Safe travels!<br>Online Taxi Team</p>
</div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

export async function sendTripCompletedEmail(bookingData) {
  const { userEmail, userName, bookingReference, title, travelDate, completedAt } = bookingData;

  const formattedDate = new Date(travelDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formattedCompletedDate = new Date(completedAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `Trip Completed - ${bookingReference}`,
    text: `
Dear ${userName},

Your trip has been completed successfully!

Trip Summary:
- Reference: ${bookingReference}
- Service: ${title}
- Travel Date: ${formattedDate}
- Completed At: ${formattedCompletedDate}

Thank you for choosing our taxi service! We hope you had a pleasant journey.

We would love to hear your feedback. Please consider leaving a review on our website.

If you need to book another trip or have any questions, don't hesitate to contact us.

Best regards,
Online Taxi Team
    `,
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #2ecc71;">✅ Trip Completed!</h2>
  <p>Dear ${userName},</p>

  <p>Your trip has been completed successfully!</p>

  <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <h3 style="margin-top: 0; color: #333;">Trip Summary:</h3>
    <p><strong>Reference:</strong> ${bookingReference}</p>
    <p><strong>Service:</strong> ${title}</p>
    <p><strong>Travel Date:</strong> ${formattedDate}</p>
    <p><strong>Completed At:</strong> ${formattedCompletedDate}</p>
  </div>

  <p>Thank you for choosing our taxi service! We hope you had a pleasant journey.</p>

  <p>We would love to hear your feedback. Please consider leaving a review on our website.</p>

  <p>If you need to book another trip or have any questions, don't hesitate to contact us.</p>

  <p>Best regards,<br>Online Taxi Team</p>
</div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

export async function sendBookingConfirmationEmail(bookingData) {
  const { userEmail, userName, bookingReference, title, travelDate, status } = bookingData;

  const formattedDate = new Date(travelDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `Booking Confirmation - ${bookingReference}`,
    text: `
Dear ${userName},

Your booking has been confirmed!

Booking Details:
- Reference: ${bookingReference}
- Service: ${title}
- Travel Date: ${formattedDate}
- Status: ${status}

Thank you for choosing our taxi service. We look forward to serving you.

Best regards,
Online Taxi Team
    `,
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #333;">Booking Confirmation</h2>
  <p>Dear ${userName},</p>

  <p>Your booking has been confirmed!</p>

  <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <h3 style="margin-top: 0; color: #333;">Booking Details:</h3>
    <p><strong>Reference:</strong> ${bookingReference}</p>
    <p><strong>Service:</strong> ${title}</p>
    <p><strong>Travel Date:</strong> ${formattedDate}</p>
    <p><strong>Status:</strong> ${status}</p>
  </div>

  <p>Thank you for choosing our taxi service. We look forward to serving you.</p>

  <p>Best regards,<br>Online Taxi Team</p>
</div>
    `,
  };

  return transporter.sendMail(mailOptions);
}
