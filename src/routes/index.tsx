import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Diego" },
      { name: "description", content: "Página de Diego." },
      { property: "og:title", content: "Diego" },
      { property: "og:description", content: "Página de Diego." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-6 text-center">
      <h1 className="text-7xl font-bold text-foreground sm:text-9xl">Diego</h1>
    </main>
  );
}
