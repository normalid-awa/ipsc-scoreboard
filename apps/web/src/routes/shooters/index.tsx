import PeopleIcon from "@mui/icons-material/People";
import { createFileRoute } from "@tanstack/react-router";
import { ROUTE_ORDER as PREV_ROUTE_ORDER } from "../timer";
import { ListedRouteStaticData } from "@/router";
import env from "@/env";
import { useQuery } from "@tanstack/react-query";
import { constructShooterProfileQueryOption } from "@/queries/shooterProfile/shooterProfile";
import { useState } from "react";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import { FieldFilter, Sport } from "@ipsc_scoreboard/api";
import DoneIcon from "@mui/icons-material/Done";
import TextField from "@mui/material/TextField";

export const ROUTE_ORDER = PREV_ROUTE_ORDER + 1;

export const Route = createFileRoute("/shooters/")({
	component: RouteComponent,
	staticData: {
		displayName: "Shooters list",
		icon: <PeopleIcon />,
		needAuth: false,
		order: ROUTE_ORDER,
	} satisfies ListedRouteStaticData,
	head: () => ({
		meta: [{ title: `${env.VITE_TITLE_PREFIX} Shooters list` }],
	}),
});

function SportFilterChip(props: {
	onEnable: () => void;
	onDisable: () => void;
	enabled: boolean;
	label: string;
}) {
	return (
		<Chip
			label={props.label}
			variant={props.enabled ? "filled" : "outlined"}
			color={props.enabled ? "primary" : "default"}
			clickable
			onClick={props.enabled ? props.onDisable : props.onEnable}
			onDelete={props.enabled ? props.onDisable : undefined}
			deleteIcon={props.enabled ? <DoneIcon /> : undefined}
		/>
	);
}

function SportFilter(props: {
	filters: string[];
	setFilters: (filters: Sport[]) => void;
}) {
	function removeFilter(filter: Sport) {
		const newFilters = props.filters.filter((v) => v !== filter) as Sport[];
		props.setFilters(newFilters);
	}

	function addFilter(filter: Sport) {
		if (!props.filters.includes(filter)) {
			props.setFilters([...props.filters, filter] as Sport[]);
		}
	}

	return (
		<Stack direction={"row"} spacing={1}>
			{Object.keys(Sport).map((v) => (
				<SportFilterChip
					key={v}
					label={v}
					onEnable={() => addFilter(Sport[v as keyof typeof Sport])}
					onDisable={() =>
						removeFilter(Sport[v as keyof typeof Sport])
					}
					enabled={props.filters.includes(
						Sport[v as keyof typeof Sport],
					)}
				/>
			))}
		</Stack>
	);
}

function TextFilter(props: {
	text: string;
	setFilter: (text: string) => void;
}) {
	return (
		<TextField
			label="Search"
			value={props.text}
			onChange={(e) => props.setFilter(e.target.value)}
		/>
	);
}

function valueOrUndefined<V>(cond: boolean, ret: V): [V] | [] {
	return cond ? [ret] : [];
}

function RouteComponent() {
	const [currentPage, setCurrentPage] = useState<{
		before?: string;
		after?: string;
	}>({});

	const [textFilter, setTextFilter] = useState("");

	const [sportsFilters, setSportsFilters] = useState<Sport[]>([]);

	const { data } = useQuery(
		constructShooterProfileQueryOption({
			pagination: {
				before: currentPage.before,
				after: currentPage.after,
				first: 5,
			},
			filter: {
				operator: "and",
				value: [
					...valueOrUndefined(sportsFilters.length > 0, {
						field: "sport",
						operator: "in",
						value: sportsFilters,
					} satisfies FieldFilter),
					...valueOrUndefined(textFilter.length > 0, {
						field: "user.name",
						operator: "like",
						value: `%${textFilter}%`,
					} satisfies FieldFilter),
				],
			},
		}),
	);

	return (
		<>
			<Typography variant="h4">Shooters</Typography>
			<Paper sx={{ p: 2 }} elevation={3}>
				<Stack>
					<TextFilter text={textFilter} setFilter={setTextFilter} />
					<SportFilter
						filters={sportsFilters}
						setFilters={setSportsFilters}
					/>
				</Stack>
			</Paper>
			<div>
				{data?.data?.items.map((v) => {
					return (
						<p key={v.id}>
							{v.id} {v.identifier}
						</p>
					);
				})}
				<button
					onClick={() =>
						setCurrentPage({
							before: data?.data?.startCursor ?? undefined,
						})
					}
				>
					prev
				</button>
				<button
					onClick={() =>
						setCurrentPage({
							after: data?.data?.endCursor ?? undefined,
						})
					}
				>
					next
				</button>
			</div>
		</>
	);
}
