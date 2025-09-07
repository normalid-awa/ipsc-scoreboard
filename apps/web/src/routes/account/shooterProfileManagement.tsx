import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/account/shooterProfileManagement")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/account/shooterProfileManagement"!</div>;
}
