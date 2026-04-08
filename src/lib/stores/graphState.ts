import { gasData, type GasData } from '$lib/gasData';

export type SortKey =
    | 'symbol'
    | 'name'
    | 'meltK'
    | 'minCondKPa'
    | 'maxLiqK'
    | 'maxKPa'
    | 'specificHeat'
    | 'latentHeat';

export type Theme = 'stationeers' | 'light' | 'dark';

export interface SavedState {
    showGrid?: boolean;
    logScale?: boolean;
    logXScale?: boolean;
    invertPanY?: boolean;
    showFreezeLines?: boolean;
    visibleGases?: Record<string, boolean>;
    viewTempMin?: number;
    viewTempMax?: number;
    viewPressMin?: number;
    viewPressMax?: number;
    isLocked?: boolean;
    lockedTemp?: number | null;
    sg?: boolean;
    ls?: boolean;
    lx?: boolean;
    ip?: boolean;
    vg?: string[];
    tmn?: number;
    tmx?: number;
    pmn?: number;
    pmx?: number;
    lk?: boolean;
    lt?: number | null;
    fl?: boolean;
}

export interface HoverValue {
    gasKey: string;
    value: number;
}

export const LOCAL_STATE_KEY = 'stationeers-gas-diagram-local-state';
export const THEME_KEY = 'stationeers-gas-diagram-theme';
export const SHOW_MINI_LEGEND_KEY = 'stationeers-gas-diagram-show-mini-legend';

export const HARD_TEMP_MIN = -4000;
export const HARD_TEMP_MAX = 4000;
export const HARD_LOG_TEMP_MIN = 1;
export const HARD_LOG_TEMP_MAX = 20000;

export const HARD_PRESSURE_MIN = -6500;
export const HARD_PRESSURE_MAX = 12500;
export const HARD_LOG_PRESSURE_MIN = 1;
export const HARD_LOG_PRESSURE_MAX = 50000;

export const defaultVisibleGases = Object.fromEntries(
    Object.keys(gasData).map((k) => [k, k !== 'He'])
);

export function loadFromUrl(): SavedState | null {
    try {
        const hash = window.location.hash.slice(1);
        if (!hash) return null;
        return JSON.parse(decodeURIComponent(atob(hash)));
    } catch { }
    return null;
}

export function loadLocalState(): string | null {
    try {
        const raw = localStorage.getItem(LOCAL_STATE_KEY);
        return raw;
    } catch { }
    return null;
}

export function loadTheme(): Theme {
    try {
        const raw = localStorage.getItem(THEME_KEY);
        if (raw === 'light' || raw === 'dark' || raw === 'stationeers') {
            return raw;
        }
    } catch { }
    return 'stationeers';
}

export function loadShowMiniLegend(): boolean {
    try {
        const raw = localStorage.getItem(SHOW_MINI_LEGEND_KEY);
        return raw === 'true';
    } catch { }
    return false;
}

export function loadState(): SavedState | null {
    const urlState = loadFromUrl();
    if (urlState) {
        try {
            const encoded = btoa(
                encodeURIComponent(JSON.stringify(urlState))
            );
            shareUrl =
                window.location.origin +
                window.location.pathname +
                '#' +
                encoded;
        } catch { }
        const state: SavedState = {};
        if (urlState.sg !== undefined) state.showGrid = urlState.sg;
        if (urlState.ls !== undefined) state.logScale = urlState.ls;
        if (urlState.lx !== undefined) state.logXScale = urlState.lx;
        if (urlState.ip !== undefined) state.invertPanY = urlState.ip;
        if (urlState.vg !== undefined) {
            const hidden = urlState.vg as string[];
            state.visibleGases = Object.fromEntries(
                Object.keys(gasData).map((k) => [k, !hidden.includes(k)])
            );
        }
        if (urlState.tmn !== undefined) state.viewTempMin = urlState.tmn;
        if (urlState.tmx !== undefined) state.viewTempMax = urlState.tmx;
        if (urlState.pmn !== undefined) state.viewPressMin = urlState.pmn;
        if (urlState.pmx !== undefined) state.viewPressMax = urlState.pmx;
        if (urlState.lk !== undefined) state.isLocked = urlState.lk;
        if (urlState.lt !== undefined) state.lockedTemp = urlState.lt;
        if (urlState.fl !== undefined) state.showFreezeLines = urlState.fl;
        return state;
    } else {
        const encodedLocalState = loadLocalState();
        if (encodedLocalState === null) {
            return null;
        }
        const localState = JSON.parse(
            decodeURIComponent(atob(encodedLocalState))
        );
        if (localState) {
            const state: SavedState = {};
            if (localState.sg !== undefined) state.showGrid = localState.sg;
            if (localState.ls !== undefined) state.logScale = localState.ls;
            if (localState.lx !== undefined)
                state.logXScale = localState.lx;
            if (localState.ip !== undefined)
                state.invertPanY = localState.ip;
            if (localState.vg !== undefined) {
                const hidden = localState.vg as string[];
                state.visibleGases = Object.fromEntries(
                    Object.keys(gasData).map((k) => [
                        k,
                        !hidden.includes(k),
                    ])
                );
            }
            if (localState.tmn !== undefined)
                state.viewTempMin = localState.tmn;
            if (localState.tmx !== undefined)
                state.viewTempMax = localState.tmx;
            if (localState.pmn !== undefined)
                state.viewPressMin = localState.pmn;
            if (localState.pmx !== undefined)
                state.viewPressMax = localState.pmx;
            if (localState.lk !== undefined) state.isLocked = localState.lk;
            if (localState.lt !== undefined)
                state.lockedTemp = localState.lt;
            if (localState.fl !== undefined) state.showFreezeLines = localState.fl;
            return state;
        }
    }
    return null;
}

export function calcTempMax(visibleGases: Record<string, boolean>): number {
    const visibleMaxValues = Object.entries(gasData)
        .filter(([key]) => visibleGases[key])
        .map(([, gas]) => gas.maxLiqK);

    if (visibleMaxValues.length === 0) {
        return 700;
    }

    const visibleMax = Math.max(...visibleMaxValues);
    const remainder = visibleMax % 100;
    return visibleMax - remainder + 100;
}

export function calcTempMin(visibleGases: Record<string, boolean>): number {
    const visibleMinValues = Object.entries(gasData)
        .filter(([key]) => visibleGases[key])
        .map(([, gas]) => gas.meltK);

    if (visibleMinValues.length === 0) {
        return 0;
    }

    const visibleMin = Math.min(...visibleMinValues);
    return visibleMin < 20 ? 0 : visibleMin - 5;
}

export function calcLogTempMin(visibleGases: Record<string, boolean>): number {
    const visibleMinValues = Object.entries(gasData)
        .filter(([key]) => visibleGases[key])
        .map(([, gas]) => gas.meltK);

    if (visibleMinValues.length === 0) {
        return 0.5;
    }

    const visibleMin = Math.min(...visibleMinValues);
    if (visibleMin < 0.5) return 0.5;
    if (visibleMin < 5) return 1;
    if (visibleMin < 10) return 5;
    if (visibleMin < 20) return 10;
    if (visibleMin < 50) return 20;
    if (visibleMin < 100) return 50;
    if (visibleMin < 200) return 100;
    if (visibleMin < 500) return 200;
    if (visibleMin < 1000) return 500;
    return 1000;
}

export function getSaved<T>(saved: SavedState | null, key: keyof SavedState, fallback: T): T {
    const val = saved?.[key];
    if (typeof val === typeof fallback) return val as T;
    return fallback;
}

export function isDefaultView(
    vTempMin: number,
    vTempMax: number,
    vPressMin: number,
    vPressMax: number,
    tempMin: number,
    tempMax: number,
    tempLogMin: number,
    tempLogMax: number,
    logScale: boolean,
    logXScale: boolean
): boolean {
    const expectedTempMin = logXScale ? tempLogMin : tempMin;
    const expectedTempMax = logXScale ? tempLogMax : tempMax;
    const expectedPressMin = logScale ? 5 : 0;
    const expectedPressMax = logScale ? 10000 : 6000;
    return (
        vTempMin === expectedTempMin &&
        vTempMax === expectedTempMax &&
        vPressMin === expectedPressMin &&
        vPressMax === expectedPressMax
    );
}

export let shareUrl = '';

export function saveLocalState(encoded: string) {
    try {
        localStorage.setItem(LOCAL_STATE_KEY, encoded);
    } catch { }
}

export function saveTheme(theme: Theme) {
    try {
        localStorage.setItem(THEME_KEY, theme);
    } catch { }
}

export function saveShowMiniLegend(showMiniLegend: boolean) {
    try {
        localStorage.setItem(SHOW_MINI_LEGEND_KEY, String(showMiniLegend));
    } catch { }
}

export function saveState(
    showGrid: boolean,
    logScale: boolean,
    logXScale: boolean,
    invertPanY: boolean,
    showFreezeLines: boolean,
    isLocked: boolean,
    lockedTemp: number | null,
    visibleGases: Record<string, boolean>,
    viewTempMin: number,
    viewTempMax: number,
    viewPressMin: number,
    viewPressMax: number
) {
    const allKeys = Object.keys(gasData);
    const hiddenKeys = allKeys.filter((k) => !visibleGases[k]);
    const state: Record<string, unknown> = {};
    if (hiddenKeys.length > 0 && hiddenKeys.length < allKeys.length) {
        state.vg = hiddenKeys;
    }
    if (showGrid !== true) state.sg = showGrid;
    if (logScale !== false) state.ls = logScale;
    if (logXScale !== false) state.lx = logXScale;
    if (invertPanY !== true) state.ip = invertPanY;
    if (showFreezeLines !== true) state.fl = showFreezeLines;
    if (isLocked !== false) state.lk = isLocked;
    if (lockedTemp !== null) state.lt = lockedTemp;
    if (viewTempMin >= HARD_TEMP_MIN || viewTempMax <= HARD_LOG_TEMP_MAX) {
        state.tmn = viewTempMin;
        state.tmx = viewTempMax;
    }
    if (
        viewPressMin >= HARD_PRESSURE_MIN ||
        viewPressMax <= HARD_LOG_PRESSURE_MAX
    ) {
        state.pmn = viewPressMin;
        state.pmx = viewPressMax;
    }
    try {
        const encoded = btoa(encodeURIComponent(JSON.stringify(state)));
        shareUrl =
            window.location.origin +
            window.location.pathname +
            '#' +
            encoded;
        if (window.location.hash.slice(1) === '') {
            saveLocalState(encoded);
        }
    } catch { }
}

export function sortedGasData(
    sortKey: SortKey,
    sortAsc: boolean
): [string, GasData][] {
    return (
        Object.entries(gasData) as [string, GasData][]
    ).toSorted((a, b) => {
        const [, ga] = a;
        const [, gb] = b;
        let cmp = 0;
        switch (sortKey) {
            case 'symbol':
                cmp = ga.symbol.localeCompare(gb.symbol);
                break;
            case 'name':
                cmp = ga.name.localeCompare(gb.name);
                break;
            case 'meltK':
                cmp = ga.meltK - gb.meltK;
                break;
            case 'minCondKPa':
                cmp = ga.minCondKPa - gb.minCondKPa;
                break;
            case 'maxLiqK':
                cmp = ga.maxLiqK - gb.maxLiqK;
                break;
            case 'maxKPa':
                cmp = ga.maxKPa - gb.maxKPa;
                break;
            case 'specificHeat':
                cmp = ga.specificHeat - gb.specificHeat;
                break;
            case 'latentHeat':
                cmp = ga.latentHeat - gb.latentHeat;
                break;
        }
        return sortAsc ? cmp : -cmp;
    });
}
