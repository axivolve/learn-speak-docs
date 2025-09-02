import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { DocumentUploader } from "@/components/DocumentUploader";
import { DocumentSidebar } from "@/components/DocumentSidebar";
import { ContentBlock } from "@/components/ContentBlock";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface StoredDocument {
  id: string;
  name: string;
  data: any;
}

const Index = () => {
  const [documents, setDocuments] = useState<StoredDocument[]>([]);
  const [activeDocumentId, setActiveDocumentId] = useState<string>("");
  const [activeSectionId, setActiveSectionId] = useState<string>("");
  const [language, setLanguage] = useState<'english' | 'hindi' | 'gujarati'>('english');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Load documents from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('documents');
    if (saved) {
      const parsedDocs = JSON.parse(saved);
      setDocuments(parsedDocs);
      if (parsedDocs.length > 0) {
        setActiveDocumentId(parsedDocs[0].id);
        const firstSection = Object.keys(parsedDocs[0].data)[0];
        setActiveSectionId(firstSection);
      }
    }
  }, []);

  // Save documents to localStorage whenever documents change
  useEffect(() => {
    localStorage.setItem('documents', JSON.stringify(documents));
  }, [documents]);

  const handleUploadSuccess = (data: any, name: string) => {
    const newDocument: StoredDocument = {
      id: Date.now().toString(),
      name,
      data
    };
    setDocuments(prev => [...prev, newDocument]);
    setActiveDocumentId(newDocument.id);
    // Set first section as active
    const firstSection = Object.keys(data)[0];
    setActiveSectionId(firstSection);
    setIsUploadModalOpen(false);
  };

  const handleDocumentSelect = (documentId: string) => {
    setActiveDocumentId(documentId);
    const document = documents.find(doc => doc.id === documentId);
    if (document) {
      const firstSection = Object.keys(document.data)[0];
      setActiveSectionId(firstSection);
    }
  };

  const handleDocumentDelete = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    if (activeDocumentId === documentId) {
      const remaining = documents.filter(doc => doc.id !== documentId);
      if (remaining.length > 0) {
        setActiveDocumentId(remaining[0].id);
        const firstSection = Object.keys(remaining[0].data)[0];
        setActiveSectionId(firstSection);
      } else {
        setActiveDocumentId("");
        setActiveSectionId("");
      }
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

  const activeDocument = documents.find(doc => doc.id === activeDocumentId);

  if (documents.length === 0) {
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
          activeDocumentId={activeDocumentId}
          onDocumentSelect={handleDocumentSelect}
          onDocumentDelete={handleDocumentDelete}
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
              <h1 className="text-2xl font-semibold text-brand-primary">{activeDocument?.name}</h1>
              <p className="text-sm text-muted-foreground">Audio-enabled document learning</p>
            </div>
            <div className="flex items-center space-x-3">
              <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Document
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DocumentUploader onUploadSuccess={handleUploadSuccess} />
                </DialogContent>
              </Dialog>
              <LanguageSelector language={language} onLanguageChange={setLanguage} />
            </div>
          </div>
        </div>

        {/* Content Blocks */}
        {activeDocument && (
          <div className="p-6 space-y-6">
            {Object.entries(activeDocument.data).map(([sectionKey, sectionData]: [string, any]) => (
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
    </div>
  );
};

export default Index;
