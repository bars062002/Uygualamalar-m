import React, { useState, useEffect } from 'react';

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallGuideModal: React.FC<InstallGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!isOpen) return null;

  const currentUrl = window.location.origin;

  const handleCopy = () => {
    navigator.clipboard?.writeText(currentUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg bg-[#1f1f21] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#adc6ff]">install_mobile</span>
            <h3 className="text-base font-bold text-[#e4e2e4]">Cihazlarınıza Yükleyin</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#c1c6d7] hover:text-[#e4e2e4]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Quick Share URL Card */}
          <div className="p-3.5 rounded-xl bg-[#1b1b1d] border border-white/5 space-y-2">
            <span className="text-[11px] font-semibold text-[#c1c6d7] block">
              Uygulama Bağlantısı (Tüm cihazlarınızdan açabilirsiniz):
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="flex-1 px-3 py-2 bg-[#131315] border border-white/10 rounded-lg text-xs font-mono text-[#adc6ff] select-all"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-2 bg-[#adc6ff] text-[#002e69] rounded-lg font-semibold text-xs hover:opacity-90 transition shrink-0"
              >
                {copiedUrl ? 'Kopyalandı!' : 'Kopyala'}
              </button>
            </div>
          </div>

          {/* Android / Chrome One-Click Install */}
          {deferredPrompt && (
            <button
              type="button"
              onClick={handleNativeInstall}
              className="w-full py-3 bg-[#adc6ff] text-[#002e69] font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#adc6ff]/20 hover:opacity-95 transition"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Uygulamayı Doğrudan Yükle (1 Tık)</span>
            </button>
          )}

          {/* iOS Safari Guide */}
          <div className="p-4 rounded-xl bg-[#2a2a2c]/60 border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-[#e8b3ff] font-semibold text-xs sm:text-sm">
              <span className="material-symbols-outlined text-[20px]">phone_iphone</span>
              <span>iPhone & iPad (Safari)</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-[#c1c6d7] leading-relaxed pl-1 text-[11px] sm:text-xs">
              <li>Yukarıdaki bağlantıyı iPhone veya iPad'inizde <strong>Safari</strong> ile açın.</li>
              <li>Alt çubuktaki <strong>Paylaş (Share)</strong> simgesine dokunun (yukarı oklu kutu).</li>
              <li>Açılan menüde aşağı kaydırıp <strong>"Ana Ekrana Ekle" (Add to Home Screen)</strong> seçeneğine dokunun.</li>
              <li>Sağ üstteki <strong>Ekle</strong> butonuna basın.</li>
              <li>Artık FocusFlow ana ekranınızda bağımsız, tam ekran bir iOS uygulaması olarak yer alacaktır.</li>
            </ol>
          </div>

          {/* Android Guide */}
          <div className="p-4 rounded-xl bg-[#2a2a2c]/60 border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-[#72fe88] font-semibold text-xs sm:text-sm">
              <span className="material-symbols-outlined text-[20px]">android</span>
              <span>Android Telefon & Tablet (Chrome)</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-[#c1c6d7] leading-relaxed pl-1 text-[11px] sm:text-xs">
              <li>Bağlantıyı <strong>Chrome</strong> tarayıcısında açın.</li>
              <li>Sağ üst köşedeki <strong>üç nokta (⋮)</strong> menüsüne dokunun.</li>
              <li><strong>"Uygulamayı Yükle" (Install app)</strong> veya <strong>"Ana Ekrana Ekle"</strong> seçeneğini seçin.</li>
            </ol>
          </div>

          {/* Desktop Mac & PC Guide */}
          <div className="p-4 rounded-xl bg-[#2a2a2c]/60 border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-[#adc6ff] font-semibold text-xs sm:text-sm">
              <span className="material-symbols-outlined text-[20px]">desktop_mac</span>
              <span>Mac & Windows PC (Chrome, Edge, Safari)</span>
            </div>
            <p className="text-[#c1c6d7] leading-relaxed text-[11px] sm:text-xs">
              Adres çubuğunun en sağındaki küçük <strong>"Uygulamayı Yükle" (veya + simgesi)</strong> butonuna tıklayarak bilgisayarınızda bağımsız pencerede çalışan masaüstü uygulaması haline getirebilirsiniz.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#131315] border-t border-white/5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#adc6ff] text-[#002e69] font-semibold rounded-lg text-xs"
          >
            Anladım
          </button>
        </div>
      </div>
    </div>
  );
};
