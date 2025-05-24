"use client";

import { ConvexClientProvider } from "@/providers/ConvexClientProvider";
import { ReactNode } from "react";

export default function LayoutClient({ children }: { children: ReactNode }) {
	return (
		<div>
			<ConvexClientProvider>{children}</ConvexClientProvider>
		</div>
	);
}
