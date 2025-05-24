"use client";

import WideScreenNavigationLayout from "@/components/navigation/WideScreenNavigationLayout";
import { ConvexClientProvider } from "@/providers/ConvexClientProvider";
import { ReactNode } from "react";

export default function LayoutClient({ children }: { children: ReactNode }) {
	return (
		<div>
			<ConvexClientProvider>
				<WideScreenNavigationLayout>
					{children}
				</WideScreenNavigationLayout>
			</ConvexClientProvider>
		</div>
	);
}
