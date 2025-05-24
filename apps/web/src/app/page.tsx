"use client";
import { api } from "@ipsc-scoreboard/backend/convex/_generated/api.js";
import { useQuery } from "convex/react";

export default function Home() {
	const healthCheck = useQuery(api.healthCheck.get);

	return (
		<div>
			<h1>{healthCheck}</h1>
		</div>
	);
}
