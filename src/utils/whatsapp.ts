/**
 * Utility to open real WhatsApp chat via official wa.me / api.whatsapp.com URL
 */
export const openWhatsApp = (phone: string, message?: string) => {
  if (!phone) {
    alert('No phone number provided');
    return;
  }

  // Extract digits only
  let cleanDigits = phone.replace(/[^0-9]/g, '');

  if (!cleanDigits) {
    alert('Invalid phone number format');
    return;
  }

  // If 10 digits (standard Indian mobile format without +91), default to 91
  if (cleanDigits.length === 10) {
    cleanDigits = '91' + cleanDigits;
  }

  let waUrl = `https://wa.me/${cleanDigits}`;
  if (message && message.trim()) {
    waUrl += `?text=${encodeURIComponent(message.trim())}`;
  }

  // Open official WhatsApp link in new tab / WhatsApp app on mobile
  window.open(waUrl, '_blank', 'noopener,noreferrer');
};
