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
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Box from "@mui/material/Box";

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
		<Stack direction={"row"} spacing={1} gap={1} flexWrap={"wrap"}>
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
	const [currentPage, setCurrentPage] = useState(0);
	const [limit, setLimit] = useState(10);

	const [textFilter, setTextFilter] = useState("");

	const [sportsFilters, setSportsFilters] = useState<Sport[]>([]);

	const { data } = useQuery(
		constructShooterProfileQueryOption({
			pagination: {
				limit: limit,
				offset: currentPage * limit,
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
			<Stack sx={{ height: "100%" }} spacing={1}>
				<Typography variant="h4">Shooters</Typography>
				<Paper elevation={3}>
					<Stack spacing={1} sx={{ p: 2 }}>
						<TextFilter
							text={textFilter}
							setFilter={setTextFilter}
						/>
						<SportFilter
							filters={sportsFilters}
							setFilters={setSportsFilters}
						/>
					</Stack>
				</Paper>
				<Paper variant="outlined" sx={{ flexGrow: 1 }}>
					<Stack>
						{data?.data?.items.map((v) => {
							return (
								<p key={v.id}>
									{v.id} {v.identifier}
								</p>
							);
						})}
					</Stack>
					{data?.data?.items.length === 0 && (
						<Typography sx={{ pt: 5 }} variant="h2" align="center">
							{`No shooters found : (`}
						</Typography>
					)}
				</Paper>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-around",
					}}
				>
					<ButtonGroup variant="text">
						<Button
							disabled={!data?.data?.hasPrevPage}
							startIcon={<ArrowLeftIcon />}
							onClick={() => setCurrentPage(currentPage - 1)}
							sx={{ width: 180 }}
						>
							Previous Page
						</Button>
						<Button
							disabled={!data?.data?.hasNextPage}
							onClick={() => setCurrentPage(currentPage + 1)}
							sx={{ width: 180 }}
							endIcon={<ArrowRightIcon />}
						>
							Next Page
						</Button>
					</ButtonGroup>
				</Box>
			</Stack>
		</>
	);
}
