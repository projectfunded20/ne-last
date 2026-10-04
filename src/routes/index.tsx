import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  BarChart3,
  Bell,
  Briefcase,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleHelp,
  Clock3,
  Compass,
  Eye,
  GraduationCap,
  Headphones,
  Image as ImageIcon,
  LayoutGrid,
  LineChart,
  Lock,
  LogOut,
  Maximize,
  Menu,
  MessageSquare,
  Minus,
  MoreHorizontal,
  Pencil,
  PieChart,
  Plus,
  Radio,
  RefreshCw,
  Settings,
  ShoppingBag,
  Trash2,
  Trophy,
  UserRound,
  Volume2,
  X,
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

/* ---------------- Mock Payments Transactions (Screenshots 4 & 12) ---------------- */
const PAYMENTS_DATA = [
  {
    id: "132049457",
    dateTime: "03/10/2026, 19:50:55",
    status: "Successed" as const,
    type: "Deposit",
    system: "Binance Pay",
    amount: "+$69.00",
  },
  {
    id: "131992200",
    dateTime: "03/10/2026, 03:23:51",
    status: "Successed" as const,
    type: "Deposit",
    system: "Binance Pay",
    amount: "+$69.00",
  },
  {
    id: "131988479",
    dateTime: "03/10/2026, 01:36:12",
    status: "Failed" as const,
    type: "Deposit",
    system: "Raast",
    amount: "+Rs3,000.00",
  },
  {
    id: "131988427",
    dateTime: "03/10/2026, 01:35:01",
    status: "Failed" as const,
    type: "Deposit",
    system: "Raast",
    amount: "+Rs5,000.00",
  },
  {
    id: "131710628",
    dateTime: "30/09/2026, 04:50:33",
    status: "Successed" as const,
    type: "Deposit",
    system: "Binance Pay",
    amount: "+$66.00",
  },
  {
    id: "131560613",
    dateTime: "28/09/2026, 15:33:28",
    status: "Successed" as const,
    type: "Deposit",
    system: "USDT (BEP-20)",
    amount: "+$69.00",
  },
  {
    id: "131480804",
    dateTime: "27/09/2026, 17:20:04",
    status: "Successed" as const,
    type: "Deposit",
    system: "Raast",
    amount: "+Rs5,000.00",
  },
];

/* ---------------- Timer Presets (Screenshots 1 & 7) ---------------- */
const TIMER_PRESETS_DESKTOP = [
  "00:05",
  "00:10",
  "00:15",
  "00:30",
  "01:00",
  "02:00",
  "05:00",
  "10:00",
  "15:00",
  "30:00",
  "01:00:00",
  "02:00:00",
  "04:00:00",
];

const TIMER_PRESETS_MOBILE = [
  "00:05",
  "00:10",
  "00:15",
  "00:30",
  "01:00",
  "02:00",
  "05:00",
  "10:00",
  "15:00",
  "30:00",
  "01:00:00",
  "02:00:00",
];

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

type ViewScreen =
  "trading" | "account" | "payments" | "withdrawal" | "help" | "more";

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
  const [currentView, setCurrentView] = useState<ViewScreen>("trading");
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
  const [timeMode, setTimeMode] = useState<"clock" | "timer">("timer");
  const [selectedTimerPreset, setSelectedTimerPreset] = useState("01:00");
  const [minutes, setMinutes] = useState(1); // expiration duration in minutes
  const [timerPopoverOpen, setTimerPopoverOpen] = useState(false);

  // Pending trade toggle
  const [pendingTrade, setPendingTrade] = useState(true);

  // Desktop & mobile overlays
  const [desktopMoreOpen, setDesktopMoreOpen] = useState(false);
  const [mobileTradesOpen, setMobileTradesOpen] = useState(false);

  // Chart zoom level
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
      profit: 55.2,
      account: "live",
    },
    {
      id: 1728042080000,
      dir: "down",
      pairName: "AUD/NZD (OTC)",
      candleId: 14,
      entry: 1.171,
      stake: 60,
      rate: 0.79,
      expiresAt: Date.now() - 15000,
      status: "won",
      profit: 54.6,
      account: "live",
    },
    {
      id: 1728042100000,
      dir: "down",
      pairName: "AUD/NZD (OTC)",
      candleId: 18,
      entry: 1.1702,
      stake: 60,
      rate: 0.79,
      expiresAt: Date.now() + 85000,
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
    currentView,
    setCurrentView,
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
    setTimeMode,
    toggleTimeMode,
    selectedTimerPreset,
    setSelectedTimerPreset,
    minutes,
    setMinutes,
    timerPopoverOpen,
    setTimerPopoverOpen,
    pendingTrade,
    togglePendingTrade,
    desktopMoreOpen,
    setDesktopMoreOpen,
    mobileTradesOpen,
    setMobileTradesOpen,
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

/* ---------------- Bull Trader Official Avatar (Screenshots 3 & 9) ---------------- */
function BullAvatar() {
  return (
    <div className="bull-avatar">
      <svg viewBox="0 0 100 100" className="w-14 h-14" fill="none">
        <circle cx="50" cy="50" r="46" fill="#090d16" />
        <path
          d="M26 38 C32 26 40 22 48 30 C56 22 64 26 70 38 C64 42 60 48 58 56 C54 62 46 62 42 56 C40 48 36 42 26 38 Z"
          fill="#38bdf8"
          opacity="0.9"
        />
        <path d="M35 44 L42 42 L40 48 Z" fill="#fff" />
        <path d="M65 44 L58 42 L60 48 Z" fill="#fff" />
        <path d="M46 52 L50 55 L54 52 Z" fill="#0284c7" />
        <text
          x="50"
          y="74"
          textAnchor="middle"
          fill="#38bdf8"
          fontSize="6.5"
          fontWeight="900"
          letterSpacing="0.05em"
        >
          BULL TRADER
        </text>
        <text
          x="50"
          y="82"
          textAnchor="middle"
          fill="#94a3b8"
          fontSize="5"
          fontWeight="700"
          letterSpacing="0.08em"
        >
          OFFICIAL
        </text>
      </svg>
    </div>
  );
}

/* ---------------- Account Switcher Modal ---------------- */
function AccountMenu({ onClose }: { onClose: () => void }) {
  const { account, setAccount, balances, setBalances, setCurrentView } = useT();
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
          <b>trader.demo@test.com</b>
          <span>ID: 10482910</span>
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
        <span
          onClick={() => {
            setCurrentView("withdrawal");
            onClose();
          }}
        >
          Deposit
        </span>
        <span
          onClick={() => {
            setCurrentView("withdrawal");
            onClose();
          }}
        >
          Withdrawal
        </span>
        <span
          onClick={() => {
            setCurrentView("payments");
            onClose();
          }}
        >
          Payments
        </span>
        <span
          onClick={() => {
            setCurrentView("trading");
            onClose();
          }}
        >
          Trades
        </span>
        <span
          onClick={() => {
            setCurrentView("account");
            onClose();
          }}
        >
          My account
        </span>
        <hr />
        <span className="logout" onClick={onClose}>
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
    <div className="notification">
      <Bell size={18} />
      <span>66</span>
    </div>
  );
}

/* ---------------- Desktop Header ---------------- */
function DesktopHeader() {
  const { setCurrentView } = useT();
  return (
    <header className="desktop-header">
      <div
        className="brand"
        onClick={() => setCurrentView("trading")}
        role="button"
        tabIndex={0}
      >
        <span className="brand-mark">◫</span>
        <b>TRADEX</b>
        <i />
        <strong>WEB TRADING PLATFORM</strong>
      </div>
      <div className="header-actions">
        <NotificationBadge />
        <AccountBlock />
        <ScreenButton
          className="deposit"
          onClick={() => setCurrentView("withdrawal")}
        >
          <Plus size={18} />
          Deposit
        </ScreenButton>
        <ScreenButton
          className="withdraw"
          onClick={() => setCurrentView("withdrawal")}
        >
          Withdrawal
        </ScreenButton>
      </div>
    </header>
  );
}

/* ---------------- Desktop "More" Menu Flyout (Screenshot 2) ---------------- */
function DesktopMoreMenu({ onClose }: { onClose: () => void }) {
  const { setCurrentView } = useT();

  return (
    <div className="desktop-more-menu" onClick={(e) => e.stopPropagation()}>
      <div className="desktop-more-header">
        <span>More</span>
        <X
          size={18}
          className="cursor-pointer text-muted-foreground hover:text-white"
          onClick={onClose}
        />
      </div>

      <button className="desktop-more-item" onClick={onClose}>
        <PieChart size={18} />
        <span>Analytics</span>
        <ChevronRight size={16} />
      </button>

      <button className="desktop-more-item" onClick={onClose}>
        <Briefcase size={18} />
        <span>TOP</span>
        <ChevronRight size={16} />
      </button>

      <button className="desktop-more-item" onClick={onClose}>
        <Radio size={18} />
        <span>Signals</span>
        <ChevronRight size={16} />
      </button>

      <button
        className="desktop-more-item"
        onClick={() => {
          setCurrentView("account");
          onClose();
        }}
      >
        <UserRound size={18} />
        <span>Account</span>
        <ChevronRight size={16} />
      </button>

      <button className="desktop-more-item" onClick={onClose}>
        <Trophy size={18} />
        <span>Tournaments</span>
        <span className="item-badge">4</span>
        <ChevronRight size={16} />
      </button>

      <button className="desktop-more-item" onClick={onClose}>
        <ShoppingBag size={18} />
        <span>Market</span>
        <span className="item-badge">2</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

/* ---------------- Desktop Sidebar Rail ---------------- */
function DesktopSidebar() {
  const { currentView, setCurrentView, desktopMoreOpen, setDesktopMoreOpen } =
    useT();

  return (
    <aside className="desktop-sidebar">
      <span>
        <Menu size={22} className="side-menu" />
      </span>
      <ScreenButton
        className={currentView === "trading" ? "side-active" : "side-icon"}
        aria-label="Chart"
        onClick={() => setCurrentView("trading")}
      >
        <ImageIcon size={20} />
      </ScreenButton>
      <div
        className={currentView === "help" ? "side-active" : "side-icon"}
        onClick={() => setCurrentView("help")}
      >
        <CircleHelp size={20} />
      </div>
      <div
        className={currentView === "account" ? "side-active" : "side-icon"}
        onClick={() => setCurrentView("account")}
      >
        <UserRound size={20} />
      </div>
      <span className="badge-icon side-icon">
        <Trophy size={20} />
        <b>4</b>
      </span>
      <span className="badge-icon side-icon">
        <span className="coin">$</span>
        <b>2</b>
      </span>
      <div
        className={`side-icon ${desktopMoreOpen ? "text-white" : ""}`}
        onClick={() => setDesktopMoreOpen((o) => !o)}
      >
        <MoreHorizontal size={22} />
      </div>
      {desktopMoreOpen && (
        <DesktopMoreMenu onClose={() => setDesktopMoreOpen(false)} />
      )}
      <div className="sidebar-spacer" />
      <div className="utility">
        <span>
          <Maximize size={16} />
        </span>
        <span>➜</span>
      </div>
      <div className="utility">
        <span>
          <Settings size={17} />
        </span>
        <span>
          <Volume2 size={18} />
        </span>
      </div>
      <div className="join">
        <MessageSquare size={14} />
        <b>JOIN US</b>
      </div>
      <div className="help" onClick={() => setCurrentView("help")}>
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
      <ScreenButton className="add-pair">
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
    mobileTradesOpen,
    setMobileTradesOpen,
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
    now === null ? (mobile ? "21:07:06" : "19:54:41") : fmtClock(new Date(now));

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
          ? ["21:00", "21:04", "21:08", "21:12", "21:16"]
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
          <button>
            <Pencil size={15} />
          </button>
          <button className="active">1m</button>
          <button>
            <LineChart size={15} />
          </button>
          <button>
            <Compass size={15} />
          </button>
        </div>
      )}

      {/* Floating Zoom Buttons */}
      {!mobile && (
        <div className="chart-zoom">
          <button onClick={zoomOut}>
            <Minus size={13} />
          </button>
          <button onClick={zoomIn}>
            <Plus size={13} />
          </button>
        </div>
      )}

      {/* Mobile Floating Tools (Screenshot 6: Briefcase button) */}
      {mobile && (
        <div className="mobile-tools">
          <button>•••</button>
          <span
            className="cursor-pointer"
            onClick={() => setMobileTradesOpen((o) => !o)}
          >
            <BriefcaseBusiness size={16} />
            {mobileTradesOpen ? (
              <b className="bg-red-500">
                <X size={10} />
              </b>
            ) : (
              <b>{trades.filter((t) => t.status === "open").length}</b>
            )}
          </span>
        </div>
      )}

      {/* Mobile Trades Sheet Drawer (Screenshot 6) */}
      {mobile && mobileTradesOpen && (
        <div className="mobile-trades-drawer">
          <div className="trades-head">
            <div className="flex items-center gap-4">
              <span className="font-bold text-white text-xs border-b-2 border-blue-500 pb-1">
                Trades 0
              </span>
              <span className="flex items-center gap-1 text-muted-foreground text-xs pb-1">
                <Clock3 size={13} /> 0
              </span>
            </div>
            <X
              size={16}
              className="text-muted-foreground cursor-pointer"
              onClick={() => setMobileTradesOpen(false)}
            />
          </div>
          <div className="trade-date">
            4 OCTOBER <i>6</i>
          </div>
          {trades.map((t) => (
            <div className="trade-item" key={t.id}>
              <div className="trade-row">
                <ChevronDown size={14} />
                <PairFlags flags={["🇦🇺", "🇳🇿"]} compact />
                <b>AUD/NZD (OTC)</b>
                <span>00:01:25</span>
              </div>
              <div className={`trade-result ${t.dir}`}>
                <span>
                  {t.dir === "up" ? "↑" : "↓"} {t.stake} $
                </span>
                <b className={t.status === "won" ? "won" : ""}>
                  {t.status === "won" ? "+115.20 $" : "+114.60 $"}
                </b>
              </div>
            </div>
          ))}
          <div className="text-center pt-2">
            <ChevronUp
              size={16}
              className="mx-auto text-muted-foreground cursor-pointer"
              onClick={() => setMobileTradesOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Timer Presets Popover (Screenshots 1 & 7) ---------------- */
function TimerPresetsPopover({
  mobile = false,
  onClose,
}: {
  mobile?: boolean;
  onClose: () => void;
}) {
  const {
    timeMode,
    setTimeMode,
    selectedTimerPreset,
    setSelectedTimerPreset,
    setMinutes,
  } = useT();

  const presets = mobile ? TIMER_PRESETS_MOBILE : TIMER_PRESETS_DESKTOP;

  const handleSelect = (val: string) => {
    setSelectedTimerPreset(val);
    if (val === "00:05") setMinutes(0.083);
    else if (val === "00:10") setMinutes(0.166);
    else if (val === "00:15") setMinutes(0.25);
    else if (val === "00:30") setMinutes(0.5);
    else if (val === "01:00") setMinutes(1);
    else if (val === "02:00") setMinutes(2);
    else if (val === "05:00") setMinutes(5);
    else if (val === "10:00") setMinutes(10);
    else if (val === "15:00") setMinutes(15);
    else if (val === "30:00") setMinutes(30);
    else if (val === "01:00:00") setMinutes(60);
    else if (val === "02:00:00") setMinutes(120);
    else if (val === "04:00:00") setMinutes(240);
    onClose();
  };

  return (
    <div className="timer-popover" onClick={(e) => e.stopPropagation()}>
      <div className="timer-tabs">
        <button
          className={`timer-tab ${timeMode === "timer" ? "active" : ""}`}
          onClick={() => setTimeMode("timer")}
        >
          TIMER
        </button>
        <button
          className={`timer-tab ${timeMode === "clock" ? "active" : ""}`}
          onClick={() => setTimeMode("clock")}
        >
          TIME
        </button>
      </div>

      <div className={`timer-grid ${mobile ? "" : "grid-4"}`}>
        {presets.map((p) => (
          <button
            key={p}
            className={`timer-pill ${selectedTimerPreset === p ? "active" : ""}`}
            onClick={() => handleSelect(p)}
          >
            {p}
          </button>
        ))}
      </div>

      <button className="timer-manual-btn" onClick={onClose}>
        Set manually
      </button>
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

/* ---------------- Time Box with Working SWITCH TIME (Screenshots 1 & 7) ---------------- */
function TimeBox({ mobile = false }: { mobile?: boolean }) {
  const {
    now,
    minutes,
    setMinutes,
    timeMode,
    toggleTimeMode,
    selectedTimerPreset,
    timerPopoverOpen,
    setTimerPopoverOpen,
  } = useT();

  const handleDecrease = () => {
    setMinutes((m) => Math.max(1, m - 1));
  };

  const handleIncrease = () => {
    setMinutes((m) => Math.min(60, m + 1));
  };

  const timeDisplay = useMemo(() => {
    if (timeMode === "timer") {
      return selectedTimerPreset.includes(":") &&
        selectedTimerPreset.split(":").length === 3
        ? selectedTimerPreset
        : `00:${selectedTimerPreset}`;
    }
    if (now === null) return mobile ? "19:10" : "19:56";
    const d = new Date(now + minutes * 60000);
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }, [timeMode, selectedTimerPreset, minutes, now, mobile]);

  return (
    <div
      className={mobile ? "time-box mobile relative" : "time-box relative"}
      onClick={() => setTimerPopoverOpen((o) => !o)}
    >
      <span className="field-label">
        {timeMode === "timer" ? "Timer" : "Time"}
      </span>
      <ScreenButton
        aria-label="Decrease time"
        onClick={(e) => {
          e.stopPropagation();
          handleDecrease();
        }}
      >
        <Minus size={mobile ? 13 : 15} />
      </ScreenButton>
      <strong>{timeDisplay}</strong>
      <ScreenButton
        aria-label="Increase time"
        onClick={(e) => {
          e.stopPropagation();
          handleIncrease();
        }}
      >
        <Plus size={mobile ? 14 : 16} />
      </ScreenButton>
      <span
        className="switch-link"
        onClick={(e) => {
          e.stopPropagation();
          toggleTimeMode();
        }}
        role="button"
        tabIndex={0}
      >
        SWITCH TIME
      </span>

      {timerPopoverOpen && (
        <TimerPresetsPopover
          mobile={mobile}
          onClose={() => setTimerPopoverOpen(false)}
        />
      )}
    </div>
  );
}

/* ---------------- Action Buttons (Buy & Sell with Circular Arrows) ---------------- */
function ActionButtons() {
  const { placeTrade } = useT();
  return (
    <div className="trade-actions">
      <ScreenButton className="buy" onClick={() => placeTrade("up")}>
        Buy <span>↑</span>
      </ScreenButton>
      <ScreenButton className="sell" onClick={() => placeTrade("down")}>
        Sell <span>↓</span>
      </ScreenButton>
    </div>
  );
}

/* ---------------- Trades History Panel (Screenshot 1) ---------------- */
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

        {/* Time input with popup */}
        <TimeBox />

        {/* Investment input with switch */}
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

/* ---------------- Desktop SubNav (Screenshots 3, 4, 5) ---------------- */
function DesktopSubNav() {
  const { currentView, setCurrentView } = useT();

  return (
    <div className="pages-subnav">
      <div className="subnav-tabs">
        <button
          className={`subnav-tab ${currentView === "withdrawal" ? "active" : ""}`}
          onClick={() => setCurrentView("withdrawal")}
        >
          Withdrawal
        </button>
        <button
          className={`subnav-tab ${currentView === "payments" ? "active" : ""}`}
          onClick={() => setCurrentView("payments")}
        >
          Payments
        </button>
        <button
          className={`subnav-tab ${currentView === "trading" ? "active" : ""}`}
          onClick={() => setCurrentView("trading")}
        >
          Trades
        </button>
        <button
          className={`subnav-tab ${currentView === "account" ? "active" : ""}`}
          onClick={() => setCurrentView("account")}
        >
          My account
        </button>
        <button className="subnav-tab">Market</button>
        <button className="subnav-tab">Tournaments</button>
        <button className="subnav-tab">Analytics</button>
      </div>

      {currentView === "payments" ? (
        <div className="subnav-pagination">
          <button>
            <ChevronDown size={12} className="rotate-90 inline" /> Prev
          </button>
          <span>1/2</span>
          <button>
            Next <ChevronDown size={12} className="-rotate-90 inline" />
          </button>
        </div>
      ) : (
        <div className="subnav-info">
          <div>
            My current currency: <b>$ USD</b> <em>CHANGE</em>
          </div>
          <div>Available for withdrawal</div>
          <div>In the account</div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Desktop "My account" View (Screenshot 3) ---------------- */
function DesktopAccountView() {
  return (
    <div className="desktop-page-container">
      <DesktopSubNav />
      <div className="account-page-grid">
        {/* Left Column: Personal Data */}
        <div>
          <div className="account-section-title">Personal data:</div>
          <div className="avatar-card">
            <BullAvatar />
            <div className="avatar-info">
              <div className="flex items-center gap-2">
                <b>trader.demo@test.com</b>
                <Trash2
                  size={15}
                  className="text-muted-foreground hover:text-red-500 cursor-pointer"
                />
              </div>
              <span>ID: 10482910</span>
              <span className="verified-tag">
                <Check size={14} strokeWidth={3} /> Verified
              </span>
            </div>
          </div>

          <div className="custom-field">
            <span className="field-tag">Nickname</span>
            <span>TEST TRADER</span>
          </div>

          <div className="custom-field">
            <span className="field-tag">First Name</span>
            <span>Demo</span>
          </div>

          <div className="custom-field">
            <span className="field-tag">Last Name</span>
            <span>User</span>
          </div>

          <div className="custom-field">
            <span className="field-tag">Date of birth</span>
            <span>01/01/1995</span>
            <ChevronDown size={16} />
          </div>

          <div className="custom-field">
            <span className="field-tag">Email</span>
            <span>trader.demo@test.com</span>
            <span className="text-green-500 text-xs font-bold">Verified</span>
          </div>
        </div>

        {/* Right Column: Security */}
        <div>
          <div className="account-section-title">Security:</div>

          <div className="security-row">
            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-black font-bold text-xs mt-0.5">
              ✓
            </div>
            <div>
              <div className="text-white font-bold text-sm">
                Two-step verification
              </div>
              <div className="text-muted-foreground text-xs flex items-center gap-1.5 mt-0.5">
                Receiving codes via Email{" "}
                <Pencil size={12} className="text-blue-500" />
              </div>
            </div>
          </div>

          <div className="security-switch-row">
            <span>To enter the platform</span>
            <div className="pending-switch active">
              <div className="pending-switch-knob" />
            </div>
          </div>

          <div className="security-switch-row">
            <span>To withdraw funds</span>
            <div className="pending-switch active">
              <div className="pending-switch-knob" />
            </div>
          </div>

          <div className="mt-6 flex items-start gap-3">
            <Lock size={18} className="text-muted-foreground mt-0.5" />
            <div>
              <div className="text-white font-bold text-sm">Password</div>
              <div className="text-muted-foreground text-xs mt-0.5">
                Change your account password
              </div>
              <span className="text-blue-500 text-xs font-bold mt-2 inline-block cursor-pointer hover:underline">
                Change
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Desktop "Payments" View (Screenshot 4) ---------------- */
function DesktopPaymentsView() {
  return (
    <div className="desktop-page-container">
      <DesktopSubNav />
      <div className="payments-table-container">
        <table className="payments-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Date and time</th>
              <th>Status</th>
              <th>Transaction type</th>
              <th>Payment system</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {PAYMENTS_DATA.map((p) => (
              <tr key={p.id}>
                <td className="font-semibold">{p.id}</td>
                <td className="text-muted-foreground text-xs">{p.dateTime}</td>
                <td>
                  {p.status === "Successed" ? (
                    <span className="status-pill success">
                      <Check size={14} strokeWidth={3} /> Successed
                    </span>
                  ) : (
                    <span className="status-pill failed">
                      <X size={14} strokeWidth={3} /> Failed
                    </span>
                  )}
                </td>
                <td className="text-muted-foreground">{p.type}</td>
                <td>{p.system}</td>
                <td
                  className={
                    p.status === "Successed"
                      ? "text-green-500 font-bold"
                      : "text-muted-foreground font-bold"
                  }
                >
                  {p.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------- Desktop "Withdrawal" View (Screenshot 5) ---------------- */
function DesktopWithdrawalView() {
  return (
    <div className="desktop-page-container">
      <DesktopSubNav />
      <div className="withdrawal-page-grid">
        <div className="withdrawal-balances">
          <div className="account-section-title">Account:</div>
          <div className="withdrawal-balance-item">
            <small>In the account:</small>
            <b>31,626.40$</b>
          </div>
          <div className="withdrawal-balance-item mt-4">
            <small>Available for withdrawal:</small>
            <b>31,626.40$</b>
          </div>
        </div>

        <div>
          <div className="account-section-title">Withdrawal:</div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="custom-field mb-0">
              <span className="field-tag">Amount</span>
              <span className="font-bold">10</span>
              <span className="text-muted-foreground text-xs">USD</span>
            </div>
            <div className="custom-field mb-0">
              <span className="field-tag">Payment method</span>
              <span className="flex items-center gap-1.5 font-bold">
                <span className="text-yellow-500 font-bold">🔸</span> Binance
                Pay
              </span>
              <ChevronDown size={16} />
            </div>
          </div>

          <div className="custom-field">
            <span className="field-tag">First name</span>
            <span>Demo</span>
          </div>

          <div className="custom-field">
            <span className="field-tag">Last name</span>
            <span>User</span>
          </div>

          <div className="custom-field">
            <span className="field-tag">Receive type</span>
            <span className="text-muted-foreground">Select</span>
            <ChevronDown size={16} />
          </div>

          <button className="confirm-btn">
            Confirm <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Desktop Screen Composition ---------------- */
function DesktopScreen() {
  const { currentView } = useT();

  return (
    <div className="desktop-screen">
      <DesktopSidebar />
      <DesktopHeader />

      {currentView === "trading" && (
        <>
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
        </>
      )}

      {currentView === "account" && <DesktopAccountView />}
      {currentView === "payments" && <DesktopPaymentsView />}
      {currentView === "withdrawal" && <DesktopWithdrawalView />}
      {currentView === "help" && <DesktopAccountView />}
    </div>
  );
}

/* ---------------- Mobile Header & Navigation ---------------- */
function MobileHeader() {
  const { setCurrentView } = useT();
  return (
    <header className="mobile-header">
      <AccountBlock mobile />
      <NotificationBadge />
      <ScreenButton
        className="deposit"
        onClick={() => setCurrentView("withdrawal")}
      >
        Deposit
      </ScreenButton>
    </header>
  );
}

function MobileNav() {
  const { currentView, setCurrentView } = useT();

  return (
    <nav className="mobile-nav">
      <span
        onClick={() => setCurrentView("trading")}
        className={currentView === "trading" ? "text-blue-500" : ""}
      >
        <ImageIcon size={20} />
      </span>
      <span
        onClick={() => setCurrentView("help")}
        className={currentView === "help" ? "text-blue-500" : ""}
      >
        <CircleHelp size={20} />
      </span>
      <span
        onClick={() => setCurrentView("account")}
        className={currentView === "account" ? "text-blue-500" : ""}
      >
        <UserRound size={20} />
      </span>
      <span>
        <Trophy size={20} />
        <b>4</b>
      </span>
      <span
        onClick={() => setCurrentView("more")}
        className={currentView === "more" ? "text-blue-500" : ""}
      >
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
        <div className="mobile-pair" onClick={cyclePair}>
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

/* ---------------- Mobile "My account" View (Screenshot 9) ---------------- */
function MobileAccountView() {
  return (
    <div className="mobile-view-wrapper">
      <div className="mobile-dropdown-header">
        <span>My account</span>
        <ChevronDown size={16} />
      </div>

      <div className="px-3 pb-4">
        <div className="account-section-title text-sm">Personal data:</div>
        <div className="avatar-card mb-4">
          <BullAvatar />
          <div className="avatar-info">
            <div className="flex items-center gap-2">
              <b className="text-sm">trader.demo@test.com</b>
              <Trash2 size={14} className="text-muted-foreground" />
            </div>
            <span className="text-xs">ID: 10482910</span>
            <span className="verified-tag text-xs">
              <Check size={12} strokeWidth={3} /> Verified
            </span>
          </div>
        </div>

        <div className="custom-field">
          <span className="field-tag">Nickname</span>
          <span>TEST TRADER</span>
        </div>

        <div className="custom-field">
          <span className="field-tag">First Name</span>
          <span>Demo</span>
        </div>

        <div className="custom-field">
          <span className="field-tag">Last Name</span>
          <span>User</span>
        </div>

        <div className="custom-field">
          <span className="field-tag">Date of birth</span>
          <span>01/01/1995</span>
          <ChevronDown size={14} />
        </div>

        <div className="custom-field">
          <span className="field-tag">Email</span>
          <span className="truncate pr-2 text-xs">trader.demo@test.com</span>
          <span className="text-green-500 text-xs font-bold">Verified</span>
        </div>

        <div className="custom-field">
          <span className="field-tag">Country</span>
          <span>International</span>
          <ChevronDown size={14} />
        </div>

        <div className="custom-field">
          <span className="field-tag">Address</span>
          <span>Sample Street 101, Test City</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Mobile "Payments" View (Screenshot 12) ---------------- */
function MobilePaymentsView() {
  return (
    <div className="mobile-view-wrapper">
      <div className="mobile-dropdown-header">
        <span>Payments</span>
        <ChevronDown size={16} />
      </div>

      <div className="mobile-payments-list">
        <div className="mobile-payments-head">
          <span>Transaction ID</span>
          <span>Amount</span>
        </div>

        {PAYMENTS_DATA.map((p) => (
          <div className="mobile-payment-item" key={p.id}>
            <div className="mobile-payment-left">
              <b>{p.id}</b>
              <small>{p.dateTime}</small>
              {p.status === "Successed" ? (
                <span className="status-pill success">
                  <Check size={13} strokeWidth={3} /> Successed
                </span>
              ) : (
                <span className="status-pill failed">
                  <X size={13} strokeWidth={3} /> Failed
                </span>
              )}
            </div>
            <div className="mobile-payment-right">
              <b>{p.amount}</b>
              <small>{p.system}</small>
              <small className="text-muted-foreground">{p.type}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Mobile "More" View (Screenshots 8 & 11) ---------------- */
function MobileMoreView() {
  const { setCurrentView } = useT();

  return (
    <div className="mobile-view-wrapper">
      <div className="mobile-more-view">
        <div className="mobile-more-header">
          <span>More</span>
          <X
            size={20}
            className="text-muted-foreground cursor-pointer"
            onClick={() => setCurrentView("trading")}
          />
        </div>

        <div className="mobile-more-card">
          <ShoppingBag size={18} />
          <span>Market</span>
          <span className="card-badge">2</span>
          <ChevronRight size={16} />
        </div>

        <div className="mobile-more-card">
          <PieChart size={18} />
          <span>Analytics</span>
          <ChevronRight size={16} />
        </div>

        <div className="mobile-more-card">
          <Briefcase size={18} />
          <span>TOP</span>
          <ChevronRight size={16} />
        </div>

        <div className="mobile-more-card">
          <Radio size={18} />
          <span>Signals</span>
          <ChevronRight size={16} />
        </div>

        <div className="mobile-more-links">
          <div
            className="mobile-more-link"
            onClick={() => setCurrentView("withdrawal")}
          >
            Deposit
          </div>
          <div
            className="mobile-more-link"
            onClick={() => setCurrentView("withdrawal")}
          >
            Withdrawal
          </div>
          <div
            className="mobile-more-link"
            onClick={() => setCurrentView("payments")}
          >
            Payments
          </div>
          <div
            className="mobile-more-link"
            onClick={() => setCurrentView("trading")}
          >
            Trades
          </div>
        </div>

        <div className="mobile-more-footer">
          <div className="footer-link-blue">
            <Settings size={18} />
            <span>Settings</span>
          </div>
          <div className="footer-link-red">
            <LogOut size={18} />
            <span>Logout</span>
          </div>
        </div>

        <button className="join-us-btn">
          <MessageSquare size={16} />
          <span>Join Us</span>
        </button>
      </div>
    </div>
  );
}

/* ---------------- Mobile "Help" View (Screenshot 10) ---------------- */
function MobileHelpView() {
  const { setCurrentView } = useT();

  return (
    <div className="mobile-view-wrapper">
      <div className="mobile-help-view">
        <div className="mobile-more-header">
          <span>Help</span>
          <X
            size={20}
            className="text-muted-foreground cursor-pointer"
            onClick={() => setCurrentView("trading")}
          />
        </div>

        <div className="help-item">
          <div className="help-item-icon">
            <LayoutGrid size={28} />
          </div>
          <b>FAQ</b>
          <span>Open the database</span>
        </div>

        <div className="help-item">
          <div className="help-item-icon">
            <GraduationCap size={30} />
          </div>
          <b>Tutorials</b>
          <span>Use the hints</span>
        </div>

        <div className="help-item">
          <div className="help-item-icon">
            <Headphones size={28} />
          </div>
          <b>Support</b>
          <span>Submit a ticket</span>
        </div>

        <div className="help-bottom-bubble">
          <div className="help-q-mark">?</div>
          <span>Didn't find an answer to your question?</span>
          <a>Contact support</a>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Mobile Screen (100% Fixed, Zero Scroll) ---------------- */
function MobileScreen() {
  const { currentView } = useT();

  return (
    <div className="mobile-screen">
      <MobileHeader />

      {currentView === "trading" && (
        <>
          <ChartGrid mobile />
          <MobileTradePanel />
        </>
      )}

      {currentView === "account" && <MobileAccountView />}
      {currentView === "payments" && <MobilePaymentsView />}
      {currentView === "withdrawal" && <MobilePaymentsView />}
      {currentView === "more" && <MobileMoreView />}
      {currentView === "help" && <MobileHelpView />}

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
