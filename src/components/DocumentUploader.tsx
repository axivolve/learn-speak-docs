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

      const response = await fetch('https://7663ef83de05.ngrok-free.app/process-document', {
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
    <Card className="p-8 bg-brand-surface border-content-border card-shadow">
      <div className="text-center space-y-6">

        <div className="space-y-6">
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
              className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-content-border rounded-xl cursor-pointer hover:border-brand-accent hover:bg-brand-accent/5 transition-modern group"
            >
              {file ? (
                <div className="flex items-center space-x-3 text-brand-primary">
                  <div className="w-12 h-12 bg-brand-accent/10 rounded-xl flex items-center justify-center">
                    <FileText className="h-6 w-6 text-brand-accent" />
                  </div>
                  <div className="text-left">
                    <span className="font-semibold block">{file.name}</span>
                    <span className="text-sm text-muted-foreground">Ready to upload</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-4 text-muted-foreground">
                  <div className="w-16 h-16 bg-brand-accent/10 rounded-2xl flex items-center justify-center group-hover:bg-brand-accent/20 transition-modern">
                    <Upload className="h-8 w-8 text-brand-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-brand-primary">Click to upload document</p>
                    <p className="text-sm">PDF or Word document</p>
                  </div>
                </div>
              )}
            </label>
          </div>

          <Input
            type="text"
            placeholder="Enter document name"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            className="bg-background border-content-border focus:border-brand-accent focus:ring-brand-accent/20"
          />

          <Button
            onClick={handleUpload}
            disabled={!file || !documentName.trim() || isUploading}
            className="w-full bg-brand-accent hover:bg-brand-accent/90 text-white font-semibold py-3 rounded-lg shadow-sm hover:shadow-md transition-modern"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Upload Document"
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};