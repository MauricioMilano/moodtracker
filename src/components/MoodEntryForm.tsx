import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { showSuccess } from "@/utils/toast";
import { useTranslation } from "react-i18next";

const MOOD_DEFS = [
  { emoji: "😊", value: "happy", color: "bg-yellow-200" },
  { emoji: "😐", value: "neutral", color: "bg-gray-200" },
  { emoji: "😔", value: "sad", color: "bg-blue-200" },
  { emoji: "😠", value: "angry", color: "bg-red-200" },
  { emoji: "😰", value: "anxious", color: "bg-purple-200" },
  { emoji: "🤩", value: "excited", color: "bg-pink-200" },
  { emoji: "😴", value: "tired", color: "bg-indigo-200" },
  { emoji: "🙏", value: "grateful", color: "bg-green-200" },
  { emoji: "😣", value: "stressed", color: "bg-orange-200" },
  { emoji: "😌", value: "relaxed", color: "bg-teal-200" },
  { emoji: "🥱", value: "bored", color: "bg-gray-300" },
];

export type MoodEntry = {
  id: string;
  date: string;
  mood: string;
  note: string;
};

type Props = {
  onAdd: (entry: MoodEntry) => void;
};

const MoodEntryForm: React.FC<Props> = ({ onAdd }) => {
  const { t } = useTranslation();
  const [mood, setMood] = useState<string>("");
  const [note, setNote] = useState<string>("");

  const MOODS = MOOD_DEFS.map((m) => ({
    ...m,
    label: `${m.emoji} ${t(`moods.${m.value}`)}`,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood) return;
    const entry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      mood,
      note,
    };
    onAdd(entry);
    setMood("");
    setNote("");
    showSuccess(t("add_entry"));
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{t("how_are_you")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" aria-label="Mood entry form">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Mood selection">
            {MOODS.map((m) => {
              const isSelected = mood === m.value;
              return (
                <Button
                  key={m.value}
                  type="button"
                  variant={isSelected ? "default" : "outline"}
                  className={`flex-1 min-w-[90px] ${m.color} transition-all
                    ${isSelected
                      ? "ring-2 ring-primary border-primary shadow-lg scale-105 text-black hover:text-white"
                      : "border border-gray-300"
                    }
                    dark:bg-black dark:text-white dark:hover:bg-white dark:hover:text-black
                    ${isSelected ? "dark:text-white dark:hover:text-black" : ""}`}
                  onClick={() => setMood(m.value)}
                  aria-label={m.label}
                  aria-pressed={isSelected}
                  tabIndex={0}
                >
                  {m.label}
                </Button>
              );
            })}
          </div>
          <Textarea
            placeholder={t("placeholder_note")}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="resize-none"
            maxLength={200}
            aria-label="Mood note"
          />
          <Button type="submit" disabled={!mood} aria-disabled={!mood} aria-label={t("add_entry")}>
            {t("add_entry")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MoodEntryForm;