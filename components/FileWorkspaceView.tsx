"use client";

import React, { useState, useEffect, useRef } from "react";
import { useStore } from "@/store";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { 
  Maximize2, Minimize2, X, GripHorizontal, LayoutGrid, 
  Square, Columns, Rows, Plus, Settings, Sparkles, 
  Database, Zap, FileText, BarChart3, Activity, 
  Layers, MousePointer2, Move, Layout as LayoutIcon,
  Search, Filter, ArrowUpDown, CheckSquare, ListTodo,
  Calendar, Clock, ChevronRight, Check
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

  const [isAddingBlock, setIsAddingBlock] = useState(false);

  const addNewPanel = (type: "ai" | "data" | "canvas" | "todo", title: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    let config = {};
    if (type === "todo") {
      config = {
        todos: [
          { id: '1', text: 'Analyze Q1 performance metrics', completed: true, date: 'Apr 12' },
          { id: '2', text: 'Generate revenue stream visualization', completed: true, date: 'Apr 14' },
          { id: '3', text: 'Optimize data storage architecture', completed: true, date: 'Today' },
          { id: '4', text: 'Review team performance distribution', completed: false, date: 'Tomorrow' },
          { id: '5', text: 'Implement automated reporting v2', completed: false, date: 'Apr 20' },
          { id: '6', text: 'Sync with department managers', completed: false, date: 'Apr 22' },
        ]
      };
    }
    addWorkspacePanel({
      id,
      type,
      title,
      x: 100 + (workspacePanels.length * 20),
      y: 100 + (workspacePanels.length * 20),
      width: 500,
      height: 400,
      zIndex: workspacePanels.length + 1,
      config
    });
    setIsAddingBlock(false);
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

        <div className="flex items-center gap-2 relative">
          <button 
            onClick={() => setIsAddingBlock(!isAddingBlock)}
            className={cn(
              "p-2 rounded-lg border transition-all duration-300",
              isAddingBlock 
                ? "bg-cyan-500 border-cyan-400 text-white shadow-[0_0_15px_rgba(34,211,238,0.4)]" 
                : "bg-white/5 border-white/10 text-white/40 hover:text-white"
            )}
          >
            <Plus className={cn("w-4 h-4 transition-transform duration-300", isAddingBlock && "rotate-45")} />
          </button>

          <AnimatePresence>
            {isAddingBlock && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 mt-2 w-56 rounded-xl border border-white/10 bg-[#0A0A0A]/95 backdrop-blur-xl p-2 shadow-2xl z-50 overflow-hidden"
              >
                <div className="text-[10px] font-bold text-white/30 px-3 py-2 uppercase tracking-widest">Add Workspace Block</div>
                <div className="space-y-1">
                  {[
                    { type: 'ai', title: 'AI Assistant', icon: zapIcon, color: 'text-cyan-400' },
                    { type: 'data', title: 'Data Explorer', icon: databaseIcon, color: 'text-purple-400' },
                    { type: 'canvas', title: 'Visual Canvas', icon: layersIcon, color: 'text-blue-400' },
                    { type: 'todo', title: 'Note & Todo', icon: listTodoIcon, color: 'text-emerald-400' },
                  ].map((item) => (
                    <button
                      key={item.type}
                      onClick={() => addNewPanel(item.type as any, item.title)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors group"
                    >
                      <div className={cn("w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors", item.color)}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-white/70 group-hover:text-white transition-colors">{item.title}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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

const zapIcon = Zap;
const databaseIcon = Database;
const layersIcon = Layers;
const listTodoIcon = ListTodo;

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
  const { updateWorkspacePanel } = useStore();
  const isFloating = mode === "floating";

  const toggleTodo = (todoId: string) => {
    if (!panel.config?.todos) return;
    const newTodos = panel.config.todos.map((t: any) => 
      t.id === todoId ? { ...t, completed: !t.completed } : t
    );
    updateWorkspacePanel(panel.id, {
      config: { ...panel.config, todos: newTodos }
    });
  };

  const completedCount = panel.config?.todos?.filter((t: any) => t.completed).length || 0;
  const totalCount = panel.config?.todos?.length || 1;
  const progress = Math.round((completedCount / totalCount) * 100);

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
            {panel.type === "data" && <Database className="w-3.5 h-3.5 text-purple-400" />}
            {panel.type === "canvas" && <Layers className="w-3.5 h-3.5 text-blue-400" />}
            {panel.type === "todo" && <ListTodo className="w-3.5 h-3.5 text-emerald-400" />}
            <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{panel.title}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1 rounded hover:bg-white/5 text-white/40 hover:text-white transition-colors">
            <Maximize2 className="w-3 h-3" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="p-1 rounded-lg hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-all group/close"
          >
            <X className="w-3.5 h-3.5 group-hover/close:scale-110" />
          </button>
        </div>
        </div>

      {/* Panel Content */}
      <div className="flex-1 p-6 overflow-hidden relative">
        {panel.type === "ai" && (
          <div className="h-full flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
              <input 
                type="text" 
                placeholder="Ask CLUSTER AI about your data..."
                className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-wider">AI Insight Engine</h4>
              </div>
              <span className="text-[9px] font-mono text-cyan-400/60 bg-cyan-400/5 px-2 py-0.5 rounded border border-cyan-400/10">v4.2.0-stable</span>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2">
              {[
                { title: 'Anomaly Detected', text: 'Unusual performance spike detected in Tech department. Efficiency increased by 14% compared to last sprint.', type: 'warning' },
                { title: 'Predictive Insight', text: 'Based on current trends, Q3 revenue is projected to exceed targets by 12% if current growth continues.', type: 'info' },
                { title: 'Efficiency Alert', text: 'Sales representative 04 has achieved 115% of their monthly goal 2 weeks ahead of schedule.', type: 'success' },
              ].map((insight, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-2 group hover:bg-white/[0.07] transition-all cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className={cn("w-3 h-3", insight.type === 'warning' ? 'text-orange-400' : insight.type === 'success' ? 'text-emerald-400' : 'text-cyan-400')} />
                      <span className="text-[10px] font-bold uppercase tracking-tight text-white/60">{insight.title}</span>
                    </div>
                    <ChevronRight className="w-3 h-3 text-white/10 group-hover:text-white/30 transition-colors" />
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed group-hover:text-white/60 transition-colors">
                    {insight.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {panel.type === "data" && (
          <div className="h-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 flex items-center gap-2">
                  <FileText className="w-3 h-3 text-purple-400" />
                  <span className="text-xs font-bold text-white/80">q1_performance.csv</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-white/30 font-mono tracking-tighter">LIVE_STREAMED</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-white/40 hover:text-white transition-colors">
                  <Filter className="w-3 h-3" />
                </button>
                <button className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-white/40 hover:text-white transition-colors">
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="flex-1 rounded-xl border border-white/5 bg-white/[0.01] overflow-hidden flex flex-col">
              <div className="grid grid-cols-4 border-b border-white/5 bg-white/5 p-3 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                <div>ID</div>
                <div>ENTITY_NAME</div>
                <div>VALUE_SCORE</div>
                <div>STATUS</div>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {[
                  { id: '#001', name: 'Alpha Stream', score: 98, status: 'Stable' },
                  { id: '#002', name: 'Beta Node', score: 76, status: 'Processing' },
                  { id: '#003', name: 'Gamma Link', score: 85, status: 'Stable' },
                  { id: '#004', name: 'Delta Array', score: 92, status: 'Synced' },
                  { id: '#005', name: 'Epsilon Core', score: 45, status: 'Critical' },
                  { id: '#006', name: 'Zeta Pulse', score: 88, status: 'Stable' },
                  { id: '#007', name: 'Eta Wave', score: 73, status: 'Optimizing' },
                ].map((row, i) => (
                  <div key={i} className="grid grid-cols-4 p-3 border-b border-white/[0.02] text-[11px] text-white/60 hover:bg-white/[0.03] transition-colors">
                    <div className="font-mono text-white/30">{row.id}</div>
                    <div className="font-semibold">{row.name}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500/50" style={{ width: `${row.score}%` }} />
                        </div>
                        <span className="text-[9px] font-mono">{row.score}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className={cn("w-1 h-1 rounded-full", row.status === 'Critical' ? 'bg-red-500' : 'bg-emerald-500')} />
                      <span>{row.status}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-white/5 flex items-center justify-between bg-black/20">
                <div className="relative flex-1 mr-4">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/10" />
                  <input type="text" placeholder="Search data..." className="w-full bg-transparent text-[10px] pl-7 pr-2 py-1 outline-none text-white/40" />
                </div>
                <div className="text-[9px] text-white/20 font-mono italic">7 RECORDS FOUND</div>
              </div>
            </div>
          </div>
        )}

        {panel.type === "todo" && (
          <div className="h-full flex flex-col gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Workspace Progress</span>
                <span className="text-[10px] font-mono text-emerald-400">{progress}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/5">
                <div 
                  className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] rounded-full transition-all duration-500" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2 pt-2">
              {(panel.config?.todos || []).map((todo: any, i: number) => (
                <div 
                  key={i} 
                  onClick={() => toggleTodo(todo.id)}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer group",
                    todo.completed ? "bg-emerald-500/5 border-emerald-500/10 opacity-60" : "bg-white/5 border-white/5 hover:border-white/20"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-5 h-5 rounded-md flex items-center justify-center transition-all",
                      todo.completed ? "bg-emerald-500 text-white" : "border-2 border-white/10 bg-white/5 group-hover:border-emerald-500/50"
                    )}>
                      {todo.completed && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <p className={cn("text-xs font-medium", todo.completed && "line-through text-white/40")}>{todo.text}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Calendar className="w-2.5 h-2.5 text-white/20" />
                        <span className="text-[9px] text-white/20 uppercase font-bold tracking-tighter">{todo.date}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-3 h-3 text-white/5 group-hover:text-white/20 transition-colors" />
                </div>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Add new task..." 
                className="flex-1 bg-white/5 border border-white/5 rounded-lg py-1.5 px-3 text-[11px] focus:outline-none focus:border-emerald-500/30 transition-colors"
              />
              <button className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {panel.type === "canvas" && (
          <div className="h-full flex flex-col gap-4">
            <div className="flex items-center justify-between bg-white/5 p-2 rounded-xl backdrop-blur-sm border border-white/5">
              <div className="flex items-center gap-2">
                <button className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/40 hover:text-white"><ArrowUpDown className="w-3 h-3" /></button>
                <div className="w-[1px] h-3 bg-white/10 mx-1" />
                <button className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/40 hover:text-white"><Square className="w-3 h-3" /></button>
                <button className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/40 hover:text-white"><Columns className="w-3 h-3" /></button>
                <button className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/40 hover:text-white"><Rows className="w-3 h-3" /></button>
              </div>
              <div className="text-[9px] font-mono text-white/20 uppercase tracking-widest px-2">Block Palette</div>
            </div>
            
            <div className="flex-1 grid grid-cols-2 gap-3 overflow-y-auto pr-2 custom-scrollbar">
              {[
                { title: 'Sales KPI', icon: BarChart3, color: 'text-cyan-400' },
                { title: 'Project Health', icon: Activity, color: 'text-emerald-400' },
                { title: 'Regional Map', icon: Database, color: 'text-purple-400' },
                { title: 'Team Distribution', icon: Zap, color: 'text-orange-400' },
                { title: 'Expense Donut', icon: Layers, color: 'text-blue-400' },
                { title: 'Custom Insight', icon: Sparkles, color: 'text-yellow-400' },
              ].map((item, i) => (
                <div key={i} className="aspect-video rounded-xl border border-dashed border-white/10 bg-white/[0.01] hover:bg-white/[0.05] hover:border-white/30 transition-all flex flex-col items-center justify-center gap-2 group cursor-grab active:cursor-grabbing">
                  <div className={cn("p-2 rounded-lg bg-white/5 transition-transform group-hover:scale-110", item.color)}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest group-hover:text-white/60 transition-colors">{item.title}</span>
                </div>
              ))}
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
