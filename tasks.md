# Owner paneli — vazifalar

Skelet tayyor: login, private route, sidebar + outlet, route'lar va bo'sh sahifalar.
Endi har bir sahifaning ichi to'ldiriladi.

## Taqsimot

| # | Sahifa | Fayl | Mas'ul | Holat |
|---|--------|------|--------|-------|
| 1 | Buyurtmalar | `src/pages/Orders.jsx` | **Alisher** | Ishlanmoqda |
| 2 | Dashboard | `src/pages/Dashboard.jsx` | — | Kutilmoqda |
| 3 | Taomlar | `src/pages/Foods.jsx` | — | Kutilmoqda |
| 4 | Kategoriyalar | `src/pages/Categories.jsx` | **Alijon** | Ishlanmoqda |
| 5 | Xodimlar | `src/pages/Workers.jsx` | — | Kutilmoqda |
| 6 | Hamyon | `src/pages/Wallet.jsx` | — | Kutilmoqda |
| 7 | Kalendar | `src/pages/Calendar.jsx` | — | Kutilmoqda |

## T-001 — Orders page (Alisher)

**Fayl:** `src/pages/Orders.jsx` · **Route:** `/orders`

Kerak bo'ladigan narsalar:

- Ma'lumot: `useData()` → `orders` (`src/context/DataContext.jsx`).
  Qo'shimcha so'rov yozish shart emas, kontekst 15 soniyada bir yangilab turadi.
- O'zgartirish/o'chirish: shu kontekstdagi `updateItem("orders", id, body)` va
  `removeItem("orders", id)`.
- Yordamchilar: `src/utils/domain.js` — `ORDER_STATUSES`, `getOrderStatus`,
  `getPayment`, `getService`, `orderTotal`, `orderItemCount`;
  `src/utils/format.js` — `formatPrice`, `formatDateTime`, `toDayKey`.
- UI bloklari: `src/components/Card.jsx` (`Card`, `EmptyState`, `Loader`),
  `src/components/PageHeader.jsx`.

Nimalar bo'lishi kerak:

- [ ] Buyurtmalar jadvali: ID, kassir, tarkib, holat, to'lov turi, summa, sana
- [ ] Filtr: qidiruv (ID / kassir / taom), holat, to'lov turi, sana
- [ ] Saralash: yangi buyurtma tepada
- [ ] Sahifalash (12 tadan)
- [ ] Buyurtma tafsiloti modali: tarkibi, jami summa, qaytim, oshpaz
- [ ] Holatni o'zgartirish: Yangi → Tayyorlanmoqda → Tayyor
- [ ] Buyurtmani o'chirish (tasdiqlash oynasi bilan)
- [ ] Bo'sh holat: filtrga mos buyurtma topilmasa

## T-002 — Categories page (Alijon)

**Fayl:** `src/pages/Categories.jsx` · **Route:** `/categories`

Kerak bo'ladigan narsalar:

- Ma'lumot: `useData()` → `categories` va `products`
  (har bir kategoriyada nechta taom borligini sanash uchun).
- CRUD: `createItem("categories", body)`, `updateItem("categories", id, body)`,
  `removeItem("categories", id)`.
- Yozuv tuzilmasi (`server/db.json`):
  `{ id, slug, name, description, icon, color, order, isActive }`
- Yordamchilar: `src/utils/domain.js` — `getCategoryIcon`, `CATEGORY_ICON_KEYS`,
  `getCategoryColor`, `CATEGORY_COLOR_KEYS`.
- UI bloklari: `src/components/Card.jsx`, `src/components/PageHeader.jsx`.

Nimalar bo'lishi kerak:

- [ ] Kategoriyalar kartochka ko'rinishida: ikonka, nomi, tavsifi, taomlar soni
- [ ] Qidiruv va aktiv/noaktiv bo'yicha filtr
- [ ] Qo'shish modali: nomi, slug, tavsif, ikonka tanlash, rang tanlash
- [ ] Tahrirlash modali (shu formaning o'zi)
- [ ] O'chirish (tasdiqlash oynasi bilan)
- [ ] Ichida taomi bor kategoriyani o'chirishdan oldin ogohlantirish
- [ ] `isActive` ni tez yoqib-o'chirish (toggle)
- [ ] Bo'sh holat

**Diqqat:** `slug` kassa va oshxona ilovalari bilan bog'langan —
taomdagi `category` maydoni aynan shu `slug` ga tayanadi. Mavjud slug'ni
o'zgartirmaslik kerak, aks holda menyu buziladi.


## Kelishuvlar

- Uslub cooker/cashier ilovalari bilan bir xil: daisyUI + `index.css` dagi palitra
- Matnlar o'zbekcha (lotin), kod va commit inglizcha
- Yangi sahifa yozganda `Placeholder` ni olib tashlab, o'rniga kontent qo'yiladi
- API: `http://localhost:3000` (json-server, `server/db.json`)
