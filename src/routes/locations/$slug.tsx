import { createFileRoute, notFound, redirect } from "@tanstack/react-router";

const destinationRedirects: Record<string, string> = {
  hanoi: "hanoi",
  "halong-bay": "ha-long",
  "tuan-chau": "ha-long",
  sapa: "sapa",
};

export const Route = createFileRoute("/locations/$slug")({
  loader: ({ params }) => {
    const target = destinationRedirects[params.slug];
    if (!target) throw notFound();
    throw redirect({ href: `/en/destinations/${target}`, statusCode: 301 });
  },
});
