import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Check, X } from 'lucide-react';
import { Member } from '../../types';
import { Avatar } from './Avatar';

interface MemberMultiSelectProps {
  members: Member[];
  selectedMemberIds: string[];
  onChange: (newSelectedIds: string[]) => void;
  paidById?: string;
  totalAmount?: number;
  currencySymbol?: string;
  id?: string;
}

export const MemberMultiSelect: React.FC<MemberMultiSelectProps> = ({
  members,
  selectedMemberIds,
  onChange,
  paidById,
  totalAmount = 0,
  currencySymbol = '$',
  id = 'member-multi-select',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const allSelected = members.length > 0 && selectedMemberIds.length === members.length;
  const selectedMembers = members.filter((m) => selectedMemberIds.includes(m.id));
  const estimatedPerPerson = selectedMemberIds.length > 0 
    ? (totalAmount / selectedMemberIds.length).toFixed(2) 
    : '0.00';

  const filteredMembers = members.filter((m) => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.email && m.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleToggleMember = (memberId: string) => {
    if (selectedMemberIds.includes(memberId)) {
      onChange(selectedMemberIds.filter((id) => id !== memberId));
    } else {
      onChange([...selectedMemberIds, memberId]);
    }
  };

  const handleSelectAll = () => {
    onChange(members.map((m) => m.id));
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const handleSelectPayerOnly = () => {
    if (paidById && members.some((m) => m.id === paidById)) {
      onChange([paidById]);
    }
  };

  return (
    <div className="relative w-full space-y-1.5" ref={dropdownRef} id={id}>
      {/* Header & Quick Actions */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
          Who should split this?
        </label>
        
        <div className="flex items-center gap-1.5 text-[11px]">
          <button
            type="button"
            onClick={allSelected ? handleClearAll : handleSelectAll}
            className="px-2 py-0.5 rounded-lg font-bold text-[#6552FF] hover:bg-[#6552FF]/10 transition-colors cursor-pointer"
          >
            {allSelected ? 'Clear' : `Select All (${members.length})`}
          </button>
        </div>
      </div>

      {/* Main Trigger Dropdown */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 rounded-2xl border transition-all cursor-pointer bg-white dark:bg-neutral-800 ${
          isOpen
            ? 'border-[#6552FF] ring-2 ring-[#6552FF]/20'
            : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                {selectedMemberIds.length === 0
                  ? 'No members selected'
                  : selectedMemberIds.length === members.length
                  ? `All ${members.length} members`
                  : `${selectedMemberIds.length} of ${members.length} members selected`}
              </span>
              
              {selectedMemberIds.length > 0 && totalAmount > 0 && (
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 tabular-nums">
                  ~{currencySymbol}{estimatedPerPerson}/ea
                </span>
              )}
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
              {selectedMemberIds.length === 0 
                ? 'Click to choose members'
                : selectedMembers.map(m => m.name.split(' ')[0]).join(', ')}
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0 text-neutral-400">
            <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
              {isOpen ? 'Close' : 'Select'}
            </span>
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <div className="p-3 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-xl shadow-neutral-950/10 space-y-2.5 z-30 animate-in fade-in zoom-in-95 duration-150">
          {/* Search Box */}
          {members.length > 4 && (
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${members.length} members...`}
                className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#6552FF]/30"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* Preset Shortcuts */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={handleSelectAll}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition-colors cursor-pointer ${
                allSelected
                  ? 'bg-[#6552FF] text-white'
                  : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200'
              }`}
            >
              All ({members.length})
            </button>

            {paidById && members.some(m => m.id === paidById) && (
              <button
                type="button"
                onClick={handleSelectPayerOnly}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition-colors cursor-pointer ${
                  selectedMemberIds.length === 1 && selectedMemberIds[0] === paidById
                    ? 'bg-[#6552FF] text-white'
                    : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200'
                }`}
              >
                Payer Only
              </button>
            )}

            <button
              type="button"
              onClick={handleClearAll}
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 shrink-0 transition-colors cursor-pointer"
            >
              Clear
            </button>
          </div>

          {/* Scrollable Members List */}
          <div className="max-h-56 overflow-y-auto space-y-1 pr-0.5 custom-scrollbar">
            {filteredMembers.length === 0 ? (
              <div className="py-4 text-center text-xs text-neutral-400">
                No members found matching "{searchQuery}"
              </div>
            ) : (
              filteredMembers.map((member) => {
                const isSelected = selectedMemberIds.includes(member.id);
                const isPayer = member.id === paidById;

                return (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => handleToggleMember(member.id)}
                    className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#6552FF]/30 bg-[#6552FF]/5 dark:bg-[#6552FF]/10 text-neutral-900 dark:text-white'
                        : 'border-transparent hover:bg-neutral-50 dark:hover:bg-neutral-700/50 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Custom Checkbox */}
                      <div
                        className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-[#6552FF] text-white'
                            : 'border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>

                      <Avatar
                        src={member.avatarUrl}
                        name={member.name}
                        initials={member.initials}
                        size="xs"
                      />

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs truncate ${isSelected ? 'font-bold' : 'font-medium'}`}>
                            {member.name}
                          </span>
                          {isPayer && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 shrink-0">
                              Payer
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-xs tabular-nums ${isSelected ? 'font-bold text-neutral-900 dark:text-white' : 'text-neutral-400'}`}>
                        {isSelected ? `${currencySymbol}${estimatedPerPerson}` : `${currencySymbol}0.00`}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Bar */}
          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-700 flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
              {selectedMemberIds.length} of {members.length} selected
            </span>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-xs font-bold hover:opacity-90 active:scale-95 transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
