import React, { useState } from 'react';

export const FocusSettings: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [smartNotifications, setSmartNotifications] = useState(true);
  const [dailySummary, setDailySummary] = useState(true);
  const [soundVibration, setSoundVibration] = useState(true);
  const [faceId, setFaceId] = useState(true);

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Header & User Profile */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#e4e2e4]">Ayarlar</h1>
          <span className="material-symbols-outlined text-[#adc6ff] text-[24px]">settings</span>
        </div>

        {/* Profile Card */}
        <div className="bg-[#1f1f21] rounded-xl p-4 flex items-center gap-4 shadow-lg relative overflow-hidden border border-white/5">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#adc6ff]/10 rounded-full blur-xl pointer-events-none" />
          <div className="w-14 h-14 rounded-full bg-[#4b8eff] text-[#00285c] flex items-center justify-center text-xl font-bold shadow-inner shrink-0">
            B
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-base font-semibold text-[#e4e2e4] truncate">Barış</span>
            <span className="text-xs text-[#c1c6d7] truncate font-mono">baris@focusflow.app</span>
            <div className="flex items-center gap-1 mt-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#00a741]/30 text-[#72fe88] text-[10px] font-semibold">
                <span className="material-symbols-outlined text-[12px]">verified</span>
                Pro Üye
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="flex flex-col gap-6">
        {/* Appearance & Theme */}
        <div className="flex flex-col gap-2">
          <span className="text-xs text-[#c1c6d7] px-1 uppercase tracking-wider font-semibold">
            Görünüm ve Tema
          </span>
          <div className="bg-[#1f1f21] rounded-xl overflow-hidden flex flex-col divide-y divide-[#2a2a2c] border border-white/5">
            {/* Dark Mode */}
            <div className="flex items-center justify-between p-4 hover:bg-[#2a2a2c]/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#353437] flex items-center justify-center text-[#adc6ff]">
                  <span className="material-symbols-outlined text-[20px]">dark_mode</span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-[#e4e2e4]">Koyu Mod</span>
              </div>
              <div
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-7 rounded-full relative flex items-center px-1 cursor-pointer transition-colors shadow-inner ${
                  darkMode ? 'bg-[#adc6ff]' : 'bg-[#353437]'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-[#002e69] rounded-full shadow-md transform transition-transform ${
                    darkMode ? 'translate-x-5' : 'translate-x-0 bg-white'
                  }`}
                />
              </div>
            </div>

            {/* Accent Color */}
            <div
              onClick={() => alert('Vurgu Rengi: System Blue (Varsayılan)')}
              className="flex items-center justify-between p-4 hover:bg-[#2a2a2c]/40 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#353437] flex items-center justify-center text-[#e8b3ff]">
                  <span className="material-symbols-outlined text-[20px]">palette</span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-[#e4e2e4]">Vurgu Rengi</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[#4b8eff] ring-2 ring-[#adc6ff] ring-offset-2 ring-offset-[#131315]" />
                <span className="text-xs text-[#c1c6d7]">System Blue</span>
                <span className="material-symbols-outlined text-[#c1c6d7] text-[18px]">
                  chevron_right
                </span>
              </div>
            </div>

            {/* Dynamic Font Size */}
            <div
              onClick={() => alert('Dinamik Yazı Boyutu: Standart sistem font ölçeği')}
              className="flex items-center justify-between p-4 hover:bg-[#2a2a2c]/40 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#353437] flex items-center justify-center text-[#53e16f]">
                  <span className="material-symbols-outlined text-[20px]">text_fields</span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-[#e4e2e4]">
                  Dinamik Yazı Boyutu
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#c1c6d7]">Varsayılan</span>
                <span className="material-symbols-outlined text-[#c1c6d7] text-[18px]">
                  chevron_right
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications & Reminders */}
        <div className="flex flex-col gap-2">
          <span className="text-xs text-[#c1c6d7] px-1 uppercase tracking-wider font-semibold">
            Bildirimler ve Hatırlatıcılar
          </span>
          <div className="bg-[#1f1f21] rounded-xl overflow-hidden flex flex-col divide-y divide-[#2a2a2c] border border-white/5">
            {/* Smart Notifications */}
            <div className="flex items-center justify-between p-4 hover:bg-[#2a2a2c]/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#353437] flex items-center justify-center text-[#adc6ff]">
                  <span className="material-symbols-outlined text-[20px]">notifications_active</span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-[#e4e2e4]">
                  Akıllı Bildirimler
                </span>
              </div>
              <div
                onClick={() => setSmartNotifications(!smartNotifications)}
                className={`w-12 h-7 rounded-full relative flex items-center px-1 cursor-pointer transition-colors shadow-inner ${
                  smartNotifications ? 'bg-[#adc6ff]' : 'bg-[#353437]'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-[#002e69] rounded-full shadow-md transform transition-transform ${
                    smartNotifications ? 'translate-x-5' : 'translate-x-0 bg-white'
                  }`}
                />
              </div>
            </div>

            {/* Daily Summary */}
            <div className="flex items-center justify-between p-4 hover:bg-[#2a2a2c]/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#353437] flex items-center justify-center text-[#e8b3ff]">
                  <span className="material-symbols-outlined text-[20px]">today</span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-[#e4e2e4]">Günlük Özet</span>
              </div>
              <div
                onClick={() => setDailySummary(!dailySummary)}
                className={`w-12 h-7 rounded-full relative flex items-center px-1 cursor-pointer transition-colors shadow-inner ${
                  dailySummary ? 'bg-[#adc6ff]' : 'bg-[#353437]'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-[#002e69] rounded-full shadow-md transform transition-transform ${
                    dailySummary ? 'translate-x-5' : 'translate-x-0 bg-white'
                  }`}
                />
              </div>
            </div>

            {/* Sound & Vibration */}
            <div className="flex items-center justify-between p-4 hover:bg-[#2a2a2c]/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#353437] flex items-center justify-center text-[#53e16f]">
                  <span className="material-symbols-outlined text-[20px]">volume_up</span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-[#e4e2e4]">
                  Ses ve Titreşim
                </span>
              </div>
              <div
                onClick={() => setSoundVibration(!soundVibration)}
                className={`w-12 h-7 rounded-full relative flex items-center px-1 cursor-pointer transition-colors shadow-inner ${
                  soundVibration ? 'bg-[#adc6ff]' : 'bg-[#353437]'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-[#002e69] rounded-full shadow-md transform transition-transform ${
                    soundVibration ? 'translate-x-5' : 'translate-x-0 bg-white'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Data & Security */}
        <div className="flex flex-col gap-2">
          <span className="text-xs text-[#c1c6d7] px-1 uppercase tracking-wider font-semibold">
            Veri ve Güvenlik
          </span>
          <div className="bg-[#1f1f21] rounded-xl overflow-hidden flex flex-col divide-y divide-[#2a2a2c] border border-white/5">
            {/* Face ID */}
            <div className="flex items-center justify-between p-4 hover:bg-[#2a2a2c]/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#353437] flex items-center justify-center text-[#adc6ff]">
                  <span className="material-symbols-outlined text-[20px]">face</span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-[#e4e2e4]">
                  Face ID / Şifre Koruması
                </span>
              </div>
              <div
                onClick={() => setFaceId(!faceId)}
                className={`w-12 h-7 rounded-full relative flex items-center px-1 cursor-pointer transition-colors shadow-inner ${
                  faceId ? 'bg-[#adc6ff]' : 'bg-[#353437]'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-[#002e69] rounded-full shadow-md transform transition-transform ${
                    faceId ? 'translate-x-5' : 'translate-x-0 bg-white'
                  }`}
                />
              </div>
            </div>

            {/* Auto Backup */}
            <div
              onClick={() => alert('Otomatik iCloud / Cloudflare yedekleme aktif.')}
              className="flex items-center justify-between p-4 hover:bg-[#2a2a2c]/40 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#353437] flex items-center justify-center text-[#e8b3ff]">
                  <span className="material-symbols-outlined text-[20px]">cloud_sync</span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-[#e4e2e4]">
                  Otomatik Yedekleme
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#c1c6d7]">Aktif</span>
                <span className="material-symbols-outlined text-[#c1c6d7] text-[18px]">
                  chevron_right
                </span>
              </div>
            </div>

            {/* Logout */}
            <div
              onClick={() => alert('Oturum kapatıldı.')}
              className="flex items-center justify-between p-4 hover:bg-[#93000a]/20 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#93000a]/40 flex items-center justify-center text-[#ffb4ab]">
                  <span className="material-symbols-outlined text-[20px]">logout</span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-[#ffb4ab]">Çıkış Yap</span>
              </div>
              <span className="material-symbols-outlined text-[#ffb4ab] text-[18px]">
                chevron_right
              </span>
            </div>
          </div>
        </div>

        {/* About & Support */}
        <div className="flex flex-col gap-2">
          <span className="text-xs text-[#c1c6d7] px-1 uppercase tracking-wider font-semibold">
            Hakkında & Destek
          </span>
          <div className="bg-[#1f1f21] rounded-xl overflow-hidden flex flex-col divide-y divide-[#2a2a2c] border border-white/5">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#353437] flex items-center justify-center text-[#adc6ff]">
                  <span className="material-symbols-outlined text-[20px]">info</span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-[#e4e2e4]">Sürüm</span>
              </div>
              <span className="text-xs text-[#c1c6d7] font-mono">v2.4.1</span>
            </div>

            <div
              onClick={() => alert('Gizlilik Politikası açılıyor...')}
              className="flex items-center justify-between p-4 hover:bg-[#2a2a2c]/40 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#353437] flex items-center justify-center text-[#e8b3ff]">
                  <span className="material-symbols-outlined text-[20px]">shield</span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-[#e4e2e4]">
                  Gizlilik Politikası
                </span>
              </div>
              <span className="material-symbols-outlined text-[#c1c6d7] text-[18px]">
                chevron_right
              </span>
            </div>

            <div
              onClick={() => alert('Yardım Merkezi açılıyor...')}
              className="flex items-center justify-between p-4 hover:bg-[#2a2a2c]/40 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#353437] flex items-center justify-center text-[#53e16f]">
                  <span className="material-symbols-outlined text-[20px]">help</span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-[#e4e2e4]">Yardım Merkezi</span>
              </div>
              <span className="material-symbols-outlined text-[#c1c6d7] text-[18px]">
                chevron_right
              </span>
            </div>

            <div
              onClick={() => alert('Premium Üyelik Yönetimi: Pro Plan Aktif')}
              className="flex items-center justify-between p-4 hover:bg-[#2a2a2c]/40 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#00a741]/40 flex items-center justify-center text-[#72fe88]">
                  <span className="material-symbols-outlined text-[20px]">star</span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-[#e4e2e4]">
                  Premium'u Yönet
                </span>
              </div>
              <span className="material-symbols-outlined text-[#c1c6d7] text-[18px]">
                chevron_right
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
