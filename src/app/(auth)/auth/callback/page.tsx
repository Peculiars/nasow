import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function AuthCallback() {
  const { getPermission, getUser } = getKindeServerSession();
  const user = await getUser();
  const adminAccess = await getPermission("admin:access");

  if (adminAccess?.isGranted) {
    redirect("/admin");
  } else {
    redirect("/portal");
  }

  return null;
}