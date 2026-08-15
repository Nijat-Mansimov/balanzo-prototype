import React from 'react';
import { 
  Sparkles, 
  Layers, 
  Eye, 
  Smartphone, 
  Compass, 
  Check, 
  Divide, 
  DollarSign, 
  Percent, 
  PieChart,
  ArrowUpRight,
  ArrowDownLeft,
  Zap,
  Receipt,
  Utensils,
  Car,
  Building,
  CheckCircle2
} from 'lucide-react';
import { Avatar } from './common/Avatar';
import { AvatarStack } from './common/AvatarStack';
import { INITIAL_GROUPS, MOCK_MEMBERS } from '../data/mockData';

interface DesignGalleryViewProps {
  onSwitchToInteractive: (initialScreen?: string) => void;
  isDark: boolean;
}

export const DesignGalleryView: React.FC<DesignGalleryViewProps> = ({
  onSwitchToInteractive,
  isDark,
}) => {
  const bakuGroup = INITIAL_GROUPS[0];

  return (
    <div className="w-full min-h-screen py-10 px-4 md:px-8 bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans">
      {/* Gallery Header */}
      <div className="max-w-7xl mx-auto mb-10 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6552FF]/10 dark:bg-[#6552FF]/20 border border-[#6552FF]/30 text-xs font-bold text-[#6552FF] dark:text-indigo-300">
          <Sparkles className="w-4 h-4" />
          <span>BALANZO 2026 MOBILE UI/UX SYSTEM</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-neutral-900 dark:text-white">
          Warm Precision Design System
        </h1>
        <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          "Split expenses. Not friendships." — A contemporary, restrained, and expressive consumer mobile interface combining high-precision financial clarity with warm travel and social identities.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onSwitchToInteractive('home')}
            className="px-5 py-2.5 rounded-full bg-[#6552FF] hover:bg-[#513EE8] text-white text-xs font-bold shadow-lg shadow-[#6552FF]/30 active:scale-95 transition-all flex items-center gap-2"
          >
            <Smartphone className="w-4 h-4" />
            <span>Open Live Interactive Simulator</span>
          </button>
        </div>
      </div>

      {/* 10 Core Screens Showcase Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-16">
        
        {/* SCREEN 1: HOME */}
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-2 uppercase tracking-wider">
            01 • Home Dashboard
          </span>
          <div className="w-[320px] h-[640px] rounded-[44px] bg-neutral-100 dark:bg-neutral-900 border-[6px] border-neutral-800 dark:border-neutral-700 shadow-2xl overflow-hidden relative flex flex-col scale-100 transform origin-top hover:scale-[1.02] transition-transform">
            {/* Status bar */}
            <div className="h-10 px-6 pt-3 flex justify-between items-center text-[11px] font-bold text-neutral-800 dark:text-neutral-200">
              <span>9:41</span>
              <div className="w-20 h-4 bg-black rounded-full mx-auto" />
              <span>5G 100%</span>
            </div>

            {/* Header */}
            <div className="px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar name="Nijat Mansimov" size="xs" />
                <span className="text-xs font-bold">Personal</span>
              </div>
              <div className="w-2 h-2 rounded-full bg-[#6552FF]" />
            </div>

            {/* Content preview */}
            <div className="p-3 space-y-3 flex-1 overflow-hidden">
              {/* Financial Hero */}
              <div className="p-3 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-2">
                <span className="text-[10px] text-neutral-400 font-bold uppercase">Balance</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-[#9C5317]">
                    <span className="text-[9px] block">You owe</span>
                    <strong className="text-sm tabular-nums">$86.40</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-[#16A34A]">
                    <span className="text-[9px] block">Owed to you</span>
                    <strong className="text-sm tabular-nums">$120.00</strong>
                  </div>
                </div>
              </div>

              {/* Flagship Baku Card */}
              <div className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
                <div className="h-20 bg-indigo-600 relative p-2 text-white">
                  <span className="text-[9px] bg-black/40 px-2 py-0.5 rounded-full">Baku, Azerbaijan</span>
                  <p className="text-xs font-bold mt-4">Trip to Baku</p>
                </div>
                <div className="p-2 flex justify-between items-center text-[10px]">
                  <span>4 members</span>
                  <strong className="text-[#16A34A] font-bold">+$33.60</strong>
                </div>
              </div>

              {/* Recent item */}
              <div className="p-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex justify-between text-xs">
                <div>
                  <p className="font-bold">Dinner at Port Cafe</p>
                  <p className="text-[10px] text-neutral-400">You paid</p>
                </div>
                <strong className="tabular-nums">$97.20</strong>
              </div>
            </div>

            {/* Bottom Nav */}
            <div className="h-12 bg-white/90 dark:bg-neutral-800/90 border-t border-neutral-200 dark:border-neutral-700 flex items-center justify-around text-[#6552FF]">
              <span className="text-[9px] font-bold">Home</span>
              <span className="text-[9px] text-neutral-400">Groups</span>
              <div className="w-7 h-7 rounded-xl bg-[#6552FF] text-white flex items-center justify-center font-bold text-xs">+</div>
              <span className="text-[9px] text-neutral-400">Friends</span>
              <span className="text-[9px] text-neutral-400">Profile</span>
            </div>
          </div>
        </div>

        {/* SCREEN 2: GROUPS */}
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-2 uppercase tracking-wider">
            02 • Groups Hub
          </span>
          <div className="w-[320px] h-[640px] rounded-[44px] bg-neutral-100 dark:bg-neutral-900 border-[6px] border-neutral-800 dark:border-neutral-700 shadow-2xl overflow-hidden relative flex flex-col scale-100 transform origin-top hover:scale-[1.02] transition-transform">
            <div className="h-10 px-6 pt-3 flex justify-between items-center text-[11px] font-bold text-neutral-800 dark:text-neutral-200">
              <span>9:41</span>
              <div className="w-20 h-4 bg-black rounded-full mx-auto" />
              <span>5G 100%</span>
            </div>

            <div className="p-3 space-y-3 flex-1 overflow-hidden">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-extrabold">Groups</h2>
                <span className="text-[10px] bg-[#6552FF] text-white px-2 py-0.5 rounded-full font-bold">+ New</span>
              </div>

              {/* Segmented control */}
              <div className="flex p-0.5 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-[10px] font-bold">
                <span className="flex-1 py-1 bg-white dark:bg-neutral-700 rounded-lg text-center">All</span>
                <span className="flex-1 py-1 text-center text-neutral-400">Trips</span>
                <span className="flex-1 py-1 text-center text-neutral-400">Home</span>
              </div>

              {/* Baku */}
              <div className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
                <div className="h-20 bg-indigo-600 p-2 text-white">
                  <span className="text-[9px] bg-black/40 px-2 py-0.5 rounded-full">Baku, Azerbaijan</span>
                  <p className="text-xs font-bold mt-4">Trip to Baku</p>
                </div>
                <div className="p-2 flex justify-between items-center text-[10px]">
                  <span>4 members</span>
                  <strong className="text-[#16A34A]">+$33.60</strong>
                </div>
              </div>

              {/* Thailand */}
              <div className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
                <div className="h-20 bg-emerald-600 p-2 text-white">
                  <span className="text-[9px] bg-black/40 px-2 py-0.5 rounded-full">Phuket & Bangkok</span>
                  <p className="text-xs font-bold mt-4">Thailand 2024</p>
                </div>
                <div className="p-2 flex justify-between items-center text-[10px]">
                  <span>4 members</span>
                  <strong className="text-[#16A34A]">+$86.40</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SCREEN 3: GROUP DETAIL */}
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-2 uppercase tracking-wider">
            03 • Group Destination Hub
          </span>
          <div className="w-[320px] h-[640px] rounded-[44px] bg-neutral-100 dark:bg-neutral-900 border-[6px] border-neutral-800 dark:border-neutral-700 shadow-2xl overflow-hidden relative flex flex-col scale-100 transform origin-top hover:scale-[1.02] transition-transform">
            <div className="h-28 bg-neutral-900 relative p-3 text-white">
              <span className="text-[9px] bg-black/50 px-2 py-0.5 rounded-full">Baku, Azerbaijan</span>
              <h2 className="text-base font-extrabold mt-6">Trip to Baku</h2>
              <p className="text-[10px] text-white/70">Aug 10 - Aug 16 • $737.50 total</p>
            </div>

            <div className="p-3 space-y-2 flex-1 overflow-hidden">
              <div className="grid grid-cols-3 gap-1.5 text-center">
                <div className="p-1.5 rounded-xl bg-white dark:bg-neutral-800 border text-[9px]">
                  <span className="text-neutral-400 block">Balance</span>
                  <strong className="text-[#16A34A]">+$33.60</strong>
                </div>
                <div className="p-1.5 rounded-xl bg-white dark:bg-neutral-800 border text-[9px]">
                  <span className="text-neutral-400 block">Spent</span>
                  <strong>$176.62</strong>
                </div>
                <div className="p-1.5 rounded-xl bg-white dark:bg-neutral-800 border text-[9px]">
                  <span className="text-neutral-400 block">Settled</span>
                  <strong>$120.00</strong>
                </div>
              </div>

              {/* Expense Rows */}
              <div className="space-y-1.5 pt-1">
                <div className="p-2 rounded-xl bg-white dark:bg-neutral-800 border flex justify-between text-xs">
                  <div>
                    <p className="font-bold text-[11px]">Dinner at Port Cafe</p>
                    <p className="text-[9px] text-neutral-400">You paid • Aug 14</p>
                  </div>
                  <strong className="text-[11px]">$97.20</strong>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-neutral-800 border flex justify-between text-xs">
                  <div>
                    <p className="font-bold text-[11px]">Airport transfer</p>
                    <p className="text-[9px] text-neutral-400">Arif paid • Aug 13</p>
                  </div>
                  <strong className="text-[11px]">$45.00</strong>
                </div>
              </div>
            </div>

            <div className="p-3 bg-white dark:bg-neutral-800 border-t flex gap-2">
              <button className="flex-1 py-2 bg-[#6552FF] text-white rounded-xl text-xs font-bold">+ Add Expense</button>
              <button className="py-2 px-3 border rounded-xl text-xs font-bold">Settle</button>
            </div>
          </div>
        </div>

        {/* SCREEN 4: ADD EXPENSE - BASICS */}
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-2 uppercase tracking-wider">
            04 • Add Expense (Basics)
          </span>
          <div className="w-[320px] h-[640px] rounded-[44px] bg-white dark:bg-neutral-900 border-[6px] border-neutral-800 dark:border-neutral-700 shadow-2xl overflow-hidden relative flex flex-col scale-100 transform origin-top hover:scale-[1.02] transition-transform">
            <div className="h-10 px-6 pt-3 flex justify-between items-center text-[11px] font-bold">
              <span>Step 1 of 3</span>
              <div className="w-20 h-4 bg-black rounded-full mx-auto" />
              <span className="text-neutral-400">Cancel</span>
            </div>

            <div className="p-4 space-y-3 flex-1">
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800 text-center">
                <span className="text-[9px] text-neutral-400 uppercase font-bold">Total Amount</span>
                <div className="text-3xl font-black tracking-tight mt-1 text-neutral-900 dark:text-white">$97.20</div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold">Expense Title</label>
                <div className="p-2.5 rounded-xl border text-xs font-semibold">Dinner at Port Cafe</div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold">Paid By</label>
                <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                  <div className="p-2 border border-[#6552FF] rounded-xl font-bold bg-[#6552FF]/5">Nijat (You)</div>
                  <div className="p-2 border rounded-xl">Arif</div>
                </div>
              </div>
            </div>

            <div className="p-3 border-t">
              <button className="w-full py-2.5 bg-[#6552FF] text-white rounded-xl text-xs font-bold">Continue to Split Method →</button>
            </div>
          </div>
        </div>

        {/* SCREEN 5: SPLIT METHOD */}
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-2 uppercase tracking-wider">
            05 • Split Method Selection
          </span>
          <div className="w-[320px] h-[640px] rounded-[44px] bg-white dark:bg-neutral-900 border-[6px] border-neutral-800 dark:border-neutral-700 shadow-2xl overflow-hidden relative flex flex-col scale-100 transform origin-top hover:scale-[1.02] transition-transform">
            <div className="h-10 px-6 pt-3 flex justify-between items-center text-[11px] font-bold">
              <span>Step 2 of 3</span>
              <div className="w-20 h-4 bg-black rounded-full mx-auto" />
              <span className="text-neutral-400">Cancel</span>
            </div>

            <div className="p-4 space-y-2.5 flex-1">
              <h3 className="text-xs font-bold">Choose Split Method</h3>

              {/* 4 Tiles */}
              <div className="p-3 border border-[#6552FF] rounded-2xl bg-[#6552FF]/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#6552FF] text-white flex items-center justify-center font-bold">÷</div>
                  <div>
                    <strong className="block text-[11px]">Equal split</strong>
                    <span className="text-[9px] text-neutral-400">$24.30 each (4 people)</span>
                  </div>
                </div>
                <Check className="w-4 h-4 text-[#6552FF]" />
              </div>

              <div className="p-3 border rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">$</div>
                  <div>
                    <strong className="block text-[11px]">Custom amounts</strong>
                    <span className="text-[9px] text-neutral-400">Set amounts manually</span>
                  </div>
                </div>
              </div>

              <div className="p-3 border rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold">%</div>
                  <div>
                    <strong className="block text-[11px]">By percentage</strong>
                    <span className="text-[9px] text-neutral-400">Split by % (100% total)</span>
                  </div>
                </div>
              </div>

              <div className="p-3 border rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold">◴</div>
                  <div>
                    <strong className="block text-[11px]">By shares</strong>
                    <span className="text-[9px] text-neutral-400">Proportional units</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 border-t">
              <button className="w-full py-2.5 bg-[#6552FF] text-white rounded-xl text-xs font-bold">Review & Confirm →</button>
            </div>
          </div>
        </div>

        {/* SCREEN 6: REVIEW EXPENSE */}
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-2 uppercase tracking-wider">
            06 • Review & Audit
          </span>
          <div className="w-[320px] h-[640px] rounded-[44px] bg-white dark:bg-neutral-900 border-[6px] border-neutral-800 dark:border-neutral-700 shadow-2xl overflow-hidden relative flex flex-col scale-100 transform origin-top hover:scale-[1.02] transition-transform">
            <div className="h-10 px-6 pt-3 flex justify-between items-center text-[11px] font-bold">
              <span>Step 3 of 3</span>
              <div className="w-20 h-4 bg-black rounded-full mx-auto" />
              <span className="text-neutral-400">Cancel</span>
            </div>

            <div className="p-3 space-y-2.5 flex-1">
              <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border">
                <div className="flex justify-between items-center pb-2 border-b">
                  <div>
                    <p className="text-[10px] text-neutral-400">Trip to Baku</p>
                    <strong className="text-xs">Dinner at Port Cafe</strong>
                  </div>
                  <strong className="text-sm">$97.20</strong>
                </div>

                <div className="space-y-1.5 pt-2 text-[11px]">
                  <div className="flex justify-between">
                    <span>You</span>
                    <strong className="tabular-nums">$24.30</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Arif</span>
                    <strong className="tabular-nums">$24.30</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Leyla</span>
                    <strong className="tabular-nums">$24.30</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Samir</span>
                    <strong className="tabular-nums">$24.30</strong>
                  </div>
                </div>

                <div className="mt-2 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 text-[10px] font-bold flex justify-between">
                  <span>TOTAL = SUM OF SHARES</span>
                  <span>$97.20</span>
                </div>
              </div>
            </div>

            <div className="p-3 border-t">
              <button className="w-full py-2.5 bg-[#6552FF] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1">
                <Check className="w-4 h-4" /> Add Expense
              </button>
            </div>
          </div>
        </div>

        {/* SCREEN 7: SUCCESS COMPLETION */}
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-2 uppercase tracking-wider">
            07 • Success Completion
          </span>
          <div className="w-[320px] h-[640px] rounded-[44px] bg-white dark:bg-neutral-900 border-[6px] border-neutral-800 dark:border-neutral-700 shadow-2xl overflow-hidden relative flex flex-col scale-100 transform origin-top hover:scale-[1.02] transition-transform justify-center items-center p-5 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center mb-3">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <span className="text-[10px] uppercase font-bold text-emerald-600">Expense Recorded</span>
            <h3 className="text-lg font-black mt-1">Dinner at Port Cafe</h3>
            <div className="text-2xl font-black tabular-nums mt-1">$97.20</div>
            <p className="text-[11px] text-neutral-400 mt-1">Paid by Nijat • Trip to Baku</p>

            <button className="w-full mt-6 py-2.5 bg-[#6552FF] text-white rounded-xl text-xs font-bold">Back to Group</button>
          </div>
        </div>

        {/* SCREEN 8: BALANCES */}
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-2 uppercase tracking-wider">
            08 • Pairwise Balances
          </span>
          <div className="w-[320px] h-[640px] rounded-[44px] bg-neutral-100 dark:bg-neutral-900 border-[6px] border-neutral-800 dark:border-neutral-700 shadow-2xl overflow-hidden relative flex flex-col scale-100 transform origin-top hover:scale-[1.02] transition-transform">
            <div className="h-10 px-6 pt-3 flex justify-between items-center text-[11px] font-bold">
              <span>9:41</span>
              <div className="w-20 h-4 bg-black rounded-full mx-auto" />
              <span>5G 100%</span>
            </div>

            <div className="p-3 space-y-2.5 flex-1">
              <h2 className="text-sm font-extrabold">Balances</h2>

              <div className="space-y-1.5">
                <span className="text-[10px] text-neutral-400 font-bold uppercase">You Owe</span>
                <div className="p-2.5 rounded-2xl bg-white dark:bg-neutral-800 border flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <Avatar name="Arif Mammadov" size="xs" />
                    <div>
                      <strong className="block text-[11px]">Arif Mammadov</strong>
                      <span className="text-[9px] text-neutral-400">Summer Weekend</span>
                    </div>
                  </div>
                  <strong className="text-[#9C5317] tabular-nums">$24.30</strong>
                </div>

                <span className="text-[10px] text-neutral-400 font-bold uppercase mt-2 block">Owed to You</span>
                <div className="p-2.5 rounded-2xl bg-white dark:bg-neutral-800 border flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <Avatar name="Leyla Aliyeva" size="xs" />
                    <div>
                      <strong className="block text-[11px]">Leyla Aliyeva</strong>
                      <span className="text-[9px] text-neutral-400">Trip to Baku</span>
                    </div>
                  </div>
                  <strong className="text-[#16A34A] tabular-nums">$18.00</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SCREEN 9: SETTLEMENT */}
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-2 uppercase tracking-wider">
            09 • Record Settlement
          </span>
          <div className="w-[320px] h-[640px] rounded-[44px] bg-white dark:bg-neutral-900 border-[6px] border-neutral-800 dark:border-neutral-700 shadow-2xl overflow-hidden relative flex flex-col scale-100 transform origin-top hover:scale-[1.02] transition-transform">
            <div className="h-10 px-6 pt-3 flex justify-between items-center text-[11px] font-bold">
              <span>Record Settlement</span>
              <div className="w-20 h-4 bg-black rounded-full mx-auto" />
              <span className="text-neutral-400">Cancel</span>
            </div>

            <div className="p-3 space-y-3 flex-1">
              <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800 text-center">
                <span className="text-[9px] text-neutral-400 uppercase font-bold">Amount</span>
                <div className="text-3xl font-black mt-1">$24.30</div>
              </div>

              <div className="p-2.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border text-xs space-y-1">
                <span className="text-[10px] text-neutral-400">Payer → Recipient</span>
                <p className="font-bold">Nijat (You) → Arif Mammadov</p>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border text-[10px] text-emerald-800 dark:text-emerald-300">
                <strong>Balanzo records who owes whom.</strong> It never moves money directly.
              </div>
            </div>

            <div className="p-3 border-t">
              <button className="w-full py-2.5 bg-[#6552FF] text-white rounded-xl text-xs font-bold">Confirm Record Settlement</button>
            </div>
          </div>
        </div>

        {/* SCREEN 10: PLAN & USAGE */}
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-2 uppercase tracking-wider">
            10 • Plan & Usage
          </span>
          <div className="w-[320px] h-[640px] rounded-[44px] bg-neutral-100 dark:bg-neutral-900 border-[6px] border-neutral-800 dark:border-neutral-700 shadow-2xl overflow-hidden relative flex flex-col scale-100 transform origin-top hover:scale-[1.02] transition-transform">
            <div className="h-10 px-6 pt-3 flex justify-between items-center text-[11px] font-bold">
              <span>Plan & Usage</span>
              <div className="w-20 h-4 bg-black rounded-full mx-auto" />
              <span className="text-neutral-400">Back</span>
            </div>

            <div className="p-3 space-y-2.5 flex-1">
              <div className="p-3 rounded-2xl bg-white dark:bg-neutral-800 border">
                <div className="flex justify-between text-xs font-bold">
                  <span>Free Plan</span>
                  <span className="text-[#9C5317]">3 / 3 used</span>
                </div>
                <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full mt-2 overflow-hidden">
                  <div className="w-full h-full bg-[#9C5317]" />
                </div>
              </div>

              <div className="p-3 rounded-2xl border-2 border-[#6552FF]/30 bg-white dark:bg-neutral-800 text-xs space-y-1">
                <strong className="text-[#6552FF]">Premium Upgrade</strong>
                <p className="text-sm font-black">$4.99 / mo</p>
                <p className="text-[10px] text-neutral-400">Unlimited groups & receipt OCR</p>
                <button className="w-full mt-2 py-1.5 bg-neutral-100 dark:bg-neutral-700 text-neutral-400 rounded-xl text-[10px] font-bold">Coming soon to app</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
