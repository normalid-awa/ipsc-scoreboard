import { FeaturePlaceHolder } from "@/components/FeaturePlaceholder";
import { ListedRouteStaticData } from "@/router";
import Diversity2Icon from "@mui/icons-material/Diversity2";
import Stack from "@mui/material/Stack";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/clubs/")({
	component: RouteComponent,
	staticData: {
		displayName: "Club list",
		icon: <Diversity2Icon />,
		needAuth: false,
		order: 1,
	} satisfies ListedRouteStaticData,
});

function CurrentClub() {
	return <FeaturePlaceHolder name="Current Club" />;
}

function SearchFilter() {
	return <FeaturePlaceHolder name="Search Filter" />;
}

function Clubs() {
	return <FeaturePlaceHolder name="Clubs" />;
}

function RouteComponent() {
	return (
		<Stack spacing={1}>
			<CurrentClub />
			<SearchFilter />
			<Clubs />
		</Stack>
	);
}
