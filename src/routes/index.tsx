import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Bell,
  Briefcase,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleHelp,
  Clock3,
  Copy,
  Eye,
  FileText,
  Image as ImageIcon,
  LifeBuoy,
  Lock,
  LogOut,
  Maximize,
  Menu,
  MessageSquare,
  Minus,
  Moon,
  MoreHorizontal,
  Palette,
  Pencil,
  PieChart,
  Plus,
  Radio,
  RefreshCw,
  Send,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sliders,
  Sparkles,
  Sun,
  Trash2,
  Trophy,
  Upload,
  UserCheck,
  UserRound,
  Volume2,
  VolumeX,
  RotateCcw,
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
import {
  BollingerConfigModal,
  ChartTypePopover,
  DrawingsModal,
  EnvelopesConfigModal,
  IndicatorsModal,
  KeltnerConfigModal,
  MAConfigModal,
  TimeframePopover,
} from "../components/ChartToolsModals";
import {
  DepositAmountModal,
  DepositModal,
  DepositPaymentModal,
} from "../components/DepositModals";
import {
  AnalyticsView,
  LeaderboardView,
} from "../components/LeaderboardView";
import {
  ALL_PAIRS,
  TradePairModal,
  type PairItem,
} from "../components/TradePairModal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TRADEX — Web Trading Platform" },
      {
        name: "description",
        content:
          "TRADEX live web trading interface for OTC markets simulation.",
      },
      { property: "og:title", content: "TRADEX — Web Trading Platform" },
      {
        property: "og:description",
        content:
          "TRADEX live web trading interface for OTC markets simulation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TradingScreen,
});

/* ---------------- Initial Transactions ---------------- */
export type PaymentItem = {
  id: string;
  dateTime: string;
  status: "Successed" | "Pending" | "Processing" | "Failed";
  type: "Deposit" | "Withdrawal";
  system: string;
  amount: string;
};

const INITIAL_PAYMENTS_DATA: PaymentItem[] = [
  {
    id: "132140098",
    dateTime: "04/10/2026, 21:42:03",
    status: "Processing",
    type: "Deposit",
    system: "USDT (TRC-20)",
    amount: "+$100.00",
  },
  {
    id: "132140043",
    dateTime: "04/10/2026, 21:41:30",
    status: "Processing",
    type: "Deposit",
    system: "Binance Pay",
    amount: "+$100.00",
  },
  {
    id: "132049457",
    dateTime: "03/10/2026, 19:50:55",
    status: "Successed",
    type: "Deposit",
    system: "Binance Pay",
    amount: "+$69.00",
  },
  {
    id: "131992200",
    dateTime: "03/10/2026, 03:23:51",
    status: "Successed",
    type: "Deposit",
    system: "Binance Pay",
    amount: "+$69.00",
  },
  {
    id: "131988479",
    dateTime: "03/10/2026, 01:36:12",
    status: "Failed",
    type: "Deposit",
    system: "Raast",
    amount: "+Rs3,000.00",
  },
  {
    id: "131988427",
    dateTime: "03/10/2026, 01:35:01",
    status: "Failed",
    type: "Deposit",
    system: "Raast",
    amount: "+Rs5,000.00",
  },
  {
    id: "131710628",
    dateTime: "30/09/2026, 04:50:33",
    status: "Successed",
    type: "Deposit",
    system: "Binance Pay",
    amount: "+$66.00",
  },
  {
    id: "131560613",
    dateTime: "28/09/2026, 15:33:28",
    status: "Successed",
    type: "Deposit",
    system: "USDT (BEP-20)",
    amount: "+$69.00",
  },
  {
    id: "131480804",
    dateTime: "27/09/2026, 17:20:04",
    status: "Successed",
    type: "Deposit",
    system: "Raast",
    amount: "+Rs5,000.00",
  },
];

/* ---------------- Timer Presets (Screenshots 1 & 7) ---------------- */
const TIMER_PRESETS_DESKTOP = [
  "00:05", "00:10", "00:15", "00:30",
  "01:00", "02:00", "05:00", "10:00",
  "15:00", "30:00", "01:00:00", "02:00:00",
  "04:00:00",
];

const TIMER_PRESETS_MOBILE = [
  "00:05", "00:10", "00:15", "00:30",
  "01:00", "02:00", "05:00", "10:00",
  "15:00", "30:00", "01:00:00", "02:00:00",
];

/* ---------------- Types & Helpers ---------------- */
type Candle = { id: number; o: number; h: number; l: number; c: number };
type Trade = {
  id: number;
  dir: "up" | "down";
  pairName: string;
  candleId: number;
  entry: number;
  stake: number;
  rate: number;
  durationSeconds: number;
  expiresAt: number;
  status: "open" | "won" | "lost";
  profit: number;
  account: "live" | "demo";
};

type ViewScreen =
  | "trading"
  | "account"
  | "payments"
  | "withdrawal"
  | "help"
  | "more"
  | "leaderboard"
  | "analytics";

type TradeResultPopup = {
  id: number;
  won: boolean;
  dir: "up" | "down";
  stake: number;
  pnlText: string;
  candleId: number;
  entryPrice: number;
  closePrice: number;
};

type SupportTicket = {
  id: string;
  subject: string;
  category: string;
  date: string;
  status: "Open" | "In Review" | "Resolved";
};

const CANDLE_MS = 6000;

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateCandles(basePrice: number, decimals: number, count = 250): Candle[] {
  const r = seeded(42);
  const out: Candle[] = [];
  const scale = Math.pow(10, -Math.min(decimals, 4)) * 2;
  let p = basePrice;
  for (let i = 0; i < count; i++) {
    const o = p;
    const c = o + (r() - 0.5) * scale;
    const h = Math.max(o, c) + r() * (scale * 0.4);
    const l = Math.min(o, c) - r() * (scale * 0.4);
    out.push({ id: i, o, h, l, c });
    p = c;
  }
  return out;
}

export interface ActiveIndicator {
  id: string;
  type: "keltner" | "envelopes" | "bollinger" | "ma" | "donchian" | "alligator";
  name: string;
  period: number;
  param2?: number;
  param3?: number;
  colors: string[];
  visible: boolean;
}

function calcSMA(data: number[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else {
      let sum = 0;
      for (let j = 0; j < period; j++) sum += data[i - j]!;
      result.push(sum / period);
    }
  }
  return result;
}

function calcEMA(data: number[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  const k = 2 / (period + 1);
  let prevEma: number | null = null;
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else if (i === period - 1) {
      let sum = 0;
      for (let j = 0; j < period; j++) sum += data[j]!;
      prevEma = sum / period;
      result.push(prevEma);
    } else {
      prevEma = data[i]! * k + prevEma! * (1 - k);
      result.push(prevEma);
    }
  }
  return result;
}

function calcATR(candleList: Candle[], period: number): (number | null)[] {
  const trs: number[] = [];
  for (let i = 0; i < candleList.length; i++) {
    const c = candleList[i]!;
    if (i === 0) {
      trs.push(c.h - c.l);
    } else {
      const prev = candleList[i - 1]!;
      trs.push(Math.max(c.h - c.l, Math.abs(c.h - prev.c), Math.abs(c.l - prev.c)));
    }
  }
  return calcSMA(trs, period);
}

function calcStdDev(data: number[], period: number, sma: (number | null)[]): (number | null)[] {
  const result: (number | null)[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1 || sma[i] === null) {
      result.push(null);
    } else {
      let sumSq = 0;
      const mean = sma[i]!;
      for (let j = 0; j < period; j++) {
        sumSq += Math.pow(data[i - j]! - mean, 2);
      }
      result.push(Math.sqrt(sumSq / period));
    }
  }
  return result;
}

const pad = (n: number) => String(n).padStart(2, "0");
const fmtClock = (d: Date) =>
  `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
const fmtMoney = (n: number) =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

/* ---------------- Hook: State Management ---------------- */
function useTradingState() {
  const [currentView, setCurrentView] = useState<ViewScreen>("trading");
  const [selectedPair, setSelectedPair] = useState<PairItem>(ALL_PAIRS[5] || ALL_PAIRS[0]!); // Default AUD/NZD (OTC)

  const [openTabs, setOpenTabs] = useState<PairItem[]>(() => [
    ALL_PAIRS[0]!,
    ALL_PAIRS[1]!,
    ALL_PAIRS[2]!,
    ALL_PAIRS[3]!,
    ALL_PAIRS[4]!,
    ALL_PAIRS[5] || ALL_PAIRS[0]!,
  ]);

  const [candles, setCandles] = useState<Candle[]>(() =>
    generateCandles(selectedPair.basePrice, selectedPair.decimals, 600)
  );
  const [panOffset, setPanOffset] = useState(0);

  const [now, setNow] = useState<number | null>(null);
  const [account, setAccount] = useState<"live" | "demo">("live");
  const [balances, setBalances] = useState({ live: 31671.1, demo: 5000.0 });

  // Stake configuration & switch ($ vs %)
  const [stakeMode, setStakeMode] = useState<"dollar" | "percent">("dollar");
  const [stakeDollars, setStakeDollars] = useState(5);
  const [stakePercent, setStakePercent] = useState(1);

  // Time configuration & switch (clock vs timer duration)
  const [timeMode, setTimeMode] = useState<"clock" | "timer">("timer");
  const [selectedTimerPreset, setSelectedTimerPreset] = useState("00:05");
  const [minutes, setMinutes] = useState(0.0833); // 5 seconds by default
  const [timerPopoverOpen, setTimerPopoverOpen] = useState(false);

  // Pending trade toggle
  const [pendingTrade, setPendingTrade] = useState(true);

  // Modals & Overlays
  const [tradePairModalOpen, setTradePairModalOpen] = useState(false);
  const [depositModalStep, setDepositModalStep] = useState<
    "none" | "methods" | "amount" | "payment"
  >("none");
  const [depositMethod, setDepositMethod] = useState("USDT (TRC-20)");
  const [depositAmount, setDepositAmount] = useState(100);

  // Chart Tool Modals
  const [chartToolsExpanded, setChartToolsExpanded] = useState(false);
  const [timeframePopoverOpen, setTimeframePopoverOpen] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState("1m");
  const [chartTypePopoverOpen, setChartTypePopoverOpen] = useState(false);
  const [selectedChartType, setSelectedChartType] = useState("Candles");
  const [indicatorsModalOpen, setIndicatorsModalOpen] = useState(false);
  const [keltnerConfigOpen, setKeltnerConfigOpen] = useState(false);
  const [envelopesConfigOpen, setEnvelopesConfigOpen] = useState(false);
  const [bollingerConfigOpen, setBollingerConfigOpen] = useState(false);
  const [maConfigOpen, setMaConfigOpen] = useState(false);
  const [activeIndicators, setActiveIndicators] = useState<ActiveIndicator[]>([
    {
      id: "keltner-init",
      type: "keltner",
      name: "KELTNER CHANNEL",
      period: 20,
      param2: 10,
      param3: 1,
      colors: ["#22c55e", "#ef4444", "#ef4444"],
      visible: true,
    },
  ]);
  const [drawingsModalOpen, setDrawingsModalOpen] = useState(false);

  // Overlays & Drawers
  const [desktopMoreOpen, setDesktopMoreOpen] = useState(false);
  const [mobileTradesOpen, setMobileTradesOpen] = useState(false);

  // Chart Settings & Themes
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [chartBrightness, setChartBrightness] = useState(100);
  const [chartWallpaper, setChartWallpaper] = useState<
    "default" | "navy" | "charcoal" | "grid"
  >("default");
  const [candleUpColor, setCandleUpColor] = useState("#22c55e");
  const [candleDownColor, setCandleDownColor] = useState("#ef4444");
  const [soundEffects, setSoundEffects] = useState(true);
  const [oneClickTrade, setOneClickTrade] = useState(true);

  // KYC Verification Simulation
  const [kycStatus, setKycStatus] = useState<
    "verified" | "unverified" | "pending"
  >("verified");
  const [kycModalOpen, setKycModalOpen] = useState(false);
  const [kycStep, setKycStep] = useState(1);

  // Support System
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [activeTickets, setActiveTickets] = useState<SupportTicket[]>([
    {
      id: "TK-854091",
      subject: "Inquiry about deposit crediting time",
      category: "Deposits",
      date: "02/10/2026",
      status: "Resolved",
    },
  ]);

  // Payments / Transactions State
  const [paymentsList, setPaymentsList] = useState<PaymentItem[]>(
    INITIAL_PAYMENTS_DATA
  );

  // Trade Result Bubble on Chart (Screenshots 2 & 4)
  const [tradeResultPopup, setTradeResultPopup] =
    useState<TradeResultPopup | null>(null);

  // Chart zoom level (pinch-to-zoom & wheel zoom)
  const [visibleCount, setVisibleCount] = useState(18);

  const [trades, setTrades] = useState<Trade[]>([
    {
      id: 1728042000000,
      dir: "up",
      pairName: "AUD/NZD (OTC)",
      candleId: 10,
      entry: 1.1654,
      stake: 60,
      rate: 0.92,
      durationSeconds: 5,
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
      entry: 1.1662,
      stake: 60,
      rate: 0.92,
      durationSeconds: 5,
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
      entry: 1.1658,
      stake: 60,
      rate: 0.92,
      durationSeconds: 5,
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
    setCandles(generateCandles(selectedPair.basePrice, selectedPair.decimals));
  }, [selectedPair]);

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
          if (list.length > 80) list.shift();
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

  // Resolve expiring trades & trigger result bubble
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

      // Trigger floating result popup
      setTradeResultPopup({
        id: t.id,
        won,
        dir: t.dir,
        stake: t.stake,
        pnlText: won ? `+${fmtMoney(t.stake * (1 + t.rate))} $` : "0.00 $",
        candleId: t.candleId,
        entryPrice: t.entry,
        closePrice: currentPrice,
      });

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

  // Auto clear result bubble after 4 seconds
  useEffect(() => {
    if (!tradeResultPopup) return;
    const timer = setTimeout(() => {
      setTradeResultPopup(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [tradeResultPopup]);

  // Place a trade
  const placeTrade = useCallback(
    (dir: "up" | "down") => {
      if (now === null || !candlesRef.current.length) return;
      if (balances[account] < effectiveStake) return;

      const last = candlesRef.current[candlesRef.current.length - 1]!;
      setBalances((b) => ({ ...b, [account]: b[account] - effectiveStake }));

      const durSec = Math.max(5, Math.round(minutes * 60));
      const expiresAt = Date.now() + durSec * 1000;

      setTrades((ts) => [
        {
          id: Date.now(),
          dir,
          pairName: selectedPair.name,
          candleId: last.id,
          entry: last.c,
          stake: effectiveStake,
          rate: selectedPair.profit1m / 100,
          durationSeconds: durSec,
          expiresAt,
          status: "open",
          profit: 0,
          account,
        },
        ...ts,
      ]);
    },
    [account, selectedPair, balances, effectiveStake, minutes, now]
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
    setVisibleCount((c) => Math.max(6, c - 2));
  }, []);

  const zoomOut = useCallback(() => {
    setVisibleCount((c) => Math.min(55, c + 2));
  }, []);

  // Deposit confirmation handler: adds Pending transaction
  const handleProceedDeposit = useCallback(
    (amount: number) => {
      const newTx: PaymentItem = {
        id: String(Math.floor(100000000 + Math.random() * 900000000)),
        dateTime:
          new Date().toLocaleDateString("en-GB") +
          ", " +
          new Date().toLocaleTimeString("en-GB"),
        status: "Pending",
        type: "Deposit",
        system: depositMethod,
        amount: `+$${amount.toFixed(2)}`,
      };
      setPaymentsList((prev) => [newTx, ...prev]);
      setDepositAmount(amount);
      setDepositModalStep("payment");
    },
    [depositMethod]
  );

  // Withdrawal submission handler: restricts to Live account only
  const handleConfirmWithdrawal = useCallback(
    (params: {
      amount: number;
      method: string;
      receiveType: string;
      identifier: string;
    }) => {
      if (account !== "live") {
        return {
          success: false,
          error:
            "Withdrawal is only permitted from Live account. Please switch to your Live account to withdraw funds.",
        };
      }
      if (params.amount < 10) {
        return {
          success: false,
          error: "Minimum withdrawal amount is $10.00 USD.",
        };
      }
      if (params.amount > balances.live) {
        return {
          success: false,
          error: "Insufficient Live account balance for this withdrawal amount.",
        };
      }
      if (!params.identifier.trim()) {
        return {
          success: false,
          error: `Please enter your ${params.receiveType === "binance_email" ? "Binance Email" : "Binance ID"}.`,
        };
      }

      // Deduct from Live account
      setBalances((b) => ({ ...b, live: b.live - params.amount }));

      // Add to payments list as Processing
      const newTx: PaymentItem = {
        id: String(Math.floor(100000000 + Math.random() * 900000000)),
        dateTime:
          new Date().toLocaleDateString("en-GB") +
          ", " +
          new Date().toLocaleTimeString("en-GB"),
        status: "Processing",
        type: "Withdrawal",
        system: `${params.method} (${params.identifier})`,
        amount: `-$${params.amount.toFixed(2)}`,
      };
      setPaymentsList((prev) => [newTx, ...prev]);

      return { success: true };
    },
    [account, balances.live]
  );

  // Calculate dynamic Live Account P&L
  const livePnL = useMemo(() => {
    return trades
      .filter((t) => t.account === "live" && t.status !== "open")
      .reduce((sum, t) => sum + t.profit, 0);
  }, [trades]);

  const currentPrice = candles.length
    ? candles[candles.length - 1]!.c
    : selectedPair.basePrice;

  const addOpenTab = (pair: PairItem) => {
    if (!openTabs.some((t) => t.id === pair.id)) {
      setOpenTabs((prev) => [...prev, pair]);
    }
    setSelectedPair(pair);
  };

  const closeOpenTab = (pairId: string) => {
    setOpenTabs((prev) => {
      const filtered = prev.filter((t) => t.id !== pairId);
      if (filtered.length === 0) return [ALL_PAIRS[0]!];
      return filtered;
    });
    if (selectedPair.id === pairId) {
      const remaining = openTabs.filter((t) => t.id !== pairId);
      if (remaining.length > 0) {
        setSelectedPair(remaining[remaining.length - 1]!);
      }
    }
  };

  const addIndicator = (ind: ActiveIndicator) => {
    setActiveIndicators((prev) => [...prev.filter((i) => i.id !== ind.id), ind]);
  };

  const removeIndicator = (id: string) => {
    setActiveIndicators((prev) => prev.filter((i) => i.id !== id));
  };

  const clearAllIndicators = () => {
    setActiveIndicators([]);
  };

  return {
    currentView,
    setCurrentView,
    selectedPair,
    setSelectedPair,
    openTabs,
    setOpenTabs,
    addOpenTab,
    closeOpenTab,
    panOffset,
    setPanOffset,
    activeIndicators,
    setActiveIndicators,
    addIndicator,
    removeIndicator,
    clearAllIndicators,
    tradePairModalOpen,
    setTradePairModalOpen,
    depositModalStep,
    setDepositModalStep,
    depositMethod,
    setDepositMethod,
    depositAmount,
    setDepositAmount,
    handleProceedDeposit,
    handleConfirmWithdrawal,
    paymentsList,
    chartToolsExpanded,
    setChartToolsExpanded,
    timeframePopoverOpen,
    setTimeframePopoverOpen,
    selectedTimeframe,
    setSelectedTimeframe,
    chartTypePopoverOpen,
    setChartTypePopoverOpen,
    selectedChartType,
    setSelectedChartType,
    indicatorsModalOpen,
    setIndicatorsModalOpen,
    keltnerConfigOpen,
    setKeltnerConfigOpen,
    envelopesConfigOpen,
    setEnvelopesConfigOpen,
    bollingerConfigOpen,
    setBollingerConfigOpen,
    maConfigOpen,
    setMaConfigOpen,
    drawingsModalOpen,
    setDrawingsModalOpen,
    candles,
    now,
    account,
    setAccount,
    balances,
    setBalances,
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
    setVisibleCount,
    zoomIn,
    zoomOut,
    trades,
    placeTrade,
    tradeResultPopup,
    setTradeResultPopup,
    price: currentPrice,
    nextCandleAt: nextCandleAt.current,
    settingsModalOpen,
    setSettingsModalOpen,
    chartBrightness,
    setChartBrightness,
    chartWallpaper,
    setChartWallpaper,
    candleUpColor,
    setCandleUpColor,
    candleDownColor,
    setCandleDownColor,
    soundEffects,
    setSoundEffects,
    oneClickTrade,
    setOneClickTrade,
    kycStatus,
    setKycStatus,
    kycModalOpen,
    setKycModalOpen,
    kycStep,
    setKycStep,
    supportModalOpen,
    setSupportModalOpen,
    activeTickets,
    setActiveTickets,
    livePnL,
  };
}

type TradingState = ReturnType<typeof useTradingState>;
const Ctx = createContext<TradingState | null>(null);
const useT = () => useContext(Ctx)!;

/* ---------------- Reusable UI Elements ---------------- */
function ScreenButton({
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
}

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
          TEST TRADER
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
    </div>
  );
}

function AccountBlock({ mobile = false }: { mobile?: boolean }) {
  const { account, balances } = useT();
  const [open, setOpen] = useState(false);
  const bal = balances[account];

  return (
    <div className="relative">
      <div
        className={mobile ? "account account-mobile" : "account"}
        onClick={() => setOpen((o) => !o)}
        role="button"
        tabIndex={0}
      >
        <span className="diamond">♦</span>
        <div>
          <small>{account === "live" ? "LIVE" : "DEMO"}</small>
          <strong>${fmtMoney(bal)}</strong>
        </div>
        <ChevronDown size={14} className={open ? "rotate-180 transition-transform" : "transition-transform"} />
      </div>
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

/* ---------------- Presets Popover (Screenshots 1 & 7) ---------------- */
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

  const handleSelectPreset = (preset: string) => {
    setSelectedTimerPreset(preset);
    const parts = preset.split(":").map(Number);
    let totalMinutes = 0.0833;
    if (parts.length === 2) {
      totalMinutes = (parts[0]! * 60 + parts[1]!) / 60;
    } else if (parts.length === 3) {
      totalMinutes = (parts[0]! * 3600 + parts[1]! * 60 + parts[2]!) / 60;
    }
    setMinutes(totalMinutes);
    onClose();
  };

  return (
    <div
      className={mobile ? "timer-presets-popover mobile" : "timer-presets-popover"}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="timer-presets-tabs">
        <button
          className={timeMode === "timer" ? "active" : ""}
          onClick={() => setTimeMode("timer")}
        >
          TIMER
        </button>
        <button
          className={timeMode === "clock" ? "active" : ""}
          onClick={() => setTimeMode("clock")}
        >
          TIME
        </button>
      </div>

      <div className="timer-grid">
        {presets.map((preset) => (
          <button
            key={preset}
            className={`timer-preset-pill ${selectedTimerPreset === preset ? "selected" : ""}`}
            onClick={() => handleSelectPreset(preset)}
          >
            {preset}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Time & Stake Boxes ---------------- */
function TimeBox({ mobile = false }: { mobile?: boolean }) {
  const {
    timeMode,
    selectedTimerPreset,
    toggleTimeMode,
    timerPopoverOpen,
    setTimerPopoverOpen,
  } = useT();

  return (
    <div className="relative">
      <div
        className={mobile ? "time-box mobile" : "time-box"}
        onClick={() => setTimerPopoverOpen((o) => !o)}
      >
        <span className="field-label">{timeMode === "timer" ? "Timer" : "Time"}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Minus size={14} />
        </button>
        <strong>{timeMode === "timer" ? selectedTimerPreset : "22:07"}</strong>
        <button
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Plus size={14} />
        </button>
        <span
          className="switch-link"
          onClick={(e) => {
            e.stopPropagation();
            toggleTimeMode();
          }}
        >
          SWITCH
        </span>
      </div>

      {timerPopoverOpen && (
        <TimerPresetsPopover
          mobile={mobile}
          onClose={() => setTimerPopoverOpen(false)}
        />
      )}
    </div>
  );
}

function StakeBox({ mobile = false }: { mobile?: boolean }) {
  const {
    stakeMode,
    stakeDollars,
    setStakeDollars,
    stakePercent,
    setStakePercent,
    toggleStakeMode,
  } = useT();

  const handleMinus = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (stakeMode === "dollar") {
      setStakeDollars((d) => Math.max(1, d - 1));
    } else {
      setStakePercent((p) => Math.max(1, p - 1));
    }
  };

  const handlePlus = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (stakeMode === "dollar") {
      setStakeDollars((d) => d + 1);
    } else {
      setStakePercent((p) => Math.min(100, p + 1));
    }
  };

  return (
    <div className={mobile ? "stake-box mobile" : "stake-box"}>
      <span className="field-label">Investment</span>
      <button onClick={handleMinus}>
        <Minus size={14} />
      </button>
      <strong>
        {stakeMode === "dollar" ? `${stakeDollars} $` : `${stakePercent} %`}
      </strong>
      <button onClick={handlePlus}>
        <Plus size={14} />
      </button>
      <span className="switch-link" onClick={toggleStakeMode}>
        SWITCH
      </span>
    </div>
  );
}

/* ---------------- Action Buttons ---------------- */
function ActionButtons() {
  const { placeTrade } = useT();

  return (
    <div className="trade-actions">
      <button className="buy" onClick={() => placeTrade("up")}>
        <b>Buy</b>
        <span>
          <ArrowUp size={16} strokeWidth={3} />
        </span>
      </button>
      <button className="sell" onClick={() => placeTrade("down")}>
        <b>Sell</b>
        <span>
          <ArrowDown size={16} strokeWidth={3} />
        </span>
      </button>
    </div>
  );
}

/* ---------------- Desktop Header & Navigation ---------------- */
function DesktopHeader() {
  const { setDepositModalStep, setCurrentView, setDesktopMoreOpen } = useT();

  return (
    <header className="desktop-header">
      <div className="brand flex items-center gap-2">
        <button
          className="menu-btn hover:text-white text-muted-foreground mr-1"
          onClick={() => setDesktopMoreOpen((o) => !o)}
          aria-label="Menu"
        >
          <Menu size={22} />
        </button>
        <svg viewBox="0 0 24 24" width="22" height="22">
          <path d="M12 2 L21 7 L21 17 L12 22 L3 17 L3 7 Z" fill="none" stroke="#fff" strokeWidth="2" />
          <line x1="9" y1="8" x2="9" y2="16" stroke="#fff" strokeWidth="2" />
          <line x1="12" y1="6" x2="12" y2="18" stroke="#fff" strokeWidth="2" />
          <line x1="15" y1="8" x2="15" y2="16" stroke="#fff" strokeWidth="2" />
        </svg>
        <b>QUOTEX</b>
        <i />
        <strong>WEB TRADING PLATFORM</strong>
      </div>
      <div className="header-actions">
        <NotificationBadge />
        <AccountBlock />
        <ScreenButton
          className="deposit"
          onClick={() => setDepositModalStep("methods")}
        >
          + Deposit
        </ScreenButton>
        <button
          className="withdraw"
          onClick={() => setCurrentView("withdrawal")}
        >
          Withdrawal
        </button>
      </div>
    </header>
  );
}

function DesktopSubNav() {
  const { currentView, setCurrentView } = useT();

  return (
    <div className="desktop-sub-nav">
      <button
        className={currentView === "withdrawal" ? "active" : ""}
        onClick={() => setCurrentView("withdrawal")}
      >
        Withdrawal
      </button>
      <button
        className={currentView === "payments" ? "active" : ""}
        onClick={() => setCurrentView("payments")}
      >
        Payments
      </button>
      <button
        className={currentView === "trading" ? "active" : ""}
        onClick={() => setCurrentView("trading")}
      >
        Trades
      </button>
      <button
        className={currentView === "account" ? "active" : ""}
        onClick={() => setCurrentView("account")}
      >
        My account
      </button>
      <button
        className={currentView === "analytics" ? "active" : ""}
        onClick={() => setCurrentView("analytics")}
      >
        Market
      </button>
      <button
        className={currentView === "leaderboard" ? "active" : ""}
        onClick={() => setCurrentView("leaderboard")}
      >
        Tournaments
      </button>
      <button
        className={currentView === "analytics" ? "active" : ""}
        onClick={() => setCurrentView("analytics")}
      >
        Analytics
      </button>
    </div>
  );
}

/* ---------------- Desktop Sidebar Rail ---------------- */
function DesktopSidebar() {
  const {
    currentView,
    setCurrentView,
    desktopMoreOpen,
    setDesktopMoreOpen,
    setSettingsModalOpen,
  } = useT();

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
      <span
        className="badge-icon side-icon"
        onClick={() => setCurrentView("leaderboard")}
      >
        <Trophy size={20} />
        <b>4</b>
      </span>
      <span
        className="badge-icon side-icon"
        onClick={() => setCurrentView("analytics")}
      >
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
        <span onClick={() => setSettingsModalOpen(true)} className="cursor-pointer">
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

function DesktopMoreMenu({ onClose }: { onClose: () => void }) {
  const { setCurrentView } = useT();

  return (
    <div className="desktop-more-popover" onClick={(e) => e.stopPropagation()}>
      <button
        className="desktop-more-item"
        onClick={() => {
          setCurrentView("trading");
          onClose();
        }}
      >
        <Radio size={18} />
        <span>Signals</span>
        <ChevronRight size={16} />
      </button>

      <button
        className="desktop-more-item"
        onClick={() => {
          setCurrentView("leaderboard");
          onClose();
        }}
      >
        <Trophy size={18} />
        <span>Tournaments</span>
        <span className="item-badge">4</span>
        <ChevronRight size={16} />
      </button>

      <button
        className="desktop-more-item"
        onClick={() => {
          setCurrentView("analytics");
          onClose();
        }}
      >
        <ShoppingBag size={18} />
        <span>Market</span>
        <span className="item-badge">2</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

/* ---------------- Pair Tabs (Interactive Pair Switcher) ---------------- */
function PairTabs() {
  const {
    openTabs,
    selectedPair,
    setSelectedPair,
    closeOpenTab,
    setTradePairModalOpen,
  } = useT();

  return (
    <div className="pair-tabs">
      <ScreenButton
        className="add-pair"
        onClick={() => setTradePairModalOpen(true)}
        aria-label="Add pair"
      >
        <Plus size={18} />
      </ScreenButton>

      {openTabs.map((pair) => {
        const isSelected = pair.id === selectedPair.id;
        return (
          <div
            key={pair.id}
            className={`pair-tab ${isSelected ? "selected" : ""}`}
            onClick={() => setSelectedPair(pair)}
            role="button"
            tabIndex={0}
          >
            <span className="tab-flags">
              <span>{pair.flags[0]}</span>
              <span>{pair.flags[1]}</span>
            </span>
            <div>
              <b>{pair.name.replace(" (OTC)", "").slice(0, 9)}...</b>
              <strong>{pair.profit1m}%</strong>
            </div>
            {isSelected ? (
              <X
                size={13}
                className="text-muted-foreground hover:text-white ml-1 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  closeOpenTab(pair.id);
                }}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- Candlestick Chart (Pinch-to-zoom, Pan, & Indicators) ---------------- */
function ChartGrid({ mobile = false }: { mobile?: boolean }) {
  const {
    candles,
    now,
    trades,
    price,
    nextCandleAt,
    account,
    selectedPair,
    visibleCount,
    setVisibleCount,
    zoomIn,
    zoomOut,
    panOffset,
    setPanOffset,
    activeIndicators,
    setActiveIndicators,
    mobileTradesOpen,
    setMobileTradesOpen,
    chartToolsExpanded,
    setChartToolsExpanded,
    timeframePopoverOpen,
    setTimeframePopoverOpen,
    selectedTimeframe,
    setSelectedTimeframe,
    chartTypePopoverOpen,
    setChartTypePopoverOpen,
    selectedChartType,
    setSelectedChartType,
    setIndicatorsModalOpen,
    setKeltnerConfigOpen,
    setEnvelopesConfigOpen,
    setBollingerConfigOpen,
    setMaConfigOpen,
    setDrawingsModalOpen,
    tradeResultPopup,
    setTradeResultPopup,
    chartBrightness,
    chartWallpaper,
    candleUpColor,
    candleDownColor,
  } = useT();

  const chartRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartPan = useRef(0);
  const touchDist = useRef<number | null>(null);

  const count = Math.max(6, Math.min(60, visibleCount));
  const step = 100 / count;
  const totalCandles = candles.length;
  const latestIdx = totalCandles - 1;
  const anchorSlot = count - 1.2 - panOffset;

  // Touch gesture handlers (Single finger drag to pan, Two finger pinch to zoom)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      isDragging.current = false;
      const dx = e.touches[0]!.clientX - e.touches[1]!.clientX;
      const dy = e.touches[0]!.clientY - e.touches[1]!.clientY;
      touchDist.current = Math.hypot(dx, dy);
    } else if (e.touches.length === 1) {
      isDragging.current = true;
      dragStartX.current = e.touches[0]!.clientX;
      dragStartPan.current = panOffset;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchDist.current !== null) {
      const dx = e.touches[0]!.clientX - e.touches[1]!.clientX;
      const dy = e.touches[0]!.clientY - e.touches[1]!.clientY;
      const dist = Math.hypot(dx, dy);
      const diff = dist - touchDist.current;
      if (Math.abs(diff) > 8) {
        if (diff > 0) {
          setVisibleCount((c) => Math.max(6, c - 1));
        } else {
          setVisibleCount((c) => Math.min(60, c + 1));
        }
        touchDist.current = dist;
      }
    } else if (e.touches.length === 1 && isDragging.current) {
      const currentX = e.touches[0]!.clientX;
      const dx = currentX - dragStartX.current;
      const chartWidth = chartRef.current?.clientWidth || 600;
      const slotPx = chartWidth / count;
      const deltaSlots = dx / slotPx;
      const newPan = Math.max(0, Math.min(candles.length - count, dragStartPan.current + deltaSlots));
      setPanOffset(newPan);
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    touchDist.current = null;
  };

  // Mouse drag handlers for desktop pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartPan.current = panOffset;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStartX.current;
    const chartWidth = chartRef.current?.clientWidth || 600;
    const slotPx = chartWidth / count;
    const deltaSlots = dx / slotPx;
    const newPan = Math.max(0, Math.min(candles.length - count, dragStartPan.current + deltaSlots));
    setPanOffset(newPan);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  };

  // Determine which candles are in visible view
  const minIdx = Math.max(0, Math.floor(latestIdx - anchorSlot - 2));
  const maxIdx = Math.min(totalCandles, Math.ceil(latestIdx - anchorSlot + count + 2));
  const visible = candles.slice(minIdx, maxIdx);

  const insetTop = mobile ? 24 : 60;
  const insetBottom = mobile ? 28 : 38;

  const { max, range } = useMemo(() => {
    if (visible.length === 0) return { max: price + 0.001, range: 0.002 };
    let hi = -Infinity;
    let lo = Infinity;
    for (const c of visible) {
      hi = Math.max(hi, c.h);
      lo = Math.min(lo, c.l);
    }
    const padVal = (hi - lo) * 0.1 || 0.0004;
    return { max: hi + padVal, range: hi - lo + padVal * 2 };
  }, [visible, price]);

  const frac = (p: number) => Math.min(1, Math.max(0, (max - p) / range));
  const yCss = (f: number) =>
    `calc(${insetTop}px + (100% - ${insetTop + insetBottom}px) * ${f})`;

  const highest = visible.length > 0 ? Math.max(...visible.map((c) => c.h)) : price;
  const lowest = visible.length > 0 ? Math.min(...visible.map((c) => c.l)) : price;

  const openTrade = trades.find(
    (t) => t.status === "open" && t.account === account
  );
  const remaining =
    now === null
      ? 0
      : Math.max(
          0,
          Math.ceil(
            ((openTrade ? openTrade.expiresAt : nextCandleAt) - now) / 1000
          )
        );
  const countdown = `${pad(Math.floor(remaining / 60))}:${pad(remaining % 60)}`;
  const clock =
    now === null
      ? mobile
        ? "21:43:30"
        : "19:54:41"
      : fmtClock(new Date(now));

  const priceFormatted = price.toFixed(selectedPair.decimals);
  const labelCount = mobile ? 5 : 7;
  const openTradesCount = trades.filter(
    (t) => t.status === "open" && t.account === account
  ).length;

  // Compute indicators across full candle series
  const closePrices = useMemo(() => candles.map((c) => c.c), [candles]);

  interface ComputedIndicator extends ActiveIndicator {
    upper?: (number | null)[];
    middle?: (number | null)[];
    lower?: (number | null)[];
  }

  const computedIndicators: ComputedIndicator[] = useMemo(() => {
    const list: ComputedIndicator[] = [];
    activeIndicators
      .filter((ind) => ind.visible)
      .forEach((ind) => {
        if (ind.type === "keltner") {
          const ema = calcEMA(closePrices, ind.period || 20);
          const atr = calcATR(candles, ind.param2 || 10);
          const mult = ind.param3 || 1;
          list.push({
            ...ind,
            upper: ema.map((v, i) => (v !== null && atr[i] !== null ? v + mult * atr[i]! : null)),
            middle: ema,
            lower: ema.map((v, i) => (v !== null && atr[i] !== null ? v - mult * atr[i]! : null)),
          });
        } else if (ind.type === "envelopes") {
          const sma = calcSMA(closePrices, ind.period || 20);
          const dev = (ind.param2 || 0.1) / 100;
          list.push({
            ...ind,
            upper: sma.map((v) => (v !== null ? v * (1 + dev) : null)),
            middle: sma,
            lower: sma.map((v) => (v !== null ? v * (1 - dev) : null)),
          });
        } else if (ind.type === "bollinger") {
          const sma = calcSMA(closePrices, ind.period || 20);
          const std = calcStdDev(closePrices, ind.period || 20, sma);
          const mult = ind.param2 || 2;
          list.push({
            ...ind,
            upper: sma.map((v, i) => (v !== null && std[i] !== null ? v + mult * std[i]! : null)),
            middle: sma,
            lower: sma.map((v, i) => (v !== null && std[i] !== null ? v - mult * std[i]! : null)),
          });
        } else if (ind.type === "ma") {
          const ma = ind.param2 === 1 ? calcEMA(closePrices, ind.period || 14) : calcSMA(closePrices, ind.period || 14);
          list.push({
            ...ind,
            middle: ma,
          });
        }
      });
    return list;
  }, [activeIndicators, closePrices, candles]);

  // Indicator handlers
  const toggleIndicatorVisible = (id: string) => {
    setActiveIndicators((prev) =>
      prev.map((ind) => (ind.id === id ? { ...ind, visible: !ind.visible } : ind))
    );
  };

  const removeIndicator = (id: string) => {
    setActiveIndicators((prev) => prev.filter((ind) => ind.id !== id));
  };

  const openIndicatorConfig = (ind: ActiveIndicator) => {
    if (ind.type === "keltner") setKeltnerConfigOpen(true);
    else if (ind.type === "envelopes") setEnvelopesConfigOpen(true);
    else if (ind.type === "bollinger") setBollingerConfigOpen(true);
    else if (ind.type === "ma") setMaConfigOpen(true);
  };

  return (
    <div
      ref={chartRef}
      className={mobile ? "chart-grid mobile-chart" : "chart-grid"}
      style={{
        filter: `brightness(${chartBrightness}%)`,
        background:
          chartWallpaper === "navy"
            ? "#0b132b"
            : chartWallpaper === "charcoal"
            ? "#121214"
            : chartWallpaper === "grid"
            ? "#0d1b2a"
            : undefined,
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
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
      {!mobile ? (
        <div className="pair-info">
          <b>i</b> PAIR INFORMATION
        </div>
      ) : (
        <div className="info-dot">i</div>
      )}

      {/* High and Low Badges */}
      <span className="high-label">
        {highest.toFixed(selectedPair.decimals)}
      </span>
      <span className="low-label">
        {lowest.toFixed(selectedPair.decimals)}
      </span>

      {/* Active Indicator Badges List */}
      <div className="indicator-badges-list">
        {activeIndicators.map((ind) => (
          <div key={ind.id} className="indicator-pill-badge">
            <ChevronRight size={12} className="rotate-180 text-muted-foreground" />
            <Eye
              size={12}
              className={`cursor-pointer ${ind.visible ? "text-white" : "text-muted-foreground"}`}
              onClick={() => toggleIndicatorVisible(ind.id)}
            />
            <span>{ind.name}</span>
            {ind.colors.map((c, i) => (
              <div key={i} className="w-2.5 h-2.5 rounded" style={{ background: c }} />
            ))}
            <span>
              {ind.period} {ind.param2 ? `${ind.param2}${ind.type === "envelopes" ? "%" : ""}` : ""}
            </span>
            <Pencil
              size={11}
              className="cursor-pointer hover:text-white"
              onClick={() => openIndicatorConfig(ind)}
            />
            <X
              size={11}
              className="cursor-pointer text-red-400 hover:text-red-300"
              onClick={() => removeIndicator(ind.id)}
            />
          </div>
        ))}
      </div>

      {/* Real Math Indicator SVG Paths */}
      <svg className="indicator-overlay-svg">
        {computedIndicators.map((ind) => {
          if (!ind) return null;
          const pointsUpper: string[] = [];
          const pointsMiddle: string[] = [];
          const pointsLower: string[] = [];

          visible.forEach((c) => {
            const idx = c.id;
            const slot = anchorSlot - (latestIdx - idx);
            if (slot < -1 || slot > count + 1) return;
            const x = (slot + 0.5) * step;

            if (ind.upper && ind.upper[idx] !== null && ind.upper[idx] !== undefined) {
              const y = frac(ind.upper[idx]!) * 100;
              pointsUpper.push(`${pointsUpper.length === 0 ? "M" : "L"} ${x}% ${y}%`);
            }
            if (ind.middle && ind.middle[idx] !== null && ind.middle[idx] !== undefined) {
              const y = frac(ind.middle[idx]!) * 100;
              pointsMiddle.push(`${pointsMiddle.length === 0 ? "M" : "L"} ${x}% ${y}%`);
            }
            if (ind.lower && ind.lower[idx] !== null && ind.lower[idx] !== undefined) {
              const y = frac(ind.lower[idx]!) * 100;
              pointsLower.push(`${pointsLower.length === 0 ? "M" : "L"} ${x}% ${y}%`);
            }
          });

          return (
            <g key={ind.id}>
              {pointsUpper.length > 0 && (
                <path
                  d={pointsUpper.join(" ")}
                  fill="none"
                  stroke={ind.colors[0] || "#22c55e"}
                  strokeWidth="1.5"
                />
              )}
              {pointsMiddle.length > 0 && (
                <path
                  d={pointsMiddle.join(" ")}
                  fill="none"
                  stroke={ind.colors[1] || ind.colors[0] || "#ef4444"}
                  strokeWidth={ind.type === "ma" ? "2" : "1"}
                />
              )}
              {pointsLower.length > 0 && (
                <path
                  d={pointsLower.join(" ")}
                  fill="none"
                  stroke={ind.colors[2] || ind.colors[1] || "#ef4444"}
                  strokeWidth="1.5"
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Candlesticks & Entry Markers */}
      <div className="candles">
        {visible.map((c) => {
          const slot = anchorSlot - (latestIdx - c.id);
          if (slot < -1 || slot > count + 1) return null;
          const top = frac(c.h) * 100;
          const bottom = frac(c.l) * 100;
          const bTop = frac(Math.max(c.o, c.c)) * 100;
          const bBot = frac(Math.min(c.o, c.c)) * 100;
          const candleW = Math.max(3, Math.min(mobile ? 14 : 10, step * 0.72));
          const isUp = c.c >= c.o;
          return (
            <div
              className={`candle ${isUp ? "up" : "down"}`}
              style={{
                left: `${slot * step}%`,
                width: `${candleW}%`,
                color: isUp ? candleUpColor : candleDownColor,
              }}
              key={c.id}
            >
              <i style={{ top: `${top}%`, height: `${bottom - top}%` }} />
              <b style={{ top: `${bTop}%`, height: `${bBot - bTop}%` }} />
            </div>
          );
        })}

        {trades
          .filter((t) => t.account === account && t.status === "open")
          .map((t) => {
            const slot = anchorSlot - (latestIdx - t.candleId);
            if (slot < -1 || slot > count + 1) return null;
            return (
              <div
                key={t.id}
                className={`trade-marker ${t.dir}`}
                style={{
                  left: `calc(${slot * step}% + ${mobile ? 3 : 1.2}%)`,
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

      {/* Floating Jump to Live Button when panned back in history */}
      {panOffset > 1 && (
        <button
          className="chart-live-btn"
          style={{ position: "absolute", bottom: mobile ? 36 : 42, right: 14, zIndex: 20 }}
          onClick={() => setPanOffset(0)}
        >
          <RotateCcw size={12} />
          <span>Live ({priceFormatted})</span>
        </button>
      )}

      {/* Trade Result Floating Bubble & Vertical Line (Screenshots 2 & 4) */}
      {tradeResultPopup && (
        <>
          <div
            className={`trade-result-line ${
              tradeResultPopup.won ? "won" : "lost"
            }`}
            style={{ left: "54%" }}
          />
          <div
            className={`trade-result-bubble ${
              tradeResultPopup.won ? "won" : "lost"
            }`}
            style={{
              left: "48%",
              top: yCss(frac(tradeResultPopup.closePrice)),
            }}
          >
            <div className="result-bubble-header">
              <span>RESULT (P/L)</span>
              <X
                size={14}
                className="result-bubble-close"
                onClick={() => setTradeResultPopup(null)}
              />
            </div>
            <div className="result-bubble-amount">{tradeResultPopup.pnlText}</div>
          </div>
        </>
      )}

      {/* Y-Axis Price Labels */}
      {Array.from({ length: labelCount }, (_, k) => {
        const f = (k + 0.5) / labelCount;
        const p = max - f * range;
        return (
          <span className="price-label" style={{ top: yCss(f) }} key={k}>
            {p.toFixed(selectedPair.decimals)}
          </span>
        );
      })}

      {/* Zoom Controls (Desktop only) */}
      {!mobile && (
        <div className="chart-zoom">
          <button onClick={zoomIn} aria-label="Zoom in">
            +
          </button>
          <button onClick={zoomOut} aria-label="Zoom out">
            −
          </button>
        </div>
      )}

      {/* X-Axis Timestamps */}
      <div className="x-labels">
        {(mobile
          ? ["21:24", "21:32", "21:40", "21:48"]
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

      {/* Floating Chart Left Tool Rails */}
      <div className="chart-tool-rail">
        <button
          className={`chart-tool-btn ${chartToolsExpanded ? "active" : ""}`}
          onClick={() => setChartToolsExpanded((o) => !o)}
        >
          {chartToolsExpanded ? <X size={14} /> : "•••"}
        </button>

        {chartToolsExpanded && (
          <>
            <button
              className="chart-tool-btn"
              onClick={() => setDrawingsModalOpen(true)}
            >
              <Pencil size={15} />
            </button>
            <button
              className="chart-tool-btn white-active"
              onClick={() => setTimeframePopoverOpen((o) => !o)}
            >
              {selectedTimeframe}
            </button>
            <button
              className="chart-tool-btn"
              onClick={() => setChartTypePopoverOpen((o) => !o)}
            >
              🕯️
            </button>
            <button
              className="chart-tool-btn"
              onClick={() => setIndicatorsModalOpen(true)}
            >
              📐
            </button>
          </>
        )}

        {/* Mobile Briefcase button with open/close state & badge (Screenshots 1-4) */}
        {mobile && !chartToolsExpanded && (
          <button
            className={`chart-tool-btn ${
              mobileTradesOpen ? "briefcase-btn-open" : "active"
            } relative`}
            onClick={() => setMobileTradesOpen((o) => !o)}
          >
            <BriefcaseBusiness size={16} />
            {mobileTradesOpen ? (
              <span className="briefcase-btn-close-badge">✕</span>
            ) : (
              <b className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 text-[10px] grid place-items-center">
                {openTradesCount}
              </b>
            )}
          </button>
        )}
      </div>

      {/* Timeframe Popover */}
      {timeframePopoverOpen && (
        <TimeframePopover
          current={selectedTimeframe}
          onSelect={(tf) => {
            setSelectedTimeframe(tf);
            setTimeframePopoverOpen(false);
          }}
        />
      )}

      {/* Chart Type Popover */}
      {chartTypePopoverOpen && (
        <ChartTypePopover
          current={selectedChartType}
          onSelect={(ct) => {
            setSelectedChartType(ct);
            setChartTypePopoverOpen(false);
          }}
        />
      )}

      {/* Mobile Trades Sheet Drawer with LIVE Ticker (Screenshots 1-4) */}
      {mobile && mobileTradesOpen && (
        <div className="mobile-trades-drawer">
          <div className="trades-head">
            <div className="flex items-center gap-4">
              <span className="font-bold text-white text-xs border-b-2 border-blue-500 pb-1 flex items-center gap-1.5">
                Trades <b className="bg-blue-600 px-1.5 py-0.2 rounded-full text-[10px]">{openTradesCount}</b>
              </span>
              <span className="flex items-center gap-1 text-muted-foreground text-xs pb-1">
                <Clock3 size={13} /> {trades.filter((t) => t.status !== "open").length}
              </span>
            </div>
            <X
              size={16}
              className="text-muted-foreground cursor-pointer hover:text-white"
              onClick={() => setMobileTradesOpen(false)}
            />
          </div>

          <div className="trade-date">
            4 OCTOBER <i>{trades.length}</i>
          </div>

          <div className="flex flex-col gap-1 overflow-y-auto max-h-[220px]">
            {trades.map((t) => {
              const isOpen = t.status === "open";
              const remSec =
                isOpen && now !== null
                  ? Math.max(0, Math.ceil((t.expiresAt - now) / 1000))
                  : t.durationSeconds;
              const timerStr = isOpen
                ? `00:${pad(Math.floor(remSec / 60))}:${pad(remSec % 60)}`
                : `00:00:${pad(t.durationSeconds)}`;

              return (
                <div className="trade-item" key={t.id}>
                  <div className="trade-row">
                    <ChevronDown size={14} className="text-muted-foreground" />
                    <span>
                      {selectedPair.flags[0]}
                      {selectedPair.flags[1]}
                    </span>
                    <b>{t.pairName}</b>
                    <span className={isOpen ? "text-sky-400 font-bold font-mono" : ""}>
                      {timerStr}
                    </span>
                  </div>
                  <div className={`trade-result ${t.dir}`}>
                    <span>
                      {t.dir === "up" ? "↑" : "↓"} {t.stake} $
                    </span>
                    {isOpen ? (
                      <span className="text-green-500 font-bold">
                        +{fmtMoney(t.stake * (1 + t.rate))} $
                      </span>
                    ) : (
                      <b className={t.status === "won" ? "won text-green-500" : "text-red-500"}>
                        {t.status === "won"
                          ? `+${fmtMoney(t.profit + t.stake)} $`
                          : "0.00 $"}
                      </b>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

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

/* ---------------- Desktop Trade Panel (Screenshots 5 & 6) ---------------- */
function TradePanel() {
  const {
    selectedPair,
    effectiveStake,
    pendingTrade,
    togglePendingTrade,
    trades,
    now,
  } = useT();
  const payout = `${fmtMoney(effectiveStake * (1 + selectedPair.profit1m / 100))} $`;

  return (
    <aside className="right-column">
      <div className="trade-panel">
        <TimeBox />
        <StakeBox />

        <div className="payout">
          <span>Payout</span>
          <i />
          <strong>{payout}</strong>
        </div>

        <ActionButtons />

        <div className="pending" onClick={togglePendingTrade}>
          <span>PENDING TRADE</span>
          <div className={`pending-switch ${pendingTrade ? "active" : ""}`}>
            <div className="pending-switch-knob" />
          </div>
        </div>
      </div>

      <div className="trades-panel">
        <div className="trades-head">
          <b>Trades</b>
          <span>{trades.length}</span>
        </div>
        <div className="trades-scroll">
          <div className="trade-date">
            4 OCTOBER <i>{trades.length}</i>
          </div>
          {trades.map((t) => {
            const isOpen = t.status === "open";
            const remSec =
              isOpen && now !== null
                ? Math.max(0, Math.ceil((t.expiresAt - now) / 1000))
                : t.durationSeconds;
            const timerStr = isOpen
              ? `00:${pad(Math.floor(remSec / 60))}:${pad(remSec % 60)}`
              : `00:00:${pad(t.durationSeconds)}`;

            return (
              <div className="trade-item" key={t.id}>
                <div className="trade-row">
                  <ChevronDown size={14} className="text-muted-foreground" />
                  <span>
                    {selectedPair.flags[0]}
                    {selectedPair.flags[1]}
                  </span>
                  <b>{t.pairName}</b>
                  <span className={isOpen ? "text-sky-400 font-bold font-mono" : ""}>
                    {timerStr}
                  </span>
                </div>
                <div className={`trade-result ${t.dir}`}>
                  <span>
                    {t.dir === "up" ? "↑" : "↓"} {t.stake} $
                  </span>
                  {isOpen ? (
                    <span className="text-green-500 font-bold">
                      +{fmtMoney(t.stake * (1 + t.rate))} $
                    </span>
                  ) : (
                    <b className={t.status === "won" ? "won text-green-500" : "text-red-500"}>
                      {t.status === "won"
                        ? `+${fmtMoney(t.profit + t.stake)} $`
                        : "0.00 $"}
                    </b>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

/* ---------------- Desktop "My Account" View ---------------- */
function DesktopAccountView() {
  const { kycStatus, setKycModalOpen } = useT();

  return (
    <div className="desktop-page-container">
      <DesktopSubNav />
      <div className="account-page-grid">
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
              {kycStatus === "verified" && (
                <span className="verified-tag">
                  <Check size={14} strokeWidth={3} /> Verified
                </span>
              )}
              {kycStatus === "pending" && (
                <span className="verified-tag bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <RefreshCw size={13} className="animate-spin" /> In Review
                </span>
              )}
              {kycStatus === "unverified" && (
                <button
                  className="mt-1 text-xs bg-blue-600 hover:bg-blue-500 text-white font-bold px-2 py-1 rounded"
                  onClick={() => setKycModalOpen(true)}
                >
                  Verify Account
                </button>
              )}
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

        <div>
          <div className="account-section-title">Security & Verification:</div>
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

/* ---------------- Desktop & Mobile "Payments" View ---------------- */
function DesktopPaymentsView() {
  const { paymentsList } = useT();

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
            {paymentsList.map((p) => (
              <tr key={p.id}>
                <td className="font-semibold">{p.id}</td>
                <td className="text-muted-foreground text-xs">{p.dateTime}</td>
                <td>
                  <span
                    className={
                      p.status === "Successed"
                        ? "text-green-500 font-bold"
                        : p.status === "Pending"
                        ? "text-yellow-400 font-bold"
                        : p.status === "Processing"
                        ? "text-sky-400 font-bold"
                        : "text-red-500 font-bold"
                    }
                  >
                    {p.status === "Successed"
                      ? "✔ Successed"
                      : p.status === "Pending"
                      ? "⏳ Pending"
                      : p.status === "Processing"
                      ? "🔄 Processing"
                      : "✖ Failed"}
                  </span>
                </td>
                <td>{p.type}</td>
                <td>{p.system}</td>
                <td
                  className={
                    p.amount.startsWith("+")
                      ? "text-green-500 font-bold"
                      : "text-red-500 font-bold"
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

/* ---------------- Mobile "Payments" View (Screenshots 223404 & 223415) ---------------- */
function MobilePaymentsView() {
  const { paymentsList, setCurrentView } = useT();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="mobile-view-wrapper">
      <div className="mobile-dropdown-container">
        <div
          className="mobile-dropdown-header select-none"
          onClick={() => setDropdownOpen((o) => !o)}
        >
          <span>Payments</span>
          {dropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>

        {dropdownOpen && (
          <div className="mobile-dropdown-menu">
            <div
              className="mobile-dropdown-item"
              onClick={() => {
                setDropdownOpen(false);
                setCurrentView("withdrawal");
              }}
            >
              Withdrawal
            </div>
            <div
              className="mobile-dropdown-item"
              onClick={() => {
                setDropdownOpen(false);
                setCurrentView("trading");
              }}
            >
              Trades
            </div>
            <div
              className="mobile-dropdown-item"
              onClick={() => {
                setDropdownOpen(false);
                setCurrentView("account");
              }}
            >
              My account
            </div>
            <div
              className="mobile-dropdown-item"
              onClick={() => {
                setDropdownOpen(false);
                setCurrentView("trading");
              }}
            >
              Market
            </div>
            <div
              className="mobile-dropdown-item"
              onClick={() => {
                setDropdownOpen(false);
                setCurrentView("leaderboard");
              }}
            >
              Tournaments
            </div>
            <div
              className="mobile-dropdown-item"
              onClick={() => {
                setDropdownOpen(false);
                setCurrentView("analytics");
              }}
            >
              Analytics
            </div>
          </div>
        )}
      </div>

      <div className="mobile-payments-list">
        <div className="mobile-payments-head">
          <span>Transaction ID</span>
          <span>Amount</span>
        </div>

        {paymentsList.map((p) => (
          <div className="mobile-payment-item" key={p.id}>
            <div className="mobile-payment-row">
              <div className="mobile-payment-left">
                <b>{p.id}</b>
                <small>{p.dateTime}</small>
                <span
                  className={
                    p.status === "Successed"
                      ? "text-green-500 font-bold text-xs"
                      : p.status === "Pending"
                      ? "text-yellow-400 font-bold text-xs"
                      : p.status === "Processing"
                      ? "text-sky-400 font-bold text-xs"
                      : "text-red-500 font-bold text-xs"
                  }
                >
                  {p.status}
                </span>
              </div>
              <div className="mobile-payment-right">
                <b
                  className={
                    p.amount.startsWith("+")
                      ? "text-green-500 font-bold"
                      : "text-red-500 font-bold"
                  }
                >
                  {p.amount}
                </b>
                <small className="text-muted-foreground">{p.system}</small>
                <small className="text-muted-foreground">{p.type}</small>
              </div>
            </div>

            {(p.status === "Processing" || p.status === "Pending") && (
              <div className="mobile-payment-notice">
                Please note that payments with this method could take up to 24
                hours to get processed. If it's not on your balance by that time
                - please submit a support ticket. The status may appear as
                «Failed» until the funds are actually received on our side.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Desktop "Withdrawal" View ---------------- */
function DesktopWithdrawalView() {
  const { balances, handleConfirmWithdrawal, setCurrentView } = useT();
  const [amount, setAmount] = useState(10);
  const [method, setMethod] = useState("Binance Pay");
  const [firstName, setFirstName] = useState("Demo");
  const [lastName, setLastName] = useState("User");
  const [receiveType, setReceiveType] = useState<"binance_id" | "binance_email">("binance_id");
  const [binanceId, setBinanceId] = useState("85404594");
  const [binanceEmail, setBinanceEmail] = useState("trader.demo@test.com");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const onConfirm = () => {
    setErrorMsg("");
    setSuccessMsg("");
    const res = handleConfirmWithdrawal({
      amount: Number(amount),
      method,
      receiveType,
      identifier: receiveType === "binance_id" ? binanceId : binanceEmail,
    });
    if (!res.success) {
      setErrorMsg(res.error || "Failed to process withdrawal");
    } else {
      setSuccessMsg(`Withdrawal request of $${Number(amount).toFixed(2)} submitted successfully!`);
      setTimeout(() => setCurrentView("payments"), 1500);
    }
  };

  return (
    <div className="desktop-page-container">
      <DesktopSubNav />
      <div className="withdrawal-page-grid">
        <div className="withdrawal-balances">
          <div className="account-section-title">Account:</div>
          <div className="withdrawal-balance-item">
            <small>In the account:</small>
            <b>${fmtMoney(balances.live)}</b>
          </div>
          <div className="withdrawal-balance-item mt-4">
            <small>Available for withdrawal:</small>
            <b>${fmtMoney(balances.live)}</b>
          </div>
        </div>

        <div>
          <div className="account-section-title">Withdrawal:</div>

          {errorMsg && (
            <div className="p-3 bg-red-500/20 border border-red-500/40 text-red-300 text-xs rounded-lg mb-3 flex items-center gap-2">
              <AlertTriangle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-green-500/20 border border-green-500/40 text-green-300 text-xs rounded-lg mb-3 flex items-center gap-2">
              <Check size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="custom-field mb-0">
              <span className="field-tag">Amount</span>
              <input
                type="number"
                min={10}
                className="bg-transparent text-white font-bold outline-none w-20"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
              <span className="text-muted-foreground text-xs">USD</span>
            </div>
            <div className="custom-field mb-0">
              <span className="field-tag">Payment method</span>
              <span className="flex items-center gap-1.5 font-bold">
                <span className="text-yellow-500">🔸</span> {method}
              </span>
              <ChevronDown size={16} />
            </div>
          </div>

          <div className="custom-field">
            <span className="field-tag">First name</span>
            <input
              type="text"
              className="bg-transparent text-white outline-none w-full"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="custom-field">
            <span className="field-tag">Last name</span>
            <input
              type="text"
              className="bg-transparent text-white outline-none w-full"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="custom-field">
            <span className="field-tag">Receive type</span>
            <select
              className="bg-transparent text-white font-medium outline-none w-full cursor-pointer"
              value={receiveType}
              onChange={(e) =>
                setReceiveType(e.target.value as "binance_id" | "binance_email")
              }
            >
              <option value="binance_id" className="bg-[#121620] text-white">
                Binance ID
              </option>
              <option value="binance_email" className="bg-[#121620] text-white">
                Binance Email
              </option>
            </select>
            <ChevronDown size={16} />
          </div>

          {receiveType === "binance_id" ? (
            <div className="custom-field">
              <span className="field-tag">Enter your Binance ID</span>
              <input
                type="text"
                placeholder="e.g. 85404594"
                className="bg-transparent text-white outline-none w-full font-mono"
                value={binanceId}
                onChange={(e) => setBinanceId(e.target.value)}
              />
            </div>
          ) : (
            <div className="custom-field">
              <span className="field-tag">Enter your Binance Email</span>
              <input
                type="email"
                placeholder="e.g. trader@binance.com"
                className="bg-transparent text-white outline-none w-full font-mono"
                value={binanceEmail}
                onChange={(e) => setBinanceEmail(e.target.value)}
              />
            </div>
          )}

          <button className="confirm-btn" onClick={onConfirm}>
            Confirm <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Interactive Mobile Withdrawal View ---------------- */
function InteractiveMobileWithdrawalView() {
  const { balances, handleConfirmWithdrawal, setCurrentView, paymentsList } = useT();
  const [amount, setAmount] = useState(10);
  const [method] = useState("Binance Pay");
  const [firstName, setFirstName] = useState("Demo");
  const [lastName, setLastName] = useState("User");
  const [receiveType, setReceiveType] = useState<"binance_id" | "binance_email">("binance_id");
  const [binanceId, setBinanceId] = useState("85404594");
  const [binanceEmail, setBinanceEmail] = useState("trader.demo@test.com");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const onConfirm = () => {
    setErrorMsg("");
    setSuccessMsg("");
    const res = handleConfirmWithdrawal({
      amount: Number(amount),
      method,
      receiveType,
      identifier: receiveType === "binance_id" ? binanceId : binanceEmail,
    });
    if (!res.success) {
      setErrorMsg(res.error || "Failed to process withdrawal");
    } else {
      setSuccessMsg(`Withdrawal request of $${Number(amount).toFixed(2)} submitted successfully!`);
      setTimeout(() => setCurrentView("payments"), 1500);
    }
  };

  const faqs = [
    {
      q: "How to withdraw money from the account?",
      a: "To make a withdrawal, select your desired payment method, enter the amount, and confirm your request. Withdrawals are processed quickly.",
    },
    {
      q: "How long does it take to withdraw funds?",
      a: "Withdrawal requests are usually processed within 1 to 3 business days depending on the payment system.",
    },
    {
      q: "What is the minimum withdrawal amount?",
      a: "The minimum withdrawal amount is $10 USD for most payment methods.",
    },
    {
      q: "Is there any fee for depositing or withdrawing funds?",
      a: "No, our platform does not charge fees for standard deposits or withdrawals.",
    },
  ];

  return (
    <div className="mobile-view-wrapper">
      <div className="mobile-dropdown-header">
        <span>Withdrawal</span>
        <ChevronDown size={16} />
      </div>

      <div className="px-3 pb-8">
        <div className="account-section-title text-sm mb-1">Account:</div>
        <div className="text-xs text-muted-foreground">In the account:</div>
        <div className="text-base font-bold text-white mb-2">
          ${fmtMoney(balances.live)}
        </div>

        <div className="text-xs text-muted-foreground">
          Available for withdrawal:
        </div>
        <div className="text-base font-bold text-white mb-4">
          ${fmtMoney(balances.live)}
        </div>

        <div className="account-section-title text-sm mb-3">Withdrawal:</div>

        {errorMsg && (
          <div className="p-2.5 bg-red-500/20 border border-red-500/40 text-red-300 text-xs rounded-lg mb-3 flex items-center gap-2">
            <AlertTriangle size={15} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-2.5 bg-green-500/20 border border-green-500/40 text-green-300 text-xs rounded-lg mb-3 flex items-center gap-2">
            <Check size={15} className="shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="custom-field">
          <span className="field-tag">Amount</span>
          <input
            type="number"
            min={10}
            className="bg-transparent text-white font-bold outline-none w-24"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
          <span className="text-muted-foreground text-xs">USD</span>
        </div>

        <div className="custom-field">
          <span className="field-tag">Payment method</span>
          <span className="flex items-center gap-1.5 font-bold">
            <span className="text-yellow-500">🔸</span> {method}
          </span>
          <ChevronDown size={16} />
        </div>

        <div className="custom-field">
          <span className="field-tag">First name</span>
          <input
            type="text"
            className="bg-transparent text-white outline-none w-full"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className="custom-field">
          <span className="field-tag">Last name</span>
          <input
            type="text"
            className="bg-transparent text-white outline-none w-full"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div className="custom-field">
          <span className="field-tag">Receive type</span>
          <select
            className="bg-transparent text-white font-medium outline-none w-full cursor-pointer"
            value={receiveType}
            onChange={(e) =>
              setReceiveType(e.target.value as "binance_id" | "binance_email")
            }
          >
            <option value="binance_id" className="bg-[#121620] text-white">
              Binance ID
            </option>
            <option value="binance_email" className="bg-[#121620] text-white">
              Binance Email
            </option>
          </select>
          <ChevronDown size={16} />
        </div>

        {receiveType === "binance_id" ? (
          <div className="custom-field">
            <span className="field-tag">Enter your Binance ID</span>
            <input
              type="text"
              placeholder="e.g. 85404594"
              className="bg-transparent text-white outline-none w-full font-mono text-xs"
              value={binanceId}
              onChange={(e) => setBinanceId(e.target.value)}
            />
          </div>
        ) : (
          <div className="custom-field">
            <span className="field-tag">Enter your Binance Email</span>
            <input
              type="email"
              placeholder="e.g. trader@binance.com"
              className="bg-transparent text-white outline-none w-full font-mono text-xs"
              value={binanceEmail}
              onChange={(e) => setBinanceEmail(e.target.value)}
            />
          </div>
        )}

        <button className="confirm-btn w-full mb-6" onClick={onConfirm}>
          Confirm <ArrowRight size={16} />
        </button>

        <div className="border-t border-[oklch(0.24_0.02_272)] pt-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <b className="text-sm text-white">Some of your latest requests:</b>
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <ChevronRight size={14} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {paymentsList.slice(0, 3).map((r) => (
              <div
                key={r.id}
                className="p-2.5 bg-[oklch(0.22_0.025_273)] rounded-lg flex justify-between items-center text-xs"
              >
                <div>
                  <div className="font-bold text-white">{r.id}</div>
                  <div className="text-muted-foreground text-[10px]">
                    {r.dateTime}
                  </div>
                  <span
                    className={
                      r.status === "Successed"
                        ? "text-green-500 font-bold"
                        : r.status === "Pending"
                        ? "text-yellow-400 font-bold"
                        : r.status === "Processing"
                        ? "text-sky-400 font-bold"
                        : "text-red-500 font-bold"
                    }
                  >
                    {r.status === "Successed"
                      ? "✔ Successed"
                      : r.status === "Pending"
                      ? "⏳ Pending"
                      : r.status === "Processing"
                      ? "🔄 Processing"
                      : "✖ Failed"}
                  </span>
                </div>
                <div className="text-right">
                  <div
                    className={
                      r.amount.startsWith("+")
                        ? "text-green-500 font-bold"
                        : "text-red-500 font-bold"
                    }
                  >
                    {r.amount}
                  </div>
                  <div className="text-muted-foreground">{r.system}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-[oklch(0.24_0.02_272)] pt-4">
          <div className="flex items-center justify-between mb-3">
            <b className="text-sm text-white">FAQ:</b>
          </div>

          <div className="flex flex-col gap-2">
            {faqs.map((f, idx) => (
              <div
                key={idx}
                className="p-3 bg-[oklch(0.22_0.025_273)] rounded-lg cursor-pointer"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <ChevronDown
                    size={14}
                    className={
                      openFaq === idx
                        ? "rotate-180 transition-transform"
                        : "transition-transform"
                    }
                  />
                  <span>{f.q}</span>
                </div>
                {openFaq === idx && (
                  <div className="mt-2 text-xs text-muted-foreground pl-5 leading-relaxed">
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Settings Modal ---------------- */
function SettingsModal() {
  const {
    settingsModalOpen,
    setSettingsModalOpen,
    chartBrightness,
    setChartBrightness,
    chartWallpaper,
    setChartWallpaper,
    candleUpColor,
    setCandleUpColor,
    candleDownColor,
    setCandleDownColor,
    soundEffects,
    setSoundEffects,
    oneClickTrade,
    setOneClickTrade,
  } = useT();

  if (!settingsModalOpen) return null;

  return (
    <div
      className="settings-overlay"
      onClick={() => setSettingsModalOpen(false)}
    >
      <div className="settings-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4 border-b border-[oklch(0.26_0.02_272)] pb-3">
          <span className="font-bold text-white text-base flex items-center gap-2">
            <Settings size={18} className="text-blue-500" /> Chart & Platform Settings
          </span>
          <X
            size={20}
            className="cursor-pointer text-muted-foreground hover:text-white"
            onClick={() => setSettingsModalOpen(false)}
          />
        </div>

        {/* Section 1: Chart Brightness */}
        <div className="settings-section">
          <div className="settings-title">
            <Sun size={15} /> Chart Brightness: {chartBrightness}%
          </div>
          <input
            type="range"
            min={50}
            max={150}
            value={chartBrightness}
            onChange={(e) => setChartBrightness(Number(e.target.value))}
            className="w-full accent-blue-500 cursor-pointer"
          />
        </div>

        {/* Section 2: Up Candle Color */}
        <div className="settings-section">
          <div className="settings-title">
            <Palette size={15} /> Up / Buy Candle Color
          </div>
          <div className="swatch-picker-row">
            {[
              { label: "Green", color: "#22c55e" },
              { label: "Cyan", color: "#06b6d4" },
              { label: "White", color: "#ffffff" },
              { label: "Emerald", color: "#10b981" },
            ].map((c) => (
              <button
                key={c.color}
                className={`color-choice-btn ${
                  candleUpColor === c.color ? "selected" : ""
                }`}
                style={{ background: c.color }}
                onClick={() => setCandleUpColor(c.color)}
              >
                <span className="text-black font-extrabold">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Section 3: Down Candle Color */}
        <div className="settings-section">
          <div className="settings-title">
            <Palette size={15} /> Down / Sell Candle Color
          </div>
          <div className="swatch-picker-row">
            {[
              { label: "Red", color: "#ef4444" },
              { label: "Orange", color: "#f97316" },
              { label: "Black", color: "#000000" },
              { label: "Crimson", color: "#dc2626" },
            ].map((c) => (
              <button
                key={c.color}
                className={`color-choice-btn ${
                  candleDownColor === c.color ? "selected" : ""
                }`}
                style={{ background: c.color }}
                onClick={() => setCandleDownColor(c.color)}
              >
                <span className="text-white font-extrabold">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Section 4: Chart Wallpaper Theme */}
        <div className="settings-section">
          <div className="settings-title">
            <Moon size={15} /> Chart Background Theme
          </div>
          <div className="wallpaper-grid">
            <div
              className={`wallpaper-card ${
                chartWallpaper === "default" ? "selected" : ""
              }`}
              style={{ background: "#1a1e29" }}
              onClick={() => setChartWallpaper("default")}
            >
              <span>Default Dark</span>
              <small className="text-slate-400">Classic Pro</small>
            </div>
            <div
              className={`wallpaper-card ${
                chartWallpaper === "navy" ? "selected" : ""
              }`}
              style={{ background: "#0b132b" }}
              onClick={() => setChartWallpaper("navy")}
            >
              <span>Deep Navy</span>
              <small className="text-slate-400">Night Blue</small>
            </div>
            <div
              className={`wallpaper-card ${
                chartWallpaper === "charcoal" ? "selected" : ""
              }`}
              style={{ background: "#121214" }}
              onClick={() => setChartWallpaper("charcoal")}
            >
              <span>Pitch Charcoal</span>
              <small className="text-slate-400">OLED Black</small>
            </div>
            <div
              className={`wallpaper-card ${
                chartWallpaper === "grid" ? "selected" : ""
              }`}
              style={{ background: "#0d1b2a" }}
              onClick={() => setChartWallpaper("grid")}
            >
              <span>Matrix Grid</span>
              <small className="text-slate-400">Cyber</small>
            </div>
          </div>
        </div>

        {/* Section 5: Audio & Trading Toggles */}
        <div className="settings-section border-t border-[oklch(0.26_0.02_272)] pt-3">
          <div className="flex items-center justify-between py-1.5 cursor-pointer" onClick={() => setSoundEffects(!soundEffects)}>
            <span className="text-xs text-white flex items-center gap-2">
              {soundEffects ? <Volume2 size={15} /> : <VolumeX size={15} />} Trading Sound Effects
            </span>
            <div className={`pending-switch ${soundEffects ? "active" : ""}`}>
              <div className="pending-switch-knob" />
            </div>
          </div>

          <div className="flex items-center justify-between py-1.5 cursor-pointer mt-2" onClick={() => setOneClickTrade(!oneClickTrade)}>
            <span className="text-xs text-white flex items-center gap-2">
              <Sparkles size={15} /> 1-Click Fast Order Execution
            </span>
            <div className={`pending-switch ${oneClickTrade ? "active" : ""}`}>
              <div className="pending-switch-knob" />
            </div>
          </div>
        </div>

        <button
          className="confirm-btn w-full mt-2"
          onClick={() => setSettingsModalOpen(false)}
        >
          Save & Apply
        </button>
      </div>
    </div>
  );
}

/* ---------------- KYC Verification Modal (Sumsub simulation) ---------------- */
function KYCModal() {
  const { kycModalOpen, setKycModalOpen, kycStep, setKycStep, setKycStatus } = useT();
  const [docType, setDocType] = useState("National ID");
  const [fileUploaded, setFileUploaded] = useState(false);

  if (!kycModalOpen) return null;

  return (
    <div className="kyc-overlay" onClick={() => setKycModalOpen(false)}>
      <div className="kyc-card" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4 border-b border-[oklch(0.26_0.02_272)] pb-3">
          <span className="font-bold text-white text-base flex items-center gap-2">
            <ShieldCheck size={18} className="text-green-500" /> Identity Verification (KYC)
          </span>
          <X
            size={20}
            className="cursor-pointer text-muted-foreground hover:text-white"
            onClick={() => setKycModalOpen(false)}
          />
        </div>

        {kycStep === 1 && (
          <div>
            <div className="text-xs text-muted-foreground mb-4">
              Step 1 of 3: Select your issuing country and government-issued document type to verify your identity.
            </div>

            <div className="custom-field">
              <span className="field-tag">Issuing Country</span>
              <span className="text-white font-bold">International / Pakistan</span>
              <ChevronDown size={14} />
            </div>

            <div className="mt-3">
              {["National ID Card", "Passport", "Driver's License"].map((d) => (
                <div
                  key={d}
                  className={`kyc-doc-option ${docType === d ? "selected" : ""}`}
                  onClick={() => setDocType(d)}
                >
                  <span className="text-xs font-bold text-white">{d}</span>
                  {docType === d ? <Check size={16} className="text-blue-500" /> : <div className="w-4 h-4 rounded-full border border-slate-600" />}
                </div>
              ))}
            </div>

            <button
              className="confirm-btn w-full mt-4"
              onClick={() => setKycStep(2)}
            >
              Continue <ArrowRight size={16} />
            </button>
          </div>
        )}

        {kycStep === 2 && (
          <div>
            <div className="text-xs text-muted-foreground mb-3">
              Step 2 of 3: Upload clear photos of your <b>{docType}</b> (Front & Back).
            </div>

            <div
              className="kyc-dropzone"
              onClick={() => setFileUploaded(true)}
            >
              <Upload size={24} className="mx-auto text-blue-400 mb-2" />
              <div className="text-xs font-bold text-white">
                {fileUploaded ? "✓ document_front.jpg attached" : "Click to select or drop document photos"}
              </div>
              <div className="text-[10px] text-muted-foreground mt-1">
                Supported formats: JPG, PNG, PDF (Max 15MB)
              </div>
            </div>

            <div className="flex gap-2">
              <button
                className="copy-action-btn flex-1"
                onClick={() => setKycStep(1)}
              >
                Back
              </button>
              <button
                className="confirm-btn flex-1"
                onClick={() => setKycStep(3)}
              >
                Next Step <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {kycStep === 3 && (
          <div>
            <div className="text-xs text-muted-foreground mb-4">
              Step 3 of 3: Face Liveness Check. Position your face in front of the camera and follow instructions.
            </div>

            <div className="w-32 h-32 rounded-full border-4 border-blue-500 mx-auto flex items-center justify-center bg-slate-900/60 mb-4">
              <UserCheck size={48} className="text-sky-400 animate-pulse" />
            </div>

            <button
              className="confirm-btn w-full"
              onClick={() => {
                setKycStatus("pending");
                setKycStep(4);
                setTimeout(() => {
                  setKycStatus("verified");
                }, 4000);
              }}
            >
              Start Face Verification
            </button>
          </div>
        )}

        {kycStep === 4 && (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 mx-auto flex items-center justify-center mb-3">
              <Check size={24} />
            </div>
            <div className="text-sm font-bold text-white mb-1">
              Verification Documents Submitted!
            </div>
            <div className="text-xs text-muted-foreground mb-4">
              Our automated KYC gateway is checking your documents. Your status will update to <b>Verified</b> momentarily.
            </div>
            <button
              className="confirm-btn w-full"
              onClick={() => {
                setKycModalOpen(false);
                setKycStep(1);
              }}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Support Ticket Modal & Help System ---------------- */
function SupportTicketModal() {
  const { supportModalOpen, setSupportModalOpen, setActiveTickets } = useT();
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Deposits & Withdrawals");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!supportModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    const newTicket: SupportTicket = {
      id: `TK-${Math.floor(100000 + Math.random() * 900000)}`,
      subject,
      category,
      date: new Date().toLocaleDateString("en-GB"),
      status: "Open",
    };

    setActiveTickets((prev) => [newTicket, ...prev]);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSupportModalOpen(false);
      setSubject("");
      setMessage("");
    }, 1800);
  };

  return (
    <div
      className="ticket-overlay"
      onClick={() => setSupportModalOpen(false)}
    >
      <div className="ticket-card" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4 border-b border-[oklch(0.26_0.02_272)] pb-3">
          <span className="font-bold text-white text-base flex items-center gap-2">
            <LifeBuoy size={18} className="text-blue-500" /> Submit a Support Ticket
          </span>
          <X
            size={20}
            className="cursor-pointer text-muted-foreground hover:text-white"
            onClick={() => setSupportModalOpen(false)}
          />
        </div>

        {submitted ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 mx-auto flex items-center justify-center mb-3">
              <Check size={24} />
            </div>
            <div className="text-sm font-bold text-white mb-1">
              Ticket Submitted Successfully!
            </div>
            <div className="text-xs text-muted-foreground">
              Our 24/7 technical team has received your ticket and will respond shortly.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-bold text-white">Subject</label>
              <input
                type="text"
                required
                placeholder="e.g. Question regarding withdrawal transaction"
                className="custom-form-input"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-white">Department</label>
              <select
                className="custom-form-input cursor-pointer"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Deposits & Withdrawals">Deposits & Withdrawals</option>
                <option value="Trading & Charts">Trading & Charts</option>
                <option value="Account & KYC">Account & KYC</option>
                <option value="Technical Issues">Technical Issues</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-white">Message</label>
              <textarea
                required
                rows={4}
                placeholder="Describe your issue in detail..."
                className="custom-form-input resize-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <button type="submit" className="confirm-btn w-full mt-2">
              <Send size={15} /> Submit Ticket
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ---------------- Help View (Desktop & Mobile) ---------------- */
function HelpScreenView() {
  const { setSupportModalOpen, activeTickets } = useT();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "How to make a deposit?",
      a: "Click on the green 'Deposit' button, select your convenient payment method (Binance Pay, USDT, Raast, JazzCash), enter amount, and complete payment transfer.",
    },
    {
      q: "What is OTC trading and how does it work?",
      a: "Over-the-counter (OTC) trading allows market transactions 24/7, including weekends, simulated via decentralized high-frequency price feeds.",
    },
    {
      q: "How long does a withdrawal take?",
      a: "Withdrawals from verified Live accounts are processed within 1 to 24 hours depending on the payment gateway.",
    },
    {
      q: "How to verify account (KYC)?",
      a: "Go to My Account -> Personal Data -> Identity Verification, upload your ID photo and complete the quick selfie check.",
    },
    {
      q: "What is the minimum stake amount?",
      a: "The minimum trade investment is $1 USD (or 1% in percent stake mode).",
    },
  ];

  return (
    <div className="mobile-view-wrapper">
      <div className="mobile-dropdown-header">
        <span>Help & Support Center</span>
        <ChevronDown size={16} />
      </div>

      <div className="px-3 pb-8">
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div
            className="p-3 bg-[oklch(0.22_0.025_273)] rounded-lg text-center cursor-pointer hover:border-blue-500 border border-transparent"
            onClick={() => setOpenFaq(0)}
          >
            <div className="text-lg mb-1">📚</div>
            <div className="text-xs font-bold text-white">FAQ</div>
            <div className="text-[10px] text-muted-foreground">Database</div>
          </div>

          <div
            className="p-3 bg-[oklch(0.22_0.025_273)] rounded-lg text-center cursor-pointer hover:border-blue-500 border border-transparent"
            onClick={() => setOpenFaq(1)}
          >
            <div className="text-lg mb-1">🎓</div>
            <div className="text-xs font-bold text-white">Tutorials</div>
            <div className="text-[10px] text-muted-foreground">Hints</div>
          </div>

          <div
            className="p-3 bg-[oklch(0.22_0.025_273)] rounded-lg text-center cursor-pointer hover:border-blue-500 border border-transparent"
            onClick={() => setSupportModalOpen(true)}
          >
            <div className="text-lg mb-1">💬</div>
            <div className="text-xs font-bold text-white">Support</div>
            <div className="text-[10px] text-muted-foreground">Submit ticket</div>
          </div>
        </div>

        <div className="p-4 bg-[oklch(0.24_0.04_255)] rounded-xl border border-blue-500/40 mb-5 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-white">
              Didn't find an answer to your question?
            </div>
            <div className="text-[11px] text-sky-200 mt-0.5">
              Contact our 24/7 technical team
            </div>
          </div>
          <button
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg flex items-center gap-1"
            onClick={() => setSupportModalOpen(true)}
          >
            Contact support <ArrowRight size={13} />
          </button>
        </div>

        <div className="account-section-title text-sm mb-2">
          Frequently Asked Questions (FAQ):
        </div>

        <div className="flex flex-col gap-2 mb-6">
          {faqs.map((f, idx) => (
            <div
              key={idx}
              className="p-3 bg-[oklch(0.22_0.025_273)] rounded-lg cursor-pointer"
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <ChevronDown
                  size={14}
                  className={
                    openFaq === idx
                      ? "rotate-180 transition-transform"
                      : "transition-transform"
                  }
                />
                <span>{f.q}</span>
              </div>
              {openFaq === idx && (
                <div className="mt-2 text-xs text-muted-foreground pl-5 leading-relaxed">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {activeTickets.length > 0 && (
          <div>
            <div className="account-section-title text-sm mb-2">
              My Active Support Tickets ({activeTickets.length}):
            </div>
            <div className="flex flex-col gap-2">
              {activeTickets.map((t) => (
                <div
                  key={t.id}
                  className="p-3 bg-[oklch(0.22_0.025_273)] rounded-lg flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-white">{t.subject}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      {t.id} • {t.category} • {t.date}
                    </div>
                  </div>
                  <span className="font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/30">
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Desktop Screen ---------------- */
function DesktopScreen() {
  const { currentView, setCurrentView, livePnL } = useT();

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
      {currentView === "leaderboard" && (
        <LeaderboardView
          onBack={() => setCurrentView("trading")}
          onClose={() => setCurrentView("trading")}
          livePnL={livePnL}
        />
      )}
      {currentView === "analytics" && <AnalyticsView />}
      {currentView === "help" && <HelpScreenView />}
    </div>
  );
}

/* ---------------- Mobile Header & Nav ---------------- */
function MobileHeader() {
  const { setDepositModalStep } = useT();
  return (
    <header className="mobile-header">
      <AccountBlock mobile />
      <NotificationBadge />
      <ScreenButton
        className="deposit"
        onClick={() => setDepositModalStep("methods")}
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
      <span
        onClick={() => setCurrentView("leaderboard")}
        className={currentView === "leaderboard" ? "text-blue-500" : ""}
      >
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

/* ---------------- Compact Mobile Trade Panel (Screenshot 1 & 13) ---------------- */
function MobileTradePanel() {
  const {
    selectedPair,
    effectiveStake,
    pendingTrade,
    togglePendingTrade,
    setTradePairModalOpen,
  } = useT();
  const payout = `${fmtMoney(
    effectiveStake * (1 + selectedPair.profit1m / 100)
  )} $`;

  return (
    <section className="mobile-trade-panel">
      {/* Row 1: Pair selection dropdown & Pending toggle (Screenshot 1) */}
      <div className="mobile-pair-row">
        <div
          className="mobile-pair cursor-pointer"
          onClick={() => setTradePairModalOpen(true)}
        >
          <span className="text-base">
            {selectedPair.flags[0]}
            {selectedPair.flags[1]}
          </span>
          <b>{selectedPair.name.slice(0, 10)} ...</b>
          <strong className="text-amber-500">{selectedPair.profit1m}%</strong>
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

      {/* Row 4: Buy & Sell */}
      <ActionButtons />
    </section>
  );
}

/* ---------------- Mobile Account View ---------------- */
function MobileAccountView() {
  const { kycStatus, setKycModalOpen } = useT();

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
            {kycStatus === "verified" && (
              <span className="verified-tag text-xs">
                <Check size={12} strokeWidth={3} /> Verified
              </span>
            )}
            {kycStatus === "pending" && (
              <span className="verified-tag text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <RefreshCw size={11} className="animate-spin" /> In Review
              </span>
            )}
            {kycStatus === "unverified" && (
              <button
                className="mt-1 text-[11px] bg-blue-600 hover:bg-blue-500 text-white font-bold px-2 py-0.5 rounded"
                onClick={() => setKycModalOpen(true)}
              >
                Verify Account
              </button>
            )}
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

/* ---------------- Mobile More View (Screenshots 8 & 10) ---------------- */
function MobileMoreView() {
  const { setCurrentView, setDepositModalStep, setSettingsModalOpen } = useT();

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

        <div
          className="mobile-more-card"
          onClick={() => setCurrentView("trading")}
        >
          <span className="text-base">💰</span>
          <span>Market</span>
          <span className="card-badge">2</span>
          <ChevronRight size={16} />
        </div>

        <div
          className="mobile-more-card"
          onClick={() => setCurrentView("analytics")}
        >
          <PieChart size={18} />
          <span>Analytics</span>
          <ChevronRight size={16} />
        </div>

        <div
          className="mobile-more-card"
          onClick={() => setCurrentView("leaderboard")}
        >
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
            onClick={() => setDepositModalStep("methods")}
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
          <div
            className="footer-link-blue"
            onClick={() => setSettingsModalOpen(true)}
          >
            <Settings size={18} />
            <span>Settings</span>
          </div>
          <div
            className="footer-link-red"
            onClick={() => setCurrentView("trading")}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </div>
        </div>

        <div
          className="join-us-btn"
          onClick={() => setCurrentView("help")}
        >
          <MessageSquare size={16} />
          <span>Join Us</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Mobile Screen ---------------- */
function MobileScreen() {
  const { currentView, setCurrentView, livePnL } = useT();

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
      {currentView === "withdrawal" && <InteractiveMobileWithdrawalView />}
      {currentView === "payments" && <MobilePaymentsView />}
      {currentView === "help" && <HelpScreenView />}
      {currentView === "more" && <MobileMoreView />}
      {currentView === "leaderboard" && (
        <LeaderboardView
          onBack={() => setCurrentView("trading")}
          onClose={() => setCurrentView("trading")}
          livePnL={livePnL}
        />
      )}
      {currentView === "analytics" && <AnalyticsView />}

      <MobileNav />
    </div>
  );
}

/* ---------------- Main Container Component ---------------- */
function TradingScreen() {
  const state = useTradingState();
  const {
    tradePairModalOpen,
    setTradePairModalOpen,
    selectedPair,
    setSelectedPair,
    depositModalStep,
    setDepositModalStep,
    depositMethod,
    setDepositMethod,
    depositAmount,
    handleProceedDeposit,
    indicatorsModalOpen,
    setIndicatorsModalOpen,
    keltnerConfigOpen,
    setKeltnerConfigOpen,
    envelopesConfigOpen,
    setEnvelopesConfigOpen,
    bollingerConfigOpen,
    setBollingerConfigOpen,
    maConfigOpen,
    setMaConfigOpen,
    setActiveIndicators,
    drawingsModalOpen,
    setDrawingsModalOpen,
  } = state;

  return (
    <Ctx.Provider value={state}>
      <div className="trading-app">
        <DesktopScreen />
        <MobileScreen />

        {/* Trade Pair Picker Modal (Screenshots 11 & 14) */}
        {tradePairModalOpen && (
          <TradePairModal
            onSelect={(pair) => {
              setSelectedPair(pair);
              setTradePairModalOpen(false);
            }}
            onClose={() => setTradePairModalOpen(false)}
          />
        )}

        {/* Deposit Flow Step 1: Methods (Screenshot 15) */}
        {depositModalStep === "methods" && (
          <DepositModal
            onSelectMethod={(m) => {
              setDepositMethod(m);
              setDepositModalStep("amount");
            }}
            onClose={() => setDepositModalStep("none")}
          />
        )}

        {/* Deposit Flow Step 2: Amount (Screenshot 16) */}
        {depositModalStep === "amount" && (
          <DepositAmountModal
            method={depositMethod}
            onProceed={handleProceedDeposit}
            onBack={() => setDepositModalStep("methods")}
            onClose={() => setDepositModalStep("none")}
          />
        )}

        {/* Deposit Flow Step 3: Payment & Address */}
        {depositModalStep === "payment" && (
          <DepositPaymentModal
            amount={depositAmount}
            method={depositMethod}
            onBack={() => setDepositModalStep("amount")}
            onClose={() => setDepositModalStep("none")}
          />
        )}

        {/* Indicators List Modal (Screenshot 16/17) */}
        {indicatorsModalOpen && (
          <IndicatorsModal
            onSelectIndicator={(name) => {
              setIndicatorsModalOpen(false);
              if (name === "Keltner channel") {
                setKeltnerConfigOpen(true);
              } else if (name === "Envelopes") {
                setEnvelopesConfigOpen(true);
              } else if (name === "Bollinger Bands") {
                setBollingerConfigOpen(true);
              } else if (name === "Moving Average") {
                setMaConfigOpen(true);
              } else if (name === "Donchian channel") {
                setActiveIndicators((prev) => [
                  ...prev,
                  {
                    id: `donchian-${Date.now()}`,
                    type: "donchian",
                    name: "DONCHIAN CHANNEL",
                    period: 20,
                    colors: ["#3b82f6", "#eab308", "#3b82f6"],
                    visible: true,
                  },
                ]);
              } else if (name === "Alligator") {
                setActiveIndicators((prev) => [
                  ...prev,
                  {
                    id: `alligator-${Date.now()}`,
                    type: "alligator",
                    name: "ALLIGATOR",
                    period: 13,
                    colors: ["#3b82f6", "#ef4444", "#22c55e"],
                    visible: true,
                  },
                ]);
              } else {
                setActiveIndicators((prev) => [
                  ...prev,
                  {
                    id: `ind-${Date.now()}`,
                    type: "ma",
                    name: name.toUpperCase(),
                    period: 14,
                    colors: ["#facc15"],
                    visible: true,
                  },
                ]);
              }
            }}
            onDeleteAll={() => setActiveIndicators([])}
            onClose={() => setIndicatorsModalOpen(false)}
          />
        )}

        {/* Keltner Channel Config Modal (Screenshot 17) */}
        {keltnerConfigOpen && (
          <KeltnerConfigModal
            onApply={(ema, atr, mult) => {
              setActiveIndicators((prev) => [
                ...prev.filter((i) => i.id !== "keltner-init" && i.type !== "keltner"),
                {
                  id: `keltner-${Date.now()}`,
                  type: "keltner",
                  name: "KELTNER CHANNEL",
                  period: ema,
                  param2: atr,
                  param3: mult,
                  colors: ["#22c55e", "#ef4444", "#ef4444"],
                  visible: true,
                },
              ]);
              setKeltnerConfigOpen(false);
            }}
            onBack={() => {
              setKeltnerConfigOpen(false);
              setIndicatorsModalOpen(true);
            }}
            onClose={() => setKeltnerConfigOpen(false)}
          />
        )}

        {/* Envelopes Config Modal */}
        {envelopesConfigOpen && (
          <EnvelopesConfigModal
            onApply={(period, deviation) => {
              setActiveIndicators((prev) => [
                ...prev.filter((i) => i.type !== "envelopes"),
                {
                  id: `envelopes-${Date.now()}`,
                  type: "envelopes",
                  name: "ENVELOPES",
                  period,
                  param2: deviation,
                  colors: ["#06b6d4", "#eab308", "#3b82f6"],
                  visible: true,
                },
              ]);
              setEnvelopesConfigOpen(false);
            }}
            onBack={() => {
              setEnvelopesConfigOpen(false);
              setIndicatorsModalOpen(true);
            }}
            onClose={() => setEnvelopesConfigOpen(false)}
          />
        )}

        {/* Bollinger Bands Config Modal */}
        {bollingerConfigOpen && (
          <BollingerConfigModal
            onApply={(period, deviation) => {
              setActiveIndicators((prev) => [
                ...prev.filter((i) => i.type !== "bollinger"),
                {
                  id: `bollinger-${Date.now()}`,
                  type: "bollinger",
                  name: "BOLLINGER BANDS",
                  period,
                  param2: deviation,
                  colors: ["#818cf8", "#f59e0b", "#818cf8"],
                  visible: true,
                },
              ]);
              setBollingerConfigOpen(false);
            }}
            onBack={() => {
              setBollingerConfigOpen(false);
              setIndicatorsModalOpen(true);
            }}
            onClose={() => setBollingerConfigOpen(false)}
          />
        )}

        {/* Moving Average Config Modal */}
        {maConfigOpen && (
          <MAConfigModal
            onApply={(period, type) => {
              setActiveIndicators((prev) => [
                ...prev,
                {
                  id: `ma-${Date.now()}`,
                  type: "ma",
                  name: `${type} ${period}`,
                  period,
                  param2: type === "EMA" ? 1 : 0,
                  colors: ["#fbbf24"],
                  visible: true,
                },
              ]);
              setMaConfigOpen(false);
            }}
            onBack={() => {
              setMaConfigOpen(false);
              setIndicatorsModalOpen(true);
            }}
            onClose={() => setMaConfigOpen(false)}
          />
        )}

        {/* Drawings Tools Modal (Screenshot 19) */}
        {drawingsModalOpen && (
          <DrawingsModal onClose={() => setDrawingsModalOpen(false)} />
        )}

        {/* Settings Modal */}
        <SettingsModal />

        {/* KYC Verification Modal */}
        <KYCModal />

        {/* Support Ticket Modal */}
        <SupportTicketModal />
      </div>
    </Ctx.Provider>
  );
}
