import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";
import { DocumentUploader } from "@/components/DocumentUploader";
import { DocumentSidebar } from "@/components/DocumentSidebar";
import { ContentBlock } from "@/components/ContentBlock";
import { LanguageSelector } from "@/components/LanguageSelector";
import { LoadingScreen } from "@/components/LoadingScreen";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useDocuments, Document } from "@/hooks/useDocuments";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [language, setLanguage] = useState<'english' | 'hindi' | 'gujarati'>('english');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string>("");
  const [expandedSectionId, setExpandedSectionId] = useState<string>("");
  const [isLoadingDocument, setIsLoadingDocument] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  
  const { documents, saveDocument, deleteDocument, getDocument, loading } = useDocuments();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const lastProcessedDocId = useRef<string | null>(null);

  // Handle minimum loading screen duration with fade-out
  useEffect(() => {
    if (!loading) {
      // Start fade-out immediately when loading is complete
      setIsFadingOut(true);
      
      // Hide loading screen after fade-out animation completes
      const timer = setTimeout(() => {
        setShowLoadingScreen(false);
      }, 1000); // 1 second for fade-out animation

      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Handle URL-based document sharing
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const docId = urlParams.get('doc');
    
    if (docId && docId !== lastProcessedDocId.current && !isLoadingDocument) {
      setIsLoadingDocument(true);
      lastProcessedDocId.current = docId;
      
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
        setIsLoadingDocument(false);
      }).catch(() => {
        setIsLoadingDocument(false);
      });
    }
  }, [location.search, getDocument, toast, navigate, isLoadingDocument]);

  // Handle initial document selection when no URL param
  useEffect(() => {
    if (documents.length > 0 && !selectedDocument && !location.search.includes('doc=')) {
      setSelectedDocument(documents[0]);
      const firstSection = Object.keys(documents[0].content)[0];
      setActiveSectionId(firstSection);
      setExpandedSectionId(firstSection);
    }
  }, [documents, selectedDocument, location.search]);

  // Auto-expand first section when document is selected
  useEffect(() => {
    if (selectedDocument && !expandedSectionId) {
      const firstSection = Object.keys(selectedDocument.content)[0];
      setActiveSectionId(firstSection);
      setExpandedSectionId(firstSection);
    }
  }, [selectedDocument, expandedSectionId]);

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

  const handleSectionExpand = (sectionId: string) => {
    // Get the first section key to ensure it stays expanded
    const firstSectionKey = selectedDocument ? Object.keys(selectedDocument.content)[0] : "";
    
    // If clicking on the first section, keep it expanded
    if (sectionId === firstSectionKey) {
      setExpandedSectionId(sectionId);
    } else {
      // For other sections, toggle normally
      setExpandedSectionId(expandedSectionId === sectionId ? "" : sectionId);
    }
  };

  // Show loading screen while documents are being fetched or for minimum duration
  if (loading || showLoadingScreen) {
    return <LoadingScreen isFadingOut={isFadingOut} />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-content-border h-20 flex items-center justify-between px-6 lg:px-8">
          <div className="flex items-center">
            <div className="flex flex-col ml-12">
              <h1
                className="
                  text-lg
                  sm:text-xl
                  font-bold
                  text-brand-primary
                  truncate
                  max-w-[80vw]
                  sm:max-w-[40vw]
                  leading-tight
                  tracking-tight
                "
                title={selectedDocument?.name || "Document Learning Platform"}
              >
                {selectedDocument?.name || "Document Learning Platform"}
              </h1>
              <p className="text-sm text-muted-foreground font-medium">
                Audio-enabled documents
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <LanguageSelector language={language} onLanguageChange={setLanguage} />
          </div>
        </div>

        {/* Upload Dialog */}
        <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
          <DialogContent className="max-w-2xl card-shadow-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-brand-primary">Upload Document</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Upload a PDF or Word document to generate audio narration. The document will be instantly shareable via URL.
              </DialogDescription>
            </DialogHeader>
            <DocumentUploader onUploadSuccess={handleUploadSuccess} />
          </DialogContent>
        </Dialog>

        {/* Content Blocks */}
        {isLoadingDocument ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <LoadingSpinner size="lg" text="Loading document..." />
          </div>
        ) : selectedDocument ? (
          <div className="p-6 lg:p-8 space-y-6">
            {Object.entries(selectedDocument.content)
              .sort(([a], [b]) => {
                // Sort by the numeric prefix in the section key
                const getNumericPrefix = (key: string) => {
                  const match = key.match(/^(\d+)/);
                  return match ? parseInt(match[1]) : 999;
                };
                return getNumericPrefix(a) - getNumericPrefix(b);
              })
              .map(([sectionKey, sectionData]: [string, any], index: number) => (
              <div key={sectionKey} id={`section-${sectionKey}`}>
                <ContentBlock
                  sectionId={sectionKey}
                  title={sectionKey}
                  data={sectionData}
                  language={language}
                  onStatusUpdate={handleStatusUpdate}
                  isExpanded={expandedSectionId === sectionKey}
                  onExpand={handleSectionExpand}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-md mx-auto">
              <div className="w-16 h-16 bg-brand-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-brand-accent" />
              </div>
              <h2 className="text-xl font-semibold text-brand-primary mb-2">No documents uploaded</h2>
              <p className="text-muted-foreground mb-4">Click "Add Document" to get started with your learning journey</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {/* <footer className="border-t border-content-border bg-brand-surface/50 py-3">
        <div className="text-center text-xs text-muted-foreground">
          © 2025 A.Shridhar. All rights reserved.
        </div>
      </footer> */}
    </div>
  );
};

export default Index;