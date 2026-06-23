import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import productLogo from "@/assets/e1-fms-product.png";

interface TopBarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function TopBar({ title, subtitle, actions }: TopBarProps) {
  return (
    <header className="h-14 bg-topbar-bg border-b border-topbar-border flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        {/* Product mark — persistent "you are in Eazly One FMS" anchor */}
        <div className="flex items-center gap-2 pr-4 border-r border-topbar-border">
          <img src={productLogo} alt="e1 FMS" className="h-7 w-auto" />
          <span className="text-[13px] font-bold tracking-wide text-foreground">FMS</span>
        </div>
        <div>
          <h1 className="text-sm font-semibold text-foreground">{title}</h1>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            className="w-56 h-8 pl-8 text-xs bg-secondary border-0"
          />
        </div>
        {actions}
        <button className="relative p-1.5 rounded-lg hover:bg-secondary transition-colors">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-status-down" />
        </button>
      </div>
    </header>
  );
}
