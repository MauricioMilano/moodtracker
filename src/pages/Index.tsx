import React, { useEffect, useState } from "react";
import MoodEntryForm, { MoodEntry } from "@/components/MoodEntryForm";
import MoodHistory from "@/components/MoodHistory";
import MoodTrends from "@/components/MoodTrends";
import MoodCalendar from "@/components/MoodCalendar";
import { Button } from "@/components/ui/button";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { showSuccess } from "@/utils/toast";
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

const LOCAL_STORAGE_KEY = "mood_entries";

function getDateKey(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().slice(0, 10);
}

const Index = () => {
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

  // Only allow one mood per day
  const handleAddEntry = (entry: MoodEntry) => {
    const todayKey = getDateKey(entry.date);
    setEntries((prev) => {
      // Remove any entry for today
      const filtered = prev.filter((e) => getDateKey(e.date) !== todayKey);
      return [...filtered, entry];
    });
    showSuccess("Mood entry saved for today!");
  };

  const handleClearAll = () => {
    setEntries([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    showSuccess("All mood data cleared!");
    setOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-2">
      <div className="w-full max-w-xl">
        <h1 className="text-3xl font-bold mb-2 text-center">Mood Journal & Tracker</h1>
        <p className="text-gray-600 mb-6 text-center">
          Track your mood and reflect on your day.
        </p>
        <div className="flex justify-end mb-2">
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" onClick={() => setOpen(true)}>
                Clear All Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all your mood entries. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-white hover:bg-destructive/90"
                  onClick={handleClearAll}
                >
                  Yes, clear all
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <MoodEntryForm onAdd={handleAddEntry} />
        <MoodCalendar entries={entries} />
        <MoodTrends entries={entries} />
        <MoodHistory entries={entries} />
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;