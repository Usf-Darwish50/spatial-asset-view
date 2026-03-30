import { useState } from "react";
import { Plus, Shield, ShieldCheck } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { TopBar } from "@/components/TopBar";
import { users } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function UsersPage() {
  return (
    <AppLayout>
      <TopBar
        title="User Management"
        subtitle="Manage team members and roles"
        actions={<Button size="sm" className="h-8 text-xs gap-1.5"><Plus className="w-3.5 h-3.5" />Add User</Button>}
      />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["User", "Email", "Role", "Last Active"].map((h) => (
                  <th key={h} className="text-left px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[11px] font-semibold text-primary">
                        {user.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <span className="text-[13px] font-medium text-card-foreground">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-muted-foreground">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold",
                      user.role === "admin" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                    )}>
                      {user.role === "admin" ? <ShieldCheck className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                      {user.role === "admin" ? "Admin" : "User"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-muted-foreground">
                    {new Date(user.lastActive).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
