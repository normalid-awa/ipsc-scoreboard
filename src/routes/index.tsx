import * as fs from "node:fs";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { ListedRouteStaticData } from "../router";
import Button from "@mui/material/Button";
import HomeIcon from "@mui/icons-material/Home";

const filePath = "count.txt";

async function readCount() {
	return parseInt(
		await fs.promises.readFile(filePath, "utf-8").catch(() => "0"),
	);
}

const getCount = createServerFn({
	method: "GET",
}).handler(() => {
	return readCount();
});

const updateCount = createServerFn({ method: "POST" })
	.validator((d: number) => d)
	.handler(async (ctx) => {
		const count = await readCount();
		await fs.promises.writeFile(filePath, `${count + ctx.data}`);
	});

export const ROUTE_ORDER = 1;
export const Route = createFileRoute("/")({
	component: Index,
	loader: async () => await getCount(),
	staticData: {
		displayName: "Home",
		icon: <HomeIcon />,
		needAuth: false,
		order: ROUTE_ORDER,
	} satisfies ListedRouteStaticData,
});

function Index() {
	const router = useRouter();
	const state = Route.useLoaderData();

	return (
		<Button
			variant="contained"
			onClick={() => {
				updateCount({ data: 1 }).then(() => {
					router.invalidate();
				});
			}}
			sx={{ height: "220vh" }}
		>
			Add 1 to {state}?
		</Button>
	);
}
