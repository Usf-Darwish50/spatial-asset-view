import { useNavigate } from "react-router-dom";
import { Building2, MapPin, Box, TrendingUp, AlertTriangle, Wrench, Fan, Laptop, Zap, HardHat, Car, Lock } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { TopBar } from "@/components/TopBar";
import { StatusBadge } from "@/components/StatusBadge";
import { buildings, assets, floors } from "@/data/mock";

export default function DashboardPage() {
  const navigate = useNavigate();

  const totalAssets = assets.length;
  const working = assets.filter((a) => a.status === "working").length;
  const down = assets.filter((a) => a.status === "down").length;
  const maintenance = assets.filter((a) => a.status === "maintenance").length;

  const recentlyUpdated = [...assets]
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
    .slice(0, 5);

  const stats = [
    { label: "Total Assets", value: totalAssets, icon: Box, color: "text-primary" },
    { label: "Working", value: working, icon: TrendingUp, color: "text-status-working" },
    { label: "Down", value: down, icon: AlertTriangle, color: "text-status-down" },
    { label: "Maintenance", value: maintenance, icon: Wrench, color: "text-status-maintenance" },
  ];

  return (
    <AppLayout>
      <TopBar title="Dashboard" subtitle="Overview of all buildings and assets" />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card rounded-xl p-4 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Buildings */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">Buildings</h2>
          <div className="grid grid-cols-2 gap-4">
            {buildings.map((building) => {
              const buildingFloors = floors.filter((f) => f.buildingId === building.id);
              const buildingAssets = assets.filter((a) => a.buildingId === building.id);
              const downCount = buildingAssets.filter((a) => a.status === "down").length;

              return (
                <button
                  key={building.id}
                  onClick={() => navigate(`/building/${building.id}`)}
                  className="bg-card rounded-xl p-5 border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all text-left group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    {downCount > 0 && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-status-down/10 text-status-down">
                        {downCount} down
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-card-foreground mb-1">{building.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                    <MapPin className="w-3 h-3" />
                    {building.address}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{buildingFloors.length} floors</span>
                    <span>{buildingAssets.length} assets</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Asset Types Overview */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">Asset Types</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {(() => {
              const globalTypeCounts: Record<string, number> = {};
              assets.forEach((a) => {
                globalTypeCounts[a.type] = (globalTypeCounts[a.type] || 0) + 1;
              });
              const typeIcons: Record<string, typeof Box> = {
                "HVAC": Wrench,
                "Electrical Panel": AlertTriangle,
                "Fire Extinguisher": AlertTriangle,
                "Security Camera": TrendingUp,
                "Elevator": TrendingUp,
                "Pipe Box": Box,
                "Water Heater": Wrench,
              };
              return Object.entries(globalTypeCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([type, count]) => {
                  const Icon = typeIcons[type] || Box;
                  return (
                    <div key={type} className="bg-card rounded-xl p-5 border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all group">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                          {count} total
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-card-foreground mb-1">{type}</h3>
                      <p className="text-xs text-muted-foreground">
                        Across {new Set(assets.filter((a) => a.type === type).map((a) => a.buildingId)).size} building(s)
                      </p>
                    </div>
                  );
                });
            })()}
          </div>
        </div>

        {/* Recently updated */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">Recently Updated</h2>
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Asset</th>
                  <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                  <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Updated</th>
                  <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">By</th>
                </tr>
              </thead>
              <tbody>
                {recentlyUpdated.map((asset) => (
                  <tr key={asset.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-[13px] font-medium text-card-foreground">{asset.name}</td>
                    <td className="px-4 py-3 text-[12px] text-muted-foreground">{asset.type}</td>
                    <td className="px-4 py-3"><StatusBadge status={asset.status} size="sm" /></td>
                    <td className="px-4 py-3 text-[12px] text-muted-foreground">
                      {new Date(asset.lastUpdated).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-muted-foreground">{asset.updatedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
