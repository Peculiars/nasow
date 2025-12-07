import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function getUser() {
  const { getUser } = getKindeServerSession();
  return await getUser();
}

export async function isAuthenticated() {
  const { isAuthenticated } = getKindeServerSession();
  return await isAuthenticated();
}

export async function getUserRoles() {
  const { getPermission } = getKindeServerSession();
  const adminAccess = await getPermission("admin:access");
  return {
    isAdmin: adminAccess?.isGranted || false,
  };
}

export async function requireAdmin() {
  const { isAdmin } = await getUserRoles();
  if (!isAdmin) {
    throw new Error("Unauthorized: Admin access required");
  }
  return true;
}