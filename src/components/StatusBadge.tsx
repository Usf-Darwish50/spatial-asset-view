import { cn } from "@/lib/utils";
import { AssetStatus, getStatusColor } from "@/data/mock";

interface StatusBadgeProps {
  status: AssetStatus;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const labels: Record<AssetStatus, string> = {
    working: "Working",
    down: "Down",
    maintenance: "Maintenance",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium capitalize",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]",
        status === "working" && "bg-status-working/10 text-status-working",
        status === "down" && "bg-status-down/10 text-status-down",
        status === "maintenance" && "bg-status-maintenance/10 text-status-maintenance"
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", getStatusColor(status), status === "down" && "status-pulse-down")} />
      {labels[status]}
    </span>
  );
}
