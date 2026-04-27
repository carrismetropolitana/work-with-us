function required(name: string): string {
	const value = process.env[name];
	if (!value) throw new Error(`Missing required env var: ${name}`);
	return value;
}

export const config = {
	cors_origin: (process.env.API_CORS_ORIGIN ?? 'http://localhost:49025')
		.split(',')
		.map(s => s.trim())
		.filter(Boolean),
	mongo_db: required('MONGO_DB'),
	mongo_uri: required('MONGO_URI'),
	port: Number(process.env.API_PORT ?? 49026),
	timezone: 'Europe/Lisbon',
} as const;
