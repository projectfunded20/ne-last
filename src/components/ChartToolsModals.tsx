import { ArrowLeft, Check, ChevronRight, Trash2, X } from "lucide-react";
import { useState } from "react";

export function TimeframePopover({
  current = "1m",
  onSelect,
}: {
  current?: string;
  onSelect: (tf: string) => void;
}) {
  const timeframes = [
    "5s", "10s", "15s",
    "30s", "1m", "2m",
    "3m", "5m", "10m",
    "15m", "30m", "1h",
    "4h", "1d",
  ];

  return (
    <div className="timeframe-popover" onClick={(e) => e.stopPropagation()}>
      {timeframes.map((tf) => (
        <div
          key={tf}
          className={`timeframe-item ${current === tf ? "active" : ""}`}
          onClick={() => onSelect(tf)}
        >
          {tf}
        </div>
      ))}
    </div>
  );
}

export function ChartTypePopover({
  current = "Candles",
  onSelect,
}: {
  current?: string;
  onSelect: (ct: string) => void;
}) {
  const types = [
    { id: "Area", icon: "📈", label: "Area" },
    { id: "Candles", icon: "🕯️", label: "Candles" },
    { id: "Bars", icon: "📊", label: "Bars" },
    { id: "Heiken Ashi", icon: "🏮", label: "Heiken Ashi" },
  ];

  return (
    <div className="chart-type-popover" onClick={(e) => e.stopPropagation()}>
      {types.map((t) => (
        <div
          key={t.id}
          className={`chart-type-item ${current === t.id ? "active" : ""}`}
          onClick={() => onSelect(t.id)}
        >
          <span>{t.icon}</span>
          <span>{t.label}</span>
        </div>
      ))}
    </div>
  );
}

export function IndicatorsModal({
  onSelectKeltner,
  onClose,
}: {
  onSelectKeltner: () => void;
  onClose: () => void;
}) {
  const trend = [
    "Alligator",
    "Bollinger Bands",
    "Envelopes",
    "Fractal",
    "Ichimoku Cloud",
    "Keltner channel",
    "Donchian channel",
    "Supertrend",
    "Moving Average",
    "Parabolic SAR",
    "Zig Zag",
  ];

  const oscillators = [
    "ADX",
    "Aroon",
    "Awesome Oscillator",
    "Bears power",
  ];

  return (
    <div className="indicators-modal-overlay" onClick={onClose}>
      <div className="w-full max-w-md mx-auto" onClick={(e) => e.stopPropagation()}>
        <div className="deposit-header">
          <span>Indicators</span>
          <X size={22} className="cursor-pointer text-muted-foreground hover:text-white" onClick={onClose} />
        </div>

        <div className="indicator-section-head">TREND INDICATORS</div>
        {trend.map((name) => (
          <div
            key={name}
            className="indicator-list-row"
            onClick={() => {
              if (name === "Keltner channel") onSelectKeltner();
            }}
          >
            <span>{name}</span>
            <ChevronRight size={16} className="text-muted-foreground" />
          </div>
        ))}

        <div className="indicator-section-head">OSCILLATORS</div>
        {oscillators.map((name) => (
          <div key={name} className="indicator-list-row">
            <span>{name}</span>
            <ChevronRight size={16} className="text-muted-foreground" />
          </div>
        ))}

        <button className="w-full h-11 rounded-lg bg-[oklch(0.24_0.026_273)] text-red-500 font-bold text-sm flex items-center justify-center gap-2 mt-6">
          <Trash2 size={16} /> Delete all
        </button>
      </div>
    </div>
  );
}

export function KeltnerConfigModal({
  onApply,
  onBack,
  onClose,
}: {
  onApply: () => void;
  onBack: () => void;
  onClose: () => void;
}) {
  const [ema, setEma] = useState(20);
  const [atr, setAtr] = useState(10);
  const [mult, setMult] = useState(1);

  const colors = [
    "#f97316", "#eab308", "#facc15", "#22c55e",
    "#06b6d4", "#3b82f6", "#6366f1", "#a855f7",
    "#ec4899", "#ef4444",
  ];

  return (
    <div className="keltner-config-overlay" onClick={onClose}>
      <div className="w-full max-w-md mx-auto" onClick={(e) => e.stopPropagation()}>
        <div className="deposit-header">
          <div className="flex items-center gap-2 cursor-pointer text-base" onClick={onBack}>
            <ArrowLeft size={20} />
            <span>Indicators</span>
          </div>
          <X size={22} className="cursor-pointer text-muted-foreground hover:text-white" onClick={onClose} />
        </div>

        <div className="text-lg font-bold text-white mb-4">Keltner channel</div>

        <div className="custom-field">
          <span className="field-tag">EMA Period</span>
          <button className="text-muted-foreground" onClick={() => setEma((e) => Math.max(1, e - 1))}>-</button>
          <span className="font-bold">{ema}</span>
          <button className="text-muted-foreground" onClick={() => setEma((e) => e + 1)}>+</button>
        </div>

        <div className="custom-field">
          <span className="field-tag">ATR Period</span>
          <button className="text-muted-foreground" onClick={() => setAtr((a) => Math.max(1, a - 1))}>-</button>
          <span className="font-bold">{atr}</span>
          <button className="text-muted-foreground" onClick={() => setAtr((a) => a + 1)}>+</button>
        </div>

        <div className="custom-field">
          <span className="field-tag">Multiplier</span>
          <button className="text-muted-foreground" onClick={() => setMult((m) => Math.max(1, m - 1))}>-</button>
          <span className="font-bold">{mult}</span>
          <button className="text-muted-foreground" onClick={() => setMult((m) => m + 1)}>+</button>
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded bg-green-500" />
            <span className="text-xs text-white">top</span>
          </div>
          <div className="color-swatch-palette">
            {colors.map((c) => (
              <div key={c} className="color-swatch" style={{ background: c }} />
            ))}
          </div>
        </div>

        <div className="mt-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded bg-red-500" />
            <span className="text-xs text-white">middle</span>
          </div>
          <div className="color-swatch-palette">
            {colors.map((c) => (
              <div key={c} className="color-swatch" style={{ background: c }} />
            ))}
          </div>
        </div>

        <div className="mt-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded bg-red-500" />
            <span className="text-xs text-white">bottom</span>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button className="w-12 h-11 rounded-lg bg-[oklch(0.24_0.026_273)] text-red-500 flex items-center justify-center">
            <Trash2 size={16} />
          </button>
          <button className="flex-1 h-11 rounded-lg bg-green-500 text-white font-bold text-sm flex items-center justify-center gap-2" onClick={onApply}>
            <Check size={16} strokeWidth={3} /> Ok
          </button>
        </div>
      </div>
    </div>
  );
}

export function DrawingsModal({ onClose }: { onClose: () => void }) {
  const drawings = [
    "Disjoint Channel",
    "Flat Top/Bottom",
    "Horizontal line",
    "Pitchfan",
    "Price Range",
    "Extended Line",
    "Fibonacci Retracement",
    "Fibonacci Fan",
    "Arc",
    "Parallel Channel",
    "Trend Line",
    "Pitchfork",
    "Date Range",
    "Vertical line",
    "Ray",
    "Gann Box",
  ];

  return (
    <div className="indicators-modal-overlay" onClick={onClose}>
      <div className="w-full max-w-md mx-auto" onClick={(e) => e.stopPropagation()}>
        <div className="deposit-header">
          <span>Drawings</span>
          <X size={22} className="cursor-pointer text-muted-foreground hover:text-white" onClick={onClose} />
        </div>

        <div className="indicator-section-head">DRAWINGS</div>
        {drawings.map((name) => (
          <div key={name} className="indicator-list-row" onClick={onClose}>
            <span>{name}</span>
            <ChevronRight size={16} className="text-muted-foreground" />
          </div>
        ))}

        <button className="w-full h-11 rounded-lg bg-[oklch(0.24_0.026_273)] text-red-500 font-bold text-sm flex items-center justify-center gap-2 mt-6" onClick={onClose}>
          <Trash2 size={16} /> Delete all
        </button>
      </div>
    </div>
  );
}
