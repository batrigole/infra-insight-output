import { Sidebar } from "@/components/Sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        {children ?? <Outlet />}
      </main>
    </div>
  );
};

export default DashboardLayout;
