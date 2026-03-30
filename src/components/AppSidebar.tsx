import { Building2, ChevronDown, ChevronRight, LayoutDashboard, FileBarChart, Users, Layers } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { buildings, floors } from "@/data/mock";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedBuilding, setExpandedBuilding] = useState<string | null>("b1");

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/" },
    { label: "Reports", icon: FileBarChart, path: "/reports" },
    { label: "Users", icon: Users, path: "/users" },
  ];

  return (
    <aside className="w-64 min-h-screen bg-sidebar flex flex-col border-r border-sidebar-border shrink-0">
      {/* Logo */}
      <div className="h-14 flex items-center gap-2.5 px-5 border-b border-sidebar-border">
        <div className="w-7 h-7 rounded-lg bg-sidebar-primary flex items-center justify-center">
          <Layers className="w-4 h-4 text-sidebar-primary-foreground" />
        </div>
        <span className="text-sm font-semibold text-sidebar-accent-foreground tracking-tight">AssetVision</span>
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

        {/* Buildings section */}
        <div className="pt-4">
          <span className="px-3 text-[11px] font-semibold uppercase tracking-wider text-sidebar-muted">
            Buildings
          </span>
          <div className="mt-2 space-y-0.5">
            {buildings.map((building) => {
              const buildingFloors = floors.filter((f) => f.buildingId === building.id);
              const isExpanded = expandedBuilding === building.id;
              const isActive = location.pathname.startsWith(`/building/${building.id}`);

              return (
                <div key={building.id}>
                  <button
                    onClick={() => {
                      setExpandedBuilding(isExpanded ? null : building.id);
                      navigate(`/building/${building.id}`);
                    }}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <Building2 className="w-4 h-4 shrink-0" />
                    <span className="truncate flex-1 text-left">{building.name}</span>
                    {isExpanded ? <ChevronDown className="w-3.5 h-3.5 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
                  </button>

                  {isExpanded && (
                    <div className="ml-5 mt-0.5 space-y-0.5 border-l border-sidebar-border pl-3">
                      {buildingFloors.map((floor) => {
                        const floorActive = location.pathname === `/building/${building.id}/floor/${floor.id}`;
                        return (
                          <button
                            key={floor.id}
                            onClick={() => navigate(`/building/${building.id}/floor/${floor.id}`)}
                            className={cn(
                              "w-full text-left px-2.5 py-1.5 rounded-md text-[12px] transition-colors",
                              floorActive
                                ? "bg-sidebar-primary/20 text-sidebar-primary font-medium"
                                : "text-sidebar-muted hover:text-sidebar-accent-foreground"
                            )}
                          >
                            {floor.name}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
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
