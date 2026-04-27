import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Boxes, Plus } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { TopBar } from "@/components/TopBar";
import { assets, assetTypes as initialTypes } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

export default function AssetTypesPage() {
  const navigate = useNavigate();
  const [types, setTypes] = useState<string[]>(initialTypes);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const handleAdd = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (types.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      toast({ title: "Type exists", description: `${trimmed} already exists.` });
      return;
    }
    setTypes([...types, trimmed]);
    toast({ title: "Asset type added", description: `${trimmed} has been created.` });
    setName("");
    setOpen(false);
  };

  return (
    <AppLayout>
      <TopBar
        title="Asset Types"
        subtitle="Manage all asset categories"
        actions={
          <Button size="sm" className="h-8 text-xs gap-1.5" onClick={() => setOpen(true)}>
            <Plus className="w-3.5 h-3.5" /> Add Asset Type
          </Button>
        }
      />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-2 gap-4">
          {types.map((type) => {
            const typeAssets = assets.filter((a) => a.type === type);
            const downCount = typeAssets.filter((a) => a.status === "down").length;
            const subCategories = new Set(typeAssets.map((a) => a.name)).size;

            return (
              <button
                key={type}
                onClick={() => navigate(`/asset-types/${encodeURIComponent(type)}`)}
                className="bg-card rounded-xl p-5 border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all text-left group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Boxes className="w-5 h-5 text-primary" />
                  </div>
                  {downCount > 0 && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-status-down/10 text-status-down">
                      {downCount} down
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-card-foreground mb-1">{type}</h3>
                <p className="text-xs text-muted-foreground mb-3">Asset category</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{typeAssets.length} assets</span>
                  <span>{subCategories} items</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Asset Type</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Type Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Furniture" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleAdd}>Add Type</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
