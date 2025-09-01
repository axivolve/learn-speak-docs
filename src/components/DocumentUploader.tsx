import { useState } from "react";
import { Upload, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface DocumentUploaderProps {
  onUploadSuccess: (data: any, documentName: string) => void;
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
      // Simulate API call for now - replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response data
      const mockData = {
        "1. INTRODUCTION:": {
          "text": "This method statement describes the systematic approach for construction activities, ensuring quality, safety, and adherence to specifications.",
          "hindi_text": "यह पद्धति कथन निर्माण गतिविधियों के लिए व्यवस्थित दृष्टिकोण का वर्णन करता है।",
          "guj_text": "આ પદ્ધતિ નિવેદન બાંધકામ પ્રવૃત્તિઓ માટે વ્યવસ્થિત અભિગમનું વર્ણન કરે છે।",
          "subtopics": {},
          "eng_speech_url": "/audio/intro_eng.mp3",
          "hindi_speech_url": "/audio/intro_hindi.mp3",
          "guj_speech_url": "/audio/intro_guj.mp3"
        },
        "2. METHODOLOGY:": {
          "text": "",
          "subtopics": {
            "2.1 Before Commencement:": {
              "text": "Prior to brick work commencement, all preparatory work must be completed including site preparation, material procurement, and quality checks.",
              "hindi_text": "ईंट कार्य शुरू करने से पहले, सभी तैयारी कार्य पूरा होना चाहिए।",
              "guj_text": "ઈંટના કામની શરૂઆત પહેલાં, બધા પ્રારંભિક કામ પૂર્ણ હોવા જોઈએ।",
              "eng_speech_url": "/audio/before_eng.mp3",
              "hindi_speech_url": "/audio/before_hindi.mp3",
              "guj_speech_url": "/audio/before_guj.mp3"
            },
            "2.2 Lying of bricks": {
              "text": "Brick laying shall be done in accordance with the approved drawings and specifications, maintaining proper alignment and level.",
              "hindi_text": "ईंट बिछाना अनुमोदित चित्र और विशिष्टताओं के अनुसार किया जाना चाहिए।",
              "guj_text": "ઈંટ બિછાવવાનું કામ મંજૂર નકશા અને વિશેષતાઓ અનુસાર કરવું જોઈએ।",
              "eng_speech_url": "/audio/laying_eng.mp3",
              "hindi_speech_url": "/audio/laying_hindi.mp3",
              "guj_speech_url": "/audio/laying_guj.mp3"
            },
            "2.3 Mortar": {
              "text": "Mortar mixing shall be done as per specifications using proper cement to sand ratio and adequate water content.",
              "hindi_text": "मोर्टार मिश्रण उचित सीमेंट और रेत अनुपात के साथ किया जाना चाहिए।",
              "guj_text": "મોર્ટાર મિશ્રણ યોગ્ય સિમેન્ટ અને રેતનાં પ્રમાણ સાથે કરવું જોઈએ।",
              "eng_speech_url": "/audio/mortar_eng.mp3",
              "hindi_speech_url": "/audio/mortar_hindi.mp3",
              "guj_speech_url": "/audio/mortar_guj.mp3"
            }
          }
        },
        "3. QUALITY ASSURANCE:": {
          "text": "Quality control measures shall be implemented throughout the construction process to ensure compliance with standards and specifications.",
          "hindi_text": "गुणवत्ता नियंत्रण उपाय निर्माण प्रक्रिया के दौरान लागू किए जाने चाहिए।",
          "guj_text": "ગુણવત્તા નિયંત્રણના પગલાં બાંધકામ પ્રક્રિયા દરમિયાન અમલ કરવા જોઈએ।",
          "subtopics": {},
          "eng_speech_url": "/audio/quality_eng.mp3",
          "hindi_speech_url": "/audio/quality_hindi.mp3",
          "guj_speech_url": "/audio/quality_guj.mp3"
        }
      };

      onUploadSuccess(mockData, documentName);
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
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-brand-primary">Upload Document</h2>
          <p className="text-muted-foreground">Upload a PDF or Word document to generate audio narration</p>
        </div>

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