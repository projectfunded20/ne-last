import { ArrowRight, Check, ChevronDown, ChevronRight, X } from "lucide-react";
import { useState } from "react";

export function MobileWithdrawalView() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const requests = [
    { id: "132049457", date: "03.10.2026", status: "Successed", amount: "+$69.00 $", system: "Binance Pay" },
    { id: "131992200", date: "02.10.2026", status: "Successed", amount: "+$69.00 $", system: "Binance Pay" },
    { id: "131988479", date: "02.10.2026", status: "Failed", amount: "+3,000.00 Rs", system: "Raast" },
  ];

  const faqs = [
    { q: "How to withdraw money from the account?", a: "To make a withdrawal, select your desired payment method, enter the amount, and confirm your request. Withdrawals are processed quickly." },
    { q: "How long does it take to withdraw funds?", a: "Withdrawal requests are usually processed within 1 to 3 business days depending on the payment system." },
    { q: "What is the minimum withdrawal amount?", a: "The minimum withdrawal amount is $10 USD for most payment methods." },
    { q: "Is there any fee for depositing or withdrawing funds from the account?", a: "No, our platform does not charge fees for standard deposits or withdrawals." },
    { q: "Do I need to provide any documents to make a withdrawal?", a: "Verification may be required if requested by the security department." },
    { q: "What is account verification?", a: "Account verification confirms your identity and secures your funds against unauthorized access." },
    { q: "How to understand that I need to go through verification?", a: "A notification will appear in your profile if verification is required." },
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
        <div className="text-base font-bold text-white mb-2">0.00 $</div>

        <div className="text-xs text-muted-foreground">Available for withdrawal:</div>
        <div className="text-base font-bold text-white mb-4">0.00 $</div>

        <div className="account-section-title text-sm mb-3">Withdrawal:</div>

        <div className="custom-field">
          <span className="field-tag">Amount</span>
          <span className="font-bold">10</span>
          <span className="text-muted-foreground text-xs">USD</span>
        </div>

        <div className="custom-field">
          <span className="field-tag">Payment method</span>
          <span className="flex items-center gap-1.5 font-bold">
            <span className="text-yellow-500">🔸</span> Binance Pay
          </span>
          <ChevronDown size={16} />
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

        <button className="confirm-btn w-full mb-6">
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
            {requests.map((r) => (
              <div key={r.id} className="p-2.5 bg-[oklch(0.22_0.025_273)] rounded-lg flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-white">{r.id}</div>
                  <div className="text-muted-foreground">{r.date}</div>
                  <span className={r.status === "Successed" ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                    {r.status === "Successed" ? "✔ Successed" : "✖ Failed"}
                  </span>
                </div>
                <div className="text-right">
                  <div className={r.status === "Successed" ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
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
            <span className="text-xs text-sky-400 font-bold flex items-center gap-1 cursor-pointer">
              Check out full FAQ <ChevronRight size={14} />
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {faqs.map((f, idx) => (
              <div
                key={idx}
                className="p-3 bg-[oklch(0.22_0.025_273)] rounded-lg cursor-pointer"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <ChevronDown size={14} className={openFaq === idx ? "rotate-180 transition-transform" : "transition-transform"} />
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
