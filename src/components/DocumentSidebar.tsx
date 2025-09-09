import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const SidebarContent = () => (
    <div className="h-full bg-brand-surface border-r border-content-border flex flex-col">
      {/* Header */}
      <div className="h-20 flex items-center justify-center border-b border-content-border px-6">
        <button 
          onClick={() => navigate('/')}
        >
          <img 
            src="/A-Shridhar logo-black.svg" 
            alt="A.Shridhar Logo" 
            className="h-12 w-auto object-contain"
          />
        </button>
      </div>

      {/* Documents Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {/* <div className="flex items-center space-x-2 text-muted-foreground text-sm mb-4 font-medium">
            <FileText className="h-4 w-4" />
            <span>Documents</span>
          </div> */}

          {/* Document List */}
          <div className="space-y-2">
            {documents.map((document) => {
              const isActive = activeDocumentId === document.id;
              
              return (
                <div key={document.id} className="group">
                  <div
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-modern",
                      isActive 
                        ? "bg-brand-accent/10 text-brand-accent border border-brand-accent/20 shadow-sm" 
                        : "hover:bg-brand-surface-hover border border-transparent hover:border-content-border"
                    )}
                    onClick={() => {
                      onDocumentSelect(document.id);
                      setIsOpen(false); // Close mobile menu on selection
                    }}
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center transition-modern",
                        isActive ? "bg-brand-accent/20" : "bg-muted"
                      )}>
                        <FileText className={cn(
                          "h-4 w-4",
                          isActive ? "text-brand-accent" : "text-muted-foreground"
                        )} />
                      </div>
                      <span className="text-sm font-medium truncate">{document.name}</span>
                    </div>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-destructive/10 rounded-md transition-modern"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
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
          className="w-full bg-brand-accent hover:bg-brand-accent/90 text-white font-medium shadow-sm"
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
            className="lg:hidden fixed top-4 left-4 z-50 bg-brand-surface border border-content-border shadow-sm hover:shadow-md transition-modern"
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