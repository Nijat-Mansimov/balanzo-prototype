import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Layers, 
  Sun, 
  Moon, 
  RotateCcw, 
  Wifi, 
  Signal, 
  Battery, 
  ChevronDown,
  Sparkles,
  Info,
  Globe
} from 'lucide-react';
import { ScreenView, ActiveTab } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface MobileFrameProps {
  children: React.ReactNode;
  currentScreen: ScreenView;
  onNavigate: (screen: ScreenView) => void;
  onResetData: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isGalleryMode: boolean;
  onToggleGalleryMode: () => void;
  onOpenLanguageModal?: () => void;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  currentScreen,
  onNavigate,
  onResetData,
  isDarkMode,
  onToggleDarkMode,
  isGalleryMode,
  onToggleGalleryMode,
  onOpenLanguageModal,
}) => {
  const [time, setTime] = useState('9:41');
  const { language, setLanguage, languages, currentLanguageOption } = useLanguage();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-[#0F0E17]' : 'bg-[#F4F3F8]'}`}>
      {/* Top Floating Control Bar */}
      <nav className="sticky top-0 z-40 px-4 py-2.5 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-200/80 dark:border-neutral-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
        {/* Brand logo & tagline */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6552FF] to-indigo-700 text-white flex items-center justify-center font-black text-sm shadow-md shadow-[#6552FF]/30">
            B
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black tracking-tight text-neutral-900 dark:text-white">
                BALANZO
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#6552FF]/10 text-[#6552FF] dark:text-indigo-300 font-bold border border-[#6552FF]/20">
                2026 UI System
              </span>
            </div>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium hidden sm:block">
              Split expenses. Not friendships.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Gallery / Interactive Toggle */}
          <div className="flex p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
            <button
              onClick={() => { if (isGalleryMode) onToggleGalleryMode(); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                !isGalleryMode
                  ? 'bg-white dark:bg-neutral-700 text-[#6552FF] dark:text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Phone Simulator</span>
            </button>
            <button
              onClick={() => { if (!isGalleryMode) onToggleGalleryMode(); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isGalleryMode
                  ? 'bg-white dark:bg-neutral-700 text-[#6552FF] dark:text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">10-Screen Showcase</span>
            </button>
          </div>

          {/* Quick Jump Dropdown */}
          {!isGalleryMode && (
            <select
              value={currentScreen.type}
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'group-detail') onNavigate({ type: 'group-detail', groupId: 'group-baku' });
                else onNavigate({ type: val as any });
              }}
              className="px-2.5 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#6552FF]/30 hidden md:block"
            >
              <option value="home">01 • Home Dashboard</option>
              <option value="groups">02 • Groups Hub</option>
              <option value="group-detail">03 • Group Destination Hub (Baku)</option>
              <option value="add-expense">04 • Add Expense Wizard</option>
              <option value="balances">05 • Pairwise Balances</option>
              <option value="settlement">06 • Record Settlement</option>
              <option value="friends">07 • Friends & Requests</option>
              <option value="notifications">08 • Global Notifications</option>
              <option value="profile">09 • Profile & Pickers</option>
              <option value="plan-usage">10 • Plan & Entitlement Usage</option>
              <option value="settings">11 • Settings & Security</option>
            </select>
          )}

          {/* Language Selector Dropdown */}
          <div className="relative flex items-center">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="pl-2 pr-6 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-bold text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#6552FF]/30 cursor-pointer appearance-none"
              title="Change application language"
              aria-label="Change language"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.nativeName}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2 pointer-events-none" />
          </div>

          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={onResetData}
            className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
            title="Reset demo data"
            aria-label="Reset demo data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Main Content Render */}
      {isGalleryMode ? (
        children
      ) : (
        <main className="flex justify-center items-start py-6 sm:py-10 px-2 sm:px-4 min-h-[calc(100vh-60px)]">
          {/* Realistic iPhone 16 Pro Hardware Shell */}
          <div className="relative w-full max-w-[400px] h-[850px] rounded-[52px] bg-black p-3.5 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.35)] ring-1 ring-neutral-800/80 dark:ring-neutral-700/80 select-none">
            {/* Outer Bezel buttons simulation */}
            <div className="absolute -left-[3px] top-28 w-[3px] h-10 bg-neutral-700 rounded-l-sm" />
            <div className="absolute -left-[3px] top-42 w-[3px] h-12 bg-neutral-700 rounded-l-sm" />
            <div className="absolute -left-[3px] top-58 w-[3px] h-12 bg-neutral-700 rounded-l-sm" />
            <div className="absolute -right-[3px] top-36 w-[3px] h-16 bg-neutral-700 rounded-r-sm" />

            {/* Inner Mobile Screen Canvas */}
            <div className="relative w-full h-full rounded-[42px] bg-neutral-100 dark:bg-neutral-900 overflow-hidden flex flex-col font-sans">
              {/* iOS Status Bar */}
              <div className="sticky top-0 z-40 h-11 px-7 pt-2 flex items-center justify-between text-[13px] font-bold tracking-tight text-neutral-900 dark:text-white bg-transparent pointer-events-none select-none">
                <span>{time}</span>

                {/* Dynamic Island */}
                <div className="w-28 h-6 bg-black rounded-full flex items-center justify-between px-2.5 mx-auto -mt-1 shadow-sm">
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
                  <div className="w-2 h-2 rounded-full bg-[#6552FF]/60 animate-pulse" />
                </div>

                <div className="flex items-center gap-1.5 text-neutral-800 dark:text-neutral-200">
                  <Signal className="w-3.5 h-3.5" />
                  <Wifi className="w-3.5 h-3.5" />
                  <Battery className="w-4 h-4 fill-current" />
                </div>
              </div>

              {/* Scrollable Screen Content */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar relative flex flex-col">
                {children}
              </div>

              {/* iOS Home Gesture Indicator Bar */}
              <div className="sticky bottom-0 left-0 right-0 h-4 bg-transparent flex items-center justify-center pointer-events-none z-40">
                <div className="w-32 h-1 rounded-full bg-neutral-900/40 dark:bg-white/40 mb-1" />
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};
