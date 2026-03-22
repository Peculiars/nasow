import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { isAuthenticated } = getKindeServerSession();
  const isAuth = await isAuthenticated();
  
  return NextResponse.json({ isAuthenticated: isAuth });
}
