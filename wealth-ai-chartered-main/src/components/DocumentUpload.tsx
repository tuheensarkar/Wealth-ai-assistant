import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  content?: string;
}

interface DocumentUploadProps {
  onDocumentsChange: (documents: UploadedDocument[]) => void;
}

export const DocumentUpload = ({ onDocumentsChange }: DocumentUploadProps) => {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;

    setIsUploading(true);
    const newDocuments: UploadedDocument[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Check file type
      if (!file.type.includes('pdf') && !file.type.includes('csv') && !file.type.includes('txt')) {
        toast({
          title: "Unsupported file type",
          description: `${file.name} is not supported. Please upload PDF, CSV, or TXT files.`,
          variant: "destructive"
        });
        continue;
      }

      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is too large. Maximum size is 10MB.`,
          variant: "destructive"
        });
        continue;
      }

      try {
        let content = '';
        
        if (file.type.includes('text') || file.type.includes('csv')) {
          content = await file.text();
        } else if (file.type.includes('pdf')) {
          // For demo purposes, we'll just store the file info
          // In a real app, you'd use a PDF parser like pdf-parse
          content = `PDF document: ${file.name}`;
        }

        const document: UploadedDocument = {
          id: Date.now().toString() + i,
          name: file.name,
          type: file.type,
          size: file.size,
          content: content
        };

        newDocuments.push(document);
      } catch (error) {
        toast({
          title: "Upload failed",
          description: `Failed to process ${file.name}`,
          variant: "destructive"
        });
      }
    }

    const updatedDocuments = [...documents, ...newDocuments];
    setDocuments(updatedDocuments);
    onDocumentsChange(updatedDocuments);
    setIsUploading(false);

    if (newDocuments.length > 0) {
      toast({
        title: "Documents uploaded",
        description: `Successfully uploaded ${newDocuments.length} document(s)`,
      });
    }
  };

  const removeDocument = (id: string) => {
    const updatedDocuments = documents.filter(doc => doc.id !== id);
    setDocuments(updatedDocuments);
    onDocumentsChange(updatedDocuments);
    
    toast({
      title: "Document removed",
      description: "Document has been removed from your knowledge base",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <Card className="p-6 border-dashed border-2 border-primary/20 hover:border-primary/40 transition-colors">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Upload className="w-12 h-12 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Upload Financial Documents
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload PDFs, CSVs, or text files containing tax documents, investment statements, or financial guides
            </p>
            <Button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full"
            >
              {isUploading ? "Uploading..." : "Choose Files"}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.csv,.txt"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />
          </div>
        </div>
      </Card>

      {documents.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-foreground">Uploaded Documents</h4>
          {documents.map((doc) => (
            <Card key={doc.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{doc.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(doc.size)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-success" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDocument(doc.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};