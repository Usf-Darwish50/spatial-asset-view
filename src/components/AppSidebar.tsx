import { Building2, LayoutDashboard, Box, Users, FileText, LogOut, Boxes } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import ntgLogo from "@/assets/ntg-logo.jpeg";
import { toast } from "@/hooks/use-toast";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/" },
    { label: "Buildings", icon: Building2, path: "/buildings" },
    { label: "Assets", icon: Box, path: "/assets" },
    { label: "Asset Types", icon: Boxes, path: "/asset-types" },
    { label: "Reports", icon: FileText, path: "/reports" },
    { label: "Users", icon: Users, path: "/users" },
  ];

  return (
    <aside className="w-64 min-h-screen bg-sidebar flex flex-col border-r border-sidebar-border shrink-0">
      {/* Account block — whose workspace you are viewing */}
      <div className="px-4 py-3 border-b border-sidebar-border">
        <p className="text-[10px] uppercase tracking-wider text-sidebar-muted mb-2">Account</p>
        <div className="flex items-center gap-2.5">
          <img src={ntgLogo} alt="NTG" className="h-9 w-9 rounded-md object-cover" />
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-sidebar-accent-foreground truncate">NTG</p>
            <p className="text-[11px] text-sidebar-muted truncate">Assets Vision Workspace</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={cn(
              "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors",
              location.pathname === item.path
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-sidebar-border bg-sidebar">
        <div className="flex items-center gap-2.5 px-3 py-2">
          <div className="w-7 h-7 rounded-full bg-sidebar-primary flex items-center justify-center text-[11px] font-semibold text-sidebar-primary-foreground">
            JS
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-sidebar-accent-foreground truncate">John Smith</p>
            <p className="text-[11px] text-sidebar-muted truncate">Admin</p>
          </div>
          <button
            onClick={() => {
              sessionStorage.removeItem("isAuthenticated");
              toast({ title: "Logged out", description: "You have been signed out." });
              navigate("/login", { replace: true });
            }}
            aria-label="Logout"
            title="Logout"
            className="p-1.5 rounded-md text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
        {/* Platform attribution */}
        <p className="px-3 pt-2 text-[10px] text-sidebar-muted text-center">
          Powered by <span className="font-semibold">Eazly One</span>
        </p>
      </div>
    </aside>
  );
}
