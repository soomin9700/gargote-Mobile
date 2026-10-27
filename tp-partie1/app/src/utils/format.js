/** 6000 ou "6000.00"  ->  "6 000 Ar" */
export function formatAriary(montant) {
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(montant) + ' Ar';
}

/** "2026-10-25T09:30:00Z"  ->  "25/10/2026 12:30" (heure locale) */
export function formatDate(iso) {
  return new Date(iso).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' });
}
