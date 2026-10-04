import { n as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as PAIRS } from "./routes-C8Z9gYHl.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { C as Bell, S as BriefcaseBusiness, T as ArrowDown, _ as Clock3, a as RefreshCw, b as ChevronDown, c as Minus, d as Maximize, f as LogOut, g as Compass, h as Ellipsis, i as Settings, l as MessageSquare, m as Eye, n as UserRound, o as Plus, p as Image, r as Trophy, s as Pencil, t as Volume2, u as Menu, v as CircleQuestionMark, w as ArrowUp, x as ChartLine, y as ChevronUp } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BpngvXoQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/index.tsx?tsr-split=component";
var CANDLE_MS = 6e3;
function seeded(seed) {
	let s = seed;
	return () => {
		s = s * 16807 % 2147483647;
		return (s - 1) / 2147483646;
	};
}
function generateCandles(basePrice, decimals) {
	const r = seeded(42);
	const out = [];
	const scale = Math.pow(10, -Math.min(decimals, 4)) * 2;
	let p = basePrice;
	for (let i = 0; i < 35; i++) {
		const o = p;
		const c = o + (r() - .5) * scale;
		const h = Math.max(o, c) + r() * (scale * .4);
		const l = Math.min(o, c) - r() * (scale * .4);
		out.push({
			id: i,
			o,
			h,
			l,
			c
		});
		p = c;
	}
	return out;
}
var pad = (n) => String(n).padStart(2, "0");
var fmtClock = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
var fmtMoney = (n) => n.toLocaleString("en-US", {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
});
function useTradingState() {
	const [activePairIndex, setActivePairIndex] = (0, import_react.useState)(5);
	const activePair = PAIRS[activePairIndex] ?? PAIRS[5];
	const [candles, setCandles] = (0, import_react.useState)(() => generateCandles(activePair.basePrice, activePair.decimals));
	const [now, setNow] = (0, import_react.useState)(null);
	const [account, setAccount] = (0, import_react.useState)("live");
	const [balances, setBalances] = (0, import_react.useState)({
		live: 31626.4,
		demo: 5e3
	});
	const [stakeMode, setStakeMode] = (0, import_react.useState)("dollar");
	const [stakeDollars, setStakeDollars] = (0, import_react.useState)(60);
	const [stakePercent, setStakePercent] = (0, import_react.useState)(1);
	const [timeMode, setTimeMode] = (0, import_react.useState)("clock");
	const [minutes, setMinutes] = (0, import_react.useState)(1);
	const [pendingTrade, setPendingTrade] = (0, import_react.useState)(false);
	const [visibleCount, setVisibleCount] = (0, import_react.useState)(20);
	const [trades, setTrades] = (0, import_react.useState)([{
		id: 1728042e6,
		dir: "up",
		pairName: "AUD/NZD (OTC)",
		candleId: 10,
		entry: 1.1698,
		stake: 60,
		rate: .79,
		expiresAt: Date.now() - 3e4,
		status: "won",
		profit: 47.4,
		account: "live"
	}, {
		id: 172804208e4,
		dir: "up",
		pairName: "AUD/NZD (OTC)",
		candleId: 18,
		entry: 1.1702,
		stake: 60,
		rate: .79,
		expiresAt: Date.now() + 45e3,
		status: "open",
		profit: 0,
		account: "live"
	}]);
	const candlesRef = (0, import_react.useRef)(candles);
	candlesRef.current = candles;
	const nextCandleAt = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		setCandles(generateCandles(activePair.basePrice, activePair.decimals));
	}, [activePairIndex]);
	(0, import_react.useEffect)(() => {
		nextCandleAt.current = Date.now() + CANDLE_MS;
		setNow(Date.now());
		const t = setInterval(() => {
			const ts = Date.now();
			setNow(ts);
			setCandles((prev) => {
				if (!prev.length) return prev;
				const list = prev.slice();
				const last = { ...list[list.length - 1] };
				const delta = (Math.random() - .5) * 12e-5;
				const c = last.c + delta;
				last.c = c;
				last.h = Math.max(last.h, c);
				last.l = Math.min(last.l, c);
				list[list.length - 1] = last;
				if (ts >= nextCandleAt.current) {
					nextCandleAt.current = ts + CANDLE_MS;
					list.push({
						id: last.id + 1,
						o: c,
						h: c,
						l: c,
						c
					});
					if (list.length > 70) list.shift();
				}
				return list;
			});
		}, 500);
		return () => clearInterval(t);
	}, []);
	const effectiveStake = (0, import_react.useMemo)(() => {
		if (stakeMode === "dollar") return stakeDollars;
		const computed = Math.round(balances[account] * (stakePercent / 100));
		return Math.max(1, computed);
	}, [
		balances,
		account,
		stakeMode,
		stakeDollars,
		stakePercent
	]);
	(0, import_react.useEffect)(() => {
		if (now === null || !candlesRef.current.length) return;
		const currentPrice = candlesRef.current[candlesRef.current.length - 1].c;
		const due = trades.filter((t) => t.status === "open" && now >= t.expiresAt);
		if (!due.length) return;
		let credit = {
			live: 0,
			demo: 0
		};
		const updated = trades.map((t) => {
			if (!due.includes(t)) return t;
			const won = t.dir === "up" ? currentPrice > t.entry : currentPrice < t.entry;
			const payout = won ? t.stake * (1 + t.rate) : 0;
			credit = {
				...credit,
				[t.account]: credit[t.account] + payout
			};
			return {
				...t,
				status: won ? "won" : "lost",
				profit: won ? t.stake * t.rate : -t.stake
			};
		});
		setTrades(updated);
		setBalances((b) => ({
			live: b.live + credit.live,
			demo: b.demo + credit.demo
		}));
	}, [now, trades]);
	const placeTrade = (0, import_react.useCallback)((dir) => {
		if (now === null || !candlesRef.current.length) return;
		if (balances[account] < effectiveStake) return;
		const last = candlesRef.current[candlesRef.current.length - 1];
		setBalances((b) => ({
			...b,
			[account]: b[account] - effectiveStake
		}));
		const expiresAt = Date.now() + minutes * 6e4;
		setTrades((ts) => [{
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
			account
		}, ...ts]);
	}, [
		account,
		activePair,
		balances,
		effectiveStake,
		minutes,
		now
	]);
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
		toggleStakeMode: (0, import_react.useCallback)(() => {
			setStakeMode((m) => m === "dollar" ? "percent" : "dollar");
		}, []),
		stakeDollars,
		setStakeDollars,
		stakePercent,
		setStakePercent,
		effectiveStake,
		timeMode,
		toggleTimeMode: (0, import_react.useCallback)(() => {
			setTimeMode((m) => m === "clock" ? "timer" : "clock");
		}, []),
		minutes,
		setMinutes,
		pendingTrade,
		togglePendingTrade: (0, import_react.useCallback)(() => {
			setPendingTrade((p) => !p);
		}, []),
		visibleCount,
		zoomIn: (0, import_react.useCallback)(() => {
			setVisibleCount((c) => Math.max(12, c - 4));
		}, []),
		zoomOut: (0, import_react.useCallback)(() => {
			setVisibleCount((c) => Math.min(36, c + 4));
		}, []),
		trades,
		placeTrade,
		price: candles.length ? candles[candles.length - 1].c : activePair.basePrice,
		nextCandleAt: nextCandleAt.current
	};
}
var Ctx = (0, import_react.createContext)(null);
var useT = () => (0, import_react.useContext)(Ctx);
function ScreenButton({ children, className = "", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
		className,
		...props,
		children
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 279,
		columnNumber: 10
	}, this);
}
function PairFlags({ flags = ["🇦🇺", "🇳🇿"], compact = false }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
		className: compact ? "tab-flags compact" : "tab-flags",
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: flags[0] }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 291,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: flags[1] }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 292,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 290,
		columnNumber: 10
	}, this);
}
function AccountMenu({ onClose }) {
	const { account, setAccount, balances, setBalances } = useT();
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "account-menu",
		onClick: (e) => e.stopPropagation(),
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "account-menu-main",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "vip-row",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "vip",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "diamond",
							children: "♦"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 312,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("small", { children: "VIP:" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 314,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("b", { children: "+4% profit" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 315,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 313,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 311,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						className: "vip-eye",
						"aria-label": "Show VIP info",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Eye, { size: 18 }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 319,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 318,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 310,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "am-info",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("b", { children: "aj400krvade@gmail.com" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 323,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "ID: 85404594" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 324,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: [
							"Currency: ",
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("b", { children: "USD" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 326,
								columnNumber: 23
							}, this),
							" ",
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("em", { children: "CHANGE" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 326,
								columnNumber: 34
							}, this)
						] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 325,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 322,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					className: `am-account ${account === "live" ? "on" : ""}`,
					onClick: () => {
						setAccount("live");
						onClose();
					},
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("i", { className: "radio" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 333,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Live Account" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 335,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("b", { children: ["$", fmtMoney(balances.live)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 336,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: "The daily limit is not set" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 337,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("em", { children: "SET LIMIT" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 338,
							columnNumber: 13
						}, this)
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 334,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 329,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					className: `am-account ${account === "demo" ? "on" : ""}`,
					onClick: () => {
						setAccount("demo");
						onClose();
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("i", { className: "radio" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 345,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Demo Account" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 347,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("b", { children: [
							"$",
							fmtMoney(balances.demo),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(RefreshCw, {
								size: 16,
								className: "am-refresh",
								title: "Reset demo balance to $5,000",
								onClick: (e) => {
									e.stopPropagation();
									setBalances((b) => ({
										...b,
										demo: 5e3
									}));
								}
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 350,
								columnNumber: 15
							}, this)
						] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 348,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 346,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Pencil, {
							size: 15,
							className: "am-pencil"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 359,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 341,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 309,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", {
			className: "account-menu-links",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Deposit" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 363,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Withdrawal" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 364,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Payments" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 365,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Trades" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 366,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "My account" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 367,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("hr", {}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 368,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "logout",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LogOut, { size: 16 }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 370,
						columnNumber: 11
					}, this), "Logout"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 369,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 362,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 308,
		columnNumber: 10
	}, this);
}
function AccountBlock({ mobile = false }) {
	const { account, balances } = useT();
	const [open, setOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const close = () => setOpen(false);
		window.addEventListener("click", close);
		return () => window.removeEventListener("click", close);
	}, [open]);
	const label = account === "live" ? mobile ? "LIVE" : "LIVE ACCOUNT" : mobile ? "DEMO" : "DEMO ACCOUNT";
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: `${mobile ? "account account-mobile" : "account"} ${account === "demo" ? "is-demo" : ""}`,
		onClick: (e) => {
			e.stopPropagation();
			setOpen((o) => !o);
		},
		role: "button",
		tabIndex: 0,
		"aria-label": "Account selector",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "diamond",
				children: "♦"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 397,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("small", { children: label }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 399,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: ["$", fmtMoney(balances[account])] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 400,
				columnNumber: 9
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 398,
				columnNumber: 7
			}, this),
			open ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronUp, { size: 15 }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 402,
				columnNumber: 15
			}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronDown, { size: 15 }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 402,
				columnNumber: 41
			}, this),
			open && /* @__PURE__ */ (void 0)(AccountMenu, { onClose: () => setOpen(false) }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 403,
				columnNumber: 16
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 393,
		columnNumber: 10
	}, this);
}
function NotificationBadge() {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "notification",
		title: "Notifications",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Bell, { size: 18 }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 408,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "66" }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 409,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 407,
		columnNumber: 10
	}, this);
}
function DesktopHeader() {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", {
		className: "desktop-header",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "brand",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "brand-mark",
					children: "◫"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 417,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("b", { children: "TRADEX" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 418,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("i", {}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 419,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "WEB TRADING PLATFORM" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 420,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 416,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "header-actions",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(NotificationBadge, {}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 423,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AccountBlock, {}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 424,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ScreenButton, {
					className: "deposit",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { size: 18 }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 426,
						columnNumber: 11
					}, this), "Deposit"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 425,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ScreenButton, {
					className: "withdraw",
					children: "Withdrawal"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 429,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 422,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 415,
		columnNumber: 10
	}, this);
}
function DesktopSidebar() {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("aside", {
		className: "desktop-sidebar",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Menu, {
				size: 22,
				className: "side-menu",
				title: "Menu"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 437,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ScreenButton, {
				className: "side-active",
				"aria-label": "Chart",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Image, { size: 20 }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 439,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 438,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "side-icon",
				title: "Help",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleQuestionMark, { size: 20 }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 442,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 441,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "side-icon",
				title: "Profile",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(UserRound, { size: 20 }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 445,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 444,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "badge-icon side-icon",
				title: "Tournaments",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trophy, { size: 20 }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 448,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("b", { children: "4" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 449,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 447,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "badge-icon side-icon",
				title: "Market",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "coin",
					children: "$"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 452,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("b", { children: "2" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 453,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 451,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "side-icon",
				title: "More",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Ellipsis, { size: 22 }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 456,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 455,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "sidebar-spacer" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 458,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "utility",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Maximize, {
					size: 16,
					title: "Fullscreen"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 460,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					title: "Popout",
					children: "➜"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 461,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 459,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "utility",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Settings, {
					size: 17,
					title: "Settings"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 464,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Volume2, {
					size: 18,
					title: "Sound"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 465,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 463,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "join",
				title: "Join Telegram Community",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MessageSquare, { size: 14 }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 468,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("b", { children: "JOIN US" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 469,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 467,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "help",
				title: "Live Support",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "●" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 472,
					columnNumber: 9
				}, this), "Help"]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 471,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 436,
		columnNumber: 10
	}, this);
}
function PairTabs() {
	const { activePairIndex, setActivePairIndex } = useT();
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "pair-tabs",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ScreenButton, {
			className: "add-pair",
			title: "Add pair",
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { size: 18 }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 485,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 484,
			columnNumber: 7
		}, this), PAIRS.map((pair, index) => {
			const isSelected = index === activePairIndex;
			return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: `pair-tab ${isSelected ? "selected" : ""}`,
				onClick: () => setActivePairIndex(index),
				role: "button",
				tabIndex: 0,
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PairFlags, { flags: pair.flags }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 490,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("b", { children: pair.name }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 492,
						columnNumber: 15
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: [Math.round(pair.rate * 100), "%"] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 493,
						columnNumber: 15
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 491,
						columnNumber: 13
					}, this),
					isSelected && /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (void 0)(ChevronDown, { size: 13 }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 496,
						columnNumber: 17
					}, this), /* @__PURE__ */ (void 0)("span", {
						className: "tab-close",
						onClick: (e) => {
							e.stopPropagation();
						},
						title: "Close tab",
						children: "×"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 497,
						columnNumber: 17
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 495,
						columnNumber: 28
					}, this)
				]
			}, pair.id, true, {
				fileName: _jsxFileName,
				lineNumber: 489,
				columnNumber: 14
			}, this);
		})]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 483,
		columnNumber: 10
	}, this);
}
function ChartGrid({ mobile = false }) {
	const { candles, now, trades, price, nextCandleAt, account, activePair, visibleCount, zoomIn, zoomOut } = useT();
	const count = mobile ? Math.min(13, visibleCount) : visibleCount;
	const visible = candles.slice(-count);
	const firstId = visible.length ? visible[0].id : 0;
	const insetTop = mobile ? 24 : 60;
	const insetBottom = mobile ? 28 : 38;
	const { max, range } = (0, import_react.useMemo)(() => {
		let hi = -Infinity;
		let lo = Infinity;
		for (const c of visible) {
			hi = Math.max(hi, c.h);
			lo = Math.min(lo, c.l);
		}
		const padVal = (hi - lo) * .1 || 4e-4;
		return {
			max: hi + padVal,
			range: hi - lo + padVal * 2
		};
	}, [visible]);
	const frac = (p) => Math.min(1, Math.max(0, (max - p) / range));
	const yCss = (f) => `calc(${insetTop}px + (100% - ${insetTop + insetBottom}px) * ${f})`;
	const step = 100 / count;
	const highest = Math.max(...visible.map((c) => c.h));
	const lowest = Math.min(...visible.map((c) => c.l));
	const openTrade = trades.find((t) => t.status === "open" && t.account === account);
	const remaining = now === null ? 0 : Math.max(0, Math.ceil(((openTrade ? openTrade.expiresAt : nextCandleAt) - now) / 1e3));
	const countdown = `${pad(Math.floor(remaining / 60))}:${pad(remaining % 60)}`;
	const clock = now === null ? mobile ? "19:09:19" : "19:54:41" : fmtClock(new Date(now));
	const markers = trades.filter((t) => t.account === account && t.candleId >= firstId && t.status === "open");
	const priceFormatted = price.toFixed(activePair.decimals);
	const labelCount = mobile ? 5 : 7;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: mobile ? "chart-grid mobile-chart" : "chart-grid",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid-lines" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 560,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "trade-caption start",
				children: ["◀", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Beginning of trade" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 564,
					columnNumber: 10
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 563,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "trade-caption end",
				children: ["◀", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
					"End of trade",
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("br", {}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 570,
						columnNumber: 11
					}, this),
					countdown
				] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 568,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 566,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "market-time",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "●" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 577,
						columnNumber: 9
					}, this),
					" ",
					clock,
					" ",
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("i", { children: "UTC+5" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 577,
						columnNumber: 32
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 576,
				columnNumber: 7
			}, this),
			!mobile && /* @__PURE__ */ (void 0)("div", {
				className: "pair-info",
				children: [/* @__PURE__ */ (void 0)("b", { children: "i" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 580,
					columnNumber: 11
				}, this), " PAIR INFORMATION"]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 579,
				columnNumber: 19
			}, this),
			mobile && /* @__PURE__ */ (void 0)("div", {
				className: "info-dot",
				children: "i"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 582,
				columnNumber: 18
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "high-label",
				children: highest.toFixed(activePair.decimals)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 585,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "low-label",
				children: lowest.toFixed(activePair.decimals)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 586,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "candles",
				children: [visible.map((c, index) => {
					const top = frac(c.h) * 100;
					const bottom = frac(c.l) * 100;
					const bTop = frac(Math.max(c.o, c.c)) * 100;
					const bBot = frac(Math.min(c.o, c.c)) * 100;
					return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: `candle ${c.c >= c.o ? "up" : "down"}`,
						style: { left: `${index * step}%` },
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("i", { style: {
							top: `${top}%`,
							height: `${bottom - top}%`
						} }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 598,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("b", { style: {
							top: `${bTop}%`,
							height: `${bBot - bTop}%`
						} }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 602,
							columnNumber: 15
						}, this)]
					}, c.id, true, {
						fileName: _jsxFileName,
						lineNumber: 595,
						columnNumber: 16
					}, this);
				}), markers.map((t) => {
					const idx = t.candleId - firstId;
					return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: `trade-marker ${t.dir}`,
						style: {
							left: `calc(${idx * step}% + ${mobile ? 3 : 1.2}%)`,
							top: `${frac(t.entry) * 100}%`
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: t.dir === "up" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowUp, {
								size: 10,
								strokeWidth: 3
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 616,
								columnNumber: 35
							}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowDown, {
								size: 10,
								strokeWidth: 3
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 616,
								columnNumber: 75
							}, this) }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 615,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("i", {}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 618,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("em", { children: ["$", t.stake] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 619,
								columnNumber: 15
							}, this)
						]
					}, t.id, true, {
						fileName: _jsxFileName,
						lineNumber: 611,
						columnNumber: 16
					}, this);
				})]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 589,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "expiry-line" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 625,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "price-line",
				style: { top: yCss(frac(price)) },
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: countdown }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 631,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("b", { children: priceFormatted }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 632,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 628,
				columnNumber: 7
			}, this),
			!mobile && /* @__PURE__ */ (void 0)("div", {
				className: "alert-marker",
				style: { top: yCss(.68) },
				children: [/* @__PURE__ */ (void 0)(Bell, { size: 11 }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 639,
					columnNumber: 11
				}, this), /* @__PURE__ */ (void 0)("span", { children: (price * .9992).toFixed(activePair.decimals) }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 640,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 636,
				columnNumber: 19
			}, this),
			Array.from({ length: labelCount }, (_, k) => {
				const f = (k + .5) / labelCount;
				const p = max - f * range;
				return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "price-label",
					style: { top: yCss(f) },
					children: p.toFixed(activePair.decimals)
				}, k, false, {
					fileName: _jsxFileName,
					lineNumber: 649,
					columnNumber: 14
				}, this);
			}),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "x-labels",
				children: (mobile ? [
					"19:00",
					"19:04",
					"19:08",
					"19:12",
					"19:16"
				] : [
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
					"20:16"
				]).map((time, idx) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: idx === 10 && !mobile ? "current-time-pill" : "",
					children: time
				}, time, false, {
					fileName: _jsxFileName,
					lineNumber: 658,
					columnNumber: 197
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 657,
				columnNumber: 7
			}, this),
			!mobile && /* @__PURE__ */ (void 0)("div", {
				className: "chart-tools",
				children: [
					/* @__PURE__ */ (void 0)("button", {
						title: "Drawings",
						children: /* @__PURE__ */ (void 0)(Pencil, { size: 15 }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 666,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 665,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (void 0)("button", {
						className: "active",
						title: "Timeframe",
						children: "1m"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 668,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (void 0)("button", {
						title: "Candlesticks",
						children: /* @__PURE__ */ (void 0)(ChartLine, { size: 15 }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 672,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 671,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (void 0)("button", {
						title: "Indicators",
						children: /* @__PURE__ */ (void 0)(Compass, { size: 15 }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 675,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 674,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 664,
				columnNumber: 19
			}, this),
			!mobile && /* @__PURE__ */ (void 0)("div", {
				className: "chart-zoom",
				children: [/* @__PURE__ */ (void 0)("button", {
					onClick: zoomOut,
					title: "Zoom out",
					children: /* @__PURE__ */ (void 0)(Minus, { size: 13 }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 682,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 681,
					columnNumber: 11
				}, this), /* @__PURE__ */ (void 0)("button", {
					onClick: zoomIn,
					title: "Zoom in",
					children: /* @__PURE__ */ (void 0)(Plus, { size: 13 }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 685,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 684,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 680,
				columnNumber: 19
			}, this),
			mobile && /* @__PURE__ */ (void 0)("div", {
				className: "mobile-tools",
				children: [/* @__PURE__ */ (void 0)("button", {
					title: "Tools",
					children: "•••"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 691,
					columnNumber: 11
				}, this), /* @__PURE__ */ (void 0)("span", {
					title: "Open trades",
					children: [/* @__PURE__ */ (void 0)(BriefcaseBusiness, { size: 16 }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 693,
						columnNumber: 13
					}, this), /* @__PURE__ */ (void 0)("b", { children: trades.filter((t) => t.status === "open").length }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 694,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 692,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 690,
				columnNumber: 18
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 559,
		columnNumber: 10
	}, this);
}
function StakeBox({ mobile = false }) {
	const { stakeMode, toggleStakeMode, stakeDollars, setStakeDollars, stakePercent, setStakePercent } = useT();
	const handleDecrease = () => {
		if (stakeMode === "dollar") setStakeDollars((s) => Math.max(1, s - 10));
		else setStakePercent((p) => Math.max(1, p - 1));
	};
	const handleIncrease = () => {
		if (stakeMode === "dollar") setStakeDollars((s) => Math.min(1e4, s + 10));
		else setStakePercent((p) => Math.min(50, p + 1));
	};
	const displayText = stakeMode === "dollar" ? `${stakeDollars} $` : `${stakePercent} %`;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: mobile ? "stake-box mobile" : "stake-box",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "field-label",
				children: "Investment"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 730,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ScreenButton, {
				"aria-label": "Decrease investment",
				onClick: handleDecrease,
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Minus, { size: mobile ? 13 : 15 }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 732,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 731,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: displayText }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 734,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ScreenButton, {
				"aria-label": "Increase investment",
				onClick: handleIncrease,
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { size: mobile ? 14 : 16 }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 736,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 735,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "switch-link",
				onClick: toggleStakeMode,
				role: "button",
				tabIndex: 0,
				children: "SWITCH"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 738,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 729,
		columnNumber: 10
	}, this);
}
function TimeBox({ mobile = false }) {
	const { now, minutes, setMinutes, timeMode, toggleTimeMode } = useT();
	const handleDecrease = () => {
		setMinutes((m) => Math.max(1, m - 1));
	};
	const handleIncrease = () => {
		setMinutes((m) => Math.min(60, m + 1));
	};
	const timeDisplay = (0, import_react.useMemo)(() => {
		if (timeMode === "timer") return `00:${pad(minutes)}:00`;
		if (now === null) return mobile ? "19:10" : "19:56";
		const d = new Date(now + minutes * 6e4);
		return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
	}, [
		timeMode,
		minutes,
		now,
		mobile
	]);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: mobile ? "time-box mobile" : "time-box",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "field-label",
				children: "Time"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 773,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ScreenButton, {
				"aria-label": "Decrease time",
				onClick: handleDecrease,
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Minus, { size: mobile ? 13 : 15 }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 775,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 774,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: timeDisplay }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 777,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ScreenButton, {
				"aria-label": "Increase time",
				onClick: handleIncrease,
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { size: mobile ? 14 : 16 }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 779,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 778,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "switch-link",
				onClick: toggleTimeMode,
				role: "button",
				tabIndex: 0,
				children: "SWITCH TIME"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 781,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 772,
		columnNumber: 10
	}, this);
}
function ActionButtons() {
	const { placeTrade } = useT();
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "trade-actions",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ScreenButton, {
			className: "buy",
			onClick: () => placeTrade("up"),
			children: "Buy"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 793,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ScreenButton, {
			className: "sell",
			onClick: () => placeTrade("down"),
			children: "Sell"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 796,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 792,
		columnNumber: 10
	}, this);
}
function TradesList() {
	const { trades, account, now } = useT();
	const list = trades.filter((t) => t.account === account);
	const openCount = list.filter((t) => t.status === "open").length;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "trades-panel",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "trades-head",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("b", { children: "Trades" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 813,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: list.length }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 814,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Clock3, { size: 17 }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 815,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: openCount }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 816,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 812,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "trades-scroll",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "trade-date",
				children: ["4 OCTOBER ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("i", { children: "6" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 821,
					columnNumber: 21
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 820,
				columnNumber: 9
			}, this), list.map((t) => {
				const rem = now === null ? 0 : Math.max(0, Math.ceil((t.expiresAt - now) / 1e3));
				const timerStr = t.status === "open" ? `00:${pad(Math.floor(rem / 60))}:${pad(rem % 60)}` : "00:00:00";
				return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "trade-item",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "trade-row",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronDown, { size: 14 }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 830,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PairFlags, {
								flags: ["🇦🇺", "🇳🇿"],
								compact: true
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 831,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("b", { children: [t.pairName.slice(0, 11), "..."] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 832,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: timerStr }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 833,
								columnNumber: 17
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 829,
						columnNumber: 15
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: `trade-result ${t.dir}`,
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
							t.dir === "up" ? "↑" : "↓",
							" ",
							t.stake,
							" $"
						] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 836,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("b", {
							className: t.status === "won" ? "won" : "",
							children: [
								t.status === "won" ? `+${fmtMoney(t.stake * (1 + t.rate))}` : t.status === "lost" ? "0.00" : `${fmtMoney(t.stake)}`,
								" ",
								"$"
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 839,
							columnNumber: 17
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 835,
						columnNumber: 15
					}, this)]
				}, t.id, true, {
					fileName: _jsxFileName,
					lineNumber: 828,
					columnNumber: 16
				}, this);
			})]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 819,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 811,
		columnNumber: 10
	}, this);
}
function TradePanel() {
	const { activePair, effectiveStake, pendingTrade, togglePendingTrade } = useT();
	const payout = `${fmtMoney(effectiveStake * (1 + activePair.rate))} $`;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("aside", {
		className: "right-column",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
			className: "trade-panel",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "panel-pair",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PairFlags, { flags: activePair.flags }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 862,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("b", { children: activePair.fullName }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 863,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: [Math.round(activePair.rate * 100), "%"] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 864,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 861,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "pending",
					onClick: togglePendingTrade,
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Clock3, { size: 15 }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 869,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "PENDING TRADE" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 870,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: `pending-switch ${pendingTrade ? "active" : ""}`,
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "pending-switch-knob" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 872,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 871,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 868,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TimeBox, {}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 877,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StakeBox, {}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 880,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "payout",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Payout" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 884,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("i", {}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 885,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: payout }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 886,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 883,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ActionButtons, {}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 890,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 860,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TradesList, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 894,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 859,
		columnNumber: 10
	}, this);
}
function DesktopScreen() {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "desktop-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DesktopSidebar, {}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 901,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DesktopHeader, {}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 902,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
				className: "desktop-main",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PairTabs, {}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 904,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "chart-container",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChartGrid, {}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 906,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "sentiment",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("b", { children: "34%" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 908,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("i", {}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 910,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("i", {}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 911,
								columnNumber: 15
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 909,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("b", { children: "66%" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 913,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 907,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 905,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 903,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TradePanel, {}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 917,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 900,
		columnNumber: 10
	}, this);
}
function MobileHeader() {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", {
		className: "mobile-header",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AccountBlock, { mobile: true }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 924,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(NotificationBadge, {}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 925,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ScreenButton, {
				className: "deposit",
				children: "Deposit"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 926,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 923,
		columnNumber: 10
	}, this);
}
function MobileNav() {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", {
		className: "mobile-nav",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Image, {
				size: 20,
				title: "Chart"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 931,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleQuestionMark, {
				size: 20,
				title: "Help"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 932,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(UserRound, {
				size: 20,
				title: "Profile"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 933,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				title: "Tournaments",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trophy, { size: 20 }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 935,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("b", { children: "4" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 936,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 934,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				title: "More",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Ellipsis, { size: 22 }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 939,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("b", { children: "2" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 940,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 938,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 930,
		columnNumber: 10
	}, this);
}
function MobileTradePanel() {
	const { activePair, effectiveStake, pendingTrade, togglePendingTrade, activePairIndex, setActivePairIndex } = useT();
	const payout = `${fmtMoney(effectiveStake * (1 + activePair.rate))} $`;
	const cyclePair = () => {
		setActivePairIndex((i) => (i + 1) % PAIRS.length);
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "mobile-trade-panel",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mobile-pair-row",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mobile-pair",
					onClick: cyclePair,
					title: "Click to cycle pair",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PairFlags, {
							flags: activePair.flags,
							compact: true
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 963,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("b", { children: activePair.name }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 964,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: [Math.round(activePair.rate * 100), "%"] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 965,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronDown, { size: 14 }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 966,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 962,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "pending",
					onClick: togglePendingTrade,
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "PENDING TRADE" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 969,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: `pending-switch ${pendingTrade ? "active" : ""}`,
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "pending-switch-knob" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 971,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 970,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 968,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 961,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mobile-fields",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TimeBox, { mobile: true }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 978,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StakeBox, { mobile: true }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 979,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 977,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "payout",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Payout" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 984,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("i", {}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 985,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: payout }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 986,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 983,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ActionButtons, {}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 990,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 959,
		columnNumber: 10
	}, this);
}
function MobileScreen() {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "mobile-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MobileHeader, {}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 997,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChartGrid, { mobile: true }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 998,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MobileTradePanel, {}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 999,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MobileNav, {}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1e3,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "phone-home",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("i", {}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1002,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1001,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 996,
		columnNumber: 10
	}, this);
}
function TradingScreen() {
	const state = useTradingState();
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Ctx.Provider, {
		value: state,
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "trading-app",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DesktopScreen, {}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1012,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MobileScreen, {}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1013,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 1011,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 1010,
		columnNumber: 10
	}, this);
}
//#endregion
export { TradingScreen as component };
