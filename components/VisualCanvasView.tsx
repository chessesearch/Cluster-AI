"use client";

import React, { useState, useRef, useEffect } from "react";
import { useStore } from "@/store";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Search, Sparkles, Trash2, Maximize2, Minimize2,
  ChevronRight, Layout, Grid, MousePointer2, 
  Zap, BarChart3, PieChart, TrendingUp, AlertCircle,
  CheckCircle2, Info, MoreVertical, Download, Share2,
  Layers, Copy, Settings, RefreshCw, GripVertical
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AI_SUGGESTIONS } from "@/src/mockData";
import { AIBlock, CanvasBlock } from "@/src/types";

export const VisualCanvasView = () => {
  const { 
    aiBlocks, addAIBlock, canvasBlocks, addCanvasBlock, 
    updateCanvasBlock, removeCanvasBlock 
  } = useStore();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleAddFromSuggestion = (suggestion: any) => {
    setIsGenerating(true);
    // Simulate multi-block generation
    setTimeout(() => {
      const newBlocks: AIBlock[] = [
        {
          id: Math.random().toString(36).substr(2, 9),
          type: "chart",
          title: `${suggestion.label} - Trend Analysis`,
          content: { data: [45, 52, 38, 65, 48, 72], labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] },
          insightText: "Significant upward trend detected in the last quarter.",
          timestamp: Date.now(),
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

  const handleDragToCanvas = (block: AIBlock) => {
    const id = Math.random().toString(36).substr(2, 9);
    // Find a free spot or just place it at the top
    const newCanvasBlock: CanvasBlock = {
      id,
      blockId: block.id,
      x: 0,
      y: 0,
      w: 4, // 4 columns
      h: 4, // 4 rows
    };
    addCanvasBlock(newCanvasBlock);
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
                <motion.div
                  key={block.id}
                  layoutId={block.id}
                  className="flex-shrink-0 w-64 h-full rounded-xl bg-white/5 border border-white/10 p-3 flex flex-col gap-2 cursor-grab active:cursor-grabbing hover:border-cyan-500/30 transition-all group relative"
                  onClick={() => handleDragToCanvas(block)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {block.type === "chart" ? <BarChart3 className="w-3.5 h-3.5 text-cyan-400" /> : <Zap className="w-3.5 h-3.5 text-cyan-400" />}
                      <span className="text-[10px] font-bold text-white/60 truncate max-w-[120px]">{block.title}</span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                  </div>
                  <div className="flex-1 bg-white/5 rounded-lg flex items-center justify-center">
                    {block.type === "chart" ? (
                      <TrendingUp className="w-6 h-6 text-cyan-400/20" />
                    ) : (
                      <span className="text-lg font-bold text-cyan-400/40">{block.content.value}</span>
                    )}
                  </div>
                  <p className="text-[9px] text-white/30 line-clamp-1 italic">{block.insightText}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* CANVAS: Grid Layout */}
        <div 
          ref={canvasRef}
          className="flex-1 relative overflow-auto custom-scrollbar p-8 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-fixed"
        >
          {/* Grid Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
               style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          <div className="grid grid-cols-12 gap-4 auto-rows-[100px] relative min-h-full">
            {canvasBlocks.map(canvasBlock => {
              const blockData = aiBlocks.find(b => b.id === canvasBlock.blockId);
              if (!blockData) return null;

              return (
                <motion.div
                  key={canvasBlock.id}
                  layout
                  className={cn(
                    "rounded-2xl glass-card border border-white/10 p-5 flex flex-col gap-4 group relative overflow-hidden",
                    "hover:border-cyan-500/30 transition-all duration-500"
                  )}
                  style={{
                    gridColumn: `span ${canvasBlock.w}`,
                    gridRow: `span ${canvasBlock.h}`,
                  }}
                >
                  {/* Block Header */}
                  <div className="flex items-center justify-between z-10">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                        {blockData.type === "chart" ? <BarChart3 className="w-4 h-4 text-cyan-400" /> : <Zap className="w-4 h-4 text-cyan-400" />}
                      </div>
                      <div>
                        <h3 className="text-xs font-bold tracking-tight text-white/90">{blockData.title}</h3>
                        <p className="text-[9px] text-white/40 uppercase tracking-widest font-medium">AI Generated Insight</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 transition-colors">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => removeCanvasBlock(canvasBlock.id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Block Content */}
                  <div className="flex-1 flex flex-col gap-4 z-10">
                    <div className="flex-1 bg-white/[0.02] rounded-xl border border-white/5 p-4 flex items-center justify-center relative overflow-hidden">
                      {blockData.type === "chart" ? (
                        <div className="w-full h-full flex flex-col gap-2">
                          <div className="flex-1 flex items-end gap-1 px-2">
                            {blockData.content.data.map((val: number, i: number) => (
                              <motion.div 
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${(val / 80) * 100}%` }}
                                className="flex-1 bg-gradient-to-t from-cyan-500/40 to-cyan-400/10 rounded-t-sm relative group/bar"
                              >
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity text-[8px] font-mono text-cyan-400">
                                  {val}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                          <div className="flex justify-between px-2">
                            {blockData.content.labels.map((l: string, i: number) => (
                              <span key={i} className="text-[8px] text-white/20 font-mono uppercase">{l}</span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-4xl font-bold tracking-tighter text-white cyan-glow">{blockData.content.value}</span>
                          <div className={cn(
                            "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold",
                            blockData.content.trend === "up" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                          )}>
                            <TrendingUp className={cn("w-3 h-3", blockData.content.trend === "down" && "rotate-180")} />
                            {blockData.content.change}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                        <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest">AI Insight</span>
                      </div>
                      <p className="text-[10px] text-white/60 leading-relaxed italic">
                        "{blockData.insightText}"
                      </p>
                    </div>
                  </div>

                  {/* Resize Handles (Visual only for now) */}
                  <div className="absolute bottom-1 right-1 w-4 h-4 cursor-nwse-resize opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-full h-full border-r-2 border-b-2 border-white/20 rounded-br-sm" />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {canvasBlocks.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/10 gap-6 pointer-events-none">
              <div className="relative">
                <Grid className="w-24 h-24 opacity-5" />
                <MousePointer2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 opacity-20 animate-bounce" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-lg font-bold tracking-tight uppercase opacity-20">Canvas Empty</p>
                <p className="text-xs italic opacity-10 max-w-xs">
                  Generate insights from the left panel and drag them here to build your visual workspace.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Floating Controls */}
        <div className="absolute bottom-6 right-6 flex items-center gap-3 z-50">
          <button 
            onClick={() => setShowSuggestions(!showSuggestions)}
            className={cn(
              "p-3 rounded-2xl border transition-all shadow-2xl backdrop-blur-xl",
              showSuggestions ? "bg-cyan-500 border-cyan-400 text-white" : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
            )}
          >
            <Sparkles className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1 p-1.5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl">
            <button className="p-2 rounded-xl bg-white/10 text-white shadow-inner">
              <Grid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsFullscreen(!isFullscreen)}
              className={cn("p-2 rounded-xl transition-colors", isFullscreen ? "bg-cyan-500 text-white" : "text-white/40 hover:text-white/60")}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
