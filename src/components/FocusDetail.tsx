import React, { useState } from 'react';
import { TaskItem } from '../data/focusData';

interface FocusDetailProps {
  task: TaskItem;
  onBack: () => void;
  onToggleTaskComplete: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onAddSubtask: (taskId: string, title: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

export const FocusDetail: React.FC<FocusDetailProps> = ({
  task,
  onBack,
  onToggleTaskComplete,
  onDeleteTask,
  onAddSubtask,
  onToggleSubtask,
}) => {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [reminderActive, setReminderActive] = useState(task.reminder);
  const [attachments, setAttachments] = useState(task.attachments || []);
  const [copiedShare, setCopiedShare] = useState(false);

  const subtasks = task.subtasks || [];
  const completedSubtasksCount = subtasks.filter((s) => s.completed).length;
  const subtasksProgress = subtasks.length > 0 ? (completedSubtasksCount / subtasks.length) * 100 : 0;

  const handleAddSubtaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    onAddSubtask(task.id, newSubtaskTitle.trim());
    setNewSubtaskTitle('');
  };

  const handleAddFile = () => {
    const newFile = {
      id: `file-${Date.now()}`,
      name: `Rapor_Eki_${attachments.length + 1}.pdf`,
      size: '1.8 MB',
      type: 'PDF Belgesi',
    };
    setAttachments((prev) => [...prev, newFile]);
  };

  const handleDeleteFile = (id: string) => {
    setAttachments((prev) => prev.filter((f) => f.id !== id));
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="flex flex-col w-full pb-8 gap-5">
      {/* Top Bar / Back & Title & Actions */}
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Geri dön"
            className="w-10 h-10 rounded-full bg-[#1f1f21] flex items-center justify-center text-[#e4e2e4] hover:bg-[#2a2a2c] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <span className="text-xl font-bold text-[#e4e2e4]">Görev Detayı</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            aria-label="Paylaş"
            className="w-10 h-10 rounded-full bg-[#1f1f21] flex items-center justify-center text-[#c1c6d7] hover:text-[#e4e2e4] transition-colors relative cursor-pointer"
          >
            <span className="material-symbols-outlined">share</span>
            {copiedShare && (
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#1f1f21] border border-white/10 rounded text-[10px] text-white whitespace-nowrap">
                Kopyalandı!
              </span>
            )}
          </button>
          <button
            type="button"
            aria-label="Diğer seçenekler"
            onClick={() => alert('Görev seçenekleri menüsü')}
            className="w-10 h-10 rounded-full bg-[#1f1f21] flex items-center justify-center text-[#c1c6d7] hover:text-[#e4e2e4] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </div>
      </div>

      {/* Main Task Header Card */}
      <div className="bg-[#1f1f21] rounded-xl p-5 sm:p-6 flex flex-col gap-4 shadow-lg relative overflow-hidden border border-white/5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#adc6ff]/5 rounded-full blur-2xl pointer-events-none" />

        {/* Badges Row */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#93000a]/50 text-[#ffdad6]">
            {task.priority === 'high' ? 'Yüksek' : task.priority === 'medium' ? 'Orta' : 'Düşük'}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#4b8eff]/30 text-[#adc6ff]">
            {task.category === 'is' ? 'İş' : 'Kişisel'}
          </span>
          <span className="px-3 py-1 rounded-full text-xs bg-[#2a2a2c] text-[#c1c6d7] flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                task.completed ? 'bg-[#53e16f]' : 'bg-[#53e16f] animate-pulse'
              }`}
            />
            {task.completed ? 'Tamamlandı' : 'Devam Ediyor'}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-[#e4e2e4] tracking-tight">
          {task.title}
        </h1>

        {/* Date & Reminder */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-[#c1c6d7] border-t border-[#2a2a2c]/60 text-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#adc6ff] text-[20px]">schedule</span>
            <span>24 Ekim 2023, {task.time}</span>
          </div>
          <button
            type="button"
            onClick={() => setReminderActive(!reminderActive)}
            className="flex items-center gap-1.5 bg-[#2a2a2c]/60 hover:bg-[#2a2a2c] px-3 py-1.5 rounded-lg w-fit transition cursor-pointer"
          >
            <span
              className={`material-symbols-outlined text-[18px] ${
                reminderActive ? 'text-[#53e16f]' : 'text-[#c1c6d7]'
              }`}
            >
              {reminderActive ? 'notifications_active' : 'notifications_off'}
            </span>
            <span className="text-xs text-[#e4e2e4]">
              {reminderActive ? 'Hatırlatıcı Açık' : 'Hatırlatıcı Kapalı'}
            </span>
          </button>
        </div>
      </div>

      {/* Subtasks Section */}
      <div className="bg-[#1f1f21] rounded-xl p-5 flex flex-col gap-4 shadow-md border border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#adc6ff]">checklist</span>
            <h2 className="text-base font-semibold text-[#e4e2e4]">Alt Görevler</h2>
          </div>
          <span className="text-xs text-[#c1c6d7] bg-[#2a2a2c] px-3 py-0.5 rounded-full font-mono">
            {completedSubtasksCount}/{subtasks.length} Tamamlandı
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-[#2a2a2c] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#53e16f] rounded-full transition-all duration-300"
            style={{ width: `${subtasksProgress}%` }}
          />
        </div>

        {/* Subtask List */}
        <div className="flex flex-col gap-2 pt-1">
          {subtasks.map((sub) => (
            <label
              key={sub.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-[#1b1b1d] hover:bg-[#2a2a2c]/40 transition-colors cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={sub.completed}
                onChange={() => onToggleSubtask(task.id, sub.id)}
                className="w-5 h-5 rounded accent-[#53e16f] cursor-pointer"
              />
              <span
                className={`text-sm transition ${
                  sub.completed ? 'text-[#c1c6d7] line-through opacity-70' : 'text-[#e4e2e4]'
                }`}
              >
                {sub.title}
              </span>
            </label>
          ))}
        </div>

        {/* Add Subtask Input */}
        <form onSubmit={handleAddSubtaskSubmit} className="flex items-center gap-2 mt-1">
          <div className="flex-1 flex items-center bg-[#1b1b1d] rounded-lg px-3 py-2 gap-2 border border-white/5">
            <span className="material-symbols-outlined text-[#c1c6d7] text-[20px]">add</span>
            <input
              type="text"
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              placeholder="Yeni alt görev ekle..."
              className="bg-transparent border-none outline-none text-xs text-[#e4e2e4] placeholder:text-[#c1c6d7]/60 w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-[#adc6ff] text-[#002e69] px-4 py-2 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer shrink-0"
          >
            Ekle
          </button>
        </form>
      </div>

      {/* Rich Notes / Description Section */}
      <div className="bg-[#1f1f21] rounded-xl p-5 flex flex-col gap-3 shadow-md border border-white/5">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#adc6ff]">description</span>
          <h2 className="text-base font-semibold text-[#e4e2e4]">Notlar ve Açıklama</h2>
        </div>
        <div className="bg-[#1b1b1d] rounded-lg p-4 text-xs sm:text-sm text-[#c1c6d7] leading-relaxed border border-white/5">
          {task.notes || 'Bu görev için ek not bulunmuyor.'}
        </div>
      </div>

      {/* File Attachments Section */}
      <div className="bg-[#1f1f21] rounded-xl p-5 flex flex-col gap-4 shadow-md border border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#adc6ff]">folder</span>
            <h2 className="text-base font-semibold text-[#e4e2e4]">Eklenen Dosyalar</h2>
          </div>
          <span className="text-xs text-[#c1c6d7] font-mono">{attachments.length} Dosya</span>
        </div>

        {/* File Cards */}
        {attachments.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between bg-[#1b1b1d] p-3.5 rounded-lg group hover:bg-[#2a2a2c]/40 transition-colors border border-white/5"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#93000a]/40 text-[#ffb4ab] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">picture_as_pdf</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs sm:text-sm font-semibold text-[#e4e2e4] truncate">
                  {file.name}
                </span>
                <span className="text-[11px] text-[#c1c6d7]">
                  {file.size} • {file.type}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="İndir"
                onClick={() => alert(`${file.name} indiriliyor...`)}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-[#c1c6d7] hover:text-[#e4e2e4] hover:bg-[#2a2a2c] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">download</span>
              </button>
              <button
                type="button"
                aria-label="Sil"
                onClick={() => handleDeleteFile(file.id)}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-[#ffb4ab] hover:bg-[#93000a]/20 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">delete</span>
              </button>
            </div>
          </div>
        ))}

        {/* Add File Button */}
        <button
          type="button"
          onClick={handleAddFile}
          className="flex items-center justify-center gap-2 py-3 border-2 border-dashed border-[#414755]/40 rounded-lg text-[#adc6ff] hover:bg-[#adc6ff]/5 transition-colors text-xs font-semibold cursor-pointer"
        >
          <span className="material-symbols-outlined">upload_file</span>
          <span>Dosya Ekle</span>
        </button>
      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => onToggleTaskComplete(task.id)}
          className={`flex-1 py-3.5 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98] cursor-pointer ${
            task.completed
              ? 'bg-[#2a2a2c] text-[#c1c6d7] hover:bg-[#353437]'
              : 'bg-[#adc6ff] text-[#002e69] hover:opacity-95 shadow-[#adc6ff]/20'
          }`}
        >
          <span className="material-symbols-outlined">
            {task.completed ? 'undo' : 'check_circle'}
          </span>
          <span>{task.completed ? 'Görevi Geri Al' : 'Görevi Tamamla'}</span>
        </button>

        <button
          type="button"
          onClick={() => onDeleteTask(task.id)}
          className="bg-[#1f1f21] hover:bg-[#93000a]/20 text-[#ffb4ab] py-3.5 px-5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-white/5"
        >
          <span className="material-symbols-outlined">delete</span>
          <span>Sil</span>
        </button>
      </div>
    </div>
  );
};
