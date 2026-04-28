import { useState, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { buildings, floors, assetTypes, AssetStatus } from "@/data/mock";
import { toast } from "@/hooks/use-toast";

export default function AddAssetPage() {
  const navigate = useNavigate();
  const { buildingId: routeBuildingId, floorId: routeFloorId } = useParams();
  const [searchParams] = useSearchParams();
  const qpBuilding = searchParams.get("building") || routeBuildingId || "";
  const qpFloor = searchParams.get("floor") || routeFloorId || "";

  const fromFloor = Boolean(qpBuilding && qpFloor);

  const [buildingId, setBuildingId] = useState(qpBuilding);
  const [floorId, setFloorId] = useState(qpFloor);
  const [owner, setOwner] = useState("");
  const [model, setModel] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState<AssetStatus>("working");
  const [serialNumber, setSerialNumber] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const availableFloors = useMemo(
    () => (buildingId ? floors.filter((f) => f.buildingId === buildingId) : []),
    [buildingId]
  );

  const building = buildings.find((b) => b.id === buildingId);
  const floor = floors.find((f) => f.id === floorId);

  const handleBuildingChange = (v: string) => {
    setBuildingId(v);
    setFloorId("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const canSubmit = owner.trim() && model.trim() && type && status;

  const handleBack = () => {
    if (fromFloor) {
      navigate(`/building/${qpBuilding}/floor/${qpFloor}`);
    } else {
      navigate("/assets");
    }
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    toast({ title: "Asset added", description: `${model} has been created.` });
    handleBack();
  };

  return (
    <AppLayout>
      <TopBar
        title="Add Asset"
        subtitle={fromFloor && building && floor ? `${building.name} — ${floor.name}` : "Create a new asset"}
        actions={
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={handleBack}>
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </Button>
        }
      />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-5">
          {/* Building + Floor */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Building</Label>
              <Select value={buildingId} onValueChange={handleBuildingChange} disabled={fromFloor}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select building" />
                </SelectTrigger>
                <SelectContent>
                  {buildings.map((b) => (
                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Floor</Label>
              <Select value={floorId} onValueChange={setFloorId} disabled={fromFloor || !buildingId}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder={buildingId ? "Select floor" : "Select building first"} />
                </SelectTrigger>
                <SelectContent>
                  {availableFloors.map((f) => (
                    <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Owner + Model (required) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Owner <span className="text-destructive">*</span></Label>
              <Input value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="Enter owner" className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Model <span className="text-destructive">*</span></Label>
              <Input value={model} onChange={(e) => setModel(e.target.value)} placeholder="Enter model" className="h-9 text-sm" />
            </div>
          </div>

          {/* Type + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Type <span className="text-destructive">*</span></Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {assetTypes.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Status <span className="text-destructive">*</span></Label>
              <Select value={status} onValueChange={(v) => setStatus(v as AssetStatus)}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="working">Working</SelectItem>
                  <SelectItem value="down">Down</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Serial + Price (optional) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Serial Number</Label>
              <Input value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} placeholder="Enter serial number" className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Price</Label>
              <Input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" type="number" className="h-9 text-sm" />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-xs">Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description…" className="text-sm min-h-[80px] resize-none" />
          </div>

          {/* Image upload */}
          <div className="space-y-1.5">
            <Label className="text-xs">Image</Label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 h-9 px-3 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer text-sm">
                <Upload className="w-3.5 h-3.5" />
                <span>{imageFile ? "Change image" : "Upload image"}</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="h-12 w-12 rounded-md object-cover border border-border" />
              )}
              {imageFile && <span className="text-xs text-muted-foreground truncate">{imageFile.name}</span>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={handleBack}>Cancel</Button>
            <Button size="sm" onClick={handleSubmit} disabled={!canSubmit}>Save Asset</Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
