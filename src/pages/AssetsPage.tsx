import { useState } from "react";
import { Plus, FileSpreadsheet, Download, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { AppLayout } from "@/components/AppLayout";
import { TopBar } from "@/components/TopBar";
import { StatusBadge } from "@/components/StatusBadge";
import { assets, buildings, floors, AssetStatus, assetTypes, Asset } from "@/data/mock";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AddAssetDialog } from "@/components/AddAssetDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

export default function AssetsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [buildingFilter, setBuildingFilter] = useState<string>("all");
  const [floorFilter, setFloorFilter] = useState<string>("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [qrAsset, setQrAsset] = useState<Asset | null>(null);

  const availableFloors = buildingFilter !== "all"
    ? floors.filter((f) => f.buildingId === buildingFilter)
    : [];

  const filtered = assets.filter((a) => {
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    if (buildingFilter !== "all" && a.buildingId !== buildingFilter) return false;
    if (floorFilter !== "all" && a.floorId !== floorFilter) return false;
    return true;
  });

  const handleBuildingChange = (value: string) => {
    setBuildingFilter(value);
    setFloorFilter("all");
  };

  const handleImport = () => {
    if (!importFile) return;
    toast({ title: "Import Started", description: `Importing assets from ${importFile.name}...` });
    setImportDialogOpen(false);
    setImportFile(null);
  };

  const handleDownloadTemplate = () => {
    const headers = ["Name", "Type", "Building", "Floor", "Status", "Description"];
    const example = ["Sample Asset", "HVAC", "Headquarters", "Ground Floor", "working", "Example description"];
    const csv = [headers.join(","), example.map((v) => `"${v}"`).join(",")].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "assets-template.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast({ title: "Template Downloaded", description: "Fill it in and import back." });
  };

  return (
    <AppLayout>
      <TopBar title="Assets" subtitle="All assets across buildings" />
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
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
          <Select value={buildingFilter} onValueChange={handleBuildingChange}>
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
          {buildingFilter !== "all" && availableFloors.length > 0 && (
            <Select value={floorFilter} onValueChange={setFloorFilter}>
              <SelectTrigger className="w-40 h-8 text-xs">
                <SelectValue placeholder="Floor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Floors</SelectItem>
                {availableFloors.map((f) => (
                  <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="h-8 text-xs gap-1.5 ml-auto">
                <Plus className="w-3.5 h-3.5" /> Add Asset
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setAddDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" /> Add Asset Manually
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setImportDialogOpen(true)}>
                <FileSpreadsheet className="w-4 h-4 mr-2" /> Import from Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownloadTemplate}>
                <Download className="w-4 h-4 mr-2" /> Download Excel Template
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <span className="text-xs text-muted-foreground">{filtered.length} assets</span>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["Asset", "Type", "Building", "Floor", "Status", "Last Updated", "Updated By", "QR Code"].map((h) => (
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
                    <td className="px-4 py-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 gap-1.5 text-xs"
                        onClick={() => setQrAsset(asset)}
                      >
                        <QrCode className="w-3.5 h-3.5" /> View
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AddAssetDialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} onSubmit={() => setAddDialogOpen(false)} />

      {/* Import from Excel Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import Assets from Excel</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              Upload an Excel file (.xlsx) with columns: Name, Type, Building, Floor, Status.
            </p>
            <div className="space-y-2">
              <Label htmlFor="excel-file">Excel File</Label>
              <Input
                id="excel-file"
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                className="text-xs"
              />
            </div>
            {importFile && (
              <p className="text-xs text-muted-foreground">
                Selected: <span className="font-medium text-foreground">{importFile.name}</span>
              </p>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => { setImportDialogOpen(false); setImportFile(null); }}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleImport} disabled={!importFile}>
                <FileSpreadsheet className="w-4 h-4 mr-1.5" /> Import
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
