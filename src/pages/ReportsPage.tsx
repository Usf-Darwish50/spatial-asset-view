import { useState } from "react";
import { Download } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { TopBar } from "@/components/TopBar";
import { StatusBadge } from "@/components/StatusBadge";
import { assets, buildings, floors, AssetStatus } from "@/data/mock";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export default function ReportsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [buildingFilter, setBuildingFilter] = useState<string>("all");

  const filtered = assets.filter((a) => {
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    if (buildingFilter !== "all" && a.buildingId !== buildingFilter) return false;
    return true;
  });

  return (
    <AppLayout>
      <TopBar title="Reports" subtitle="All assets across buildings" />
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Filters */}
        <div className="flex items-center gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 h-8 text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="working">Working</SelectItem>
              <SelectItem value="down">Down</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
          <Select value={buildingFilter} onValueChange={setBuildingFilter}>
            <SelectTrigger className="w-48 h-8 text-xs">
              <SelectValue placeholder="Building" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Buildings</SelectItem>
              {buildings.map((b) => (
                <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground ml-auto">{filtered.length} assets</span>
          <Button
            size="sm"
            className="h-8 text-xs gap-1.5"
            onClick={() => {
              const headers = ["Asset", "Type", "Building", "Floor", "Status", "Last Updated", "Updated By"];
              const rows = filtered.map((a) => {
                const b = buildings.find((x) => x.id === a.buildingId)?.name ?? "";
                const f = floors.find((x) => x.id === a.floorId)?.name ?? "";
                return [a.name, a.type, b, f, a.status, a.lastUpdated, a.updatedBy]
                  .map((v) => `"${String(v).replace(/"/g, '""')}"`)
                  .join(",");
              });
              const csv = [headers.join(","), ...rows].join("\n");
              const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = `report-${new Date().toISOString().slice(0, 10)}.csv`;
              link.click();
              URL.revokeObjectURL(url);
              toast({ title: "Report Exported", description: `${filtered.length} assets exported.` });
            }}
          >
            <Download className="w-3.5 h-3.5" /> Export Report
          </Button>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["Asset", "Type", "Building", "Floor", "Status", "Last Updated", "Updated By"].map((h) => (
                  <th key={h} className="text-left px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((asset) => {
                const building = buildings.find((b) => b.id === asset.buildingId);
                const floor = floors.find((f) => f.id === asset.floorId);
                return (
                  <tr key={asset.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-[13px] font-medium text-card-foreground">{asset.name}</td>
                    <td className="px-4 py-3 text-[12px] text-muted-foreground">{asset.type}</td>
                    <td className="px-4 py-3 text-[12px] text-muted-foreground">{building?.name}</td>
                    <td className="px-4 py-3 text-[12px] text-muted-foreground">{floor?.name}</td>
                    <td className="px-4 py-3"><StatusBadge status={asset.status} size="sm" /></td>
                    <td className="px-4 py-3 text-[12px] text-muted-foreground">
                      {new Date(asset.lastUpdated).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-muted-foreground">{asset.updatedBy}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
