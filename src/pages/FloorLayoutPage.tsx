import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Crosshair } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { TopBar } from "@/components/TopBar";
import { LayoutCanvas } from "@/components/LayoutCanvas";
import { AssetDetailPanel } from "@/components/AssetDetailPanel";
import { FloorAssetsTable } from "@/components/FloorAssetsTable";
import { UpdateStatusDialog } from "@/components/UpdateStatusDialog";
import { buildings, floors, assets as initialAssets, Asset, AssetStatus } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export default function FloorLayoutPage() {
  const { buildingId, floorId } = useParams();
  const navigate = useNavigate();
  const building = buildings.find((b) => b.id === buildingId);
  const floor = floors.find((f) => f.id === floorId);
  const [assetList, setAssetList] = useState<Asset[]>(initialAssets);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [placingMode, setPlacingMode] = useState(false);
  const [placingAssetId, setPlacingAssetId] = useState<string | null>(null);
  const [statusDialogAsset, setStatusDialogAsset] = useState<Asset | null>(null);

  const floorAssets = assetList.filter((a) => a.floorId === floorId);

  const handleAssetClick = (asset: Asset) => setSelectedAsset(asset);

  const handleAssetMove = (assetId: string, x: number, y: number) => {
    setAssetList((prev) => prev.map((a) => (a.id === assetId ? { ...a, x, y } : a)));
    if (selectedAsset?.id === assetId) setSelectedAsset((prev) => (prev ? { ...prev, x, y } : null));
  };

  const handleStatusChange = (assetId: string, status: AssetStatus, comment: string) => {
    setAssetList((prev) =>
      prev.map((a) =>
        a.id === assetId
          ? {
              ...a,
              status,
              lastUpdated: new Date().toISOString(),
              updatedBy: "John Smith",
              comments: [
                {
                  id: `c-${Date.now()}`,
                  text: comment || `Status changed to ${status}`,
                  author: "John Smith",
                  timestamp: new Date().toISOString(),
                  statusChange: { from: a.status, to: status },
                },
                ...a.comments,
              ],
            }
          : a
      )
    );
    if (selectedAsset?.id === assetId) {
      setSelectedAsset((prev) => (prev ? { ...prev, status, lastUpdated: new Date().toISOString() } : null));
    }
    toast({ title: "Status updated", description: `Asset status set to ${status}.` });
  };

  const handleAddToMap = (asset: Asset) => {
    setPlacingAssetId(asset.id);
    setPlacingMode(true);
    setSelectedAsset(null);
    toast({ title: "Placement mode", description: `Click on the map to place ${asset.name}.` });
  };

  const handlePlaceAsset = (x: number, y: number) => {
    if (!placingAssetId) return;
    setAssetList((prev) => prev.map((a) => (a.id === placingAssetId ? { ...a, x, y } : a)));
    const placed = assetList.find((a) => a.id === placingAssetId);
    setPlacingMode(false);
    setPlacingAssetId(null);
    if (placed) {
      setSelectedAsset({ ...placed, x, y });
      toast({ title: "Asset placed", description: `${placed.name} added to the map.` });
    }
  };

  const cancelPlacing = () => {
    setPlacingMode(false);
    setPlacingAssetId(null);
  };

  if (!building || !floor) {
    return (
      <AppLayout>
        <TopBar title="Not Found" />
        <div className="p-6 text-muted-foreground">Floor not found.</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <TopBar
        title={`${building.name} — ${floor.name}`}
        subtitle={`Level ${floor.level} · ${floorAssets.length} assets`}
        actions={
          placingMode ? (
            <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5" onClick={cancelPlacing}>
              <Crosshair className="w-3.5 h-3.5" />
              Cancel placement
            </Button>
          ) : (
            <Button
              size="sm"
              className="h-8 text-xs gap-1.5"
              onClick={() => navigate(`/assets/new?building=${buildingId}&floor=${floorId}`)}
            >
              <Plus className="w-3.5 h-3.5" />
              Add Asset
            </Button>
          )
        }
      />
      <div className="flex-1 flex overflow-hidden">
        <LayoutCanvas
          assets={floorAssets}
          onAssetClick={handleAssetClick}
          onAssetMove={handleAssetMove}
          selectedAssetId={selectedAsset?.id}
          placingMode={placingMode}
          onPlaceAsset={handlePlaceAsset}
        />
        <FloorAssetsTable
          assets={floorAssets}
          selectedAssetId={selectedAsset?.id}
          onRowClick={handleAssetClick}
          onUpdateStatus={(a) => setStatusDialogAsset(a)}
          onAddToMap={handleAddToMap}
        />
        {selectedAsset && (
          <AssetDetailPanel
            asset={selectedAsset}
            onClose={() => setSelectedAsset(null)}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
      <UpdateStatusDialog
        asset={statusDialogAsset}
        open={!!statusDialogAsset}
        onClose={() => setStatusDialogAsset(null)}
        onSubmit={handleStatusChange}
      />
    </AppLayout>
  );
}
