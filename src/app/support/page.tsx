// app/safety-support/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Siren,
  MessageSquareWarning,
  CreditCard,
  FileWarning,
  BadgeCheck,
  DoorClosed,
  AlertTriangle,
  HelpCircle,
  Mail,
  Phone,
  MessageCircle,
  Building2,
  Wrench,
  ArrowRight,
  X,
} from "lucide-react";

function Section({
  title,
  children,
  id,
}: {
  title: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section
      id={id}
      className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm"
    >
      <h2 className="mb-3 text-lg font-bold">{title}</h2>
      {children}
    </section>
  );
}

function InfoCard({
  icon,
  title,
  children,
  ctaText,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  ctaText?: string;
  href?: string;
}) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-black/10 bg-white p-4">
      <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/5">
        {icon}
      </div>
      <div className="mb-1 font-semibold">{title}</div>
      <div className="text-sm text-black/70">{children}</div>
      {href && ctaText && (
        <Link
          href={href}
          className="mt-3 inline-flex items-center gap-1 text-sm font-semibold underline"
        >
          {ctaText} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

function FAQItem({
  q,
  a,
  defaultOpen = false,
}: {
  q: string;
  a: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-black/10">
      <button
        className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="font-medium">{q}</span>
        <span
          className={`inline-flex h-6 w-6 items-center justify-center rounded-md border border-black/10 text-xs transition ${
            open ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      <div
        className={`px-3 pb-3 text-sm text-black/70 transition-[max-height,opacity] ${
          open ? "max-h-96 opacity-100" : "max-h-0 overflow-hidden opacity-0"
        }`}
      >
        {a}
      </div>
    </div>
  );
}

function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`fixed inset-0 z-[2000] ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        className={[
          "absolute left-1/2 top-1/2 w-[95vw] max-w-lg -translate-x-1/2 -translate-y-1/2",
          "rounded-2xl border border-black/10 bg-white shadow-xl",
          "transition-all",
          open ? "scale-100 opacity-100" : "scale-95 opacity-0",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-base font-semibold">{title}</h3>
          <button
            className="btn btn-sm btn-outline"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

export default function SafetySupportPage() {
  const [reportOpen, setReportOpen] = useState(false);
  const [reportType, setReportType] = useState<
    "safety" | "payment" | "listing" | "other"
  >("safety");
  const [reportMsg, setReportMsg] = useState("");
  const [sent, setSent] = useState<null | "ok" | "err">(null);

  const submitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setSent(null);
    try {
      // If you have an API endpoint, call it here:
      // await api.post("/support/report/", { kind: reportType, message: reportMsg })
      await new Promise((r) => setTimeout(r, 500)); // fake
      setSent("ok");
      setReportMsg("");
      setReportType("safety");
    } catch {
      setSent("err");
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-8">
      {/* Hero */}
      <div className="mb-6 rounded-2xl border border-black/10 bg-gradient-to-r from-yellow-50 to-white p-5">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-black/5 px-3 py-1 text-xs font-semibold">
              <ShieldCheck className="h-4 w-4" />
              Safety first
            </div>
            <h1 className="mt-2 text-2xl font-extrabold">Safety & Support</h1>
            <p className="mt-1 max-w-2xl text-sm text-black/70">
              Staying safe is our top priority. Learn how we protect payments,
              keep communication secure, and help you when something goes wrong.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a href="tel:911" className="btn btn-outline">
              <Siren className="h-4 w-4" />
              Emergency: 911
            </a>
            <button
              className="btn btn-primary"
              onClick={() => setReportOpen(true)}
            >
              <MessageSquareWarning className="h-4 w-4" />
              Report an issue
            </button>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <InfoCard
          icon={<CreditCard className="h-5 w-5" />}
          title="Payment protection"
          ctaText="See how payments work"
          href="#payments"
        >
          We never ask you to pay outside the app. Card payments are encrypted
          and tracked end-to-end.
        </InfoCard>
        <InfoCard
          icon={<BadgeCheck className="h-5 w-5" />}
          title="Identity & reviews"
          ctaText="Learn more"
          href="#identity"
        >
          Hosts and renters can verify identity. Reviews help ensure quality and
          accountability.
        </InfoCard>
        <InfoCard
          icon={<FileWarning className="h-5 w-5" />}
          title="Report a problem"
          ctaText="Open a report"
          href="#report"
        >
          See something off? Report safety, listings, or payment concerns—we’ll
          step in quickly.
        </InfoCard>
      </div>

      {/* Content sections */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Left column */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Section id="payments" title="Payment safety">
            <ul className="list-disc space-y-2 pl-5 text-sm text-black/80">
              <li>
                Always pay through our secure checkout—never wire, cash, or
                crypto off-platform.
              </li>
              <li>
                We store card data with a PCI-compliant processor. Your full
                card number is never shared.
              </li>
              <li>
                Refunds and adjustments are handled within your account for
                traceability.
              </li>
            </ul>
            <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
              <CreditCard className="h-3.5 w-3.5" />
              Tip: If someone asks for payment outside the app, report it
              immediately.
            </div>
          </Section>

          <Section id="identity" title="Identity, messaging & house rules">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-black/10 p-3">
                <div className="mb-1 flex items-center gap-2 font-semibold">
                  <BadgeCheck className="h-4 w-4" /> Identity verification
                </div>
                <p className="text-sm text-black/70">
                  We allow optional ID verification. Verified badges help build
                  trust between renters and hosts.
                </p>
              </div>
              <div className="rounded-xl border border-black/10 p-3">
                <div className="mb-1 flex items-center gap-2 font-semibold">
                  <MessageCircle className="h-4 w-4" /> In-app messaging
                </div>
                <p className="text-sm text-black/70">
                  Keep all communication in the app. This helps us protect you
                  and resolve disputes if needed.
                </p>
              </div>
              <div className="rounded-xl border border-black/10 p-3">
                <div className="mb-1 flex items-center gap-2 font-semibold">
                  <DoorClosed className="h-4 w-4" /> House rules
                </div>
                <p className="text-sm text-black/70">
                  Each room may list rules (pets, smoking, quiet hours). Read
                  them before booking to avoid fees.
                </p>
              </div>
              <div className="rounded-xl border border-black/10 p-3">
                <div className="mb-1 flex items-center gap-2 font-semibold">
                  <Building2 className="h-4 w-4" /> On-site safety
                </div>
                <p className="text-sm text-black/70">
                  Locate exits, alarms and emergency contacts on arrival. If you
                  feel unsafe, leave and contact support.
                </p>
              </div>
            </div>
          </Section>

          <Section id="maintenance" title="Maintenance & services">
            <p className="text-sm text-black/70">
              Need help during your stay? Request{" "}
              <Link href="/account" className="font-medium underline">
                cleaning, repairs or maintenance
              </Link>{" "}
              from your profile. You can track status (pending, in progress,
              completed) and chat with the assigned worker.
            </p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-black/5 px-3 py-1 text-xs font-semibold">
              <Wrench className="h-3.5 w-3.5" />
              For urgent issues (e.g. water leak), contact the host and file a
              request right away.
            </div>
          </Section>

          <Section id="scams" title="Spotting scams & suspicious activity">
            <ul className="list-disc space-y-2 pl-5 text-sm text-black/80">
              <li>Never send payment off-platform or share one-time codes.</li>
              <li>
                Beware of deals “too good to be true” or urgent pressure to pay.
              </li>
              <li>
                Check reviews, property photos, and host profile before booking.
              </li>
            </ul>
            <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
              <AlertTriangle className="h-3.5 w-3.5" />
              If it feels off, report it. You’re never bothering us.
            </div>
          </Section>

          <Section id="faq" title="FAQ">
            <div className="flex flex-col gap-2">
              <FAQItem
                q="What do I do in an emergency?"
                a={
                  <>
                    If you or someone nearby is in danger, call local emergency
                    services immediately (e.g.{" "}
                    <a href="tel:911" className="underline">
                      911
                    </a>
                    ). Once safe, contact us so we can help and document the
                    issue.
                  </>
                }
                defaultOpen
              />
              <FAQItem
                q="How are payments protected?"
                a="All card transactions go through a PCI-compliant processor. Avoid off-platform payments to remain eligible for support and refunds."
              />
              <FAQItem
                q="Can I get a refund?"
                a="Refunds depend on your booking terms and the situation (e.g., habitability issues). Open a support ticket and we’ll review quickly."
              />
              <FAQItem
                q="How do I request cleaning or repairs?"
                a={
                  <>
                    Go to{" "}
                    <Link href="/account" className="underline">
                      Account → Services
                    </Link>{" "}
                    and create a request. You’ll see progress updates and who’s
                    assigned.
                  </>
                }
              />
            </div>
          </Section>
        </div>

        {/* Right column: contact/support */}
        <div className="flex flex-col gap-4">
          <Section id="report" title="Contact & support">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href="tel:+18001234567" className="underline">
                  +1 (800) 123-4567
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:support@example.com" className="underline">
                  support@example.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                <Link href="/help" className="underline">
                  Help Center
                </Link>
              </div>
            </div>

            <div className="mt-3 rounded-xl border border-dashed border-black/15 p-3">
              <div className="mb-2 font-semibold">Report an issue</div>
              <p className="text-sm text-black/70">
                Safety concern, suspicious listing, or payment problem? Tell us.
              </p>
              <button
                className="btn btn-outline mt-3"
                onClick={() => setReportOpen(true)}
              >
                <MessageSquareWarning className="h-4 w-4" />
                Report now
              </button>
            </div>

            <div className="mt-3 text-xs text-black/60">
              By contacting support, you agree to our{" "}
              <Link href="/terms" className="underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline">
                Privacy Policy
              </Link>
              .
            </div>
          </Section>
        </div>
      </div>

      {/* Report modal */}
      <Modal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        title="Report an issue"
      >
        <form className="grid grid-cols-1 gap-3" onSubmit={submitReport}>
          <div>
            <label className="mb-1 block text-sm font-medium text-black/80">
              What’s this about?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { v: "safety", label: "Safety" },
                { v: "payment", label: "Payment" },
                { v: "listing", label: "Listing" },
                { v: "other", label: "Other" },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.v}
                  onClick={() => setReportType(opt.v as any)}
                  className={[
                    "rounded-xl border px-3 py-2 text-sm transition",
                    reportType === opt.v
                      ? "border-black bg-black text-white"
                      : "border-black/10 bg-white hover:shadow",
                  ].join(" ")}
                  aria-pressed={reportType === opt.v}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-black/80">
              Describe the issue
            </label>
            <textarea
              value={reportMsg}
              onChange={(e) => setReportMsg(e.target.value)}
              rows={5}
              placeholder="Give us details. Links or room titles help."
              className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-yellow"
              required
            />
          </div>

          {sent === "ok" && (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              Thanks—your report was received. We’ll review and follow up.
            </div>
          )}
          {sent === "err" && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
              Couldn’t send the report. Please try again.
            </div>
          )}

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setReportOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Submit report
            </button>
          </div>
        </form>
      </Modal>
    </main>
  );
}
