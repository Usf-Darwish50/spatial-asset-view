import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { TopBar } from "@/components/TopBar";
import { LayoutCanvas } from "@/components/LayoutCanvas";
import { AssetDetailPanel } from "@/components/AssetDetailPanel";
import { AddAssetDialog } from "@/components/AddAssetDialog";
import { buildings, floors, assets as initialAssets, Asset, AssetStatus, AssetShape } from "@/data/mock";
import { Button } from "@/components/ui/button";

export default function FloorLayoutPage() {
  const { buildingId, floorId } = useParams();
  const navigate = useNavigate();
  const building = buildings.find((b) => b.id === buildingId);
  const floor = floors.find((f) => f.id === floorId);
  const [assetList, setAssetList] = useState<Asset[]>(initialAssets);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [placingMode, setPlacingMode] = useState(false);
  const [pendingAsset, setPendingAsset] = useState<{ name: string; type: string; description: string; shape: AssetShape; image: string } | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const floorAssets = assetList.filter((a) => a.floorId === floorId);

  const handleAssetClick = (asset: Asset) => setSelectedAsset(asset);

  const handleAssetMove = (assetId: string, x: number, y: number) => {
    setAssetList((prev) => prev.map((a) => (a.id === assetId ? { ...a, x, y } : a)));
    if (selectedAsset?.id === assetId) setSelectedAsset((prev) => prev ? { ...prev, x, y } : null);
  };

  const handleStatusChange = (assetId: string, status: AssetStatus, comment: string) => {
    setAssetList((prev) =>
      prev.map((a) =>
        a.id === assetId
          ? {
              ...a, status, lastUpdated: new Date().toISOString(), updatedBy: "John Smith",
              comments: [{ id: `c-${Date.now()}`, text: comment || `Status changed to ${status}`, author: "John Smith", timestamp: new Date().toISOString(), statusChange: { from: a.status, to: status } }, ...a.comments],
            }
          : a
      )
    );
    const updated = assetList.find((a) => a.id === assetId);
    if (updated && selectedAsset?.id === assetId) setSelectedAsset({ ...updated, status, lastUpdated: new Date().toISOString() });
  };

  const handleAddAssetSubmit = (data: { name: string; type: string; description: string; shape: AssetShape; image: string }) => {
    setPendingAsset(data);
    setShowAddDialog(false);
    setPlacingMode(true);
  };

  const handlePlaceAsset = (x: number, y: number) => {
    if (!pendingAsset || !buildingId || !floorId) return;
    const newAsset: Asset = {
      id: `a-${Date.now()}`,
      name: pendingAsset.name,
      type: pendingAsset.type,
      status: "working",
      shape: pendingAsset.shape,
      image: pendingAsset.image,
      description: pendingAsset.description,
      buildingId,
      floorId,
      x, y,
      lastUpdated: new Date().toISOString(),
      updatedBy: "John Smith",
      comments: [],
    };
    setAssetList((prev) => [...prev, newAsset]);
    setPlacingMode(false);
    setPendingAsset(null);
    setSelectedAsset(newAsset);
  };

  if (!building || !floor) {
    return <AppLayout><TopBar title="Not Found" /><div className="p-6 text-muted-foreground">Floor not found.</div></AppLayout>;
  }

  return (
    <AppLayout>
      <TopBar
        title={`${building.name} — ${floor.name}`}
        subtitle={`Level ${floor.level} · ${floorAssets.length} assets`}
        actions={
          <Button size="sm" className="h-8 text-xs gap-1.5" onClick={() => navigate(`/assets/new?building=${buildingId}&floor=${floorId}`)} disabled={placingMode}>
            <Plus className="w-3.5 h-3.5" />Add Asset
          </Button>
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
        {selectedAsset && (
          <AssetDetailPanel asset={selectedAsset} onClose={() => setSelectedAsset(null)} onStatusChange={handleStatusChange} />
        )}
      </div>
      <AddAssetDialog open={showAddDialog} onClose={() => setShowAddDialog(false)} onSubmit={handleAddAssetSubmit} />
    </AppLayout>
  );
}
