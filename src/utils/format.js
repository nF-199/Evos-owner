export const formatPrice = (value) =>
  new Intl.NumberFormat("uz-UZ").format(Math.round(Number(value) || 0)) + " so'm";

export const formatNumber = (value) =>
  new Intl.NumberFormat("uz-UZ").format(Math.round(Number(value) || 0));

// Grafik o'qlari uchun qisqa ko'rinish: 1 250 000 → 1.3 mln
export const formatCompact = (value) => {
  const n = Number(value) || 0;
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)} mln`;
  if (Math.abs(n) >= 1_000) return `${Math.round(n / 1_000)} ming`;
  return String(Math.round(n));
};

export const formatTime = (iso) =>
  iso ? new Date(iso).toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" }) : "—";

export const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("uz-UZ", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "—";

export const formatDateTime = (iso) => (iso ? `${formatDate(iso)} · ${formatTime(iso)}` : "—");

export const MONTHS_UZ = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr",
];
export const WEEKDAYS_UZ = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];

// Mahalliy vaqt bo'yicha YYYY-MM-DD (toISOString UTC ga surib yuboradi)
export const toDayKey = (value) => {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
};

export const isSameDay = (a, b) => toDayKey(a) === toDayKey(b);

export const startOfDay = (value) => {
  const d = new Date(value);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const addDays = (value, count) => {
  const d = new Date(value);
  d.setDate(d.getDate() + count);
  return d;
};

export const initialsOf = (user) =>
  `${user?.firstName?.[0] ?? "?"}${user?.lastName?.[0] ?? ""}`.toUpperCase();
