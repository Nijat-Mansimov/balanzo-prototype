import React, { useState, useRef, useEffect, useMemo } from 'react';

interface DatePickerProps {
  value: string; // 'YYYY-MM-DD'
  onChange: (dateStr: string) => void;
  label?: string;
  id?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label,
  id = 'date-picker',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse current selected date or fallback to today
  const selectedDate = useMemo(() => {
    if (!value) return new Date();
    const parts = value.split('-');
    if (parts.length === 3) {
      return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    }
    return new Date(value);
  }, [value]);

  // Calendar view month & year state
  const [viewYear, setViewYear] = useState<number>(selectedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(selectedDate.getMonth()); // 0-11

  // Update view year/month when value changes externally
  useEffect(() => {
    setViewYear(selectedDate.getFullYear());
    setViewMonth(selectedDate.getMonth());
  }, [selectedDate]);

  // Handle outside click to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
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

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const shortDayNames = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  // Format date helper
  const formatDateString = (d: Date): string => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const todayStr = formatDateString(new Date());

  // Formatted human-readable label
  const formattedDisplay = useMemo(() => {
    const today = new Date();
    const isToday = formatDateString(selectedDate) === formatDateString(today);
    
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const isYesterday = formatDateString(selectedDate) === formatDateString(yesterday);

    const monthStr = selectedDate.toLocaleDateString('en-US', { month: 'short' });
    const dayNum = selectedDate.getDate();
    const yearNum = selectedDate.getFullYear();

    if (isToday) return `Today, ${monthStr} ${dayNum}`;
    if (isYesterday) return `Yesterday, ${monthStr} ${dayNum}`;
    return `${monthStr} ${dayNum}, ${yearNum}`;
  }, [selectedDate]);

  // Days grid calculation
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
    const lastDayOfMonth = new Date(viewYear, viewMonth + 1, 0);

    // Day of week: 0 = Sun, 1 = Mon ... 6 = Sat
    // We want Monday = 0, ..., Sunday = 6
    let startDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const daysInCurrentMonth = lastDayOfMonth.getDate();
    const prevMonthLastDay = new Date(viewYear, viewMonth, 0).getDate();

    const days: {
      day: number;
      month: number;
      year: number;
      isCurrentMonth: boolean;
      dateStr: string;
    }[] = [];

    // Previous month padding
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = prevMonthLastDay - i;
      const prevM = viewMonth === 0 ? 11 : viewMonth - 1;
      const prevY = viewMonth === 0 ? viewYear - 1 : viewYear;
      const dateObj = new Date(prevY, prevM, d);
      days.push({
        day: d,
        month: prevM,
        year: prevY,
        isCurrentMonth: false,
        dateStr: formatDateString(dateObj),
      });
    }

    // Current month days
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      const dateObj = new Date(viewYear, viewMonth, d);
      days.push({
        day: d,
        month: viewMonth,
        year: viewYear,
        isCurrentMonth: true,
        dateStr: formatDateString(dateObj),
      });
    }

    // Next month padding to fill out 35 or 42 grid slots
    const remaining = (7 - (days.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      const nextM = viewMonth === 11 ? 0 : viewMonth + 1;
      const nextY = viewMonth === 11 ? viewYear + 1 : viewYear;
      const dateObj = new Date(nextY, nextM, d);
      days.push({
        day: d,
        month: nextM,
        year: nextY,
        isCurrentMonth: false,
        dateStr: formatDateString(dateObj),
      });
    }

    return days;
  }, [viewYear, viewMonth]);

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleSelectDate = (dateStr: string) => {
    onChange(dateStr);
    setIsOpen(false);
  };

  const setPreset = (daysAgo: number) => {
    const target = new Date();
    target.setDate(target.getDate() - daysAgo);
    const str = formatDateString(target);
    onChange(str);
    setViewYear(target.getFullYear());
    setViewMonth(target.getMonth());
    setIsOpen(false);
  };

  return (
    <div className="relative w-full space-y-1" ref={containerRef} id={id}>
      {label && (
        <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-2.5 rounded-2xl border flex items-center justify-between text-left transition-all cursor-pointer bg-neutral-50 dark:bg-neutral-900 ${
          isOpen
            ? 'border-[#6552FF] ring-2 ring-[#6552FF]/20'
            : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
        }`}
      >
        <span className="text-xs font-bold text-neutral-900 dark:text-white truncate">
          {formattedDisplay}
        </span>
        <span className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500">
          {isOpen ? 'Close' : 'Change'}
        </span>
      </button>

      {/* Professional Calendar Popover */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-[290px] max-w-[calc(100vw-2.5rem)] p-4 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/90 dark:border-neutral-700 shadow-2xl shadow-neutral-950/20 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3.5">
          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 pb-2.5 border-b border-neutral-100 dark:border-neutral-700/80">
            <button
              type="button"
              onClick={() => setPreset(0)}
              className="flex-1 py-1.5 rounded-xl text-[11px] font-bold bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-200 transition-colors cursor-pointer text-center"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setPreset(1)}
              className="flex-1 py-1.5 rounded-xl text-[11px] font-bold bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-200 transition-colors cursor-pointer text-center"
            >
              Yesterday
            </button>
            <button
              type="button"
              onClick={() => setPreset(2)}
              className="flex-1 py-1.5 rounded-xl text-[11px] font-bold bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-200 transition-colors cursor-pointer text-center"
            >
              2d ago
            </button>
          </div>

          {/* Month / Year Navigator */}
          <div className="flex items-center justify-between px-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
              title="Previous Month"
            >
              ‹
            </button>

            <span className="text-xs font-extrabold text-neutral-900 dark:text-white">
              {monthNames[viewMonth]} {viewYear}
            </span>

            <button
              type="button"
              onClick={handleNextMonth}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
              title="Next Month"
            >
              ›
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {shortDayNames.map((dayName) => (
              <div
                key={dayName}
                className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 py-0.5"
              >
                {dayName}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((item, index) => {
              const isSelected = item.dateStr === value;
              const isToday = item.dateStr === todayStr;

              return (
                <button
                  key={`${item.dateStr}-${index}`}
                  type="button"
                  onClick={() => handleSelectDate(item.dateStr)}
                  className={`h-8 w-8 mx-auto rounded-xl flex items-center justify-center text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#6552FF] text-white font-black shadow-sm shadow-[#6552FF]/30'
                      : isToday
                      ? 'border border-[#6552FF] text-[#6552FF] dark:text-[#a094ff] font-bold hover:bg-[#6552FF]/10'
                      : item.isCurrentMonth
                      ? 'text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700/60 font-medium'
                      : 'text-neutral-300 dark:text-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800 font-normal'
                  }`}
                >
                  {item.day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
