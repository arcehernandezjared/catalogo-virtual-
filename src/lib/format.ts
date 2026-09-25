export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    minimumFractionDigits: price % 1 === 0 ? 0 : 2,
  }).format(price);
}

export function getDiscountPercent(price: number, originalPrice: number | null): number | null {
  if (!originalPrice || originalPrice <= price) return null;
  return Math.round((1 - price / originalPrice) * 100);
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const digits = phone.replace(/[^\d]/g, "");
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${digits}?text=${encoded}`;
}

export function productWhatsAppMessage(productName: string, price: number): string {
  return `Hola, me interesa el producto "${productName}" (${formatPrice(price)}). ¿Podrían darme más información?`;
}

export type CartLineItem = {
  name: string;
  price: number;
  quantity: number;
};

export function cartWhatsAppMessage(items: CartLineItem[]): string {
  const lines = items.map(
    (item) => `• ${item.quantity}x ${item.name} — ${formatPrice(item.price * item.quantity)}`
  );
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return [
    "Hola, quiero hacer un pedido con estos productos:",
    "",
    ...lines,
    "",
    `Total: ${formatPrice(total)}`,
    "",
    "¿Podrían confirmarme disponibilidad?",
  ].join("\n");
}
