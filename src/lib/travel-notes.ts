import type { Locale } from "@/lib/locale";

export type TravelNote = {
  id: string;
  destinationSlug: string;
  chapter: "nature" | "coast" | "heritage";
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
  practical: Record<Locale, string>;
  source: { label: string; href: string };
};

// These are editorial planning notes, not commercial promises. The cited
// official tourism pages are recorded in docs/P2_2026_FACT_SOURCES.md.
export const travelNotes: TravelNote[] = [
  {
    id: "hanoi-at-walking-pace",
    destinationSlug: "hanoi",
    chapter: "heritage",
    title: { en: "Hanoi at walking pace", vn: "Hà Nội ở nhịp đi bộ" },
    summary: {
      en: "Begin around Hoan Kiem and the Old Quarter, then leave room for the city’s cafés, markets and neighbourhood life.",
      vn: "Bắt đầu quanh Hồ Gươm và phố cổ, rồi chừa thời gian cho quán cà phê, chợ và nhịp sống khu phố.",
    },
    practical: {
      en: "Use this as a shape for a first day, not a fixed route. Opening times, weather and street conditions should be checked for your travel dates.",
      vn: "Hãy xem đây là gợi ý cho ngày đầu tiên, không phải tuyến cố định. Cần kiểm tra giờ mở cửa, thời tiết và điều kiện đường phố theo ngày đi.",
    },
    source: { label: "Vietnam Tourism — Ha Noi", href: "https://vietnam.travel/places-to-go/northern-vietnam/ha-noi" },
  },
  {
    id: "halong-on-the-water",
    destinationSlug: "halong",
    chapter: "coast",
    title: { en: "Ha Long: give the water time", vn: "Hạ Long: dành thời gian cho mặt nước" },
    summary: {
      en: "Ha Long’s limestone islands, caves and changing seascape make unhurried time on the water the central idea.",
      vn: "Đảo đá vôi, hang động và cảnh biển thay đổi khiến thời gian thong thả trên mặt nước trở thành ý chính của Hạ Long.",
    },
    practical: {
      en: "Cruise operators, cave access and weather-dependent activities vary. Confirm the operating plan before treating an activity as included.",
      vn: "Đơn vị du thuyền, quyền vào hang và hoạt động phụ thuộc thời tiết có thể thay đổi. Hãy xác nhận kế hoạch vận hành trước khi coi một hoạt động là bao gồm.",
    },
    source: { label: "Vietnam Tourism — Ha Long", href: "https://vietnam.travel/places-to-go/northern-vietnam/ha-long" },
  },
  {
    id: "central-vietnam-arc",
    destinationSlug: "hoian",
    chapter: "heritage",
    title: { en: "Central Vietnam, read as an arc", vn: "Miền Trung, đọc như một cung đường" },
    summary: {
      en: "Hue’s imperial legacy, the Hai Van coastal corridor and Hoi An’s historic river town make a strong slow-travel sequence.",
      vn: "Di sản kinh đô Huế, hành lang ven biển Hải Vân và phố cổ ven sông Hội An tạo thành một cung đường đi chậm giàu lớp lang.",
    },
    practical: {
      en: "The connection is an editorial travel idea, not a promised transfer plan. Confirm routing, transport and stop order for the dates selected.",
      vn: "Sự kết nối này là ý tưởng biên tập, không phải cam kết về tuyến chuyển. Hãy xác nhận lộ trình, phương tiện và thứ tự điểm dừng theo ngày đã chọn.",
    },
    source: { label: "Vietnam Tourism — Hoi An", href: "https://vietnam.travel/node/705" },
  },
  {
    id: "sapa-seasonal-walking",
    destinationSlug: "sapa",
    chapter: "nature",
    title: { en: "Sapa: plan around the walking", vn: "Sa Pa: lên kế hoạch quanh những bước đi" },
    summary: {
      en: "Terrace valleys, village paths and mountain scenery are the enduring draw; the experience is best shaped around time outdoors.",
      vn: "Thung lũng ruộng bậc thang, đường bản và cảnh núi là sức hút bền vững; trải nghiệm đẹp nhất khi có thời gian ở ngoài trời.",
    },
    practical: {
      en: "Trail conditions and visibility are seasonal. Treat every walking plan as date-dependent and check local conditions before departure.",
      vn: "Điều kiện đường mòn và tầm nhìn mang tính mùa vụ. Mọi kế hoạch đi bộ cần phụ thuộc ngày đi và được kiểm tra điều kiện địa phương trước khi khởi hành.",
    },
    source: { label: "Vietnam Tourism — Sapa", href: "https://www.vietnam.travel/places-to-go/northern-vietnam/sapa" },
  },
  {
    id: "mekong-slow-travel",
    destinationSlug: "mekong",
    chapter: "nature",
    title: { en: "Mekong: make room for the in-between", vn: "Mekong: dành chỗ cho những đoạn ở giữa" },
    summary: {
      en: "Waterways, cycling, markets, orchards and village life support a slower reading of the delta than a single rushed stop.",
      vn: "Sông nước, xe đạp, chợ, vườn cây và đời sống làng quê gợi một cách đi chậm qua đồng bằng thay vì chỉ ghé vội một điểm.",
    },
    practical: {
      en: "Small-boat and cycling plans depend on local conditions and the selected operator. Confirm the day’s route before booking around a specific activity.",
      vn: "Thuyền nhỏ và lịch trình xe đạp phụ thuộc điều kiện địa phương cùng đơn vị vận hành. Hãy xác nhận tuyến trong ngày trước khi đặt theo một hoạt động cụ thể.",
    },
    source: { label: "Vietnam Tourism — Mekong Delta travel ideas", href: "https://vietnam.travel/things-to-do/how-to-travel-mekong-delta" },
  },
];
