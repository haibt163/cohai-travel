import { Outlet, createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/$locale")({
  beforeLoad: ({ params }) => {
    if (params.locale !== "en" && params.locale !== "vn") throw notFound();
    return { locale: params.locale };
  },
  component: () => <Outlet />,
});
