import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowUp,
  Bell,
  BriefcaseBusiness,
  ChevronDown,
  ChevronUp,
  CircleHelp,
  Clock3,
  Compass,
  Eye,
  Image as ImageIcon,
  LineChart,
  LogOut,
  Maximize,
  Menu,
  MessageSquare,
  Minus,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
  Settings,
  Trophy,
  UserRound,
  Volume2,
} from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TRADEX — Web Trading Platform" },
      {
        name: "description",
        content:
          "TRADEX live web trading interface for AUD/NZD OTC markets simulation.",
      },
      { property: "og:title", content: "TRADEX — Web Trading Platform" },
      {
        property: "og:description",
        content:
          "TRADEX live web trading interface for AUD/NZD OTC markets simulation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TradingScreen,
});

/* ---------------- Available Currency Pairs ---------------- */
export const PAIRS = [
  {
    id: "usd-cop",
    flags: ["🇺🇸", "🇨🇴"],
    name: "USD/COP...",
    fullName: "USD/COP (OTC)",
    rate: 0.89,
    basePrice: 4210.5,
    decimals: 2,
  },
  {
    id: "usd-dzd",
    flags: ["🇺🇸", "🇩🇿"],
    name: "USD/DZD (OTC)",
    fullName: "USD/DZD (OTC)",
    rate: 0.77,
    basePrice: 134.2,
    decimals: 2,
  },
  {
    id: "gbp-cad",
    flags: ["🇬🇧", "🇨🇦"],
    name: "GBP/CAD...",
    fullName: "GBP/CAD (OTC)",
    rate: 0.83,
    basePrice: 1.782,
    decimals: 4,
  },
  {
    id: "nzd-jpy",
    flags: ["🇳🇿", "🇯🇵"],
    name: "NZD/JPY (OTC)",
    fullName: "NZD/JPY (OTC)",
    rate: 0.77,
    basePrice: 91.45,
    decimals: 2,
  },
  {
    id: "usd-idr",
    flags: ["🇺🇸", "🇮🇩"],
    name: "USD/IDR (OTC)",
    fullName: "USD/IDR (OTC)",
    rate: 0.86,
    basePrice: 15820.0,
    decimals: 1,
  },
  {
    id: "aud-nzd",
    flags: ["🇦🇺", "🇳🇿"],
    name: "AUD/NZD...",
    fullName: "AUD/NZD (OTC)",
    rate: 0.79,
    basePrice: 1.17134,
    decimals: 5,
  },
] as const;

/* ---------------- Market & Trading State ---------------- */
type Candle = { id: number; o: number; h: number; l: number; c: number };
type Trade = {
  id: number;
  dir: "up" | "down";
  pairName: string;
  candleId: number;
  entry: number;
  stake: number;
  rate: number;
  expiresAt: number;
  status: "open" | "won" | "lost";
  profit: number;
  account: "live" | "demo";
};

const CANDLE_MS = 6000;

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateCandles(basePrice: number, decimals: number): Candle[] {
  const r = seeded(42);
  const out: Candle[] = [];
  const scale = Math.pow(10, -Math.min(decimals, 4)) * 2;
  let p = basePrice;
  for (let i = 0; i < 35; i++) {
    const o = p;
    const c = o + (r() - 0.5) * scale;
    const h = Math.max(o, c) + r() * (scale * 0.4);
    const l = Math.min(o, c) - r() * (scale * 0.4);
    out.push({ id: i, o, h, l, c });
    p = c;
  }
  return out;
}

const pad = (n: number) => String(n).padStart(2, "0");
const fmtClock = (d: Date) =>
  `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
const fmtMoney = (n: number) =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

function useTradingState() {
  const [activePairIndex, setActivePairIndex] = useState(5); // Default to AUD/NZD
  const activePair = PAIRS[activePairIndex] ?? PAIRS[5]!;

  const [candles, setCandles] = useState<Candle[]>(() =>
    generateCandles(activePair.basePrice, activePair.decimals),
  );
  const [now, setNow] = useState<number | null>(null);
  const [account, setAccount] = useState<"live" | "demo">("live");
  const [balances, setBalances] = useState({ live: 31626.4, demo: 5000.0 });

  // Stake configuration & switch ($ vs %)
  const [stakeMode, setStakeMode] = useState<"dollar" | "percent">("dollar");
  const [stakeDollars, setStakeDollars] = useState(60);
  const [stakePercent, setStakePercent] = useState(1);

  // Time configuration & switch (clock vs timer duration)
  const [timeMode, setTimeMode] = useState<"clock" | "timer">("clock");
  const [minutes, setMinutes] = useState(1); // expiration duration in minutes

  // Pending trade toggle
  const [pendingTrade, setPendingTrade] = useState(false);

  // Chart zoom level (visible candles count)
  const [visibleCount, setVisibleCount] = useState(20);

  const [trades, setTrades] = useState<Trade[]>([
    {
      id: 1728042000000,
      dir: "up",
      pairName: "AUD/NZD (OTC)",
      candleId: 10,
      entry: 1.1698,
      stake: 60,
      rate: 0.79,
      expiresAt: Date.now() - 30000,
      status: "won",
      profit: 47.4,
      account: "live",
    },
    {
      id: 1728042080000,
      dir: "up",
      pairName: "AUD/NZD (OTC)",
      candleId: 18,
      entry: 1.1702,
      stake: 60,
      rate: 0.79,
      expiresAt: Date.now() + 45000,
      status: "open",
      profit: 0,
      account: "live",
    },
  ]);

  const candlesRef = useRef(candles);
  candlesRef.current = candles;
  const nextCandleAt = useRef(0);

  // Switch pair candles when active pair changes
  useEffect(() => {
    setCandles(generateCandles(activePair.basePrice, activePair.decimals));
  }, [activePairIndex]);

  // Real-time market tick generator
  useEffect(() => {
    nextCandleAt.current = Date.now() + CANDLE_MS;
    setNow(Date.now());
    const t = setInterval(() => {
      const ts = Date.now();
      setNow(ts);
      setCandles((prev) => {
        if (!prev.length) return prev;
        const list = prev.slice();
        const last = { ...list[list.length - 1]! };
        const delta = (Math.random() - 0.5) * 0.00012;
        const c = last.c + delta;
        last.c = c;
        last.h = Math.max(last.h, c);
        last.l = Math.min(last.l, c);
        list[list.length - 1] = last;

        if (ts >= nextCandleAt.current) {
          nextCandleAt.current = ts + CANDLE_MS;
          list.push({ id: last.id + 1, o: c, h: c, l: c, c });
          if (list.length > 70) list.shift();
        }
        return list;
      });
    }, 500);
    return () => clearInterval(t);
  }, []);

  // Compute effective stake in dollars
  const effectiveStake = useMemo(() => {
    if (stakeMode === "dollar") return stakeDollars;
    const computed = Math.round(balances[account] * (stakePercent / 100));
    return Math.max(1, computed);
  }, [balances, account, stakeMode, stakeDollars, stakePercent]);

  // Resolve expiring trades
  useEffect(() => {
    if (now === null || !candlesRef.current.length) return;
    const currentPrice = candlesRef.current[candlesRef.current.length - 1]!.c;
    const due = trades.filter((t) => t.status === "open" && now >= t.expiresAt);
    if (!due.length) return;

    let credit = { live: 0, demo: 0 };
    const updated = trades.map((t) => {
      if (!due.includes(t)) return t;
      const won =
        t.dir === "up" ? currentPrice > t.entry : currentPrice < t.entry;
      const payout = won ? t.stake * (1 + t.rate) : 0;
      credit = { ...credit, [t.account]: credit[t.account] + payout };
      return {
        ...t,
        status: won ? ("won" as const) : ("lost" as const),
        profit: won ? t.stake * t.rate : -t.stake,
      };
    });

    setTrades(updated);
    setBalances((b) => ({
      live: b.live + credit.live,
      demo: b.demo + credit.demo,
    }));
  }, [now, trades]);

  // Place a trade
  const placeTrade = useCallback(
    (dir: "up" | "down") => {
      if (now === null || !candlesRef.current.length) return;
      if (balances[account] < effectiveStake) return;

      const last = candlesRef.current[candlesRef.current.length - 1]!;
      setBalances((b) => ({ ...b, [account]: b[account] - effectiveStake }));

      const expiresAt = Date.now() + minutes * 60000;
      setTrades((ts) => [
        {
          id: Date.now(),
          dir,
          pairName: activePair.fullName,
          candleId: last.id,
          entry: last.c,
          stake: effectiveStake,
          rate: activePair.rate,
          expiresAt,
          status: "open",
          profit: 0,
          account,
        },
        ...ts,
      ]);
    },
    [account, activePair, balances, effectiveStake, minutes, now],
  );

  const toggleStakeMode = useCallback(() => {
    setStakeMode((m) => (m === "dollar" ? "percent" : "dollar"));
  }, []);

  const toggleTimeMode = useCallback(() => {
    setTimeMode((m) => (m === "clock" ? "timer" : "clock"));
  }, []);

  const togglePendingTrade = useCallback(() => {
    setPendingTrade((p) => !p);
  }, []);

  const zoomIn = useCallback(() => {
    setVisibleCount((c) => Math.max(12, c - 4));
  }, []);

  const zoomOut = useCallback(() => {
    setVisibleCount((c) => Math.min(36, c + 4));
  }, []);

  const currentPrice = candles.length
    ? candles[candles.length - 1]!.c
    : activePair.basePrice;

  return {
    candles,
    now,
    account,
    setAccount,
    balances,
    setBalances,
    activePairIndex,
    setActivePairIndex,
    activePair,
    stakeMode,
    toggleStakeMode,
    stakeDollars,
    setStakeDollars,
    stakePercent,
    setStakePercent,
    effectiveStake,
    timeMode,
    toggleTimeMode,
    minutes,
    setMinutes,
    pendingTrade,
    togglePendingTrade,
    visibleCount,
    zoomIn,
    zoomOut,
    trades,
    placeTrade,
    price: currentPrice,
    nextCandleAt: nextCandleAt.current,
  };
}

type TradingState = ReturnType<typeof useTradingState>;
const Ctx = createContext<TradingState | null>(null);
const useT = () => useContext(Ctx)!;

/* ---------------- Reusable UI Elements ---------------- */
type ScreenButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

function ScreenButton({
  children,
  className = "",
  ...props
}: ScreenButtonProps) {
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
}

function PairFlags({
  flags = ["🇦🇺", "🇳🇿"],
  compact = false,
}: {
  flags?: readonly [string, string];
  compact?: boolean;
}) {
  return (
    <span
      className={compact ? "tab-flags compact" : "tab-flags"}
      aria-hidden="true"
    >
      <span>{flags[0]}</span>
      <span>{flags[1]}</span>
    </span>
  );
}

/* ---------------- Account Switcher Modal ---------------- */
function AccountMenu({ onClose }: { onClose: () => void }) {
  const { account, setAccount, balances, setBalances } = useT();
  return (
    <div className="account-menu" onClick={(e) => e.stopPropagation()}>
      <div className="account-menu-main">
        <div className="vip-row">
          <div className="vip">
            <span className="diamond">♦</span>
            <div>
              <small>VIP:</small>
              <b>+4% profit</b>
            </div>
          </div>
          <button className="vip-eye" aria-label="Show VIP info">
            <Eye size={18} />
          </button>
        </div>
        <div className="am-info">
          <b>aj400krvade@gmail.com</b>
          <span>ID: 85404594</span>
          <p>
            Currency: <b>USD</b> <em>CHANGE</em>
          </p>
        </div>
        <button
          className={`am-account ${account === "live" ? "on" : ""}`}
          onClick={() => {
            setAccount("live");
            onClose();
          }}
        >
          <i className="radio" />
          <div>
            <span>Live Account</span>
            <b>${fmtMoney(balances.live)}</b>
            <p>The daily limit is not set</p>
            <em>SET LIMIT</em>
          </div>
        </button>
        <button
          className={`am-account ${account === "demo" ? "on" : ""}`}
          onClick={() => {
            setAccount("demo");
            onClose();
          }}
        >
          <i className="radio" />
          <div>
            <span>Demo Account</span>
            <b>
              ${fmtMoney(balances.demo)}
              <span
                className="am-refresh"
                title="Reset demo balance to $5,000"
                onClick={(e) => {
                  e.stopPropagation();
                  setBalances((b) => ({ ...b, demo: 5000 }));
                }}
              >
                <RefreshCw size={16} />
              </span>
            </b>
          </div>
          <Pencil size={15} className="am-pencil" />
        </button>
      </div>
      <nav className="account-menu-links">
        <span>Deposit</span>
        <span>Withdrawal</span>
        <span>Payments</span>
        <span>Trades</span>
        <span>My account</span>
        <hr />
        <span className="logout">
          <LogOut size={16} />
          Logout
        </span>
      </nav>
    </div>
  );
}

function AccountBlock({ mobile = false }: { mobile?: boolean }) {
  const { account, balances } = useT();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [open]);

  const label =
    account === "live"
      ? mobile
        ? "LIVE"
        : "LIVE ACCOUNT"
      : mobile
        ? "DEMO"
        : "DEMO ACCOUNT";

  return (
    <div
      className={`${mobile ? "account account-mobile" : "account"} ${account === "demo" ? "is-demo" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        setOpen((o) => !o);
      }}
      role="button"
      tabIndex={0}
      aria-label="Account selector"
    >
      <span className="diamond">♦</span>
      <div>
        <small>{label}</small>
        <strong>${fmtMoney(balances[account])}</strong>
      </div>
      {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      {open && <AccountMenu onClose={() => setOpen(false)} />}
    </div>
  );
}

function NotificationBadge() {
  return (
    <div className="notification" title="Notifications">
      <Bell size={18} />
      <span>66</span>
    </div>
  );
}

/* ---------------- Desktop Header ---------------- */
function DesktopHeader() {
  return (
    <header className="desktop-header">
      <div className="brand">
        <span className="brand-mark">◫</span>
        <b>TRADEX</b>
        <i />
        <strong>WEB TRADING PLATFORM</strong>
      </div>
      <div className="header-actions">
        <NotificationBadge />
        <AccountBlock />
        <ScreenButton className="deposit">
          <Plus size={18} />
          Deposit
        </ScreenButton>
        <ScreenButton className="withdraw">Withdrawal</ScreenButton>
      </div>
    </header>
  );
}

/* ---------------- Desktop Sidebar Rail ---------------- */
function DesktopSidebar() {
  return (
    <aside className="desktop-sidebar">
      <span title="Menu">
        <Menu size={22} className="side-menu" />
      </span>
      <ScreenButton className="side-active" aria-label="Chart">
        <ImageIcon size={20} />
      </ScreenButton>
      <div className="side-icon" title="Help">
        <CircleHelp size={20} />
      </div>
      <div className="side-icon" title="Profile">
        <UserRound size={20} />
      </div>
      <span className="badge-icon side-icon" title="Tournaments">
        <Trophy size={20} />
        <b>4</b>
      </span>
      <span className="badge-icon side-icon" title="Market">
        <span className="coin">$</span>
        <b>2</b>
      </span>
      <div className="side-icon" title="More">
        <MoreHorizontal size={22} />
      </div>
      <div className="sidebar-spacer" />
      <div className="utility">
        <span title="Fullscreen">
          <Maximize size={16} />
        </span>
        <span title="Popout">➜</span>
      </div>
      <div className="utility">
        <span title="Settings">
          <Settings size={17} />
        </span>
        <span title="Sound">
          <Volume2 size={18} />
        </span>
      </div>
      <div className="join" title="Join Telegram Community">
        <MessageSquare size={14} />
        <b>JOIN US</b>
      </div>
      <div className="help" title="Live Support">
        <span>●</span>Help
      </div>
    </aside>
  );
}

/* ---------------- Pair Tabs (Interactive Pair Switcher) ---------------- */
function PairTabs() {
  const { activePairIndex, setActivePairIndex } = useT();

  return (
    <div className="pair-tabs">
      <ScreenButton className="add-pair" title="Add pair">
        <Plus size={18} />
      </ScreenButton>
      {PAIRS.map((pair, index) => {
        const isSelected = index === activePairIndex;
        return (
          <div
            className={`pair-tab ${isSelected ? "selected" : ""}`}
            key={pair.id}
            onClick={() => setActivePairIndex(index)}
            role="button"
            tabIndex={0}
          >
            <PairFlags flags={pair.flags} />
            <div>
              <b>{pair.name}</b>
              <strong>{Math.round(pair.rate * 100)}%</strong>
            </div>
            {isSelected && (
              <>
                <ChevronDown size={13} />
                <span
                  className="tab-close"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  title="Close tab"
                >
                  ×
                </span>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- Candlestick Chart ---------------- */
function ChartGrid({ mobile = false }: { mobile?: boolean }) {
  const {
    candles,
    now,
    trades,
    price,
    nextCandleAt,
    account,
    activePair,
    visibleCount,
    zoomIn,
    zoomOut,
  } = useT();

  const count = mobile ? Math.min(13, visibleCount) : visibleCount;
  const visible = candles.slice(-count);
  const firstId = visible.length ? visible[0]!.id : 0;

  const insetTop = mobile ? 24 : 60;
  const insetBottom = mobile ? 28 : 38;

  const { max, range } = useMemo(() => {
    let hi = -Infinity;
    let lo = Infinity;
    for (const c of visible) {
      hi = Math.max(hi, c.h);
      lo = Math.min(lo, c.l);
    }
    const padVal = (hi - lo) * 0.1 || 0.0004;
    return { max: hi + padVal, range: hi - lo + padVal * 2 };
  }, [visible]);

  const frac = (p: number) => Math.min(1, Math.max(0, (max - p) / range));
  const yCss = (f: number) =>
    `calc(${insetTop}px + (100% - ${insetTop + insetBottom}px) * ${f})`;

  const step = 100 / count;
  const highest = Math.max(...visible.map((c) => c.h));
  const lowest = Math.min(...visible.map((c) => c.l));

  const openTrade = trades.find(
    (t) => t.status === "open" && t.account === account,
  );
  const remaining =
    now === null
      ? 0
      : Math.max(
          0,
          Math.ceil(
            ((openTrade ? openTrade.expiresAt : nextCandleAt) - now) / 1000,
          ),
        );
  const countdown = `${pad(Math.floor(remaining / 60))}:${pad(remaining % 60)}`;
  const clock =
    now === null ? (mobile ? "19:09:19" : "19:54:41") : fmtClock(new Date(now));

  const markers = trades.filter(
    (t) =>
      t.account === account && t.candleId >= firstId && t.status === "open",
  );

  const priceFormatted = price.toFixed(activePair.decimals);
  const labelCount = mobile ? 5 : 7;

  return (
    <div className={mobile ? "chart-grid mobile-chart" : "chart-grid"}>
      <div className="grid-lines" />

      {/* Captions */}
      <div className="trade-caption start">
        ◀<span>Beginning of trade</span>
      </div>
      <div className="trade-caption end">
        ◀
        <span>
          End of trade
          <br />
          {countdown}
        </span>
      </div>

      {/* Clock & Info */}
      <div className="market-time">
        <span>●</span> {clock} <i>UTC+5</i>
      </div>
      {!mobile && (
        <div className="pair-info">
          <b>i</b> PAIR INFORMATION
        </div>
      )}
      {mobile && <div className="info-dot">i</div>}

      {/* High and Low Badges */}
      <span className="high-label">{highest.toFixed(activePair.decimals)}</span>
      <span className="low-label">{lowest.toFixed(activePair.decimals)}</span>

      {/* Candlesticks & Entry Markers */}
      <div className="candles">
        {visible.map((c, index) => {
          const top = frac(c.h) * 100;
          const bottom = frac(c.l) * 100;
          const bTop = frac(Math.max(c.o, c.c)) * 100;
          const bBot = frac(Math.min(c.o, c.c)) * 100;
          return (
            <div
              className={`candle ${c.c >= c.o ? "up" : "down"}`}
              style={{ left: `${index * step}%` }}
              key={c.id}
            >
              <i style={{ top: `${top}%`, height: `${bottom - top}%` }} />
              <b style={{ top: `${bTop}%`, height: `${bBot - bTop}%` }} />
            </div>
          );
        })}

        {markers.map((t) => {
          const idx = t.candleId - firstId;
          return (
            <div
              key={t.id}
              className={`trade-marker ${t.dir}`}
              style={{
                left: `calc(${idx * step}% + ${mobile ? 3 : 1.2}%)`,
                top: `${frac(t.entry) * 100}%`,
              }}
            >
              <span>
                {t.dir === "up" ? (
                  <ArrowUp size={10} strokeWidth={3} />
                ) : (
                  <ArrowDown size={10} strokeWidth={3} />
                )}
              </span>
              <i />
              <em>${t.stake}</em>
            </div>
          );
        })}
      </div>

      {/* Vertical Expiry Line */}
      <div className="expiry-line" />

      {/* Horizontal Price Line */}
      <div className="price-line" style={{ top: yCss(frac(price)) }}>
        <span>{countdown}</span>
        <b>{priceFormatted}</b>
      </div>

      {/* Price Alert Tag */}
      {!mobile && (
        <div className="alert-marker" style={{ top: yCss(0.68) }}>
          <Bell size={11} />
          <span>{(price * 0.9992).toFixed(activePair.decimals)}</span>
        </div>
      )}

      {/* Y-Axis Price Labels */}
      {Array.from({ length: labelCount }, (_, k) => {
        const f = (k + 0.5) / labelCount;
        const p = max - f * range;
        return (
          <span className="price-label" style={{ top: yCss(f) }} key={k}>
            {p.toFixed(activePair.decimals)}
          </span>
        );
      })}

      {/* X-Axis Timestamps */}
      <div className="x-labels">
        {(mobile
          ? ["19:00", "19:04", "19:08", "19:12", "19:16"]
          : [
              "19:28",
              "19:32",
              "19:36",
              "19:40",
              "19:44",
              "19:48",
              "19:52",
              "20:00",
              "20:04",
              "20:08",
              "20:12",
              "20:16",
            ]
        ).map((time, idx) => (
          <span
            key={time}
            className={idx === 10 && !mobile ? "current-time-pill" : ""}
          >
            {time}
          </span>
        ))}
      </div>

      {/* Left Floating Tools */}
      {!mobile && (
        <div className="chart-tools">
          <button title="Drawings">
            <Pencil size={15} />
          </button>
          <button className="active" title="Timeframe">
            1m
          </button>
          <button title="Candlesticks">
            <LineChart size={15} />
          </button>
          <button title="Indicators">
            <Compass size={15} />
          </button>
        </div>
      )}

      {/* Floating Zoom Buttons */}
      {!mobile && (
        <div className="chart-zoom">
          <button onClick={zoomOut} title="Zoom out">
            <Minus size={13} />
          </button>
          <button onClick={zoomIn} title="Zoom in">
            <Plus size={13} />
          </button>
        </div>
      )}

      {/* Mobile Floating Tools */}
      {mobile && (
        <div className="mobile-tools">
          <button title="Tools">•••</button>
          <span title="Open trades">
            <BriefcaseBusiness size={16} />
            <b>{trades.filter((t) => t.status === "open").length}</b>
          </span>
        </div>
      )}
    </div>
  );
}

/* ---------------- Investment Box with Working SWITCH ---------------- */
function StakeBox({ mobile = false }: { mobile?: boolean }) {
  const {
    stakeMode,
    toggleStakeMode,
    stakeDollars,
    setStakeDollars,
    stakePercent,
    setStakePercent,
  } = useT();

  const handleDecrease = () => {
    if (stakeMode === "dollar") {
      setStakeDollars((s) => Math.max(1, s - 10));
    } else {
      setStakePercent((p) => Math.max(1, p - 1));
    }
  };

  const handleIncrease = () => {
    if (stakeMode === "dollar") {
      setStakeDollars((s) => Math.min(10000, s + 10));
    } else {
      setStakePercent((p) => Math.min(50, p + 1));
    }
  };

  const displayText =
    stakeMode === "dollar" ? `${stakeDollars} $` : `${stakePercent} %`;

  return (
    <div className={mobile ? "stake-box mobile" : "stake-box"}>
      <span className="field-label">Investment</span>
      <ScreenButton aria-label="Decrease investment" onClick={handleDecrease}>
        <Minus size={mobile ? 13 : 15} />
      </ScreenButton>
      <strong>{displayText}</strong>
      <ScreenButton aria-label="Increase investment" onClick={handleIncrease}>
        <Plus size={mobile ? 14 : 16} />
      </ScreenButton>
      <span
        className="switch-link"
        onClick={toggleStakeMode}
        role="button"
        tabIndex={0}
      >
        SWITCH
      </span>
    </div>
  );
}

/* ---------------- Time Box with Working SWITCH TIME ---------------- */
function TimeBox({ mobile = false }: { mobile?: boolean }) {
  const { now, minutes, setMinutes, timeMode, toggleTimeMode } = useT();

  const handleDecrease = () => {
    setMinutes((m) => Math.max(1, m - 1));
  };

  const handleIncrease = () => {
    setMinutes((m) => Math.min(60, m + 1));
  };

  const timeDisplay = useMemo(() => {
    if (timeMode === "timer") {
      return `00:${pad(minutes)}:00`;
    }
    // Clock expiration mode
    if (now === null) return mobile ? "19:10" : "19:56";
    const d = new Date(now + minutes * 60000);
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }, [timeMode, minutes, now, mobile]);

  return (
    <div className={mobile ? "time-box mobile" : "time-box"}>
      <span className="field-label">Time</span>
      <ScreenButton aria-label="Decrease time" onClick={handleDecrease}>
        <Minus size={mobile ? 13 : 15} />
      </ScreenButton>
      <strong>{timeDisplay}</strong>
      <ScreenButton aria-label="Increase time" onClick={handleIncrease}>
        <Plus size={mobile ? 14 : 16} />
      </ScreenButton>
      <span
        className="switch-link"
        onClick={toggleTimeMode}
        role="button"
        tabIndex={0}
      >
        SWITCH TIME
      </span>
    </div>
  );
}

/* ---------------- Action Buttons (Buy & Sell) ---------------- */
function ActionButtons() {
  const { placeTrade } = useT();
  return (
    <div className="trade-actions">
      <ScreenButton className="buy" onClick={() => placeTrade("up")}>
        Buy
      </ScreenButton>
      <ScreenButton className="sell" onClick={() => placeTrade("down")}>
        Sell
      </ScreenButton>
    </div>
  );
}

/* ---------------- Trades History Panel ---------------- */
function TradesList() {
  const { trades, account, now } = useT();
  const list = trades.filter((t) => t.account === account);
  const openCount = list.filter((t) => t.status === "open").length;

  return (
    <section className="trades-panel">
      <div className="trades-head">
        <b>Trades</b>
        <span>{list.length}</span>
        <Clock3 size={17} />
        <span>{openCount}</span>
      </div>

      <div className="trades-scroll">
        <div className="trade-date">
          4 OCTOBER <i>6</i>
        </div>

        {list.map((t) => {
          const rem =
            now === null
              ? 0
              : Math.max(0, Math.ceil((t.expiresAt - now) / 1000));
          const isPending = t.status === "open";
          const timerStr = isPending
            ? `00:${pad(Math.floor(rem / 60))}:${pad(rem % 60)}`
            : "00:00:00";

          return (
            <div className="trade-item" key={t.id}>
              <div className="trade-row">
                <ChevronDown size={14} />
                <PairFlags flags={["🇦🇺", "🇳🇿"]} compact />
                <b>{t.pairName.slice(0, 11)}...</b>
                <span>{timerStr}</span>
              </div>
              <div className={`trade-result ${t.dir}`}>
                <span>
                  {t.dir === "up" ? "↑" : "↓"} {t.stake} $
                </span>
                <b className={t.status === "won" ? "won" : ""}>
                  {t.status === "won"
                    ? `+${fmtMoney(t.stake * (1 + t.rate))}`
                    : t.status === "lost"
                      ? "0.00"
                      : `${fmtMoney(t.stake)}`}{" "}
                  $
                </b>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------- Desktop Trade Control Panel ---------------- */
function TradePanel() {
  const { activePair, effectiveStake, pendingTrade, togglePendingTrade } =
    useT();
  const payout = `${fmtMoney(effectiveStake * (1 + activePair.rate))} $`;

  return (
    <aside className="right-column">
      <section className="trade-panel">
        <div className="panel-pair">
          <PairFlags flags={activePair.flags} />
          <b>{activePair.fullName}</b>
          <strong>{Math.round(activePair.rate * 100)}%</strong>
        </div>

        {/* Pending Trade Switch */}
        <div className="pending" onClick={togglePendingTrade}>
          <Clock3 size={15} />
          <span>PENDING TRADE</span>
          <div className={`pending-switch ${pendingTrade ? "active" : ""}`}>
            <div className="pending-switch-knob" />
          </div>
        </div>

        {/* Time input */}
        <TimeBox />

        {/* Investment input */}
        <StakeBox />

        {/* Payout calculation */}
        <div className="payout">
          <span>Payout</span>
          <i />
          <strong>{payout}</strong>
        </div>

        {/* Buy & Sell buttons */}
        <ActionButtons />
      </section>

      {/* Trades History Card */}
      <TradesList />
    </aside>
  );
}

/* ---------------- Desktop Screen Composition ---------------- */
function DesktopScreen() {
  return (
    <div className="desktop-screen">
      <DesktopSidebar />
      <DesktopHeader />
      <main className="desktop-main">
        <PairTabs />
        <div className="chart-container">
          <ChartGrid />
          <div className="sentiment">
            <b>34%</b>
            <span>
              <i />
              <i />
            </span>
            <b>66%</b>
          </div>
        </div>
      </main>
      <TradePanel />
    </div>
  );
}

/* ---------------- Mobile Header & Navigation ---------------- */
function MobileHeader() {
  return (
    <header className="mobile-header">
      <AccountBlock mobile />
      <NotificationBadge />
      <ScreenButton className="deposit">Deposit</ScreenButton>
    </header>
  );
}

function MobileNav() {
  return (
    <nav className="mobile-nav">
      <span title="Chart">
        <ImageIcon size={20} />
      </span>
      <span title="Help">
        <CircleHelp size={20} />
      </span>
      <span title="Profile">
        <UserRound size={20} />
      </span>
      <span title="Tournaments">
        <Trophy size={20} />
        <b>4</b>
      </span>
      <span title="More">
        <MoreHorizontal size={22} />
        <b>2</b>
      </span>
    </nav>
  );
}

/* ---------------- Compact Mobile Trade Panel (Zero Scroll) ---------------- */
function MobileTradePanel() {
  const {
    activePair,
    effectiveStake,
    pendingTrade,
    togglePendingTrade,
    activePairIndex,
    setActivePairIndex,
  } = useT();

  const payout = `${fmtMoney(effectiveStake * (1 + activePair.rate))} $`;

  const cyclePair = () => {
    setActivePairIndex((i) => (i + 1) % PAIRS.length);
  };

  return (
    <section className="mobile-trade-panel">
      {/* Row 1: Pair selection & Pending toggle */}
      <div className="mobile-pair-row">
        <div
          className="mobile-pair"
          onClick={cyclePair}
          title="Click to cycle pair"
        >
          <PairFlags flags={activePair.flags} compact />
          <b>{activePair.name}</b>
          <strong>{Math.round(activePair.rate * 100)}%</strong>
          <ChevronDown size={14} />
        </div>
        <div className="pending" onClick={togglePendingTrade}>
          <span>PENDING TRADE</span>
          <div className={`pending-switch ${pendingTrade ? "active" : ""}`}>
            <div className="pending-switch-knob" />
          </div>
        </div>
      </div>

      {/* Row 2: Time & Investment side by side */}
      <div className="mobile-fields">
        <TimeBox mobile />
        <StakeBox mobile />
      </div>

      {/* Row 3: Payout */}
      <div className="payout">
        <span>Payout</span>
        <i />
        <strong>{payout}</strong>
      </div>

      {/* Row 4: Buy & Sell side by side */}
      <ActionButtons />
    </section>
  );
}

/* ---------------- Mobile Screen (100% Fixed, No Scroll) ---------------- */
function MobileScreen() {
  return (
    <div className="mobile-screen">
      <MobileHeader />
      <ChartGrid mobile />
      <MobileTradePanel />
      <MobileNav />
      <div className="phone-home">
        <i />
      </div>
    </div>
  );
}

/* ---------------- Root Trading Screen ---------------- */
function TradingScreen() {
  const state = useTradingState();
  return (
    <Ctx.Provider value={state}>
      <div className="trading-app">
        <DesktopScreen />
        <MobileScreen />
      </div>
    </Ctx.Provider>
  );
}
