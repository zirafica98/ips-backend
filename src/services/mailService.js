import nodemailer from 'nodemailer';
// Podaci firme (lako promenljivo)
export const COMPANY_INFO = {
  name: 'PILE S.Z.A.R',
  address: 'Ramska 7, 11000 Beograd',
  email: 'autoservispile2@gmail.com',
  pib: '100024510',
  mb: '54145560',
  account: '' // Dodaj broj računa kad budeš imao
};

// details: {
//   orderId, amount, paidAt, payerName, payerEmail, reference,
//   receiverName, receiverAccount, receiverAddress, method
// }
export const sendPaymentConfirmation = async (toEmail, details) => {
  try {
    // 📫 Transport - koristiš svoj Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER, // tvoj Gmail (npr. ips.test.mail@gmail.com)
        pass: process.env.MAIL_PASS  // app password (ne pravi password)
      }
    });

    const safe = (v, fallback = '—') => (v === undefined || v === null || v === '' ? fallback : v);
    const amountFmt = (amt) => {
      const n = Number(amt);
      return Number.isFinite(n)
        ? n.toLocaleString('sr-RS', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' RSD'
        : safe(amt);
    };

    const {
      orderId,
      amount,
      paidAt,
      payerName,
      payerEmail,
      reference,
      receiverName = COMPANY_INFO.name,
      receiverAccount = COMPANY_INFO.account,
      receiverAddress = COMPANY_INFO.address,
      method
    } = details || {};

    const paidAtStr = paidAt
      ? new Date(paidAt).toLocaleString('sr-RS')
      : new Date().toLocaleString('sr-RS');
    const paymentMethod = safe(method, 'IPS skeniraj');

    const html = `
      <div style="font-family: Arial, sans-serif; color:#222; max-width:640px; margin:0 auto;">
        <h2 style="color:#2e7d32;">✅ Uspešno plaćanje metodom ${paymentMethod}</h2>
        <p>Hvala Vam na uplati. U nastavku su detalji transakcije:</p>
        <table style="width:100%; border-collapse:collapse;">
          <tbody>
            <tr>
              <td style="padding:8px; border-bottom:1px solid #eee; color:#555;">Broj porudžbine</td>
              <td style="padding:8px; border-bottom:1px solid #eee; font-weight:600;">${safe(orderId)}</td>
            </tr>
            <tr>
              <td style="padding:8px; border-bottom:1px solid #eee; color:#555;">Iznos</td>
              <td style="padding:8px; border-bottom:1px solid #eee; font-weight:600;">${amountFmt(amount)}</td>
            </tr>
            <tr>
              <td style="padding:8px; border-bottom:1px solid #eee; color:#555;">Datum uplate</td>
              <td style="padding:8px; border-bottom:1px solid #eee; font-weight:600;">${paidAtStr}</td>
            </tr>
            <tr>
              <td style="padding:8px; border-bottom:1px solid #eee; color:#555;">Platilac</td>
              <td style="padding:8px; border-bottom:1px solid #eee; font-weight:600;">${safe(payerName)}</td>
            </tr>
            <tr>
              <td style="padding:8px; border-bottom:1px solid #eee; color:#555;">E-adresa platioca</td>
              <td style="padding:8px; border-bottom:1px solid #eee; font-weight:600;">${safe(payerEmail)}</td>
            </tr>
            <tr>
              <td style="padding:8px; border-bottom:1px solid #eee; color:#555;">Poziv na broj</td>
              <td style="padding:8px; border-bottom:1px solid #eee; font-weight:600;">${safe(reference)}</td>
            </tr>
            <tr>
              <td style="padding:8px; border-bottom:1px solid #eee; color:#555;">Primalac</td>
              <td style="padding:8px; border-bottom:1px solid #eee; font-weight:600;">${safe(receiverName)}</td>
            </tr>
            <tr>
              <td style="padding:8px; border-bottom:1px solid #eee; color:#555;">Adresa primaoca</td>
              <td style="padding:8px; border-bottom:1px solid #eee; font-weight:600;">${safe(receiverAddress)}</td>
            </tr>
            <tr>
              <td style="padding:8px; border-bottom:1px solid #eee; color:#555;">E-adresa primaoca</td>
              <td style="padding:8px; border-bottom:1px solid #eee; font-weight:600;">${safe(COMPANY_INFO.email)}</td>
            </tr>
            <tr>
              <td style="padding:8px; border-bottom:1px solid #eee; color:#555;">PIB primaoca</td>
              <td style="padding:8px; border-bottom:1px solid #eee; font-weight:600;">${safe(COMPANY_INFO.pib)}</td>
            </tr>
            <tr>
              <td style="padding:8px; border-bottom:1px solid #eee; color:#555;">Matični broj primaoca</td>
              <td style="padding:8px; border-bottom:1px solid #eee; font-weight:600;">${safe(COMPANY_INFO.mb)}</td>
            </tr>
            <tr>
              <td style="padding:8px; color:#555;">Broj računa primaoca</td>
              <td style="padding:8px; font-weight:600;">${safe(receiverAccount)}</td>
            </tr>
          </tbody>
        </table>
        <p style="color:#666; font-size:12px; margin-top:16px;">Ovo je automatski generisana poruka. Molimo ne odgovarajte na ovaj email.</p>
      </div>
    `;

    const mailOptions = {
      from: `"IPS Payments" <${process.env.MAIL_USER}>`,
      to: toEmail,
      subject: 'Potvrda o uspešnom plaćanju',
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Mail poslat:', info.response);
  } catch (error) {
    console.error('❌ Greška pri slanju maila:', error);
  }
};

export const sendPaymentFailure = async (toEmail, details) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
    });

    const safe = (v, fallback = '—') => (v === undefined || v === null || v === '' ? fallback : v);
    const amountFmt = (amt) => {
      const n = Number(amt);
      return Number.isFinite(n) ? `${n.toLocaleString('sr-RS')} RSD` : safe(amt);
    };

    const {
      orderId,
      amount,
      paidAt,
      payerName,
      payerEmail,
      reference,
      receiverName = COMPANY_INFO.name,
      receiverAccount = COMPANY_INFO.account,
      receiverAddress = COMPANY_INFO.address,
      method
    } = details || {};

    const atStr = paidAt ? new Date(paidAt).toLocaleString('sr-RS') : new Date().toLocaleString('sr-RS');
    const paymentMethod = safe(method, 'IPS skeniraj');

    const html = `
      <div style="font-family: Arial, sans-serif; color:#222; max-width:640px; margin:0 auto;">
        <h2 style="color:#d32f2f;">❌ Plaćanje ${paymentMethod} nije kompletirano</h2>
        <p>Proces plaćanja koje ste započeli metodom IPS skeniraj niste sproveli do kraja. Uplata koju ste pokušali nije izvršena.</p>
        <table style="width:100%; border-collapse:collapse;">
          <tbody>
            <tr><td style="padding:8px; border-bottom:1px solid #eee; color:#555;">Broj porudžbine</td><td style="padding:8px; border-bottom:1px solid #eee; font-weight:600;">${safe(orderId)}</td></tr>
            <tr><td style="padding:8px; border-bottom:1px solid #eee; color:#555;">Iznos</td><td style="padding:8px; border-bottom:1px solid #eee; font-weight:600;">${amountFmt(amount)}</td></tr>
            <tr><td style="padding:8px; border-bottom:1px solid #eee; color:#555;">Datum</td><td style="padding:8px; border-bottom:1px solid #eee; font-weight:600;">${atStr}</td></tr>
            <tr><td style="padding:8px; border-bottom:1px solid #eee; color:#555;">Platilac</td><td style="padding:8px; border-bottom:1px solid #eee; font-weight:600;">${safe(payerName)}</td></tr>
            <tr><td style="padding:8px; border-bottom:1px solid #eee; color:#555;">E-adresa platioca</td><td style="padding:8px; border-bottom:1px solid #eee; font-weight:600;">${safe(payerEmail)}</td></tr>
            <tr><td style="padding:8px; border-bottom:1px solid #eee; color:#555;">Poziv na broj</td><td style="padding:8px; border-bottom:1px solid #eee; font-weight:600;">${safe(reference)}</td></tr>
            <tr><td style="padding:8px; border-bottom:1px solid #eee; color:#555;">Primalac</td><td style="padding:8px; border-bottom:1px solid #eee; font-weight:600;">${safe(receiverName)}</td></tr>
            <tr><td style="padding:8px; border-bottom:1px solid #eee; color:#555;">Adresa primaoca</td><td style="padding:8px; border-bottom:1px solid #eee; font-weight:600;">${safe(receiverAddress)}</td></tr>
            <tr><td style="padding:8px; border-bottom:1px solid #eee; color:#555;">E-adresa primaoca</td><td style="padding:8px; border-bottom:1px solid #eee; font-weight:600;">${safe(COMPANY_INFO.email)}</td></tr>
            <tr><td style="padding:8px; border-bottom:1px solid #eee; color:#555;">PIB primaoca</td><td style="padding:8px; border-bottom:1px solid #eee; font-weight:600;">${safe(COMPANY_INFO.pib)}</td></tr>
            <tr><td style="padding:8px; border-bottom:1px solid #eee; color:#555;">Matični broj primaoca</td><td style="padding:8px; border-bottom:1px solid #eee; font-weight:600;">${safe(COMPANY_INFO.mb)}</td></tr>
            <tr><td style="padding:8px; color:#555;">Broj računa primaoca</td><td style="padding:8px; font-weight:600;">${safe(receiverAccount)}</td></tr>
          </tbody>
        </table>
        <p style="color:#666; font-size:12px; margin-top:16px;">Ovo je automatski generisana poruka. Molimo ne odgovarajte na ovaj email.</p>
      </div>
    `;

    const mailOptions = {
      from: `"IPS Payments" <${process.env.MAIL_USER}>`,
      to: toEmail,
      subject: 'Plaćanje nije kompletirano',
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Failure mail poslat:', info.response);
  } catch (error) {
    console.error('❌ Greška pri slanju failure maila:', error);
  }
};
