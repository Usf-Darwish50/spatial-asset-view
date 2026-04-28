import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RequireAuth } from "@/components/RequireAuth";
import DashboardPage from "./pages/DashboardPage";
import BuildingPage from "./pages/BuildingPage";
import BuildingsPage from "./pages/BuildingsPage";
import FloorLayoutPage from "./pages/FloorLayoutPage";
import AssetsPage from "./pages/AssetsPage";
import AddAssetPage from "./pages/AddAssetPage";
import AssetTypesPage from "./pages/AssetTypesPage";
import AssetTypeDetailPage from "./pages/AssetTypeDetailPage";
import ReportsPage from "./pages/ReportsPage";
import UsersPage from "./pages/UsersPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<RequireAuth><DashboardPage /></RequireAuth>} />
          <Route path="/buildings" element={<RequireAuth><BuildingsPage /></RequireAuth>} />
          <Route path="/building/:buildingId" element={<RequireAuth><BuildingPage /></RequireAuth>} />
          <Route path="/building/:buildingId/floor/:floorId" element={<RequireAuth><FloorLayoutPage /></RequireAuth>} />
          <Route path="/assets" element={<RequireAuth><AssetsPage /></RequireAuth>} />
          <Route path="/assets/new" element={<RequireAuth><AddAssetPage /></RequireAuth>} />
          <Route path="/asset-types" element={<RequireAuth><AssetTypesPage /></RequireAuth>} />
          <Route path="/asset-types/:typeName" element={<RequireAuth><AssetTypeDetailPage /></RequireAuth>} />
          <Route path="/reports" element={<RequireAuth><ReportsPage /></RequireAuth>} />
          <Route path="/users" element={<RequireAuth><UsersPage /></RequireAuth>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
