import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/account/management")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/account/management"!</div>;
}
