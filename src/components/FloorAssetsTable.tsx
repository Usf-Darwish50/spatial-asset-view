import { Asset } from "@/data/mock";
import { StatusBadge } from "@/components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloorAssetsTableProps {
  assets: Asset[];
  selectedAssetId?: string;
  onRowClick: (asset: Asset) => void;
  onUpdateStatus: (asset: Asset) => void;
  onAddToMap: (asset: Asset) => void;
}

export function FloorAssetsTable({
  assets,
  selectedAssetId,
  onRowClick,
  onUpdateStatus,
  onAddToMap,
}: FloorAssetsTableProps) {
  return (
    <div className="w-[380px] shrink-0 border-l border-border bg-card flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-card-foreground">Floor Assets</h3>
        <p className="text-[11px] text-muted-foreground mt-0.5">{assets.length} total</p>
      </div>
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-card z-10">
            <TableRow>
              <TableHead className="h-9 px-3 text-[11px]">Name</TableHead>
              <TableHead className="h-9 px-2 text-[11px]">Type</TableHead>
              <TableHead className="h-9 px-2 text-[11px]">Status</TableHead>
              <TableHead className="h-9 px-2 text-[11px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => {
              const onMap = asset.x !== undefined && asset.y !== undefined;
              return (
                <TableRow
                  key={asset.id}
                  onClick={() => onRowClick(asset)}
                  className={cn(
                    "cursor-pointer",
                    selectedAssetId === asset.id && "bg-muted/60"
                  )}
                >
                  <TableCell className="px-3 py-2 text-xs font-medium">{asset.name}</TableCell>
                  <TableCell className="px-2 py-2 text-xs text-muted-foreground">{asset.type}</TableCell>
                  <TableCell className="px-2 py-2">
                    <StatusBadge status={asset.status} size="sm" />
                  </TableCell>
                  <TableCell className="px-2 py-2">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        title="Update status"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateStatus(asset);
                        }}
                        className="p-1.5 rounded-md hover:bg-secondary transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                      <button
                        title={onMap ? "Already on map" : "Add to map"}
                        disabled={onMap}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!onMap) onAddToMap(asset);
                        }}
                        className={cn(
                          "p-1.5 rounded-md transition-colors",
                          onMap
                            ? "opacity-40 cursor-not-allowed"
                            : "hover:bg-secondary text-primary"
                        )}
                      >
                        <MapPin className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {assets.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-xs text-muted-foreground py-6">
                  No assets on this floor
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
