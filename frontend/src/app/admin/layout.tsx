import { redirect } from "next/navigation";
import { getCurrentUser } from "@/services/auth";
import UserRole from "@/enums/user-role";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication and admin role in SSR
  let user = null;
  try {
    const response = await getCurrentUser();
    user = response?.user;
  } catch {
    redirect("/auth/login");
  }

  if (!user || user.role !== UserRole.ADMIN) {
    redirect("/auth/login");
  }

  return children;
}
