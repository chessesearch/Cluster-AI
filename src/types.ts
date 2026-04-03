export type Department = "HR" | "Tech" | "Sales" | "Marketing";
export type WorkStatus = "Active" | "Leave" | "Resigned";
export type TaskStatus = "Pending" | "In Progress" | "Completed";

export interface Employee {
  id: string;
  name: string;
  department: Department;
  position: string;
  salary: number;
  performanceScore: number; // 1-100
  taskCompletion: number; // %
  joinDate: string;
  manager: string;
  projectAssigned: string;
  workStatus: WorkStatus;
}

export interface Task {
  id: string;
  employeeId: string;
  taskName: string;
  progress: number; // %
  deadline: string;
  status: TaskStatus;
}

export interface DataSource {
  id: string;
  name: string;
  icon: string;
  status: "Connected" | "Disconnected";
  size: string;
  lastUpdated: string;
}

export interface AIBlock {
  id: string;
  type: "chart" | "kpi" | "table" | "alert" | "insight";
  title: string;
  content: any;
  chartType?: "bar" | "line" | "pie";
  insightText?: string;
  alertType?: "warning" | "success" | "info";
  timestamp: number;
}

export interface CanvasBlock {
  id: string;
  type: "chart" | "kpi" | "table" | "alert" | "insight";
  data: any;
  gridX: number;
  gridY: number;
  gridWidth: number;
  gridHeight: number;
  title: string;
  chartType?: "bar" | "line" | "pie";
  insightText?: string;
  alertType?: "warning" | "success" | "info";
}

export interface DashboardLayout {
  id: string;
  name: string;
  blocks: CanvasBlock[];
}

export type AppTab = "Data Storage" | "Visual View" | "File Workspace";

export interface AISuggestion {
  id: string;
  label: string;
  blocks: Omit<AIBlock, "id" | "timestamp">[];
}

export type WorkspaceMode = "floating" | "grid";

export interface WorkspacePanel {
  id: string;
  type: "ai" | "data" | "canvas" | "custom";
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  title: string;
  isMaximized?: boolean;
}

export interface LayoutNode {
  id: string;
  type: "row" | "column" | "panel";
  direction?: "horizontal" | "vertical";
  children?: LayoutNode[];
  panelId?: string;
  size?: number; // percentage
}
