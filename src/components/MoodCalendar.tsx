import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import type { MoodEntry } from "./MoodEntryForm";

const MOOD_SHORT: Record<string, string> = {
  happy: "😊",
  neutral: "😐",
  sad: "😔",
  angry: "😠",
  anxious: "😰",
  excited: "🤩",
  tired: "😴",
  grateful: "🙏",
  stressed: "😣",
  relaxed: "😌",
  bored: "🥱",
};

type Props = {
  entries: MoodEntry[];
};

function getMoodByDate(entries: MoodEntry[]) {
  // Map: yyyy-mm-dd => mood
  const map: Record<string, string> = {};
  entries.forEach((entry) => {
    const d = new Date(entry.date);
    const key = d.toISOString().slice(0, 10);
    map[key] = entry.mood;
  });
  return map;
}

const MoodCalendar: React.FC<Props> = ({ entries }) => {
  const moodMap = getMoodByDate(entries);

  // Get all days in the current month
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  // First day of month
  const firstDay = new Date(year, month, 1);
  // Last day of month
  const lastDay = new Date(year, month + 1, 0);

  // Build days array
  const days: Date[] = [];
  for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Mood Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 text-center">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="font-semibold text-xs text-gray-500">{d}</div>
          ))}
          {/* Padding for first day */}
          {Array(firstDay.getDay())
            .fill(null)
            .map((_, i) => (
              <div key={`pad-${i}`} />
            ))}
          {days.map((date) => {
            const key = date.toISOString().slice(0, 10);
            const mood = moodMap[key];
            return (
              <div
                key={key}
                className="h-12 flex flex-col items-center justify-center border rounded bg-white"
              >
                <span className="text-xs text-gray-400">{date.getDate()}</span>
                <span className="text-lg">{mood ? MOOD_SHORT[mood] : ""}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodCalendar;