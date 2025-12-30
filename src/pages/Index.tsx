import React, { useEffect, useState } from "react";
import MoodEntryForm, { MoodEntry } from "@/components/MoodEntryForm";
import MoodHistory from "@/components/MoodHistory";
import MoodTrends from "@/components/MoodTrends";
import { MadeWithDyad } from "@/components/made-with-dyad";

const LOCAL_STORAGE_KEY = "mood_entries";

const Index = () => {
  const [entries, setEntries] = useState<MoodEntry[]>([]);

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

  const handleAddEntry = (entry: MoodEntry) => {
    setEntries((prev) => [...prev, entry]);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-2">
      <div className="w-full max-w-xl">
        <h1 className="text-3xl font-bold mb-2 text-center">Mood Journal & Tracker</h1>
        <p className="text-gray-600 mb-6 text-center">
          Track your mood and reflect on your day.
        </p>
        <MoodEntryForm onAdd={handleAddEntry} />
        <MoodTrends entries={entries} />
        <MoodHistory entries={entries} />
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;