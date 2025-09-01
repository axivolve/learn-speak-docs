
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { DocumentUploader } from "@/components/DocumentUploader";
import { DocumentSidebar } from "@/components/DocumentSidebar";
import { ContentBlock } from "@/components/ContentBlock";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Button } from "@/components/ui/button";

interface StoredDocument {
  id: string;
  name: string;
  data: any;
  timestamp: number;
}

const Index = () => {
  const [documents, setDocuments] = useState<StoredDocument[]>([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>("");
  const [activeSectionId, setActiveSectionId] = useState<string>("");
  const [language, setLanguage] = useState<'english' | 'hindi' | 'gujarati'>('english');
  const [showUploader, setShowUploader] = useState(false);

  // Load documents from localStorage on component mount
  useEffect(() => {
    const savedDocuments = localStorage.getItem('uploadedDocuments');
    if (savedDocuments) {
      const parsedDocs = JSON.parse(savedDocuments);
      setDocuments(parsedDocs);
      if (parsedDocs.length > 0 && !selectedDocumentId) {
        setSelectedDocumentId(parsedDocs[0].id);
        const firstSection = Object.keys(parsedDocs[0].data)[0];
        setActiveSectionId(firstSection);
      }
    } else {
      setShowUploader(true);
    }
  }, []);

  // Save documents to localStorage whenever documents change
  useEffect(() => {
    if (documents.length > 0) {
      localStorage.setItem('uploadedDocuments', JSON.stringify(documents));
    } else {
      localStorage.removeItem('uploadedDocuments');
    }
  }, [documents]);

  const handleUploadSuccess = (data: any, name: string) => {
    const newDocument: StoredDocument = {
      id: Date.now().toString(),
      name,
      data,
      timestamp: Date.now()
    };
    
    const updatedDocuments = [...documents, newDocument];
    setDocuments(updatedDocuments);
    setSelectedDocumentId(newDocument.id);
    
    // Set first section as active
    const firstSection = Object.keys(data)[0];
    setActiveSectionId(firstSection);
    setShowUploader(false);
  };

  const handleDeleteDocument = (documentId: string) => {
    const updatedDocuments = documents.filter(doc => doc.id !== documentId);
    setDocuments(updatedDocuments);
    
    if (selectedDocumentId === documentId) {
      if (updatedDocuments.length > 0) {
        setSelectedDocumentId(updatedDocuments[0].id);
        const firstSection = Object.keys(updatedDocuments[0].data)[0];
        setActiveSectionId(firstSection);
      } else {
        setSelectedDocumentId("");
        setActiveSectionId("");
        setShowUploader(true);
      }
    }
  };

  const handleDocumentSelect = (documentId: string) => {
    setSelectedDocumentId(documentId);
    const document = documents.find(doc => doc.id === documentId);
    if (document) {
      const firstSection = Object.keys(document.data)[0];
      setActiveSectionId(firstSection);
    }
  };

  const handleSectionClick = (sectionId: string) => {
    setActiveSectionId(sectionId);
    // Scroll to section
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleStatusUpdate = (sectionId: string, status: 'not-listened' | 'in-progress' | 'completed') => {
    // Update status logic here
    console.log(`Section ${sectionId} status updated to: ${status}`);
  };

  const selectedDocument = documents.find(doc => doc.id === selectedDocumentId);

  if (showUploader || documents.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          <DocumentUploader onUploadSuccess={handleUploadSuccess} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-80 fixed left-0 top-0 h-full">
        <DocumentSidebar
          documents={documents}
          selectedDocumentId={selectedDocumentId}
          onDocumentSelect={handleDocumentSelect}
          onDocumentDelete={handleDeleteDocument}
          onSectionClick={handleSectionClick}
          activeSectionId={activeSectionId}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-80">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b border-content-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-brand-primary">
                {selectedDocument?.name || "No Document Selected"}
              </h1>
              <p className="text-sm text-muted-foreground">Audio-enabled document learning</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setShowUploader(true)}
                className="bg-brand-accent hover:bg-brand-accent/90 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
              <LanguageSelector language={language} onLanguageChange={setLanguage} />
            </div>
          </div>
        </div>

        {/* Content Blocks */}
        {selectedDocument && (
          <div className="p-6 space-y-6">
            {Object.entries(selectedDocument.data).map(([sectionKey, sectionData]: [string, any]) => (
              <div key={sectionKey} id={`section-${sectionKey}`}>
                <ContentBlock
                  sectionId={sectionKey}
                  title={sectionKey}
                  data={sectionData}
                  language={language}
                  onStatusUpdate={handleStatusUpdate}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploader && documents.length > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8">
          <div className="bg-background rounded-lg w-full max-w-2xl">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Upload New Document</h2>
                <Button
                  variant="ghost"
                  onClick={() => setShowUploader(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </Button>
              </div>
            </div>
            <div className="p-6">
              <DocumentUploader 
                onUploadSuccess={handleUploadSuccess} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
