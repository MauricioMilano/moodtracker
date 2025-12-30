import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MoodEntry } from "./MoodEntryForm";

const MOOD_LABELS: Record<string, string> = {
  happy: "😊 Happy",
  neutral: "😐 Neutral",
  sad: "😔 Sad",
  angry: "😠 Angry",
  anxious: "😰 Anxious",
};

type Props = {
  entries: MoodEntry[];
};

const MoodHistory: React.FC<Props> = ({ entries }) => {
  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mood History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-500 text-center">No entries yet.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mood History</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-gray-200">
          {entries
            .slice()
            .reverse()
            .map((entry) => (
              <li key={entry.id} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between">
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
      </CardContent>
    </Card>
  );
};

export default MoodHistory;