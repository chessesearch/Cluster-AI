"use client";

import React, { useState, useEffect, useRef } from "react";
import { useStore } from "@/store";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { 
  Maximize2, Minimize2, X, GripHorizontal, LayoutGrid, 
  Square, Columns, Rows, Plus, Settings, Sparkles, 
  Database, Zap, FileText, BarChart3, Activity, 
  Layers, MousePointer2, Move, Layout as LayoutIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { WorkspacePanel, WorkspaceMode, LayoutNode } from "@/src/types";

export const FileWorkspaceView = () => {
  const { 
    workspaceMode, setWorkspaceMode, 
    workspacePanels, updateWorkspacePanel, 
    addWorkspacePanel, removeWorkspacePanel 
  } = useStore();
  
  const [activePanelId, setActivePanelId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleMode = () => {
    setWorkspaceMode(workspaceMode === "floating" ? "grid" : "floating");
  };

  const handlePanelFocus = (id: string) => {
    setActivePanelId(id);
    const maxZ = Math.max(...workspacePanels.map(p => p.zIndex), 0);
    updateWorkspacePanel(id, { zIndex: maxZ + 1 });
  };

  const handleDragEnd = (id: string, info: any) => {
    if (workspaceMode !== "floating") return;
    const panel = workspacePanels.find(p => p.id === id);
    if (panel) {
      updateWorkspacePanel(id, {
        x: panel.x + info.offset.x,
        y: panel.y + info.offset.y
      });
    }
  };

  const handleResize = (id: string, width: number, height: number) => {
    updateWorkspacePanel(id, { width, height });
  };

  const organizeLayout = () => {
    const sorted = [...workspacePanels].sort((a, b) => a.y - b.y || a.x - b.x);
    const cols = 2;
    const padding = 20;
    const gap = 20;
    const containerWidth = containerRef.current?.clientWidth || 1200;
    const panelWidth = (containerWidth - (padding * 2) - (gap * (cols - 1))) / cols;
    
    sorted.forEach((panel, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      updateWorkspacePanel(panel.id, {
        x: padding + (col * (panelWidth + gap)),
        y: padding + (row * (400 + gap)),
        width: panelWidth,
        height: 400
      });
    });
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-[#050505]">
      {/* Workspace Toolbar */}
      <div className="h-12 border-b border-white/5 bg-white/[0.02] flex items-center justify-between px-4 z-30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <LayoutIcon className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-widest">Workspace</span>
          </div>
          <div className="h-4 w-[1px] bg-white/10" />
          <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg border border-white/5">
            <button 
              onClick={() => setWorkspaceMode("floating")}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-tight transition-all",
                workspaceMode === "floating" ? "bg-cyan-500 text-white shadow-[0_0_15px_rgba(34,211,238,0.3)]" : "text-white/40 hover:text-white/60"
              )}
            >
              <MousePointer2 className="w-3 h-3" />
              Floating
            </button>
            <button 
              onClick={() => setWorkspaceMode("grid")}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-tight transition-all",
                workspaceMode === "grid" ? "bg-cyan-500 text-white shadow-[0_0_15px_rgba(34,211,238,0.3)]" : "text-white/40 hover:text-white/60"
              )}
            >
              <LayoutGrid className="w-3 h-3" />
              Grid
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white/40 hover:text-white">
            <Plus className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white/40 hover:text-white">
            <Settings className="w-4 h-4" />
          </button>
          <div className="h-4 w-[1px] bg-white/10 mx-2" />
          <button 
            onClick={organizeLayout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-widest hover:bg-cyan-500/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Organize Layout
          </button>
        </div>
      </div>

      {/* Workspace Area */}
      <div 
        ref={containerRef}
        className={cn(
          "flex-1 relative overflow-hidden transition-all duration-500",
          workspaceMode === "grid" ? "p-2 gap-2 flex" : "p-0"
        )}
      >
        {/* Grid Background (Floating Mode) */}
        {workspaceMode === "floating" && (
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        )}

        <LayoutGroup>
          {workspacePanels.map((panel) => (
            <WorkspacePanelComponent
              key={panel.id}
              panel={panel}
              mode={workspaceMode}
              isActive={activePanelId === panel.id}
              onFocus={() => handlePanelFocus(panel.id)}
              onDragEnd={(info) => handleDragEnd(panel.id, info)}
              onClose={() => removeWorkspacePanel(panel.id)}
            />
          ))}
        </LayoutGroup>
      </div>
    </div>
  );
};

const WorkspacePanelComponent = ({ 
  panel, mode, isActive, onFocus, onDragEnd, onClose 
}: { 
  panel: WorkspacePanel, 
  mode: WorkspaceMode, 
  isActive: boolean, 
  onFocus: () => void, 
  onDragEnd: (info: any) => void,
  onClose: () => void
}) => {
  const isFloating = mode === "floating";

  return (
    <motion.div
      layout
      drag={isFloating}
      dragMomentum={false}
      onDragStart={onFocus}
      onDragEnd={(_, info) => onDragEnd(info)}
      initial={false}
      animate={{
        x: isFloating ? panel.x : 0,
        y: isFloating ? panel.y : 0,
        width: isFloating ? panel.width : "100%",
        height: isFloating ? panel.height : "100%",
        zIndex: panel.zIndex,
        position: isFloating ? "absolute" : "relative",
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.4
      }}
      className={cn(
        "glass-card flex flex-col overflow-hidden group",
        isActive ? "border-cyan-500/40 shadow-[0_0_30px_rgba(34,211,238,0.1)]" : "border-white/10",
        !isFloating && "flex-1"
      )}
      onMouseDown={onFocus}
    >
      {/* Panel Header */}
      <div className="h-10 px-4 border-b border-white/5 bg-white/[0.03] flex items-center justify-between cursor-move select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500/40 hover:bg-red-500 transition-colors cursor-pointer" onClick={onClose} />
            <div className="w-2 h-2 rounded-full bg-yellow-500/40 hover:bg-yellow-500 transition-colors cursor-pointer" />
            <div className="w-2 h-2 rounded-full bg-green-500/40 hover:bg-green-500 transition-colors cursor-pointer" />
          </div>
          <div className="h-4 w-[1px] bg-white/10 mx-1" />
          <div className="flex items-center gap-2">
            {panel.type === "ai" && <Zap className="w-3.5 h-3.5 text-cyan-400" />}
            {panel.type === "data" && <Database className="w-3.5 h-3.5 text-cyan-400" />}
            {panel.type === "canvas" && <Layers className="w-3.5 h-3.5 text-cyan-400" />}
            <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{panel.title}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1 rounded hover:bg-white/5 text-white/40 hover:text-white transition-colors">
            <Maximize2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Panel Content */}
      <div className="flex-1 p-6 overflow-hidden relative">
        {panel.type === "ai" && (
          <div className="h-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white/80">AI Insights Engine</h4>
              <span className="text-[10px] font-mono text-cyan-400">v4.2.0-stable</span>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-2">
                  <div className="flex items-center gap-2">
                    <Activity className="w-3 h-3 text-cyan-400" />
                    <span className="text-[10px] font-bold uppercase tracking-tight text-white/40">Anomaly Detected</span>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Unusual performance spike detected in Tech department. Efficiency increased by 14% compared to last sprint.
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {panel.type === "data" && (
          <div className="h-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white/80">Data Stream</h4>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-mono text-white/40">Live</span>
              </div>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-cyan-500/10 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium">report_q1_final.pdf</p>
                      <p className="text-[10px] text-white/40">2.4 MB • Updated 2m ago</p>
                    </div>
                  </div>
                  <button className="text-[10px] font-bold text-cyan-400 uppercase hover:underline">View</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {panel.type === "canvas" && (
          <div className="h-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white/80">Visual Sandbox</h4>
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded bg-white/5 hover:bg-white/10 transition-colors"><Square className="w-3 h-3" /></button>
                <button className="p-1.5 rounded bg-white/5 hover:bg-white/10 transition-colors"><Columns className="w-3 h-3" /></button>
                <button className="p-1.5 rounded bg-white/5 hover:bg-white/10 transition-colors"><Rows className="w-3 h-3" /></button>
              </div>
            </div>
            <div className="flex-1 rounded-xl border border-dashed border-white/10 bg-white/[0.01] flex flex-col items-center justify-center gap-3">
              <BarChart3 className="w-8 h-8 text-white/10" />
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Drop blocks here</p>
            </div>
          </div>
        )}
      </div>

      {/* Resize Handles (Floating Only) */}
      {isFloating && (
        <>
          <div className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-10" />
          <div className="absolute bottom-0 left-0 w-4 h-4 cursor-nesw-resize z-10" />
          <div className="absolute top-0 right-0 w-4 h-4 cursor-nesw-resize z-10" />
          <div className="absolute top-0 left-0 w-4 h-4 cursor-nwse-resize z-10" />
        </>
      )}
    </motion.div>
  );
};
