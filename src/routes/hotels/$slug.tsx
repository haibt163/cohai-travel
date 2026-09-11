import { createFileRoute, notFound, redirect } from "@tanstack/react-router";

const stayRedirects: Record<string, string> = {};

export const Route = createFileRoute("/hotels/$slug")({
  loader: ({ params }) => {
    const target = stayRedirects[params.slug];
    if (!target) throw notFound();
    throw redirect({ href: `/en/stays/${target}`, statusCode: 301 });
  },
});
