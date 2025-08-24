import { 
  Calculator, 
  TrendingUp, 
  Receipt, 
  PiggyBank,
  FileText,
  CreditCard
} from "lucide-react";
import { Card } from "@/components/ui/card";

interface QuickActionsProps {
  onActionClick: (actionType: string) => void;
}

export const QuickActions = ({ onActionClick }: QuickActionsProps) => {
  const quickActions = [
    {
      id: "section-80c",
      title: "Section 80C Savings",
      description: "Check deductions & options under Section 80C",
      icon: Receipt,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      id: "sip-calculator",
      title: "SIP Returns Calculator",
      description: "Estimate long-term returns on your SIP",
      icon: TrendingUp,
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    },
    {
      id: "tax-planning",
      title: "Tax Planning Strategies",
      description: "Optimize your tax liability for this year",
      icon: FileText,
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    {
      id: "emi-planning",
      title: "EMI Planning",
      description: "Calculate and plan your loan EMIs",
      icon: CreditCard,
      color: "text-destructive",
      bgColor: "bg-destructive/10"
    },
    {
      id: "investment-portfolio",
      title: "Investment Portfolio",
      description: "Review and rebalance your investments",
      icon: PiggyBank,
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      id: "retirement-planning",
      title: "Retirement Planning",
      description: "Plan for a secure financial future",
      icon: Calculator,
      color: "text-primary",
      bgColor: "bg-primary/10"
    }
  ];

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Popular Questions & Quick Actions
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quickActions.map((action, index) => (
          <Card 
            key={index} 
            className="finance-card-hover cursor-pointer"
            onClick={() => onActionClick(action.id)}
          >
            <div className="flex items-start space-x-4">
              <div className={`
                flex items-center justify-center w-12 h-12 rounded-xl
                ${action.bgColor}
              `}>
                <action.icon className={`w-6 h-6 ${action.color}`} />
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium text-foreground mb-1">
                  {action.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {action.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};