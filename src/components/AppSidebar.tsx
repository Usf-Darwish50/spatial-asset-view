import { Building2, LayoutDashboard, Box, Users } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import ntgLogo from "@/assets/ntg-logo.jpeg";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/" },
    { label: "Buildings", icon: Building2, path: "/buildings" },
    { label: "Assets", icon: Box, path: "/assets" },
    { label: "Users", icon: Users, path: "/users" },
  ];

  return (
    <aside className="w-64 min-h-screen bg-sidebar flex flex-col border-r border-sidebar-border shrink-0">
      {/* Logo */}
      <div className="h-14 flex items-center gap-2.5 px-5 border-b border-sidebar-border">
        <img src={ntgLogo} alt="NTG Clarity Networks" className="h-8 w-auto" />
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
      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-2.5 px-3 py-2">
          <div className="w-7 h-7 rounded-full bg-sidebar-primary flex items-center justify-center text-[11px] font-semibold text-sidebar-primary-foreground">
            JS
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-sidebar-accent-foreground truncate">John Smith</p>
            <p className="text-[11px] text-sidebar-muted truncate">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
