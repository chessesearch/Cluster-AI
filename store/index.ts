import { create } from "zustand";
import { Employee, Task, AIBlock, CanvasBlock, DashboardLayout, AppTab, WorkspacePanel, WorkspaceMode, LayoutNode } from "../src/types";
import { generateMockData, INITIAL_AI_BLOCKS } from "../src/mockData";

interface AppState {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  employees: Employee[];
  tasks: Task[];
  aiBlocks: AIBlock[];
  addAIBlock: (block: AIBlock) => void;
  removeAIBlock: (id: string) => void;
  canvasBlocks: CanvasBlock[];
  addCanvasBlock: (block: CanvasBlock) => void;
  updateCanvasBlock: (id: string, updates: Partial<CanvasBlock>) => void;
  removeCanvasBlock: (id: string) => void;
  
  // Workspace State
  workspaceMode: WorkspaceMode;
  setWorkspaceMode: (mode: WorkspaceMode) => void;
  workspacePanels: WorkspacePanel[];
  addWorkspacePanel: (panel: WorkspacePanel) => void;
  updateWorkspacePanel: (id: string, updates: Partial<WorkspacePanel>) => void;
  removeWorkspacePanel: (id: string) => void;
  gridLayout: LayoutNode | null;
  setGridLayout: (layout: LayoutNode | null) => void;
  
  // Data Storage selection
  selectedEntityId: string | null;
  setSelectedEntityId: (id: string | null) => void;
  expandedNodes: string[];
  toggleNodeExpansion: (id: string) => void;
  dataStorageFullscreen: boolean;
  setDataStorageFullscreen: (val: boolean) => void;
  dataStorageView: "graph" | "tree";
  setDataStorageView: (view: "graph" | "tree") => void;
}

const { employees, tasks } = generateMockData();

export const useStore = create<AppState>((set) => ({
  activeTab: "Visual Canvas",
  setActiveTab: (tab) => set({ activeTab: tab }),
  employees,
  tasks,
  aiBlocks: INITIAL_AI_BLOCKS,
  addAIBlock: (block) => set((state) => ({ aiBlocks: [block, ...state.aiBlocks] })),
  removeAIBlock: (id) => set((state) => ({ aiBlocks: state.aiBlocks.filter((b) => b.id !== id) })),
  canvasBlocks: [],
  addCanvasBlock: (block) => set((state) => ({ canvasBlocks: [...state.canvasBlocks, block] })),
  updateCanvasBlock: (id, updates) =>
    set((state) => ({
      canvasBlocks: state.canvasBlocks.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    })),
  removeCanvasBlock: (id) => set((state) => ({ canvasBlocks: state.canvasBlocks.filter((b) => b.id !== id) })),
  
  // Workspace
  workspaceMode: "floating",
  setWorkspaceMode: (mode) => set({ workspaceMode: mode }),
  workspacePanels: [
    { id: "1", type: "ai", x: 50, y: 50, width: 400, height: 500, zIndex: 1, title: "AI Assistant" },
    { id: "2", type: "data", x: 500, y: 50, width: 600, height: 400, zIndex: 1, title: "Data Explorer" },
    { id: "3", type: "canvas", x: 50, y: 600, width: 1050, height: 300, zIndex: 1, title: "Visual Canvas" },
  ],
  addWorkspacePanel: (panel) => set((state) => ({ workspacePanels: [...state.workspacePanels, panel] })),
  updateWorkspacePanel: (id, updates) =>
    set((state) => ({
      workspacePanels: state.workspacePanels.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),
  removeWorkspacePanel: (id) => set((state) => ({ workspacePanels: state.workspacePanels.filter((p) => p.id !== id) })),
  gridLayout: null,
  setGridLayout: (layout) => set({ gridLayout: layout }),
  
  // Selection & Data Storage
  selectedEntityId: null,
  setSelectedEntityId: (id) => set({ selectedEntityId: id }),
  expandedNodes: ["root"],
  toggleNodeExpansion: (id) => set((state) => ({
    expandedNodes: state.expandedNodes.includes(id) 
      ? state.expandedNodes.filter(n => n !== id)
      : [...state.expandedNodes, id]
  })),
  dataStorageFullscreen: false,
  setDataStorageFullscreen: (val) => set({ dataStorageFullscreen: val }),
  dataStorageView: "graph",
  setDataStorageView: (view) => set({ dataStorageView: view }),
}));
