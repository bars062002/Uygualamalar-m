import React, { useState } from 'react';
import { CalendarEvent, INITIAL_CALENDAR_EVENTS } from '../data/focusData';

interface FocusCalendarProps {
  onOpenNewEventModal: () => void;
  onSelectEventTask?: (title: string) => void;
}

export const FocusCalendar: React.FC<FocusCalendarProps> = ({
  onOpenNewEventModal,
  onSelectEventTask,
}) => {
  const [viewType, setViewType] = useState<'gun' | 'hafta' | 'ay'>('gun');
  const [selectedDay, setSelectedDay] = useState<number>(26);
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_CALENDAR_EVENTS);

  const days = [
    { name: 'Pzt', num: 23 },
    { name: 'Sal', num: 24 },
    { name: 'Çar', num: 25 },
    { name: 'Per', num: 26, isToday: true },
    { name: 'Cum', num: 27 },
    { name: 'Cmt', num: 28, hasDot: true },
    { name: 'Paz', num: 29 },
  ];

  const toggleEventReminder = (eventId: string) => {
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === eventId ? { ...ev, reminder: !ev.reminder } : ev
      )
    );
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Month Selector & View Toggle */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-[#c1c6d7] uppercase tracking-wider font-semibold">
              Takvim
            </span>
            <h2 className="text-2xl font-bold text-[#e4e2e4]">Ekim 2023</h2>
          </div>
          <div className="flex items-center bg-[#1f1f21] p-1 rounded-xl border border-white/5">
            <button
              type="button"
              onClick={() => setViewType('gun')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewType === 'gun'
                  ? 'bg-[#adc6ff] text-[#002e69]'
                  : 'text-[#c1c6d7] hover:text-[#e4e2e4]'
              }`}
            >
              Gün
            </button>
            <button
              type="button"
              onClick={() => setViewType('hafta')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewType === 'hafta'
                  ? 'bg-[#adc6ff] text-[#002e69]'
                  : 'text-[#c1c6d7] hover:text-[#e4e2e4]'
              }`}
            >
              Hafta
            </button>
            <button
              type="button"
              onClick={() => setViewType('ay')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewType === 'ay'
                  ? 'bg-[#adc6ff] text-[#002e69]'
                  : 'text-[#c1c6d7] hover:text-[#e4e2e4]'
              }`}
            >
              Ay
            </button>
          </div>
        </div>

        {/* Mini Horizontal Calendar Strip */}
        <div className="flex items-center justify-between gap-1.5 overflow-x-auto py-2 no-scrollbar">
          {days.map((item) => {
            const isSelected = selectedDay === item.num;
            return (
              <div
                key={item.num}
                onClick={() => setSelectedDay(item.num)}
                className={`flex flex-col items-center justify-center min-w-[46px] sm:min-w-[48px] h-16 rounded-xl cursor-pointer transition-all relative ${
                  isSelected
                    ? 'bg-[#adc6ff] text-[#002e69] shadow-lg shadow-[#adc6ff]/25 scale-105 font-bold'
                    : 'bg-[#1b1b1d] text-[#c1c6d7] hover:bg-[#1f1f21]'
                }`}
              >
                <span className="text-[11px] opacity-90">{item.name}</span>
                <span className="text-base font-bold mt-0.5">{item.num}</span>
                {item.isToday && (
                  <div
                    className={`w-1 h-1 rounded-full mt-1 ${
                      isSelected ? 'bg-[#002e69]' : 'bg-[#adc6ff]'
                    }`}
                  />
                )}
                {item.hasDot && !isSelected && (
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#53e16f]" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Time Blocks Timeline View */}
      <div className="flex flex-col gap-4">
        {events.map((event) => {
          const accentColorClass =
            event.categoryColor === 'primary'
              ? 'bg-[#adc6ff]'
              : event.categoryColor === 'secondary'
              ? 'bg-[#e8b3ff]'
              : 'bg-[#53e16f]';

          const badgeBgClass =
            event.categoryColor === 'primary'
              ? 'bg-[#adc6ff]/20 text-[#adc6ff]'
              : event.categoryColor === 'secondary'
              ? 'bg-[#e8b3ff]/20 text-[#e8b3ff]'
              : 'bg-[#53e16f]/20 text-[#53e16f]';

          return (
            <div key={event.id} className="flex gap-4 items-start group">
              <span className="text-xs font-mono font-semibold text-[#c1c6d7] w-12 pt-3 shrink-0">
                {event.timeSlot}
              </span>
              <div
                onClick={() => onSelectEventTask?.(event.title)}
                className="flex-1 bg-[#1f1f21]/90 backdrop-blur-xl p-4 rounded-xl shadow-md transition-all hover:bg-[#2a2a2c] relative overflow-hidden border border-white/5 cursor-pointer"
              >
                <div className={`absolute left-0 inset-y-0 w-1 ${accentColorClass}`} />
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${badgeBgClass}`}>
                    {event.category}
                  </span>
                  <span className="text-xs text-[#c1c6d7] font-mono">{event.timeRange}</span>
                </div>
                <h3 className="text-base font-semibold text-[#e4e2e4] mb-1">
                  {event.title}
                </h3>
                <p className="text-xs text-[#c1c6d7] leading-relaxed">
                  {event.description}
                </p>

                {/* Optional Attendees & Reminder Bar */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#2a2a2c]">
                  {event.attendees ? (
                    <div className="flex -space-x-1.5">
                      {event.attendees.map((att, idx) => (
                        <div
                          key={idx}
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            idx === 0
                              ? 'bg-[#adc6ff] text-[#002e69]'
                              : 'bg-[#e8b3ff] text-[#510074]'
                          }`}
                        >
                          {att}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[11px] text-[#c1c6d7]">Kişisel Ajanda</span>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleEventReminder(event.id);
                    }}
                    className={`flex items-center gap-1 text-xs transition cursor-pointer ${
                      event.reminder ? 'text-[#adc6ff]' : 'text-[#c1c6d7] hover:text-[#e4e2e4]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {event.reminder ? 'notifications_active' : 'notifications_off'}
                    </span>
                    <span>{event.reminder ? 'Hatırlatıcı Açık' : 'Hatırlatıcı Kapalı'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 right-6 z-40">
        <button
          type="button"
          onClick={onOpenNewEventModal}
          aria-label="Yeni etkinlik ekle"
          className="w-14 h-14 rounded-full bg-[#adc6ff] text-[#002e69] shadow-xl shadow-[#adc6ff]/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[24px]">add</span>
        </button>
      </div>
    </div>
  );
};
