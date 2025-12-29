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
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <main
        className="
          lg:ml-64
          ml-0
          transition-all
          duration-300
        "
      >
        {children}
      </main>
    </div>
  );
}
