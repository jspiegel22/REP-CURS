import AdminLogin from "@/components/admin/AdminLogin";

export default function AdminLoginPage() {
  const handleLoginSuccess = () => {
    // Navigate to admin dashboard on successful login
    window.location.href = "/admin";
  };

  return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
}