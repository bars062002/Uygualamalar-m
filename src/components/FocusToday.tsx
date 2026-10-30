import React, { useState } from 'react';
import { TaskItem } from '../data/focusData';

interface FocusTodayProps {
  tasks: TaskItem[];
  onToggleTask: (taskId: string) => void;
  onSelectTask: (task: TaskItem) => void;
  onOpenNewTaskModal: () => void;
}

export const FocusToday: React.FC<FocusTodayProps> = ({
  tasks,
  onToggleTask,
  onSelectTask,
  onOpenNewTaskModal,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'is' | 'kisisel' | 'onemli'>('all');
  const [selectedDay, setSelectedDay] = useState<number>(24);
  const [showCompleted, setShowCompleted] = useState<boolean>(true);

  const days = [
    { dayName: 'Cmt', dayNum: 22 },
    { dayName: 'Paz', dayNum: 23 },
    { dayName: 'Pzt', dayNum: 24 },
    { dayName: 'Sal', dayNum: 25 },
    { dayName: 'Çar', dayNum: 26 },
    { dayName: 'Per', dayNum: 27 },
    { dayName: 'Cum', dayNum: 28 },
  ];

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  const filteredPending = pendingTasks.filter((task) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'is') return task.category === 'is';
    if (activeFilter === 'kisisel') return task.category === 'kisisel';
    if (activeFilter === 'onemli') return task.priority === 'high';
    return true;
  });

  const filteredCompleted = completedTasks.filter((task) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'is') return task.category === 'is';
    if (activeFilter === 'kisisel') return task.category === 'kisisel';
    if (activeFilter === 'onemli') return task.priority === 'high';
    return true;
  });

  const totalCount = tasks.length;
  const isCount = tasks.filter((t) => t.category === 'is').length;
  const kisiselCount = tasks.filter((t) => t.category === 'kisisel').length;
  const onemliCount = tasks.filter((t) => t.priority === 'high').length;
  const completionPercent = totalCount > 0 ? Math.round((completedTasks.length / totalCount) * 100) : 0;

  return (
    <div className="flex flex-col w-full pb-12 gap-4">
      {/* Greeting & Quick Stats Header */}
      <div className="flex flex-col gap-1 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-[#c1c6d7]">Pazartesi, 24 Ekim</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#e4e2e4] tracking-tight">
              Günaydın, Barış ✨
            </h1>
          </div>
          {/* Progress Ring Badge */}
          <div className="relative flex items-center justify-center w-14 h-14 bg-[#1f1f21] rounded-full shadow-sm shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#353437]"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="text-[#adc6ff]"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeDasharray={`${completionPercent || 78}, 100`}
                strokeLinecap="round"
                strokeWidth="3"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold text-[#e4e2e4]">%{completionPercent || 78}</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-[#c1c6d7] leading-relaxed">
          Bugün {totalCount} görevden {completedTasks.length}'ini tamamladın. FocusFlow ile harika gidiyorsun!
        </p>
      </div>

      {/* Date Selector Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
        {days.map((item) => {
          const isSelected = selectedDay === item.dayNum;
          return (
            <button
              key={item.dayNum}
              type="button"
              onClick={() => setSelectedDay(item.dayNum)}
              className={`flex flex-col items-center justify-center min-w-[52px] h-16 rounded-xl transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#adc6ff] text-[#002e69] font-bold shadow-md scale-105'
                  : 'bg-[#2a2a2c] text-[#c1c6d7] hover:bg-[#353437]'
              }`}
            >
              <span className="text-xs opacity-90">{item.dayName}</span>
              <span className="text-lg font-bold">{item.dayNum}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-[#adc6ff] text-[#002e69] shadow-sm font-semibold'
              : 'bg-[#1f1f21] hover:bg-[#2a2a2c] text-[#c1c6d7]'
          }`}
        >
          Tümü ({totalCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('is')}
          className={`px-4 py-2 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
            activeFilter === 'is'
              ? 'bg-[#adc6ff] text-[#002e69] shadow-sm font-semibold'
              : 'bg-[#1f1f21] hover:bg-[#2a2a2c] text-[#c1c6d7]'
          }`}
        >
          İş ({isCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('kisisel')}
          className={`px-4 py-2 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
            activeFilter === 'kisisel'
              ? 'bg-[#adc6ff] text-[#002e69] shadow-sm font-semibold'
              : 'bg-[#1f1f21] hover:bg-[#2a2a2c] text-[#c1c6d7]'
          }`}
        >
          Kişisel ({kisiselCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('onemli')}
          className={`px-4 py-2 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
            activeFilter === 'onemli'
              ? 'bg-[#adc6ff] text-[#002e69] shadow-sm font-semibold'
              : 'bg-[#1f1f21] hover:bg-[#2a2a2c] text-[#c1c6d7]'
          }`}
        >
          Önemli ({onemliCount})
        </button>
      </div>

      {/* Task List Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#e4e2e4]">Öncelikli Görevler</h2>
          <span className="text-xs text-[#c1c6d7] font-mono">{filteredPending.length} kaldı</span>
        </div>

        {filteredPending.length === 0 && (
          <div className="flex flex-col items-center justify-center p-8 rounded-xl bg-[#1f1f21]/60 text-center gap-2 border border-white/5">
            <div className="w-12 h-12 rounded-full bg-[#2a2a2c] flex items-center justify-center text-[#adc6ff]">
              <span className="material-symbols-outlined text-[28px]">task_alt</span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-semibold text-[#e4e2e4]">Görev Bulunmuyor</h3>
              <p className="text-xs text-[#c1c6d7]">
                Bu filtreye uygun aktif bir görev yok. Yeni bir görev ekleyerek başlayabilirsin.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenNewTaskModal}
              className="mt-2 px-4 py-2 rounded-full bg-[#adc6ff] text-[#002e69] text-xs font-medium shadow-sm transition-all hover:opacity-90 active:scale-95 flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Yeni Görev Ekle</span>
            </button>
          </div>
        )}

        {filteredPending.map((task) => (
          <div
            key={task.id}
            onClick={() => onSelectTask(task)}
            className="group relative flex items-center justify-between p-4 rounded-xl bg-[#1f1f21]/90 backdrop-blur-xl shadow-sm transition-all hover:bg-[#2a2a2c] border border-white/5 cursor-pointer"
          >
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={(e) => {
                  e.stopPropagation();
                  onToggleTask(task.id);
                }}
                className="w-5 h-5 rounded-full accent-[#adc6ff] cursor-pointer shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-[#e4e2e4] truncate group-hover:text-white transition">
                  {task.title}
                </span>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {task.priority === 'high' && (
                    <span className="px-2 py-0.5 rounded-full bg-[#93000a]/50 text-[#ffdad6] text-[10px] font-semibold">
                      Yüksek
                    </span>
                  )}
                  {task.priority === 'medium' && (
                    <span className="px-2 py-0.5 rounded-full bg-[#353437] text-[#c1c6d7] text-[10px]">
                      Orta
                    </span>
                  )}
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      task.category === 'is'
                        ? 'bg-[#4b8eff]/30 text-[#adc6ff]'
                        : 'bg-[#7508a5]/40 text-[#e8b3ff]'
                    }`}
                  >
                    {task.category === 'is' ? 'İş' : 'Kişisel'}
                  </span>
                  <span className="text-xs text-[#c1c6d7] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    {task.time.split(' - ')[0]}
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              aria-label="Görev detayını görüntüle"
              onClick={(e) => {
                e.stopPropagation();
                onSelectTask(task);
              }}
              className="text-[#c1c6d7] hover:text-[#e4e2e4] p-2"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        ))}

        {/* Completed Section */}
        {filteredCompleted.length > 0 && (
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-[#c1c6d7]">
                Tamamlananlar ({filteredCompleted.length})
              </h2>
              <button
                type="button"
                onClick={() => setShowCompleted(!showCompleted)}
                className="text-xs text-[#adc6ff] hover:underline cursor-pointer"
              >
                {showCompleted ? 'Gizle' : 'Göster'}
              </button>
            </div>

            {showCompleted && (
              <div className="space-y-2">
                {filteredCompleted.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onSelectTask(task)}
                    className="group relative flex items-center justify-between p-4 rounded-xl bg-[#1b1b1d]/50 backdrop-blur-xl opacity-75 border border-white/5 hover:opacity-100 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={(e) => {
                          e.stopPropagation();
                          onToggleTask(task.id);
                        }}
                        className="w-5 h-5 rounded-full accent-[#adc6ff] cursor-pointer shrink-0"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm text-[#c1c6d7] line-through truncate">
                          {task.title}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-0.5 rounded-full bg-[#353437] text-[#c1c6d7] text-[10px]">
                            {task.category === 'is' ? 'İş' : 'Kişisel'}
                          </span>
                          <span className="text-xs text-[#c1c6d7] flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                            {task.time.split(' - ')[0]}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      aria-label="Detay"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTask(task);
                      }}
                      className="text-[#c1c6d7] hover:text-[#e4e2e4] p-2"
                    >
                      <span className="material-symbols-outlined">more_vert</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
