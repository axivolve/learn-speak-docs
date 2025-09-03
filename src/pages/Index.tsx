import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DocumentUploader } from "@/components/DocumentUploader";
import { DocumentSidebar } from "@/components/DocumentSidebar";
import { ContentBlock } from "@/components/ContentBlock";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useDocuments, Document } from "@/hooks/useDocuments";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [language, setLanguage] = useState<'english' | 'hindi' | 'gujarati'>('english');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string>("");
  
  const { documents, saveDocument, deleteDocument, getDocument } = useDocuments();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  // Handle URL-based document sharing
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const docId = urlParams.get('doc');
    
    if (docId) {
      getDocument(docId).then(doc => {
        if (doc) {
          setSelectedDocument(doc);
          const firstSection = Object.keys(doc.content)[0];
          setActiveSectionId(firstSection);
        } else {
          toast({
            title: "Document not found",
            description: "The requested document could not be found.",
            variant: "destructive"
          });
          navigate('/', { replace: true });
        }
      });
    } else if (documents.length > 0 && !selectedDocument) {
      // Select first document if no URL param and no document selected
      setSelectedDocument(documents[0]);
      const firstSection = Object.keys(documents[0].content)[0];
      setActiveSectionId(firstSection);
    }
  }, [location.search, documents, getDocument, toast, navigate, selectedDocument]);

  const handleUploadSuccess = async (data: any, name: string) => {
    const documentId = await saveDocument(name, data);
    if (documentId) {
      // Update URL to share this document
      navigate(`/?doc=${documentId}`, { replace: true });
      setIsUploadModalOpen(false);
      
      // Copy shareable URL to clipboard
      const shareableUrl = `${window.location.origin}/?doc=${documentId}`;
      navigator.clipboard.writeText(shareableUrl).then(() => {
        toast({
          title: "Document uploaded and URL copied!",
          description: "Share this URL with others to let them access this document.",
        });
      });
    }
  };

  const handleDocumentSelect = (documentId: string) => {
    const document = documents.find(doc => doc.id === documentId);
    if (document) {
      setSelectedDocument(document);
      const firstSection = Object.keys(document.content)[0];
      setActiveSectionId(firstSection);
      // Update URL for sharing
      navigate(`/?doc=${documentId}`, { replace: true });
    }
  };

  const handleDocumentDelete = async (documentId: string) => {
    await deleteDocument(documentId);
    if (selectedDocument?.id === documentId) {
      if (documents.length > 1) {
        const remaining = documents.filter(doc => doc.id !== documentId);
        setSelectedDocument(remaining[0]);
        navigate(`/?doc=${remaining[0].id}`, { replace: true });
      } else {
        setSelectedDocument(null);
        navigate('/', { replace: true });
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

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <DocumentSidebar
        documents={documents.map(doc => ({ id: doc.id, name: doc.name, data: doc.content }))}
        activeDocumentId={selectedDocument?.id || ""}
        onDocumentSelect={handleDocumentSelect}
        onDocumentDelete={handleDocumentDelete}
        onSectionClick={handleSectionClick}
        activeSectionId={activeSectionId}
        onAddDocument={() => setIsUploadModalOpen(true)}
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-80">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b border-content-border p-4 lg:pl-6">
          <div className="flex items-center justify-between">
            <div className="lg:ml-0 ml-12">
              <h1 className="text-2xl font-semibold text-brand-primary">
                {selectedDocument?.name || "Document Learning Platform"}
              </h1>
              <p className="text-sm text-muted-foreground">Audio-enabled document learning</p>
            </div>
            <div className="flex items-center space-x-3">
              <LanguageSelector language={language} onLanguageChange={setLanguage} />
            </div>
          </div>
        </div>

        {/* Upload Dialog */}
        <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
              <DialogDescription>
                Upload a PDF or Word document to generate audio narration. The document will be instantly shareable via URL.
              </DialogDescription>
            </DialogHeader>
            <DocumentUploader onUploadSuccess={handleUploadSuccess} />
          </DialogContent>
        </Dialog>

        {/* Content Blocks */}
        {selectedDocument ? (
          <div className="p-6 space-y-6">
            {Object.entries(selectedDocument.content)
              .sort(([a], [b]) => {
                // Sort by the numeric prefix in the section key
                const getNumericPrefix = (key: string) => {
                  const match = key.match(/^(\d+)/);
                  return match ? parseInt(match[1]) : 999;
                };
                return getNumericPrefix(a) - getNumericPrefix(b);
              })
              .map(([sectionKey, sectionData]: [string, any]) => (
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
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-muted-foreground mb-2">No documents uploaded</h2>
              <p className="text-muted-foreground">Click "Add Document" to get started</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;