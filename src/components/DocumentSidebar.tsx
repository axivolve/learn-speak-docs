import { useState } from "react";
import { ChevronRight, ChevronDown, FileText, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
  onAddDocument: () => void;
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
  activeSectionId,
  onAddDocument
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
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Document Button */}
      <div className="p-4 border-t border-content-border">
        <Button 
          onClick={onAddDocument}
          variant="outline" 
          className="w-full"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Document
        </Button>
      </div>
    </div>
  );
};