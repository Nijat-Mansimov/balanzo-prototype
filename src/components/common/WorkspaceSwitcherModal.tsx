import React from 'react';
import { Check, Building2, User, Plus, X, Sparkles } from 'lucide-react';
import { WorkspaceType } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

interface WorkspaceSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWorkspace: WorkspaceType;
  onSelectWorkspace: (workspace: WorkspaceType) => void;
  onCreateOrgClick: () => void;
}

export const WorkspaceSwitcherModal: React.FC<WorkspaceSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentWorkspace,
  onSelectWorkspace,
  onCreateOrgClick,
}) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  return (
    <div 
      className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs overscroll-contain animate-in fade-in duration-200 pointer-events-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full bg-white dark:bg-neutral-800 rounded-t-3xl p-5 shadow-2xl border-t border-neutral-200 dark:border-neutral-700 max-h-[85%] overflow-y-auto overscroll-contain animate-in slide-in-from-bottom-5 duration-200 pointer-events-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="workspace-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-700/60">
          <div>
            <h2 id="workspace-modal-title" className="text-base font-bold text-neutral-900 dark:text-white">
              {t('workspace.title', undefined, 'Workspaces')}
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {t('workspace.subtitle', undefined, 'Switch between personal & team spending')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-500"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-2.5">
          {/* Option 1: Personal */}
          <button
            onClick={() => {
              onSelectWorkspace('personal');
              onClose();
            }}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left ${
              currentWorkspace === 'personal'
                ? 'border-[#6552FF] bg-[#6552FF]/5 dark:bg-[#6552FF]/10'
                : 'border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-[#6552FF] flex items-center justify-center font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                  {t('workspace.personal', undefined, 'Personal')}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {t('workspace.personal_desc', undefined, 'Friends, trips & roommates')}
                </p>
              </div>
            </div>
            {currentWorkspace === 'personal' && (
              <div className="w-5 h-5 rounded-full bg-[#6552FF] text-white flex items-center justify-center">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}
          </button>

          {/* Option 2: Organization */}
          <button
            onClick={() => {
              onSelectWorkspace('organization');
              onClose();
            }}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left ${
              currentWorkspace === 'organization'
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                : 'border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Nomad Collective B2B
                  </p>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-medium">
                    Team
                  </span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {t('workspace.org_desc', undefined, 'Offsites, client dinners & SaaS splits')}
                </p>
              </div>
            </div>
            {currentWorkspace === 'organization' && (
              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-700/60">
          <button
            onClick={() => {
              onClose();
              onCreateOrgClick();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-[#6552FF] dark:hover:text-[#6552FF] transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t('workspace.create_org', undefined, 'Create new organization')}
          </button>
        </div>
      </div>
    </div>
  );
};
