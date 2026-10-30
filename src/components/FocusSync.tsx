import React, { useState } from 'react';
import { ConnectedDevice, INITIAL_DEVICES } from '../data/focusData';

export const FocusSync: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncSuccess, setSyncSuccess] = useState<boolean>(false);
  const [autoBackground, setAutoBackground] = useState<boolean>(true);
  const [wifiOnly, setWifiOnly] = useState<boolean>(true);
  const [devices] = useState<ConnectedDevice[]>(INITIAL_DEVICES);

  const handleTriggerSync = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncSuccess(false);

    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => {
        setSyncSuccess(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Header / Title area */}
      <div className="flex items-center justify-between mb-6 pt-2">
        <div>
          <h1 className="text-2xl font-bold text-[#e4e2e4]">Senkronizasyon</h1>
          <p className="text-xs text-[#c1c6d7]">Tüm cihazlarınız kusursuz bir uyum içinde çalışıyor</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2a2a2c] text-[#53e16f]">
          <span className="w-2 h-2 rounded-full bg-[#53e16f] animate-pulse" />
          <span className="text-xs font-semibold">Aktif & Eşitlendi</span>
        </div>
      </div>

      {/* Cloud Status Card */}
      <div className="relative overflow-hidden rounded-xl bg-[#353437] p-5 sm:p-6 mb-6 shadow-xl backdrop-blur-xl border border-white/5">
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-[#adc6ff]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#4b8eff] flex items-center justify-center text-[#00285c] shadow-inner">
              <span className="material-symbols-outlined text-[24px]">cloud_sync</span>
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#e4e2e4]">FocusFlow Cloud Depolama</h2>
              <p className="text-xs text-[#c1c6d7]">Son eşitleme: {syncSuccess ? 'Şimdi' : '2 dakika önce'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleTriggerSync}
            disabled={isSyncing}
            className="w-10 h-10 rounded-full bg-[#2a2a2c] flex items-center justify-center text-[#c1c6d7] hover:text-[#e4e2e4] transition-colors cursor-pointer"
          >
            <span className={`material-symbols-outlined ${isSyncing ? 'animate-spin' : ''}`}>
              refresh
            </span>
          </button>
        </div>

        {/* Storage Usage */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-1.5 text-xs">
            <span className="text-[#c1c6d7]">Depolama Alanı</span>
            <span className="text-[#e4e2e4] font-medium font-mono">4.2 GB / 10 GB (Şifreli)</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#1f1f21] overflow-hidden">
            <div className="h-full bg-[#adc6ff] rounded-full transition-all duration-500" style={{ width: '42%' }} />
          </div>
        </div>

        {/* Sync Now Button */}
        <button
          type="button"
          onClick={handleTriggerSync}
          disabled={isSyncing}
          className={`w-full py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg cursor-pointer ${
            syncSuccess
              ? 'bg-[#00a741] text-[#00320e]'
              : 'bg-[#adc6ff] text-[#002e69] hover:opacity-90 shadow-[#adc6ff]/20'
          }`}
        >
          <span className={`material-symbols-outlined ${isSyncing ? 'animate-spin' : ''}`}>
            {syncSuccess ? 'check_circle' : 'sync'}
          </span>
          <span>{isSyncing ? 'Eşitleniyor...' : syncSuccess ? 'Eşitlendi!' : 'Hemen Eşitle'}</span>
        </button>
      </div>

      {/* Connected Devices Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-[#e4e2e4]">Bağlı Cihazlar ({devices.length})</h3>
          <button
            type="button"
            onClick={() => alert('Cihaz yönetim paneli')}
            className="text-xs font-semibold text-[#adc6ff] hover:underline cursor-pointer"
          >
            Tümünü Yönet
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {devices.map((device) => {
            const iconName =
              device.type === 'phone'
                ? 'phone_iphone'
                : device.type === 'tablet'
                ? 'tablet_mac'
                : 'desktop_mac';

            const iconColor =
              device.type === 'phone'
                ? 'text-[#adc6ff]'
                : device.type === 'tablet'
                ? 'text-[#e8b3ff]'
                : 'text-[#53e16f]';

            return (
              <div
                key={device.id}
                className="p-3.5 rounded-xl bg-[#2a2a2c] flex items-center justify-between border border-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-[#1f1f21] flex items-center justify-center ${iconColor}`}>
                    <span className="material-symbols-outlined">{iconName}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#e4e2e4]">{device.name}</span>
                      {device.isCurrent && (
                        <span className="px-2 py-0.5 rounded-full bg-[#adc6ff]/20 text-[#adc6ff] text-[10px] font-bold">
                          Bu Cihaz
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#c1c6d7]">
                      {device.battery ? `Pil: ${device.battery} • ` : ''}Son eşitleme: {device.lastSync}
                    </p>
                  </div>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#53e16f] shadow-sm shadow-[#53e16f]/50" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Sync Settings & Options */}
      <div className="mb-6">
        <h3 className="text-base font-semibold text-[#e4e2e4] mb-3">Eşitleme Ayarları</h3>
        <div className="rounded-xl bg-[#2a2a2c] overflow-hidden divide-y divide-[#353437] border border-white/5">
          {/* Toggle 1 */}
          <div className="p-4 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-[#e4e2e4]">Otomatik Arka Plan</h4>
              <p className="text-xs text-[#c1c6d7]">Değişiklikleri anında buluta yansıt</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoBackground}
                onChange={(e) => setAutoBackground(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#1f1f21] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#adc6ff]" />
            </label>
          </div>

          {/* Toggle 2 */}
          <div className="p-4 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-[#e4e2e4]">Yalnızca Wi-Fi Üzerinden</h4>
              <p className="text-xs text-[#c1c6d7]">Hücresel veri kullanımını sınırla</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={wifiOnly}
                onChange={(e) => setWifiOnly(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#1f1f21] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#adc6ff]" />
            </label>
          </div>

          {/* Toggle 3 */}
          <div
            onClick={() => alert('Çakışma kuralı: En son değişiklik geçerlidir.')}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#353437]/40 transition"
          >
            <div>
              <h4 className="text-sm font-medium text-[#e4e2e4]">Çakışma Çözümü</h4>
              <p className="text-xs text-[#c1c6d7]">En Son Değişiklik Esastır</p>
            </div>
            <span className="material-symbols-outlined text-[#c1c6d7]">chevron_right</span>
          </div>
        </div>
      </div>

      {/* Activity Log / Geçmiş */}
      <div>
        <h3 className="text-base font-semibold text-[#e4e2e4] mb-3">Son Aktiviteler</h3>
        <div className="rounded-xl bg-[#2a2a2c] p-4 flex flex-col gap-3 border border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#53e16f]/20 flex items-center justify-center text-[#53e16f]">
                <span className="material-symbols-outlined text-[16px]">check</span>
              </div>
              <div>
                <p className="text-xs font-medium text-[#e4e2e4]">Projeler başarıyla eşitlendi</p>
                <p className="text-[11px] text-[#c1c6d7]">14 öğe güncellendi • iPhone 15 Pro</p>
              </div>
            </div>
            <span className="text-xs text-[#c1c6d7] font-mono">14:20</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#53e16f]/20 flex items-center justify-center text-[#53e16f]">
                <span className="material-symbols-outlined text-[16px]">check</span>
              </div>
              <div>
                <p className="text-xs font-medium text-[#e4e2e4]">Takvim etkinlikleri senkronize edildi</p>
                <p className="text-[11px] text-[#c1c6d7]">3 ajanda kaydı • Mac Studio</p>
              </div>
            </div>
            <span className="text-xs text-[#c1c6d7] font-mono">13:05</span>
          </div>
        </div>
      </div>
    </div>
  );
};
