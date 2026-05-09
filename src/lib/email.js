import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function kirimEmailResetPassword(email, nama, kode) {
  await transporter.sendMail({
    from: `"Distro Merbabu" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Kode Reset Password - Distro Merbabu",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">

        <!-- Logo -->
        <div style="text-align: center; padding: 24px 0 16px;">
          <img
            src="${process.env.NEXTAUTH_URL}/merbabu.png"
            alt="Distro Merbabu"
            style="height: 64px; width: auto;"
          />
        </div>

        <!-- Garis pemisah -->
        <div style="border-top: 1px solid #eee; margin-bottom: 24px;"></div>

        <!-- Konten utama -->
        <div style="background: #f9f9f9; border-radius: 12px; padding: 28px;">
          <h2 style="color: #111; margin: 0 0 12px; font-size: 20px;">Reset Password</h2>
          <p style="color: #555; font-size: 14px; margin: 0 0 8px;">Halo <strong>${nama}</strong>,</p>
          <p style="color: #555; font-size: 14px; margin: 0 0 20px; line-height: 1.6;">
            Kami menerima permintaan reset password untuk akun kamu di
            <strong> Distro Merbabu</strong>. Gunakan kode berikut untuk membuat password baru:
          </p>

          <!-- Kode verifikasi -->
          <div style="background: #111; color: #fff; font-size: 34px; font-weight: bold; letter-spacing: 10px; text-align: center; padding: 22px; border-radius: 10px; margin: 0 0 20px;">
            ${kode}
          </div>

          <!-- Info expired -->
          <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 12px; text-align: center;">
            <p style="color: #856404; font-size: 13px; margin: 0;">
              ⏰ Kode berlaku selama <strong>15 menit</strong>
            </p>
          </div>
        </div>

        <!-- Peringatan -->
        <div style="background: #fff5f5; border: 1px solid #fed7d7; border-radius: 8px; padding: 12px; margin-top: 16px;">
          <p style="color: #c53030; font-size: 12px; margin: 0; text-align: center;">
            🔒 Jangan bagikan kode ini ke siapapun termasuk tim Distro Merbabu
          </p>
        </div>

        <!-- Footer email -->
        <div style="border-top: 1px solid #eee; margin-top: 24px; padding-top: 16px; text-align: center;">
          <img
            src="${process.env.NEXTAUTH_URL}/merbabu.png"
            alt="Distro Merbabu"
            style="height: 32px; width: auto; opacity: 0.4; margin-bottom: 8px;"
          />
          <p style="color: #aaa; font-size: 12px; margin: 0;">
            Kalau kamu tidak meminta reset password, abaikan email ini.
          </p>
          <p style="color: #aaa; font-size: 12px; margin: 4px 0 0;">
            © ${new Date().getFullYear()} Distro Merbabu. All rights reserved.
          </p>
        </div>

      </div>
    `,
  });
}
