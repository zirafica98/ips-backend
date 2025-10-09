import nodemailer from 'nodemailer';

export const sendPaymentConfirmation = async (toEmail, orderId, amount) => {
  try {
    // 📫 Transport - koristiš svoj Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER, // tvoj Gmail (npr. ips.test.mail@gmail.com)
        pass: process.env.MAIL_PASS  // app password (ne pravi password)
      }
    });

    const mailOptions = {
      from: `"IPS Payments" <${process.env.MAIL_USER}>`,
      to: toEmail,
      subject: 'Potvrda o uspešnom plaćanju',
      html: `
        <h2>✅ Plaćanje uspešno</h2>
        <p>Hvala Vam na uplati.</p>
        <p><strong>Broj porudžbine:</strong> ${orderId}</p>
        <p><strong>Iznos:</strong> ${amount} RSD</p>
        <hr/>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Mail poslat:', info.response);
  } catch (error) {
    console.error('❌ Greška pri slanju maila:', error);
  }
};
