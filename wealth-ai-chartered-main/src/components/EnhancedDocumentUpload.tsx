import { useState, useCallback } from "react";
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface AnalyzedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  content: string;
  analysis: DocumentAnalysis;
  status: 'analyzing' | 'completed' | 'error';
}

interface DocumentAnalysis {
  documentType: 'form16' | 'salary_slip' | 'loan_statement' | 'investment_statement' | 'other';
  extractedData: {
    grossSalary?: number;
    taxDeducted?: number;
    employerName?: string;
    financialYear?: string;
    loanAmount?: number;
    emiAmount?: number;
    interestRate?: number;
    investmentAmount?: number;
    gains?: number;
    [key: string]: any;
  };
  insights: string[];
  recommendations: string[];
}

interface EnhancedDocumentUploadProps {
  onDocumentsAnalyzed: (documents: AnalyzedDocument[]) => void;
}

export const EnhancedDocumentUpload = ({ onDocumentsAnalyzed }: EnhancedDocumentUploadProps) => {
  const [documents, setDocuments] = useState<AnalyzedDocument[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const analyzeDocumentContent = async (content: string, fileName: string): Promise<DocumentAnalysis> => {
    // Simulate document analysis - in a real app, this would use AI/ML services
    const documentType = detectDocumentType(fileName, content);
    const extractedData = extractFinancialData(content, documentType);
    const insights = generateInsights(extractedData, documentType);
    const recommendations = generateRecommendations(extractedData, documentType);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      documentType,
      extractedData,
      insights,
      recommendations
    };
  };

  const detectDocumentType = (fileName: string, content: string): DocumentAnalysis['documentType'] => {
    const name = fileName.toLowerCase();
    const text = content.toLowerCase();

    if (name.includes('form16') || name.includes('form-16') || text.includes('form 16')) {
      return 'form16';
    }
    if (name.includes('salary') || text.includes('salary slip') || text.includes('pay slip')) {
      return 'salary_slip';
    }
    if (name.includes('loan') || text.includes('loan statement') || text.includes('emi')) {
      return 'loan_statement';
    }
    if (text.includes('investment') || text.includes('mutual fund') || text.includes('portfolio')) {
      return 'investment_statement';
    }
    return 'other';
  };

  const extractFinancialData = (content: string, docType: DocumentAnalysis['documentType']) => {
    const data: any = {};
    
    // Simple regex patterns for demonstration - in real app, use proper OCR/NLP
    const salaryMatch = content.match(/(?:gross salary|gross income).*?(\d+(?:,\d+)*(?:\.\d+)?)/i);
    const taxMatch = content.match(/(?:tax deducted|tds).*?(\d+(?:,\d+)*(?:\.\d+)?)/i);
    const loanMatch = content.match(/(?:loan amount|principal).*?(\d+(?:,\d+)*(?:\.\d+)?)/i);
    const emiMatch = content.match(/(?:emi|monthly payment).*?(\d+(?:,\d+)*(?:\.\d+)?)/i);
    const rateMatch = content.match(/(?:interest rate|rate of interest).*?(\d+(?:\.\d+)?)/i);

    if (salaryMatch) data.grossSalary = parseFloat(salaryMatch[1].replace(/,/g, ''));
    if (taxMatch) data.taxDeducted = parseFloat(taxMatch[1].replace(/,/g, ''));
    if (loanMatch) data.loanAmount = parseFloat(loanMatch[1].replace(/,/g, ''));
    if (emiMatch) data.emiAmount = parseFloat(emiMatch[1].replace(/,/g, ''));
    if (rateMatch) data.interestRate = parseFloat(rateMatch[1]);

    // Add document-specific fields
    if (docType === 'form16') {
      const fyMatch = content.match(/(?:financial year|fy|assessment year).*?(\d{4}-\d{2,4})/i);
      if (fyMatch) data.financialYear = fyMatch[1];
      
      const employerMatch = content.match(/(?:employer|company name).*?([A-Za-z\s&]+)/i);
      if (employerMatch) data.employerName = employerMatch[1].trim();
    }

    return data;
  };

  const generateInsights = (data: any, docType: DocumentAnalysis['documentType']): string[] => {
    const insights: string[] = [];

    if (docType === 'form16' && data.grossSalary && data.taxDeducted) {
      const taxRate = (data.taxDeducted / data.grossSalary) * 100;
      insights.push(`Your effective tax rate is ${taxRate.toFixed(1)}%`);
      
      if (taxRate > 20) {
        insights.push("Your tax rate is quite high - consider tax-saving investments");
      }
      
      if (data.grossSalary > 1000000) {
        insights.push("You're in the highest tax bracket - maximize 80C deductions");
      }
    }

    if (docType === 'loan_statement' && data.loanAmount && data.interestRate) {
      if (data.interestRate > 8) {
        insights.push("Your loan interest rate is above market average - consider refinancing");
      }
      
      if (data.loanAmount > 5000000) {
        insights.push("Consider claiming tax benefits under Section 24(b) for home loan interest");
      }
    }

    if (docType === 'salary_slip' && data.grossSalary) {
      const monthlySavingsTarget = data.grossSalary * 0.2;
      insights.push(`Target monthly savings: ₹${monthlySavingsTarget.toLocaleString()}`);
    }

    return insights;
  };

  const generateRecommendations = (data: any, docType: DocumentAnalysis['documentType']): string[] => {
    const recommendations: string[] = [];

    if (docType === 'form16') {
      recommendations.push("Maximize Section 80C investments (₹1.5L limit)");
      recommendations.push("Consider health insurance for 80D benefits");
      recommendations.push("Explore ELSS mutual funds for tax savings");
    }

    if (docType === 'loan_statement') {
      recommendations.push("Track loan payments for tax benefits");
      recommendations.push("Consider prepayment if you have surplus funds");
      recommendations.push("Review loan terms annually for better rates");
    }

    if (docType === 'salary_slip') {
      recommendations.push("Set up automatic SIP investments");
      recommendations.push("Build an emergency fund (6-12 months expenses)");
      recommendations.push("Review salary structure for tax optimization");
    }

    return recommendations;
  };

  const handleFileUpload = useCallback(async (files: FileList) => {
    setIsUploading(true);
    const newDocuments: AnalyzedDocument[] = [];

    for (const file of Array.from(files)) {
      // Validate file type
      if (!['application/pdf', 'text/csv', 'text/plain', 'application/vnd.ms-excel'].includes(file.type)) {
        toast.error(`Unsupported file type: ${file.name}`);
        continue;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`File too large: ${file.name}`);
        continue;
      }

      try {
        const content = await readFileContent(file);
        const docId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        
        const newDoc: AnalyzedDocument = {
          id: docId,
          name: file.name,
          type: file.type,
          size: file.size,
          content,
          analysis: {
            documentType: 'other',
            extractedData: {},
            insights: [],
            recommendations: []
          },
          status: 'analyzing'
        };

        newDocuments.push(newDoc);
        setDocuments(prev => [...prev, newDoc]);

        // Start analysis
        analyzeDocumentContent(content, file.name)
          .then(analysis => {
            setDocuments(prev => prev.map(doc => 
              doc.id === docId 
                ? { ...doc, analysis, status: 'completed' as const }
                : doc
            ));
            toast.success(`Analysis completed for ${file.name}`);
          })
          .catch(error => {
            console.error('Analysis failed:', error);
            setDocuments(prev => prev.map(doc => 
              doc.id === docId 
                ? { ...doc, status: 'error' as const }
                : doc
            ));
            toast.error(`Analysis failed for ${file.name}`);
          });

      } catch (error) {
        console.error('File reading failed:', error);
        toast.error(`Failed to read ${file.name}`);
      }
    }

    setIsUploading(false);
    onDocumentsAnalyzed(documents);
  }, [documents, onDocumentsAnalyzed]);

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  const removeDocument = (id: string) => {
    const updatedDocs = documents.filter(doc => doc.id !== id);
    setDocuments(updatedDocs);
    onDocumentsAnalyzed(updatedDocs);
    toast.success("Document removed");
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getDocumentTypeIcon = (docType: DocumentAnalysis['documentType']) => {
    switch (docType) {
      case 'form16': return '📋';
      case 'salary_slip': return '💰';
      case 'loan_statement': return '🏠';
      case 'investment_statement': return '📈';
      default: return '📄';
    }
  };

  const getDocumentTypeName = (docType: DocumentAnalysis['documentType']) => {
    switch (docType) {
      case 'form16': return 'Form 16';
      case 'salary_slip': return 'Salary Slip';
      case 'loan_statement': return 'Loan Statement';
      case 'investment_statement': return 'Investment Statement';
      default: return 'Document';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Document Analysis
        </CardTitle>
        <CardDescription>
          Upload Form-16, salary slips, loan statements for AI-powered financial analysis
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
          <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <div className="space-y-2">
            <p className="text-lg font-medium">Drop your financial documents here</p>
            <p className="text-sm text-muted-foreground">
              Supported: PDF, CSV, TXT files (Max 10MB each)
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.csv,.txt,.xls,.xlsx"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
              id="document-upload"
            />
            <Button asChild className="mt-4">
              <label htmlFor="document-upload" className="cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                Choose Files
              </label>
            </Button>
          </div>
        </div>

        {/* Document List */}
        {documents.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Analyzed Documents</h3>
            {documents.map((doc) => (
              <Card key={doc.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="text-2xl">
                      {getDocumentTypeIcon(doc.analysis.documentType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium truncate">{doc.name}</h4>
                        <Badge variant="outline">
                          {getDocumentTypeName(doc.analysis.documentType)}
                        </Badge>
                        {doc.status === 'analyzing' && (
                          <Badge variant="secondary" className="animate-pulse">
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            Analyzing...
                          </Badge>
                        )}
                        {doc.status === 'completed' && (
                          <Badge variant="default">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Analyzed
                          </Badge>
                        )}
                        {doc.status === 'error' && (
                          <Badge variant="destructive">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Error
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {formatFileSize(doc.size)}
                      </p>

                      {/* Analysis Results */}
                      {doc.status === 'completed' && doc.analysis.insights.length > 0 && (
                        <div className="space-y-3 bg-muted/50 rounded-lg p-3">
                          <div>
                            <h5 className="font-medium text-sm mb-2">💡 Key Insights:</h5>
                            <ul className="text-sm space-y-1">
                              {doc.analysis.insights.map((insight, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="text-primary">•</span>
                                  <span>{insight}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          {doc.analysis.recommendations.length > 0 && (
                            <div>
                              <h5 className="font-medium text-sm mb-2">📋 Recommendations:</h5>
                              <ul className="text-sm space-y-1">
                                {doc.analysis.recommendations.map((rec, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="text-success">•</span>
                                    <span>{rec}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeDocument(doc.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Security Notice */}
        <div className="bg-muted/50 rounded-lg p-4 border border-border">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-1">Secure Document Processing</p>
              <p className="text-muted-foreground">
                Your documents are processed locally and securely. No financial data is stored permanently.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};