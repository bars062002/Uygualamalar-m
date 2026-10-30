import React, { useState } from 'react';

export const FocusStats: React.FC = () => {
  const [activeRange, setActiveRange] = useState<'hafta' | 'ay' | 'tumu'>('hafta');

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Top Section: Filter Pills */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-[#e4e2e4]">İstatistikler</h1>
          <p className="text-xs text-[#c1c6d7]">Performans ve verimlilik özetiniz</p>
        </div>
        <div className="flex bg-[#1f1f21] rounded-xl p-1 gap-1 border border-white/5">
          <button
            type="button"
            onClick={() => setActiveRange('hafta')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeRange === 'hafta'
                ? 'bg-[#adc6ff] text-[#002e69] shadow-sm'
                : 'text-[#c1c6d7] hover:text-[#e4e2e4]'
            }`}
          >
            Bu Hafta
          </button>
          <button
            type="button"
            onClick={() => setActiveRange('ay')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeRange === 'ay'
                ? 'bg-[#adc6ff] text-[#002e69] shadow-sm'
                : 'text-[#c1c6d7] hover:text-[#e4e2e4]'
            }`}
          >
            Bu Ay
          </button>
          <button
            type="button"
            onClick={() => setActiveRange('tumu')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeRange === 'tumu'
                ? 'bg-[#adc6ff] text-[#002e69] shadow-sm'
                : 'text-[#c1c6d7] hover:text-[#e4e2e4]'
            }`}
          >
            Tümü
          </button>
        </div>
      </div>

      {/* Productivity Score Hero Card */}
      <div className="relative bg-[#1f1f21] rounded-xl p-5 sm:p-6 mb-6 overflow-hidden shadow-xl border border-white/5">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#adc6ff]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between relative z-10">
          <div className="flex flex-col">
            <span className="text-xs text-[#c1c6d7] uppercase tracking-wider mb-1 font-semibold">
              Genel Verimlilik
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-[#e4e2e4] font-mono">94%</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#53e16f]/20 text-[#53e16f] text-xs font-semibold">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                +12%
              </span>
            </div>
            <p className="text-xs text-[#c1c6d7] mt-2">
              Geçen haftaya göre harika bir ivme yakaladınız!
            </p>
          </div>
          <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
            {/* SVG Progress Ring */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#2a2a2c]"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
              />
              <path
                className="text-[#adc6ff]"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeDasharray="94, 100"
                strokeLinecap="round"
                strokeWidth="3.5"
              />
            </svg>
            <span className="absolute material-symbols-outlined text-[#adc6ff] text-3xl">bolt</span>
          </div>
        </div>
      </div>

      {/* Key Metric Cards 2x2 Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {/* Card 1 */}
        <div className="bg-[#1f1f21] rounded-xl p-4 flex flex-col justify-between shadow-md border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#adc6ff]/10 flex items-center justify-center text-[#adc6ff]">
              <span className="material-symbols-outlined">task_alt</span>
            </div>
            <span className="text-[#53e16f] text-[11px] font-semibold bg-[#53e16f]/10 px-2 py-0.5 rounded-md">
              +5 bu hafta
            </span>
          </div>
          <div>
            <span className="text-2xl font-bold text-[#e4e2e4] font-mono">42</span>
            <p className="text-xs text-[#c1c6d7] mt-0.5">Tamamlanan Görevler</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#1f1f21] rounded-xl p-4 flex flex-col justify-between shadow-md border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#e8b3ff]/10 flex items-center justify-center text-[#e8b3ff]">
              <span className="material-symbols-outlined">timer</span>
            </div>
            <span className="text-[#e8b3ff] text-[11px] font-semibold bg-[#e8b3ff]/10 px-2 py-0.5 rounded-md">
              Derin Çalışma
            </span>
          </div>
          <div>
            <span className="text-2xl font-bold text-[#e4e2e4] font-mono">28s 40dk</span>
            <p className="text-xs text-[#c1c6d7] mt-0.5">Odaklanma Süresi</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-[#1f1f21] rounded-xl p-4 flex flex-col justify-between shadow-md border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#53e16f]/10 flex items-center justify-center text-[#53e16f]">
              <span className="material-symbols-outlined">local_fire_department</span>
            </div>
            <span className="text-[#53e16f] text-[11px] font-semibold bg-[#53e16f]/10 px-2 py-0.5 rounded-md">
              Aktif Seri
            </span>
          </div>
          <div>
            <span className="text-2xl font-bold text-[#e4e2e4] font-mono">7 Gün</span>
            <p className="text-xs text-[#c1c6d7] mt-0.5">Kesintisiz Seri</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-[#1f1f21] rounded-xl p-4 flex flex-col justify-between shadow-md border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#4b8eff]/20 flex items-center justify-center text-[#adc6ff]">
              <span className="material-symbols-outlined">verified</span>
            </div>
            <span className="text-[#adc6ff] text-[11px] font-semibold bg-[#adc6ff]/10 px-2 py-0.5 rounded-md">
              Mükemmel
            </span>
          </div>
          <div>
            <span className="text-2xl font-bold text-[#e4e2e4] font-mono">%98</span>
            <p className="text-xs text-[#c1c6d7] mt-0.5">Zamanında Teslim</p>
          </div>
        </div>
      </div>

      {/* Weekly Activity Chart Section */}
      <div className="bg-[#1f1f21] rounded-xl p-5 mb-6 shadow-xl border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-[#e4e2e4]">Haftalık Aktivite</h2>
            <p className="text-xs text-[#c1c6d7]">Günlük tamamlanan görev dağılımı</p>
          </div>
          <span className="text-xs text-[#adc6ff] bg-[#adc6ff]/10 px-2.5 py-1 rounded-lg font-mono">
            Ort. 6 görev/gün
          </span>
        </div>

        {/* Bar Chart */}
        <div className="flex items-end justify-between h-36 pt-6 px-2">
          {/* Pzt */}
          <div className="flex flex-col items-center gap-2 flex-1 group">
            <div className="w-8 bg-[#353437] rounded-t-lg relative h-full flex items-end overflow-hidden">
              <div
                className="w-full bg-[#adc6ff]/40 rounded-t-lg transition-all duration-500 group-hover:bg-[#adc6ff]"
                style={{ height: '60%' }}
              />
            </div>
            <span className="text-xs text-[#c1c6d7]">Pzt</span>
          </div>

          {/* Sal */}
          <div className="flex flex-col items-center gap-2 flex-1 group">
            <div className="w-8 bg-[#353437] rounded-t-lg relative h-full flex items-end overflow-hidden">
              <div
                className="w-full bg-[#adc6ff]/40 rounded-t-lg transition-all duration-500 group-hover:bg-[#adc6ff]"
                style={{ height: '85%' }}
              />
            </div>
            <span className="text-xs text-[#c1c6d7]">Sal</span>
          </div>

          {/* Çar */}
          <div className="flex flex-col items-center gap-2 flex-1 group">
            <div className="w-8 bg-[#353437] rounded-t-lg relative h-full flex items-end overflow-hidden">
              <div
                className="w-full bg-[#adc6ff] rounded-t-lg transition-all duration-500 shadow-md shadow-[#adc6ff]/30"
                style={{ height: '100%' }}
              />
            </div>
            <span className="text-xs text-[#e4e2e4] font-bold">Çar</span>
          </div>

          {/* Per */}
          <div className="flex flex-col items-center gap-2 flex-1 group">
            <div className="w-8 bg-[#353437] rounded-t-lg relative h-full flex items-end overflow-hidden">
              <div
                className="w-full bg-[#adc6ff]/40 rounded-t-lg transition-all duration-500 group-hover:bg-[#adc6ff]"
                style={{ height: '70%' }}
              />
            </div>
            <span className="text-xs text-[#c1c6d7]">Per</span>
          </div>

          {/* Cum */}
          <div className="flex flex-col items-center gap-2 flex-1 group">
            <div className="w-8 bg-[#353437] rounded-t-lg relative h-full flex items-end overflow-hidden">
              <div
                className="w-full bg-[#adc6ff]/40 rounded-t-lg transition-all duration-500 group-hover:bg-[#adc6ff]"
                style={{ height: '90%' }}
              />
            </div>
            <span className="text-xs text-[#c1c6d7]">Cum</span>
          </div>

          {/* Cmt */}
          <div className="flex flex-col items-center gap-2 flex-1 group">
            <div className="w-8 bg-[#353437] rounded-t-lg relative h-full flex items-end overflow-hidden">
              <div
                className="w-full bg-[#353437] rounded-t-lg"
                style={{ height: '30%' }}
              />
            </div>
            <span className="text-xs text-[#c1c6d7]">Cmt</span>
          </div>

          {/* Paz */}
          <div className="flex flex-col items-center gap-2 flex-1 group">
            <div className="w-8 bg-[#353437] rounded-t-lg relative h-full flex items-end overflow-hidden">
              <div
                className="w-full bg-[#353437] rounded-t-lg"
                style={{ height: '15%' }}
              />
            </div>
            <span className="text-xs text-[#c1c6d7]">Paz</span>
          </div>
        </div>
      </div>

      {/* Category Breakdown Section */}
      <div className="bg-[#1f1f21] rounded-xl p-5 mb-6 shadow-xl border border-white/5">
        <h2 className="text-base font-semibold text-[#e4e2e4] mb-1">Kategori Dağılımı</h2>
        <p className="text-xs text-[#c1c6d7] mb-4">
          Çalışma alanlarınıza göre süre ve görev yoğunluğu
        </p>

        <div className="flex flex-col gap-4">
          {/* Kategori 1 */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-[#e4e2e4] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#adc6ff]" />
                İş Projeleri
              </span>
              <span className="text-[#c1c6d7] font-mono">45%</span>
            </div>
            <div className="w-full h-2.5 bg-[#353437] rounded-full overflow-hidden">
              <div className="bg-[#adc6ff] h-full rounded-full" style={{ width: '45%' }} />
            </div>
          </div>

          {/* Kategori 2 */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-[#e4e2e4] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#e8b3ff]" />
                Kişisel Gelişim
              </span>
              <span className="text-[#c1c6d7] font-mono">30%</span>
            </div>
            <div className="w-full h-2.5 bg-[#353437] rounded-full overflow-hidden">
              <div className="bg-[#e8b3ff] h-full rounded-full" style={{ width: '30%' }} />
            </div>
          </div>

          {/* Kategori 3 */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-[#e4e2e4] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#53e16f]" />
                Tasarım & UI
              </span>
              <span className="text-[#c1c6d7] font-mono">25%</span>
            </div>
            <div className="w-full h-2.5 bg-[#353437] rounded-full overflow-hidden">
              <div className="bg-[#53e16f] h-full rounded-full" style={{ width: '25%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Focus Habits / Insights Card */}
      <div className="bg-[#1f1f21] rounded-xl p-5 shadow-xl relative overflow-hidden border border-white/5">
        <div className="absolute right-0 top-0 w-32 h-32 bg-[#e8b3ff]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#e8b3ff]/15 flex items-center justify-center text-[#e8b3ff] shrink-0">
            <span className="material-symbols-outlined text-2xl">lightbulb</span>
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#e4e2e4] mb-1">
              Odaklanma Alışkanlıkları
            </h3>
            <p className="text-xs text-[#c1c6d7] mb-3 leading-relaxed">
              En verimli saatleriniz <strong className="text-[#e4e2e4] font-semibold">10:00 - 13:00</strong> arası. Bu zaman diliminde karmaşık görevleri tamamlama oranınız %40 daha yüksek.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#2a2a2c] text-[#e4e2e4] text-xs">
              <span className="material-symbols-outlined text-[16px] text-[#adc6ff]">
                auto_awesome
              </span>
              <span>Sabah seanslarını artırmanızı öneririz</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
