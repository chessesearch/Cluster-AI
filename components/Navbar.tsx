"use client";

import React from "react";
import { useStore } from "@/store";
import { AppTab } from "@/src/types";
import { Database, LayoutDashboard, FolderTree, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/src/lib/utils";

export const Navbar = () => {
  const { activeTab, setActiveTab } = useStore();

  const tabs: { id: AppTab; label: string; icon: any }[] = [
    { id: "Data Storage", label: "Data Storage", icon: Database },
    { id: "Visual Canvas", label: "Visual Canvas", icon: Zap },
    { id: "File Workspace", label: "File Workspace", icon: FolderTree },
  ];

  return (
    <nav className="h-16 border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl flex items-center justify-between px-6 z-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center cyan-glow">
          <Zap className="w-5 h-5 text-white fill-white" />
        </div>
        <span className="text-xl font-bold tracking-tighter cyan-text-gradient">
          CLUSTER
        </span>
      </div>

      <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                isActive ? "text-white" : "text-white/40 hover:text-white/60"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute inset-0 bg-white/10 rounded-lg border border-white/10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon className={cn("w-4 h-4", isActive ? "text-cyan-400" : "text-current")} />
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
          <span className="text-xs text-white/40 uppercase tracking-widest font-mono">System Status</span>
          <span className="text-xs text-cyan-400 font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Operational
          </span>
        </div>
      </div>
    </nav>
  );
};
