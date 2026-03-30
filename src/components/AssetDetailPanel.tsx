import { useState } from "react";
import { X, MessageSquare, Clock, User, Edit2 } from "lucide-react";
import { Asset, AssetStatus } from "@/data/mock";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface AssetDetailPanelProps {
  asset: Asset;
  onClose: () => void;
  onStatusChange: (assetId: string, status: AssetStatus, comment: string) => void;
}

export function AssetDetailPanel({ asset, onClose, onStatusChange }: AssetDetailPanelProps) {
  const [newComment, setNewComment] = useState("");
  const [changingStatus, setChangingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<AssetStatus>(asset.status);

  const handleStatusUpdate = () => {
    if (selectedStatus !== asset.status) {
      onStatusChange(asset.id, selectedStatus, newComment);
      setNewComment("");
      setChangingStatus(false);
    }
  };

  const statuses: AssetStatus[] = ["working", "down", "maintenance"];

  return (
    <div className="w-80 bg-card border-l border-border h-full flex flex-col animate-slide-in-right shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-card-foreground">Asset Details</h3>
        <button onClick={onClose} className="p-1 rounded-md hover:bg-secondary transition-colors">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Info */}
        <div className="p-4 space-y-4">
          <div>
            <h4 className="text-base font-semibold text-card-foreground">{asset.name}</h4>
            <p className="text-xs text-muted-foreground mt-0.5">{asset.type}</p>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge status={asset.status} />
            {!changingStatus && (
              <button
                onClick={() => setChangingStatus(true)}
                className="p-1 rounded-md hover:bg-secondary transition-colors"
              >
                <Edit2 className="w-3 h-3 text-muted-foreground" />
              </button>
            )}
          </div>

          {changingStatus && (
            <div className="space-y-2 p-3 bg-secondary/50 rounded-lg">
              <p className="text-[11px] font-medium text-foreground">Change Status</p>
              <div className="flex gap-1.5">
                {statuses.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedStatus(s)}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-[11px] font-medium capitalize border transition-colors",
                      selectedStatus === s
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-secondary"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="text-xs min-h-[60px] resize-none"
              />
              <div className="flex gap-2">
                <Button size="sm" className="text-xs h-7 flex-1" onClick={handleStatusUpdate}>
                  Update
                </Button>
                <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => setChangingStatus(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <p className="text-xs text-muted-foreground leading-relaxed">{asset.description}</p>

          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span>Updated {new Date(asset.lastUpdated).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="w-3.5 h-3.5" />
              <span>{asset.updatedBy}</span>
            </div>
          </div>

          {asset.x !== undefined && asset.y !== undefined && (
            <div className="px-3 py-2 bg-secondary/50 rounded-lg">
              <p className="text-[10px] font-medium text-muted-foreground">Position</p>
              <p className="text-xs font-mono text-foreground">x: {asset.x}, y: {asset.y}</p>
            </div>
          )}
        </div>

        {/* Comments */}
        <div className="px-4 pb-4">
          <div className="flex items-center gap-1.5 mb-3">
            <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[11px] font-semibold text-foreground">Activity ({asset.comments.length})</span>
          </div>

          <div className="space-y-3">
            {asset.comments.map((comment) => (
              <div key={comment.id} className="text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-card-foreground">{comment.author}</span>
                  <span className="text-muted-foreground">
                    {new Date(comment.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
                {comment.statusChange && (
                  <p className="text-muted-foreground mb-1">
                    Changed status from <span className="capitalize font-medium">{comment.statusChange.from}</span> to{" "}
                    <span className="capitalize font-medium">{comment.statusChange.to}</span>
                  </p>
                )}
                <p className="text-muted-foreground">{comment.text}</p>
              </div>
            ))}
            {asset.comments.length === 0 && (
              <p className="text-xs text-muted-foreground italic">No activity yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
