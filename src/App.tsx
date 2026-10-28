import { Routes, Route, NavLink, useLocation, Link } from 'react-router-dom';
import {
  ErrorBoundary,
  HomeIcon,
  CalendarIcon,
  DumbbellIcon,
  RecordsIcon,
  ReportsIcon,
  GoalsIcon,
  HelpCircleIcon,
  ArrowRightIcon,
  SunIcon,
  MoonIcon,
} from '@shared/components';

// Direct imports for instant, reliable view navigation without dynamic chunk stalls
import Dashboard from './features/dashboard';
import WeeklyPlanner from './features/planner';
import WorkoutLogger from './features/workout';
import RecordsPage from './features/records';
import ReportsPage from './features/reports';
import GoalsPage from './features/goals';
import { HelpProvider, useHelp, HelpCenterModal, HelpTabId } from './features/help';
import { ThemeProvider, useTheme } from './shared/theme';

const navItems = [
  { path: '/', icon: HomeIcon, label: 'Home' },
  { path: '/planner', icon: CalendarIcon, label: 'Planner' },
  { path: '/workout', icon: DumbbellIcon, label: 'Workout' },
  { path: '/records', icon: RecordsIcon, label: 'Records' },
  { path: '/reports', icon: ReportsIcon, label: 'Reports' },
  { path: '/goals', icon: GoalsIcon, label: 'Goals' },
];

function getTabFromPath(path: string): HelpTabId {
  if (path.startsWith('/planner')) return 'planner';
  if (path.startsWith('/workout')) return 'workout';
  if (path.startsWith('/records')) return 'records';
  if (path.startsWith('/reports')) return 'reports';
  if (path.startsWith('/goals')) return 'goals';
  return 'home';
}

function AppContent() {
  const { openHelp } = useHelp();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const handleOpenCurrentTabHelp = () => {
    openHelp(getTabFromPath(location.pathname));
  };

  return (
    <div className="min-h-screen text-white flex flex-col relative selection:bg-orange-600 selection:text-white font-sans antialiased transition-colors duration-200">
      {/* Background Responsive Media - Fitted for both Mobile and Desktop */}
      <div className="app-video-bg fixed inset-0 w-full h-full -z-20 overflow-hidden pointer-events-none transition-opacity duration-300 bg-[#050505]">
        {/* Layer 1: Ambient widescreen blur fill for desktop displays */}
        <video
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          className="hidden md:block absolute inset-0 w-full h-full object-cover filter blur-3xl opacity-35 scale-110 pointer-events-none"
        >
          <source src="/background.mp4" type="video/mp4" />
        </video>

        {/* Layer 2: Main video - fills mobile edge-to-edge; neatly framed and aspect-ratio preserved on desktop */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover md:object-contain md:max-w-4xl md:mx-auto transition-all"
        >
          <source src="/background.mp4" type="video/mp4" />
        </video>

        {/* Layer 3: Dark Atmospheric Overlay with smooth vignette on widescreen */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/75 md:bg-[radial-gradient(ellipse_at_center,transparent_35%,#050505_92%)] pointer-events-none" />
      </div>

      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-2xl border-b border-red-500/30 shadow-2xl transition-all duration-200">
        {/* Top Highlight Accent Line */}
        <div className="h-1 w-full bg-gradient-to-r from-red-700 via-rose-500 to-red-700 shadow-sm" style={{ background: 'var(--header-accent-gradient)' }} />

        <div className="max-w-4xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-3">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div
              className="brand-logo-badge keep-white-text w-8 h-8 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white shadow-md font-black text-sm tracking-wider group-hover:scale-105 transition-transform shrink-0"
              style={{
                background: theme === 'light' ? 'linear-gradient(135deg, #FF5B45 0%, #FF7854 100%)' : undefined,
                color: '#FFFFFF',
              }}
            >
              R
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`text-lg font-black tracking-tight transition-colors ${theme === 'light' ? 'text-[#1A2238]' : 'text-white'}`}>
                  REPS
                </span>
                <span
                  className="keep-white-text text-[9px] font-bold tracking-widest text-white px-2 py-0.5 rounded-full uppercase shadow-sm border border-transparent"
                  style={{
                    background: theme === 'light' ? 'linear-gradient(135deg, #FF5B45, #FF7854)' : undefined,
                    color: '#FFFFFF',
                  }}
                >
                  Pro
                </span>
              </div>
              <p className={`text-[10px] font-medium uppercase tracking-widest ${theme === 'light' ? 'text-[#475569]' : 'text-neutral-400'}`}>
                Performance Tracker
              </p>
            </div>
          </Link>

          {/* Desktop Navigation & Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Desktop Navigation Bar */}
            <nav
              className="desktop-nav-bar hidden md:flex items-center gap-1 rounded-2xl p-1 shadow-inner border transition-colors"
              style={
                theme === 'light'
                  ? { backgroundColor: '#F1F4F9', borderColor: '#E2E8F0' }
                  : { backgroundColor: 'rgba(23, 23, 23, 0.9)', borderColor: 'rgba(64, 64, 64, 0.8)' }
              }
            >
              {navItems.map(item => {
                const IconComponent = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wide transition-all ${
                        isActive
                          ? 'glass-tab-active'
                          : 'glass-tab-inactive'
                      }`
                    }
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            {/* Theme Toggle Button (Dark / Light) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-sm border"
              style={
                theme === 'light'
                  ? { backgroundColor: '#F1F4F9', borderColor: '#E2E8F0', color: '#1A2238' }
                  : { backgroundColor: 'rgba(23, 23, 23, 0.9)', borderColor: 'rgba(64, 64, 64, 0.8)', color: '#FFFFFF' }
              }
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <SunIcon className="w-4 h-4 text-amber-400" />
              ) : (
                <MoonIcon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Global Help Center Trigger Button */}
            <button
              type="button"
              onClick={handleOpenCurrentTabHelp}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl shadow-sm text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 border"
              style={
                theme === 'light'
                  ? { backgroundColor: '#F1F4F9', borderColor: '#E2E8F0', color: '#1A2238' }
                  : { backgroundColor: 'rgba(23, 23, 23, 0.95)', borderColor: 'rgba(239, 68, 68, 0.35)', color: '#FFFFFF' }
              }
              title="Open REPS Help Center & Tab Guide"
            >
              <div
                className="w-4 h-4 rounded-full border flex items-center justify-center text-[10px] font-black"
                style={
                  theme === 'light'
                    ? { backgroundColor: '#FFF0ED', borderColor: 'rgba(255, 91, 69, 0.35)', color: '#FF5B45' }
                    : { backgroundColor: 'rgba(220, 38, 38, 0.3)', borderColor: 'rgba(239, 68, 68, 0.5)', color: '#fca5a5' }
                }
              >
                ?
              </div>
              <span className="hidden sm:inline">Guide</span>
              <span className="sm:hidden">Help</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-3 sm:px-4 py-5 sm:py-7 pb-28 md:pb-12 relative z-10">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/planner" element={<WeeklyPlanner />} />
            <Route path="/workout" element={<WorkoutLogger />} />
            <Route path="/records" element={<RecordsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/goals" element={<GoalsPage />} />
          </Routes>
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-neutral-950/95 backdrop-blur-2xl border-t border-red-500/30 shadow-2xl relative z-20 pb-20 md:pb-8 pt-4 sm:pt-6 transition-colors duration-200">
        {/* Subtle Top Accent */}
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-red-600/60 to-transparent mb-4 sm:mb-6" style={{ background: theme === 'light' ? 'linear-gradient(to right, transparent, rgba(255, 91, 69, 0.35), transparent)' : undefined }} />

        <div className="max-w-4xl mx-auto px-4">
          {/* Desktop 2-Column Clean Layout */}
          <div className="hidden md:grid md:grid-cols-2 gap-8 pb-6 border-b border-neutral-800/80" style={{ borderBottomColor: theme === 'light' ? '#EEF2F6' : undefined }}>
            {/* Column 1: Brand & Slogan */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div
                  className="brand-logo-badge keep-white-text w-6 h-6 rounded-lg bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white font-black text-xs shadow-sm"
                  style={{
                    background: theme === 'light' ? 'linear-gradient(135deg, #FF5B45 0%, #FF7854 100%)' : undefined,
                    color: '#FFFFFF',
                  }}
                >
                  R
                </div>
                <span className={`text-base font-black tracking-tight ${theme === 'light' ? 'text-[#1A2238]' : 'text-white'}`}>REPS PRO</span>
                <span
                  className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border"
                  style={
                    theme === 'light'
                      ? { backgroundColor: '#FFF0ED', borderColor: 'rgba(255, 91, 69, 0.35)', color: '#FF5B45' }
                      : { backgroundColor: 'rgba(220, 38, 38, 0.3)', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#fca5a5' }
                  }
                >
                  v2.0
                </span>
              </div>
              <p className={`text-xs leading-relaxed max-w-sm font-medium ${theme === 'light' ? 'text-[#475569]' : 'text-neutral-400'}`}>
                High-Performance Workout Tracker &amp; Progressive Overload Engine. Designed for serious lifters to conquer strength targets.
              </p>
              <div
                className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg border font-semibold"
                style={
                  theme === 'light'
                    ? { backgroundColor: '#FFF0ED', borderColor: 'rgba(255, 91, 69, 0.25)', color: '#FF5B45' }
                    : { backgroundColor: 'rgba(23, 23, 23, 0.9)', borderColor: '#262626', color: '#a3a3a3' }
                }
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme === 'light' ? '#FF5B45' : '#22c55e' }} />
                <span>100% Offline &amp; Local Storage</span>
              </div>
            </div>

            {/* Column 2: Quick Tab Links */}
            <div>
              <div className={`text-xs font-black uppercase tracking-wider mb-2.5 ${theme === 'light' ? 'text-[#1A2238]' : 'text-neutral-300'}`}>
                Application Tabs
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {navItems.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="hover:opacity-80 transition-opacity py-0.5 flex items-center gap-1.5 font-medium"
                    style={{ color: theme === 'light' ? '#475569' : '#a3a3a3' }}
                  >
                    <item.icon className="w-3 h-3 text-red-500/70" style={theme === 'light' ? { color: '#FF5B45' } : undefined} />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Ultra-Compact Footer */}
          <div className="md:hidden flex flex-col items-center justify-center gap-1 py-1 text-center">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-300">
              <span
                className="brand-logo-badge keep-white-text w-4 h-4 rounded flex items-center justify-center text-white text-[9px] font-black shadow-xs"
                style={{
                  background: theme === 'light' ? 'linear-gradient(135deg, #FF5B45 0%, #FF7854 100%)' : '#dc2626',
                  color: '#FFFFFF',
                }}
              >
                R
              </span>
              <span className={theme === 'light' ? 'text-[#1A2238]' : 'text-white'}>REPS PRO v2.0</span>
              <span className={theme === 'light' ? 'text-slate-400' : 'text-neutral-600'}>&bull;</span>
              <span
                className="text-[10px] font-bold"
                style={{ color: theme === 'light' ? '#FF5B45' : '#4ade80' }}
              >
                Offline &amp; Local
              </span>
            </div>
            <p className={`text-[10px] font-medium ${theme === 'light' ? 'text-[#475569]' : 'text-neutral-500'}`}>
              Push your limits every session. Data saved in browser.
            </p>
          </div>

          {/* Desktop Bottom Line */}
          <div
            className="hidden md:flex pt-4 flex-row items-center justify-between text-[11px] font-medium"
            style={{ color: theme === 'light' ? '#475569' : '#a3a3a3' }}
          >
            <span>&copy; {new Date().getFullYear()} REPS Pro &bull; Push your limits every session.</span>
            <span>All workout data is kept safely in your local device browser.</span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Nav */}
      <nav className="mobile-bottom-nav md:hidden fixed bottom-0 left-0 right-0 bg-neutral-950/98 backdrop-blur-2xl border-t-2 border-red-600/60 shadow-[0_-10px_35px_rgba(0,0,0,0.95)] z-40 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-2 transition-colors duration-200">
        <div className="flex items-center justify-around px-2">
          {navItems.map(item => {
            const IconComponent = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 px-2.5 py-1.5 rounded-xl text-[10px] font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-b from-red-600/35 to-rose-700/25 border border-red-500/60 text-white shadow-md'
                      : 'text-neutral-400 hover:text-white'
                  }`
                }
                style={({ isActive }) =>
                  theme === 'light'
                    ? isActive
                      ? { background: 'linear-gradient(135deg, #FF5B45 0%, #FF7854 100%)', color: '#FFFFFF', borderColor: 'transparent' }
                      : { color: '#64748B' }
                    : undefined
                }
              >
                <IconComponent className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Global Interactive Help Center Modal */}
      <HelpCenterModal />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <HelpProvider>
        <AppContent />
      </HelpProvider>
    </ThemeProvider>
  );
}
