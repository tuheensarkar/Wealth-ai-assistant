import { useState, useRef } from "react";
import { WealthAIHeader } from "@/components/WealthAIHeader";
import { FinanceSidebar } from "@/components/FinanceSidebar";
import { ChatInterface, ChatInterfaceRef } from "@/components/ChatInterface";
import { QuickActions } from "@/components/QuickActions";
import { WealthAIFooter } from "@/components/WealthAIFooter";

const Index = () => {
  const [showQuickActions, setShowQuickActions] = useState(true);
  const chatRef = useRef<ChatInterfaceRef>(null);

  const handleQuickActionClick = (actionType: string) => {
    setShowQuickActions(false);
    // Trigger the chat interface to handle the quick action
    if (chatRef.current) {
      chatRef.current.handleQuickAction(actionType);
    }
  };

  const handleToolClick = (toolType: string) => {
    setShowQuickActions(false);
    // Handle financial tool clicks
    if (chatRef.current) {
      chatRef.current.handleQuickAction(toolType);
    }
  };

  const handleKnowledgeClick = (knowledgeType: string) => {
    setShowQuickActions(false);
    // Handle knowledge source clicks
    if (chatRef.current) {
      chatRef.current.handleQuickAction(knowledgeType);
    }
  };

  const handleSearchQuery = (query: string) => {
    setShowQuickActions(false);
    // Handle search queries
    if (chatRef.current) {
      chatRef.current.handleSearchQuery(query);
    }
  };

  const handleVoiceCommand = (command: string) => {
    setShowQuickActions(false);
    // Handle voice commands
    if (chatRef.current) {
      chatRef.current.handleSearchQuery(command);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <WealthAIHeader />
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <FinanceSidebar 
          onToolClick={handleToolClick}
          onKnowledgeClick={handleKnowledgeClick}
          onSearchQuery={handleSearchQuery}
          onVoiceCommand={handleVoiceCommand}
        />
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Quick Actions - Shows when no active chat */}
          {showQuickActions && (
            <div className="flex-1 overflow-y-auto">
              <QuickActions onActionClick={handleQuickActionClick} />
            </div>
          )}
          
          {/* Chat Interface */}
          <div className={showQuickActions ? "h-96" : "flex-1"}>
            <ChatInterface 
              ref={chatRef}
              onQuickAction={() => setShowQuickActions(false)}
            />
          </div>
        </main>
      </div>
      
      <WealthAIFooter />
    </div>
  );
};

export default Index;
