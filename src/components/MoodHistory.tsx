import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { MoodEntry } from "./MoodEntryForm";
import { useTranslation } from "react-i18next";

const MOOD_LABELS_BASE: Record<string, string> = {
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

const MoodHistory: React.FC<Props> = ({ entries }) => {
  const { t } = useTranslation();
  const [moodFilter, setMoodFilter] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  const MOODS = Object.keys(MOOD_LABELS_BASE);

  const MOOD_LABELS: Record<string, string> = MOODS.reduce((acc, key) => {
    acc[key] = `${MOOD_LABELS_BASE[key]} ${t(`moods.${key}`)}`;
    return acc;
  }, {} as Record<string, string>);

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
        <CardTitle>{t("mood_history")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4 items-end">
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t("filters.mood")}</label>
            <select
              className="border rounded px-2 py-1"
              value={moodFilter}
              onChange={e => setMoodFilter(e.target.value)}
              aria-label={t("filters.mood")}
            >
              <option value="">{t("filters.all")}</option>
              {MOODS.map(mood => (
                <option key={mood} value={mood}>{MOOD_LABELS[mood]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t("from")}</label>
            <Input
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              aria-label={t("from")}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t("to")}</label>
            <Input
              type="date"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              aria-label={t("to")}
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">{t("filters.search_notes")}</label>
            <Input
              type="text"
              placeholder={t("filters.search_notes")}
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label={t("filters.search_notes")}
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
            {t("filters.clear_filters")}
          </Button>
        </div>
        {filtered.length === 0 ? (
          <div className="text-gray-500 text-center">{t("filters.no_entries")}</div>
        ) : (
          <ul className="divide-y divide-gray-200" role="list" aria-label={t("mood_history")}>
            {filtered.map((entry) => (
              <li
                key={entry.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between"
                role="listitem"
                aria-label={`${MOOD_LABELS[entry.mood] || entry.mood}, ${new Date(entry.date).toLocaleString()}${entry.note ? `, ${entry.note}` : ""}`}
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