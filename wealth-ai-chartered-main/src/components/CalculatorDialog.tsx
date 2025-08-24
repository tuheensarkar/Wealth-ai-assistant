import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Calculator, TrendingUp, CreditCard, PiggyBank } from "lucide-react";

interface CalculatorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  calculatorType: string;
}

export const CalculatorDialog = ({ isOpen, onClose, calculatorType }: CalculatorDialogProps) => {
  // Tax Calculator State
  const [income, setIncome] = useState('');
  const [deductions, setDeductions] = useState('');
  const [taxResult, setTaxResult] = useState<number | null>(null);

  // SIP Calculator State
  const [monthlyAmount, setMonthlyAmount] = useState('');
  const [years, setYears] = useState('');
  const [expectedReturn, setExpectedReturn] = useState('12');
  const [sipResult, setSipResult] = useState<{maturityAmount: number, totalInvestment: number, totalGains: number} | null>(null);

  // EMI Calculator State
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [tenure, setTenure] = useState('');
  const [emiResult, setEmiResult] = useState<{emi: number, totalAmount: number, totalInterest: number} | null>(null);

  // FD Calculator State
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [fdResult, setFdResult] = useState<{maturityAmount: number, interest: number} | null>(null);

  // Reset all states when dialog closes or calculator type changes
  useEffect(() => {
    setIncome('');
    setDeductions('');
    setTaxResult(null);
    setMonthlyAmount('');
    setYears('');
    setExpectedReturn('12');
    setSipResult(null);
    setLoanAmount('');
    setInterestRate('');
    setTenure('');
    setEmiResult(null);
    setPrincipal('');
    setRate('');
    setTime('');
    setFdResult(null);
  }, [calculatorType, isOpen]);
  
  const getTitleAndIcon = () => {
    switch (calculatorType) {
      case 'tax-calculator':
        return { title: 'Tax Calculator', icon: Calculator };
      case 'sip-calculator':
        return { title: 'SIP Calculator', icon: TrendingUp };
      case 'emi-calculator':
        return { title: 'EMI Calculator', icon: CreditCard };
      case 'fd-calculator':
        return { title: 'FD Calculator', icon: PiggyBank };
      default:
        return { title: 'Calculator', icon: Calculator };
    }
  };

  const { title, icon: Icon } = getTitleAndIcon();

  const calculateTax = () => {
    const grossIncome = parseFloat(income) || 0;
    const totalDeductions = parseFloat(deductions) || 0;
    const taxableIncome = Math.max(0, grossIncome - totalDeductions - 250000); // Standard deduction

    let tax = 0;
    if (taxableIncome > 1250000) {
      tax += (taxableIncome - 1250000) * 0.30;
      tax += 750000 * 0.20;
      tax += 500000 * 0.05;
    } else if (taxableIncome > 500000) {
      tax += (taxableIncome - 500000) * 0.20;
      tax += 500000 * 0.05;
    } else if (taxableIncome > 0) {
      tax += taxableIncome * 0.05;
    }

    setTaxResult(tax);
  };

  const renderTaxCalculator = () => {

    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="income">Annual Income (₹)</Label>
          <Input
            id="income"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            placeholder="Enter your annual income"
            type="number"
          />
        </div>
        <div>
          <Label htmlFor="deductions">Total Deductions (₹)</Label>
          <Input
            id="deductions"
            value={deductions}
            onChange={(e) => setDeductions(e.target.value)}
            placeholder="80C, 80D, etc."
            type="number"
          />
        </div>
        <Button onClick={calculateTax} className="w-full">
          Calculate Tax
        </Button>
        {taxResult !== null && (
          <Card className="p-4">
            <h4 className="font-medium text-foreground mb-2">Tax Calculation Result</h4>
            <p className="text-lg font-semibold text-primary">
              Annual Tax: ₹{taxResult.toLocaleString('en-IN')}
            </p>
            <p className="text-sm text-muted-foreground">
              Monthly Tax: ₹{(taxResult / 12).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </p>
          </Card>
        )}
      </div>
    );
  };

  const calculateSIP = () => {
    const P = parseFloat(monthlyAmount) || 0;
    const r = (parseFloat(expectedReturn) || 12) / 100 / 12;
    const n = (parseFloat(years) || 1) * 12;

    const maturityAmount = P * (((1 + r) ** n - 1) / r) * (1 + r);
    const totalInvestment = P * n;
    const totalGains = maturityAmount - totalInvestment;

    setSipResult({ maturityAmount, totalInvestment, totalGains });
  };

  const renderSIPCalculator = () => {

    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="monthlyAmount">Monthly SIP Amount (₹)</Label>
          <Input
            id="monthlyAmount"
            value={monthlyAmount}
            onChange={(e) => setMonthlyAmount(e.target.value)}
            placeholder="Enter monthly SIP amount"
            type="number"
          />
        </div>
        <div>
          <Label htmlFor="years">Investment Period (Years)</Label>
          <Input
            id="years"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            placeholder="Enter investment period"
            type="number"
          />
        </div>
        <div>
          <Label htmlFor="expectedReturn">Expected Annual Return (%)</Label>
          <Input
            id="expectedReturn"
            value={expectedReturn}
            onChange={(e) => setExpectedReturn(e.target.value)}
            placeholder="12"
            type="number"
          />
        </div>
        <Button onClick={calculateSIP} className="w-full">
          Calculate SIP Returns
        </Button>
        {sipResult !== null && (
          <Card className="p-4">
            <h4 className="font-medium text-foreground mb-2">SIP Calculation Result</h4>
            <div className="space-y-2">
              <p className="text-lg font-semibold text-primary">
                Maturity Amount: ₹{sipResult.maturityAmount.toLocaleString('en-IN')}
              </p>
              <p className="text-sm text-muted-foreground">
                Total Investment: ₹{sipResult.totalInvestment.toLocaleString('en-IN')}
              </p>
              <p className="text-sm text-success">
                Total Gains: ₹{sipResult.totalGains.toLocaleString('en-IN')}
              </p>
            </div>
          </Card>
        )}
      </div>
    );
  };

  const calculateEMI = () => {
    const P = parseFloat(loanAmount) || 0;
    const r = (parseFloat(interestRate) || 0) / 100 / 12;
    const n = (parseFloat(tenure) || 1) * 12;

    const emi = (P * r * ((1 + r) ** n)) / (((1 + r) ** n) - 1);
    const totalAmount = emi * n;
    const totalInterest = totalAmount - P;

    setEmiResult({ emi, totalAmount, totalInterest });
  };

  const renderEMICalculator = () => {

    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="loanAmount">Loan Amount (₹)</Label>
          <Input
            id="loanAmount"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            placeholder="Enter loan amount"
            type="number"
          />
        </div>
        <div>
          <Label htmlFor="interestRate">Interest Rate (% per annum)</Label>
          <Input
            id="interestRate"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            placeholder="Enter interest rate"
            type="number"
          />
        </div>
        <div>
          <Label htmlFor="tenure">Loan Tenure (Years)</Label>
          <Input
            id="tenure"
            value={tenure}
            onChange={(e) => setTenure(e.target.value)}
            placeholder="Enter loan tenure"
            type="number"
          />
        </div>
        <Button onClick={calculateEMI} className="w-full">
          Calculate EMI
        </Button>
        {emiResult !== null && (
          <Card className="p-4">
            <h4 className="font-medium text-foreground mb-2">EMI Calculation Result</h4>
            <div className="space-y-2">
              <p className="text-lg font-semibold text-primary">
                Monthly EMI: ₹{emiResult.emi.toLocaleString('en-IN')}
              </p>
              <p className="text-sm text-muted-foreground">
                Total Amount: ₹{emiResult.totalAmount.toLocaleString('en-IN')}
              </p>
              <p className="text-sm text-warning">
                Total Interest: ₹{emiResult.totalInterest.toLocaleString('en-IN')}
              </p>
            </div>
          </Card>
        )}
      </div>
    );
  };

  const calculateFD = () => {
    const P = parseFloat(principal) || 0;
    const r = (parseFloat(rate) || 0) / 100;
    const t = parseFloat(time) || 1;

    const maturityAmount = P * (1 + r) ** t;
    const interest = maturityAmount - P;

    setFdResult({ maturityAmount, interest });
  };

  const renderFDCalculator = () => {

    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="principal">Principal Amount (₹)</Label>
          <Input
            id="principal"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            placeholder="Enter principal amount"
            type="number"
          />
        </div>
        <div>
          <Label htmlFor="rate">Interest Rate (% per annum)</Label>
          <Input
            id="rate"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="Enter interest rate"
            type="number"
          />
        </div>
        <div>
          <Label htmlFor="time">Time Period (Years)</Label>
          <Input
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="Enter time period"
            type="number"
          />
        </div>
        <Button onClick={calculateFD} className="w-full">
          Calculate FD Returns
        </Button>
        {fdResult !== null && (
          <Card className="p-4">
            <h4 className="font-medium text-foreground mb-2">FD Calculation Result</h4>
            <div className="space-y-2">
              <p className="text-lg font-semibold text-primary">
                Maturity Amount: ₹{fdResult.maturityAmount.toLocaleString('en-IN')}
              </p>
              <p className="text-sm text-success">
                Interest Earned: ₹{fdResult.interest.toLocaleString('en-IN')}
              </p>
            </div>
          </Card>
        )}
      </div>
    );
  };

  const renderCalculator = () => {
    switch (calculatorType) {
      case 'tax-calculator':
        return renderTaxCalculator();
      case 'sip-calculator':
        return renderSIPCalculator();
      case 'emi-calculator':
        return renderEMICalculator();
      case 'fd-calculator':
        return renderFDCalculator();
      default:
        return <div>Calculator not found</div>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Icon className="w-5 h-5 text-primary" />
            <span>{title}</span>
          </DialogTitle>
          <DialogDescription>
            Calculate and analyze your financial data with our built-in calculators.
          </DialogDescription>
        </DialogHeader>
        {renderCalculator()}
      </DialogContent>
    </Dialog>
  );
};