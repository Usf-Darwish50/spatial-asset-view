import { useParams, useNavigate } from "react-router-dom";
import { Layers, Plus } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { TopBar } from "@/components/TopBar";
import { buildings, floors, assets } from "@/data/mock";
import { Button } from "@/components/ui/button";

export default function BuildingPage() {
  const { buildingId } = useParams();
  const navigate = useNavigate();
  const building = buildings.find((b) => b.id === buildingId);
  const buildingFloors = floors.filter((f) => f.buildingId === buildingId);

  if (!building) return <AppLayout><TopBar title="Not Found" /><div className="p-6 text-muted-foreground">Building not found.</div></AppLayout>;

  return (
    <AppLayout>
      <TopBar
        title={building.name}
        subtitle={building.address}
        actions={<Button size="sm" className="h-8 text-xs gap-1.5"><Plus className="w-3.5 h-3.5" />Add Floor</Button>}
      />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-3 gap-4">
          {buildingFloors.map((floor) => {
            const floorAssets = assets.filter((a) => a.floorId === floor.id);
            const downCount = floorAssets.filter((a) => a.status === "down").length;
            const maintenanceCount = floorAssets.filter((a) => a.status === "maintenance").length;

            return (
              <button
                key={floor.id}
                onClick={() => navigate(`/building/${buildingId}/floor/${floor.id}`)}
                className="bg-card rounded-xl p-5 border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all text-left group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Layers className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex gap-1.5">
                    {downCount > 0 && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-status-down/10 text-status-down">
                        {downCount} down
                      </span>
                    )}
                    {maintenanceCount > 0 && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-status-maintenance/10 text-status-maintenance">
                        {maintenanceCount} maint.
                      </span>
                    )}
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-card-foreground mb-1">{floor.name}</h3>
                <p className="text-xs text-muted-foreground">Level {floor.level} · {floorAssets.length} assets</p>
              </button>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
