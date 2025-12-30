import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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

// Returns yyyy-mm-dd string in GMT-3 for a given date
function getDateKeyGMT3(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : new Date(date);
  // Convert to GMT-3 by subtracting 3 hours from UTC
  const gmt3 = new Date(d.getTime() - 3 * 60 * 60 * 1000);
  return gmt3.toISOString().slice(0, 10);
}

type Props = {
  entries: MoodEntry[];
};

function getMoodByDate(entries: MoodEntry[]) {
  // Map: yyyy-mm-dd (GMT-3) => mood
  const map: Record<string, string> = {};
  entries.forEach((entry) => {
    const key = getDateKeyGMT3(entry.date);
    map[key] = entry.mood;
  });
  return map;
}

const MoodCalendar: React.FC<Props> = ({ entries }) => {
  const moodMap = getMoodByDate(entries);

  // Get all days in the current month (in GMT-3)
  const today = new Date();
  const gmt3Now = new Date(today.getTime() - 3 * 60 * 60 * 1000);
  const year = gmt3Now.getFullYear();
  const month = gmt3Now.getMonth();

  // First day of month
  const firstDay = new Date(Date.UTC(year, month, 1, 3, 0, 0)); // 3:00 UTC = 00:00 GMT-3
  // Last day of month
  const lastDay = new Date(Date.UTC(year, month + 1, 0, 3, 0, 0));

  // Build days array
  const days: Date[] = [];
  for (let d = new Date(firstDay); d <= lastDay; d.setUTCDate(d.getUTCDate() + 1)) {
    days.push(new Date(d));
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Mood Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 text-center" role="table" aria-label="Mood calendar">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="font-semibold text-xs text-gray-500" role="columnheader">{d}</div>
          ))}
          {/* Padding for first day */}
          {Array(firstDay.getUTCDay())
            .fill(null)
            .map((_, i) => (
              <div key={`pad-${i}`} />
            ))}
          {days.map((date) => {
            const key = getDateKeyGMT3(date);
            const mood = moodMap[key];
            return (
              <div
                key={key}
                className="h-12 flex flex-col items-center justify-center border rounded bg-white"
                role="cell"
                aria-label={`Day ${date.getUTCDate()}${mood ? `, Mood: ${MOOD_SHORT[mood]}` : ""}`}
                tabIndex={0}
              >
                <span className="text-xs text-gray-400">{date.getUTCDate()}</span>
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