"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useStore } from "@/store";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Filter, Database, Network, ListTree, 
  ChevronRight, ChevronDown, FileText, User, 
  Briefcase, DollarSign, BarChart3, Table as TableIcon,
  Maximize2, Minimize2, Plus, HardDrive, Share2,
  MoreVertical, Download, Trash2, Shield, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import * as d3 from "d3";
import { DATA_SOURCES } from "@/src/mockData";

export const DataStorageView = () => {
  const { 
    employees, tasks, selectedEntityId, setSelectedEntityId,
    expandedNodes, toggleNodeExpansion,
    dataStorageFullscreen, setDataStorageFullscreen,
    dataStorageView, setDataStorageView
  } = useStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [bottomView, setBottomView] = useState<"table" | "analytics">("table");
  const graphRef = useRef<SVGSVGElement>(null);

  // Filtered Data based on selection
  const tableData = useMemo(() => {
    if (!selectedEntityId) return [];
    if (selectedEntityId === "employees-root") return employees;
    if (selectedEntityId === "tasks-root") return tasks;
    
    // If it's a department
    const depts = Array.from(new Set(employees.map(e => e.department)));
    if (depts.includes(selectedEntityId as any)) {
      return employees.filter(e => e.department === selectedEntityId);
    }
    
    // If it's an employee
    const emp = employees.find(e => e.id === selectedEntityId);
    if (emp) return [emp];
    
    // If it's a data source
    const source = DATA_SOURCES.find(s => s.id === selectedEntityId);
    if (source) {
      // Mock data for source
      return employees.slice(0, 5);
    }
    
    return [];
  }, [selectedEntityId, employees, tasks]);

  // Calculate Statistics for the selected data
  const stats = useMemo(() => {
    if (tableData.length === 0) return null;
    
    const isEmployeeData = "performanceScore" in tableData[0];
    const isTaskData = "progress" in tableData[0];
    
    const quantity = tableData.length;
    
    if (isEmployeeData) {
      const salaries = tableData.map((e: any) => e.salary).filter(Boolean);
      const scores = tableData.map((e: any) => e.performanceScore).filter(Boolean);
      
      return {
        type: "employee",
        quantity,
        salary: {
          min: salaries.length ? Math.min(...salaries) : 0,
          max: salaries.length ? Math.max(...salaries) : 0,
          avg: salaries.length ? Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length) : 0
        },
        performance: {
          min: scores.length ? Math.min(...scores) : 0,
          max: scores.length ? Math.max(...scores) : 0,
          avg: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 10) / 10 : 0
        }
      };
    }
    
    if (isTaskData) {
      const progressVals = tableData.map((t: any) => t.progress);
      return {
        type: "task",
        quantity,
        progress: {
          min: progressVals.length ? Math.min(...progressVals) : 0,
          max: progressVals.length ? Math.max(...progressVals) : 0,
          avg: progressVals.length ? Math.round(progressVals.reduce((a, b) => a + b, 0) / progressVals.length) : 0
        }
      };
    }
    
    return { type: "generic", quantity };
  }, [tableData]);

  // Graph Logic with Progressive Exploration
  useEffect(() => {
    if (dataStorageView !== "graph" || !graphRef.current) return;

    const width = graphRef.current.clientWidth;
    const height = graphRef.current.clientHeight;

    // Build nodes based on expandedNodes
    const nodes: any[] = [{ id: "root", name: "CLUSTER DB", type: "root", group: 0 }];
    const links: any[] = [];

    if (expandedNodes.includes("root")) {
      nodes.push({ id: "employees-root", name: "Employees Dataset", type: "dataset", group: 1 });
      nodes.push({ id: "tasks-root", name: "Tasks Dataset", type: "dataset", group: 1 });
      links.push({ source: "root", target: "employees-root" });
      links.push({ source: "root", target: "tasks-root" });
    }

    if (expandedNodes.includes("employees-root")) {
      const depts = Array.from(new Set(employees.map(e => e.department)));
      depts.forEach(dept => {
        nodes.push({ id: dept, name: dept, type: "dept", group: 2 });
        links.push({ source: "employees-root", target: dept });
        
        if (expandedNodes.includes(dept)) {
          employees.filter(e => e.department === dept).forEach(emp => {
            nodes.push({ id: emp.id, name: emp.name, type: "employee", group: 3 });
            links.push({ source: dept, target: emp.id });
          });
        }
      });
    }

    const svg = d3.select(graphRef.current);
    svg.selectAll("*").remove();

    const container = svg.append("g");

    // Zoom behavior
    const zoom = d3.zoom().on("zoom", (event) => {
      container.attr("transform", event.transform);
    });
    svg.call(zoom as any);

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = container.append("g")
      .attr("stroke", "rgba(34,211,238,0.1)")
      .attr("stroke-width", 1)
      .selectAll("line")
      .data(links)
      .join("line");

    const node = container.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .on("click", (event, d: any) => setSelectedEntityId(d.id))
      .on("dblclick", (event, d: any) => {
        event.stopPropagation();
        toggleNodeExpansion(d.id);
      })
      .call(d3.drag<any, any>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    node.append("circle")
      .attr("r", (d: any) => d.type === "root" ? 15 : d.type === "dataset" ? 10 : d.type === "dept" ? 7 : 4)
      .attr("fill", (d: any) => d.type === "root" ? "#22D3EE" : d.type === "dataset" ? "#06B6D4" : d.type === "dept" ? "#FFFFFF" : "rgba(255,255,255,0.4)")
      .attr("class", "cyan-glow")
      .attr("stroke", "rgba(255,255,255,0.1)")
      .attr("stroke-width", 2);

    node.append("text")
      .text((d: any) => d.name)
      .attr("x", 15)
      .attr("y", 5)
      .attr("fill", "rgba(255,255,255,0.6)")
      .attr("font-size", "10px")
      .attr("font-family", "var(--font-sans)")
      .attr("pointer-events", "none");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [dataStorageView, expandedNodes, employees, setSelectedEntityId, toggleNodeExpansion]);

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#050505]">
      {/* LEFT PANEL: Input Sources & Navigation */}
      <AnimatePresence>
        {!dataStorageFullscreen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="w-72 border-r border-white/5 bg-white/[0.02] flex flex-col z-30"
          >
            <div className="p-4 border-b border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Data Sources</span>
                <button className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <Plus className="w-3.5 h-3.5 text-white/40" />
                </button>
              </div>
              
              <div className="space-y-2">
                {DATA_SOURCES.map(source => (
                  <button 
                    key={source.id}
                    onClick={() => setSelectedEntityId(source.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-2.5 rounded-xl border transition-all group",
                      selectedEntityId === source.id 
                        ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" 
                        : "bg-white/5 border-white/5 text-white/60 hover:bg-white/10"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                        selectedEntityId === source.id ? "bg-cyan-500/20" : "bg-white/5 group-hover:bg-white/10"
                      )}>
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold truncate max-w-[120px]">{source.name}</p>
                        <p className="text-[9px] opacity-40">{source.size}</p>
                      </div>
                    </div>
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      source.status === "Connected" ? "bg-cyan-400" : "bg-white/10"
                    )} />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-6">
              <div className="space-y-3">
                <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Navigation</span>
                <div className="flex flex-col gap-1">
                  <button 
                    onClick={() => setDataStorageView("graph")}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all",
                      dataStorageView === "graph" ? "bg-white/10 text-cyan-400" : "text-white/40 hover:text-white/60"
                    )}
                  >
                    <Network className="w-4 h-4" />
                    Graph Explorer
                  </button>
                  <button 
                    onClick={() => setDataStorageView("tree")}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all",
                      dataStorageView === "tree" ? "bg-white/10 text-cyan-400" : "text-white/40 hover:text-white/60"
                    )}
                  >
                    <ListTree className="w-4 h-4" />
                    Hierarchy Tree
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Security</span>
                <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/10 space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-[10px] font-bold text-cyan-400 uppercase">Encrypted</span>
                  </div>
                  <p className="text-[10px] text-white/40 leading-relaxed">
                    All data in this warehouse is AES-256 encrypted at rest.
                  </p>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* CENTER AREA: Graph / Tree */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <div className="flex-1 relative">
          {/* Controls Overlay */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/5 backdrop-blur-xl">
              <button 
                onClick={() => setDataStorageView("graph")}
                className={cn("p-2 rounded-lg transition-all", dataStorageView === "graph" ? "bg-cyan-500 text-white shadow-lg" : "text-white/40 hover:text-white/60")}
              >
                <Network className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setDataStorageView("tree")}
                className={cn("p-2 rounded-lg transition-all", dataStorageView === "tree" ? "bg-cyan-500 text-white shadow-lg" : "text-white/40 hover:text-white/60")}
              >
                <ListTree className="w-4 h-4" />
              </button>
            </div>
            <button 
              onClick={() => setDataStorageFullscreen(!dataStorageFullscreen)}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white/60"
            >
              {dataStorageFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>

          <div className="absolute top-4 left-4 z-10 pointer-events-none">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl">
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Current Context</p>
              <p className="text-sm font-bold text-cyan-400">
                {selectedEntityId || "Global Overview"}
              </p>
            </div>
          </div>

          {/* Graph View */}
          {dataStorageView === "graph" ? (
            <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.02)_0%,transparent_70%)]">
              <svg ref={graphRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl text-[10px] text-white/40 uppercase tracking-widest font-bold pointer-events-none">
                Double-click nodes to expand • Drag to move • Scroll to zoom
              </div>
            </div>
          ) : (
            /* Tree View */
            <div className="w-full h-full p-12 overflow-y-auto custom-scrollbar">
              <div className="max-w-2xl mx-auto space-y-4">
                <div className="flex items-center gap-3 text-cyan-400 mb-8">
                  <Database className="w-6 h-6" />
                  <h2 className="text-xl font-bold tracking-tight uppercase">Cluster Root Hierarchy</h2>
                </div>
                
                <div className="space-y-2">
                  <TreeItem 
                    id="employees-root" 
                    label="Employees Dataset" 
                    icon={User} 
                    depth={0}
                    children={Array.from(new Set(employees.map(e => e.department))).map(dept => ({
                      id: dept,
                      label: dept,
                      icon: Briefcase,
                      children: employees.filter(e => e.department === dept).map(emp => ({
                        id: emp.id,
                        label: emp.name,
                        icon: User
                      }))
                    }))}
                  />
                  <TreeItem 
                    id="tasks-root" 
                    label="Tasks Dataset" 
                    icon={Briefcase} 
                    depth={0}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM PANEL: Contextual Table */}
        <AnimatePresence>
          {selectedEntityId && (
            <motion.div
              initial={{ y: 400 }}
              animate={{ y: 0 }}
              exit={{ y: 400 }}
              className="h-[45%] border-t border-white/10 bg-[#050505]/95 backdrop-blur-3xl flex flex-col z-40"
            >
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                    <TableIcon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold tracking-tight text-white/90">Entity: {selectedEntityId}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-[9px] font-bold text-cyan-400 uppercase">
                        {tableData.length} Records
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <button 
                        onClick={() => setBottomView("table")}
                        className={cn(
                          "text-[9px] font-bold uppercase tracking-widest transition-colors",
                          bottomView === "table" ? "text-cyan-400" : "text-white/20 hover:text-white/40"
                        )}
                      >
                        Records Table
                      </button>
                      <button 
                        onClick={() => setBottomView("analytics")}
                        className={cn(
                          "text-[9px] font-bold uppercase tracking-widest transition-colors",
                          bottomView === "analytics" ? "text-cyan-400" : "text-white/20 hover:text-white/40"
                        )}
                      >
                        Analytics Overview
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                    <input 
                      type="text"
                      placeholder="Filter records..."
                      className="bg-white/5 border border-white/10 rounded-lg py-1.5 pl-9 pr-4 text-xs focus:outline-none focus:border-cyan-500/50 transition-colors w-64"
                    />
                  </div>
                  <button className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white/40">
                    <Download className="w-4 h-4" />
                  </button>
                  <div className="h-6 w-[1px] bg-white/10 mx-1" />
                  <button 
                    onClick={() => setSelectedEntityId(null)}
                    className="p-2 rounded-lg hover:bg-white/5 text-white/40 transition-colors"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-hidden flex flex-col">
                <AnimatePresence mode="wait">
                  {bottomView === "table" ? (
                    <motion.div 
                      key="table"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex-1 overflow-auto custom-scrollbar"
                    >
                      <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-[#050505] z-10">
                          <tr>
                            {tableData.length > 0 && Object.keys(tableData[0]).map(key => (
                              <th key={key} className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
                                <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                                  {key.replace(/([A-Z])/g, ' $1')}
                                  <ChevronDown className="w-3 h-3 opacity-20" />
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {tableData.map((row: any, idx) => (
                            <tr key={idx} className="hover:bg-white/[0.03] transition-colors group">
                              {Object.values(row).map((val: any, i) => (
                                <td key={i} className="px-6 py-4 text-xs border-b border-white/[0.02]">
                                  {typeof val === "number" ? (
                                    <span className="font-mono text-cyan-400/80">{val.toLocaleString()}</span>
                                  ) : typeof val === "boolean" ? (
                                    <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-bold uppercase", val ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400")}>
                                      {val ? "Yes" : "No"}
                                    </span>
                                  ) : (
                                    <span className="text-white/70">{String(val)}</span>
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {tableData.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-white/20 gap-4 py-20">
                          <Database className="w-12 h-12 opacity-10" />
                          <p className="text-sm italic">No data records found for this selection</p>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="analytics"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex-1 p-8 overflow-y-auto custom-scrollbar"
                    >
                      <div className="max-w-6xl mx-auto space-y-8">
                        {/* Simulation Header */}
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h4 className="text-lg font-bold text-white tracking-tight">AI Analytical Insight</h4>
                            <p className="text-xs text-white/40 leading-relaxed max-w-2xl">
                              Neural analysis of {selectedEntityId} reveals critical patterns in performance variability and resource allocation efficiency. 
                              The simulation suggests a 12.4% optimization potential in current operational flows.
                            </p>
                          </div>
                          <div className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Live Simulation</span>
                          </div>
                        </div>

                        {stats ? (
                          <div className="grid grid-cols-4 gap-6">
                            {/* Main Metric Cards */}
                            <div className="glass-card p-6 border-white/5 bg-cyan-500/5 relative overflow-hidden group">
                              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Database className="w-16 h-16" />
                              </div>
                              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Total Quantity</span>
                              <div className="text-4xl font-bold text-white mt-1 tabular-nums">{stats.quantity}</div>
                              <div className="text-[10px] text-cyan-400/60 font-medium mt-2">Active records in selection</div>
                            </div>

                            {stats.type === "employee" && stats.performance && (
                              <div className="col-span-3 grid grid-cols-3 gap-6">
                                <div className="glass-card p-6 border-white/5 bg-purple-500/5 relative overflow-hidden group">
                                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Performance Range</span>
                                  <div className="flex items-baseline gap-2 mt-1">
                                    <span className="text-3xl font-bold text-white tabular-nums">{stats.performance.min}</span>
                                    <span className="text-xs text-white/20 font-bold uppercase">Min</span>
                                    <span className="text-white/10 mx-2">—</span>
                                    <span className="text-3xl font-bold text-white tabular-nums">{stats.performance.max}</span>
                                    <span className="text-xs text-white/20 font-bold uppercase">Max</span>
                                  </div>
                                  <div className="text-[10px] text-purple-400/60 font-medium mt-2">Avg: {stats.performance.avg} pts</div>
                                </div>

                                <div className="glass-card p-6 border-white/5 bg-emerald-500/5 relative overflow-hidden group">
                                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Salary Bandwidth</span>
                                  <div className="flex flex-col mt-1">
                                    <div className="flex items-center justify-between text-xs font-bold text-white">
                                      <span>${(stats.salary?.min || 0).toLocaleString()}</span>
                                      <span className="text-white/20">...</span>
                                      <span>${(stats.salary?.max || 0).toLocaleString()}</span>
                                    </div>
                                    <div className="h-1 bg-white/5 rounded-full mt-3 overflow-hidden">
                                      <div className="h-full bg-emerald-500/50" style={{ width: '100%' }} />
                                    </div>
                                  </div>
                                  <div className="text-[10px] text-emerald-400/60 font-medium mt-3">Avg Salary: ${(stats.salary?.avg || 0).toLocaleString()}</div>
                                </div>

                                <div className="glass-card p-6 border-white/5 bg-orange-500/5 relative overflow-hidden group">
                                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">AI Efficiency Hub</span>
                                  <div className="flex items-center gap-4 mt-2">
                                    <div className="flex-1 h-12 flex flex-col justify-center">
                                      <span className="text-2xl font-bold text-white tabular-nums">92.4%</span>
                                      <span className="text-[9px] text-white/20 font-bold uppercase">Impact Score</span>
                                    </div>
                                    <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
                                      <Zap className="w-5 h-5" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {stats.type === "task" && stats.progress && (
                              <div className="col-span-3 grid grid-cols-2 gap-6">
                                <div className="glass-card p-6 border-white/5 bg-blue-500/5 relative overflow-hidden group">
                                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Progress Distribution</span>
                                  <div className="flex items-baseline gap-2 mt-1">
                                    <span className="text-3xl font-bold text-white tabular-nums">{stats.progress.min}%</span>
                                    <span className="text-white/10 mx-2">—</span>
                                    <span className="text-3xl font-bold text-white tabular-nums">{stats.progress.max}%</span>
                                  </div>
                                  <div className="text-[10px] text-blue-400/60 font-medium mt-2">Team Average: {stats.progress.avg}%</div>
                                </div>
                                <div className="glass-card p-6 border-white/5 bg-cyan-500/5 flex items-center justify-center">
                                  <div className="text-center space-y-1">
                                    <p className="text-[9px] text-white/30 uppercase font-bold tracking-widest">Task Throughput</p>
                                    <p className="text-2xl font-bold text-cyan-400 tabular-nums">OPERATIONAL</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          /* SIMULATION FALLBACK CONTENT */
                          <div className="grid grid-cols-3 gap-6">
                            <div className="glass-card p-6 border-white/5 bg-white/[0.02]">
                              <div className="flex items-center gap-3 mb-4">
                                <HardDrive className="w-4 h-4 text-cyan-400" />
                                <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Storage Integrity</span>
                              </div>
                              <div className="space-y-4">
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: "85%" }}
                                    className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]" 
                                  />
                                </div>
                                <div className="flex justify-between text-[10px] font-medium">
                                  <span className="text-white/40">Data Consistency</span>
                                  <span className="text-white">85.4%</span>
                                </div>
                              </div>
                            </div>

                            <div className="glass-card p-6 border-white/5 bg-white/[0.02]">
                              <div className="flex items-center gap-3 mb-4">
                                <BarChart3 className="w-4 h-4 text-purple-400" />
                                <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Growth Forecast</span>
                              </div>
                              <div className="space-y-4">
                                <div className="flex items-baseline gap-2">
                                  <span className="text-2xl font-bold text-white">+14.2%</span>
                                  <span className="text-[10px] text-emerald-400 font-bold uppercase">Projected</span>
                                </div>
                                <p className="text-[10px] text-white/30 leading-relaxed">
                                  Predictive models show upward trend in output for the next quarter based on historical variances.
                                </p>
                              </div>
                            </div>

                            <div className="glass-card p-6 border-white/5 bg-white/[0.02]">
                              <div className="flex items-center gap-3 mb-4">
                                <Shield className="w-4 h-4 text-emerald-400" />
                                <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Risk Assessment</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 flex items-center justify-center">
                                  <span className="text-[10px] font-bold text-white">LOW</span>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[10px] text-white font-bold uppercase">Minimal Volatility</p>
                                  <p className="text-[9px] text-white/30">Standard deviation &lt; 0.05</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const TreeItem = ({ id, label, icon: Icon, depth, children }: { id: string, label: string, icon: any, depth: number, children?: any[] }) => {
  const { expandedNodes, toggleNodeExpansion, selectedEntityId, setSelectedEntityId } = useStore();
  const isExpanded = expandedNodes.includes(id);
  const isSelected = selectedEntityId === id;

  return (
    <div className="space-y-1">
      <div 
        className={cn(
          "flex items-center gap-3 p-2 rounded-xl border transition-all cursor-pointer group",
          isSelected ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" : "bg-white/5 border-white/5 text-white/60 hover:bg-white/10",
          depth > 0 && "ml-6"
        )}
        onClick={() => setSelectedEntityId(id)}
      >
        <div 
          className="p-1 rounded-md hover:bg-white/10 transition-colors"
          onClick={(e) => {
            if (children) {
              e.stopPropagation();
              toggleNodeExpansion(id);
            }
          }}
        >
          {children ? (
            isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />
          ) : (
            <div className="w-3 h-3" />
          )}
        </div>
        <Icon className={cn("w-4 h-4", isSelected ? "text-cyan-400" : "text-white/40")} />
        <span className="text-xs font-medium flex-1">{label}</span>
        {children && (
          <span className="text-[9px] font-mono opacity-40 bg-white/5 px-1.5 py-0.5 rounded-md">
            {children.length}
          </span>
        )}
      </div>
      
      {children && isExpanded && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          {children.map(child => (
            <TreeItem key={child.id} {...child} depth={depth + 1} />
          ))}
        </motion.div>
      )}
    </div>
  );
};
