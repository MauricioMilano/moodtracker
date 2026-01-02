import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Globe, Check } from "lucide-react";

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
];

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const current = (i18n.language || "en").split("-")[0];

  const change = (lng: string) => {
    i18n.changeLanguage(lng);
    try {
      localStorage.setItem("i18nextLng", lng);
    } catch {
      // ignore
    }
  };

  const currentMeta = LANGUAGES.find((l) => l.code === current) || LANGUAGES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          aria-label="Select language"
          className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm
                     bg-white hover:bg-gray-50 border border-gray-200 shadow-sm
                     dark:bg-zinc-900 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          <Globe className="w-4 h-4" />
          <span className="min-w-[5ch] text-left">
            <span className="mr-2">{currentMeta.flag}</span>
            <span className="hidden sm:inline">{currentMeta.label}</span>
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-[160px]">
        {LANGUAGES.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onSelect={(e: Event) => {
              e.preventDefault();
              change(l.code);
            }}
            className="flex items-center justify-between gap-2"
            aria-label={`Change language to ${l.label}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{l.flag}</span>
              <span className="text-sm">{l.label}</span>
            </div>
            {current === l.code ? <Check className="w-4 h-4" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;