import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";

interface LanguageSelectorProps {
  language: 'english' | 'hindi' | 'gujarati';
  onLanguageChange: (language: 'english' | 'hindi' | 'gujarati') => void;
}

export const LanguageSelector = ({ language, onLanguageChange }: LanguageSelectorProps) => {
  const languages = {
    english: { label: 'English', flag: '🇺🇸' },
    hindi: { label: 'हिंदी', flag: '🇮🇳' },
    gujarati: { label: 'ગુજરાતી', flag: '🇮🇳' }
  };

  return (
    <div className="flex items-center space-x-2">
      <Globe className="w-4 h-4 text-muted-foreground" />
      <Select value={language} onValueChange={onLanguageChange}>
        <SelectTrigger className="w-40 bg-background border-content-border">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(languages).map(([key, { label, flag }]) => (
            <SelectItem key={key} value={key}>
              <div className="flex items-center space-x-2">
                <span>{flag}</span>
                <span>{label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};