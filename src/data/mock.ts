export type AssetStatus = "working" | "down" | "maintenance";

export interface Building {
  id: string;
  name: string;
  address: string;
  floorsCount: number;
  assetsCount: number;
  image?: string;
}

export interface Floor {
  id: string;
  buildingId: string;
  name: string;
  level: number;
  layoutUrl?: string;
  assetsCount: number;
}

export type AssetShape = "circle" | "rectangle";

export interface Asset {
  id: string;
  name: string;
  type: string;
  status: AssetStatus;
  description: string;
  buildingId: string;
  floorId: string;
  x?: number;
  y?: number;
  shape: AssetShape;
  image?: string;
  lastUpdated: string;
  updatedBy: string;
  comments: AssetComment[];
}

export interface AssetComment {
  id: string;
  text: string;
  author: string;
  timestamp: string;
  statusChange?: { from: AssetStatus; to: AssetStatus };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  avatar?: string;
  lastActive: string;
}

export const buildings: Building[] = [
  { id: "b1", name: "Headquarters", address: "123 Main Street, New York", floorsCount: 5, assetsCount: 47 },
  { id: "b2", name: "Research Center", address: "456 Innovation Ave, Boston", floorsCount: 3, assetsCount: 32 },
  { id: "b3", name: "Data Center Alpha", address: "789 Server Lane, Virginia", floorsCount: 2, assetsCount: 124 },
  { id: "b4", name: "West Campus", address: "321 Tech Blvd, San Francisco", floorsCount: 4, assetsCount: 58 },
];

export const floors: Floor[] = [
  { id: "f1", buildingId: "b1", name: "Ground Floor", level: 0, assetsCount: 12, layoutUrl: "/layouts/hq-ground.png" },
  { id: "f2", buildingId: "b1", name: "Floor 1", level: 1, assetsCount: 10, layoutUrl: "/layouts/hq-1.png" },
  { id: "f3", buildingId: "b1", name: "Floor 2", level: 2, assetsCount: 8 },
  { id: "f4", buildingId: "b1", name: "Floor 3", level: 3, assetsCount: 9 },
  { id: "f5", buildingId: "b1", name: "Floor 4", level: 4, assetsCount: 8 },
  { id: "f6", buildingId: "b2", name: "Ground Floor", level: 0, assetsCount: 14 },
  { id: "f7", buildingId: "b2", name: "Floor 1", level: 1, assetsCount: 10 },
  { id: "f8", buildingId: "b2", name: "Floor 2", level: 2, assetsCount: 8 },
  { id: "f9", buildingId: "b3", name: "Ground Floor", level: 0, assetsCount: 64 },
  { id: "f10", buildingId: "b3", name: "Floor 1", level: 1, assetsCount: 60 },
  { id: "f11", buildingId: "b4", name: "Ground Floor", level: 0, assetsCount: 18 },
  { id: "f12", buildingId: "b4", name: "Floor 1", level: 1, assetsCount: 14 },
  { id: "f13", buildingId: "b4", name: "Floor 2", level: 2, assetsCount: 12 },
  { id: "f14", buildingId: "b4", name: "Floor 3", level: 3, assetsCount: 14 },
];

export const assets: Asset[] = [
  { id: "a1", name: "HVAC Unit A1", type: "HVAC", status: "working", description: "Main HVAC unit for ground floor east wing", buildingId: "b1", floorId: "f1", x: 150, y: 200, lastUpdated: "2025-03-28T14:30:00Z", updatedBy: "John Smith", comments: [{ id: "c1", text: "Annual maintenance completed", author: "John Smith", timestamp: "2025-03-28T14:30:00Z" }] },
  { id: "a2", name: "Fire Alarm Panel", type: "Safety", status: "working", description: "Central fire alarm control panel", buildingId: "b1", floorId: "f1", x: 400, y: 120, lastUpdated: "2025-03-25T09:15:00Z", updatedBy: "Jane Doe", comments: [] },
  { id: "a3", name: "Server Rack 01", type: "IT Equipment", status: "down", description: "Primary server rack - network closet", buildingId: "b1", floorId: "f1", x: 600, y: 350, lastUpdated: "2025-03-29T16:45:00Z", updatedBy: "Mike Johnson", comments: [{ id: "c2", text: "Power supply failure detected. Replacement ordered.", author: "Mike Johnson", timestamp: "2025-03-29T16:45:00Z", statusChange: { from: "working", to: "down" } }] },
  { id: "a4", name: "Elevator A", type: "Transport", status: "maintenance", description: "East wing passenger elevator", buildingId: "b1", floorId: "f1", x: 300, y: 450, lastUpdated: "2025-03-27T11:00:00Z", updatedBy: "Sarah Lee", comments: [{ id: "c3", text: "Scheduled maintenance - expected completion 03/30", author: "Sarah Lee", timestamp: "2025-03-27T11:00:00Z", statusChange: { from: "working", to: "maintenance" } }] },
  { id: "a5", name: "Security Camera N1", type: "Security", status: "working", description: "North entrance surveillance camera", buildingId: "b1", floorId: "f1", x: 100, y: 80, lastUpdated: "2025-03-20T08:00:00Z", updatedBy: "Jane Doe", comments: [] },
  { id: "a6", name: "UPS Unit B", type: "Electrical", status: "working", description: "Backup power supply unit B", buildingId: "b1", floorId: "f1", x: 550, y: 180, lastUpdated: "2025-03-22T13:20:00Z", updatedBy: "John Smith", comments: [] },
  { id: "a7", name: "Water Pump W1", type: "Plumbing", status: "working", description: "Main water circulation pump", buildingId: "b1", floorId: "f1", x: 700, y: 500, lastUpdated: "2025-03-18T10:00:00Z", updatedBy: "Mike Johnson", comments: [] },
  { id: "a8", name: "Generator G1", type: "Electrical", status: "working", description: "Emergency backup generator", buildingId: "b1", floorId: "f1", x: 800, y: 300, lastUpdated: "2025-03-15T09:30:00Z", updatedBy: "John Smith", comments: [] },
  { id: "a9", name: "HVAC Unit B2", type: "HVAC", status: "down", description: "Floor 1 HVAC - west wing", buildingId: "b1", floorId: "f2", x: 200, y: 250, lastUpdated: "2025-03-29T08:00:00Z", updatedBy: "Sarah Lee", comments: [{ id: "c4", text: "Compressor failure", author: "Sarah Lee", timestamp: "2025-03-29T08:00:00Z", statusChange: { from: "working", to: "down" } }] },
  { id: "a10", name: "Access Control F1", type: "Security", status: "working", description: "Floor 1 access control system", buildingId: "b1", floorId: "f2", x: 450, y: 100, lastUpdated: "2025-03-26T14:00:00Z", updatedBy: "Jane Doe", comments: [] },
  { id: "a11", name: "Server Rack DC-01", type: "IT Equipment", status: "working", description: "Primary compute rack row A", buildingId: "b3", floorId: "f9", x: 200, y: 150, lastUpdated: "2025-03-28T12:00:00Z", updatedBy: "Mike Johnson", comments: [] },
  { id: "a12", name: "Cooling Unit DC-C1", type: "HVAC", status: "maintenance", description: "Data center cooling unit C1", buildingId: "b3", floorId: "f9", x: 500, y: 300, lastUpdated: "2025-03-29T10:00:00Z", updatedBy: "John Smith", comments: [{ id: "c5", text: "Coolant replacement in progress", author: "John Smith", timestamp: "2025-03-29T10:00:00Z", statusChange: { from: "working", to: "maintenance" } }] },
];

export const users: User[] = [
  { id: "u1", name: "John Smith", email: "john@company.com", role: "admin", lastActive: "2025-03-29T16:00:00Z" },
  { id: "u2", name: "Jane Doe", email: "jane@company.com", role: "admin", lastActive: "2025-03-29T15:30:00Z" },
  { id: "u3", name: "Mike Johnson", email: "mike@company.com", role: "user", lastActive: "2025-03-29T14:00:00Z" },
  { id: "u4", name: "Sarah Lee", email: "sarah@company.com", role: "user", lastActive: "2025-03-28T09:00:00Z" },
  { id: "u5", name: "Alex Chen", email: "alex@company.com", role: "user", lastActive: "2025-03-27T11:00:00Z" },
];

export const assetTypes = ["HVAC", "Safety", "IT Equipment", "Transport", "Security", "Electrical", "Plumbing"];

export function getStatusColor(status: AssetStatus): string {
  switch (status) {
    case "working": return "bg-status-working";
    case "down": return "bg-status-down";
    case "maintenance": return "bg-status-maintenance";
  }
}

export function getStatusTextColor(status: AssetStatus): string {
  switch (status) {
    case "working": return "text-status-working";
    case "down": return "text-status-down";
    case "maintenance": return "text-status-maintenance";
  }
}
