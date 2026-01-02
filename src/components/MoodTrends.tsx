import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Input } from "@/components/ui/input";
import type { MoodEntry } from "./MoodEntryForm";
import { useTranslation } from "react-i18next";

// Define moods with levels (higher = better mood)
const MOODS = [
  { value: "sad", short: "😔", level: 1 },
  { value: "anxious", short: "😰", level: 2 },
  { value: "angry", short: "😠", level: 3 },
  { value: "stressed", short: "😣", level: 4 },
  { value: "tired", short: "😴", level: 5 },
  { value: "bored", short: "🥱", level: 6 },
  { value: "neutral", short: "😐", level: 7 },
  { value: "relaxed", short: "😌", level: 8 },
  { value: "grateful", short: "🙏", level: 9 },
  { value: "happy", short: "😊", level: 10 },
  { value: "excited", short: "🤩", level: 11 },
];

const MOOD_LEVELS: Record<string, number> = Object.fromEntries(
  MOODS.map((m) => [m.value, m.level])
);
const MOOD_SHORT: Record<string, string> = Object.fromEntries(
  MOODS.map((m) => [m.value, m.short])
);

type Props = {
  entries: MoodEntry[];
};

const MoodTrends: React.FC<Props> = ({ entries }) => {
  const { t } = useTranslation();
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

  // Map mood labels to translated text for tooltips
  const MOOD_LABELS: Record<string, string> = Object.fromEntries(
    MOODS.map((m) => [m.value, t(`moods.${m.value}`)])
  );

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>
          {t("mood_trends")}
          <span className="ml-2 text-xs font-normal text-gray-500">{t("custom_range")}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t("from")}</label>
            <Input
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              aria-label={`${t("from")} date`}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t("to")}</label>
            <Input
              type="date"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              aria-label={`${t("to")} date`}
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
                labelFormatter={(label) => `${t("from")}: ${label}`}
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