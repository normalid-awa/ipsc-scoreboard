"use client";
import ThemeSwitches from "@/components/ThemeSwitches";
import { api } from "@ipsc-scoreboard/backend/convex/_generated/api.js";
import { useConvexAuth, useQuery } from "convex/react";

export default function Home() {
	const healthCheck = useQuery(api.healthCheck.get);
	const { isAuthenticated } = useConvexAuth();
	return (
		<div>
			<ThemeSwitches />
			{isAuthenticated ? (
				<p>You are authenticated</p>
			) : (
				<p>You are not authenticated</p>
			)}
			<h1>{healthCheck}</h1>
		</div>
	);
}
