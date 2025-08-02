import { NextResponse } from "next/server";
import userModel from "@/app/models/userModel";
import { transporter } from "@/lib/nodemailer";
import { PASSWORD_RESET_TEMPLATE } from "@/lib/emailTemplates"; // adjust this too

export async function POST(request) {
  try {
    const body = await request.json(); // ✅ Next.js way to get request body
    const { email } = body;

    if (!email) {
      return NextResponse.json({
        success: false,
        message: "Email is Required",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return NextResponse.json({ success: false, message: "User Not Found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000; // 10 minutes from now
    await user.save();
    console.log("✅ OTP saved to DB:", otp);

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace(
        "{{email}}",
        user.email
      ),
    };

    await transporter.sendMail(mailOption);

    return NextResponse.json({
      success: true,
      message: "OTP Sent To Your Email",
      otp, // 👈 for dev only
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
