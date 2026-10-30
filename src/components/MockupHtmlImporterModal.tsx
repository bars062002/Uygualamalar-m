import React, { useState } from 'react';
import { Code, Check, Image as ImageIcon, ExternalLink, X, Sparkles, RefreshCw } from 'lucide-react';
import { Retreat } from '../data/mockData';

interface MockupHtmlImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  retreats: Retreat[];
  onApplyHotlinkedImage: (retreatId: string, newImageUrl: string) => void;
}

export const MockupHtmlImporterModal: React.FC<MockupHtmlImporterModalProps> = ({
  isOpen,
  onClose,
  retreats,
  onApplyHotlinkedImage,
}) => {
  const [htmlInput, setHtmlInput] = useState<string>(`<!-- Paste your HTML snippet below with <img> tags or image URLs -->
<div class="screen-card">
  <img src="/src/assets/images/hero_nordic_cabin_1793335982854.jpg" alt="Nordic Cabin Sanctuary" />
  <img src="/src/assets/images/retreat_coastal_villa_1793335984131.jpg" alt="Cliffside Modern Villa" />
  <img src="/src/assets/images/retreat_desert_pavilion_1793335984336.jpg" alt="High Desert Pavilion" />
  <img src="/src/assets/images/retreat_mountain_loft_1793335984466.jpg" alt="Alpine Timber Chalet" />
</div>`);

  const [extractedUrls, setExtractedUrls] = useState<string[]>([]);
  const [selectedTargetRetreat, setSelectedTargetRetreat] = useState<string>(retreats[0]?.id || '');
  const [appliedUrl, setAppliedUrl] = useState<string | null>(null);

  const handleExtractImages = React.useCallback(() => {
    // Regex to extract src from <img ... src="..." /> or any direct image url
    const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
    const directUrlRegex = /(https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp|avif|svg))/gi;

    const urls = new Set<string>();

    let match;
    while ((match = imgRegex.exec(htmlInput)) !== null) {
      if (match[1]) urls.add(match[1]);
    }

    while ((match = directUrlRegex.exec(htmlInput)) !== null) {
      if (match[1]) urls.add(match[1]);
    }

    // Also look for local asset paths
    const localAssetRegex = /(\/src\/assets\/images\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp))/gi;
    while ((match = localAssetRegex.exec(htmlInput)) !== null) {
      if (match[1]) urls.add(match[1]);
    }

    setExtractedUrls(Array.from(urls));
  }, [htmlInput]);

  React.useEffect(() => {
    handleExtractImages();
  }, [handleExtractImages]);

  if (!isOpen) return null;

  const handleApply = (url: string) => {
    if (!selectedTargetRetreat) return;
    onApplyHotlinkedImage(selectedTargetRetreat, url);
    setAppliedUrl(url);
    setTimeout(() => setAppliedUrl(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-xl bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100">
                HTML & Image Hotlink Importer
              </h3>
              <p className="text-[11px] text-stone-500">
                Paste raw HTML or image hotlinks to extract and map into screens
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-semibold text-stone-700 dark:text-stone-300">
                HTML Snippet or Hotlink URLs
              </label>
              <button
                type="button"
                onClick={handleExtractImages}
                className="text-stone-900 dark:text-stone-100 font-semibold hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Parse Images</span>
              </button>
            </div>
            <textarea
              rows={5}
              value={htmlInput}
              onChange={(e) => setHtmlInput(e.target.value)}
              placeholder="Paste HTML containing <img> tags or direct image URLs..."
              className="w-full p-3 font-mono text-[11px] bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-stone-900"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExtractImages}
              className="px-4 py-2 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-semibold rounded-lg hover:opacity-90 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Extract Hotlinked Images ({extractedUrls.length})</span>
            </button>
          </div>

          {/* Target Retreat Selector */}
          <div className="p-3 rounded-xl bg-stone-100/70 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-2">
            <label className="block font-semibold text-stone-700 dark:text-stone-300">
              Apply Extracted Image To Retreat Card:
            </label>
            <select
              value={selectedTargetRetreat}
              onChange={(e) => setSelectedTargetRetreat(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 font-medium text-xs"
            >
              {retreats.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title} ({r.location})
                </option>
              ))}
            </select>
          </div>

          {/* Extracted Images Grid */}
          <div className="space-y-2">
            <div className="font-semibold text-stone-700 dark:text-stone-300 flex items-center justify-between">
              <span>Parsed Image Assets</span>
              <span className="text-[11px] text-stone-400 font-mono">{extractedUrls.length} found</span>
            </div>

            {extractedUrls.length === 0 ? (
              <div className="p-4 text-center border border-dashed border-stone-200 dark:border-stone-800 rounded-xl text-stone-400">
                Click "Extract Hotlinked Images" above to parse all &lt;img src="..."&gt; tags from your HTML.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 max-h-56 overflow-y-auto p-1">
                {extractedUrls.map((url, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/80 space-y-2"
                  >
                    <div className="aspect-16/10 rounded-lg overflow-hidden bg-stone-200 dark:bg-stone-700 relative">
                      <img
                        src={url}
                        alt={`Extracted ${i + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="truncate max-w-[130px] text-[10px] text-stone-500 font-mono">
                        {url.split('/').pop()}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleApply(url)}
                        className="px-2.5 py-1 text-[10px] font-semibold bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 rounded-md hover:opacity-90 transition"
                      >
                        {appliedUrl === url ? 'Applied!' : 'Use on Card'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 dark:bg-stone-800/50 border-t border-stone-100 dark:border-stone-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-semibold rounded-lg text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
