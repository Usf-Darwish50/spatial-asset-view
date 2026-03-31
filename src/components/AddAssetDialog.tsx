import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { assetTypes, AssetShape } from "@/data/mock";

interface AddAssetDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; type: string; description: string; shape: AssetShape; image: string }) => void;
}

export function AddAssetDialog({ open, onClose, onSubmit }: AddAssetDialogProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [shape, setShape] = useState<AssetShape>("circle");
  const [image, setImage] = useState("/placeholder.svg");

  const handleSubmit = () => {
    if (!name || !type) return;
    onSubmit({ name, type, description, shape, image });
    setName("");
    setType("");
    setDescription("");
    setShape("circle");
    setImage("/placeholder.svg");
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">New Asset</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. HVAC Unit C3" className="h-9 text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Type</Label>
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
            <Label className="text-xs">Shape</Label>
            <Select value={shape} onValueChange={(v) => setShape(v as AssetShape)}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="circle">Circle (standard asset)</SelectItem>
                <SelectItem value="rectangle">Rectangle (pipe box, duct…)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Image URL</Label>
            <Input value={image} onChange={(e) => setImage(e.target.value)} placeholder="/placeholder.svg" className="h-9 text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description…" className="text-sm min-h-[60px] resize-none" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={handleSubmit} disabled={!name || !type}>Place on Floor</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
