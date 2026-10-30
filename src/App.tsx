import React, { useState, useEffect } from 'react';
import {
  TaskItem,
  INITIAL_TASKS,
} from './data/focusData';
import { FocusToday } from './components/FocusToday';
import { FocusCalendar } from './components/FocusCalendar';
import { FocusDetail } from './components/FocusDetail';
import { FocusStats } from './components/FocusStats';
import { FocusSync } from './components/FocusSync';
import { FocusSettings } from './components/FocusSettings';
import { NewTaskModal } from './components/NewTaskModal';
import { InstallGuideModal } from './components/InstallGuideModal';

export type ScreenId = 'bugun' | 'takvim' | 'detay' | 'istatistik' | 'sync' | 'ayarlar';

export default function App() {
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [selectedTask, setSelectedTask] = useState<TaskItem>(INITIAL_TASKS[0]);
  const [activeScreen, setActiveScreen] = useState<ScreenId>('bugun');
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop' | 'gallery'>('mobile');
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState<boolean>(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);

  // Deep linking via URL query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const s = params.get('screen') as ScreenId;
    if (s && ['bugun', 'takvim', 'detay', 'istatistik', 'sync', 'ayarlar'].includes(s)) {
      setActiveScreen(s);
    }
    const m = params.get('mode') as 'mobile' | 'desktop' | 'gallery';
    if (m && ['mobile', 'desktop', 'gallery'].includes(m)) {
      setViewMode(m);
    }
  }, []);

  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
    if (selectedTask.id === taskId) {
      setSelectedTask((prev) => ({ ...prev, completed: !prev.completed }));
    }
  };

  const handleSelectTask = (task: TaskItem) => {
    setSelectedTask(task);
    setActiveScreen('detay');
  };

  const handleAddTask = (newTaskData: Omit<TaskItem, 'id'>) => {
    const created: TaskItem = {
      ...newTaskData,
      id: `task-${Date.now()}`,
    };
    setTasks((prev) => [created, ...prev]);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (selectedTask.id === taskId) {
      setSelectedTask(tasks.find((t) => t.id !== taskId) || INITIAL_TASKS[0]);
    }
    setActiveScreen('bugun');
  };

  const handleAddSubtask = (taskId: string, subtaskTitle: string) => {
    const newSub = {
      id: `sub-${Date.now()}`,
      title: subtaskTitle,
      completed: false,
    };
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, subtasks: [...(t.subtasks || []), newSub] } : t
      )
    );
    if (selectedTask.id === taskId) {
      setSelectedTask((prev) => ({
        ...prev,
        subtasks: [...(prev.subtasks || []), newSub],
      }));
    }
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: (t.subtasks || []).map((s) =>
                s.id === subtaskId ? { ...s, completed: !s.completed } : s
              ),
            }
          : t
      )
    );
    if (selectedTask.id === taskId) {
      setSelectedTask((prev) => ({
        ...prev,
        subtasks: (prev.subtasks || []).map((s) =>
          s.id === subtaskId ? { ...s, completed: !s.completed } : s
        ),
      }));
    }
  };

  const screensConfig = [
    { id: 'bugun' as ScreenId, label: 'Bugün', icon: 'today' },
    { id: 'takvim' as ScreenId, label: 'Takvim', icon: 'calendar_month' },
    { id: 'detay' as ScreenId, label: 'Detay', icon: 'description' },
    { id: 'istatistik' as ScreenId, label: 'İstatistik', icon: 'bar_chart' },
    { id: 'sync' as ScreenId, label: 'Sync', icon: 'sync' },
    { id: 'ayarlar' as ScreenId, label: 'Ayarlar', icon: 'settings' },
  ];

  const screenTitleMap: Record<ScreenId, string> = {
    bugun: 'Bugün',
    takvim: 'Takvim',
    detay: 'Görev Detayı',
    istatistik: 'İstatistikler',
    sync: 'Senkronizasyon',
    ayarlar: 'Ayarlar',
  };

  const renderActiveScreenContent = () => {
    switch (activeScreen) {
      case 'bugun':
        return (
          <FocusToday
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onSelectTask={handleSelectTask}
            onOpenNewTaskModal={() => setIsNewTaskModalOpen(true)}
          />
        );
      case 'takvim':
        return (
          <FocusCalendar
            onOpenNewEventModal={() => setIsNewTaskModalOpen(true)}
            onSelectEventTask={(title) => {
              const matched = tasks.find((t) => t.title.includes(title));
              if (matched) setSelectedTask(matched);
              setActiveScreen('detay');
            }}
          />
        );
      case 'detay':
        return (
          <FocusDetail
            task={selectedTask}
            onBack={() => setActiveScreen('bugun')}
            onToggleTaskComplete={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onAddSubtask={handleAddSubtask}
            onToggleSubtask={handleToggleSubtask}
          />
        );
      case 'istatistik':
        return <FocusStats />;
      case 'sync':
        return <FocusSync />;
      case 'ayarlar':
        return <FocusSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#131315] text-[#e4e2e4] antialiased flex flex-col font-sans select-none">
      {/* Top Workspace Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#131315]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              alt="FocusFlow Logo"
              className="h-8 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPFzDeyiJ2qHZZaZfRO4uHw1dY3egxk3E7P7O4qjc1_2rLtujkyr8Y25nq7hRmxO7q3G9hk4PzicPTgCRlVLYvI1PDmYmbAlzrLk69AYbUHPPQuyuuF4q3q71suoLq0btGyrz3ZMgr_V6OtAY-GRP0BcX2beGs5_O-xTIWgUBS0SbRayJXX6Z56TGKYKAwqmR60xyu34chr7_KaStoQlDNtd8g5ueLcyR41N0qwG0K"
            />
            <span className="text-lg font-bold tracking-tight text-[#e4e2e4]">
              FocusFlow
            </span>
            <span className="hidden sm:inline-block text-xs text-[#c1c6d7] font-mono pl-1 border-l border-white/10">
              OmniTask Pro
            </span>
          </div>

          {/* View Mode Switcher in Desktop Header */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#1f1f21] rounded-xl p-1 gap-1 border border-white/5 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('mobile')}
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'mobile'
                    ? 'bg-[#adc6ff] text-[#002e69] font-bold shadow-sm'
                    : 'text-[#c1c6d7] hover:text-[#e4e2e4]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">smartphone</span>
                <span className="hidden sm:inline">Mobil Cihaz</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('desktop')}
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'desktop'
                    ? 'bg-[#adc6ff] text-[#002e69] font-bold shadow-sm'
                    : 'text-[#c1c6d7] hover:text-[#e4e2e4]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">desktop_mac</span>
                <span className="hidden sm:inline">Geniş Masaüstü</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('gallery')}
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'gallery'
                    ? 'bg-[#adc6ff] text-[#002e69] font-bold shadow-sm'
                    : 'text-[#c1c6d7] hover:text-[#e4e2e4]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">layers</span>
                <span className="hidden sm:inline">Tüm 6 Ekran (Artboard)</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsInstallModalOpen(true)}
              className="px-3 py-1.5 bg-[#adc6ff] text-[#002e69] rounded-xl text-xs font-bold hover:opacity-90 transition active:scale-95 flex items-center gap-1.5 shadow-sm shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">install_mobile</span>
              <span className="hidden md:inline">Cihaza Kur</span>
            </button>

            <button
              type="button"
              onClick={() => alert('Bildirimler: 2 yeni görev hatırlatıcınız var.')}
              aria-label="Bildirimler"
              className="w-9 h-9 flex items-center justify-center text-[#c1c6d7] hover:text-[#e4e2e4] rounded-full hover:bg-white/5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
            <div
              onClick={() => {
                setActiveScreen('ayarlar');
                if (viewMode === 'gallery') setViewMode('mobile');
              }}
              className="w-8 h-8 rounded-full bg-[#adc6ff] flex items-center justify-center cursor-pointer shadow-md"
            >
              <span className="material-symbols-outlined text-[#002e69] text-[18px]">person</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Render */}
      <main className="flex-1 flex flex-col items-center justify-start py-4 px-2 sm:px-4">
        {viewMode === 'gallery' ? (
          /* ALL 6 SCREENS ARTBOARD VIEW */
          <div className="w-full max-w-7xl space-y-4">
            <div className="p-4 rounded-2xl bg-[#1f1f21] border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#53e16f] font-bold">
                  <span className="material-symbols-outlined text-[16px]">view_carousel</span>
                  <span>CANVAS ARTBOARD — TÜM 6 EKRAN BİR ARADA</span>
                </div>
                <h2 className="text-lg font-bold text-[#e4e2e4] mt-0.5">
                  FocusFlow / OmniTask Pro Ekran Tasarımları
                </h2>
                <p className="text-xs text-[#c1c6d7]">
                  İlgili ekranı tam boyutta interaktif kullanmak için "Odaklan" düğmesine tıklayın.
                </p>
              </div>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-8 pt-2 no-scrollbar">
              {screensConfig.map((sc) => (
                <div
                  key={sc.id}
                  className="w-[360px] sm:w-[380px] shrink-0 flex flex-col space-y-3"
                >
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#1f1f21] border border-white/5">
                    <div className="space-y-0.5">
                      <div className="text-[10px] font-mono font-bold text-[#c1c6d7] uppercase">
                        Ekran: {sc.label}
                      </div>
                      <div className="text-xs font-bold text-[#e4e2e4]">
                        {screenTitleMap[sc.id]}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveScreen(sc.id);
                        setViewMode('mobile');
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-[#adc6ff] text-[#002e69] rounded-lg hover:opacity-90 active:scale-95 transition cursor-pointer"
                    >
                      <span>Odaklan</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>

                  {/* Device shell */}
                  <div className="w-full h-[720px] bg-[#131315] rounded-[44px] p-2.5 shadow-2xl border-4 border-[#2a2a2c] flex flex-col overflow-hidden relative">
                    <div className="w-24 h-4 bg-black rounded-full mx-auto my-1.5 shrink-0" />
                    <div className="flex-1 overflow-y-auto no-scrollbar px-3 pt-2">
                      {sc.id === 'bugun' && (
                        <FocusToday
                          tasks={tasks}
                          onToggleTask={handleToggleTask}
                          onSelectTask={(t) => {
                            setSelectedTask(t);
                            setActiveScreen('detay');
                            setViewMode('mobile');
                          }}
                          onOpenNewTaskModal={() => setIsNewTaskModalOpen(true)}
                        />
                      )}
                      {sc.id === 'takvim' && (
                        <FocusCalendar
                          onOpenNewEventModal={() => setIsNewTaskModalOpen(true)}
                        />
                      )}
                      {sc.id === 'detay' && (
                        <FocusDetail
                          task={selectedTask}
                          onBack={() => {
                            setActiveScreen('bugun');
                            setViewMode('mobile');
                          }}
                          onToggleTaskComplete={handleToggleTask}
                          onDeleteTask={handleDeleteTask}
                          onAddSubtask={handleAddSubtask}
                          onToggleSubtask={handleToggleSubtask}
                        />
                      )}
                      {sc.id === 'istatistik' && <FocusStats />}
                      {sc.id === 'sync' && <FocusSync />}
                      {sc.id === 'ayarlar' && <FocusSettings />}
                    </div>
                    <div className="h-3 flex items-center justify-center shrink-0">
                      <div className="w-24 h-1 bg-white/20 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : viewMode === 'mobile' ? (
          /* MOBILE DEVICE FRAME (iPhone 15/16 Pro Frame) */
          <div className="w-full flex justify-center py-1">
            <div className="relative w-full max-w-[395px] h-[800px] max-h-[calc(100vh-5rem)] bg-[#131315] rounded-[48px] shadow-2xl border-[5px] border-[#2a2a2c] ring-1 ring-white/10 flex flex-col overflow-hidden">
              {/* Dynamic Island */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-between px-2.5">
                <div className="w-2 h-2 rounded-full bg-[#1b1b1d] border border-white/10" />
                <div className="w-2 h-2 rounded-full bg-[#1b1b1d] border border-white/10" />
              </div>

              {/* Status Bar */}
              <div className="h-8 px-5 pt-1 flex items-center justify-between text-[#e4e2e4] text-xs font-semibold z-30 select-none">
                <span>9:41</span>
                <div className="flex items-center gap-1.5 opacity-90">
                  <span className="material-symbols-outlined text-[15px]">signal_cellular_4_bar</span>
                  <span className="material-symbols-outlined text-[15px]">wifi</span>
                  <span className="material-symbols-outlined text-[16px]">battery_full</span>
                </div>
              </div>

              {/* Scrollable Viewport */}
              <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-1 pb-24">
                {renderActiveScreenContent()}
              </div>

              {/* Floating Action Button (FAB) on Today & Calendar */}
              {(activeScreen === 'bugun' || activeScreen === 'takvim') && (
                <div className="absolute bottom-24 right-5 z-40">
                  <button
                    type="button"
                    onClick={() => setIsNewTaskModalOpen(true)}
                    aria-label="Yeni görev ekle"
                    className="w-14 h-14 rounded-full bg-[#adc6ff] text-[#002e69] flex items-center justify-center shadow-lg shadow-[#adc6ff]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[28px]">add</span>
                  </button>
                </div>
              )}

              {/* Mobile Bottom Tab Navigation Bar */}
              <nav className="absolute bottom-0 inset-x-0 z-40 pb-2 bg-[#131315]/90 backdrop-blur-xl border-t border-white/5">
                <div className="flex justify-around items-center h-16 px-2">
                  {screensConfig.map((tab) => {
                    const isActive = activeScreen === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveScreen(tab.id)}
                        className={`flex flex-col items-center justify-center gap-0.5 w-14 h-14 transition-all cursor-pointer ${
                          isActive
                            ? 'text-[#adc6ff] font-bold'
                            : 'text-[#c1c6d7] hover:text-[#e4e2e4]'
                        }`}
                      >
                        <span
                          className="material-symbols-outlined text-[22px]"
                          style={{
                            fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                          }}
                        >
                          {tab.icon}
                        </span>
                        <span className="text-[10px] tracking-tight">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
                {/* Home Indicator */}
                <div className="h-2 flex items-center justify-center pb-1">
                  <div className="w-32 h-1 bg-white/20 rounded-full" />
                </div>
              </nav>
            </div>
          </div>
        ) : (
          /* RESPONSIVE DESKTOP CANVAS */
          <div className="w-full max-w-5xl mx-auto px-4 py-4 space-y-6">
            {/* Desktop Screen Switcher Tabs */}
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                {screensConfig.map((tab) => {
                  const isActive = activeScreen === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveScreen(tab.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 cursor-pointer ${
                        isActive
                          ? 'bg-[#adc6ff] text-[#002e69] shadow-sm'
                          : 'bg-[#1f1f21] text-[#c1c6d7] hover:text-[#e4e2e4] hover:bg-[#2a2a2c]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {tab.icon}
                      </span>
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {(activeScreen === 'bugun' || activeScreen === 'takvim') && (
                <button
                  type="button"
                  onClick={() => setIsNewTaskModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#adc6ff] text-[#002e69] text-xs font-semibold flex items-center gap-1.5 hover:opacity-90 transition active:scale-95 shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  <span>Yeni Görev</span>
                </button>
              )}
            </div>

            {/* Screen Content */}
            <div className="bg-[#131315] rounded-2xl border border-white/5 p-4 sm:p-6 shadow-xl">
              {renderActiveScreenContent()}
            </div>
          </div>
        )}
      </main>

      {/* New Task Modal */}
      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        onAddTask={handleAddTask}
      />

      {/* Cihaza Kurma Rehberi Modal */}
      <InstallGuideModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />
    </div>
  );
}
