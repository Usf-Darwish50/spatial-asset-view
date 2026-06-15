import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Printer } from "lucide-react";
import { Asset } from "@/data/mock";
import { StatusBadge } from "@/components/StatusBadge";
import { buildings, floors } from "@/data/mock";

interface AssetDetailDialogProps {
  asset: Asset | null;
  open: boolean;
  onClose: () => void;
}

export function AssetDetailDialog({ asset, open, onClose }: AssetDetailDialogProps) {
  if (!asset) return null;

  const building = buildings.find((b) => b.id === asset.buildingId);
  const floor = floors.find((f) => f.id === asset.floorId);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const detailRows: { label: string; value: React.ReactNode }[][] = [
    [
      { label: "Code:", value: asset.code || "-" },
      { label: "Internal Code:", value: asset.internalCode || "-" },
    ],
    [
      { label: "Type:", value: asset.type || "-" },
      { label: "Subtype:", value: asset.subtype || "-" },
    ],
    [
      { label: "Status:", value: <StatusBadge status={asset.status} /> },
      { label: "Condition:", value: asset.condition || "-" },
    ],
    [
      { label: "Building:", value: building?.name || "-" },
      { label: "Floor:", value: floor?.name || "-" },
    ],
    [
      { label: "Serial Number:", value: asset.serialNumber || "-" },
      { label: "Model:", value: asset.model || "-" },
    ],
    [
      { label: "Assigned To:", value: asset.assignedTo || "-" },
      { label: "Assign Ticket:", value: asset.assignTicket || "-" },
    ],
    [
      { label: "Status Comment:", value: asset.statusComment || "-" },
      { label: "Description:", value: asset.description || "-" },
    ],
    [
      { label: "Owner:", value: asset.owner || "-" },
      { label: "Notes:", value: asset.notes || "-" },
    ],
    [
      { label: "Price:", value: asset.price ? `$${asset.price.toLocaleString()}` : "-" },
      { label: "Created At:", value: formatDate(asset.createdAt) },
    ],
    [
      { label: "Updated At:", value: formatDate(asset.lastUpdated) },
      { label: "Created By:", value: asset.createdBy || "-" },
    ],
  ];

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[720px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-border flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold text-foreground">
            {asset.name}
          </DialogTitle>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </DialogHeader>

        <div className="px-6 py-5 space-y-4 max-h-[65vh] overflow-y-auto">
          {detailRows.map((row, idx) => (
            <div key={idx} className="grid grid-cols-2 gap-x-8 gap-y-1">
              {row.map((item, j) => (
                <div key={j} className="flex items-start gap-1">
                  <span className="text-sm font-medium text-foreground shrink-0">{item.label}</span>
                  <span className="text-sm text-muted-foreground break-words">{item.value}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-border flex justify-end gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => window.print()}>
            <Printer className="w-3.5 h-3.5" /> Print
          </Button>
          <Button size="sm" className="text-xs" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
