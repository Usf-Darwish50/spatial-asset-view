import { useEffect, useState } from "react";
import { Asset, AssetStatus } from "@/data/mock";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface UpdateStatusDialogProps {
  asset: Asset | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (assetId: string, status: AssetStatus, comment: string) => void;
}

export function UpdateStatusDialog({ asset, open, onClose, onSubmit }: UpdateStatusDialogProps) {
  const [status, setStatus] = useState<AssetStatus>("working");
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (asset) {
      setStatus(asset.status);
      setComment("");
    }
  }, [asset]);

  const handleSubmit = () => {
    if (!asset) return;
    onSubmit(asset.id, status, comment);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Status</DialogTitle>
          <DialogDescription>
            {asset ? `Change the status of ${asset.name}` : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label className="text-xs">Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as AssetStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="working">Working</SelectItem>
                <SelectItem value="down">Down</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Comment</Label>
            <Textarea
              placeholder="Add a comment about this change..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[90px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
