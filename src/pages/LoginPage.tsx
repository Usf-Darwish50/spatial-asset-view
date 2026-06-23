import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import platformLogo from "@/assets/eazly-one-platform.png";
import productLogo from "@/assets/e1-fms-product.png";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (username === "admin" && password === "admin") {
        sessionStorage.setItem("isAuthenticated", "true");
        toast({ title: "Welcome back", description: "Login successful" });
        navigate("/", { replace: true });
      } else {
        toast({
          title: "Invalid credentials",
          description: "Please check your username and password.",
          variant: "destructive",
        });
      }
      setLoading(false);
    }, 300);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-sidebar to-background p-4">
      {/* Platform lockup — leads the screen */}
      <div className="w-full max-w-md mb-6">
        <img
          src={platformLogo}
          alt="Eazly One — A Connected Platform"
          className="w-full h-auto"
        />
      </div>

      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="pt-6">
          {/* Product mark — what you're signing into */}
          <div className="flex flex-col items-center text-center mb-6">
            <img src={productLogo} alt="e1 FMS" className="h-20 w-auto" />
            <p className="text-xs tracking-[0.2em] text-muted-foreground mt-1">
              FACILITY MANAGEMENT SYSTEM
            </p>
            <p className="text-xs text-muted-foreground mt-3">
              Sign in to continue to your workspace
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                autoComplete="username"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="mt-6 text-[11px] text-muted-foreground">
        Powered by <span className="font-semibold">Eazly One</span> — A Connected Platform
      </p>
    </main>
  );
}
