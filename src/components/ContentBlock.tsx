import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { AudioPlayer } from "./AudioPlayer";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface ContentBlockProps {
  sectionId: string;
  title: string;
  data: any;
  language: 'english' | 'hindi' | 'gujarati';
  onStatusUpdate?: (sectionId: string, status: 'not-listened' | 'in-progress' | 'completed') => void;
}

export const ContentBlock = ({ 
  sectionId, 
  title, 
  data, 
  language,
  onStatusUpdate 
}: ContentBlockProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeSubtopic, setActiveSubtopic] = useState<string | null>(null);

  const hasSubtopics = data.subtopics && Object.keys(data.subtopics).length > 0;
  const hasMainContent = data.text || data.hindi_text || data.guj_text;

  const getText = (contentData: any) => {
    switch (language) {
      case 'hindi': return contentData.hindi_text || contentData.text;
      case 'gujarati': return contentData.guj_text || contentData.text;
      default: return contentData.text;
    }
  };

  const getAudioUrl = (contentData: any) => {
    switch (language) {
      case 'hindi': return contentData.hindi_speech_url;
      case 'gujarati': return contentData.guj_speech_url;
      default: return contentData.eng_speech_url;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'completed': { text: 'Completed', variant: 'default' as const, className: 'bg-status-completed text-white' },
      'in-progress': { text: 'In Progress', variant: 'secondary' as const, className: 'bg-status-progress text-white' },
      'not-listened': { text: 'Not Listened Yet', variant: 'outline' as const, className: 'border-status-pending text-status-pending' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['not-listened'];
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.text}
      </Badge>
    );
  };

  return (
    <div className="bg-content-bg border border-content-border rounded-lg overflow-hidden">
      {/* Section Header */}
      <div 
        className="p-6 cursor-pointer hover:bg-brand-surface transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button className="p-1 hover:bg-brand-accent/20 rounded">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-brand-accent" />
              ) : (
                <ChevronRight className="w-4 h-4 text-brand-accent" />
              )}
            </button>
            <h2 className="text-lg font-semibold text-brand-primary">{title}</h2>
          </div>
          
          <div className="flex items-center space-x-3">
            {getStatusBadge('not-listened')}
            <span className="text-sm text-muted-foreground">6:50</span>
          </div>
        </div>
      </div>

      {/* Section Content */}
      {isExpanded && (
        <div className="border-t border-content-border">
          {/* Main Content */}
          {hasMainContent && (
            <div className="p-6 space-y-4">
              <div className="prose prose-sm max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  {getText(data)}
                </p>
              </div>
              
              {getAudioUrl(data) && (
                <AudioPlayer
                  audioUrl={getAudioUrl(data)}
                  onProgressUpdate={(progress) => {
                    if (progress > 10 && onStatusUpdate) {
                      onStatusUpdate(sectionId, 'in-progress');
                    }
                    if (progress >= 95 && onStatusUpdate) {
                      onStatusUpdate(sectionId, 'completed');
                    }
                  }}
                />
              )}
            </div>
          )}

          {/* Subtopics */}
          {hasSubtopics && (
            <div className="border-t border-content-border">
              {Object.entries(data.subtopics).map(([subtopicKey, subtopicData]: [string, any]) => (
                <div 
                  key={subtopicKey}
                  className={cn(
                    "border-b border-content-border last:border-b-0",
                    activeSubtopic === subtopicKey ? "bg-brand-surface/50" : ""
                  )}
                >
                  {/* Subtopic Header */}
                  <div 
                    className="p-4 cursor-pointer hover:bg-brand-surface transition-colors"
                    onClick={() => setActiveSubtopic(
                      activeSubtopic === subtopicKey ? null : subtopicKey
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button className="p-1 hover:bg-brand-accent/20 rounded">
                          {activeSubtopic === subtopicKey ? (
                            <ChevronDown className="w-3 h-3 text-brand-accent" />
                          ) : (
                            <ChevronRight className="w-3 h-3 text-brand-accent" />
                          )}
                        </button>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-brand-secondary/10 px-2 py-1 rounded text-brand-secondary font-medium">
                            {subtopicKey.split(' ')[0]}
                          </span>
                          <h3 className="font-medium text-brand-primary">
                            {subtopicKey.split(' ').slice(1).join(' ')}
                          </h3>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {subtopicKey === "2.1 Before Commencement:" && getStatusBadge('completed')}
                        {subtopicKey === "2.2 Lying of bricks" && getStatusBadge('in-progress')}
                        {subtopicKey === "2.3 Mortar" && getStatusBadge('not-listened')}
                        <span className="text-sm text-muted-foreground">
                          {subtopicKey === "2.1 Before Commencement:" ? "2:50" : "6:50"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Subtopic Content */}
                  {activeSubtopic === subtopicKey && (
                    <div className="px-6 pb-4 ml-6 space-y-4">
                      <div className="prose prose-sm max-w-none">
                        <p className="text-muted-foreground leading-relaxed">
                          {getText(subtopicData)}
                        </p>
                      </div>
                      
                      {getAudioUrl(subtopicData) && (
                        <AudioPlayer
                          audioUrl={getAudioUrl(subtopicData)}
                          onProgressUpdate={(progress) => {
                            if (progress > 10 && onStatusUpdate) {
                              onStatusUpdate(subtopicKey, 'in-progress');
                            }
                            if (progress >= 95 && onStatusUpdate) {
                              onStatusUpdate(subtopicKey, 'completed');
                            }
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};