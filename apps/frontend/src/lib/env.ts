export const env = {
	api_base_url: process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:49026',
	cm_line_url: (id: string) => `https://www.carrismetropolitana.pt/lines/${id}`,
};
