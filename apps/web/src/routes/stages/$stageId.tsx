import env from "@/env";
import CardMedia from "@mui/material/CardMedia";
import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/stages/$stageId")({
	component: RouteComponent,
	async loader(ctx) {
		const stage = await ctx.context.api
			.stage({ id: ctx.params.stageId })
			.get()
			.then((res) => res.data);
		if (!stage) throw notFound();
		return stage;
	},
});

function RouteComponent() {
	const stage = Route.useLoaderData();

	return (
		<div>
			Hello "/stages/stageImage"!
			<CardMedia
				component="img"
				image={
					stage.images?.length > 0
						? `${env.VITE_BACKEND_API_URL}/api/image/${stage.images[0].uuid}`
						: undefined
				}
				alt={`${stage.title}'s thumbnail`}
				style={{
					viewTransitionName: `stage-image-${stage.id}`,
				}}
			/>
		</div>
	);
}
