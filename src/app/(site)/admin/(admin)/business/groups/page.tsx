"use client";
import { useConfirm } from "@/components/ui/confirm";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { useAsync } from "@/hooks/useAsync";
import { useBizCurrency, useBizMoney } from "@/hooks/useBizMoney";
import { deleteGroup, listCustomers, listGroups, RULE_LABELS, saveGroup, type GroupWithCount } from "@/services/business";
import { Card, EmptyState, ErrorNote, PageHeader, PageLoading } from "@/components/saas/Card";
import { Field, inputCls, OutlineButton, PrimaryButton } from "@/components/saas/Form";
import { Modal } from "@/components/ui/modal";
import type { GroupRuleType } from "@/types/saas";

export default function GroupsPage() {
  const { user } = useAuth();
  const confirm = useConfirm();
  const bid = user!.businessId!;
  const fmt = useBizMoney();
  const currency = useBizCurrency();
  const { data, loading, error, reload } = useAsync(async () => {
    const [groups, customers] = await Promise.all([listGroups(bid), listCustomers(bid)]);
    return { groups, customers };
  }, [bid]);
  const [editing, setEditing] = useState<GroupWithCount | "new" | null>(null);
  const [kind, setKind] = useState<"manual" | "auto">("auto");
  const [ruleType, setRuleType] = useState<GroupRuleType>("spent_over");
  const [members, setMembers] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (data?.customers ?? []).filter((c) => !q || `${c.name} ${c.email}`.toLowerCase().includes(q));
  }, [data, search]);

  if (loading) return <PageLoading />;
  if (error || !data) return <ErrorNote message={error ?? "Could not load groups."} onRetry={reload} />;

  const open = (g: GroupWithCount | "new") => {
    setFormError(null);
    setSearch("");
    if (g === "new") {
      setKind("auto");
      setRuleType("spent_over");
      setMembers(new Set());
    } else {
      setKind(g.kind);
      setRuleType(g.rule?.type ?? "spent_over");
      setMembers(new Set(g.memberIds));
    }
    setEditing(g);
  };

  const describe = (g: GroupWithCount) =>
    g.kind === "manual"
      ? "Hand-picked members"
      : g.rule
        ? `${RULE_LABELS[g.rule.type].replace(/ \(.*\)$/, "")} ${g.rule.type === "spent_over" ? fmt(g.rule.value) : g.rule.value}${g.rule.type === "orders_at_least" ? " orders" : g.rule.type.endsWith("days") ? " days" : ""}`
        : "";

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setSaving(true);
    setFormError(null);
    try {
      await saveGroup(bid, editing && editing !== "new" ? editing.id : null, {
        name: String(f.get("name")),
        description: String(f.get("description")),
        kind,
        rule: kind === "auto" ? { type: ruleType, value: Number(f.get("ruleValue")) } : undefined,
        memberIds: Array.from(members),
      });
      setEditing(null);
      reload();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not save group.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (g: GroupWithCount) => {
    if (!(await confirm({ title: `Delete the group "${g.name}"?`, message: "The customers in it are not deleted.", confirmLabel: "Delete group", tone: "danger" }))) return;
    await deleteGroup(bid, g.id);
    reload();
  };

  const g = editing && editing !== "new" ? editing : null;

  return (
    <>
      <PageHeader title="Customer groups" subtitle="Segment your customers so you can message the right people." action={<PrimaryButton onClick={() => open("new")}>+ New group</PrimaryButton>} />
      {data.groups.length === 0 ? (
        <Card><EmptyState title="No groups yet" body="Create a group, like your best customers or wholesale buyers, then send them a message." /></Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.groups.map((x) => (
            <Card key={x.id} className="flex flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">{x.name}</h2>
                <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-0.5 text-theme-xs font-medium text-gray-600 dark:bg-white/10 dark:text-gray-300">{x.kind === "auto" ? "Automatic" : "Manual"}</span>
              </div>
              {x.description && <p className="mt-1 text-theme-sm text-gray-500">{x.description}</p>}
              <p className="mt-4 text-3xl font-semibold text-gray-800 dark:text-white/90">{x.memberCount}<span className="ml-1.5 text-theme-sm font-normal text-gray-500">{x.memberCount === 1 ? "customer" : "customers"}</span></p>
              <p className="mt-1 text-theme-xs text-gray-500">{describe(x)}</p>
              <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 text-theme-sm font-medium dark:border-gray-800">
                <Link href={`/admin/business/messages?group=${x.id}`} className="text-brand-500 hover:text-brand-600">Message group</Link>
                <div className="flex gap-4">
                  <button className="text-gray-600 hover:text-gray-800 dark:text-gray-400" onClick={() => open(x)}>Edit</button>
                  <button className="text-error-600 hover:text-error-700" onClick={() => remove(x)}>Delete</button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={editing !== null} onClose={() => setEditing(null)} className="max-w-[560px] p-6 sm:p-8 m-4 max-h-[92vh] overflow-y-auto">
        {editing && (
          <form onSubmit={submit} className="space-y-4" key={g?.id ?? "new"}>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">{g ? "Edit group" : "New group"}</h3>
            <Field label="Name"><input name="name" defaultValue={g?.name} placeholder="e.g. Best customers" className={inputCls} /></Field>
            <Field label="Description (optional)"><input name="description" defaultValue={g?.description} className={inputCls} /></Field>
            <div role="radiogroup" aria-label="Group type" className="grid grid-cols-2 gap-2">
              {([["auto", "Automatic", "Fills itself from a rule"], ["manual", "Manual", "You pick the customers"]] as const).map(([k, t, h]) => (
                <button key={k} type="button" role="radio" aria-checked={kind === k} onClick={() => setKind(k)} className={`rounded-xl border p-3 text-left ${kind === k ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10" : "border-gray-200 dark:border-gray-700"}`}>
                  <span className="block text-theme-sm font-medium text-gray-800 dark:text-white/90">{t}</span>
                  <span className="block text-theme-xs text-gray-500">{h}</span>
                </button>
              ))}
            </div>
            {kind === "auto" ? (
              <div className="grid grid-cols-[1fr_130px] gap-3">
                <Field label="Rule">
                  <select value={ruleType} onChange={(e) => setRuleType(e.target.value as GroupRuleType)} className={inputCls}>
                    {(Object.keys(RULE_LABELS) as GroupRuleType[]).map((r) => <option key={r} value={r}>{RULE_LABELS[r]}</option>)}
                  </select>
                </Field>
                <Field label={ruleType === "spent_over" ? `Amount (${currency})` : "Number"}>
                  <input name="ruleValue" type="number" min="0" defaultValue={g?.rule?.type === ruleType ? g.rule.value : ruleType === "spent_over" ? 100 : 3} className={inputCls} />
                </Field>
              </div>
            ) : (
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <input aria-label="Search customers" placeholder="Search customers…" value={search} onChange={(e) => setSearch(e.target.value)} className={inputCls} />
                  <span className="shrink-0 text-theme-sm text-gray-500">{members.size} selected</span>
                </div>
                <ul className="max-h-56 divide-y divide-gray-100 overflow-y-auto rounded-xl border border-gray-200 dark:divide-gray-800 dark:border-gray-700">
                  {shown.length === 0 && <li className="p-4 text-center text-theme-sm text-gray-500">No customers found.</li>}
                  {shown.map((c) => (
                    <li key={c.id}>
                      <label className="flex cursor-pointer items-center gap-3 px-4 py-2.5">
                        <input
                          type="checkbox"
                          checked={members.has(c.id)}
                          onChange={(e) => setMembers((s) => { const n = new Set(s); e.target.checked ? n.add(c.id) : n.delete(c.id); return n; })}
                        />
                        <span className="min-w-0">
                          <span className="block truncate text-theme-sm text-gray-800 dark:text-white/90">{c.name}</span>
                          <span className="block truncate text-theme-xs text-gray-500">{c.email}</span>
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {formError && <ErrorNote message={formError} />}
            <div className="flex justify-end gap-3 pt-2">
              <OutlineButton type="button" onClick={() => setEditing(null)}>Cancel</OutlineButton>
              <PrimaryButton busy={saving}>Save group</PrimaryButton>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
