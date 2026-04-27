'use client';

import type { Line } from '@/types';

import useSWR from 'swr';

const LINES_URL = 'https://api.carrismetropolitana.pt/v2/lines';

async function fetchLines(): Promise<Line[]> {
	const response = await fetch(LINES_URL);
	if (!response.ok) throw new Error(`Failed to fetch lines: ${response.status}`);
	return response.json() as Promise<Line[]>;
}

export function useLines() {
	const { data, error, isLoading } = useSWR<Line[]>(LINES_URL, fetchLines, {
		revalidateIfStale: false,
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
	});
	return { error, isLoading, lines: data ?? [] };
}
