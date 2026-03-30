import { useCallback, useRef, useState, useEffect } from "react";
import { Asset, AssetStatus, getStatusColor } from "@/data/mock";
import { cn } from "@/lib/utils";
import { ZoomIn, ZoomOut, Maximize2, Move } from "lucide-react";

interface LayoutCanvasProps {
  assets: Asset[];
  onAssetClick: (asset: Asset) => void;
  onAssetMove: (assetId: string, x: number, y: number) => void;
  selectedAssetId?: string;
}

export function LayoutCanvas({ assets, onAssetClick, onAssetMove, selectedAssetId }: LayoutCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [draggingAsset, setDraggingAsset] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hoveredAsset, setHoveredAsset] = useState<string | null>(null);

  const CANVAS_W = 1000;
  const CANVAS_H = 700;

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.2, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.4));
  const handleReset = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((z) => Math.min(Math.max(z + delta, 0.4), 3));
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (draggingAsset) return;
    if (e.button === 0) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingAsset) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = (e.clientX - rect.left - pan.x) / zoom - dragOffset.x;
      const y = (e.clientY - rect.top - pan.y) / zoom - dragOffset.y;
      onAssetMove(draggingAsset, Math.round(x), Math.round(y));
      return;
    }
    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggingAsset(null);
  };

  const handleAssetMouseDown = (e: React.MouseEvent, asset: Asset) => {
    e.stopPropagation();
    setDraggingAsset(asset.id);
    setDragOffset({ x: 0, y: 0 });
  };

  const statusColorMap: Record<AssetStatus, string> = {
    working: "#22c55e",
    down: "#ef4444",
    maintenance: "#eab308",
  };

  return (
    <div className="flex-1 relative overflow-hidden bg-canvas-bg">
      {/* Toolbar */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-card rounded-lg border border-border shadow-sm p-1">
        <button onClick={handleZoomIn} className="p-1.5 rounded-md hover:bg-secondary transition-colors" title="Zoom in">
          <ZoomIn className="w-4 h-4 text-foreground" />
        </button>
        <button onClick={handleZoomOut} className="p-1.5 rounded-md hover:bg-secondary transition-colors" title="Zoom out">
          <ZoomOut className="w-4 h-4 text-foreground" />
        </button>
        <div className="w-px h-5 bg-border mx-0.5" />
        <button onClick={handleReset} className="p-1.5 rounded-md hover:bg-secondary transition-colors" title="Reset view">
          <Maximize2 className="w-4 h-4 text-foreground" />
        </button>
        <div className="w-px h-5 bg-border mx-0.5" />
        <span className="text-[11px] font-medium text-muted-foreground px-2 tabular-nums">{Math.round(zoom * 100)}%</span>
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className={cn("w-full h-full canvas-container", draggingAsset && "dragging-asset")}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
            width: CANVAS_W,
            height: CANVAS_H,
          }}
          className="relative"
        >
          {/* Grid pattern */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--canvas-grid))" strokeWidth="0.5" />
              </pattern>
              <pattern id="grid-large" width="200" height="200" patternUnits="userSpaceOnUse">
                <rect width="200" height="200" fill="url(#grid)" />
                <path d="M 200 0 L 0 0 0 200" fill="none" stroke="hsl(var(--canvas-grid))" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-large)" rx="12" />
          </svg>

          {/* Floor plan outline */}
          <div className="absolute inset-4 border-2 border-dashed border-border/60 rounded-xl" />
          
          {/* Room outlines for visual interest */}
          <rect className="absolute" style={{ left: 40, top: 40, width: 280, height: 200 }}>
            <div className="absolute border border-border/40 rounded-lg bg-card/30" style={{ left: 40, top: 40, width: 280, height: 200 }} />
          </rect>
          <div className="absolute border border-border/40 rounded-lg bg-card/30" style={{ left: 40, top: 40, width: 280, height: 200 }}>
            <span className="absolute top-2 left-3 text-[10px] text-muted-foreground/50 font-medium">Office A</span>
          </div>
          <div className="absolute border border-border/40 rounded-lg bg-card/30" style={{ left: 340, top: 40, width: 320, height: 200 }}>
            <span className="absolute top-2 left-3 text-[10px] text-muted-foreground/50 font-medium">Conference Room</span>
          </div>
          <div className="absolute border border-border/40 rounded-lg bg-card/30" style={{ left: 680, top: 40, width: 280, height: 200 }}>
            <span className="absolute top-2 left-3 text-[10px] text-muted-foreground/50 font-medium">Server Room</span>
          </div>
          <div className="absolute border border-border/40 rounded-lg bg-card/30" style={{ left: 40, top: 260, width: 400, height: 200 }}>
            <span className="absolute top-2 left-3 text-[10px] text-muted-foreground/50 font-medium">Open Workspace</span>
          </div>
          <div className="absolute border border-border/40 rounded-lg bg-card/30" style={{ left: 460, top: 260, width: 200, height: 200 }}>
            <span className="absolute top-2 left-3 text-[10px] text-muted-foreground/50 font-medium">Elevator</span>
          </div>
          <div className="absolute border border-border/40 rounded-lg bg-card/30" style={{ left: 680, top: 260, width: 280, height: 380 }}>
            <span className="absolute top-2 left-3 text-[10px] text-muted-foreground/50 font-medium">Utility Room</span>
          </div>
          <div className="absolute border border-border/40 rounded-lg bg-card/30" style={{ left: 40, top: 480, width: 620, height: 180 }}>
            <span className="absolute top-2 left-3 text-[10px] text-muted-foreground/50 font-medium">Lobby</span>
          </div>

          {/* Asset markers */}
          {assets.map((asset) => {
            if (asset.x === undefined || asset.y === undefined) return null;
            const isSelected = selectedAssetId === asset.id;
            const isHovered = hoveredAsset === asset.id;

            return (
              <div
                key={asset.id}
                className="absolute group"
                style={{ left: asset.x - 14, top: asset.y - 14, zIndex: isSelected || isHovered ? 50 : 10 }}
                onMouseDown={(e) => handleAssetMouseDown(e, asset)}
                onClick={(e) => { e.stopPropagation(); onAssetClick(asset); }}
                onMouseEnter={() => setHoveredAsset(asset.id)}
                onMouseLeave={() => setHoveredAsset(null)}
              >
                {/* Outer ring */}
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-all",
                  isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-canvas-bg scale-125" : "hover:scale-110",
                  asset.status === "down" && "status-pulse-down"
                )}
                  style={{ backgroundColor: statusColorMap[asset.status] + "20", border: `2px solid ${statusColorMap[asset.status]}` }}
                >
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: statusColorMap[asset.status] }} />
                </div>

                {/* Tooltip */}
                {(isHovered || isSelected) && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-card border border-border rounded-lg shadow-lg px-3 py-2 whitespace-nowrap animate-fade-in pointer-events-none">
                    <p className="text-[11px] font-semibold text-card-foreground">{asset.name}</p>
                    <p className="text-[10px] text-muted-foreground">{asset.type} · <span style={{ color: statusColorMap[asset.status] }}>{asset.status}</span></p>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-card border-r border-b border-border rotate-45 -mt-1" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-4 bg-card/90 backdrop-blur-sm rounded-lg border border-border shadow-sm px-3 py-2">
        {(["working", "down", "maintenance"] as AssetStatus[]).map((status) => (
          <div key={status} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: statusColorMap[status] }} />
            <span className="text-[11px] text-muted-foreground capitalize">{status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
