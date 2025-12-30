import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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

// Returns yyyy-mm-dd string in GMT-3 for a given date
function getDateKeyGMT3(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : new Date(date);
  // Convert to GMT-3 by subtracting 3 hours from UTC
  const gmt3 = new Date(d.getTime() - 3 * 60 * 60 * 1000);
  return gmt3.toISOString().slice(0, 10);
}

type Props = {
  entries: MoodEntry[];
  onEditEntry?: (entry: MoodEntry) => void;
};

function getMoodByDate(entries: MoodEntry[]) {
  // Map: yyyy-mm-dd (GMT-3) => MoodEntry
  const map: Record<string, MoodEntry> = {};
  entries.forEach((entry) => {
    const key = getDateKeyGMT3(entry.date);
    map[key] = entry;
  });
  return map;
}

const MoodCalendar: React.FC<Props> = ({ entries, onEditEntry }) => {
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

  // Dialog state
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [editNote, setEditNote] = useState("");
  const [editOpen, setEditOpen] = useState(false);

  const handleDayClick = (date: Date) => {
    setSelectedDay(date);
    const key = getDateKeyGMT3(date);
    setEditNote(moodMap[key]?.note || "");
    setEditOpen(true);
  };

  const handleSave = () => {
    if (!selectedDay) return;
    const key = getDateKeyGMT3(selectedDay);
    const entry = moodMap[key];
    if (entry && onEditEntry) {
      onEditEntry({ ...entry, note: editNote });
    }
    setEditOpen(false);
  };

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
            const entry = moodMap[key];
            const mood = entry?.mood;
            return (
              <button
                key={key}
                className={`h-12 w-full flex flex-col items-center justify-center border rounded bg-white focus:outline-none focus:ring-2 focus:ring-primary transition
                  ${entry ? "cursor-pointer hover:bg-primary/10" : "cursor-pointer"}
                `}
                role="cell"
                aria-label={`Day ${date.getUTCDate()}${mood ? `, Mood: ${MOOD_SHORT[mood]}` : ""}`}
                tabIndex={0}
                onClick={() => handleDayClick(date)}
                type="button"
              >
                <span className="text-xs text-gray-400">{date.getUTCDate()}</span>
                <span className="text-lg">{mood ? MOOD_SHORT[mood] : ""}</span>
              </button>
            );
          })}
        </div>
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedDay
                  ? `Entry for ${selectedDay.toLocaleDateString("en-GB", { timeZone: "America/Sao_Paulo" })}`
                  : "Entry"}
              </DialogTitle>
            </DialogHeader>
            {selectedDay && (() => {
              const key = getDateKeyGMT3(selectedDay);
              const entry = moodMap[key];
              if (entry) {
                return (
                  <div>
                    <div className="mb-2">
                      <span className="font-semibold">{MOOD_LABELS[entry.mood] || entry.mood}</span>
                    </div>
                    <Textarea
                      value={editNote}
                      onChange={e => setEditNote(e.target.value)}
                      className="resize-none"
                      maxLength={200}
                      aria-label="Edit note"
                    />
                  </div>
                );
              } else {
                return (
                  <div className="text-gray-500">No entry for this day.</div>
                );
              }
            })()}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditOpen(false)}>
                Close
              </Button>
              {selectedDay && moodMap[getDateKeyGMT3(selectedDay)] && (
                <Button onClick={handleSave}>Save Note</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default MoodCalendar;