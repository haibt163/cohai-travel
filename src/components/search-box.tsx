import { useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useI18n } from "@/lib/locale";
import { Button } from "@/components/ui/button";

export function SearchBox({ variant = "hero" }: { variant?: "hero" | "page" }) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { q?: string };
  const [q, setQ] = useState(search.q ?? "");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void navigate({ to: "/search", search: { q: q.trim() || undefined } });
  }

  return (
    <form
      onSubmit={onSubmit}
      className={
        variant === "hero"
          ? "mt-8 flex max-w-xl flex-col gap-2 sm:flex-row"
          : "flex gap-2"
      }
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t("searchPlaceholder")}
        className="min-h-11 flex-1 rounded-md bg-paper px-3 text-ink outline-none"
      />
      <Button type="submit">{variant === "hero" ? t("searchCta") : t("search")}</Button>
    </form>
  );
}
