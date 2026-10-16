import type { Metadata } from "next";
import Link from "next/link";
import MarketingShell, { MARKETING_WIDTH } from "@/components/saas/MarketingShell";
import PricingCards from "@/components/saas/PricingCards";

export const metadata: Metadata = {
  title: "Retailr — Launch your online business",
  description: "Retailr gives small businesses a storefront, order management and customer tools on one simple subscription.",
};

const features = [
  { t: "Your own storefront", d: "A branded online shop live in minutes — no developer needed." },
  { t: "Orders & inventory", d: "Track every order from pending to delivered and keep stock accurate." },
  { t: "Customer insights", d: "See who your best customers are and what they love to buy." },
  { t: "Team access", d: "Invite managers and staff with the right level of access." },
  { t: "Clear analytics", d: "Revenue, top products and trends in one simple dashboard." },
  { t: "Simple subscription", d: "One predictable monthly price. Upgrade or cancel anytime." },
];

const steps = [
  { n: "1", t: "Create your account", d: "Tell us about your business and pick a plan. 14 days free." },
  { n: "2", t: "Add your products", d: "Upload your catalogue, set prices and stock levels." },
  { n: "3", t: "Start selling", d: "Share your store link and manage orders from your dashboard." },
];

export default function LandingPage() {
  return (
    <MarketingShell>
      <section className="bg-brand-950 text-white">
        <div className={`${MARKETING_WIDTH} py-20 text-center sm:py-28 lg:py-36`}>
          <p className="mx-auto w-fit rounded-full bg-white/10 px-4 py-1.5 text-sm text-brand-100">Built for African small businesses</p>
          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-semibold leading-tight sm:text-6xl lg:text-7xl lg:leading-[1.05]">Everything you need to sell online, in one place.</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-brand-100/80 lg:max-w-3xl lg:text-xl">Launch a storefront, manage orders and grow your customer base with a single simple subscription.</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/get-started" className="rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-brand-700 hover:bg-brand-50">Start your free trial</Link>
            <Link href="/admin/login" className="rounded-lg px-6 py-3.5 text-sm font-semibold text-white ring-1 ring-inset ring-white/30 hover:bg-white/10">See the demo dashboard</Link>
          </div>
          <p className="mt-6 text-sm text-brand-100/70">
            Or{" "}
            <Link href="/s/adire-hub" className="font-medium text-white underline underline-offset-4 hover:text-brand-100">
              browse a demo store
            </Link>{" "}
            to see what your customers get.
          </p>
        </div>
      </section>

      <section id="features" className={`${MARKETING_WIDTH} py-20 lg:py-28`}>
        <h2 className="text-center text-3xl font-semibold lg:text-4xl">Tools that grow with you</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-8">
          {features.map((f) => (
            <div key={f.t} className="rounded-2xl border border-gray-200 p-6 lg:p-8">
              <div className="mb-4 h-10 w-10 rounded-xl bg-brand-50" />
              <h3 className="font-semibold">{f.t}</h3>
              <p className="mt-2 text-sm text-gray-500">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how" className="bg-gray-50">
        <div className={`${MARKETING_WIDTH} py-20 lg:py-28`}>
          <h2 className="text-center text-3xl font-semibold lg:text-4xl">Up and running in three steps</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3 lg:mt-16 lg:gap-12">
            {steps.map((s) => (
              <div key={s.n}>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 font-semibold text-white">{s.n}</span>
                <h3 className="mt-4 font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm text-gray-500">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className={`${MARKETING_WIDTH} py-20 text-center lg:py-28`}>
        <h2 className="text-3xl font-semibold lg:text-4xl">Simple, transparent pricing</h2>
        <p className="mt-3 text-gray-500">Every plan starts with a 14-day free trial. No card required.</p>
        <div className="mt-10"><PricingCards /></div>
      </section>
    </MarketingShell>
  );
}
