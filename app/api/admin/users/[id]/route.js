import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import userModel from "@/app/models/userModel";

export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;

    const deletedUser = await userModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "User deleted successfully." });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
