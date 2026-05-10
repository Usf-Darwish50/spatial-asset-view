import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layers, Plus, Trash2 } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { TopBar } from "@/components/TopBar";
import { buildings, floors as initialFloors, assets } from "@/data/mock";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

export default function BuildingPage() {
  const { buildingId } = useParams();
  const navigate = useNavigate();
  const building = buildings.find((b) => b.id === buildingId);
  const [floorsList, setFloorsList] = useState(initialFloors);
  const [deleteTarget, setDeleteTarget] = useState<typeof initialFloors[number] | null>(null);

  if (!building) return <AppLayout><TopBar title="Not Found" /><div className="p-6 text-muted-foreground">Building not found.</div></AppLayout>;

  const buildingFloors = floorsList.filter((f) => f.buildingId === buildingId);
  const targetAssetCount = deleteTarget ? assets.filter((a) => a.floorId === deleteTarget.id).length : 0;
  const canDelete = targetAssetCount === 0;

  const confirmDelete = () => {
    if (!deleteTarget) return;
    if (!canDelete) {
      toast({ title: "Delete failed", description: `${deleteTarget.name} contains assets.`, variant: "destructive" });
      setDeleteTarget(null);
      return;
    }
    setFloorsList((prev) => prev.filter((f) => f.id !== deleteTarget.id));
    toast({ title: "Floor deleted", description: `${deleteTarget.name} has been removed.` });
    setDeleteTarget(null);
  };

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
              <div
                key={floor.id}
                onClick={() => navigate(`/building/${buildingId}/floor/${floor.id}`)}
                className="relative bg-card rounded-xl p-5 border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all text-left group cursor-pointer"
              >
                <button
                  title="Delete floor"
                  onClick={(e) => { e.stopPropagation(); setDeleteTarget(floor); }}
                  className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Layers className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex gap-1.5 mr-8">
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
              </div>
            );
          })}
        </div>
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              {canDelete
                ? `This will permanently delete "${deleteTarget?.name}" from ${building.name}.`
                : `"${deleteTarget?.name}" can't be deleted because it contains ${targetAssetCount} asset${targetAssetCount === 1 ? "" : "s"}.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={!canDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
