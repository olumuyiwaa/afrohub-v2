"use client";
import { useState } from "react";
import { Card, CardHeader, PageHeader } from "@/components/saas/Card";
import { Field, inputCls, PrimaryButton } from "@/components/saas/Form";

// Platform-level settings. Persisted to localStorage only for now; the real
// backend will own these values.
const KEY = "retailr:platform-settings";
const defaults = { platformName: "Retailr", supportEmail: "support@retailr.com", trialDays: 14, currency: "USD", requireApproval: true };

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
  } catch {
    return defaults;
  }
}

export default function SettingsPage() {
  const [s, setS] = useState(load);
  const [saved, setSaved] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch {
      /* ignore */
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <>
      <PageHeader title="Platform settings" subtitle="Defaults applied to every business on Retailr." />
      <Card className="max-w-2xl">
        <CardHeader title="General" />
        <form onSubmit={submit} className="space-y-4 p-5 sm:p-6">
          <Field label="Platform name"><input className={inputCls} value={s.platformName} onChange={(e) => setS({ ...s, platformName: e.target.value })} /></Field>
          <Field label="Support email"><input type="email" className={inputCls} value={s.supportEmail} onChange={(e) => setS({ ...s, supportEmail: e.target.value })} /></Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Free trial length (days)"><input type="number" min={0} className={inputCls} value={s.trialDays} onChange={(e) => setS({ ...s, trialDays: Number(e.target.value) })} /></Field>
            <Field label="Billing currency">
              <select className={inputCls} value={s.currency} onChange={(e) => setS({ ...s, currency: e.target.value })}>
                {["USD", "NGN", "GHS", "KES", "ZAR"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-400">
            <input type="checkbox" checked={s.requireApproval} onChange={(e) => setS({ ...s, requireApproval: e.target.checked })} />
            Require super admin approval before a new business goes live
          </label>
          <div className="flex items-center gap-3 pt-2">
            <PrimaryButton>Save settings</PrimaryButton>
            {saved && <span role="status" className="text-theme-sm text-success-600">Saved</span>}
          </div>
        </form>
      </Card>
    </>
  );
}
