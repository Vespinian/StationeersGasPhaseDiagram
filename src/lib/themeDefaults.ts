import { writable, derived } from 'svelte/store';

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
    text: string;
    subtitle: string;
    controlsBg: string;
    controlsShadow: string;
    inputBg: string;
    inputBorder: string;
    inputText: string;
    btnBg: string;
    btnText: string;
    btnBorder: string;
    helpBg: string;
    helpBorder: string;
    h3: string;
    selectBg: string;
    selectText: string;
    selectBorder: string;
}

export type ThemeKey = 'stationeers' | 'light' | 'dark';

export const defaultThemeColors: Record<ThemeKey, ThemeColors> = {
    stationeers: {
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
        text: '#b8c8e0',
        subtitle: '#888',
        controlsBg: '#1e2a3d',
        controlsShadow: 'none',
        inputBg: '#1e2a3d',
        inputBorder: 'rgba(100,140,200,0.2)',
        inputText: '#b8c8e0',
        btnBg: '#25334a',
        btnText: '#b8c8e0',
        btnBorder: 'rgba(100,140,200,0.2)',
        helpBg: '#1e2a3d',
        helpBorder: 'rgba(100,140,200,0.2)',
        h3: '#b8c8e0',
        selectBg: '#25334a',
        selectText: '#b8c8e0',
        selectBorder: 'rgba(100,140,200,0.2)',
    },
    light: {
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
        text: '#202122',
        subtitle: '#666',
        controlsBg: '#f2f2f2',
        controlsShadow: '0 1px 3px rgba(0,0,0,0.1)',
        inputBg: '#f2f2f2',
        inputBorder: '#a2a9b1',
        inputText: '#202122',
        btnBg: '#fff',
        btnText: '#202122',
        btnBorder: '#a2a9b1',
        helpBg: '#fff',
        helpBorder: '#a2a9b1',
        h3: '#202122',
        selectBg: '#fff',
        selectText: '#202122',
        selectBorder: '#a2a9b1',
    },
    dark: {
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
        text: '#c8cde0',
        subtitle: '#7a7f98',
        controlsBg: '#111',
        controlsShadow: 'none',
        inputBg: '#111',
        inputBorder: '#444',
        inputText: '#ccc',
        btnBg: '#222',
        btnText: '#ccc',
        btnBorder: '#444',
        helpBg: '#111',
        helpBorder: '#444',
        h3: '#ccc',
        selectBg: '#222',
        selectText: '#ccc',
        selectBorder: '#444',
    },
};

export const defaultTheme = 'stationeers';

export const theme = writable<ThemeKey>(defaultTheme);

export const themeColors = derived(theme, ($theme) => 
    defaultThemeColors[$theme] ?? defaultThemeColors.stationeers
);
