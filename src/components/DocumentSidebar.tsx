import { useState } from "react";
import { ChevronRight, ChevronDown, FileText, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StoredDocument {
  id: string;
  name: string;
  data: any;
}

interface DocumentSidebarProps {
  documents: StoredDocument[];
  activeDocumentId: string;
  onDocumentSelect: (documentId: string) => void;
  onDocumentDelete: (documentId: string) => void;
  onSectionClick: (sectionId: string) => void;
  activeSectionId?: string;
}

interface SectionStatus {
  [key: string]: 'not-listened' | 'in-progress' | 'completed';
}

export const DocumentSidebar = ({ 
  documents,
  activeDocumentId,
  onDocumentSelect,
  onDocumentDelete,
  onSectionClick, 
  activeSectionId 
}: DocumentSidebarProps) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [sectionStatus] = useState<SectionStatus>({
    "2.1 Before Commencement:": 'completed',
    "2.2 Lying of bricks": 'in-progress',
    "2.3 Mortar": 'not-listened',
  });

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-status-completed';
      case 'in-progress': return 'bg-status-progress';
      default: return 'bg-status-pending';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      default: return 'Not Listened Yet';
    }
  };

  return (
    <div className="h-full bg-brand-surface border-r border-content-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-content-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <div>
            <h1 className="font-bold text-brand-primary text-lg">A.SHRIDHAR</h1>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">BUILDING THOUGHTFULLY</p>
          </div>
        </div>
      </div>

      {/* Documents Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center space-x-2 text-muted-foreground text-sm mb-3">
            <FileText className="h-4 w-4" />
            <span>Documents</span>
          </div>

          {/* Document List */}
          <div className="space-y-1">
            {documents.map((document) => {
              const isActive = activeDocumentId === document.id;
              
              return (
                <div key={document.id} className="group">
                  <div
                    className={cn(
                      "flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors",
                      isActive ? "bg-brand-accent/10 text-brand-accent" : "hover:bg-brand-surface-hover"
                    )}
                    onClick={() => onDocumentSelect(document.id)}
                  >
                    <div className="flex items-center space-x-2 flex-1">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm font-medium truncate">{document.name}</span>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDocumentDelete(document.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/20 rounded transition-all"
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </button>
                  </div>

                  {/* Document Sections - Only show for active document */}
                  {isActive && (
                    <div className="ml-4 mt-1 space-y-1">
                      {Object.entries(document.data).map(([sectionKey, sectionData]: [string, any]) => {
                        const hasSubtopics = sectionData.subtopics && Object.keys(sectionData.subtopics).length > 0;
                        const isExpanded = expandedSections[sectionKey];
                        const isActiveSec = activeSectionId === sectionKey;

                        return (
                          <div key={sectionKey}>
                            {/* Main Section */}
                            <div
                              className={cn(
                                "flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors",
                                isActiveSec ? "bg-brand-accent/10 text-brand-accent" : "hover:bg-brand-surface-hover",
                                "group"
                              )}
                              onClick={() => {
                                onSectionClick(sectionKey);
                                if (hasSubtopics) {
                                  toggleSection(sectionKey);
                                }
                              }}
                            >
                              <div className="flex items-center space-x-2 flex-1">
                                {hasSubtopics && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleSection(sectionKey);
                                    }}
                                    className="p-0.5 hover:bg-brand-accent/20 rounded"
                                  >
                                    {isExpanded ? (
                                      <ChevronDown className="h-3 w-3" />
                                    ) : (
                                      <ChevronRight className="h-3 w-3" />
                                    )}
                                  </button>
                                )}
                                <span className="text-sm">{sectionKey}</span>
                              </div>
                            </div>

                            {/* Subtopics */}
                            {hasSubtopics && isExpanded && (
                              <div className="ml-6 mt-1 space-y-1">
                                {Object.entries(sectionData.subtopics).map(([subtopicKey, subtopicData]: [string, any]) => {
                                  const isSubtopicActive = activeSectionId === subtopicKey;
                                  const status = sectionStatus[subtopicKey] || 'not-listened';

                                  return (
                                    <div
                                      key={subtopicKey}
                                      className={cn(
                                        "flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors",
                                        isSubtopicActive ? "bg-brand-accent/10 text-brand-accent" : "hover:bg-brand-surface-hover"
                                      )}
                                      onClick={() => onSectionClick(subtopicKey)}
                                    >
                                      <div className="flex items-center space-x-2 flex-1">
                                        <div className="flex items-center space-x-2">
                                          <span className="text-xs bg-brand-secondary/10 px-1.5 py-0.5 rounded text-brand-secondary">
                                            {subtopicKey.split(' ')[0]}
                                          </span>
                                          <span className="text-sm">{subtopicKey.split(' ').slice(1).join(' ')}</span>
                                        </div>
                                      </div>
                                      
                                      <div className="flex items-center space-x-2">
                                        <div className={cn("w-2 h-2 rounded-full", getStatusColor(status))} />
                                        <span className="text-xs text-muted-foreground">
                                          {status === 'completed' ? '2:50' : status === 'in-progress' ? '6:50' : '6:50'}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};