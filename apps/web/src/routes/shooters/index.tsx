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
import { FieldFilter, SportEnum } from "@ipsc_scoreboard/api";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { ShooterCard } from "@/components/ShooterCard";
import Divider from "@mui/material/Divider";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Skeleton from "@mui/material/Skeleton";
import { SportFilter } from "@/components/SportFilter";

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

function emptyArrayOrNot<V>(cond: boolean, ret: V): [V] | [] {
	return cond ? [ret] : [];
}

function RouteComponent() {
	const theme = useTheme();
	const smallVariant = useMediaQuery(theme.breakpoints.down("sm"));

	const [currentPage, setCurrentPage] = useState(0);
	const [limit, setLimit] = useState(10);

	const [textFilter, setTextFilter] = useState("");

	const [sportsFilters, setSportsFilters] = useState<SportEnum[]>([]);

	const { data, isLoading } = useQuery(
		constructShooterProfileQueryOption({
			pagination: {
				limit: limit,
				offset: currentPage * limit,
			},
			filter: {
				operator: "and",
				value: [
					...emptyArrayOrNot(sportsFilters.length > 0, {
						field: "sport",
						operator: "in",
						value: sportsFilters,
					} satisfies FieldFilter),
					{
						operator: "or",
						value: [
							...emptyArrayOrNot(textFilter.length > 0, {
								field: "user.name",
								operator: "like",
								value: `%${textFilter}%`,
							} satisfies FieldFilter),
							...emptyArrayOrNot(textFilter.length > 0, {
								field: "identifier",
								operator: "like",
								value: `%${textFilter}%`,
							} satisfies FieldFilter),
						],
					},
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
				<Paper
					variant="outlined"
					sx={{ flexGrow: 1, overflow: "auto", minHeight: 200 }}
				>
					<Stack spacing={1} sx={{ p: 1 }}>
						{data?.data?.items.map((v) => {
							return (
								<ShooterCard
									size="medium"
									key={v.id}
									icon={
										v.image
											? `${env.VITE_BACKEND_API_URL}/api/image/${v.image?.uuid}`
											: undefined
									}
									identifier={v.identifier}
									sport={v.sport}
								/>
							);
						})}
						{isLoading &&
							new Array(3)
								.fill(undefined)
								.map((_v, k) => (
									<Skeleton
										key={k}
										variant="rounded"
										height={80}
										animation="wave"
									/>
								))}
					</Stack>
					{data?.data?.items.length === 0 && (
						<Typography sx={{ pt: 5 }} variant="h2" align="center">
							{`No shooters found : (`}
						</Typography>
					)}
				</Paper>
				<Stack
					spacing={2}
					direction={"row"}
					justifyContent={"center"}
					divider={<Divider orientation="vertical" />}
				>
					<Button
						size={smallVariant ? "small" : "medium"}
						disabled={!data?.data?.hasPrevPage}
						startIcon={<ArrowLeftIcon />}
						onClick={() => setCurrentPage(currentPage - 1)}
						sx={{ width: 180 }}
					>
						Previous Page
					</Button>
					<Typography
						alignContent={"center"}
						align={"center"}
						variant={smallVariant ? "body2" : "h6"}
						sx={{ display: "inline-block" }}
					>
						Page{" "}
						<p
							style={{
								lineBreak: "loose",
								display: "inline-block",
							}}
						>
							{data?.data?.currentPage} / {data?.data?.totalPages}
						</p>
					</Typography>
					<Button
						size={smallVariant ? "small" : "medium"}
						disabled={!data?.data?.hasNextPage}
						onClick={() => setCurrentPage(currentPage + 1)}
						sx={{ width: 180 }}
						endIcon={<ArrowRightIcon />}
					>
						Next Page
					</Button>
				</Stack>
			</Stack>
		</>
	);
}
