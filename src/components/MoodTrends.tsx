import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { MoodEntry } from "./MoodEntryForm";

const MOOD_ORDER = [
  "sad",
  "anxious",
  "angry",
  "neutral",
  "happy",
  "excited",
  "tired",
  "grateful",
  "stressed",
  "relaxed",
  "bored",
];
const MOOD_LABELS: Record<string, string> = {
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

function moodToValue(mood: string) {
  return MOOD_ORDER.indexOf(mood);
}

type Props = {
  entries: MoodEntry[];
};

const MoodTrends: React.FC<Props> = ({ entries }) => {
  if (entries.length === 0) {
    return null;
  }

  // Prepare data for chart
  const data = entries.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString(),
    mood: moodToValue(entry.mood),
    moodLabel: MOOD_LABELS[entry.mood] || entry.mood,
  }));

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Mood Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="date" />
              <YAxis
                dataKey="mood"
                domain={[0, MOOD_ORDER.length - 1]}
                tickFormatter={(v) => MOOD_LABELS[MOOD_ORDER[v]]}
                allowDecimals={false}
              />
              <Tooltip
                formatter={(_, __, props) =>
                  MOOD_LABELS[MOOD_ORDER[props.payload?.mood]] || ""
                }
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="mood"
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