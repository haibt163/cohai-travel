import { ArrowUpRight, BookOpenCheck, ExternalLink, MapPinned } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHead } from "@/components/shell";
import { useI18n } from "@/lib/locale";
import { seoHead } from "@/lib/seo";
import { travelNotes } from "@/lib/travel-notes";

export const Route = createFileRoute("/$locale/travel-notes")({
  head: ({ params }) => {
    const locale = params.locale === "vn" ? "vn" : "en";
    const vietnamese = locale === "vn";
    return seoHead({
      locale,
      title: vietnamese ? "Ghi chú hành trình | CoHai Travel" : "Travel notes | CoHai Travel",
      description: vietnamese
        ? "Ghi chú nguồn dẫn cho việc lên kế hoạch hành trình chậm qua những điểm đến của CoHai Travel."
        : "Source-led planning notes for slower journeys through CoHai Travel destinations.",
      pathname: `/${locale}/travel-notes`,
      alternatePathname: (nextLocale) => `/${nextLocale}/travel-notes`,
    });
  },
  component: TravelNotesPage,
});

function TravelNotesPage() {
  const { locale } = useI18n();
  const vietnamese = locale === "vn";
  const chapters = {
    heritage: vietnamese ? "Di sản" : "Heritage",
    coast: vietnamese ? "Duyên hải" : "Coast",
    nature: vietnamese ? "Thiên nhiên" : "Nature",
  };

  return (
    <div>
      <PageHead
        kicker={vietnamese ? "Đọc trước khi đi" : "Read before you go"}
        title={vietnamese ? "Ghi chú hành trình." : "Travel notes."}
        body={vietnamese
          ? "Những ý tưởng lên đường được xây từ các chủ đề di sản của CoHai và nguồn du lịch chính thức hiện hành — không phải lời hứa về lịch trình hay điều kiện vận hành."
          : "Planning ideas rebuilt from CoHai’s source-backed subjects and current official tourism material — not promises about a specific itinerary or operating conditions."}
      />
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 md:pb-24">
        <div className="mb-8 flex gap-4 rounded-3xl border border-border bg-surface p-5 shadow-border">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-surface-2 text-accent"><BookOpenCheck className="size-5" /></span>
          <div><p className="font-semibold">{vietnamese ? "Cách dùng ghi chú này" : "How to use these notes"}</p><p className="mt-1 max-w-3xl text-sm leading-6 text-muted">{vietnamese ? "Mỗi ghi chú liên kết với một điểm đến và dẫn tới nguồn tham khảo. Các chi tiết thay đổi theo mùa, thời tiết hoặc đơn vị vận hành luôn cần được xác nhận cho ngày đi cụ thể." : "Each note connects to a destination and names its source. Anything that changes with season, weather or operator still needs confirmation for the dates you choose."}</p></div>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">{travelNotes.map((note) => (
          <article key={note.id} className="flex flex-col rounded-3xl border border-border bg-surface p-6 shadow-border">
            <div className="flex items-start justify-between gap-4"><span className="rounded-full bg-surface-2 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-caps text-accent">{chapters[note.chapter]}</span><MapPinned className="size-5 text-muted" /></div>
            <h2 className="mt-6 font-display text-3xl leading-tight">{note.title[locale]}</h2>
            <p className="mt-3 text-base leading-7 text-muted">{note.summary[locale]}</p>
            <div className="mt-5 rounded-2xl bg-paper p-4"><p className="text-xs font-semibold uppercase tracking-caps text-muted">{vietnamese ? "Lưu ý khi lên kế hoạch" : "Planning note"}</p><p className="mt-2 text-sm leading-6">{note.practical[locale]}</p></div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3"><Link to="/$locale/destinations/$slug" params={{ locale, slug: note.destinationSlug }} className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-ink">{vietnamese ? "Mở điểm đến" : "Open destination"}<ArrowUpRight className="size-4" /></Link><a href={note.source.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs text-muted hover:text-ink">{note.source.label}<ExternalLink className="size-3.5" /></a></div>
          </article>
        ))}</div>
      </section>
    </div>
  );
}
