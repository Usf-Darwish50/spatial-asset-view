import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, MapPin, Plus, Trash2 } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { TopBar } from "@/components/TopBar";
import { buildings as initialBuildings, floors, assets } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

export default function BuildingsPage() {
  const navigate = useNavigate();
  const [buildingsList, setBuildingsList] = useState(initialBuildings);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [floorsCount, setFloorsCount] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<typeof initialBuildings[number] | null>(null);

  const handleSubmit = () => {
    if (!name.trim()) return;
    const newBuilding = {
      id: `b${Date.now()}`,
      name: name.trim(),
      address: address.trim(),
      floorsCount: parseInt(floorsCount) || 0,
      assetsCount: 0,
    };
    setBuildingsList([...buildingsList, newBuilding]);
    toast({ title: "Building added", description: `${newBuilding.name} has been created.` });
    setName("");
    setAddress("");
    setFloorsCount("");
    setDialogOpen(false);
  };

  const targetFloors = deleteTarget ? floors.filter((f) => f.buildingId === deleteTarget.id) : [];
  const blockingFloors = targetFloors.filter((f) => assets.some((a) => a.floorId === f.id));
  const canDelete = blockingFloors.length === 0;

  const confirmDelete = () => {
    if (!deleteTarget) return;
    if (!canDelete) {
      toast({ title: "Delete failed", description: `${deleteTarget.name} has floors with assets.`, variant: "destructive" });
      setDeleteTarget(null);
      return;
    }
    setBuildingsList((prev) => prev.filter((b) => b.id !== deleteTarget.id));
    toast({ title: "Building deleted", description: `${deleteTarget.name} has been removed.` });
    setDeleteTarget(null);
  };

  return (
    <AppLayout>
      <TopBar
        title="Buildings"
        subtitle="Manage all buildings"
        actions={
          <Button size="sm" className="h-8 text-xs gap-1.5" onClick={() => setDialogOpen(true)}>
            <Plus className="w-3.5 h-3.5" /> Add Building
          </Button>
        }
      />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-2 gap-4">
          {buildingsList.map((building) => {
            const buildingFloors = floors.filter((f) => f.buildingId === building.id);
            const buildingAssets = assets.filter((a) => a.buildingId === building.id);
            const downCount = buildingAssets.filter((a) => a.status === "down").length;

            return (
              <div
                key={building.id}
                onClick={() => navigate(`/building/${building.id}`)}
                className="relative bg-card rounded-xl p-5 border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all text-left group cursor-pointer"
              >
                <button
                  title="Delete building"
                  onClick={(e) => { e.stopPropagation(); setDeleteTarget(building); }}
                  className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  {downCount > 0 && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-status-down/10 text-status-down mr-8">
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
              </div>
            );
          })}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Building</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Building Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Headquarters" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Address</label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="e.g. 123 Main St" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Number of Floors</label>
              <Input type="number" value={floorsCount} onChange={(e) => setFloorsCount(e.target.value)} placeholder="e.g. 5" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSubmit}>Add Building</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2">
                <p>
                  {canDelete
                    ? `This will permanently delete "${deleteTarget?.name}" and its ${targetFloors.length} floor(s).`
                    : `"${deleteTarget?.name}" can't be deleted because some of its floors contain assets.`}
                </p>
                {targetFloors.length > 0 && (
                  <div className="rounded-md border border-border bg-muted/40 p-2.5 max-h-40 overflow-auto">
                    <p className="text-[11px] font-semibold uppercase text-muted-foreground mb-1.5">Floors</p>
                    <ul className="space-y-1">
                      {targetFloors.map((f) => {
                        const count = assets.filter((a) => a.floorId === f.id).length;
                        return (
                          <li key={f.id} className="flex justify-between text-xs">
                            <span>{f.name}</span>
                            <span className={count > 0 ? "text-destructive font-medium" : "text-muted-foreground"}>
                              {count} asset{count === 1 ? "" : "s"}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
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
