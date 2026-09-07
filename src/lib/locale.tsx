import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Locale = "en" | "vn";

type Dictionary = Record<string, { en: string; vn: string }>;

const copy: Dictionary = {
  brand: { en: "CoHai Travel", vn: "CoHai Travel" },
  tagline: { en: "Vietnam, Cambodia, Thailand — paced properly.", vn: "Việt Nam, Campuchia, Thái Lan — đúng nhịp." },
  journeys: { en: "Journeys", vn: "Hành trình" },
  places: { en: "Places", vn: "Điểm đến" },
  stays: { en: "Stays", vn: "Lưu trú" },
  cars: { en: "Cars", vn: "Xe" },
  contact: { en: "Contact", vn: "Liên hệ" },
  search: { en: "Search", vn: "Tìm" },
  account: { en: "My trips", vn: "Chuyến của tôi" },
  signIn: { en: "Sign in", vn: "Đăng nhập" },
  currency: { en: "AUD", vn: "AUD" },
  from: { en: "From", vn: "Từ" },
  perPerson: { en: "per person", vn: "mỗi khách" },
  perNight: { en: "per night", vn: "mỗi đêm" },
  perDay: { en: "per day", vn: "mỗi ngày" },
  days: { en: "days", vn: "ngày" },
  book: { en: "Book this departure", vn: "Đặt chuyến này" },
  bookStay: { en: "Book this stay", vn: "Đặt phòng" },
  bookCar: { en: "Book this car", vn: "Đặt xe" },
  more: { en: "Read the itinerary", vn: "Xem lịch trình" },
  nature: { en: "Nature", vn: "Thiên nhiên" },
  beach: { en: "Coast", vn: "Biển" },
  unesco: { en: "UNESCO", vn: "UNESCO" },
  allJourneys: { en: "All journeys", vn: "Mọi hành trình" },
  heroKicker: { en: "Private departures from Australia", vn: "Chuyến riêng từ Úc" },
  heroTitle: { en: "An atlas of the east, written slowly.", vn: "Một tập bản đồ phía đông, viết chậm." },
  heroBody: {
    en: "CoHai plans small journeys through Vietnam and its neighbours. Karst nights, terrace walks, lantern towns — booked in Australian dollars, with live seats.",
    vn: "CoHai sắp những chuyến nhỏ qua Việt Nam và lân bang. Đêm đá vôi, đi ruộng, phố đèn lồng — giá AUD, còn chỗ thật.",
  },
  searchCta: { en: "Look up a date", vn: "Tìm ngày" },
  chaptersKicker: { en: "Three chapters", vn: "Ba chương" },
  partners: { en: "Also the neighbours", vn: "Cả lân bang" },
  operator: { en: "A house in Hanoi, a desk in Melbourne.", vn: "Một nhà ở Hà Nội, một bàn ở Melbourne." },
  footerNote: {
    en: "CoHai Travel. Journeys in AUD. Live departures, no mystery inventory.",
    vn: "CoHai Travel. Hành trình tính AUD. Ngày khởi hành thật.",
  },
  guests: { en: "Guests", vn: "Khách" },
  nights: { en: "Nights", vn: "Đêm" },
  name: { en: "Name", vn: "Tên" },
  firstName: { en: "First name", vn: "Tên" },
  lastName: { en: "Last name", vn: "Họ" },
  email: { en: "Email", vn: "Email" },
  phone: { en: "Phone", vn: "Điện thoại" },
  notes: { en: "Notes for the desk", vn: "Ghi chú cho bàn" },
  confirm: { en: "Confirm booking", vn: "Xác nhận đặt" },
  needSignIn: { en: "Sign in to hold a seat.", vn: "Đăng nhập để giữ chỗ." },
  seatsLeft: { en: "seats left", vn: "chỗ còn" },
  soldOut: { en: "Hold is full", vn: "Hết chỗ" },
  departure: { en: "Departure", vn: "Khởi hành" },
  send: { en: "Send to the desk", vn: "Gửi bàn" },
  message: { en: "Message", vn: "Tin nhắn" },
  contactLead: {
    en: "A human reads this. Tell us dates, pace, and who is travelling.",
    vn: "Người thật đọc. Nói ngày, nhịp, và ai đi.",
  },
  thanks: { en: "Received. We will write back.", vn: "Đã nhận. Chúng tôi sẽ viết lại." },
  booked: { en: "Held. A confirmation sits in My trips.", vn: "Đã giữ. Xem trong Chuyến của tôi." },
  emptyTrips: { en: "No bookings yet.", vn: "Chưa có đặt chỗ." },
  searchPlaceholder: { en: "Place, journey, stay…", vn: "Điểm đến, hành trình…" },
  noResults: { en: "Nothing on that line. Try another word or chapter.", vn: "Không khớp. Thử từ khác." },
  seats: { en: "seats", vn: "chỗ" },
  pickup: { en: "Pickup", vn: "Đón" },
  start: { en: "Start date", vn: "Ngày bắt đầu" },
  signInLead: { en: "Hold seats, stays, and cars under your name.", vn: "Giữ chỗ, phòng, xe dưới tên bạn." },
};

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: keyof typeof copy) => string;
};

const LocaleContext = createContext<Ctx | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem("cohai-locale");
    if (saved === "en" || saved === "vn") setLocaleState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "vn" ? "vi" : "en";
  }, [locale]);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    window.localStorage.setItem("cohai-locale", l);
  };

  const value = useMemo<Ctx>(
    () => ({
      locale,
      setLocale,
      t: (key) => copy[key][locale],
    }),
    [locale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useI18n must be used within LocaleProvider");
  return ctx;
}

export function field<T extends Record<string, unknown>>(
  row: T,
  locale: Locale,
  base: string,
): string {
  const key = locale === "vn" ? `${base}_vn` : `${base}_en`;
  const value = row[key];
  return typeof value === "string" ? value : "";
}
