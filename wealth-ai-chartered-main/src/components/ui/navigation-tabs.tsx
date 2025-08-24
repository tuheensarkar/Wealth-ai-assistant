import { useState } from "react";
import { cn } from "@/lib/utils";

interface NavigationTabsProps {
  tabs: Array<{
    id: string;
    label: string;
    icon?: React.ReactNode;
  }>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export const NavigationTabs = ({ tabs, activeTab, onTabChange, className }: NavigationTabsProps) => {
  return (
    <div className={cn("flex space-x-1 rounded-lg bg-muted p-1", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            activeTab === tab.id
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-background/50"
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
};