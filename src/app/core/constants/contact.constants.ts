export const WHATSAPP_NUMBER = '3163202647';
export const WHATSAPP_DISPLAY_NUMBER = '3163202647';

export function buildWhatsAppUrl(message?: string): string {
  const baseUrl = `https://wa.me/57${WHATSAPP_NUMBER}`;

  if (!message) {
    return baseUrl;
  }

  return `${baseUrl}?text=${encodeURIComponent(message)}`;
}
