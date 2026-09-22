import React, { useMemo, useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiRefreshCw,
  FiSearch,
  FiShoppingBag,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import { GiChefToque } from "react-icons/gi";
import { toast } from "react-toastify";
import PageHeader from "../components/PageHeader";
import { EmptyState, Loader } from "../components/Card";
import { useData } from "../context/DataContext";
import {
  ORDER_STATUSES,
  getOrderStatus,
  getPayment,
  getService,
  orderItemCount,
  orderTotal,
} from "../utils/domain";
import { formatDateTime, formatPrice, toDayKey } from "../utils/format";

const PAGE_SIZE = 12;

const PAYMENT_OPTIONS = [
  { id: "", label: "Barcha to'lov turi" },
  { id: "cash", label: "Naqd" },
  { id: "card", label: "Karta" },
];

const nextStatus = (statusId) => {
  const idx = ORDER_STATUSES.findIndex((s) => s.id === statusId);
  return idx >= 0 && idx < ORDER_STATUSES.length - 1 ? ORDER_STATUSES[idx + 1] : null;
};

const statusOf = (order) => order?.status || ORDER_STATUSES[0].id;

const paidAmount = (order) =>
  Number(
    order?.receivedCash ??
      order?.cashReceived ??
      order?.paid ??
      order?.cashPaid ??
      order?.given ??
      order?.cashGiven ??
      order?.amountPaid ??
      0
  );

const orderChange = (order) => {
  const due = Number(order?.changeDue);
  if (Number.isFinite(due) && due >= 0) return due;
  const paid = paidAmount(order);
  if (paid <= 0) return null;
  const change = paid - orderTotal(order);
  return change >= 0 ? change : null;
};

const cashierName = (order) => order?.workerName || order?.cashierName || order?.worker?.name || "";

const itemsSummary = (order) =>
  (order.items || []).map((i) => `${i.quantity}× ${i.name}`).join(", ");

const StatusBadge = ({ statusId }) => {
  const s = getOrderStatus(statusId);
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-extrabold ${s.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
};

const PaymentBadge = ({ method }) => {
  const m = getPayment(method);
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold ${m.badge}`}
    >
      {m.label}
    </span>
  );
};

const Orders = () => {
  const { orders, loading, refresh, updateItem, removeItem } = useData();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [payment, setPayment] = useState("");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const resetFilters = () => {
    setQuery("");
    setStatus("");
    setPayment("");
    setDate("");
    setPage(1);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = orders.filter((order) => {
      const st = statusOf(order);
      if (status && st !== status) return false;
      if (payment && order.paymentMethod !== payment) return false;
      if (date && toDayKey(order.createdAt) !== date) return false;
      if (q) {
        const haystack = [
          String(order.id),
          cashierName(order),
          order.cashierId,
          ...(order.items || []).map((i) => i.name),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [orders, query, status, payment, date]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const paged = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const handleMoveStatus = async (order) => {
    const next = nextStatus(statusOf(order));
    if (!next) return;
    setBusyId(order.id);
    try {
      await updateItem("orders", order.id, {
        status: next.id,
        updatedAt: new Date().toISOString(),
      });
      toast.success(`#${order.id} — ${next.label}`, { autoClose: 1500 });
    } catch {
      toast.error("Holatni yangilab bo'lmadi");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await removeItem("orders", deleteTarget.id);
      toast.success(`#${deleteTarget.id} buyurtma o'chirildi`, { autoClose: 1500 });
      setDeleteTarget(null);
      if (selected?.id === deleteTarget.id) setSelected(null);
    } catch {
      toast.error("Buyurtmani o'chirib bo'lmadi");
    }
  };

  const renderToolbar = (
    <div className="mb-4 grid grid-cols-1 gap-2 rounded-[var(--radius-box)] border border-base-300/70 bg-base-100 p-3 shadow-sm md:grid-cols-2 xl:grid-cols-4">
      <label className="flex items-center gap-2 rounded-[var(--radius-field)] border border-base-300/80 bg-base-100 px-3 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
        <FiSearch className="shrink-0 text-base-content/35" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder="ID, kassir yoki taom..."
          className="input input-sm h-10 w-full border-0 bg-transparent px-0 focus:outline-none"
        />
      </label>
      <select
        value={status}
        onChange={(e) => {
          setStatus(e.target.value);
          setPage(1);
        }}
        className="select select-sm h-10 w-full rounded-[var(--radius-field)] border border-base-300/80 text-sm font-semibold focus:border-primary"
      >
        <option value="">Barcha holat</option>
        {ORDER_STATUSES.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </select>
      <select
        value={payment}
        onChange={(e) => {
          setPayment(e.target.value);
          setPage(1);
        }}
        className="select select-sm h-10 w-full rounded-[var(--radius-field)] border border-base-300/80 text-sm font-semibold focus:border-primary"
      >
        {PAYMENT_OPTIONS.map((p) => (
          <option key={p.id} value={p.id}>
            {p.label}
          </option>
        ))}
      </select>
      <input
        type="date"
        value={date}
        onChange={(e) => {
          setDate(e.target.value);
          setPage(1);
        }}
        className="input input-sm h-10 w-full rounded-[var(--radius-field)] border border-base-300/80 text-sm font-semibold focus:border-primary"
      />
    </div>
  );

  const renderTable = (
    <div className="overflow-x-auto rounded-[var(--radius-box)] border border-base-300/70 bg-base-100 shadow-sm">
      <table className="table">
        <thead className="table-sticky">
          <tr className="text-[10px] uppercase tracking-[0.18em] text-base-content/40">
            <th>ID</th>
            <th>Kassir</th>
            <th>Tarkib</th>
            <th>Holat</th>
            <th>To'lov</th>
            <th className="text-right">Summa</th>
            <th>Sana</th>
            <th className="text-right">Amallar</th>
          </tr>
        </thead>
        <tbody>
          {paged.map((order) => {
            const st = getOrderStatus(statusOf(order));
            const next = nextStatus(statusOf(order));
            const change = orderChange(order);
            return (
              <tr
                key={order.id}
                onClick={() => setSelected(order)}
                className="cursor-pointer transition-colors hover:bg-base-200/50"
              >
                <td>
                  <span className="font-mono text-sm font-bold tracking-tight">#{order.id}</span>
                  <p className="text-[10px] text-base-content/40">{formatDateTime(order.createdAt)}</p>
                </td>
                <td>
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/15 to-secondary/15 text-[10px] font-black text-primary">
                      {(cashierName(order) || "?").slice(0, 2).toUpperCase()}
                    </span>
                    {cashierName(order) || "—"}
                  </span>
                </td>
                <td>
                  <p className="max-w-[220px] truncate text-sm font-medium text-base-content/75">
                    {itemsSummary(order) || "—"}
                  </p>
                  <p className="mt-0.5 text-[10px] font-bold text-base-content/35">
                    {orderItemCount(order)} ta mahsulot · {order.serviceType ? getService(order.serviceType).label : "—"}
                  </p>
                </td>
                <td>
                  <div className="flex items-center gap-1.5">
                    <StatusBadge statusId={statusOf(order)} />
                    {next && (
                      <button
                        type="button"
                        title={`Keyingi holat: ${next.label}`}
                        disabled={busyId === order.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveStatus(order);
                        }}
                        className="btn btn-ghost btn-xs h-6 min-h-0 w-6 rounded-lg p-0 text-base-content/40 hover:bg-base-200"
                      >
                        {busyId === order.id ? (
                          <span className="loading loading-spinner loading-xs text-primary" />
                        ) : (
                          <FiChevronRight className="text-sm" />
                        )}
                      </button>
                    )}
                  </div>
                  <p className="mt-0.5 text-[10px] font-semibold text-base-content/30">
                    {order.cookedByName ? `${order.cookedByName}` : st.label}
                  </p>
                </td>
                <td>
                  <PaymentBadge method={order.paymentMethod} />
                </td>
                <td className="text-right">
                  <p className="nums text-sm font-black tabular-nums">{formatPrice(orderTotal(order))}</p>
                  {change != null && (
                    <p className="mt-0.5 text-[10px] font-semibold text-success">Qaytim {formatPrice(change)}</p>
                  )}
                </td>
                <td className="text-sm font-semibold text-base-content/60">
                  {order.cookedByName ? formatDateTime(order.cookedAt) : formatDateTime(order.createdAt)}
                </td>
                <td>
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      title="Batafsil"
                      onClick={() => setSelected(order)}
                      className="btn btn-ghost btn-xs h-7 min-h-0 w-7 rounded-lg p-0 text-base-content/45 hover:bg-primary/10 hover:text-primary"
                    >
                      <FiEye className="text-sm" />
                    </button>
                    <button
                      type="button"
                      title="O'chirish"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(order);
                      }}
                      className="btn btn-ghost btn-xs h-7 min-h-0 w-7 rounded-lg p-0 text-base-content/45 hover:bg-error/10 hover:text-error"
                    >
                      <FiTrash2 className="text-sm" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const renderPagination = (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <p className="text-xs font-semibold text-base-content/45">
        Jami {filtered.length} ta · sahifa {current}/{pageCount}
      </p>
      <div className="join">
        <button
          type="button"
          disabled={current <= 1}
          onClick={() => setPage(current - 1)}
          className="btn join-item btn-sm bg-base-100 font-bold shadow-sm disabled:opacity-40"
        >
          <FiChevronLeft />
        </button>
        <span className="join-item btn btn-sm btn-ghost cursor-default bg-base-100 font-black">
          {current}
        </span>
        <button
          type="button"
          disabled={current >= pageCount}
          onClick={() => setPage(current + 1)}
          className="btn join-item btn-sm bg-base-100 font-bold shadow-sm disabled:opacity-40"
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );

  const renderDetail = selected && (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-base-content/30 p-4 backdrop-blur-sm"
      onClick={() => setSelected(null)}
    >
      <div
        className="rise-in w-full max-w-lg overflow-hidden rounded-[var(--radius-box)] border border-base-300 bg-base-100 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-base-300/60 px-5 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-lg font-black tracking-tight">#{selected.id}</span>
            <StatusBadge statusId={statusOf(selected)} />
          </div>
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="btn btn-ghost btn-sm btn-circle text-base-content/45 hover:bg-base-200"
            aria-label="Yopish"
          >
            <FiX />
          </button>
        </div>

        <div className="scrollbar-thin max-h-[62vh] overflow-y-auto p-5">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div className="rounded-2xl bg-base-200/70 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wide text-base-content/40">Kassir</p>
              <p className="mt-1 truncate text-sm font-bold">{cashierName(selected) || "—"}</p>
            </div>
            <div className="rounded-2xl bg-base-200/70 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wide text-base-content/40">Sana</p>
              <p className="mt-1 text-sm font-bold">{formatDateTime(selected.createdAt)}</p>
            </div>
            <div className="rounded-2xl bg-base-200/70 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wide text-base-content/40">Xizmat</p>
              <p className="mt-1 text-sm font-bold">
                {selected.serviceType ? getService(selected.serviceType).label : "—"}
              </p>
            </div>
            <div className="rounded-2xl bg-base-200/70 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wide text-base-content/40">To'lov</p>
              <p className="mt-1 text-sm font-bold">{getPayment(selected.paymentMethod).label}</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-base-content/40">
              Tarkib · {orderItemCount(selected)} ta mahsulot
            </p>
            <ul className="space-y-1.5">
              {(selected.items || []).map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2.5 rounded-xl border border-base-300/50 bg-base-100 px-3 py-2 text-sm"
                >
                  <span className="flex h-5 min-w-6 items-center justify-center rounded-md bg-primary/10 px-1 text-[10px] font-black tabular-nums text-primary">
                    {item.quantity}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-semibold">{item.name}</span>
                  <span className="nums shrink-0 font-bold tabular-nums text-base-content/60">
                    {formatPrice(item.totalPrice ?? item.price)}
                  </span>
                </li>
              ))}
              {(selected.items || []).length === 0 && (
                <li className="text-sm text-base-content/40">Tarkib ma'lum emas</li>
              )}
            </ul>
          </div>

          <div className="mt-4 space-y-2 rounded-2xl border border-dashed border-base-300 bg-base-200/40 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-base-content/55">To'langan</span>
              <span className="nums font-black tabular-nums">{formatPrice(paidAmount(selected))}</span>
            </div>
            {orderChange(selected) != null && (
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-success/70">Qaytim</span>
                <span className="nums font-black tabular-nums text-success">
                  {formatPrice(orderChange(selected))}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between border-t border-base-300/70 pt-2 text-base">
              <span className="font-extrabold">Jami</span>
              <span className="nums font-black tabular-nums text-primary">
                {formatPrice(orderTotal(selected))}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 font-semibold text-base-content/55">
                <GiChefToque className="text-base" />
                Oshpaz
              </span>
              <span className="font-bold">{selected.cookedByName || "—"}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-base-300/60 px-5 py-4">
          {nextStatus(statusOf(selected)) && (
            <button
              type="button"
              disabled={busyId === selected.id}
              onClick={() => handleMoveStatus(selected)}
              className="btn btn-primary btn-sm h-10 flex-1 gap-2 rounded-xl font-bold text-primary-content shadow-md shadow-primary/25"
            >
              {busyId === selected.id ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <FiChevronRight className="text-sm" />
              )}
              Keyingi holat: {nextStatus(statusOf(selected)).label}
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setSelected(null);
              setDeleteTarget(selected);
            }}
            className="btn btn-ghost btn-sm h-10 gap-2 rounded-xl border border-base-300 font-bold text-error hover:bg-error/10"
          >
            <FiTrash2 className="text-sm" />
            O'chirish
          </button>
        </div>
      </div>
    </div>
  );

  const renderDeleteConfirm = deleteTarget && (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-base-content/30 p-4 backdrop-blur-sm"
      onClick={() => setDeleteTarget(null)}
    >
      <div
        className="rise-in w-full max-w-sm overflow-hidden rounded-[var(--radius-box)] border border-base-300 bg-base-100 p-5 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-error/10 text-2xl text-error">
          <FiTrash2 />
        </div>
        <h3 className="mt-4 text-lg font-extrabold tracking-tight">Buyurtmani o'chirish</h3>
        <p className="mt-1.5 text-sm text-base-content/50">
          <span className="font-mono font-bold text-base-content/80">#{deleteTarget.id}</span>{" "}
          buyurtma butunlay o'chiriladi. Bu amalni ortga qaytarib bo'lmaydi.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setDeleteTarget(null)}
            className="btn btn-ghost h-11 rounded-xl border border-base-300 font-bold text-base-content/70"
          >
            Bekor qilish
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="btn h-11 rounded-xl bg-error font-bold text-error-content shadow-md shadow-error/20"
          >
            O'chirish
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        eyebrow="Savdo"
        title="Buyurtmalar"
        subtitle="Barcha buyurtmalar tarixi, holati va tarkibi"
        actions={
          <button
            type="button"
            onClick={() => refresh()}
            disabled={loading}
            className="btn btn-outline btn-sm h-10 gap-2 rounded-xl border-base-300 px-4 font-bold shadow-sm hover:border-primary hover:bg-primary hover:text-primary-content"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            Yangilash
          </button>
        }
      />

      {renderToolbar}

      {loading && orders.length === 0 ? (
        <Loader text="Buyurtmalar yuklanmoqda..." />
      ) : orders.length === 0 ? (
        <div className="rounded-[var(--radius-box)] border border-base-300/70 bg-base-100 shadow-sm">
          <EmptyState
            icon={FiShoppingBag}
            title="Hali buyurtma yo'q"
            text="Kassa ilovasida buyurtma qabul qilinishi bilan shu yerda paydo bo'ladi."
          />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-[var(--radius-box)] border border-base-300/70 bg-base-100 shadow-sm">
          <EmptyState
            icon={FiSearch}
            title="Buyurtma topilmadi"
            text="Filtrga mos keladigan buyurtma yo'q. Filtr shartlarini o'zgartiring."
            action={
              <button
                type="button"
                onClick={resetFilters}
                className="btn btn-outline btn-sm rounded-xl border-base-300 font-bold hover:border-primary hover:bg-primary hover:text-primary-content"
              >
                Filtrni tozalash
              </button>
            }
          />
        </div>
      ) : (
        <>
          {renderTable}
          {renderPagination}
        </>
      )}

      {renderDetail}
      {renderDeleteConfirm}
    </div>
  );
};

export default Orders;