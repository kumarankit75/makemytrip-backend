export const welcomeEmailTemplate = (name) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background: #f2f2f2; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; }
    .header { background: #008cff; padding: 30px; text-align: center; }
    .logo { font-size: 28px; font-weight: 800; }
    .logo span:nth-child(1) { color: #eb2026; }
    .logo span:nth-child(2) { color: #fff; }
    .logo span:nth-child(3) { color: #ffd700; }
    .body { padding: 30px; }
    .footer { background: #f2f2f2; padding: 20px; text-align: center; font-size: 12px; color: #999; }
    .btn { background: #eb2026; color: #fff; padding: 12px 30px; border-radius: 25px; text-decoration: none; font-weight: bold; display: inline-block; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">
        <span>make</span><span>my</span><span>trip</span>
      </div>
    </div>
    <div class="body">
      <h2 style="color:#333">Welcome, ${name}! 🎉</h2>
      <p style="color:#666">Thank you for joining MakeMyTrip. Your account has been created successfully.</p>
      <p style="color:#666">You can now search and book flights & hotels at the best prices!</p>
      <a href="${process.env.FRONTEND_URL}" class="btn">START EXPLORING</a>
    </div>
    <div class="footer">
      <p>© 2024 MakeMyTrip Clone. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

export const bookingConfirmationTemplate = (booking) => {
  const isFllight = booking.bookingType === "flight";
  const details = isFllight
    ? `
      <p><strong>Airline:</strong> ${booking.flight.airline} (${booking.flight.flightNumber})</p>
      <p><strong>Route:</strong> ${booking.flight.from} → ${booking.flight.to}</p>
      <p><strong>Departure:</strong> ${booking.flight.departure} | <strong>Arrival:</strong> ${booking.flight.arrival}</p>
      <p><strong>Duration:</strong> ${booking.flight.duration}</p>
    `
    : `
      <p><strong>Hotel:</strong> ${booking.hotel.name}</p>
      <p><strong>Location:</strong> ${booking.hotel.location}</p>
      <p><strong>Check In:</strong> ${booking.checkIn} | <strong>Check Out:</strong> ${booking.checkOut}</p>
      <p><strong>Rooms:</strong> ${booking.rooms}</p>
    `;

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background: #f2f2f2; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; }
    .header { background: #008cff; padding: 30px; text-align: center; }
    .logo { font-size: 28px; font-weight: 800; }
    .logo span:nth-child(1) { color: #eb2026; }
    .logo span:nth-child(2) { color: #fff; }
    .logo span:nth-child(3) { color: #ffd700; }
    .body { padding: 30px; }
    .booking-box { background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .price { color: #eb2026; font-size: 24px; font-weight: bold; }
    .footer { background: #f2f2f2; padding: 20px; text-align: center; font-size: 12px; color: #999; }
    p { color: #666; margin: 8px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">
        <span>make</span><span>my</span><span>trip</span>
      </div>
      <p style="color:#fff; margin-top:10px;">Booking Confirmed! 🎉</p>
    </div>
    <div class="body">
      <h2 style="color:#333">Your booking is confirmed!</h2>
      <p>Booking ID: <strong>${booking.bookingId}</strong></p>
      <div class="booking-box">
        <h3 style="color:#333; margin-top:0;">${isFllight ? "✈️ Flight Details" : "🏨 Hotel Details"}</h3>
        ${details}
      </div>
      <p>Total Amount: <span class="price">₹${booking.totalPrice.toLocaleString()}</span></p>
      <p style="color:#999; font-size:13px;">Thank you for booking with MakeMyTrip!</p>
    </div>
    <div class="footer">
      <p>© 2024 MakeMyTrip Clone. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
};

export const cancellationEmailTemplate = (booking) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background: #f2f2f2; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; }
    .header { background: #eb2026; padding: 30px; text-align: center; }
    .logo { font-size: 28px; font-weight: 800; color: #fff; }
    .body { padding: 30px; }
    .booking-box { background: #fff5f5; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #ffcccc; }
    .footer { background: #f2f2f2; padding: 20px; text-align: center; font-size: 12px; color: #999; }
    p { color: #666; margin: 8px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">makemytrip</div>
      <p style="color:#fff; margin-top:10px;">Booking Cancelled ❌</p>
    </div>
    <div class="body">
      <h2 style="color:#333">Your booking has been cancelled</h2>
      <div class="booking-box">
        <p>Booking ID: <strong>${booking.bookingId}</strong></p>
        <p>Amount: <strong>₹${booking.totalPrice.toLocaleString()}</strong></p>
        <p>Status: <strong style="color:#eb2026">Cancelled</strong></p>
      </div>
      <p>Your refund will be processed within <strong>5-7 business days</strong>.</p>
      <p style="color:#999; font-size:13px;">If you have any questions, please contact our support team.</p>
    </div>
    <div class="footer">
      <p>© 2024 MakeMyTrip Clone. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;