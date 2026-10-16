import type { PaymentMethod, SalesChannel } from "@/types/saas";

export const CHANNELS: { id: SalesChannel; label: string; hint: string }[] = [
  { id: "in_store", label: "In person", hint: "Shop, stall or market" },
  { id: "whatsapp", label: "WhatsApp", hint: "Chat orders" },
  { id: "instagram", label: "Instagram", hint: "DMs and comments" },
  { id: "phone", label: "Phone call", hint: "Ordered by phone" },
  { id: "other", label: "Other", hint: "Anywhere else" },
];

export const CHANNEL_LABELS: Record<SalesChannel, string> = {
  online: "Online store",
  in_store: "In person",
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  phone: "Phone call",
  other: "Other",
};

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  cod: "Pay on delivery",
  bank: "Bank transfer",
  card: "Card (demo)",
  cash: "Cash",
  pos: "POS / card machine",
};

/** Methods a merchant can pick when recording a sale themselves. */
export const RECORD_PAYMENT_METHODS: PaymentMethod[] = ["cash", "bank", "pos"];

export const channelOf = (o: { channel?: SalesChannel }): SalesChannel => o.channel ?? "online";
