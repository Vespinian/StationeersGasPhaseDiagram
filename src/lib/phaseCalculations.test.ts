import { describe, it, expect } from 'vitest';
import {
	niceStep,
	generateTicks,
	generateLogTicks,
	formatTickValue,
	scaleX,
	scaleY,
	invScaleX,
	invScaleY,
	getThemeColors,
} from './phaseCalculations';

describe('niceStep', () => {
	it('returns 1 for invalid inputs', () => {
		expect(niceStep(0, 10)).toBe(1);
		expect(niceStep(-10, 10)).toBe(1);
		expect(niceStep(100, 0)).toBe(1);
		expect(niceStep(100, -5)).toBe(1);
	});

	it('returns nice intervals for common ranges', () => {
		expect(niceStep(100, 10)).toBe(10);
		expect(niceStep(50, 10)).toBe(5);
		expect(niceStep(300, 10)).toBe(20);
		expect(niceStep(700, 10)).toBe(50);
	});
});

describe('generateTicks', () => {
	it('returns empty array for invalid inputs', () => {
		expect(generateTicks(10, 5)).toEqual([]);
		expect(generateTicks(Infinity, 10)).toEqual([]);
		expect(generateTicks(5, Infinity)).toEqual([]);
	});

	it('generates ticks with correct step', () => {
		expect(generateTicks(0, 100)).toEqual([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
	});

	it('handles non-zero minimum', () => {
		const ticks = generateTicks(5, 55);
		expect(ticks[0]).toBe(5);
		expect(ticks[ticks.length - 1]).toBe(55);
	});
});

describe('generateLogTicks', () => {
	it('returns empty array for invalid inputs', () => {
		expect(generateLogTicks(0, 100)).toEqual([]);
		expect(generateLogTicks(-10, 100)).toEqual([]);
		expect(generateLogTicks(10, 5)).toEqual([]);
	});

	it('generates log ticks', () => {
		expect(generateLogTicks(1, 100)).toEqual([1, 2, 5, 10, 20, 50, 100]);
	});

	it('handles single decade', () => {
		expect(generateLogTicks(1, 10)).toEqual([1, 2, 5, 10]);
	});
});

describe('formatTickValue', () => {
	it('formats Y-axis values correctly', () => {
		expect(formatTickValue(100, true)).toBe('100');
		expect(formatTickValue(0.5, true)).toBe('0.5');
		expect(formatTickValue(1, true)).toBe('1');
	});

	it('formats X-axis values with K suffix', () => {
		expect(formatTickValue(100, false)).toBe('100K');
		expect(formatTickValue(0.5, false)).toBe('0.5K');
	});
});

describe('scaleX', () => {
	const margin = { top: 40, right: 40, left: 80, bottom: 60 };
	const plotWidth = 500;

	it('scales linearly', () => {
		expect(scaleX(0, 0, 100, margin, plotWidth, false)).toBe(80);
		expect(scaleX(100, 0, 100, margin, plotWidth, false)).toBe(580);
		expect(scaleX(50, 0, 100, margin, plotWidth, false)).toBe(330);
	});

	it('scales logarithmically', () => {
		expect(scaleX(1, 1, 100, margin, plotWidth, true)).toBe(80);
		expect(scaleX(100, 1, 100, margin, plotWidth, true)).toBe(580);
	});
});

describe('scaleY', () => {
	const margin = { top: 40, right: 40, left: 80, bottom: 60 };
	const plotHeight = 500;

	it('scales linearly (inverted)', () => {
		expect(scaleY(0, 0, 1000, margin, plotHeight, false)).toBe(540);
		expect(scaleY(1000, 0, 1000, margin, plotHeight, false)).toBe(40);
		expect(scaleY(500, 0, 1000, margin, plotHeight, false)).toBe(290);
	});

	it('scales logarithmically', () => {
		expect(scaleY(1, 1, 1000, margin, plotHeight, true)).toBe(540);
		expect(scaleY(1000, 1, 1000, margin, plotHeight, true)).toBe(40);
	});
});

describe('invScaleX', () => {
	const margin = { top: 40, right: 40, left: 80, bottom: 60 };
	const plotWidth = 500;

	it('inverts linear scale', () => {
		expect(invScaleX(80, 0, 100, margin, plotWidth, false)).toBe(0);
		expect(invScaleX(580, 0, 100, margin, plotWidth, false)).toBe(100);
		expect(invScaleX(330, 0, 100, margin, plotWidth, false)).toBe(50);
	});
});

describe('invScaleY', () => {
	const margin = { top: 40, right: 40, left: 80, bottom: 60 };
	const plotHeight = 500;

	it('inverts linear scale', () => {
		expect(invScaleY(540, 0, 1000, margin, plotHeight, false)).toBe(0);
		expect(invScaleY(40, 0, 1000, margin, plotHeight, false)).toBe(1000);
	});
});

describe('getThemeColors', () => {
	it('returns dark theme colors', () => {
		const colors = getThemeColors('dark');
		expect(colors.bg).toBe('#101418');
		expect(colors.refLine).toBe('#5b7fd6');
	});

	it('returns light theme colors', () => {
		const colors = getThemeColors('light');
		expect(colors.bg).toBe('#e8e8e8');
		expect(colors.refLine).toBe('#3366cc');
	});

	it('returns stationeers theme colors', () => {
		const colors = getThemeColors('stationeers');
		expect(colors.bg).toBe('#1a2233');
		expect(colors.refLine).toBe('#5b7fd6');
	});
});
