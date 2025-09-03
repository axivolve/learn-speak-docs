import { useState } from "react";
import { FileText, Trash2, Plus, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

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

export const DocumentSidebar = ({ 
  documents,
  activeDocumentId,
  onDocumentSelect,
  onDocumentDelete,
  onSectionClick, 
  activeSectionId,
  onAddDocument
}: DocumentSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const SidebarContent = () => (
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
                    onClick={() => {
                      onDocumentSelect(document.id);
                      setIsOpen(false); // Close mobile menu on selection
                    }}
                  >
                    <div className="flex items-center space-x-2 flex-1">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm font-medium truncate">{document.name}</span>
                    </div>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/20 rounded transition-all"
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Document</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{document.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDocumentDelete(document.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
          onClick={() => {
            onAddDocument();
            setIsOpen(false); // Close mobile menu
          }}
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

  return (
    <>
      {/* Mobile Hamburger Button */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden fixed top-4 left-4 z-50 bg-brand-surface border border-content-border"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 fixed left-0 top-0 h-full">
        <SidebarContent />
      </div>
    </>
  );
};