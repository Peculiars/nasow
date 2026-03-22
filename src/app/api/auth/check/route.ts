import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { isAuthenticated } = getKindeServerSession();
    const isAuth = await isAuthenticated();
    
    return NextResponse.json({ isAuthenticated: isAuth });
  } catch (error) {
    return NextResponse.json({ isAuthenticated: false });
  }
}

export const dynamic = 'force-dynamic';