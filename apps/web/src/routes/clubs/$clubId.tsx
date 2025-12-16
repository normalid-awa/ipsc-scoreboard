import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/clubs/$clubId")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/clubs/$clubId"!</div>;
}
