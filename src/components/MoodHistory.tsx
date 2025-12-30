import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { MoodEntry } from "./MoodEntryForm";

const MOOD_LABELS: Record<string, string> = {
  happy: "😊 Happy",
  neutral: "😐 Neutral",
  sad: "😔 Sad",
  angry: "😠 Angry",
  anxious: "😰 Anxious",
  excited: "🤩 Excited",
  tired: "😴 Tired",
  grateful: "🙏 Grateful",
  stressed: "😣 Stressed",
  relaxed: "😌 Relaxed",
  bored: "🥱 Bored",
};

const MOODS = Object.keys(MOOD_LABELS);

type Props = {
  entries: MoodEntry[];
};

const MoodHistory: React.FC<Props> = ({ entries }) => {
  const [moodFilter, setMoodFilter] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  const filtered = entries
    .filter((entry) => {
      if (moodFilter && entry.mood !== moodFilter) return false;
      if (search && !entry.note.toLowerCase().includes(search.toLowerCase())) return false;
      if (dateFrom && new Date(entry.date) < new Date(dateFrom)) return false;
      if (dateTo && new Date(entry.date) > new Date(dateTo)) return false;
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mood History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4 items-end">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Mood</label>
            <select
              className="border rounded px-2 py-1"
              value={moodFilter}
              onChange={e => setMoodFilter(e.target.value)}
              aria-label="Filter by mood"
            >
              <option value="">All</option>
              {MOODS.map(mood => (
                <option key={mood} value={mood}>{MOOD_LABELS[mood]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">From</label>
            <Input
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              aria-label="Filter from date"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">To</label>
            <Input
              type="date"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              aria-label="Filter to date"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Search Notes</label>
            <Input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search notes"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setMoodFilter("");
              setDateFrom("");
              setDateTo("");
              setSearch("");
            }}
            className="h-9"
          >
            Clear Filters
          </Button>
        </div>
        {filtered.length === 0 ? (
          <div className="text-gray-500 text-center">No entries found.</div>
        ) : (
          <ul className="divide-y divide-gray-200" role="list" aria-label="Mood history">
            {filtered.map((entry) => (
              <li
                key={entry.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between"
                role="listitem"
                aria-label={`Mood: ${MOOD_LABELS[entry.mood] || entry.mood}, Date: ${new Date(entry.date).toLocaleString()}${entry.note ? `, Note: ${entry.note}` : ""}`}
              >
                <div>
                  <span className="font-semibold">{MOOD_LABELS[entry.mood] || entry.mood}</span>
                  <span className="ml-2 text-xs text-gray-400">
                    {new Date(entry.date).toLocaleString()}
                  </span>
                  {entry.note && (
                    <div className="text-gray-600 mt-1 text-sm">{entry.note}</div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default MoodHistory;