import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Input } from "@/components/ui/input";
import type { MoodEntry } from "./MoodEntryForm";

// Define moods with levels (higher = better mood)
const MOODS = [
  { value: "sad", label: "😔 Sad", short: "😔", level: 1 },
  { value: "anxious", label: "😰 Anxious", short: "😰", level: 2 },
  { value: "angry", label: "😠 Angry", short: "😠", level: 3 },
  { value: "stressed", label: "😣 Stressed", short: "😣", level: 4 },
  { value: "tired", label: "😴 Tired", short: "😴", level: 5 },
  { value: "bored", label: "🥱 Bored", short: "🥱", level: 6 },
  { value: "neutral", label: "😐 Neutral", short: "😐", level: 7 },
  { value: "relaxed", label: "😌 Relaxed", short: "😌", level: 8 },
  { value: "grateful", label: "🙏 Grateful", short: "🙏", level: 9 },
  { value: "happy", label: "😊 Happy", short: "😊", level: 10 },
  { value: "excited", label: "🤩 Excited", short: "🤩", level: 11 },
];

const MOOD_LEVELS: Record<string, number> = Object.fromEntries(
  MOODS.map((m) => [m.value, m.level])
);
const MOOD_SHORT: Record<string, string> = Object.fromEntries(
  MOODS.map((m) => [m.value, m.short])
);
const MOOD_LABELS: Record<string, string> = Object.fromEntries(
  MOODS.map((m) => [m.value, m.label])
);

type Props = {
  entries: MoodEntry[];
};

const MoodTrends: React.FC<Props> = ({ entries }) => {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  if (entries.length === 0) {
    return null;
  }

  // Prepare data for chart
  let data = entries.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString(),
    moodLevel: MOOD_LEVELS[entry.mood] ?? 0,
    mood: entry.mood,
    moodShort: MOOD_SHORT[entry.mood] || entry.mood,
    moodLabel: MOOD_LABELS[entry.mood] || entry.mood,
    rawDate: entry.date,
  }));

  // Filter by date range
  if (dateFrom) {
    data = data.filter((d) => new Date(d.rawDate) >= new Date(dateFrom));
  }
  if (dateTo) {
    data = data.filter((d) => new Date(d.rawDate) <= new Date(dateTo));
  }

  // For Y-axis ticks, show all mood levels in order
  const yTicks = MOODS.map((m) => m.level);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>
          Mood Trends
          <span className="ml-2 text-xs font-normal text-gray-500">(Custom Range)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">From</label>
            <Input
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              aria-label="Trends from date"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">To</label>
            <Input
              type="date"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              aria-label="Trends to date"
            />
          </div>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="date" />
              <YAxis
                dataKey="moodLevel"
                domain={[1, 11]}
                ticks={yTicks}
                tickFormatter={(v) => {
                  const mood = MOODS.find((m) => m.level === v);
                  return mood ? mood.short : v;
                }}
                allowDecimals={false}
              />
              <Tooltip
                formatter={(_, __, props) =>
                  MOOD_LABELS[props.payload?.mood] || ""
                }
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="moodLevel"
                stroke="#6366f1"
                strokeWidth={2}
                dot={{ r: 6, fill: "#6366f1" }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodTrends;