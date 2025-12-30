import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { showSuccess } from "@/utils/toast";

const MOODS = [
  { label: "😊 Happy", value: "happy", color: "bg-yellow-200" },
  { label: "😐 Neutral", value: "neutral", color: "bg-gray-200" },
  { label: "😔 Sad", value: "sad", color: "bg-blue-200" },
  { label: "😠 Angry", value: "angry", color: "bg-red-200" },
  { label: "😰 Anxious", value: "anxious", color: "bg-purple-200" },
  { label: "🤩 Excited", value: "excited", color: "bg-pink-200" },
  { label: "😴 Tired", value: "tired", color: "bg-indigo-200" },
  { label: "🙏 Grateful", value: "grateful", color: "bg-green-200" },
  { label: "😣 Stressed", value: "stressed", color: "bg-orange-200" },
  { label: "😌 Relaxed", value: "relaxed", color: "bg-teal-200" },
  { label: "🥱 Bored", value: "bored", color: "bg-gray-300" },
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
  const [mood, setMood] = useState<string>("");
  const [note, setNote] = useState<string>("");

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
    showSuccess("Mood entry added!");
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>How are you feeling?</CardTitle>
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
                  `}
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
            placeholder="Write a short note (optional)..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="resize-none"
            maxLength={200}
            aria-label="Mood note"
          />
          <Button type="submit" disabled={!mood} aria-disabled={!mood} aria-label="Add mood entry">
            Add Entry
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MoodEntryForm;