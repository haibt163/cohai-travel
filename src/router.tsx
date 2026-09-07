import { createRouter } from "@tanstack/react-router";
import { AppErrorComponent, NotFound } from "@/lib/error-component";
import { routeTree } from "./routeTree.gen";

function Pending() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="h-64 animate-pulse rounded-xl bg-paper-2" />
    </div>
  );
}

export function getRouter() {
  return createRouter({
    routeTree,
    defaultErrorComponent: AppErrorComponent,
    defaultNotFoundComponent: NotFound,
    defaultPendingComponent: Pending,
  });
}
