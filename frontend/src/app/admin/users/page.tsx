import { getUsers } from "@/services/admin/users";
import UserManagement from "./client";

export default async function UsersPage() {
  // Fetch users on the server
  const response = await getUsers();

  return (
    <div className="container">
      <h1 className="mb-4">User Management</h1>
      <UserManagement initialUsers={response.users} />
    </div>
  );
}
