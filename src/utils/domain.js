import {
  GiSandwich, GiKebabSpit, GiHamburger, GiHotDog,
  GiFrenchFries, GiSodaCan, GiCupcake, GiKnifeFork,
} from "react-icons/gi";

export const ORDER_STATUSES = [
  { id: "pending", label: "Yangi", badge: "bg-info/15 text-info", dot: "bg-info" },
  { id: "preparing", label: "Tayyorlanmoqda", badge: "bg-warning/25 text-warning-content", dot: "bg-warning" },
  { id: "ready", label: "Tayyor", badge: "bg-success/15 text-success", dot: "bg-success" },
];

export const getOrderStatus = (id) =>
  ORDER_STATUSES.find((s) => s.id === id) || ORDER_STATUSES[0];

export const PAYMENT_METHODS = {
  cash: { label: "Naqd", badge: "bg-success/15 text-success" },
  card: { label: "Karta", badge: "bg-info/15 text-info" },
};
export const getPayment = (id) =>
  PAYMENT_METHODS[id] ?? { label: id ?? "—", badge: "bg-base-200 text-base-content/60" };

export const SERVICE_TYPES = {
  "dine-in": { label: "Shu yerda" },
  takeaway: { label: "Olib ketish" },
};
export const getService = (id) => SERVICE_TYPES[id] ?? { label: id ?? "—" };

export const ROLES = [
  { id: "owner", label: "Egasi", badge: "bg-primary/10 text-primary" },
  { id: "cashier", label: "Kassir", badge: "bg-info/15 text-info" },
  { id: "cooker", label: "Oshpaz", badge: "bg-warning/25 text-warning-content" },
];
export const getRole = (id) =>
  ROLES.find((r) => r.id === id) ?? { id, label: id ?? "—", badge: "bg-base-200 text-base-content/60" };

export const CATEGORY_ICONS = {
  GiSandwich, GiKebabSpit, GiHamburger, GiHotDog,
  GiFrenchFries, GiSodaCan, GiCupcake, GiKnifeFork,
};
export const getCategoryIcon = (key) => CATEGORY_ICONS[key] ?? GiKnifeFork;
export const CATEGORY_ICON_KEYS = Object.keys(CATEGORY_ICONS);

// Kategoriya rangi — daisyUI semantik ranglariga bog'langan
export const CATEGORY_COLORS = {
  primary: { chip: "bg-primary/10 text-primary", fill: "bg-primary", hex: "#e2603a" },
  secondary: { chip: "bg-secondary/15 text-secondary", fill: "bg-secondary", hex: "#c8362c" },
  accent: { chip: "bg-accent/25 text-accent-content", fill: "bg-accent", hex: "#e0a23c" },
  info: { chip: "bg-info/15 text-info", fill: "bg-info", hex: "#6d5bd0" },
  success: { chip: "bg-success/15 text-success", fill: "bg-success", hex: "#3f9d68" },
  warning: { chip: "bg-warning/25 text-warning-content", fill: "bg-warning", hex: "#d99b25" },
  error: { chip: "bg-error/15 text-error", fill: "bg-error", hex: "#d4453c" },
};
export const CATEGORY_COLOR_KEYS = Object.keys(CATEGORY_COLORS);
export const getCategoryColor = (key) => CATEGORY_COLORS[key] ?? CATEGORY_COLORS.primary;

export const EXPENSE_TYPES = [
  { id: "rent", label: "Ijara", chip: "bg-secondary/15 text-secondary" },
  { id: "salary", label: "Oylik", chip: "bg-info/15 text-info" },
  { id: "supply", label: "Xarid", chip: "bg-primary/10 text-primary" },
  { id: "utility", label: "Kommunal", chip: "bg-warning/25 text-warning-content" },
  { id: "marketing", label: "Reklama", chip: "bg-accent/25 text-accent-content" },
  { id: "other", label: "Boshqa", chip: "bg-base-200 text-base-content/60" },
];
export const getExpenseType = (id) =>
  EXPENSE_TYPES.find((t) => t.id === id) ?? EXPENSE_TYPES[EXPENSE_TYPES.length - 1];

export const orderTotal = (order) =>
  Number(order?.total) ||
  (order?.items ?? []).reduce((sum, i) => sum + (Number(i.totalPrice) || 0), 0);

export const orderItemCount = (order) =>
  (order?.items ?? []).reduce((sum, i) => sum + (Number(i.quantity) || 0), 0);
