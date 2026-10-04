import { AlertTriangle, ArrowLeft, Check, ChevronDown, ChevronRight, Copy, RefreshCw, X } from "lucide-react";
import { useState } from "react";

export function DepositModal({
  onSelectMethod,
  onClose,
}: {
  onSelectMethod: (method: string) => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"POPULAR" | "E-PAY" | "CRYPTO">("POPULAR");

  const methods = [
    { id: "binance-repeat", name: "Binance Pay", badge: "Last used", isRepeat: true },
    { id: "binance", name: "Binance Pay", min: "$10.00" },
    { id: "jazzcash", name: "JazzCash", min: "$10.00" },
    { id: "jazzcash-p2c", name: "Jazzcash (P2C)", min: "$10.00" },
    { id: "usdt-bep20", name: "USDT (BEP-20)", min: "$10.00" },
    { id: "raast", name: "Raast", min: "$10.00" },
    { id: "usdt-trc20", name: "USDT (TRC-20)", min: "$10.00" },
    { id: "ton", name: "The Open Network (TON)", min: "$15.00" },
    { id: "usdt-polygon", name: "USDT (Polygon)", min: "$10.00" },
  ];

  return (
    <div className="deposit-modal-overlay" onClick={onClose}>
      <div className="w-full max-w-md mx-auto" onClick={(e) => e.stopPropagation()}>
        <div className="deposit-header">
          <span>Deposit</span>
          <X size={22} className="cursor-pointer text-muted-foreground hover:text-white" onClick={onClose} />
        </div>

        <div className="flex items-center justify-between p-3 bg-[oklch(0.22_0.025_273)] rounded-lg mb-4 cursor-pointer">
          <span className="flex items-center gap-2 text-sm font-semibold text-white">
            🌐 Pakistan
          </span>
          <ChevronDown size={16} className="text-muted-foreground" />
        </div>

        <div className="pair-category-tabs">
          {(["POPULAR", "E-PAY", "CRYPTO"] as const).map((t) => (
            <button
              key={t}
              className={`pair-category-tab ${tab === t ? "active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t === "POPULAR" ? "🔥 POPULAR" : t === "E-PAY" ? "💳 E-PAY" : "⬡ CRYPTO"}
            </button>
          ))}
        </div>

        <div className="text-sm font-bold text-white mb-3">Popular in your region (9)</div>

        <div className="flex flex-col gap-2">
          {methods.map((m) => (
            <div
              key={m.id}
              className="deposit-method-card"
              onClick={() => onSelectMethod(m.name)}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">🔸</span>
                <div>
                  <div className="method-name">{m.name}</div>
                  {m.badge && <div className="method-sub">🕒 {m.badge}</div>}
                  {m.min && <div className="method-sub">Min. {m.min}</div>}
                </div>
              </div>
              {m.isRepeat ? (
                <div className="repeat-btn">Repeat</div>
              ) : (
                <ChevronRight size={18} className="text-slate-400" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DepositAmountModal({
  method = "USDT (TRC-20)",
  onProceed,
  onBack,
  onClose,
}: {
  method?: string;
  onProceed: (amount: number) => void;
  onBack: () => void;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState(100);

  return (
    <div className="deposit-modal-overlay" onClick={onClose}>
      <div className="w-full max-w-md mx-auto" onClick={(e) => e.stopPropagation()}>
        <div className="deposit-header">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onBack}>
            <ArrowLeft size={20} />
            <span>Deposit</span>
          </div>
          <X size={22} className="cursor-pointer text-muted-foreground hover:text-white" onClick={onClose} />
        </div>

        <div className="flex items-center justify-between p-3.5 bg-[oklch(0.22_0.025_273)] rounded-lg mb-3">
          <span className="font-bold text-white text-sm">🟢 {method}</span>
          <span className="text-blue-500 font-bold text-xs cursor-pointer" onClick={onBack}>CHANGE</span>
        </div>

        <div className="text-xs text-muted-foreground mb-3 flex justify-between">
          <span>Min amount: $10.00</span>
          <span>Max amount: $50,000.00</span>
        </div>

        <div className="notice-box warning">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          <span><b>Minimum amount - 10 $.</b> Smaller payments won't be credited.</span>
        </div>

        <div className="custom-field mt-3 mb-2">
          <span className="field-tag">Deposit amount</span>
          <span className="font-bold text-base">{amount}</span>
          <span className="text-muted-foreground">$</span>
        </div>

        <div className="quick-pills-grid">
          {[150, 200, 300, 500].map((val) => (
            <button
              key={val}
              className={`quick-pill ${amount === val ? "active" : ""}`}
              onClick={() => setAmount(val)}
            >
              {val} $
            </button>
          ))}
        </div>

        <div className="bonus-code-card">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            🎟️ Bonus Code
          </div>
          <div className="text-blue-500 font-bold text-xs flex items-center gap-1 cursor-pointer">
            ACTIVATE <ChevronRight size={14} />
          </div>
        </div>

        <div className="flex justify-between text-sm py-2 border-t border-[oklch(0.25_0.02_272)] text-muted-foreground">
          <span>You will receive</span>
          <b className="text-white">${amount}.00</b>
        </div>

        <button className="proceed-btn" onClick={() => onProceed(amount)}>
          Proceed to Pay
        </button>
      </div>
    </div>
  );
}

export function DepositPaymentModal({
  amount = 100,
  method = "USDT (TRC-20)",
  onBack,
  onClose,
}: {
  amount?: number;
  method?: string;
  onBack: () => void;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const address = "TTu92S1LGdzSPhPyU6XfS5YBf62Da3hA71";

  const handleCopy = () => {
    navigator.clipboard?.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="deposit-modal-overlay" onClick={onClose}>
      <div className="w-full max-w-md mx-auto" onClick={(e) => e.stopPropagation()}>
        <div className="deposit-header">
          <div className="flex items-center gap-2 cursor-pointer text-base" onClick={onBack}>
            <ArrowLeft size={20} />
            <span>Deposit ${amount}.00 via {method}</span>
          </div>
          <X size={22} className="cursor-pointer text-muted-foreground hover:text-white" onClick={onClose} />
        </div>

        <div className="notice-box warning">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          <span>Only TRC20 USDT. Do not send TRX, smart contracts or other coins — they will be lost.</span>
        </div>

        <div className="notice-box warning">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          <span>A new address is generated for each transaction. Do not reuse.</span>
        </div>

        <div className="notice-box info">
          <span>💰 Make sure your payment covers network fees.</span>
        </div>

        <div className="qr-container-box">
          <div className="qr-code-img flex items-center justify-center">
            {/* SVG QR Code Simulation */}
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <rect width="100" height="100" fill="#fff" />
              <rect x="10" y="10" width="25" height="25" fill="#000" />
              <rect x="15" y="15" width="15" height="15" fill="#fff" />
              <rect x="18" y="18" width="9" height="9" fill="#000" />
              <rect x="65" y="10" width="25" height="25" fill="#000" />
              <rect x="70" y="15" width="15" height="15" fill="#fff" />
              <rect x="73" y="18" width="9" height="9" fill="#000" />
              <rect x="10" y="65" width="25" height="25" fill="#000" />
              <rect x="15" y="70" width="15" height="15" fill="#fff" />
              <rect x="18" y="73" width="9" height="9" fill="#000" />
              <rect x="45" y="10" width="10" height="20" fill="#000" />
              <rect x="40" y="40" width="20" height="20" fill="#000" />
              <rect x="65" y="45" width="25" height="10" fill="#000" />
              <rect x="45" y="70" width="15" height="20" fill="#000" />
              <rect x="65" y="65" width="25" height="25" fill="#000" />
            </svg>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">To complete the payment transfer <b>{amount} USD</b> to address</div>
            <div className="qr-address-text">{address}</div>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="copy-action-btn" onClick={() => navigator.clipboard?.writeText(String(amount))}>
            <Copy size={14} /> Copy amount
          </button>
          <button className="copy-action-btn" onClick={handleCopy}>
            {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy Address"}
          </button>
        </div>

        <div className="text-center mt-6 text-xs text-muted-foreground flex flex-col items-center gap-2">
          <div className="flex items-center gap-1 text-sky-400 font-semibold">
            🕒 Time remaining: 23:59:56
          </div>
          <div className="flex items-center gap-1.5 text-blue-400 font-bold">
            <RefreshCw size={14} className="animate-spin" /> Waiting for Payment...
          </div>
        </div>
      </div>
    </div>
  );
}
