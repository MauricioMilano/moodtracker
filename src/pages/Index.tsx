import React, { useEffect, useState } from "react";
import MoodEntryForm, { MoodEntry } from "@/components/MoodEntryForm";
import MoodHistory from "@/components/MoodHistory";
import MoodTrends from "@/components/MoodTrends";
import MoodCalendar from "@/components/MoodCalendar";
import { Button } from "@/components/ui/button";
import { showSuccess } from "@/utils/toast";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { useTranslation } from "react-i18next";

const LOCAL_STORAGE_KEY = "mood_entries";

// Returns yyyy-mm-dd string in GMT-3 for a given date
function getDateKeyGMT3(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : new Date(date);
  // Convert to GMT-3 by subtracting 3 hours from UTC
  const gmt3 = new Date(d.getTime() - 3 * 60 * 60 * 1000);
  return gmt3.toISOString().slice(0, 10);
}

const Index = () => {
  const { t } = useTranslation();
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [open, setOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        setEntries(JSON.parse(stored));
      } catch {
        setEntries([]);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  // Only allow one mood per day (in GMT-3)
  const handleAddEntry = (entry: MoodEntry) => {
    const todayKey = getDateKeyGMT3(new Date());
    const entryKey = getDateKeyGMT3(entry.date);
    setEntries((prev) => {
      // Remove any entry for today (in GMT-3)
      const filtered = prev.filter((e) => getDateKeyGMT3(e.date) !== todayKey);
      return [...filtered, { ...entry, date: new Date().toISOString() }];
    });
    showSuccess(t("add_entry"));
  };

  // Edit mood entry note from calendar dialog
  const handleEditEntry = (updated: MoodEntry) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === updated.id ? updated : e))
    );
    showSuccess(t("save_note"));
  };

  const handleClearAll = () => {
    setEntries([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    showSuccess(t("clear_all_data"));
    setOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-background flex flex-col items-center py-8 px-2 transition-colors">
      <div className="w-full max-w-xl">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <LanguageSelector />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={t("clear_all_data")} aria-haspopup="true">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onSelect={(e) => {
                      e.preventDefault();
                      setOpen(true);
                    }}
                    aria-label={t("clear_all_data")}
                  >
                    {t("clear_all_data")}
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t("confirm_clear_title")}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t("confirm_clear_desc")}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setOpen(false)} aria-label={t("cancel")}>
                      {t("cancel")}
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-white hover:bg-destructive/90"
                      onClick={handleClearAll}
                      aria-label={t("yes_clear")}
                    >
                      {t("yes_clear")}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <h1 className="text-3xl font-bold mb-2 text-center">{t("title")}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
          {t("subtitle")}
        </p>
        <MoodEntryForm onAdd={handleAddEntry} />
        <MoodCalendar entries={entries} onEditEntry={handleEditEntry} />
        <MoodTrends entries={entries} />
        <MoodHistory entries={entries} />
      </div>
    </div>
  );
};

export default Index;