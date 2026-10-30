import React, { useState } from 'react';
import { TaskItem } from '../data/focusData';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (newTask: Omit<TaskItem, 'id'>) => void;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({ isOpen, onClose, onAddTask }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'is' | 'kisisel'>('is');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('high');
  const [time, setTime] = useState('14:00 - 15:30');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      category,
      priority,
      time: time.trim() || '14:00',
      date: '2023-10-24',
      completed: false,
      notes: notes.trim(),
      subtasks: [],
      attachments: [],
      reminder: true,
    });

    setTitle('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-[#1f1f21] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 sm:p-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#adc6ff]">add_task</span>
            <h3 className="text-base font-bold text-[#e4e2e4]">Yeni Görev Oluştur</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#c1c6d7] hover:text-[#e4e2e4]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          <div>
            <label className="block text-[#c1c6d7] font-semibold mb-1">Görev Başlığı</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn: Q3 Finansal Rapor Sunumu Hazırlığı"
              className="w-full px-3 py-2.5 bg-[#1b1b1d] border border-white/10 rounded-xl text-sm text-[#e4e2e4] placeholder:text-[#c1c6d7]/50 focus:outline-none focus:ring-1 focus:ring-[#adc6ff]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#c1c6d7] font-semibold mb-1">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#1b1b1d] border border-white/10 rounded-xl text-xs text-[#e4e2e4]"
              >
                <option value="is">İş</option>
                <option value="kisisel">Kişisel</option>
              </select>
            </div>
            <div>
              <label className="block text-[#c1c6d7] font-semibold mb-1">Öncelik</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#1b1b1d] border border-white/10 rounded-xl text-xs text-[#e4e2e4]"
              >
                <option value="high">Yüksek</option>
                <option value="medium">Orta</option>
                <option value="low">Düşük</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#c1c6d7] font-semibold mb-1">Saat Dilimi</label>
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="Örn: 14:00 - 15:30"
              className="w-full px-3 py-2 bg-[#1b1b1d] border border-white/10 rounded-xl text-xs text-[#e4e2e4] font-mono"
            />
          </div>

          <div>
            <label className="block text-[#c1c6d7] font-semibold mb-1">Açıklama ve Notlar</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Yönetim kurulu için finansal metrikler ve büyüme analizi..."
              className="w-full px-3 py-2 bg-[#1b1b1d] border border-white/10 rounded-xl text-xs text-[#e4e2e4] placeholder:text-[#c1c6d7]/50"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#c1c6d7] hover:text-[#e4e2e4]"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#adc6ff] text-[#002e69] text-xs font-semibold rounded-xl hover:opacity-90 transition active:scale-95 shadow-md"
            >
              Görevi Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
