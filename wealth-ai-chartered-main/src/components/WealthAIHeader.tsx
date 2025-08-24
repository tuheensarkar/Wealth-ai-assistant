import { useState } from "react";
import { DollarSign, MessageCircle, BookOpen, Calculator, FolderOpen } from "lucide-react";
import { NavigationTabs } from "./ui/navigation-tabs";

interface WealthAIHeaderProps {
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

export const WealthAIHeader = ({ activeTab = "chat", onTabChange }: WealthAIHeaderProps) => {
  const tabs = [
    { id: "chat", label: "Chat", icon: <MessageCircle className="h-4 w-4" /> },
    { id: "knowledge", label: "Knowledge Library", icon: <BookOpen className="h-4 w-4" /> },
    { id: "tools", label: "Tools", icon: <Calculator className="h-4 w-4" /> },
    { id: "plans", label: "My Plans", icon: <FolderOpen className="h-4 w-4" /> },
  ];

  return (
    <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-primary rounded-lg shadow-medium">
            <DollarSign className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Wealth AI</h1>
            <p className="text-sm text-muted-foreground">Your Personal CA Assistant</p>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        {onTabChange && (
          <NavigationTabs 
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={onTabChange}
          />
        )}
        
        {/* Trust Badge */}
        <div className="text-right">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            Professional Financial Guidance
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            AI-powered • Secure • Compliant
          </p>
        </div>
      </div>
    </header>
  );
};