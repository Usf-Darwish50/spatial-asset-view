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
  code?: string;
  internalCode?: string;
  type: string;
  subtype?: string;
  status: AssetStatus;
  condition?: string;
  description: string;
  buildingId: string;
  floorId: string;
  x?: number;
  y?: number;
  shape: AssetShape;
  image?: string;
  serialNumber?: string;
  model?: string;
  assignedTo?: string;
  assignTicket?: string;
  statusComment?: string;
  owner?: string;
  notes?: string;
  price?: number;
  createdAt?: string;
  createdBy?: string;
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
  { id: "a1", name: "HVAC Unit A1", code: "F-HVAC-2025-03-2546", internalCode: "HQ-GF-HVAC-A1", type: "HVAC", subtype: "Split Unit", status: "working", condition: "Good", shape: "circle", image: "/placeholder.svg", description: "Main HVAC unit for ground floor east wing", buildingId: "b1", floorId: "f1", x: 150, y: 200, serialNumber: "SN-88293", model: "Carrier 38M", assignedTo: "John Smith", assignTicket: "T-1024", owner: "Facilities", notes: "Annual contract", price: 4500, createdAt: "2023-01-15T09:00:00Z", createdBy: "admin", lastUpdated: "2025-03-28T14:30:00Z", updatedBy: "John Smith", comments: [{ id: "c1", text: "Annual maintenance completed", author: "John Smith", timestamp: "2025-03-28T14:30:00Z" }] },
  { id: "a2", name: "Fire Alarm Panel", code: "F-SAF-2025-03-2547", internalCode: "HQ-GF-SAF-001", type: "Safety", subtype: "Control Panel", status: "working", condition: "Excellent", shape: "circle", image: "/placeholder.svg", description: "Central fire alarm control panel", buildingId: "b1", floorId: "f1", x: 400, y: 120, serialNumber: "SN-99123", model: "Honeywell VISTA", owner: "Security", createdAt: "2022-06-10T10:00:00Z", createdBy: "admin", lastUpdated: "2025-03-25T09:15:00Z", updatedBy: "Jane Doe", comments: [] },
  { id: "a3", name: "Server Rack 01", code: "F-IT-2025-03-2548", internalCode: "HQ-GF-IT-001", type: "IT Equipment", subtype: "Rack Server", status: "down", condition: "Poor", shape: "circle", image: "/placeholder.svg", description: "Primary server rack - network closet", buildingId: "b1", floorId: "f1", x: 600, y: 350, serialNumber: "SN-11234", model: "Dell R750", assignedTo: "Mike Johnson", assignTicket: "T-2048", statusComment: "Power supply failure detected. Replacement ordered.", owner: "IT", notes: "Under warranty", price: 12000, createdAt: "2023-03-20T11:00:00Z", createdBy: "admin", lastUpdated: "2025-03-29T16:45:00Z", updatedBy: "Mike Johnson", comments: [{ id: "c2", text: "Power supply failure detected. Replacement ordered.", author: "Mike Johnson", timestamp: "2025-03-29T16:45:00Z", statusChange: { from: "working", to: "down" } }] },
  { id: "a4", name: "Elevator A", code: "F-TRN-2025-03-2549", internalCode: "HQ-GF-TRN-A", type: "Transport", subtype: "Passenger", status: "maintenance", condition: "Fair", shape: "circle", image: "/placeholder.svg", description: "East wing passenger elevator", buildingId: "b1", floorId: "f1", x: 300, y: 450, serialNumber: "SN-55678", model: "Otis Gen2", assignedTo: "Sarah Lee", assignTicket: "T-3056", statusComment: "Scheduled maintenance - expected completion 03/30", owner: "Facilities", createdAt: "2021-08-05T08:00:00Z", createdBy: "admin", lastUpdated: "2025-03-27T11:00:00Z", updatedBy: "Sarah Lee", comments: [{ id: "c3", text: "Scheduled maintenance - expected completion 03/30", author: "Sarah Lee", timestamp: "2025-03-27T11:00:00Z", statusChange: { from: "working", to: "maintenance" } }] },
  { id: "a5", name: "Security Camera N1", code: "F-SEC-2025-03-2550", internalCode: "HQ-GF-SEC-N1", type: "Security", subtype: "Dome Camera", status: "working", condition: "Good", shape: "circle", image: "/placeholder.svg", description: "North entrance surveillance camera", buildingId: "b1", floorId: "f1", x: 100, y: 80, serialNumber: "SN-33445", model: "Hikvision DS-2CD", owner: "Security", price: 350, createdAt: "2023-11-12T14:00:00Z", createdBy: "admin", lastUpdated: "2025-03-20T08:00:00Z", updatedBy: "Jane Doe", comments: [] },
  { id: "a6", name: "UPS Unit B", code: "F-ELE-2025-03-2551", internalCode: "HQ-GF-ELE-B", type: "Electrical", subtype: "UPS", status: "working", condition: "Good", shape: "circle", image: "/placeholder.svg", description: "Backup power supply unit B", buildingId: "b1", floorId: "f1", x: 550, y: 180, serialNumber: "SN-77665", model: "APC Smart-UPS 3000", owner: "IT", notes: "Battery replaced 2024", price: 2800, createdAt: "2022-04-18T09:00:00Z", createdBy: "admin", lastUpdated: "2025-03-22T13:20:00Z", updatedBy: "John Smith", comments: [] },
  { id: "a7", name: "Pipe Box W1", code: "F-PB-2025-03-2552", internalCode: "HQ-GF-PB-W1", type: "Pipe Box", subtype: "Water", status: "working", condition: "Good", shape: "rectangle", image: "/placeholder.svg", description: "Main water pipe distribution box", buildingId: "b1", floorId: "f1", x: 700, y: 500, serialNumber: "SN-88990", model: "PB-Water-400", owner: "Facilities", createdAt: "2020-09-01T10:00:00Z", createdBy: "admin", lastUpdated: "2025-03-18T10:00:00Z", updatedBy: "Mike Johnson", comments: [] },
  { id: "a8", name: "Generator G1", code: "F-ELE-2025-03-2553", internalCode: "HQ-GF-ELE-G1", type: "Electrical", subtype: "Generator", status: "working", condition: "Excellent", shape: "circle", image: "/placeholder.svg", description: "Emergency backup generator", buildingId: "b1", floorId: "f1", x: 800, y: 300, serialNumber: "SN-22334", model: "Cummins C22D5", owner: "Facilities", price: 18000, createdAt: "2021-02-20T08:00:00Z", createdBy: "admin", lastUpdated: "2025-03-15T09:30:00Z", updatedBy: "John Smith", comments: [] },
  { id: "a9", name: "HVAC Unit B2", code: "F-HVAC-2025-03-2554", internalCode: "HQ-F1-HVAC-B2", type: "HVAC", subtype: "Split Unit", status: "down", condition: "Poor", shape: "circle", image: "/placeholder.svg", description: "Floor 1 HVAC - west wing", buildingId: "b1", floorId: "f2", x: 200, y: 250, serialNumber: "SN-44556", model: "Carrier 38M", assignedTo: "Sarah Lee", assignTicket: "T-4092", statusComment: "Compressor failure", owner: "Facilities", createdAt: "2023-01-15T09:00:00Z", createdBy: "admin", lastUpdated: "2025-03-29T08:00:00Z", updatedBy: "Sarah Lee", comments: [{ id: "c4", text: "Compressor failure", author: "Sarah Lee", timestamp: "2025-03-29T08:00:00Z", statusChange: { from: "working", to: "down" } }] },
  { id: "a10", name: "Pipe Duct F1", code: "F-PB-2025-03-2555", internalCode: "HQ-F1-PB-F1", type: "Pipe Box", subtype: "Ventilation", status: "working", condition: "Good", shape: "rectangle", image: "/placeholder.svg", description: "Floor 1 main pipe duct", buildingId: "b1", floorId: "f2", x: 450, y: 100, serialNumber: "SN-66778", model: "PB-Vent-600", owner: "Facilities", createdAt: "2020-09-01T10:00:00Z", createdBy: "admin", lastUpdated: "2025-03-26T14:00:00Z", updatedBy: "Jane Doe", comments: [] },
  { id: "a11", name: "Server Rack DC-01", code: "F-IT-2025-03-2556", internalCode: "DC-GF-IT-01", type: "IT Equipment", subtype: "Rack Server", status: "working", condition: "Excellent", shape: "circle", image: "/placeholder.svg", description: "Primary compute rack row A", buildingId: "b3", floorId: "f9", x: 200, y: 150, serialNumber: "SN-99001", model: "Dell R750", owner: "IT", price: 12000, createdAt: "2023-03-20T11:00:00Z", createdBy: "admin", lastUpdated: "2025-03-28T12:00:00Z", updatedBy: "Mike Johnson", comments: [] },
  { id: "a12", name: "Cooling Unit DC-C1", code: "F-HVAC-2025-03-2557", internalCode: "DC-GF-HVAC-C1", type: "HVAC", subtype: "Precision Cooling", status: "maintenance", condition: "Fair", shape: "circle", image: "/placeholder.svg", description: "Data center cooling unit C1", buildingId: "b3", floorId: "f9", x: 500, y: 300, serialNumber: "SN-11223", model: "Liebert CRV", assignedTo: "John Smith", assignTicket: "T-5120", statusComment: "Coolant replacement in progress", owner: "Facilities", price: 8500, createdAt: "2022-07-10T09:00:00Z", createdBy: "admin", lastUpdated: "2025-03-29T10:00:00Z", updatedBy: "John Smith", comments: [{ id: "c5", text: "Coolant replacement in progress", author: "John Smith", timestamp: "2025-03-29T10:00:00Z", statusChange: { from: "working", to: "maintenance" } }] },
];

export const users: User[] = [
  { id: "u1", name: "John Smith", email: "john@company.com", role: "admin", lastActive: "2025-03-29T16:00:00Z" },
  { id: "u2", name: "Jane Doe", email: "jane@company.com", role: "admin", lastActive: "2025-03-29T15:30:00Z" },
  { id: "u3", name: "Mike Johnson", email: "mike@company.com", role: "user", lastActive: "2025-03-29T14:00:00Z" },
  { id: "u4", name: "Sarah Lee", email: "sarah@company.com", role: "user", lastActive: "2025-03-28T09:00:00Z" },
  { id: "u5", name: "Alex Chen", email: "alex@company.com", role: "user", lastActive: "2025-03-27T11:00:00Z" },
];

export const assetTypes = ["HVAC", "Safety", "IT Equipment", "Transport", "Security", "Electrical", "Plumbing", "Pipe Box"];

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
