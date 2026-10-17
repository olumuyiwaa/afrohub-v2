/** wa.me link for a phone number, or null when it isn't usable (needs an international number). */
export function whatsappLink(phone?: string, text?: string): string | null {
  const digits = (phone ?? "").replace(/[^\d]/g, "");
  if (digits.length < 8) return null;
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}
