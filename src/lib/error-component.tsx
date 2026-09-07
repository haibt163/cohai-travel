import type { ErrorComponentProps } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";

const FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error) return error;
  return FALLBACK_MESSAGE;
}

export function AppErrorComponent({ error }: ErrorComponentProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-paper px-6 text-center text-ink">
      <span className="text-danger" aria-hidden="true">
        <TriangleAlert className="size-10" strokeWidth={2} />
      </span>
      <h1 className="font-display text-3xl">Something went wrong</h1>
      <p className="max-w-md text-sm break-words text-muted">{errorMessage(error)}</p>
      <Link to="/" className="mt-4 text-sm text-accent">
        Back to CoHai Travel
      </Link>
    </main>
  );
}

export function NotFoundComponent() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-24 text-center">
      <p className="text-xs uppercase tracking-caps text-accent">404</p>
      <h1 className="mt-2 font-display text-4xl">That page is not on the atlas.</h1>
      <p className="mt-3 text-muted">Try journeys, places, or the search desk.</p>
      <Link to="/" className="mt-6 inline-flex min-h-11 items-center text-accent">
        Home
      </Link>
    </main>
  );
}

export function PendingComponent() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="h-72 animate-pulse rounded-xl bg-paper-2" />
    </div>
  );
}
