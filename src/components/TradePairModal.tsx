import { ChevronDown, Star, X } from "lucide-react";
import { useState } from "react";

export interface PairItem {
  id: string;
  name: string;
  flags: readonly [string, string];
  profit1m: number;
  profit5m: number;
  change: string;
  isPositive: boolean;
  basePrice: number;
  decimals: number;
}

export const ALL_PAIRS: PairItem[] = [
  { id: "usd-cop", name: "USD/COP (OTC)", flags: ["🇺🇸", "🇨🇴"], profit1m: 82, profit5m: 82, change: "+0.13%", isPositive: true, basePrice: 4210.5, decimals: 2 },
  { id: "usd-dzd", name: "USD/DZD (OTC)", flags: ["🇺🇸", "🇩🇿"], profit1m: 88, profit5m: 88, change: "-0.22%", isPositive: false, basePrice: 133.45, decimals: 2 },
  { id: "gbp-cad", name: "GBP/CAD (OTC)", flags: ["🇬🇧", "🇨🇦"], profit1m: 88, profit5m: 88, change: "+0.45%", isPositive: true, basePrice: 1.7642, decimals: 4 },
  { id: "nzd-jpy", name: "NZD/JPY (OTC)", flags: ["🇳🇿", "🇯🇵"], profit1m: 90, profit5m: 90, change: "+0.80%", isPositive: true, basePrice: 91.24, decimals: 2 },
  { id: "usd-idr", name: "USD/IDR (OTC)", flags: ["🇺🇸", "🇮🇩"], profit1m: 77, profit5m: 77, change: "-0.15%", isPositive: false, basePrice: 15650, decimals: 1 },
  { id: "aud-nzd", name: "AUD/NZD (OTC)", flags: ["🇦🇺", "🇳🇿"], profit1m: 74, profit5m: 74, change: "+0.32%", isPositive: true, basePrice: 1.16343, decimals: 5 },
  { id: "nzd-usd", name: "NZD/USD (OTC)", flags: ["🇳🇿", "🇺🇸"], profit1m: 94, profit5m: 94, change: "-1.9%", isPositive: false, basePrice: 0.5892, decimals: 4 },
  { id: "chf-jpy", name: "CHF/JPY (OTC)", flags: ["🇨🇭", "🇯🇵"], profit1m: 93, profit5m: 92, change: "-0.41%", isPositive: false, basePrice: 172.45, decimals: 2 },
  { id: "usd-jpy", name: "USD/JPY (OTC)", flags: ["🇺🇸", "🇯🇵"], profit1m: 93, profit5m: 94, change: "+0.46%", isPositive: true, basePrice: 153.28, decimals: 2 },
  { id: "usd-zar", name: "USD/ZAR (OTC)", flags: ["🇺🇸", "🇿🇦"], profit1m: 93, profit5m: 93, change: "+0.15%", isPositive: true, basePrice: 17.65, decimals: 2 },
  { id: "usd-brl", name: "USD/BRL (OTC)", flags: ["🇺🇸", "🇧🇷"], profit1m: 92, profit5m: 92, change: "+0.75%", isPositive: true, basePrice: 5.72, decimals: 2 },
  { id: "gbp-aud", name: "GBP/AUD (OTC)", flags: ["🇬🇧", "🇦🇺"], profit1m: 91, profit5m: 93, change: "+1.38%", isPositive: true, basePrice: 1.942, decimals: 4 },
  { id: "usd-egp", name: "USD/EGP (OTC)", flags: ["🇺🇸", "🇪🇬"], profit1m: 91, profit5m: 92, change: "+0.06%", isPositive: true, basePrice: 48.9, decimals: 2 },
  { id: "gbp-jpy", name: "GBP/JPY (OTC)", flags: ["🇬🇧", "🇯🇵"], profit1m: 90, profit5m: 93, change: "-0.57%", isPositive: false, basePrice: 198.6, decimals: 2 },
  { id: "nzd-cad", name: "NZD/CAD (OTC)", flags: ["🇳🇿", "🇨🇦"], profit1m: 90, profit5m: 78, change: "+2.74%", isPositive: true, basePrice: 0.824, decimals: 4 },
];

export function TradePairModal({
  onSelect,
  onClose,
}: {
  onSelect: (pair: PairItem) => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"CURRENCIES" | "CRYPTO" | "COMMODITIES" | "STOCKS">("CURRENCIES");
  const [search, setSearch] = useState("");

  const filtered = ALL_PAIRS.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pair-modal-overlay" onClick={onClose}>
      <div className="w-full max-w-md mx-auto" onClick={(e) => e.stopPropagation()}>
        <div className="pair-modal-header">
          <span>Select trade pair</span>
          <X size={22} className="cursor-pointer text-muted-foreground hover:text-white" onClick={onClose} />
        </div>

        <div className="pair-category-tabs">
          {(["CURRENCIES", "CRYPTO", "COMMODITIES", "STOCKS"] as const).map((t) => (
            <button
              key={t}
              className={`pair-category-tab ${tab === t ? "active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="pair-search-row">
          <div className="pair-star-filter">
            <Star size={14} className="text-amber-500 fill-amber-500" />
            <span>0</span>
          </div>
          <div className="pair-search-input-wrap">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="pair-sort-row">
          <span>Sort by:</span>
          <b className="text-white flex items-center gap-1 cursor-pointer">
            Name <ChevronDown size={12} />
          </b>
        </div>

        <div className="flex flex-col">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="pair-item-row"
              onClick={() => {
                onSelect(p);
                onClose();
              }}
            >
              <div className="pair-item-left">
                <Star size={18} className="text-amber-500" />
                <div className="text-lg">{p.flags[0]}{p.flags[1]}</div>
                <div className="pair-item-info">
                  <b>{p.name}</b>
                  <small>
                    Profit 1+ min <em>{p.profit1m}%</em> 5+ min <em>{p.profit5m}%</em>
                  </small>
                </div>
              </div>

              <div className={`pair-change-pill ${p.isPositive ? "up" : "down"}`}>
                <span>{p.isPositive ? "↑" : "↓"}</span>
                <span>{p.change}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
