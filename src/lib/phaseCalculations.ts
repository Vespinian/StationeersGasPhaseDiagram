import type { GasData } from './gasData';

export interface ThemeColors {
	bg: string;
	plotBg: string;
	grid: string;
	axis: string;
	tickText: string;
	tickTextSecondary: string;
	axisLabel: string;
	refLine: string;
	refLine0K: string;
	refLineRed: string;
	hoverLine: string;
	hoverLineH: string;
	hoverDotStroke: string;
	tooltipBg: string;
	tooltipBorder: string;
	tooltipText: string;
	tooltipHeader: string;
}

export interface Margin {
	top: number;
	right: number;
	left: number;
	bottom: number;
}

export function niceStep(range: number, targetTicks: number): number {
	if (range <= 0 || !isFinite(range) || targetTicks <= 0) {
		return 1;
	}
	const rough = range / targetTicks;
	const pow10 = Math.pow(10, Math.floor(Math.log10(rough)));
	const frac = rough / pow10;
	let nice: number;
	if (frac <= 1.5) nice = 1;
	else if (frac <= 3.5) nice = 2;
	else if (frac <= 7.5) nice = 5;
	else nice = 10;
	return nice * pow10;
}

export function generateTicks(min: number, max: number): number[] {
	if (!isFinite(min) || !isFinite(max) || max <= min) {
		return [];
	}
	const step = niceStep(max - min, 10);
	if (!isFinite(step) || step <= 0) {
		return [];
	}
	const ticks: number[] = [];
	const start = Math.ceil(min / step) * step;
	for (let t = start; t <= max; t += step) {
		ticks.push(Math.round(t * 1e6) / 1e6);
	}
	return ticks;
}

export function generateLogTicks(min: number, max: number): number[] {
	if (
		!isFinite(min) ||
		!isFinite(max) ||
		min <= 0 ||
		max <= 0 ||
		max <= min
	) {
		return [];
	}
	const ticks: number[] = [];
	const logMin = Math.floor(Math.log10(min));
	const logMax = Math.ceil(Math.log10(max));
	for (let exp = logMin; exp <= logMax; exp++) {
		const base = Math.pow(10, exp);
		for (const mult of [1, 2, 5]) {
			const v = base * mult;
			if (v >= min && v <= max) {
				ticks.push(v);
			}
		}
	}
	return ticks;
}

export function formatTickValue(v: number, isY: boolean): string {
	if (isY) {
		if (v >= 1) return `${Math.round(v)}`;
		return v.toFixed(10).replace(/\.?0+$/, '') || '0';
	}
	if (v >= 1) return `${Math.round(v)}K`;
	return (v.toFixed(10).replace(/\.?0+$/, '') || '0') + 'K';
}

export function getGasColor(gas: GasData, theme: 'stationeers' | 'light' | 'dark'): string {
	if (gas.symbol === 'N₂') {
		if (theme === 'dark') return '#666666';
		if (theme === 'light') return '#000000';
		return '#000000';
	}
	if (gas.symbol === 'O₂') {
		if (theme === 'light') return '#88aaff';
		return gas.color;
	}
	return gas.color;
}

export function getGasLabelColor(
	gas: GasData,
	theme: 'stationeers' | 'light' | 'dark'
): string {
	if (gas.symbol === 'N₂') {
		if (theme === 'dark') return '#888888';
		if (theme === 'light') return '#101010';
		return '#999999';
	}
	if (gas.symbol === 'O₂') {
		if (theme === 'light') return '#88aaff';
		return gas.labelColor;
	}
	return gas.labelColor;
}

export function getThemeColors(theme: 'stationeers' | 'light' | 'dark'): ThemeColors {
	if (theme === 'dark') {
		return {
			bg: '#101418',
			plotBg: '#0a0d10',
			grid: 'rgba(255,255,255,0.06)',
			axis: 'rgba(255,255,255,0.2)',
			tickText: '#c8cde0',
			tickTextSecondary: '#7a7f98',
			axisLabel: '#c8cde0',
			refLine: '#5b7fd6',
			refLine0K: '#7a9ae0',
			refLineRed: '#f07178',
			hoverLine: '#c8cde0',
			hoverLineH: 'rgba(200,205,224,0.25)',
			hoverDotStroke: '#fff',
			tooltipBg: 'rgba(16,20,24,0.95)',
			tooltipBorder: 'rgba(255,255,255,0.1)',
			tooltipText: '#c8cde0',
			tooltipHeader: '#fff',
		};
	}
	if (theme === 'light') {
		return {
			bg: '#e8e8e8',
			plotBg: '#f2f2f2',
			grid: '#d0d0d0',
			axis: '#888',
			tickText: '#202122',
			tickTextSecondary: '#666',
			axisLabel: '#202122',
			refLine: '#3366cc',
			refLine0K: '#6688dd',
			refLineRed: '#d33',
			hoverLine: '#202122',
			hoverLineH: 'rgba(32,33,34,0.3)',
			hoverDotStroke: '#333',
			tooltipBg: 'rgba(255,255,255,0.95)',
			tooltipBorder: '#a2a9b1',
			tooltipText: '#202122',
			tooltipHeader: '#000',
		};
	}
	return {
		bg: '#1a2233',
		plotBg: '#1e2a3d',
		grid: 'rgba(100,140,200,0.12)',
		axis: 'rgba(100,140,200,0.3)',
		tickText: '#b8c8e0',
		tickTextSecondary: '#7a8fa8',
		axisLabel: '#b8c8e0',
		refLine: '#5b7fd6',
		refLine0K: '#7a9ae0',
		refLineRed: '#ff4444',
		hoverLine: '#b8c8e0',
		hoverLineH: 'rgba(184,200,224,0.3)',
		hoverDotStroke: '#fff',
		tooltipBg: 'rgba(26,34,51,0.95)',
		tooltipBorder: 'rgba(100,140,200,0.2)',
		tooltipText: '#b8c8e0',
		tooltipHeader: '#d0e0f0',
	};
}

export function plotDimensions(width: number, margin: Margin) {
	return {
		plotWidth: width - margin.left - margin.right,
		plotHeight: width - margin.top - margin.bottom,
	};
}

export function scaleX(
	tempK: number,
	viewTempMin: number,
	viewTempMax: number,
	margin: Margin,
	plotWidth: number,
	logXScale: boolean
): number {
	if (logXScale) {
		const logMin = Math.log10(viewTempMin);
		const logMax = Math.log10(viewTempMax);
		const logT = Math.log10(tempK);
		return margin.left + ((logT - logMin) / (logMax - logMin)) * plotWidth;
	}
	return (
		margin.left +
		((tempK - viewTempMin) / (viewTempMax - viewTempMin)) * plotWidth
	);
}

export function scaleY(
	pressure: number,
	viewPressMin: number,
	viewPressMax: number,
	margin: Margin,
	plotHeight: number,
	logScale: boolean
): number {
	if (logScale) {
		const logMin = Math.log10(viewPressMin);
		const logMax = Math.log10(viewPressMax);
		const logP = Math.log10(Math.max(pressure, 0.1));
		return (
			margin.top +
			plotHeight -
			((logP - logMin) / (logMax - logMin)) * plotHeight
		);
	}
	return (
		margin.top +
		plotHeight -
		((pressure - viewPressMin) / (viewPressMax - viewPressMin)) * plotHeight
	);
}

export function invScaleX(
	svgX: number,
	viewTempMin: number,
	viewTempMax: number,
	margin: Margin,
	plotWidth: number,
	logXScale: boolean
): number {
	if (logXScale) {
		const logMin = Math.log10(viewTempMin);
		const logMax = Math.log10(viewTempMax);
		const ratio = (svgX - margin.left) / plotWidth;
		return Math.pow(10, logMin + ratio * (logMax - logMin));
	}
	return (
		viewTempMin +
		((svgX - margin.left) / plotWidth) * (viewTempMax - viewTempMin)
	);
}

export function invScaleY(
	svgY: number,
	viewPressMin: number,
	viewPressMax: number,
	margin: Margin,
	plotHeight: number,
	logScale: boolean
): number {
	if (logScale) {
		const logMin = Math.log10(viewPressMin);
		const logMax = Math.log10(viewPressMax);
		const ratio = 1 - (svgY - margin.top) / plotHeight;
		return Math.pow(10, logMin + ratio * (logMax - logMin));
	}
	return (
		viewPressMin +
		(1 - (svgY - margin.top) / plotHeight) * (viewPressMax - viewPressMin)
	);
}
