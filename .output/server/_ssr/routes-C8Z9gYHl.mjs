import "../_runtime.mjs";
import { r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { _ as createFileRoute, g as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
require_react();
var $$splitComponentImporter = () => import("./routes-BpngvXoQ.mjs");
var Route = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "TRADEX — Web Trading Platform" },
		{
			name: "description",
			content: "TRADEX live web trading interface for AUD/NZD OTC markets simulation."
		},
		{
			property: "og:title",
			content: "TRADEX — Web Trading Platform"
		},
		{
			property: "og:description",
			content: "TRADEX live web trading interface for AUD/NZD OTC markets simulation."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var PAIRS = [
	{
		id: "usd-cop",
		flags: ["🇺🇸", "🇨🇴"],
		name: "USD/COP...",
		fullName: "USD/COP (OTC)",
		rate: .89,
		basePrice: 4210.5,
		decimals: 2
	},
	{
		id: "usd-dzd",
		flags: ["🇺🇸", "🇩🇿"],
		name: "USD/DZD (OTC)",
		fullName: "USD/DZD (OTC)",
		rate: .77,
		basePrice: 134.2,
		decimals: 2
	},
	{
		id: "gbp-cad",
		flags: ["🇬🇧", "🇨🇦"],
		name: "GBP/CAD...",
		fullName: "GBP/CAD (OTC)",
		rate: .83,
		basePrice: 1.782,
		decimals: 4
	},
	{
		id: "nzd-jpy",
		flags: ["🇳🇿", "🇯🇵"],
		name: "NZD/JPY (OTC)",
		fullName: "NZD/JPY (OTC)",
		rate: .77,
		basePrice: 91.45,
		decimals: 2
	},
	{
		id: "usd-idr",
		flags: ["🇺🇸", "🇮🇩"],
		name: "USD/IDR (OTC)",
		fullName: "USD/IDR (OTC)",
		rate: .86,
		basePrice: 15820,
		decimals: 1
	},
	{
		id: "aud-nzd",
		flags: ["🇦🇺", "🇳🇿"],
		name: "AUD/NZD...",
		fullName: "AUD/NZD (OTC)",
		rate: .79,
		basePrice: 1.17134,
		decimals: 5
	}
];
//#endregion
export { Route as n, PAIRS as t };
