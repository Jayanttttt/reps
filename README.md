# REPS - Fitness & Gym Progress Tracker

A modular, micro-architecture gym workout tracker built with **React 19**, **TypeScript**, **Tailwind CSS v4**, and **jsPDF**. Data is preserved client-side in **localStorage** with automatic 6-month retention.

---

## 🚀 Key Features

### 1. Weekly Workout Planner (`/planner`)
- Plan workouts for all 7 days of the week.
- **Configurable Muscle Splits**: Supports **Single**, **Double**, and **Triple** body part splits per day, or Rest Days.
- **Auto Previous Record Fetching**: Whenever an exercise is selected, previous weight and rep counts are fetched from history.
- **Smart PR Recommendations**: Displays dynamic targets like *"Try 2.0 kg more to set a new PR!"*.
- Add, edit, or remove exercises from any day's plan with edit buttons.
- Supports custom exercises.

### 2. Live Workout Logger (`/workout`)
- Pulls today's planned exercises automatically based on the current day of the week.
- Interactive stopwatch/timer for workout duration.
- Per-set weight and repetition inputs with completion checkmarks.
- Add additional sets or extra exercises on the fly.
- Saves completed sessions to `reps_workout_sessions` in localStorage.
- Workout completion summary modal showing total kg volume lifted and completed sets.

### 3. Workout History & 6-Month Archive (`/records`)
- View complete historical logs of all workouts.
- Filter by date range (Last 7 days, 30 days, 3 months, 6 months) or muscle group.
- **Exercise Progression View**: Select any exercise to see its full weight and rep trajectory over time and all-time Personal Best (PR).
- **6-Month Preservation**: Automatic retention filtering and one-click auto-prune for entries older than 6 months.
- **PDF Export**: Download your workout logs as a PDF document anytime.
- Inline edit buttons to modify weights, reps, or notes on any past session.

### 4. Monthly Strength Analysis & Reports (`/reports`)
- Comprehensive monthly summary: Workouts, Total Sets, Reps, and Volume (kg).
- **Strength Improvement Analysis**: Automatically compares with the previous month (e.g., *"Improved strength by 3.2% from last month!"*).
- Muscle group volume distribution breakdown.
- Exercise-by-exercise starting vs ending weight progression.
- Download monthly reports as formatted PDF files.

### 5. Monthly Goals Tracker (`/goals`)
- Set monthly goals for target weight (kg), repetition counts, or total volume (kg).
- **Distance from Goal**: Live computation of how far you are from reaching your goal (e.g., *"5 kg away from goal"*).
- Month timeline tracking (days remaining and % of month elapsed).
- Status indicators: **ON TRACK**, **BEHIND PACE**, or **ACHIEVED**.
- Full edit and delete capabilities for all goals.

---

## 📱 Building the Android APK

The project is integrated with **Capacitor 8** and native Android tooling to produce a standalone, offline-ready Android APK.

### One-Command APK Build
To compile the web assets, sync with the native Android project, and generate a new `.apk`:

```bash
npm run build:apk
```

**What this command does automatically:**
1. Compiles TypeScript & Vite web production bundles.
2. Syncs native assets (including the embedded background loop video).
3. Compiles the native Android project via Gradle.
4. Copies the output APK directly to:
   - `~/Desktop/REPS-FitnessTracker.apk`
   - `~/Downloads/REPS-FitnessTracker.apk`

### Installing on Any Android Phone
1. Transfer `REPS-FitnessTracker.apk` to your phone via WhatsApp, Telegram, Google Drive, or USB.
2. Tap the `.apk` file to install.
3. If prompted with *"Install unknown apps"*, tap **Allow from this source**.
4. Open **REPS** and start tracking.

---

## 💡 Pro-Tips for Fast Development & Testing

> [!TIP]
> **You do NOT need to rebuild the APK every time you make a code change!**

* **Instant Desktop Live Reload:** Keep `http://localhost:5173/` open in your computer browser. Changes to React, TypeScript, or CSS update instantly via Hot Module Reload (HMR) without refreshing.
* **Instant Phone Testing (Over Local Wi-Fi):** Connect your mobile phone to the same Wi-Fi network and open:
  ```text
  http://192.168.1.47:5173/
  ```
  You can test mobile layout, touch gestures, glassmorphism, and performance directly on your phone's screen in real-time.
* **Build the APK Only When Distributing:** Only run `npm run build:apk` when you are fully satisfied with your changes and want to share an updated installable file with friends or gym partners.

---

## 🏗️ Architecture (Micro-Architecture)

The codebase is organized into independent, decoupled feature modules:

```
src/
├── features/
│   ├── dashboard/          # Summary overview, today's workout, quick stats
│   ├── planner/            # Weekly split configuration, exercise picker, PR hints
│   ├── workout/            # Active logging, set checklist, live timer
│   ├── records/            # 6-month history, progression curves, PDF generation
│   ├── reports/            # Monthly strength % change analysis, muscle charts
│   └── goals/              # Monthly targets, distance-to-goal computation
├── shared/
│   ├── components/         # Modal, Card, Button, Badge, ProgressBar, StatCard, Tabs
│   ├── constants/          # Exercise library, body part categories, storage keys
│   ├── hooks/              # useLocalStorage with JSON sync
│   ├── types/              # Domain models (WorkoutSession, WeeklyPlan, MonthlyGoal, etc.)
│   └── utils/              # dateUtils, progressAnalyzer, pdfGenerator
├── App.tsx                 # Lazy-loaded code-split routing
├── index.css               # Tailwind CSS v4 setup
└── main.tsx                # React root
```

---

## 💻 Running the App

```bash
# In the reps directory:
cd /home/jayant/Desktop/reps

# Start the Vite development server:
npm run dev

# Or build for production:
npm run build
```
