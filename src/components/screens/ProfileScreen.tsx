import React, { useState } from 'react';
import { 
  Camera, 
  ChevronRight, 
  Globe, 
  Clock, 
  DollarSign, 
  Sparkles, 
  Settings, 
  ShieldCheck, 
  Check, 
  X, 
  Upload, 
  Trash2,
  AlertCircle
} from 'lucide-react';
import { UserProfile } from '../../types';
import { Avatar } from '../common/Avatar';

interface ProfileScreenProps {
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onOpenPlanUsage: () => void;
  onOpenSettings: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  onUpdateProfile,
  onOpenPlanUsage,
  onOpenSettings,
}) => {
  const [isPhotoSheetOpen, setIsPhotoSheetOpen] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

  // Pickers modal states
  const [activePicker, setActivePicker] = useState<'currency' | 'timezone' | 'locale' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const currencies = [
    { code: 'USD ($)', name: 'United States Dollar' },
    { code: 'EUR (€)', name: 'Euro' },
    { code: 'AZN (₼)', name: 'Azerbaijani Manat' },
    { code: 'GBP (£)', name: 'British Pound' },
    { code: 'CAD ($)', name: 'Canadian Dollar' },
    { code: 'AUD ($)', name: 'Australian Dollar' },
    { code: 'JPY (¥)', name: 'Japanese Yen' },
    { code: 'CHF (Fr)', name: 'Swiss Franc' },
    { code: 'TRY (₺)', name: 'Turkish Lira' },
  ];

  const timezones = [
    { code: 'Asia/Baku (GMT+4)', name: 'Azerbaijan Standard Time' },
    { code: 'America/New_York (EST)', name: 'Eastern Standard Time' },
    { code: 'Europe/London (GMT+0)', name: 'Greenwich Mean Time' },
    { code: 'Europe/Paris (CET)', name: 'Central European Time' },
    { code: 'Asia/Dubai (GMT+4)', name: 'Gulf Standard Time' },
    { code: 'Asia/Tokyo (JST)', name: 'Japan Standard Time' },
    { code: 'America/Los_Angeles (PST)', name: 'Pacific Standard Time' },
  ];

  const locales = [
    { code: 'en-US (English United States)', name: 'United States' },
    { code: 'az-AZ (Azərbaycan)', name: 'Azerbaijan' },
    { code: 'en-GB (English United Kingdom)', name: 'United Kingdom' },
    { code: 'fr-FR (Français)', name: 'France' },
    { code: 'de-DE (Deutsch)', name: 'Germany' },
    { code: 'es-ES (Español)', name: 'Spain' },
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Photos must be under 5MB');
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setPhotoError('Only JPEG, PNG, and WebP photos are supported');
      return;
    }

    const url = URL.createObjectURL(file);
    onUpdateProfile({ avatarUrl: url });
    setIsPhotoSheetOpen(false);
  };

  const handleRemovePhoto = () => {
    onUpdateProfile({ avatarUrl: undefined });
    setIsPhotoSheetOpen(false);
  };

  return (
    <div className="space-y-4 px-4 pb-24 pt-1 animate-in fade-in duration-300">
      {/* Profile Header Card */}
      <div className="p-5 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/70 text-center relative shadow-sm">
        <div className="relative inline-block mx-auto mb-3">
          <Avatar
            src={profile.avatarUrl}
            name={profile.name}
            initials={profile.initials}
            size="xl"
          />
          <button
            onClick={() => setIsPhotoSheetOpen(true)}
            id="btn-edit-avatar"
            className="absolute bottom-0 right-0 p-2 rounded-full bg-[#6552FF] text-white shadow-md active:scale-95 transition-transform"
            aria-label="Change photo"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>

        <h1 className="text-lg font-bold text-neutral-900 dark:text-white">
          {profile.name}
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {profile.email}
        </p>

        {/* Plan Pill */}
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-900/40 text-xs font-bold text-[#6552FF] dark:text-indigo-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Free Plan ({profile.groupsUsed}/{profile.groupsLimit} groups)</span>
        </div>
      </div>

      {/* Account Info Section */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Account Information
        </h2>

        <div className="p-4 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/70 space-y-3 shadow-sm">
          {/* Display Name */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              Display Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => onUpdateProfile({ name: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-700/40 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-900 dark:text-white"
            />
          </div>

          {/* Read Only Email with caption */}
          <div className="space-y-1 pt-1 border-t border-neutral-100 dark:border-neutral-700/60">
            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              Email Address
            </label>
            <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-700/40 border border-neutral-200 dark:border-neutral-700 flex items-center justify-between text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              <span>{profile.email}</span>
              <span className="text-[10px] font-medium text-neutral-400">Read-only</span>
            </div>
            <p className="text-[10px] text-neutral-400 italic">
              Contact support to change your email
            </p>
          </div>
        </div>
      </div>

      {/* Preferences Section (Searchable Pickers) */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Regional Preferences
        </h2>

        <div className="divide-y divide-neutral-100 dark:divide-neutral-700/60 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/70 overflow-hidden shadow-sm">
          {/* Currency */}
          <button
            onClick={() => setActivePicker('currency')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-[#6552FF] flex items-center justify-center">
                <DollarSign className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                  Primary Currency
                </span>
                <span className="text-[11px] text-neutral-500">
                  {profile.currency}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </button>

          {/* Timezone */}
          <button
            onClick={() => setActivePicker('timezone')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                <Clock className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                  Timezone
                </span>
                <span className="text-[11px] text-neutral-500">
                  {profile.timezone}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </button>

          {/* Locale */}
          <button
            onClick={() => setActivePicker('locale')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
                <Globe className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                  Language & Locale
                </span>
                <span className="text-[11px] text-neutral-500">
                  {profile.locale}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </button>
        </div>
      </div>

      {/* Plan & Settings Navigation */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Management
        </h2>

        <div className="divide-y divide-neutral-100 dark:divide-neutral-700/60 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/70 overflow-hidden shadow-sm">
          <button
            onClick={onOpenPlanUsage}
            className="w-full p-3.5 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                  Plan & Usage
                </span>
                <span className="text-[11px] text-neutral-500">
                  3 of 3 groups used • Free
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </button>

          <button
            onClick={onOpenSettings}
            className="w-full p-3.5 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 flex items-center justify-center">
                <Settings className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                  Settings & Security
                </span>
                <span className="text-[11px] text-neutral-500">
                  Password, Privacy & Terms
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </button>
        </div>
      </div>

      {/* Avatar Photo Bottom Sheet */}
      {isPhotoSheetOpen && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full bg-white dark:bg-neutral-800 rounded-t-3xl p-5 shadow-2xl border-t border-neutral-200 dark:border-neutral-700 max-h-[85%] overflow-y-auto animate-in slide-in-from-bottom-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-700">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Profile Photo
              </h3>
              <button
                onClick={() => setIsPhotoSheetOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {photoError && (
              <div className="mt-3 p-3 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 flex items-center gap-2 text-xs font-semibold text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{photoError}</span>
              </div>
            )}

            <div className="mt-4 space-y-2">
              <label className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-700/40 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer transition-colors text-xs font-bold text-neutral-900 dark:text-white">
                <Camera className="w-4 h-4 text-[#6552FF]" />
                <span>Take Photo</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  capture="environment"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </label>

              <label className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-700/40 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer transition-colors text-xs font-bold text-neutral-900 dark:text-white">
                <Upload className="w-4 h-4 text-[#6552FF]" />
                <span>Choose from Library</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </label>

              {profile.avatarUrl && (
                <button
                  onClick={handleRemovePhoto}
                  className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/20 hover:bg-red-100 text-xs font-bold text-red-600 dark:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remove Photo</span>
                </button>
              )}
            </div>

            <p className="text-[10px] text-neutral-400 text-center mt-3">
              Supported: JPEG, PNG, WebP (Max 5MB)
            </p>
          </div>
        </div>
      )}

      {/* Searchable Pickers Modal */}
      {activePicker && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-h-[85%] bg-white dark:bg-neutral-800 rounded-t-3xl p-5 shadow-2xl border-t border-neutral-200 dark:border-neutral-700 flex flex-col animate-in slide-in-from-bottom-5 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-700">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white capitalize">
                Select {activePicker}
              </h3>
              <button
                onClick={() => {
                  setActivePicker(null);
                  setSearchQuery('');
                }}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${activePicker}...`}
                className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6552FF]/30"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 no-scrollbar">
              {(activePicker === 'currency'
                ? currencies
                : activePicker === 'timezone'
                ? timezones
                : locales
              )
                .filter((item) =>
                  item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.code.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((item) => (
                  <button
                    key={item.code}
                    onClick={() => {
                      onUpdateProfile({ [activePicker!]: item.code });
                      setActivePicker(null);
                      setSearchQuery('');
                    }}
                    className="w-full p-2.5 rounded-xl flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-700 text-left transition-colors"
                  >
                    <div>
                      <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                        {item.code}
                      </span>
                      <span className="text-[11px] text-neutral-500">
                        {item.name}
                      </span>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
