import { ArrowRight, Search } from "lucide-react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useI18n } from "@/lib/locale";
import { Button } from "@/components/ui/button";

export function SearchBox({ variant = "hero" }: { variant?: "hero" | "page" }) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { q?: string };
  const [q, setQ] = useState(search.q ?? "");
  function onSubmit(e: FormEvent) { e.preventDefault(); void navigate({ to: "/search", search: { q: q.trim() || undefined } }); }
  return (
    <form onSubmit={onSubmit} className={variant === "hero" ? "flex w-full max-w-3xl flex-col gap-2 sm:flex-row" : "flex w-full flex-col gap-2 sm:flex-row"}>
      <label className="group relative flex min-h-13 flex-1 items-center rounded-full bg-paper px-5 shadow-border transition-shadow focus-within:shadow-soft">
        <Search className="mr-3 size-5 shrink-0 text-muted" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("searchPlaceholder")} aria-label={t("search")} className="min-w-0 flex-1 border-0 bg-transparent text-ink outline-none placeholder:text-muted/70" />
      </label>
      <Button type="submit" className="min-h-13 px-6">{variant === "hero" ? <><span>{t("searchCta")}</span><ArrowRight className="size-4" /></> : t("search")}</Button>
    </form>
  );
}
