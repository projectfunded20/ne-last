import { ArrowLeft, ChevronDown, Eye, HelpCircle, X } from "lucide-react";

export function LeaderboardView({
  onBack,
  onClose,
  livePnL = -66318.4,
}: {
  onBack: () => void;
  onClose: () => void;
  livePnL?: number;
}) {
  const leaders = [
    { rank: 1, flag: "🇺🇾", name: "Nahuel Casana", amount: "$30,000.00+" },
    { rank: 2, flag: "🇧🇩", name: "Stone shooter", amount: "$30,000.00+" },
    { rank: 3, flag: "🇸🇾", name: "عزیز سوریا TOP1", amount: "$30,000.00+" },
    { rank: 4, flag: "🇵🇰", name: "#90271613", amount: "$30,000.00+" },
    { rank: 5, flag: "🇦🇪", name: "TR Rajon6", amount: "$30,000.00+" },
    { rank: 6, flag: "🇧🇩", name: "AC_Trader", amount: "$28,428.80" },
    { rank: 7, flag: "🇸🇴", name: "Trader raj personal", amount: "$25,168.49" },
    { rank: 8, flag: "🇮🇳", name: "AS TRADER PERSONAL Ritwik", amount: "$24,406.55" },
    { rank: 9, flag: "🇸🇴", name: "TradeLike Ramesh", amount: "$22,454.25" },
    { rank: 10, flag: "🇸🇴", name: "#94011571", amount: "$20,880.50" },
    { rank: 11, flag: "🇧🇩", name: "Trader Tahsin (BD KING❤️)", amount: "$20,377.28" },
  ];

  const formattedPnL = `${livePnL >= 0 ? "+" : ""}${livePnL.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}$`;

  return (
    <div className="mobile-view-wrapper">
      <div className="leaderboard-container">
        <div className="deposit-header mb-1">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onBack}>
            <ArrowLeft size={20} />
            <span>Leader Board</span>
          </div>
          <X size={22} className="cursor-pointer text-muted-foreground hover:text-white" onClick={onClose} />
        </div>
        <div className="text-xs text-muted-foreground mb-2">of the Day</div>

        <div className="leaderboard-user-card">
          <div className="flex items-center gap-2">
            <span>🇵🇰</span>
            <b className="text-sm text-white">TEST TRADER LLC</b>
          </div>
          <b className={`font-bold text-sm ${livePnL >= 0 ? "text-green-500" : "text-red-500"}`}>
            {formattedPnL}
          </b>
        </div>
        <div className="text-xs text-muted-foreground -mt-2 mb-3">Your position: <b className="text-white">100+</b></div>

        <div className="flex items-center justify-center gap-2 p-2.5 bg-[oklch(0.24_0.026_273)] rounded-lg text-xs font-bold text-sky-400 mb-4 cursor-pointer">
          <span>🧰</span> How does this rating work?
        </div>

        <div className="flex flex-col">
          {leaders.map((l) => (
            <div key={l.rank} className="leaderboard-row">
              <div className="flex items-center gap-3">
                <span className={`leader-rank-badge ${l.rank === 1 ? "leader-rank-1" : l.rank === 2 ? "leader-rank-2" : l.rank === 3 ? "leader-rank-3" : "text-muted-foreground"}`}>
                  {l.rank}
                </span>
                <span className="text-base">{l.flag}</span>
                <span className="text-white font-medium">{l.name}</span>
              </div>
              <span className="text-green-500 font-bold">{l.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AnalyticsView() {
  return (
    <div className="mobile-view-wrapper">
      <div className="mobile-dropdown-header">
        <span>Analytics</span>
        <ChevronDown size={16} />
      </div>

      <div className="analytics-container">
        <div className="analytics-user-box">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-black border border-slate-700 flex items-center justify-center text-xs font-bold text-sky-400">
              BT
            </div>
            <div>
              <div className="text-sm font-bold text-white">trader.demo@test.com</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                ID: 10482910 <span className="text-sky-400">✈️</span>
              </div>
            </div>
          </div>
          <button className="p-2 bg-[oklch(0.24_0.026_273)] rounded-lg text-muted-foreground">
            <Eye size={16} />
          </button>
        </div>

        <div className="text-xs text-muted-foreground mb-4">
          Location: <b className="text-white">International</b>
          <div className="mt-2 text-muted-foreground">
            In the account: <b className="text-white">$0.00</b>
          </div>
          <div className="text-muted-foreground">
            In the demo: <b className="text-white">$31,681.60</b>
          </div>
        </div>

        <div className="mobile-dropdown-header mx-0 mb-4">
          <span>Month</span>
          <ChevronDown size={16} />
        </div>

        <div className="account-section-title text-sm mb-2">General data</div>

        <div className="analytics-metric-row">
          <span className="text-muted-foreground">Trades count</span>
          <div className="ring-gauge-circle border-4 border-green-500 text-white">
            57
          </div>
        </div>

        <div className="analytics-metric-row">
          <span className="text-muted-foreground">Trades profit</span>
          <b className="text-white text-base">-449.2 $</b>
        </div>

        <div className="analytics-metric-row">
          <span className="text-muted-foreground">Profitable trades</span>
          <div className="ring-gauge-circle border-4 border-amber-500 text-white text-[11px] text-center leading-tight">
            23<br /><small className="text-[9px] text-muted-foreground">40%</small>
          </div>
        </div>

        <div className="analytics-metric-row">
          <span className="text-muted-foreground">Average profit</span>
          <b className="text-white">-7.88 $</b>
        </div>

        <div className="analytics-metric-row">
          <span className="text-muted-foreground">Net turnover</span>
          <b className="text-white">1790.84 $</b>
        </div>

        <div className="analytics-metric-row">
          <span className="text-muted-foreground">Hedged trades</span>
          <b className="text-white">0 $</b>
        </div>

        <div className="analytics-metric-row">
          <span className="text-muted-foreground">Min trade amount</span>
          <b className="text-white">1 $</b>
        </div>

        <div className="analytics-metric-row">
          <span className="text-muted-foreground">Max trade amount</span>
          <b className="text-white">124.2 $</b>
        </div>

        <div className="analytics-metric-row">
          <span className="text-muted-foreground">Max trade profit</span>
          <b className="text-white">94.64 $</b>
        </div>
      </div>
    </div>
  );
}
