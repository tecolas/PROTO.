/** Brand contact details — single source of truth for every WhatsApp link. */
export const WHATSAPP_NUMBER = "5519982865594";
export const WHATSAPP_DISPLAY = "(19) 98286-5594";

export const whatsappLink = (message = "Olá! Vim pelo site da Jaguar Niche e gostaria de ajuda.") =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const openWhatsApp = (message?: string) => {
  window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
};
