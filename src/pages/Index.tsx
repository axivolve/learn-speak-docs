import { useState } from "react";
import { DocumentUploader } from "@/components/DocumentUploader";
import { DocumentSidebar } from "@/components/DocumentSidebar";
import { ContentBlock } from "@/components/ContentBlock";
import { LanguageSelector } from "@/components/LanguageSelector";

const Index = () => {
  const [documentData, setDocumentData] = useState<any>(null);
  const [documentName, setDocumentName] = useState<string>("");
  const [activeSectionId, setActiveSectionId] = useState<string>("");
  const [language, setLanguage] = useState<'english' | 'hindi' | 'gujarati'>('english');

  const handleUploadSuccess = (data: any, name: string) => {
    setDocumentData(data);
    setDocumentName(name);
    // Set first section as active
    const firstSection = Object.keys(data)[0];
    setActiveSectionId(firstSection);
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

  if (!documentData) {
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
          documentName={documentName}
          documentData={documentData}
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
              <h1 className="text-2xl font-semibold text-brand-primary">{documentName}</h1>
              <p className="text-sm text-muted-foreground">Audio-enabled document learning</p>
            </div>
            <LanguageSelector language={language} onLanguageChange={setLanguage} />
          </div>
        </div>

        {/* Content Blocks */}
        <div className="p-6 space-y-6">
          {Object.entries(documentData).map(([sectionKey, sectionData]: [string, any]) => (
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
      </div>
    </div>
  );
};

export default Index;
