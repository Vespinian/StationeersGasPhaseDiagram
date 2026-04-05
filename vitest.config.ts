import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
	plugins: [svelte({ hot: !process.env.VITEST })],
	test: {
		environment: 'jsdom',
		include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
		globals: true,
		alias: {
			$lib: '/src/lib',
		},
	},
});
