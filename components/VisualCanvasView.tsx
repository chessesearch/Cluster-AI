"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useStore } from "@/store";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Search, Sparkles, Trash2, Maximize2, Minimize2,
  ChevronRight, Layout, Grid, MousePointer2, 
  Zap, BarChart3, PieChart, TrendingUp, AlertCircle,
  CheckCircle2, Info, MoreVertical, Download, Share2,
  Layers, Copy, Settings, RefreshCw, GripVertical,
  Move, LayoutGrid, X, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  Cell, PieChart as RePieChart, Pie, AreaChart, Area, 
  ScatterChart, Scatter, ZAxis, CartesianGrid, LineChart, Line
} from 'recharts';
import { AI_SUGGESTIONS, DEFAULT_DASHBOARD_BLOCKS } from "@/src/mockData";
import { AIBlock, CanvasBlock } from "@/src/types";

// GRID CONFIGURATION
const DEFAULT_BLOCK_W = 8;
const DEFAULT_BLOCK_H = 8;
const MIN_BLOCK_W = 4;
const MIN_BLOCK_H = 4;

export const VisualCanvasView = () => {
  const { 
    aiBlocks, addAIBlock, canvasBlocks, addCanvasBlock, 
    updateCanvasBlock, removeCanvasBlock,
    canvasSize, setCanvasSize
  } = useStore();
  
  const [showGridSettings, setShowGridSettings] = useState(false);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Calculate cell size based on canvas width
  const [cellSize, setCellSize] = useState(20);

  useEffect(() => {
    const updateCellSize = () => {
      if (canvasRef.current) {
        const width = canvasRef.current.clientWidth;
        setCellSize((width / canvasSize.cols) * zoom);
      }
    };
    updateCellSize();
    window.addEventListener("resize", updateCellSize);
    return () => window.removeEventListener("resize", updateCellSize);
  }, [zoom]);

  const handleAddFromSuggestion = (suggestion: any) => {
    setIsGenerating(true);
    setTimeout(() => {
      const newBlocks: AIBlock[] = [
        {
          id: Math.random().toString(36).substr(2, 9),
          type: "chart",
          title: `${suggestion.label} - Trend`,
          content: { data: [45, 52, 38, 65, 48, 72], labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] },
          insightText: "Significant upward trend detected in the last quarter.",
          timestamp: Date.now(),
          chartType: "bar"
        },
        {
          id: Math.random().toString(36).substr(2, 9),
          type: "kpi",
          title: `${suggestion.label} - Performance`,
          content: { value: "84.2%", change: "+5.4%", trend: "up" },
          insightText: "Exceeding target benchmarks by 12%.",
          timestamp: Date.now(),
        }
      ];
      newBlocks.forEach(addAIBlock);
      setIsGenerating(false);
    }, 1500);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const blockId = e.dataTransfer.getData("blockId");
    const block = aiBlocks.find(b => b.id === blockId);
    
    if (block && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate grid coordinates
      const gridX = Math.floor(x / cellSize);
      const gridY = Math.floor(y / cellSize);
      
      const id = Math.random().toString(36).substr(2, 9);
      addCanvasBlock({
        id,
        type: block.type,
        data: block.content,
        gridX: Math.max(0, Math.min(gridX, canvasSize.cols - DEFAULT_BLOCK_W)),
        gridY: Math.max(0, Math.min(gridY, canvasSize.rows - DEFAULT_BLOCK_H)),
        gridWidth: DEFAULT_BLOCK_W,
        gridHeight: DEFAULT_BLOCK_H,
        title: block.title,
        chartType: block.chartType,
        insightText: block.insightText,
        alertType: block.alertType
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  return (
    <div className="flex h-full w-full bg-[#050505] overflow-hidden">
      {/* LEFT: AI Suggestions Panel */}
      <AnimatePresence>
        {showSuggestions && !isFullscreen && (
          <motion.aside
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            className="w-80 border-r border-white/5 bg-white/[0.02] flex flex-col z-30"
          >
            <div className="p-6 border-b border-white/5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                </div>
                <h2 className="text-sm font-bold tracking-tight uppercase">AI Insights</h2>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                <input 
                  type="text"
                  placeholder="Ask CLUSTER AI..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-cyan-500/50 transition-all"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-6">
              <div className="space-y-3">
                <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Suggested Queries</span>
                <div className="flex flex-col gap-2">
                  {AI_SUGGESTIONS.map((suggestion, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleAddFromSuggestion(suggestion)}
                      className="group flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                          <Zap className="w-4 h-4 text-white/40 group-hover:text-cyan-400" />
                        </div>
                        <span className="text-xs text-white/60 group-hover:text-white/90 transition-colors">{suggestion.label}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/10 space-y-3">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-cyan-400" />
                  <span className="text-[10px] font-bold text-cyan-400 uppercase">Pro Tip</span>
                </div>
                <p className="text-[10px] text-white/40 leading-relaxed">
                  Drag any generated block from the top strip directly onto your canvas to build your custom dashboard.
                </p>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* TOP STRIP: Generated Blocks */}
        {!isFullscreen && (
          <div className="h-48 border-b border-white/5 bg-white/[0.01] flex flex-col z-20">
            <div className="px-6 py-2 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-white/20" />
                <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Generated Insight Blocks</span>
              </div>
              {isGenerating && (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-3 h-3 text-cyan-400 animate-spin" />
                  <span className="text-[10px] text-cyan-400 font-bold uppercase">Synthesizing...</span>
                </div>
              )}
            </div>
            <div className="flex-1 flex items-center gap-4 p-4 overflow-x-auto custom-scrollbar">
              {aiBlocks.length === 0 && !isGenerating && (
                <div className="flex-1 flex items-center justify-center text-white/10 italic text-xs">
                  No blocks generated yet. Use the suggestions to start.
                </div>
              )}
              {aiBlocks.map(block => (
                <div
                  key={block.id}
                  draggable
                  onDragStart={(e: React.DragEvent) => {
                    e.dataTransfer.setData("blockId", block.id);
                    e.dataTransfer.effectAllowed = "copy";
                  }}
                  className="flex-shrink-0 w-64 h-full rounded-xl bg-white/5 border border-white/10 p-3 flex flex-col gap-2 cursor-grab active:cursor-grabbing hover:border-cyan-500/30 transition-all group relative"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {block.type === "chart" ? <BarChart3 className="w-3.5 h-3.5 text-cyan-400" /> : <Zap className="w-3.5 h-3.5 text-cyan-400" />}
                      <span className="text-[10px] font-bold text-white/60 truncate max-w-[120px]">{block.title}</span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <GripVertical className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                  </div>
                  <div className="flex-1 bg-white/5 rounded-lg flex items-center justify-center">
                    {block.type === "chart" ? (
                      <TrendingUp className="w-6 h-6 text-cyan-400/20" />
                    ) : (
                      <span className="text-lg font-bold text-cyan-400/40">{block.content?.value || "N/A"}</span>
                    )}
                  </div>
                  <p className="text-[9px] text-white/30 line-clamp-1 italic">{block.insightText}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CANVAS: Grid Layout */}
        <div 
          ref={canvasRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="flex-1 relative overflow-auto custom-scrollbar bg-[#050505] select-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: `${cellSize}px ${cellSize}px`,
            width: `${canvasSize.cols * cellSize}px`,
            height: `${canvasSize.rows * cellSize}px`,
            minWidth: "100%",
            minHeight: "100%"
          }}
        >
          {canvasBlocks.map(block => (
            <GridBlock
              key={block.id}
              block={block}
              cellSize={cellSize}
              gridSize={canvasSize}
              isActive={activeBlockId === block.id}
              onFocus={() => setActiveBlockId(block.id)}
              onUpdate={(updates) => updateCanvasBlock(block.id, updates)}
              onRemove={() => removeCanvasBlock(block.id)}
            />
          ))}

          {canvasBlocks.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/10 gap-6 pointer-events-none">
              <div className="relative">
                <LayoutGrid className="w-24 h-24 opacity-5" />
                <MousePointer2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 opacity-20 animate-bounce" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-lg font-bold tracking-tight uppercase opacity-20">Canvas Empty</p>
                <p className="text-xs italic opacity-10 max-w-xs">
                  Drag insights from the top strip and drop them here to build your visual workspace.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Floating Controls */}
        <div className="absolute bottom-6 right-6 flex items-center gap-3 z-50">
          <div className="flex items-center gap-1 p-1.5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl">
            <button 
              onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
              className="p-2 rounded-xl text-white/40 hover:text-white/60 hover:bg-white/5 transition-all"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-mono text-white/40 px-2">{Math.round(zoom * 100)}%</span>
            <button 
              onClick={() => setZoom(Math.min(2, zoom + 0.1))}
              className="p-2 rounded-xl text-white/40 hover:text-white/60 hover:bg-white/5 transition-all"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          <div className="relative">
            <button 
              onClick={() => setShowGridSettings(!showGridSettings)}
              className={cn(
                "p-3 rounded-2xl border transition-all shadow-2xl backdrop-blur-xl bg-white/5 border-white/10 text-white/60 hover:bg-white/10",
                showGridSettings && "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
              )}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            
            <AnimatePresence>
              {showGridSettings && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="absolute bottom-full right-0 mb-4 w-48 bg-[#0A0A0A]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Grid Columns</label>
                      <input 
                        type="number" 
                        value={canvasSize.cols}
                        onChange={(e) => setCanvasSize({ ...canvasSize, cols: parseInt(e.target.value) || 20 })}
                        className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500/30"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Grid Rows</label>
                      <input 
                        type="number" 
                        value={canvasSize.rows}
                        onChange={(e) => setCanvasSize({ ...canvasSize, rows: parseInt(e.target.value) || 20 })}
                        className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500/30"
                      />
                    </div>
                  </div>
                  <div className="pt-2 border-t border-white/5">
                    <p className="text-[9px] text-white/20 italic italic italic">Resizing adjusts the total workspace area.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={() => setShowSuggestions(!showSuggestions)}
            className={cn(
              "p-3 rounded-2xl border transition-all shadow-2xl backdrop-blur-xl",
              showSuggestions ? "bg-cyan-500 border-cyan-400 text-white" : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
            )}
          >
            <Sparkles className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={cn("p-3 rounded-2xl border transition-all backdrop-blur-xl bg-white/5 border-white/10 text-white/60 hover:bg-white/10")}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

const ChartRenderer = ({ type, data, chartType }: { type: string, data: any, chartType?: string }) => {
  if (type !== "chart") return null;

  const colors = ["#22d3ee", "#818cf8", "#f472b6", "#fbbf24", "#34d399"];

  switch (chartType) {
    case "line":
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)' }} />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ background: 'rgba(5, 5, 5, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }}
            />
            <Line type="monotone" dataKey="satisfied" stroke="#818cf8" strokeWidth={2} dot={{ r: 2, fill: '#818cf8' }} activeDot={{ r: 4 }} />
            <Line type="monotone" dataKey="neutral" stroke="#fbbf24" strokeWidth={2} dot={{ r: 2, fill: '#fbbf24' }} activeDot={{ r: 4 }} />
            <Line type="monotone" dataKey="unsatisfied" stroke="#f472b6" strokeWidth={2} dot={{ r: 2, fill: '#f472b6' }} activeDot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      );
    case "bar":
    case "histogram":
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)' }} />
            <YAxis hide domain={[0, 'auto']} />
            <Tooltip 
              contentStyle={{ background: 'rgba(5, 5, 5, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }}
              itemStyle={{ color: '#22d3ee' }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data?.map((entry: any, index: number) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.highlight ? "#818cf8" : "rgba(129, 140, 248, 0.2)"} 
                  stroke={entry.highlight ? "#818cf8" : "none"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
    case "pie":
      return (
        <div className="w-full h-full flex items-center">
          <div className="flex-1 h-full">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={data}
                  innerRadius="65%"
                  outerRadius="85%"
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {data?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color || colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: 'rgba(5, 5, 5, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }}
                />
              </RePieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-none w-32 flex flex-col gap-2 pr-2">
            {data?.map((item: any, i: number) => (
              <div key={i} className="flex flex-col">
                <span className="text-[7px] text-white/40 uppercase font-bold tracking-tight">{item.name}</span>
                <span className="text-[9px] text-white font-mono">${(item.value / 1000).toLocaleString()}k</span>
              </div>
            ))}
          </div>
        </div>
      );
    case "area":
      return (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" hide />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ background: 'rgba(5, 5, 5, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '10px' }}
            />
            <Area type="monotone" dataKey="value" stroke="#22d3ee" fillOpacity={1} fill="url(#colorVal)" />
          </AreaChart>
        </ResponsiveContainer>
      );
    case "scatter":
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <XAxis type="number" dataKey="x" hide />
            <YAxis type="number" dataKey="y" hide />
            <ZAxis type="number" dataKey="z" range={[50, 400]} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ background: 'rgba(5, 5, 5, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '10px' }} />
            <Scatter name="Points" data={data} fill="#22d3ee" fillOpacity={0.6} />
          </ScatterChart>
        </ResponsiveContainer>
      );
    case "boxplot":
      return (
        <div className="w-full h-full flex items-center justify-around px-4">
          {data?.map((item: any, i: number) => (
            <div key={i} className="flex flex-col items-center gap-2 h-full justify-center">
              <div className="w-0.5 h-12 bg-white/20 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-white/40" />
                <div 
                  className="absolute left-1/2 -translate-x-1/2 w-6 border border-cyan-500/50 bg-cyan-500/10 rounded-sm"
                  style={{ top: '20%', height: '50%' }}
                >
                  <div className="absolute top-1/2 w-full h-0.5 bg-cyan-400" />
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-white/40" />
              </div>
              <span className="text-[8px] text-white/40">{item.name}</span>
            </div>
          ))}
        </div>
      );
    default:
      return (
        <div className="text-center">
          <span className="text-[10px] text-white/40 italic">Visualization coming soon</span>
        </div>
      );
  }
};

const GridBlock = ({ 
  block, cellSize, gridSize, isActive, onFocus, onUpdate, onRemove 
}: { 
  block: CanvasBlock, 
  cellSize: number, 
  gridSize: { cols: number, rows: number },
  isActive: boolean, 
  onFocus: () => void,
  onUpdate: (updates: Partial<CanvasBlock>) => void,
  onRemove: () => void
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0, gridX: 0, gridY: 0 });
  const resizeStartPos = useRef({ x: 0, y: 0, gridW: 0, gridH: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    onFocus();
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      gridX: block.gridX,
      gridY: block.gridY
    };

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - dragStartPos.current.x;
      const deltaY = moveEvent.clientY - dragStartPos.current.y;
      
      const newGridX = Math.max(0, Math.min(gridSize.cols - block.gridWidth, dragStartPos.current.gridX + Math.round(deltaX / cellSize)));
      const newGridY = Math.max(0, Math.min(gridSize.rows - block.gridHeight, dragStartPos.current.gridY + Math.round(deltaY / cellSize)));
      
      if (newGridX !== block.gridX || newGridY !== block.gridY) {
        onUpdate({ gridX: newGridX, gridY: newGridY });
      }
    };

    const onMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    resizeStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      gridW: block.gridWidth,
      gridH: block.gridHeight
    };

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - resizeStartPos.current.x;
      const deltaY = moveEvent.clientY - resizeStartPos.current.y;
      
      const newGridW = Math.max(MIN_BLOCK_W, Math.min(gridSize.cols - block.gridX, resizeStartPos.current.gridW + Math.round(deltaX / cellSize)));
      const newGridH = Math.max(MIN_BLOCK_H, Math.min(gridSize.rows - block.gridY, resizeStartPos.current.gridH + Math.round(deltaY / cellSize)));
      
      if (newGridW !== block.gridWidth || newGridH !== block.gridHeight) {
        onUpdate({ gridWidth: newGridW, gridHeight: newGridH });
      }
    };

    const onMouseUp = () => {
      setIsResizing(false);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
    <motion.div
      initial={false}
      animate={{
        left: block.gridX * cellSize,
        top: block.gridY * cellSize,
        width: block.gridWidth * cellSize,
        height: block.gridHeight * cellSize,
        zIndex: isActive ? 40 : 10
      }}
      transition={{ type: "spring", stiffness: 400, damping: 40 }}
      className={cn(
        "absolute rounded-2xl glass-card border flex flex-col group overflow-hidden",
        isActive ? "border-cyan-500/50 shadow-[0_0_40px_rgba(34,211,238,0.15)]" : "border-white/10",
        isDragging && "opacity-80 scale-[0.98] cursor-grabbing",
        !isDragging && "hover:border-cyan-500/30 transition-all"
      )}
    >
      {/* Header */}
      <div 
        onMouseDown={handleMouseDown}
        className="h-10 px-4 border-b border-white/5 bg-white/[0.03] flex items-center justify-between cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-center gap-2">
          {block.type === "chart" ? <BarChart3 className="w-3.5 h-3.5 text-cyan-400" /> : <Zap className="w-3.5 h-3.5 text-cyan-400" />}
          <span className="text-[10px] font-bold text-white/80 truncate max-w-[150px]">{block.title}</span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col gap-3 overflow-hidden">
        <div className="flex-1 bg-white/[0.02] rounded-xl border border-white/5 p-3 flex items-center justify-center relative overflow-hidden">
          {block.type === "kpi" ? (
            <div className="w-full h-full flex flex-col justify-center gap-1">
              <span className="text-3xl font-bold tracking-tighter text-white">{block.data?.value || "N/A"}</span>
              <div className="flex flex-col gap-0.5">
                {block.data?.change && (
                  <div className={cn(
                    "flex items-center gap-1 text-[10px] font-bold",
                    block.data.trend === "up" ? "text-green-400" : "text-red-400"
                  )}>
                    {block.data.trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {block.data.change}
                    <span className="text-white/20 font-normal ml-1">{block.data.subtitle}</span>
                  </div>
                )}
                {!block.data?.change && block.data?.subtitle && (
                  <span className="text-[9px] text-white/30 leading-tight">{block.data.subtitle}</span>
                )}
              </div>
            </div>
          ) : (
            <ChartRenderer type={block.type} data={block.data} chartType={block.chartType} />
          )}
        </div>

        {block.insightText && (
          <div className="p-2 rounded-lg bg-white/5 border border-white/5">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
              <span className="text-[8px] font-bold text-cyan-400 uppercase tracking-widest">AI Insight</span>
            </div>
            <p className="text-[9px] text-white/50 leading-relaxed italic line-clamp-2">
              "{block.insightText}"
            </p>
          </div>
        )}
      </div>

      {/* Resize Handle */}
      <div 
        onMouseDown={handleResizeStart}
        className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <div className="w-1.5 h-1.5 border-r border-b border-white/40 rounded-br-sm" />
      </div>

      {/* Snap Indicator (only when dragging/resizing) */}
      {(isDragging || isResizing) && (
        <div className="absolute inset-0 border-2 border-cyan-500/20 pointer-events-none animate-pulse" />
      )}
    </motion.div>
  );
};

