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
  Eye,
  Image as ImageIcon,
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
      { name: "description", content: "TRADEX live web trading interface for AUD/NZD OTC markets." },
      { property: "og:title", content: "TRADEX — Web Trading Platform" },
      { property: "og:description", content: "TRADEX live web trading interface for AUD/NZD OTC markets." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TradingScreen,
});

/* ---------------- mock market + trading state ---------------- */

type Candle = { id: number; o: number; h: number; l: number; c: number };
type Trade = {
  id: number;
  dir: "up" | "down";
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
const RATE = 0.86;
const VISIBLE = 17;

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function initialCandles(): Candle[] {
  const r = seeded(42);
  const out: Candle[] = [];
  let p = 1.172;
  for (let i = 0; i < 30; i++) {
    const o = p;
    const c = o + (r() - 0.5) * 0.0009;
    const h = Math.max(o, c) + r() * 0.0003;
    const l = Math.min(o, c) - r() * 0.0003;
    out.push({ id: i, o, h, l, c });
    p = c;
  }
  return out;
}

const pad = (n: number) => String(n).padStart(2, "0");
const fmtClock = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
const fmtMoney = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function useTradingState() {
  const [candles, setCandles] = useState<Candle[]>(initialCandles);
  const [now, setNow] = useState<number | null>(null);
  const [account, setAccount] = useState<"live" | "demo">("live");
  const [balances, setBalances] = useState({ live: 31298.2, demo: 5000 });
  const [stake, setStake] = useState(60);
  const [minutes, setMinutes] = useState(1);
  const [trades, setTrades] = useState<Trade[]>([]);
  const candlesRef = useRef(candles);
  candlesRef.current = candles;
  const nextCandleAt = useRef(0);

  useEffect(() => {
    nextCandleAt.current = Date.now() + CANDLE_MS;
    setNow(Date.now());
    const t = setInterval(() => {
      const ts = Date.now();
      setNow(ts);
      setCandles((prev) => {
        const list = prev.slice();
        const last = { ...list[list.length - 1] };
        const c = last.c + (Math.random() - 0.5) * 0.00018;
        last.c = c;
        last.h = Math.max(last.h, c);
        last.l = Math.min(last.l, c);
        list[list.length - 1] = last;
        if (ts >= nextCandleAt.current) {
          nextCandleAt.current = ts + CANDLE_MS;
          list.push({ id: last.id + 1, o: c, h: c, l: c, c });
          if (list.length > 60) list.shift();
        }
        return list;
      });
    }, 500);
    return () => clearInterval(t);
  }, []);

  // resolve trades
  useEffect(() => {
    if (now === null) return;
    const price = candlesRef.current[candlesRef.current.length - 1].c;
    const due = trades.filter((t) => t.status === "open" && now >= t.expiresAt);
    if (!due.length) return;
    let credit = { live: 0, demo: 0 };
    const updated = trades.map((t) => {
      if (!due.includes(t)) return t;
      const won = t.dir === "up" ? price > t.entry : price < t.entry;
      const payout = won ? t.stake * (1 + t.rate) : 0;
      credit = { ...credit, [t.account]: credit[t.account] + payout };
      return { ...t, status: won ? ("won" as const) : ("lost" as const), profit: won ? t.stake * t.rate : -t.stake };
    });
    setTrades(updated);
    setBalances((b) => ({ live: b.live + credit.live, demo: b.demo + credit.demo }));
  }, [now, trades]);

  const placeTrade = useCallback(
    (dir: "up" | "down") => {
      if (now === null) return;
      if (balances[account] < stake) return;
      const last = candlesRef.current[candlesRef.current.length - 1];
      setBalances((b) => ({ ...b, [account]: b[account] - stake }));
      setTrades((ts) => [
        { id: Date.now(), dir, candleId: last.id, entry: last.c, stake, rate: RATE, expiresAt: Date.now() + minutes * 60000, status: "open", profit: 0, account },
        ...ts,
      ]);
    },
    [account, balances, minutes, now, stake],
  );

  return {
    candles, now, account, setAccount, balances, setBalances, stake, setStake, minutes, setMinutes, trades, placeTrade,
    price: candles[candles.length - 1].c,
    nextCandleAt: nextCandleAt.current,
  };
}

type TradingState = ReturnType<typeof useTradingState>;
const Ctx = createContext<TradingState | null>(null);
const useT = () => useContext(Ctx)!;

/* ---------------- UI ---------------- */

type ScreenButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode };

function ScreenButton({ children, className = "", ...props }: ScreenButtonProps) {
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
}

function PairFlags({ compact = false }: { compact?: boolean }) {
  return (
    <span className={compact ? "pair-flags compact" : "pair-flags"} aria-hidden="true">
      <span>🇦🇺</span><span>🇳🇿</span>
    </span>
  );
}

function AccountMenu({ onClose }: { onClose: () => void }) {
  const { account, setAccount, balances, setBalances } = useT();
  return (
    <div className="account-menu" onClick={(e) => e.stopPropagation()}>
      <div className="account-menu-main">
        <div className="vip-row">
          <div className="vip"><span className="diamond">♦</span><div><small>VIP:</small><b>+4% profit</b></div></div>
          <button className="vip-eye" aria-label="Show"><Eye size={20} /></button>
        </div>
        <div className="am-info">
          <b>aj400krvade@gmail.com</b>
          <span>ID: 85404594</span>
          <p>Currency: <b>USD</b> <em>CHANGE</em></p>
        </div>
        <button className={`am-account ${account === "live" ? "on" : ""}`} onClick={() => { setAccount("live"); onClose(); }}>
          <i className="radio" />
          <div>
            <span>Live Account</span>
            <b>${fmtMoney(balances.live)}</b>
            <p>The daily limit is not set</p>
            <em>SET LIMIT</em>
          </div>
        </button>
        <button className={`am-account ${account === "demo" ? "on" : ""}`} onClick={() => { setAccount("demo"); onClose(); }}>
          <i className="radio" />
          <div>
            <span>Demo Account</span>
            <b>
              ${fmtMoney(balances.demo)}
              <RefreshCw size={18} className="am-refresh" onClick={(e) => { e.stopPropagation(); setBalances((b) => ({ ...b, demo: 5000 })); }} />
            </b>
          </div>
          <Pencil size={17} className="am-pencil" />
        </button>
      </div>
      <nav className="account-menu-links">
        <span>Deposit</span><span>Withdrawal</span><span>Payments</span><span>Trades</span><span>My account</span>
        <hr />
        <span className="logout"><LogOut size={18} />Logout</span>
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
  const label = account === "live" ? (mobile ? "LIVE" : "LIVE ACCOUNT") : mobile ? "DEMO" : "DEMO ACCOUNT";
  return (
    <div
      className={`${mobile ? "account account-mobile" : "account"} ${account === "demo" ? "is-demo" : ""}`}
      onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
      role="button"
    >
      <span className="diamond">♦</span>
      <div><small>{label}</small><strong>${fmtMoney(balances[account])}</strong></div>
      {open ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
      {open && <AccountMenu onClose={() => setOpen(false)} />}
    </div>
  );
}

function Notification() {
  return <div className="notification"><Bell size={21} /><span>66</span></div>;
}

function DesktopHeader() {
  return (
    <header className="desktop-header">
      <div className="brand"><span className="brand-mark">◫</span><b>TRADEX</b><i /> <strong>WEB TRADING PLATFORM</strong></div>
      <div className="header-actions">
        <Notification />
        <AccountBlock />
        <ScreenButton className="deposit"><Plus size={23} />Deposit</ScreenButton>
        <ScreenButton className="withdraw">Withdrawal</ScreenButton>
      </div>
    </header>
  );
}

function DesktopSidebar() {
  return (
    <aside className="desktop-sidebar">
      <Menu size={29} className="side-menu" />
      <ScreenButton className="side-active" aria-label="Chart"><ImageIcon size={25} /></ScreenButton>
      <CircleHelp size={26} /><UserRound size={27} />
      <span className="badge-icon"><Trophy size={27} /><b>4</b></span>
      <span className="badge-icon"><span className="coin">$</span><b>2</b></span>
      <MoreHorizontal size={30} />
      <div className="sidebar-spacer" />
      <div className="utility"><Maximize size={22} /><span>➜</span></div>
      <div className="utility"><Settings size={23} /><Volume2 size={25} /></div>
      <div className="join"><MessageSquare size={16} /><b>JOIN US</b></div>
      <div className="help"><span>●</span>Help</div>
    </aside>
  );
}

const pairs = [
  ["🇺🇸🇨🇴", "USD/COP...", "92%"], ["🇺🇸🇩🇿", "USD/DZD (OTC)", "93%"],
  ["🇬🇧🇨🇦", "GBP/CAD...", "56%"], ["🇳🇿🇯🇵", "NZD/JPY (OTC)", "77%"],
  ["🇺🇸🇮🇩", "USD/IDR (OTC)", "83%"], ["🇦🇺🇳🇿", "AUD/NZD...", "86%"],
] as const;

function PairTabs() {
  return (
    <div className="pair-tabs">
      <ScreenButton className="add-pair"><Plus size={26} /></ScreenButton>
      {pairs.map(([flags, name, rate], index) => (
        <div className={`pair-tab ${index === pairs.length - 1 ? "selected" : ""}`} key={name}>
          <span className="tab-flags">{flags}</span>
          <div><b>{name}</b><strong>{rate}</strong></div>
          {index === pairs.length - 1 && <><ChevronDown size={15} /><span className="tab-close">×</span></>}
        </div>
      ))}
    </div>
  );
}

function ChartGrid({ mobile = false }: { mobile?: boolean }) {
  const { candles, now, trades, price, nextCandleAt, account } = useT();
  const count = mobile ? 11 : VISIBLE;
  const step = mobile ? 9 : 4;
  const visible = candles.slice(-count);
  const firstId = visible[0].id;
  const insetTop = mobile ? 24 : 96;
  const insetBottom = mobile ? 31 : 44;
  const { max, range } = useMemo(() => {
    let hi = -Infinity, lo = Infinity;
    for (const c of visible) { hi = Math.max(hi, c.h); lo = Math.min(lo, c.l); }
    const padv = (hi - lo) * 0.08 || 0.0005;
    return { max: hi + padv, range: hi - lo + padv * 2 };
  }, [visible]);
  const frac = (p: number) => Math.min(1, Math.max(0, (max - p) / range));
  const yCss = (f: number) => `calc(${insetTop}px + (100% - ${insetTop + insetBottom}px) * ${f})`;
  const labelCount = mobile ? 4 : 10;
  const lowest = Math.min(...visible.map((c) => c.l));
  const openTrade = trades.find((t) => t.status === "open" && t.account === account);
  const remaining = now === null ? 0 : Math.max(0, Math.ceil(((openTrade ? openTrade.expiresAt : nextCandleAt) - now) / 1000));
  const countdown = `${pad(Math.floor(remaining / 60))}:${pad(remaining % 60)}`;
  const clock = now === null ? (mobile ? "19:09:19" : "19:11:49") : fmtClock(new Date(now));
  const markers = trades.filter((t) => t.account === account && t.candleId >= firstId && t.status === "open");

  return (
    <div className={mobile ? "chart-grid mobile-chart" : "chart-grid"}>
      <div className="grid-lines" />
      <div className="trade-caption start">◀<span>Beginning of trade</span></div>
      <div className="trade-caption end">◀<span>End of trade<br />{countdown}</span></div>
      <div className="market-time"><span>●</span> {clock} <i>UTC+5</i></div>
      {!mobile && <div className="pair-info"><b>i</b> PAIR INFORMATION</div>}
      {mobile && <div className="info-dot">i</div>}
      <div className="candles">
        {visible.map((c, index) => {
          const top = frac(c.h) * 100;
          const bottom = frac(c.l) * 100;
          const bTop = frac(Math.max(c.o, c.c)) * 100;
          const bBot = frac(Math.min(c.o, c.c)) * 100;
          return (
            <div className={`candle ${c.c >= c.o ? "up" : "down"}`} style={{ left: `${index * step}%` }} key={c.id}>
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
              style={{ left: `calc(${idx * step}% + ${mobile ? 4.4 : 1.7}%)`, top: `${frac(t.entry) * 100}%` }}
            >
              <span>{t.dir === "up" ? <ArrowUp size={10} strokeWidth={3} /> : <ArrowDown size={10} strokeWidth={3} />}</span>
              <i />
              <em>${t.stake}</em>
            </div>
          );
        })}
      </div>
      <div className="expiry-line" />
      <div className="price-line" style={{ top: yCss(frac(price)) }}><span>{countdown}</span><b>{price.toFixed(5)}</b></div>
      {Array.from({ length: labelCount }, (_, k) => {
        const f = (k + 0.5) / labelCount;
        return <span className="price-label" style={{ top: yCss(f) }} key={k}>{(max - f * range).toFixed(5)}</span>;
      })}
      <span className="low-label">{lowest.toFixed(5)}</span>
      <div className="x-labels">
        {(mobile ? ["19:00", "19:04", "19:08", "19:12", "19:16"] : ["18:56", "18:58", "19:00", "19:02", "19:04", "19:06", "19:08", "19:10", "19:14", "19:16", "19:18", "19:20"]).map((time) => <span key={time}>{time}</span>)}
      </div>
      {!mobile && <div className="chart-tools"><span>◆</span><span>1m</span><span>▥</span><span>⚑</span></div>}
      {mobile && <div className="mobile-tools"><span>•••</span><span><BriefcaseBusiness size={20} /><b>{trades.filter((t) => t.status === "open").length}</b></span></div>}
    </div>
  );
}

function StakeBox({ mobile = false }: { mobile?: boolean }) {
  const { stake, setStake } = useT();
  return (
    <div className={mobile ? "stake-box mobile" : "stake-box"}>
      <span className="field-label">Investment</span>
      <ScreenButton aria-label="Decrease investment" onClick={() => setStake((s) => Math.max(1, s - 10))}><Minus size={17} /></ScreenButton>
      <strong>{stake} $</strong>
      <ScreenButton aria-label="Increase investment" onClick={() => setStake((s) => Math.min(10000, s + 10))}><Plus size={19} /></ScreenButton>
      <small>SWITCH</small>
    </div>
  );
}

function TimeBox({ mobile = false }: { mobile?: boolean }) {
  const { now, minutes, setMinutes } = useT();
  const label = now === null ? (mobile ? "19:10" : "19:13") : (() => {
    const d = new Date(now + minutes * 60000);
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  })();
  return (
    <div className={mobile ? "time-box mobile" : "time-box"}>
      <span className="field-label">Time</span>
      {!mobile && <ScreenButton aria-label="Decrease time" onClick={() => setMinutes((m) => Math.max(1, m - 1))}><Minus size={17} /></ScreenButton>}
      <strong>{label}</strong>
      {!mobile && <ScreenButton aria-label="Increase time" onClick={() => setMinutes((m) => Math.min(60, m + 1))}><Plus size={19} /></ScreenButton>}
      {!mobile && <small>SWITCH TIME</small>}
    </div>
  );
}

function ActionButtons() {
  const { placeTrade } = useT();
  return (
    <div className="trade-actions">
      <ScreenButton className="buy" onClick={() => placeTrade("up")}>Buy <span>↑</span></ScreenButton>
      <ScreenButton className="sell" onClick={() => placeTrade("down")}>Sell <span>↓</span></ScreenButton>
    </div>
  );
}

function TradesList() {
  const { trades, account, now } = useT();
  const list = trades.filter((t) => t.account === account);
  const open = list.filter((t) => t.status === "open").length;
  return (
    <section className="trades-panel">
      <div className="trades-head"><b>Trades</b><span>{list.length}</span><Clock3 size={21} /><span>{open}</span></div>
      {list.length === 0 ? (
        <>
          <div className="trade-date">3 OCTOBER <i>10</i></div>
          <div className="trade-row"><ChevronDown size={17} /><PairFlags compact /><b>AUD/NZD (...</b><span>00:00:33</span></div>
          <div className="trade-result"><span>↑ 600 $</span><b>0.00 $</b></div>
        </>
      ) : (
        <div className="trades-scroll">
          {list.map((t) => {
            const rem = now === null ? 0 : Math.max(0, Math.ceil((t.expiresAt - now) / 1000));
            return (
              <div key={t.id}>
                <div className="trade-row"><ChevronDown size={17} /><PairFlags compact /><b>AUD/NZD (...</b><span>{t.status === "open" ? `00:${pad(Math.floor(rem / 60))}:${pad(rem % 60)}` : "00:00:00"}</span></div>
                <div className={`trade-result ${t.dir}`}>
                  <span>{t.dir === "up" ? "↑" : "↓"} {t.stake} $</span>
                  <b className={t.status === "won" ? "won" : ""}>{t.status === "won" ? `+${fmtMoney(t.profit)}` : "0.00"} $</b>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function TradePanel({ mobile = false }: { mobile?: boolean }) {
  const { stake } = useT();
  const payout = `${fmtMoney(stake * (1 + RATE))} $`;
  if (mobile) {
    return (
      <section className="mobile-trade-panel">
        <div className="mobile-pair"><PairFlags compact /><b>AUD/NZD ...</b><strong>86%</strong><ChevronDown size={17} /></div>
        <div className="pending">PENDING TRADE <i /></div>
        <div className="mobile-fields"><TimeBox mobile /><StakeBox mobile /></div>
        <div className="payout"><span>Payout</span><i /><strong>{payout}</strong></div>
        <ActionButtons />
      </section>
    );
  }
  return (
    <aside className="right-column">
      <section className="trade-panel">
        <div className="panel-pair"><PairFlags /><b>AUD/NZD (OTC)</b><strong>86%</strong></div>
        <div className="pending"><Clock3 size={17} /> PENDING TRADE <i /></div>
        <TimeBox />
        <StakeBox />
        <div className="payout"><span>Payout</span><i /><strong>{payout}</strong></div>
        <ActionButtons />
      </section>
      <TradesList />
    </aside>
  );
}

function DesktopScreen() {
  return (
    <div className="desktop-screen">
      <DesktopSidebar />
      <DesktopHeader />
      <main className="desktop-main"><PairTabs /><ChartGrid /></main>
      <TradePanel />
      <div className="sentiment"><b>3%</b><span><i /><i /></span><b>97%</b></div>
    </div>
  );
}

function MobileHeader() {
  return (
    <>
      <div className="phone-status"><span>7:09 ◴ ◁ ◉</span><span>35.1<br /><i>KB/S</i> ◉ ▪▮ 🔋</span></div>
      <header className="mobile-header"><AccountBlock mobile /><Notification /><ScreenButton className="deposit">Deposit</ScreenButton></header>
    </>
  );
}

function MobileNav() {
  return (
    <nav className="mobile-nav">
      <ImageIcon size={23} /><CircleHelp size={23} /><UserRound size={23} />
      <span><Trophy size={23} /><b>4</b></span><span><MoreHorizontal size={25} /><b>2</b></span>
    </nav>
  );
}

function MobileScreen() {
  return (
    <div className="mobile-screen">
      <MobileHeader />
      <ChartGrid mobile />
      <TradePanel mobile />
      <MobileNav />
      <div className="phone-home"><i /></div>
    </div>
  );
}

function TradingScreen() {
  const state = useTradingState();
  return (
    <Ctx.Provider value={state}>
      <div className="trading-app"><DesktopScreen /><MobileScreen /></div>
    </Ctx.Provider>
  );
}
