import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHelp, HelpTabId } from './HelpContext';
import { useTheme } from '@shared/theme';
import {
  HomeIcon,
  CalendarIcon,
  DumbbellIcon,
  RecordsIcon,
  ReportsIcon,
  GoalsIcon,
  CheckIcon,
  LightbulbIcon,
  ArrowRightIcon,
} from '@shared/components';

interface TabHelpDetail {
  id: HelpTabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  tagline: string;
  badge: string;
  description: string;
  steps: { title: string; detail: string }[];
  keyFeatures: { title: string; detail: string }[];
  proTip: string;
}

const TAB_HELP_DATA: Record<HelpTabId, TabHelpDetail> = {
  home: {
    id: 'home',
    label: 'Home',
    icon: HomeIcon,
    route: '/',
    badge: 'Command Center',
    tagline: 'Your Daily Fitness Hub & Progress Overview',
    description:
      'The Home dashboard is your high-level overview. It displays your Snapchat-style workout streak, today’s workout launcher, monthly volume, and active goals.',
    steps: [
      {
        title: '1. Check Your Daily Streak',
        detail:
          'View your burning 🔥 streak counter and past 7 days activity. Log workouts to keep the flame alive.',
      },
      {
        title: '2. Start Today’s Workout',
        detail:
          'Tap "Start Today’s Workout" to jump straight into the Workout tab with your scheduled exercises ready.',
      },
      {
        title: '3. Track Monthly Consistency',
        detail:
          'Inspect volume lifted (kg), sessions completed this month, and edit active monthly targets on the fly.',
      },
    ],
    keyFeatures: [
      {
        title: 'Snapchat-Style Streaks',
        detail: 'Dynamic fire streak counter, streak status alerts, and 7-day flame history.',
      },
      {
        title: 'One-Tap Workout Start',
        detail: 'Instant launch button preloaded with your day split exercises.',
      },
      {
        title: 'Monthly Goal Editor',
        detail: 'Live progress bars with direct edit pencil buttons to adjust targets.',
      },
      {
        title: 'Workout History Shortcut',
        detail: 'Quick link to view your complete 6-month historical training logs and PRs.',
      },
    ],
    proTip:
      'Keep your streak alive by logging at least 1 session every workout day. The streak indicator will warn you when your streak is at risk!',
  },
  planner: {
    id: 'planner',
    label: 'Planner',
    icon: CalendarIcon,
    route: '/planner',
    badge: 'Routine Architect',
    tagline: 'Design & Customize Your 7-Day Training Split',
    description:
      'The Weekly Planner lets you build your custom training schedule. Add exercises, define target weights and reps, or mark rest days.',
    steps: [
      {
        title: '1. Select a Day of the Week',
        detail:
          'Navigate through Monday to Sunday. Toggle whether each day is a dedicated Workout Day or a Rest Day.',
      },
      {
        title: '2. Configure Any Split (4+ Parts)',
        detail:
          'Use Single, Double, Triple, or Custom split to train as many body parts as you want (e.g. Back, Biceps, Forearms, Abs & Core).',
      },
      {
        title: '3. Add Movements & Targets',
        detail:
          'Add exercises from the library and set target sets, reps, and weights to guide your live sessions.',
      },
    ],
    keyFeatures: [
      {
        title: 'Custom Multi-Part Splits',
        detail: 'No artificial limits—configure 4, 5, or more muscle groups per day easily.',
      },
      {
        title: '50+ Exercise Library',
        detail: 'Covers Back, Biceps, Forearms, Abs & Core, Chest, Legs, Shoulders, and more.',
      },
      {
        title: 'Reset to Recommended',
        detail: 'Instantly restore the standard Push/Pull/Legs split with one click.',
      },
      {
        title: 'Autosave to Device',
        detail: 'All routine adjustments are saved permanently in your browser.',
      },
    ],
    proTip:
      'Plan your progressive overload targets in advance here. Updating target weight helps keep you focused during live workouts.',
  },
  workout: {
    id: 'workout',
    label: 'Workout',
    icon: DumbbellIcon,
    route: '/workout',
    badge: 'Live Session Logger',
    tagline: 'Record Live Sets & Push Progressive Overload',
    description:
      'The Workout tab is where you record what you lift during your gym session. Track sets, reps, and weights in real-time with instant progressive overload suggestions.',
    steps: [
      {
        title: '1. Verify Exercises for Today',
        detail:
          'Your planned exercises for today automatically appear. You can add extra exercises or delete ones you are skipping.',
      },
      {
        title: '2. Enter Weight & Reps',
        detail:
          'Log the exact weight (kg) and repetitions you achieved. Tap "+ Add Set" if you do extra sets.',
      },
      {
        title: '3. Tap "Mark as Done"',
        detail:
          'Tap the "Mark as Done" button on each set as you finish. It confirms completion and locks in your volume.',
      },
      {
        title: '4. Tap "Finish Workout"',
        detail:
          'When finished, tap "Finish Workout" to calculate total volume, see your session summary, and save it.',
      },
    ],
    keyFeatures: [
      {
        title: '"Mark as Done" Set Buttons',
        detail: 'Clear, high-visibility buttons to mark sets as completed or toggle back if needed.',
      },
      {
        title: 'Smart PR Suggestions',
        detail: 'Shows your previous best weight & reps for each movement and suggests a 2.5kg increase.',
      },
      {
        title: 'Live Volume Calculation',
        detail: 'Automatically tallies total kg lifted and finished sets across all exercises.',
      },
      {
        title: 'Workout Summary Modal',
        detail: 'Post-workout report showing exercises completed, top weights, and total tonnage lifted.',
      },
    ],
    proTip:
      'Always check the PR suggestion banner above each exercise. Adding just 1 rep or 1-2kg over your previous record is the key to strength growth!',
  },
  records: {
    id: 'records',
    label: 'Records',
    icon: RecordsIcon,
    route: '/records',
    badge: 'Historical Archive',
    tagline: 'Search Past Workouts & Track Exercise PRs Over Time',
    description:
      'Records is your permanent training log. Review every past workout session in detail, track your strength trajectory on specific exercises, and export PDF summaries.',
    steps: [
      {
        title: '1. Browse Past Sessions',
        detail:
          'The Sessions tab lists every completed workout by date with all exercises, sets, volume, and date tags.',
      },
      {
        title: '2. Search Exercise Progression',
        detail:
          'Switch to the "Exercise History" tab and type any exercise name (e.g. "Bench Press") to view all past attempts.',
      },
      {
        title: '3. Filter by Time & Muscle Group',
        detail:
          'Use the dropdown filters to narrow down records by 7 days, 30 days, 90 days, or by specific muscle groups.',
      },
      {
        title: '4. Export PDF Logs',
        detail:
          'Click "Export PDF" to generate a printable, beautifully styled PDF document of your workout records.',
      },
    ],
    keyFeatures: [
      {
        title: 'Dual-Tab Browsing',
        detail: 'Easily toggle between "Session View" and "Exercise History View".',
      },
      {
        title: 'Personal Best Badges',
        detail: 'Highlights top weight and top volume achieved across your training history.',
      },
      {
        title: 'Instant Search & Filter',
        detail: 'Search across 50+ exercises and filter by Chest, Back, Legs, Shoulders, Arms, and Core.',
      },
      {
        title: 'One-Click PDF Export',
        detail: 'Export professional training logs for coaches, doctors, or personal archiving.',
      },
    ],
    proTip:
      'Before starting a workout, open Records > Exercise History to remind yourself what weight you used the last time you trained that movement!',
  },
  reports: {
    id: 'reports',
    label: 'Reports',
    icon: ReportsIcon,
    route: '/reports',
    badge: 'Analytics & Insights',
    tagline: 'Visual Analytics & Muscle Balance Breakdown',
    description:
      'Reports provides deep visual analytics into your workout volume, muscle group balance, and month-over-month strength progression trends.',
    steps: [
      {
        title: '1. Select Month to Analyze',
        detail:
          'Use the month selector dropdown at the top to choose current or past months (up to 6 months back).',
      },
      {
        title: '2. Check Muscle Group Balance',
        detail:
          'Inspect the Body Part distribution bar charts to see if your push/pull/leg volume is balanced.',
      },
      {
        title: '3. Review Strength Progression',
        detail:
          'Look at the Exercise Progress list to see whether your weights and reps went up compared to last month.',
      },
      {
        title: '4. Download Monthly PDF Report',
        detail:
          'Click "Download PDF" to get an official, high-resolution monthly progress report document.',
      },
    ],
    keyFeatures: [
      {
        title: 'Monthly Volume Metrics',
        detail: 'Total workouts, total kg lifted, and total sets with month-over-month comparison percentages.',
      },
      {
        title: 'Body Part Volume Charts',
        detail: 'Visual distribution of sets per muscle group (Chest, Back, Legs, Shoulders, Arms, Core).',
      },
      {
        title: 'Progressive Overload Tracking',
        detail: 'Highlights exercises with increased weight, extra reps, or new personal records.',
      },
      {
        title: 'Downloadable PDF Reports',
        detail: 'High-quality monthly performance certificate and analytics report.',
      },
    ],
    proTip:
      'Use the Body Part Chart to spot neglected muscle groups. If Legs or Back have low set counts, adjust your Weekly Planner accordingly!',
  },
  goals: {
    id: 'goals',
    label: 'Goals',
    icon: GoalsIcon,
    route: '/goals',
    badge: 'Target Tracker',
    tagline: 'Set Monthly Targets & Automate Milestone Tracking',
    description:
      'The Goals tab keeps you disciplined and goal-oriented. Set workout frequency targets and specific exercise strength milestones that automatically update as you log workouts.',
    steps: [
      {
        title: '1. Pick Current Month',
        detail:
          'Select the current month to view your active goals, or select past months to view your success rate.',
      },
      {
        title: '2. Create or Edit Goals',
        detail:
          'Tap "+ Set New Goal" or tap the pencil icon on any existing goal to adjust target weights, reps, or volume.',
      },
      {
        title: '3. Watch Automatic Progress Bars',
        detail:
          'Goals update automatically! As you log workouts and sets in the Workout tab, your goal bars advance.',
      },
    ],
    keyFeatures: [
      {
        title: 'Automatic Session Tracking',
        detail: 'Counts finished workouts during the month and compares them against your target.',
      },
      {
        title: 'Exercise Strength Milestones',
        detail: 'Checks your logged sets to see when you hit or exceed target weight and reps.',
      },
      {
        title: 'Interactive Progress Visuals',
        detail: 'Progress bars show completion percentage and remaining workouts required.',
      },
      {
        title: 'Month Elapsed Indicator',
        detail: 'Compares your goal completion pace against the days remaining in the month.',
      },
    ],
    proTip:
      'At the beginning of every month, set at least 1 frequency goal (e.g. 16-20 workouts) and 2 specific strength goals for compound lifts!',
  },
};

export function HelpCenterModal() {
  const { isOpen, activeHelpTab, setActiveHelpTab, closeHelp } = useHelp();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isLight = theme === 'light';

  if (!isOpen) return null;

  const currentTab = TAB_HELP_DATA[activeHelpTab] || TAB_HELP_DATA.home;
  const TabIcon = currentTab.icon;

  const handleNavigateToTab = (route: string) => {
    closeHelp();
    navigate(route);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 transition-opacity ${
          isLight ? 'bg-slate-900/35 backdrop-blur-sm' : 'bg-black/85 backdrop-blur-md'
        }`}
        onClick={closeHelp}
      />

      {/* Mobile Bottom-Sheet / Desktop Centered Card */}
      <div
        className={`relative w-full sm:max-w-xl md:max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[88vh] sm:max-h-[85vh] z-10 overflow-hidden animate-in slide-in-from-bottom-5 sm:zoom-in-95 duration-200 border-t sm:border ${
          isLight
            ? 'bg-white border-[#EEF2F6] text-[#1A2238]'
            : 'bg-neutral-950 border-neutral-800 text-white'
        }`}
      >
        {/* Mobile Pull Handle */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center shrink-0">
          <div className={`w-10 h-1 rounded-full ${isLight ? 'bg-slate-300' : 'bg-neutral-700'}`} />
        </div>

        {/* Clean Header Bar */}
        <div
          className={`px-4 py-3 sm:py-3.5 border-b flex items-center justify-between shrink-0 ${
            isLight
              ? 'bg-white border-[#EEF2F6]'
              : 'bg-neutral-950 border-neutral-800/90'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-7 h-7 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 ${
                isLight
                  ? 'bg-[#FFF0ED] border-[#FF5B45]/35 text-[#FF5B45]'
                  : 'bg-red-600/20 border-red-500/40 text-rose-300'
              }`}
            >
              ?
            </div>
            <div className="min-w-0">
              <h2
                className={`text-sm sm:text-base font-bold tracking-tight truncate ${
                  isLight ? 'text-[#1A2238]' : 'text-white'
                }`}
              >
                {currentTab.label} Tab Guide
              </h2>
              <p className={`text-[11px] truncate ${isLight ? 'text-[#64748B]' : 'text-neutral-400'}`}>
                Features, workflows &amp; tips
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeHelp}
            className={`w-7 h-7 rounded-full flex items-center justify-center border shrink-0 cursor-pointer transition-colors ${
              isLight
                ? 'bg-[#F1F4F9] hover:bg-[#E5EBF4] text-[#64748B] hover:text-[#1A2238] border-[#E2E8F0]'
                : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border-white/10'
            }`}
            title="Close"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mobile Segmented Scrollable Tab Bar */}
        <div
          className={`border-b px-3 py-2 overflow-x-auto scrollbar-none flex items-center gap-1.5 shrink-0 ${
            isLight
              ? 'bg-[#F8FAFD] border-[#EEF2F6]'
              : 'bg-neutral-900/60 border-neutral-800/80'
          }`}
        >
          {(Object.keys(TAB_HELP_DATA) as HelpTabId[]).map(tabKey => {
            const item = TAB_HELP_DATA[tabKey];
            const Icon = item.icon;
            const isActive = activeHelpTab === tabKey;
            return (
              <button
                key={tabKey}
                type="button"
                onClick={() => setActiveHelpTab(tabKey)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? isLight
                      ? 'bg-gradient-to-r from-[#FF5B45] to-[#FF7854] text-white shadow-sm font-bold border border-transparent'
                      : 'bg-red-600 text-white shadow-sm font-bold'
                    : isLight
                    ? 'text-[#64748B] hover:text-[#1A2238] bg-white border border-[#EEF2F6]'
                    : 'text-neutral-400 hover:text-white bg-neutral-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area (Scrollable) */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1 text-sm">
          {/* Section Overview Card */}
          <div
            className={`border rounded-2xl p-4 space-y-2.5 ${
              isLight
                ? 'bg-[#F8FAFD] border-[#EEF2F6]'
                : 'bg-neutral-900/80 border-neutral-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  isLight
                    ? 'text-[#FF5B45] bg-[#FFF0ED] border-[#FF5B45]/30'
                    : 'text-rose-400 bg-red-500/10 border-red-500/30'
                }`}
              >
                {currentTab.badge}
              </span>
              <button
                type="button"
                onClick={() => handleNavigateToTab(currentTab.route)}
                className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer ${
                  isLight
                    ? 'bg-gradient-to-r from-[#FF5B45] to-[#FF7854] hover:opacity-95 text-white'
                    : 'bg-red-600 hover:bg-red-500 text-white'
                }`}
              >
                <span>Open {currentTab.label}</span>
                <ArrowRightIcon className="w-3 h-3" />
              </button>
            </div>
            <h3
              className={`text-sm sm:text-base font-bold tracking-tight ${
                isLight ? 'text-[#1A2238]' : 'text-white'
              }`}
            >
              {currentTab.tagline}
            </h3>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-[#5F6D7E]' : 'text-neutral-300'}`}>
              {currentTab.description}
            </p>
          </div>

          {/* Step-by-Step Guide */}
          <div className="space-y-2">
            <h4 className={`text-[11px] font-bold uppercase tracking-wider ${isLight ? 'text-[#334155]' : 'text-neutral-400'}`}>
              How To Use This Section
            </h4>
            <div className="space-y-2">
              {currentTab.steps.map((step, idx) => (
                <div
                  key={idx}
                  className={`border rounded-xl p-3 flex items-start gap-2.5 ${
                    isLight
                      ? 'bg-white/80 backdrop-blur-md border-[#EEF2F6]'
                      : 'bg-neutral-900/40 border-neutral-800/80'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                      isLight
                        ? 'bg-[#FFF0ED] text-[#FF5B45]'
                        : 'bg-red-600/20 text-rose-300'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <h5 className={`text-xs font-semibold ${isLight ? 'text-[#1A2238]' : 'text-white'}`}>
                      {step.title}
                    </h5>
                    <p className={`text-[11px] mt-0.5 leading-relaxed font-medium ${isLight ? 'text-[#475569]' : 'text-neutral-400'}`}>
                      {step.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Features */}
          <div className="space-y-2">
            <h4 className={`text-[11px] font-bold uppercase tracking-wider ${isLight ? 'text-[#334155]' : 'text-neutral-400'}`}>
              Key Features
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentTab.keyFeatures.map((feat, idx) => (
                <div
                  key={idx}
                  className={`border rounded-xl p-2.5 ${
                    isLight
                      ? 'bg-white/80 backdrop-blur-md border-[#EEF2F6]'
                      : 'bg-neutral-900/30 border-neutral-800/60'
                  }`}
                >
                  <div className={`text-xs font-semibold flex items-center gap-1.5 ${isLight ? 'text-[#1A2238]' : 'text-white'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isLight ? 'bg-[#FF5B45]' : 'bg-rose-500'}`} />
                    <span>{feat.title}</span>
                  </div>
                  <p className={`text-[11px] mt-1 leading-relaxed ${isLight ? 'text-[#5F6D7E]' : 'text-neutral-400'}`}>
                    {feat.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Tip */}
          <div
            className={`border rounded-xl p-3 flex items-start gap-2.5 ${
              isLight
                ? 'bg-[#FFF7F5] border-[#FFE5DF]'
                : 'bg-red-950/20 border-red-500/20'
            }`}
          >
            <span className="text-base shrink-0">💡</span>
            <div>
              <span
                className={`text-[11px] font-bold uppercase tracking-wide ${
                  isLight ? 'text-[#FF5B45]' : 'text-rose-300'
                }`}
              >
                Lifter Pro Tip
              </span>
              <p className={`text-[11px] mt-0.5 leading-relaxed ${isLight ? 'text-[#5F6D7E]' : 'text-neutral-300'}`}>
                {currentTab.proTip}
              </p>
            </div>
          </div>
        </div>

        {/* Mobile-Friendly Full-Width Bottom Action */}
        <div
          className={`p-3 sm:p-3.5 border-t shrink-0 ${
            isLight
              ? 'bg-white border-[#EEF2F6]'
              : 'bg-neutral-950 border-neutral-800/80'
          }`}
        >
          <button
            type="button"
            onClick={closeHelp}
            className={`w-full py-2.5 font-bold text-xs rounded-xl border transition-colors cursor-pointer ${
              isLight
                ? 'bg-[#F1F4F9] hover:bg-[#E5EBF4] text-[#1A2238] border-[#E2E8F0]'
                : 'bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-700 text-neutral-200 border-white/10'
            }`}
          >
            Got it, close guide
          </button>
        </div>
      </div>
    </div>
  );
}

export function SectionHelpButton({
  tab,
  title = 'How it works',
  className = '',
}: {
  tab: HelpTabId;
  title?: string;
  className?: string;
}) {
  const { openHelp } = useHelp();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <button
      type="button"
      onClick={() => openHelp(tab)}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-sm ${
        isLight
          ? 'bg-[#F1F4F9] hover:bg-[#E5EBF4] text-[#1A2238] border border-[#E2E8F0]'
          : 'bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-red-500/30 hover:border-red-500/60'
      } ${className}`}
      title={`Open ${title} Guide`}
    >
      <span
        className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
          isLight
            ? 'bg-[#FFF0ED] border border-[#FF5B45]/40 text-[#FF5B45]'
            : 'bg-red-600/30 border border-red-500/50 text-rose-300'
        }`}
      >
        ?
      </span>
      <span>{title}</span>
    </button>
  );
}
