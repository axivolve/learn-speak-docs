import { useState } from "react";
import { Upload, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface DocumentUploaderProps {
  onUploadSuccess: (data: any, documentName: string, documentId?: string) => void;
}

export const DocumentUploader = ({ onUploadSuccess }: DocumentUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!validTypes.includes(selectedFile.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or Word document.",
          variant: "destructive"
        });
        return;
      }
      
      setFile(selectedFile);
      if (!documentName) {
        setDocumentName(selectedFile.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleUpload = async () => {
    if (!file || !documentName.trim()) {
      toast({
        title: "Missing information",
        description: "Please select a file and enter a document name.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('save_intermediate', 'true');

      const response = await fetch('https://learn-speak-docs.loca.lt/process-document', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      onUploadSuccess(responseData.data, documentName);
      toast({
        title: "Upload successful",
        description: "Document processed successfully!",
      });
      
      // Reset form
      setFile(null);
      setDocumentName("");
      
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to process the document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="p-8 bg-brand-surface border-content-border">
      <div className="text-center space-y-6">

        <div className="space-y-4">
          <div className="relative">
            <Input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-content-border rounded-lg cursor-pointer hover:border-brand-accent transition-colors"
            >
              {file ? (
                <div className="flex items-center space-x-2 text-brand-primary">
                  <FileText className="h-5 w-5" />
                  <span className="font-medium">{file.name}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2 text-muted-foreground">
                  <Upload className="h-8 w-8" />
                  <span>Click to upload PDF or Word document</span>
                </div>
              )}
            </label>
          </div>

          <Input
            type="text"
            placeholder="Enter document name"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            className="bg-background"
          />

          <Button
            onClick={handleUpload}
            disabled={!file || !documentName.trim() || isUploading}
            className="w-full bg-brand-accent hover:bg-brand-accent/90 text-white font-medium py-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Proceed"
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};