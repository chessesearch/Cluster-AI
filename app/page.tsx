"use client";

import React, { useEffect, useState } from "react";
import { useStore } from "@/store";
import { Navbar } from "@/components/Navbar";
import { DataStorageView } from "@/components/DataStorageView";
import { VisualView } from "@/components/VisualView";
import { FileWorkspaceView } from "@/components/FileWorkspaceView";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { activeTab } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="flex flex-col h-screen w-screen bg-[#050505] text-white overflow-hidden">
      <Navbar />
      
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="h-full w-full"
          >
            {activeTab === "Data Storage" && <DataStorageView />}
            {activeTab === "Visual View" && <VisualView />}
            {activeTab === "File Workspace" && <FileWorkspaceView />}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
