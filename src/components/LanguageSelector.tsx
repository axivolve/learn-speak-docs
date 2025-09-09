import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

interface LanguageSelectorProps {
  language: 'english' | 'hindi' | 'gujarati';
  onLanguageChange: (language: 'english' | 'hindi' | 'gujarati') => void;
}

export const LanguageSelector = ({ language, onLanguageChange }: LanguageSelectorProps) => {
  const languages = {
    english: { label: 'English', flag: '🇮🇳' },
    hindi: { label: 'हिंदी', flag: '🇮🇳' },
    gujarati: { label: 'ગુજરાતી', flag: '🇮🇳' }
  };

  const currentLanguage = languages[language];

  return (
    <Select value={language} onValueChange={onLanguageChange}>
      <SelectTrigger className="w-24 h-9 bg-background border-content-border hover:border-brand-accent focus:border-brand-accent focus:ring-brand-accent/20 rounded-lg transition-modern px-2">
        <div className="flex items-center space-x-1.5 text-brand-accent">
          <Globe className="w-4 h-4" />
          {/* <span className="text-sm">{currentLanguage.flag}</span> */}
          <span className="text-xs font-semibold">{currentLanguage.label}</span>
        </div>
      </SelectTrigger>
      <SelectContent className="rounded-lg border-content-border w-24">
        {Object.entries(languages).map(([key, { label, flag }]) => (
          <SelectItem 
            key={key} 
            value={key} 
            className="rounded-md px-2 data-[state=checked]:bg-brand-accent/10 data-[state=checked]:text-brand-accent"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2">
                <span className="text-sm">{flag}</span>
                <span className="text-xs font-semibold">{label}</span>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};