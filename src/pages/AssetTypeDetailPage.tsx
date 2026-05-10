import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { TopBar } from "@/components/TopBar";
import { assets, buildings } from "@/data/mock";
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

export default function AssetTypeDetailPage() {
  const { typeName = "" } = useParams();
  const navigate = useNavigate();
  const decoded = decodeURIComponent(typeName);
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<{ name: string; count: number } | null>(null);

  const typeAssets = assets.filter((a) => a.type === decoded);

  const grouped = typeAssets.reduce<Record<string, { count: number; buildingIds: Set<string> }>>((acc, a) => {
    if (!acc[a.name]) acc[a.name] = { count: 0, buildingIds: new Set() };
    acc[a.name].count += 1;
    acc[a.name].buildingIds.add(a.buildingId);
    return acc;
  }, {});

  const rows = Object.entries(grouped)
    .filter(([n]) => !hidden.has(n))
    .map(([name, info]) => ({
      name,
      count: info.count,
      buildings: Array.from(info.buildingIds)
        .map((id) => buildings.find((b) => b.id === id)?.name)
        .filter(Boolean)
        .join(", "),
    }));

  const canDelete = deleteTarget ? deleteTarget.count === 0 : false;

  const confirmDelete = () => {
    if (!deleteTarget) return;
    if (!canDelete) {
      toast({ title: "Delete failed", description: `${deleteTarget.name} still has ${deleteTarget.count} asset(s).`, variant: "destructive" });
      setDeleteTarget(null);
      return;
    }
    setHidden((prev) => new Set(prev).add(deleteTarget.name));
    toast({ title: "Subtype deleted", description: `${deleteTarget.name} has been removed.` });
    setDeleteTarget(null);
  };

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
                {["Item", "Count", "Building(s)", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No assets in this category yet.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.name} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-[13px] font-medium text-card-foreground">{r.name}</td>
                    <td className="px-4 py-3 text-[12px] text-muted-foreground">{r.count}</td>
                    <td className="px-4 py-3 text-[12px] text-muted-foreground">{r.buildings || "—"}</td>
                    <td className="px-4 py-3">
                      <button
                        title="Delete subtype"
                        onClick={() => setDeleteTarget({ name: r.name, count: r.count })}
                        className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              {canDelete
                ? `This will permanently delete the "${deleteTarget?.name}" subtype.`
                : `"${deleteTarget?.name}" can't be deleted because it still has ${deleteTarget?.count} asset(s) under it.`}
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
