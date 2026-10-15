"use client";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useAsync } from "@/hooks/useAsync";
import { getBusinessProfile, updateBusinessProfile } from "@/services/business";
import { Card, CardHeader, ErrorNote, PageHeader, PageLoading } from "@/components/saas/Card";
import { Field, inputCls, OutlineButton, PrimaryButton } from "@/components/saas/Form";
import { storePath, useStoreUrl } from "@/lib/store";

const CATEGORIES = ["Fashion & Textiles", "Food & Groceries", "Beauty & Wellness", "Crafts & Decor", "Coffee & Tea", "Jewellery", "Other"];

export default function StoreSettingsPage() {
  const { user } = useAuth();
  const bid = user!.businessId!;
  const { data, loading, error, reload } = useAsync(() => getBusinessProfile(bid), [bid]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const url = useStoreUrl(data?.slug);

  if (loading) return <PageLoading />;
  if (error || !data) return <ErrorNote message={error ?? "Could not load settings."} onRetry={reload} />;

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name")).trim();
    if (!name) return setFormError("Store name is required.");
    setSaving(true);
    setFormError(null);
    try {
      await updateBusinessProfile(bid, {
        name,
        category: String(f.get("category")),
        description: String(f.get("description")).trim(),
        phone: String(f.get("phone")).trim(),
        country: String(f.get("country")).trim(),
        city: String(f.get("city")).trim(),
        brandColor: String(f.get("brandColor")),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not save settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader title="Store settings" subtitle="How your business appears to customers." />
      <Card className="mb-6 max-w-3xl">
        <CardHeader title="Your storefront" subtitle="Share this link with customers so they can shop with you." />
        <div className="space-y-3 p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-3">
            <code className="min-w-0 flex-1 truncate rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-700 dark:bg-white/5 dark:text-gray-300">
              {url || storePath(data.slug)}
            </code>
            <OutlineButton
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(url);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                } catch {
                  /* clipboard unavailable */
                }
              }}
            >
              {copied ? "Copied" : "Copy link"}
            </OutlineButton>
            <a
              href={storePath(data.slug)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600"
            >
              View store ↗
            </a>
          </div>
          {data.status !== "active" && data.status !== "trial" && (
            <p className="text-theme-sm text-warning-600">
              Your store is currently offline ({data.status}). It goes live once your account is active.
            </p>
          )}
        </div>
      </Card>
      <Card className="max-w-3xl">
        <CardHeader title="Business profile" subtitle="Shown on your storefront." />
        <form onSubmit={submit} className="space-y-4 p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Store name"><input name="name" defaultValue={data.name} className={inputCls} /></Field>
            <Field label="Category">
              <select name="category" defaultValue={data.category} className={inputCls}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Country"><input name="country" defaultValue={data.country} className={inputCls} /></Field>
            <Field label="City"><input name="city" defaultValue={data.city} className={inputCls} /></Field>
            <Field label="Phone"><input name="phone" defaultValue={data.phone} className={inputCls} /></Field>
            <Field label="Brand colour"><input name="brandColor" type="color" defaultValue={data.brandColor} className={`${inputCls} p-1`} /></Field>
          </div>
          <Field label="About your business"><textarea name="description" rows={4} defaultValue={data.description} className={`${inputCls} h-auto py-3`} /></Field>
          {formError && <ErrorNote message={formError} />}
          <div className="flex items-center gap-3 pt-2">
            <PrimaryButton busy={saving}>Save changes</PrimaryButton>
            {saved && <span role="status" className="text-theme-sm text-success-600">Saved</span>}
          </div>
        </form>
      </Card>
    </>
  );
}
