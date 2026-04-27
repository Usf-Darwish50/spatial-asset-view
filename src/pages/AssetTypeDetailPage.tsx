import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { TopBar } from "@/components/TopBar";
import { assets, buildings } from "@/data/mock";
import { Button } from "@/components/ui/button";

export default function AssetTypeDetailPage() {
  const { typeName = "" } = useParams();
  const navigate = useNavigate();
  const decoded = decodeURIComponent(typeName);

  const typeAssets = assets.filter((a) => a.type === decoded);

  // Group by asset name -> { count, buildings: Set }
  const grouped = typeAssets.reduce<Record<string, { count: number; buildingIds: Set<string> }>>((acc, a) => {
    if (!acc[a.name]) acc[a.name] = { count: 0, buildingIds: new Set() };
    acc[a.name].count += 1;
    acc[a.name].buildingIds.add(a.buildingId);
    return acc;
  }, {});

  const rows = Object.entries(grouped).map(([name, info]) => ({
    name,
    count: info.count,
    buildings: Array.from(info.buildingIds)
      .map((id) => buildings.find((b) => b.id === id)?.name)
      .filter(Boolean)
      .join(", "),
  }));

  return (
    <AppLayout>
      <TopBar
        title={`Asset Type: ${decoded}`}
        subtitle={`${typeAssets.length} total assets in this category`}
        actions={
          <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5" onClick={() => navigate("/asset-types")}>
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </Button>
        }
      />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["Item", "Count", "Building(s)"].map((h) => (
                  <th key={h} className="text-left px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No assets in this category yet.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.name} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-[13px] font-medium text-card-foreground">{r.name}</td>
                    <td className="px-4 py-3 text-[12px] text-muted-foreground">{r.count}</td>
                    <td className="px-4 py-3 text-[12px] text-muted-foreground">{r.buildings || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
