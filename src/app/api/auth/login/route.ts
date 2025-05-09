import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import dbConfig from "@/middlewares/db.config";
import jwt from "jsonwebtoken";
import User from "@/model/User";

dbConfig();

const generateToken = (data: object) => {
  return jwt.sign(data, process.env.JWT_SECRET!, { expiresIn: "1d" });
};

const setTokenCookie = (response: NextResponse, token: string) => {
  response.cookies.set("token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24,
  });
};

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { message: "Please fill all the fields", success: false },
      { status: 400 }
    );
  }
  // Check for admin login
  if (
    email === process.env.ADMIN_EMAIL ||
    (process.env.ADMIN_USER_ID && password === process.env.ADMIN_PASSWORD)
  ) {
    const data = {
      email: process.env.ADMIN_EMAIL,
      role: "admin",
      isAdminApproved: true,
      fullName: "Admin",
      profileImageUrl: "https://sesrcp.in/Uploads/Logo/1595215490.png",
    };
    const token = generateToken(data);
    const response = NextResponse.json({
      route: "/admin/dashboard",
      message: "Login Success",
      success: true,
      user: {
        email: process.env.ADMIN_EMAIL,
        role: "admin",
        isAdminApproved: true,
        name: "Admin",
        profileImageUrl: "https://sesrcp.in/Uploads/Logo/1595215490.png",
      },
    });
    setTokenCookie(response, token);
    return response;
  }

  // User login logic
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json(
      { message: "User not found", success: false },
      { status: 400 }
    );
  }
  const isPasswordValid = await bcryptjs.compare(password, user.password);

  if (isPasswordValid) {
    const data = {
      id: user._id,
      role: user.role,
      email: user.email,
      fullName: user.fullName,
    };
    const token = generateToken(data);
    const response = NextResponse.json({
      message: "Login Success",
      success: true,
      route: `/user/dashboard`,
      user,
    });
    setTokenCookie(response, token);
    return response;
  } else {
    return NextResponse.json(
      { message: "Invalid Credentials", success: false },
      { status: 400 }
    );
  }
}
