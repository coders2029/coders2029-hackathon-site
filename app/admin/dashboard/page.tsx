import { redirect } from "next/navigation";
import {
  isAdminAuthenticated,
  getAdminStats,
  getAdminTeams,
  getActivityLog,
} from "@/lib/admin-actions";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminDashboardPage() {
  const isAdmin = await isAdminAuthenticated();
  if (!isAdmin) redirect("/admin");

  const [stats, teams, activity] = await Promise.all([
    getAdminStats(),
    getAdminTeams(),
    getActivityLog(),
  ]);

  return (
    <AdminDashboardClient
      initialStats={stats}
      initialTeams={teams}
      initialActivity={activity}
    />
  );
}
