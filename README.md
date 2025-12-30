# Mood Journal & Tracker

A simple, privacy-friendly mood journal and tracker built with React, TypeScript, shadcn/ui, and Tailwind CSS.  
Track your daily mood, reflect with notes, and visualize your emotional trends—all data is stored locally in your browser.

## Features

- **Daily Mood Entry:** Select your mood and add an optional note for each day.
- **Mood Calendar:** Visual calendar view of your moods, with the ability to edit notes for past entries.
- **Mood Trends:** Interactive chart to visualize mood changes over time, with custom date range filtering.
- **Mood History:** Searchable and filterable list of all your mood entries.
- **Dark Mode:** Toggle between light and dark themes.
- **Data Privacy:** All data is stored locally in your browser (no accounts, no cloud).
- **Clear All Data:** Option to permanently delete all mood entries.

## Tech Stack

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [shadcn/ui](https://ui.shadcn.com/) (Radix UI components)
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Recharts](https://recharts.org/) for mood trend charts
- [React Router](https://reactrouter.com/) for routing
- [next-themes](https://github.com/pacocoursey/next-themes) for theme switching
- [sonner](https://sonner.emilkowal.ski/) for toasts/notifications

## Getting Started

1. **Install dependencies:**
   ```
   npm install
   ```

2. **Run the development server:**
   ```
   npm run dev
   ```

3. **Open your browser:**  
   Visit [http://localhost:8080](http://localhost:8080) to use the app.

## Usage

- **Add Mood:** Select your mood and (optionally) write a note, then click "Add Entry".
- **View Calendar:** See your moods on a monthly calendar. Click a day to view or edit its note.
- **Trends:** Use the "Mood Trends" chart to visualize your mood over time. Filter by date range.
- **History:** Browse, search, and filter all your past entries.
- **Theme:** Use the toggle in the top left to switch between light and dark mode.
- **Clear Data:** Use the menu (three dots) to clear all mood data (irreversible).

## Data & Privacy

- All mood data is stored in your browser's localStorage.
- No data is sent to any server.  
- Clearing your browser storage or clicking "Clear All Data" will permanently delete your entries.

## Credits

- UI powered by [shadcn/ui](https://ui.shadcn.com/) and [Tailwind CSS](https://tailwindcss.com/)
- Charting by [Recharts](https://recharts.org/)
- Built with ❤️ using [Dyad](https://www.dyad.sh/)

---
_Made with Dyad_