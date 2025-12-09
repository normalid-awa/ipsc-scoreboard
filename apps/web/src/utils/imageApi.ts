import env from "@/env";

export function getImageUrlFromId(id: string | undefined) {
	if (!id) return;
	return `${env.VITE_BACKEND_API_URL}/api/image/${id}`;
}
