import AdminSidebar from "@/src/features/admin/AdminSidebar";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getPermission } = getKindeServerSession();
  const adminAccess = await getPermission("admin:access");

  if (!adminAccess?.isGranted) {
    redirect("/");
  }

  return (
    <div>
        <AdminSidebar />
      <main>{children}</main>
    </div>
  );
}