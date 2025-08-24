interface Document {
  id: string;
  name: string;
  type: string;
  content: string;
}

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  category: string;
  keywords: string[];
}

class KnowledgeService {
  private documents: Document[] = [];
  private knowledgeBase: KnowledgeItem[] = [
    {
      id: "tax-planning-guide",
      title: "Tax Planning Guide",
      category: "Tax",
      keywords: ["tax", "planning", "80c", "deduction", "savings"],
      content: `
# Tax Planning Guide for Indian Taxpayers

## Section 80C Deductions (Up to ₹1.5 Lakh)
1. **EPF Contributions** - Automatic deduction from salary
2. **PPF (Public Provident Fund)** - 15-year lock-in, tax-free returns
3. **ELSS Mutual Funds** - 3-year lock-in, market-linked returns
4. **Life Insurance Premium** - Up to 10% of sum assured
5. **NSC (National Savings Certificate)** - 5-year fixed deposit
6. **Tax Saver FDs** - 5-year lock-in, lower returns
7. **Home Loan Principal** - Repayment of principal amount
8. **Tuition Fees** - Children's education fees

## Section 80D - Health Insurance (Up to ₹25,000-₹50,000)
- Health insurance premiums for self and family
- Additional ₹25,000 for parents (₹50,000 if senior citizens)
- Preventive health check-ups: ₹5,000

## Section 80EE - Home Loan Interest
- Additional deduction of ₹50,000 for first-time home buyers
- Loan amount should not exceed ₹35 lakhs

## Tax Planning Strategy
1. **Start early** - Begin tax planning at the start of the financial year
2. **Diversify investments** - Don't put all money in one instrument
3. **Consider lock-in periods** - Balance liquidity needs with tax savings
4. **Review annually** - Adjust strategy based on income changes
      `
    },
    {
      id: "investment-strategies",
      title: "Investment Strategies",
      category: "Investment",
      keywords: ["investment", "mutual funds", "sip", "stocks", "portfolio"],
      content: `
# Investment Strategies for Long-term Wealth Creation

## Asset Allocation by Age
- **20s-30s**: 80% Equity, 20% Debt
- **30s-40s**: 70% Equity, 30% Debt  
- **40s-50s**: 60% Equity, 40% Debt
- **50s+**: 50% Equity, 50% Debt

## Investment Options
### Equity Mutual Funds
- **Large Cap Funds** - Stable, lower risk
- **Mid Cap Funds** - Higher growth potential
- **Small Cap Funds** - Highest risk, highest potential returns
- **ELSS Funds** - Tax saving with 3-year lock-in

### Debt Instruments
- **PPF** - 15-year lock-in, currently ~7.1% returns
- **NSC** - 5-year fixed returns
- **Corporate Bonds** - Higher yields, credit risk
- **Liquid Funds** - For emergency corpus

### Direct Equity
- Research-based stock picking
- Requires time and expertise
- Higher risk, higher potential returns

## SIP Strategy
- Start with ₹1,000-₹5,000 monthly
- Increase by 10% annually
- Continue for minimum 5-7 years
- Don't stop during market downturns
      `
    },
    {
      id: "retirement-planning",
      title: "Retirement Planning",
      category: "Planning", 
      keywords: ["retirement", "pension", "nps", "corpus", "planning"],
      content: `
# Retirement Planning Guide

## Retirement Corpus Calculation
**Rule of 25**: Your retirement corpus should be 25 times your annual expenses

### Example Calculation
- Current monthly expenses: ₹50,000
- Annual expenses: ₹6,00,000
- Inflation adjusted (25 years @ 6%): ₹25,75,000
- Required corpus: ₹6.44 Crores

## Retirement Investment Options
### National Pension System (NPS)
- Additional tax deduction of ₹50,000 under 80CCD(1B)
- Partial withdrawal allowed after 60
- Annuity mandatory for 40% of corpus

### Employee Provident Fund (EPF)
- 12% employer + 12% employee contribution
- Currently earning ~8.1% returns
- Tax-free on withdrawal after 5 years

### Voluntary Provident Fund (VPF)
- Additional contribution to EPF
- Same returns as EPF
- Higher liquidity than PPF

## Retirement Planning Strategy
1. **Start early** - Time is your biggest asset
2. **Increase contributions annually** - Step-up SIPs
3. **Review regularly** - Adjust based on life changes
4. **Health insurance** - Critical for retirement
5. **Emergency fund** - 12 months of expenses
      `
    },
    {
      id: "expense-management",
      title: "Expense Management",
      category: "Finance",
      keywords: ["expenses", "budget", "savings", "tracking", "management"],
      content: `
# Personal Finance & Expense Management

## 50-30-20 Rule
- **50% Needs** - Rent, groceries, utilities, EMIs
- **30% Wants** - Entertainment, dining out, hobbies  
- **20% Savings** - Investments, emergency fund

## Expense Tracking Methods
### Manual Tracking
- Maintain expense diary
- Categorize all expenses
- Review monthly patterns

### Digital Tools
- Banking apps with expense categorization
- Money manager apps
- Excel/Google Sheets templates

## Cost Optimization Strategies
### Housing (Largest expense)
- Keep rent/EMI under 30% of income
- Consider location vs. cost trade-offs
- Negotiate rent annually

### Transportation
- Use public transport when possible
- Car pooling for office commute
- Maintain vehicles regularly

### Food & Groceries
- Cook at home more often
- Buy in bulk for non-perishables
- Use grocery apps for discounts

## Emergency Fund
- Target: 6-12 months of expenses
- Keep in liquid investments
- Separate from other goals
- Review and top-up regularly
      `
    }
  ];

  addDocuments(docs: Document[]) {
    this.documents = [...this.documents, ...docs];
  }

  removeDocument(id: string) {
    this.documents = this.documents.filter(doc => doc.id !== id);
  }

  searchKnowledge(query: string): KnowledgeItem[] {
    const searchTerms = query.toLowerCase().split(' ');
    
    return this.knowledgeBase.filter(item => {
      const searchableContent = `${item.title} ${item.content} ${item.keywords.join(' ')}`.toLowerCase();
      return searchTerms.some(term => searchableContent.includes(term));
    });
  }

  getKnowledgeById(id: string): KnowledgeItem | undefined {
    return this.knowledgeBase.find(item => item.id === id);
  }

  getAllKnowledge(): KnowledgeItem[] {
    return this.knowledgeBase;
  }

  // Simple RAG-like functionality
  getRelevantContext(query: string): string {
    const relevantItems = this.searchKnowledge(query);
    
    if (relevantItems.length === 0) {
      return '';
    }

    // Return the most relevant content
    const context = relevantItems
      .slice(0, 2) // Top 2 most relevant items
      .map(item => `${item.title}:\n${item.content}`)
      .join('\n\n');

    return context;
  }

  // Add user documents to search
  searchUserDocuments(query: string): Document[] {
    const searchTerms = query.toLowerCase().split(' ');
    
    return this.documents.filter(doc => {
      const searchableContent = `${doc.name} ${doc.content}`.toLowerCase();
      return searchTerms.some(term => searchableContent.includes(term));
    });
  }
}

export const knowledgeService = new KnowledgeService();