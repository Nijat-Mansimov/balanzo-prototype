import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';
import { Member } from '../../types';
import { Avatar } from './Avatar';

interface PayerSelectorProps {
  members: Member[];
  paidById: string;
  onChange: (newPayerId: string) => void;
  id?: string;
}

export const PayerSelector: React.FC<PayerSelectorProps> = ({
  members,
  paidById,
  onChange,
  id = 'payer-selector',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentPayer = members.find((m) => m.id === paidById) || members[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative w-full space-y-1.5" ref={dropdownRef} id={id}>
      <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center justify-between">
        <span>Paid By</span>
        <span className="text-[10px] text-neutral-400 font-medium">
          Who paid upfront
        </span>
      </label>

      {/* Trigger Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-2.5 rounded-2xl border flex items-center justify-between text-left transition-all cursor-pointer bg-white dark:bg-neutral-800 ${
          isOpen
            ? 'border-[#6552FF] ring-2 ring-[#6552FF]/20'
            : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar
            src={currentPayer?.avatarUrl}
            name={currentPayer?.name || 'Payer'}
            initials={currentPayer?.initials}
            size="xs"
          />
          <div className="min-w-0">
            <span className="text-xs font-bold text-neutral-900 dark:text-white block truncate">
              {currentPayer?.name}
            </span>
            <span className="text-[10px] text-neutral-400 block truncate">
              {currentPayer?.id === 'user-nijat' ? 'You' : currentPayer?.email || 'Member'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-neutral-400">
          <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">Select</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="p-2.5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-xl shadow-neutral-950/10 space-y-2 z-30 animate-in fade-in zoom-in-95 duration-150">
          {members.length > 5 && (
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search member..."
                className="w-full px-3 py-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#6552FF]/30"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          <div className="max-h-48 overflow-y-auto space-y-0.5 custom-scrollbar">
            {filteredMembers.map((member) => {
              const isSelected = member.id === paidById;
              return (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => {
                    onChange(member.id);
                    setIsOpen(false);
                  }}
                  className={`w-full p-2 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#6552FF]/10 text-[#6552FF] dark:text-indigo-300 font-bold'
                      : 'hover:bg-neutral-100 dark:hover:bg-neutral-700/60 text-neutral-800 dark:text-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Avatar
                      src={member.avatarUrl}
                      name={member.name}
                      initials={member.initials}
                      size="xs"
                    />
                    <span className="text-xs truncate">{member.name}</span>
                  </div>

                  {isSelected && <Check className="w-4 h-4 text-[#6552FF] stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
