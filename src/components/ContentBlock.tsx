import React, { useState } from "react";
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
  isExpanded?: boolean;
  onExpand?: (sectionId: string) => void;
}
export const ContentBlock = ({
  sectionId,
  title,
  data,
  language,
  onStatusUpdate,
  isExpanded: initialExpanded = false,
  onExpand
}: ContentBlockProps) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [showDescription, setShowDescription] = useState(false);
  const [activeSubtopic, setActiveSubtopic] = useState<string | null>(null);
  const [showSubtopicDescription, setShowSubtopicDescription] = useState<{
    [key: string]: boolean;
  }>({});

  // Sync local state with prop changes
  React.useEffect(() => {
    setIsExpanded(initialExpanded);
    // Auto-expand description when section is expanded
    if (initialExpanded) {
      setShowDescription(true);
    }
  }, [initialExpanded]);
  const hasSubtopics = data.subtopics && Object.keys(data.subtopics).length > 0;
  const hasMainContent = data.text || data.hindi_text || data.guj_text;
  const getText = (contentData: any) => {
    switch (language) {
      case 'hindi':
        return contentData.hindi_text || contentData.text;
      case 'gujarati':
        return contentData.guj_text || contentData.text;
      default:
        return contentData.text;
    }
  };
  const getAudioUrl = (contentData: any) => {
    switch (language) {
      case 'hindi':
        return contentData.hi_speech_url;
      case 'gujarati':
        return contentData.gu_speech_url;
      default:
        return contentData.en_speech_url;
    }
  };
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'completed': {
        text: 'Completed',
        variant: 'default' as const,
        className: 'bg-status-completed text-white'
      },
      'in-progress': {
        text: 'In Progress',
        variant: 'secondary' as const,
        className: 'bg-status-progress text-white'
      },
      'not-listened': {
        text: 'Not Listened Yet',
        variant: 'outline' as const,
        className: 'border-status-pending text-status-pending'
      }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['not-listened'];
    return;
  };
  return <div className="bg-content-bg border border-content-border rounded-xl overflow-hidden card-shadow hover:card-shadow-lg transition-modern">
      {/* Section Header */}
      <div className="p-6 cursor-pointer hover:bg-brand-surface-hover transition-modern" onClick={() => onExpand?.(sectionId)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-brand-accent/10 rounded-lg flex items-center justify-center">
              <button className="p-1 hover:bg-brand-accent/20 rounded transition-modern">
                {isExpanded ? <ChevronDown className="w-4 h-4 text-brand-accent" /> : <ChevronRight className="w-4 h-4 text-brand-accent" />}
              </button>
            </div>
            <h2 className="text-lg font-bold text-brand-primary">{title}</h2>
          </div>
          
        </div>
      </div>

      {/* Section Content */}
      {isExpanded && <div className="border-t border-content-border">
          {/* Audio Player */}
          {hasMainContent && getAudioUrl(data) && <div className="p-6 pb-4">
              <AudioPlayer audioUrl={getAudioUrl(data)} onProgressUpdate={progress => {
          if (progress > 10 && onStatusUpdate) {
            onStatusUpdate(sectionId, 'in-progress');
          }
          if (progress >= 95 && onStatusUpdate) {
            onStatusUpdate(sectionId, 'completed');
          }
        }} />
            </div>}

          {/* Description Panel */}
          {hasMainContent && getText(data) && <div className="border-t border-content-border">
              <div className="p-4 cursor-pointer hover:bg-brand-surface-hover transition-modern flex items-center justify-between" onClick={() => setShowDescription(!showDescription)}>
                <span className="text-sm font-semibold text-brand-primary">Description</span>
                {showDescription ? <ChevronDown className="w-4 h-4 text-brand-accent" /> : <ChevronRight className="w-4 h-4 text-brand-accent" />}
              </div>
              {showDescription && <div className="px-6 pb-6">
                  <div className="prose prose-sm max-w-none">
                    <p className="text-muted-foreground leading-relaxed">
                      {getText(data)}
                    </p>
                  </div>
                </div>}
            </div>}

          {/* Subtopics */}
          {hasSubtopics && <div className="border-t border-content-border">
              {Object.entries(data.subtopics)
                .sort(([a], [b]) => {
                  // Sort by the numeric prefix in the subtopic key
                  const getNumericPrefix = (key: string) => {
                    const match = key.match(/^(\d+\.?\d*)/);
                    return match ? parseFloat(match[1]) : 999;
                  };
                  return getNumericPrefix(a) - getNumericPrefix(b);
                })
                .map(([subtopicKey, subtopicData]: [string, any]) => <div key={subtopicKey} className={cn("border-b border-content-border last:border-b-0", activeSubtopic === subtopicKey ? "bg-brand-surface/50" : "")}>
                  {/* Subtopic Header */}
                  <div className="p-4 cursor-pointer hover:bg-brand-surface-hover transition-modern" onClick={() => setActiveSubtopic(activeSubtopic === subtopicKey ? null : subtopicKey)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-brand-accent/10 rounded-md flex items-center justify-center">
                          <button className="p-0.5 hover:bg-brand-accent/20 rounded transition-modern">
                            {activeSubtopic === subtopicKey ? <ChevronDown className="w-3 h-3 text-brand-accent" /> : <ChevronRight className="w-3 h-3 text-brand-accent" />}
                          </button>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-xs bg-brand-accent/10 px-2 py-1 rounded-md text-brand-accent font-semibold">
                            {subtopicKey.split(' ')[0]}
                          </span>
                          <h3 className="font-semibold text-brand-primary">
                            {subtopicKey.split(' ').slice(1).join(' ')}
                          </h3>
                        </div>
                      </div>
                      
                    </div>
                  </div>

                  {/* Subtopic Content */}
                  {activeSubtopic === subtopicKey && <div className="border-t border-content-border ml-6">
                      {/* Subtopic Audio Player */}
                      {getAudioUrl(subtopicData) && <div className="p-6 pb-4">
                          <AudioPlayer audioUrl={getAudioUrl(subtopicData)} onProgressUpdate={progress => {
                if (progress > 10 && onStatusUpdate) {
                  onStatusUpdate(subtopicKey, 'in-progress');
                }
                if (progress >= 95 && onStatusUpdate) {
                  onStatusUpdate(subtopicKey, 'completed');
                }
              }} />
                        </div>}
                      
                      {/* Subtopic Description Panel */}
                      {getText(subtopicData) && <div className="border-t border-content-border">
                          <div className="p-4 cursor-pointer hover:bg-brand-surface-hover transition-modern flex items-center justify-between" onClick={() => setShowSubtopicDescription(prev => ({
                ...prev,
                [subtopicKey]: !prev[subtopicKey]
              }))}>
                            <span className="text-sm font-semibold text-brand-primary">Description</span>
                            {showSubtopicDescription[subtopicKey] ? <ChevronDown className="w-4 h-4 text-brand-accent" /> : <ChevronRight className="w-4 h-4 text-brand-accent" />}
                          </div>
                          {showSubtopicDescription[subtopicKey] && <div className="px-6 pb-6">
                              <div className="prose prose-sm max-w-none">
                                <p className="text-mutedforeground leading-relaxed">
                                  {getText(subtopicData)}
                                </p>
                              </div>
                            </div>}
                        </div>}
                    </div>}
                </div>)}
            </div>}
        </div>}
    </div>;
};