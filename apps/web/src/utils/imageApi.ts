import env from "@/env";

export function getImageUrlFromId(id: string) {
	return `${env.VITE_BACKEND_API_URL}/api/image/${id}`;
}
