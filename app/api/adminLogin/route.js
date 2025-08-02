import adminModel from "@/app/models/adminUserModel";
import connectToDatabase from "@/lib/db";
import { generateJWT } from "@/lib/jwt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectToDatabase();
    console.log("Connected to Database (Admin)");
    const { email, password } = await request.json();
    console.log("Received Data:", { email, password });
    const adminExist = await adminModel.findOne({ email });

    if (!adminExist) {
      return NextResponse.json({ error: "User Not Found" });
    }

    const isPasswordCorrect = (await adminExist.password) === password;

    if (!isPasswordCorrect) {
      return NextResponse.json({ error: "Invalid Password", status: 400 });
    }

const token = await generateJWT({ id: adminExist._id.toString(), role: "admin" });
    
    cookies().set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    
    return NextResponse.json({ message: "Login Successful", status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}
