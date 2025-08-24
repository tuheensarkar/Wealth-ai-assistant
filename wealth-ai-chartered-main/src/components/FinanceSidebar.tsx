import { useState } from "react";
import { 
  FileText, 
  Calculator, 
  TrendingUp, 
  PiggyBank, 
  Receipt, 
  CreditCard,
  ChevronRight,
  Search,
  Upload
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CalculatorDialog } from "@/components/CalculatorDialog";
import { EnhancedDocumentUpload } from "./EnhancedDocumentUpload";
import { VoiceAssistant } from "./VoiceAssistant";

interface FinanceSidebarProps {
  onToolClick: (toolType: string) => void;
  onKnowledgeClick: (knowledgeType: string) => void;
  onSearchQuery: (query: string) => void;
  onVoiceCommand: (command: string) => void;
}

export const FinanceSidebar = ({ onToolClick, onKnowledgeClick, onSearchQuery, onVoiceCommand }: FinanceSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCalculator, setSelectedCalculator] = useState<string | null>(null);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  
  const knowledgeSources = [
    { id: "tax-planning-guide", name: "Tax Planning Guide", icon: FileText, category: "Tax" },
    { id: "investment-strategies", name: "Investment Strategies", icon: TrendingUp, category: "Investment" },
    { id: "retirement-planning", name: "Retirement Planning", icon: PiggyBank, category: "Planning" },
    { id: "expense-management", name: "Expense Management", icon: Receipt, category: "Finance" },
  ];

  const financialTools = [
    { id: "tax-calculator", name: "Tax Calculator", icon: Calculator, description: "Calculate tax savings" },
    { id: "sip-calculator", name: "SIP Calculator", icon: TrendingUp, description: "Estimate SIP returns" },
    { id: "emi-calculator", name: "EMI Calculator", icon: CreditCard, description: "Calculate loan EMIs" },
    { id: "fd-calculator", name: "FD Calculator", icon: PiggyBank, description: "Fixed deposit returns" },
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearchQuery(searchQuery);
      setSearchQuery('');
    }
  };

  const handleKnowledgeItemClick = (item: any) => {
    onKnowledgeClick(item.id);
  };

  const handleToolClick = (tool: any) => {
    setSelectedCalculator(tool.id);
    onToolClick(tool.id);
  };

  return (
    <aside className="w-80 bg-card border-r border-border h-full flex flex-col overflow-y-auto">
      {/* Search Bar */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Search financial topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Voice Assistant Section */}
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
            Voice Assistant
          </h3>
          <VoiceAssistant onVoiceCommand={onVoiceCommand} />
        </div>

        {/* Knowledge Library */}
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
            Knowledge Library
          </h3>
          <div className="space-y-2">
            {knowledgeSources.map((item) => {
              const IconComponent = item.icon;
              return (
                <div 
                  key={item.id}
                  className="tool-card group cursor-pointer"
                  onClick={() => handleKnowledgeItemClick(item)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <IconComponent className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.category}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Financial Tools */}
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
            Financial Tools
          </h3>
          <div className="space-y-2">
            {financialTools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <div 
                  key={tool.id}
                  className="tool-card group cursor-pointer"
                  onClick={() => handleToolClick(tool)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <IconComponent className="w-5 h-5 text-secondary" />
                      <div>
                        <p className="font-medium text-foreground">{tool.name}</p>
                        <p className="text-xs text-muted-foreground">{tool.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Document Analysis Section */}
        <div className="p-4">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
            Document Analysis
          </h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              onClick={() => setShowDocumentUpload(!showDocumentUpload)}
              className="w-full justify-start text-left"
            >
              <Upload className="h-4 w-4 mr-3" />
              Analyze Documents
            </Button>
          </div>
          
          {showDocumentUpload && (
            <div className="mt-4">
              <EnhancedDocumentUpload 
                onDocumentsAnalyzed={(docs) => {
                  console.log('Documents analyzed:', docs);
                  // Handle analyzed documents
                }} 
              />
            </div>
          )}
        </div>
      </div>

      {/* Calculator Dialog */}
      {selectedCalculator && (
        <CalculatorDialog
          isOpen={!!selectedCalculator}
          onClose={() => setSelectedCalculator(null)}
          calculatorType={selectedCalculator}
        />
      )}
    </aside>
  );
};