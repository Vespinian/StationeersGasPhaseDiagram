<script lang="ts">
    import {
        gasData,
        gasTuning,
        calcPressure,
        kToC,
        formatP,
    } from "$lib/gasData";
    import "$lib/PhaseDiagram.css";
    import oxygenIcon from "$lib/icons/oxygen.png";
    import nitrogenIcon from "$lib/icons/nitrogen.png";
    import pollutantIcon from "$lib/icons/pollutant.png";
    import hydrogenIcon from "$lib/icons/hydrogen.png";
    import heliumIcon from "$lib/icons/helium.png";
    import ozoneIcon from "$lib/icons/ozone.png";
    import methaneIcon from "$lib/icons/methane.png";
    import carbondioxideIcon from "$lib/icons/carbondioxide.png";
    import waterIcon from "$lib/icons/water.png";
    import nitrousoxideIcon from "$lib/icons/nitrousoxide.png";
    import pollutedwaterIcon from "$lib/icons/pollutedwater.png";
    import alcoholIcon from "$lib/icons/alcohol.png";
    import silanolIcon from "$lib/icons/silanol.png";
    import sodiumchlorideIcon from "$lib/icons/sodiumchloride.png";
    import hydrochloricacidIcon from "$lib/icons/hydrochloricacid.png";
    import hydrazineIcon from "$lib/icons/hydrazine.png";

    const gasIcons: Record<string, string> = {
        N2: nitrogenIcon,
        O2: oxygenIcon,
        H2: hydrogenIcon,
        X: pollutantIcon,
        CO2: carbondioxideIcon,
        N2O: nitrousoxideIcon,
        H2O: waterIcon,
        CH4: methaneIcon,
        HZ: hydrazineIcon,
        ALC: alcoholIcon,
        He: heliumIcon,
        NaCl: sodiumchlorideIcon,
        SiOH: silanolIcon,
        HCl: hydrochloricacidIcon,
        O3: ozoneIcon,
        PWa: pollutedwaterIcon,
    };

    function loadFromUrl() {
        try {
            const hash = window.location.hash.slice(1);
            if (!hash) return null;
            return JSON.parse(decodeURIComponent(atob(hash)));
        } catch {}
        return null;
    }

    function loadState(): Record<string, unknown> | null {
        const urlState = loadFromUrl();
        if (urlState) {
            try {
                const encoded = btoa(
                    encodeURIComponent(JSON.stringify(urlState)),
                );
                shareUrl =
                    window.location.origin +
                    window.location.pathname +
                    "#" +
                    encoded;
            } catch {}
            const state: Record<string, unknown> = {};
            if (urlState.sg !== undefined) state.showGrid = urlState.sg;
            if (urlState.ls !== undefined) state.logScale = urlState.ls;
            if (urlState.lx !== undefined) state.logXScale = urlState.lx;
            if (urlState.ip !== undefined) state.invertPanY = urlState.ip;
            if (urlState.vg !== undefined) {
                const hidden = urlState.vg as string[];
                state.visibleGases = Object.fromEntries(
                    Object.keys(gasData).map((k) => [k, !hidden.includes(k)]),
                );
            }
            if (urlState.tmn !== undefined) state.viewTempMin = urlState.tmn;
            if (urlState.tmx !== undefined) state.viewTempMax = urlState.tmx;
            if (urlState.pmn !== undefined) state.viewPressMin = urlState.pmn;
            if (urlState.pmx !== undefined) state.viewPressMax = urlState.pmx;
            if (urlState.lk !== undefined) state.isLocked = urlState.lk;
            if (urlState.lt !== undefined) state.lockedTemp = urlState.lt;
            return state;
        }
        return null;
    }

    const THEME_KEY = "stationeers-gas-diagram-theme";
    const SHOW_MINI_LEGEND_KEY = "stationeers-gas-diagram-show-mini-legend";

    function saveState() {
        const allKeys = Object.keys(gasData);
        const hiddenKeys = allKeys.filter((k) => !visibleGases[k]);
        const state: Record<string, unknown> = {};
        if (hiddenKeys.length > 0 && hiddenKeys.length < allKeys.length) {
            state.vg = hiddenKeys;
        }
        if (viewTempMin !== tempMin || viewTempMax !== tempMax) {
            state.tmn = viewTempMin;
            state.tmx = viewTempMax;
        }
        if (viewPressMin !== pressureMin || viewPressMax !== pressureMax) {
            state.pmn = viewPressMin;
            state.pmx = viewPressMax;
        }
        if (showGrid !== true) state.sg = showGrid;
        if (logScale !== false) state.ls = logScale;
        if (logXScale !== false) state.lx = logXScale;
        if (invertPanY !== true) state.ip = invertPanY;
        if (isLocked !== false) state.lk = isLocked;
        if (lockedTemp !== null) state.lt = lockedTemp;
        try {
            const encoded = btoa(encodeURIComponent(JSON.stringify(state)));
            shareUrl =
                window.location.origin +
                window.location.pathname +
                "#" +
                encoded;
            history.replaceState(null, "", window.location.pathname);
        } catch {}
    }

    function loadTheme(): "stationeers" | "light" | "dark" {
        try {
            const raw = localStorage.getItem(THEME_KEY);
            if (raw === "light" || raw === "dark" || raw === "stationeers") {
                return raw;
            }
        } catch {}
        return "stationeers";
    }

    function saveTheme() {
        try {
            localStorage.setItem(THEME_KEY, theme);
        } catch {}
    }

    function loadShowMiniLegend(): boolean {
        try {
            const raw = localStorage.getItem(SHOW_MINI_LEGEND_KEY);
            return raw === "true";
        } catch {}
        return false;
    }

    function saveShowMiniLegend() {
        try {
            localStorage.setItem(SHOW_MINI_LEGEND_KEY, String(showMiniLegend));
        } catch {}
    }

    const saved = loadState() as SavedState | null;
    const defaultVisibleGases = Object.fromEntries(
        Object.keys(gasData).map((k) => [k, k !== "He"]),
    );

    type SavedState = {
        showGrid?: boolean;
        logScale?: boolean;
        logXScale?: boolean;
        invertPanY?: boolean;
        visibleGases?: Record<string, boolean>;
        viewTempMin?: number;
        viewTempMax?: number;
        viewPressMin?: number;
        viewPressMax?: number;
        isLocked?: boolean;
        lockedTemp?: number | null;
    };

    function getSaved<T>(key: keyof SavedState, fallback: T): T {
        const val = saved?.[key];
        if (typeof val === typeof fallback) return val as T;
        return fallback;
    }

    // Force initial save after everything is mounted
    $effect(() => {
        if (canvas) {
            requestAnimationFrame(() => saveState());
        }
    });

    let showGrid = $state(getSaved("showGrid", true));
    let logScale = $state(getSaved("logScale", false));
    let logXScale = $state(getSaved("logXScale", false));
    let invertPanY = $state(getSaved("invertPanY", true));
    let theme = $state<"stationeers" | "light" | "dark">(loadTheme());
    let visibleGases: Record<string, boolean> = $state(
        getSaved("visibleGases", defaultVisibleGases),
    );

    type SortKey =
        | "symbol"
        | "name"
        | "meltK"
        | "minCondKPa"
        | "maxLiqK"
        | "maxKPa"
        | "specificHeat"
        | "latentHeat";
    let sortKey = $state<SortKey>("meltK");
    let sortAsc = $state(false);

    function handleSort(key: SortKey) {
        if (sortKey === key) {
            sortAsc = !sortAsc;
        } else {
            sortKey = key;
            sortAsc = true;
        }
    }

    const sortedGases = $derived(
        (
            Object.entries(gasData) as [string, (typeof gasData)[string]][]
        ).toSorted((a, b) => {
            const [, ga] = a;
            const [, gb] = b;
            let cmp = 0;
            switch (sortKey) {
                case "symbol":
                    cmp = ga.symbol.localeCompare(gb.symbol);
                    break;
                case "name":
                    cmp = ga.name.localeCompare(gb.name);
                    break;
                case "meltK":
                    cmp = ga.meltK - gb.meltK;
                    break;
                case "minCondKPa":
                    cmp = ga.minCondKPa - gb.minCondKPa;
                    break;
                case "maxLiqK":
                    cmp = ga.maxLiqK - gb.maxLiqK;
                    break;
                case "maxKPa":
                    cmp = ga.maxKPa - gb.maxKPa;
                    break;
                case "specificHeat":
                    cmp = ga.specificHeat - gb.specificHeat;
                    break;
                case "latentHeat":
                    cmp = ga.latentHeat - gb.latentHeat;
                    break;
            }
            return sortAsc ? cmp : -cmp;
        }),
    );

    function calcTempMax(): number {
        const visibleMax = Math.max(
            ...Object.entries(gasData)
                .filter(([key]) => visibleGases[key])
                .map(([, gas]) => gas.maxLiqK),
            700,
        );
        return Math.ceil(visibleMax / 100) * 100 + 100;
    }

    const tempMin = 1;
    const tempMax = $derived.by(() => calcTempMax());

    const pressureMin = 0.1;
    const pressureMax = 6500;

    const margin = { top: 40, right: 40, left: 80, bottom: 60 };

    // View state in data coordinates
    let viewTempMin = getSaved("viewTempMin", tempMin);
    let viewTempMax = getSaved("viewTempMax", calcTempMax());
    let viewPressMin = getSaved("viewPressMin", pressureMin);
    let viewPressMax = getSaved("viewPressMax", pressureMax);

    let canvas: HTMLCanvasElement;
    let canvasWidth = $state(1200);
    let canvasHeight = $state(700);
    let dpr = $state(1);

    function plotWidth(): number {
        return canvasWidth - margin.left - margin.right;
    }

    function plotHeight(): number {
        return canvasHeight - margin.top - margin.bottom;
    }

    function scaleX(tempK: number): number {
        if (logXScale) {
            const logMin = Math.log10(viewTempMin);
            const logMax = Math.log10(viewTempMax);
            const logT = Math.log10(tempK);
            return (
                margin.left +
                ((logT - logMin) / (logMax - logMin)) * plotWidth()
            );
        }
        return (
            margin.left +
            ((tempK - viewTempMin) / (viewTempMax - viewTempMin)) * plotWidth()
        );
    }

    function scaleY(pressure: number): number {
        if (logScale) {
            const logMin = Math.log10(viewPressMin);
            const logMax = Math.log10(viewPressMax);
            const logP = Math.log10(Math.max(pressure, viewPressMin));
            return (
                margin.top +
                plotHeight() -
                ((logP - logMin) / (logMax - logMin)) * plotHeight()
            );
        }
        return (
            margin.top +
            plotHeight() -
            ((pressure - viewPressMin) / (viewPressMax - viewPressMin)) *
                plotHeight()
        );
    }

    function invScaleX(svgX: number): number {
        if (logXScale) {
            const logMin = Math.log10(viewTempMin);
            const logMax = Math.log10(viewTempMax);
            const ratio = (svgX - margin.left) / plotWidth();
            return Math.pow(10, logMin + ratio * (logMax - logMin));
        }
        return (
            viewTempMin +
            ((svgX - margin.left) / plotWidth()) * (viewTempMax - viewTempMin)
        );
    }

    function invScaleY(svgY: number): number {
        if (logScale) {
            const logMin = Math.log10(viewPressMin);
            const logMax = Math.log10(viewPressMax);
            const ratio = 1 - (svgY - margin.top) / plotHeight();
            return Math.pow(10, logMin + ratio * (logMax - logMin));
        }
        return (
            viewPressMin +
            (1 - (svgY - margin.top) / plotHeight()) *
                (viewPressMax - viewPressMin)
        );
    }

    function niceStep(range: number, targetTicks: number): number {
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

    function generateTicks(min: number, max: number): number[] {
        const step = niceStep(max - min, 10);
        const ticks: number[] = [];
        const start = Math.ceil(min / step) * step;
        for (let t = start; t <= max; t += step) {
            ticks.push(Math.round(t * 1e6) / 1e6);
        }
        return ticks;
    }

    function generateLogTicks(min: number, max: number): number[] {
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

    function formatTickValue(v: number, isY: boolean): string {
        if (isY) {
            return `${Math.round(v)}`;
        }
        return `${Math.round(v)}K`;
    }

    function getThemeColors() {
        if (theme === "dark") {
            return {
                bg: "#101418",
                plotBg: "#0a0d10",
                grid: "rgba(255,255,255,0.06)",
                axis: "rgba(255,255,255,0.2)",
                tickText: "#c8cde0",
                tickTextSecondary: "#7a7f98",
                axisLabel: "#c8cde0",
                refLine: "#5b7fd6",
                refLine0K: "#7a9ae0",
                refLineRed: "#f07178",
                hoverLine: "#c8cde0",
                hoverLineH: "rgba(200,205,224,0.25)",
                hoverDotStroke: "#fff",
                tooltipBg: "rgba(16,20,24,0.95)",
                tooltipBorder: "rgba(255,255,255,0.1)",
                tooltipText: "#c8cde0",
                tooltipHeader: "#fff",
            };
        }
        if (theme === "light") {
            return {
                bg: "#e8e8e8",
                plotBg: "#f2f2f2",
                grid: "#d0d0d0",
                axis: "#888",
                tickText: "#202122",
                tickTextSecondary: "#666",
                axisLabel: "#202122",
                refLine: "#3366cc",
                refLine0K: "#6688dd",
                refLineRed: "#d33",
                hoverLine: "#202122",
                hoverLineH: "rgba(32,33,34,0.3)",
                hoverDotStroke: "#333",
                tooltipBg: "rgba(255,255,255,0.95)",
                tooltipBorder: "#a2a9b1",
                tooltipText: "#202122",
                tooltipHeader: "#000",
            };
        }
        return {
            bg: "#1a2233",
            plotBg: "#1e2a3d",
            grid: "rgba(100,140,200,0.12)",
            axis: "rgba(100,140,200,0.3)",
            tickText: "#b8c8e0",
            tickTextSecondary: "#7a8fa8",
            axisLabel: "#b8c8e0",
            refLine: "#5b7fd6",
            refLine0K: "#7a9ae0",
            refLineRed: "#ff4444",
            hoverLine: "#b8c8e0",
            hoverLineH: "rgba(184,200,224,0.3)",
            hoverDotStroke: "#fff",
            tooltipBg: "rgba(26,34,51,0.95)",
            tooltipBorder: "rgba(100,140,200,0.2)",
            tooltipText: "#b8c8e0",
            tooltipHeader: "#d0e0f0",
        };
    }

    function drawGraph() {
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const t = getThemeColors();

        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Background
        ctx.fillStyle = t.bg;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Plot area background
        ctx.fillStyle = t.plotBg;
        ctx.fillRect(margin.left, margin.top, plotWidth(), plotHeight());

        // Plot area clip
        ctx.save();
        ctx.beginPath();
        ctx.rect(margin.left, margin.top, plotWidth(), plotHeight());
        ctx.clip();

        // Grid
        if (showGrid) {
            const xTicks = logXScale
                ? generateLogTicks(viewTempMin, viewTempMax)
                : generateTicks(viewTempMin, viewTempMax);
            const yTicks = logScale
                ? generateLogTicks(viewPressMin, viewPressMax)
                : generateTicks(viewPressMin, viewPressMax);

            ctx.strokeStyle = t.grid;
            ctx.setLineDash([3, 3]);
            ctx.lineWidth = 1;

            for (const tick of xTicks) {
                const x = scaleX(tick);
                ctx.beginPath();
                ctx.moveTo(x, margin.top);
                ctx.lineTo(x, margin.top + plotHeight());
                ctx.stroke();
            }

            for (const tick of yTicks) {
                const y = scaleY(tick);
                ctx.beginPath();
                ctx.moveTo(margin.left, y);
                ctx.lineTo(margin.left + plotWidth(), y);
                ctx.stroke();
            }

            ctx.setLineDash([]);
        }

        // 0K reference line
        const x0k = scaleX(0);
        if (x0k >= margin.left && x0k <= margin.left + plotWidth()) {
            ctx.strokeStyle = t.refLine0K;
            ctx.setLineDash([5, 5]);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x0k, margin.top);
            ctx.lineTo(x0k, margin.top + plotHeight());
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // 0°C reference line
        const x0c = scaleX(273);
        if (x0c >= margin.left && x0c <= margin.left + plotWidth()) {
            ctx.strokeStyle = t.refLine;
            ctx.setLineDash([5, 5]);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x0c, margin.top);
            ctx.lineTo(x0c, margin.top + plotHeight());
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // 6 MPa reference line
        const y6mpa = scaleY(6000);
        if (y6mpa >= margin.top && y6mpa <= margin.top + plotHeight()) {
            ctx.strokeStyle = t.refLineRed;
            ctx.setLineDash([5, 5]);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(margin.left, y6mpa);
            ctx.lineTo(margin.left + plotWidth(), y6mpa);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Gas curves
        for (const [key, gas] of Object.entries(gasData)) {
            if (!visibleGases[key]) continue;
            const tuning = gasTuning[key];

            ctx.strokeStyle = gas.color;
            ctx.lineWidth = 3;
            ctx.beginPath();
            let started = false;

            for (
                let t = Math.max(tempMin, Math.floor(viewTempMin));
                t <= Math.min(tempMax, Math.ceil(viewTempMax));
                t += 1
            ) {
                const p = calcPressure(t, gas, tuning);
                if (p === null) {
                    started = false;
                    continue;
                }
                const x = scaleX(t);
                const y = scaleY(p);
                if (!started) {
                    ctx.moveTo(x, y);
                    started = true;
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();

            // Endpoint dots
            for (
                let t = Math.max(tempMin, Math.floor(viewTempMin));
                t <= Math.min(tempMax, Math.ceil(viewTempMax));
                t += 1
            ) {
                const curr = calcPressure(t, gas, tuning);
                if (curr === null) continue;
                const prev = calcPressure(t - 1, gas, tuning);
                const next = calcPressure(t + 1, gas, tuning);
                if (
                    (prev === null && next !== null) ||
                    (prev !== null && next === null)
                ) {
                    const x = scaleX(t);
                    const y = scaleY(curr);
                    ctx.fillStyle = gas.color;
                    ctx.beginPath();
                    ctx.arc(x, y, 5, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        // Hover (use locked state if locked, otherwise use hover state)
        const displayX = isLocked && lockedX !== null ? lockedX : hoveredX;
        const displayValues = isLocked ? lockedValues : hoveredValues;

        if (displayX !== null && displayValues.length > 0) {
            // Vertical cursor line
            ctx.strokeStyle = t.hoverLine;
            ctx.setLineDash([4, 4]);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(displayX, margin.top);
            ctx.lineTo(displayX, margin.top + plotHeight());
            ctx.stroke();
            ctx.setLineDash([]);

            // Horizontal lines and dots
            for (const { gasKey, value } of displayValues) {
                const g = gasData[gasKey];
                const y = scaleY(value);

                ctx.strokeStyle = t.hoverLineH;
                ctx.setLineDash([4, 4]);
                ctx.beginPath();
                ctx.moveTo(margin.left, y);
                ctx.lineTo(margin.left + plotWidth(), y);
                ctx.stroke();
                ctx.setLineDash([]);

                ctx.fillStyle = g.labelColor;
                ctx.strokeStyle = t.hoverDotStroke;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(displayX, y, 5, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }
        }

        ctx.restore(); // unclip

        // Axes
        ctx.strokeStyle = t.axis;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(margin.left, margin.top);
        ctx.lineTo(margin.left, margin.top + plotHeight());
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(margin.left, margin.top + plotHeight());
        ctx.lineTo(margin.left + plotWidth(), margin.top + plotHeight());
        ctx.stroke();

        // 0 kPa line
        const zeroY = scaleY(0);
        if (zeroY >= margin.top && zeroY <= margin.top + plotHeight()) {
            ctx.strokeStyle = "#ff4444";
            ctx.lineWidth = 1;
            ctx.setLineDash([8, 4]);
            ctx.beginPath();
            ctx.moveTo(margin.left, zeroY);
            ctx.lineTo(margin.left + plotWidth(), zeroY);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // X axis ticks
        const xTicks = logXScale
            ? generateLogTicks(viewTempMin, viewTempMax)
            : generateTicks(viewTempMin, viewTempMax);
        ctx.fillStyle = t.tickText;
        ctx.font = "14px sans-serif";
        ctx.textAlign = "center";
        for (const tick of xTicks) {
            const x = scaleX(tick);
            if (x < margin.left || x > margin.left + plotWidth()) continue;
            ctx.fillText(
                formatTickValue(tick, false),
                x,
                margin.top + plotHeight() + 20,
            );
            ctx.fillStyle = t.tickTextSecondary;
            ctx.fillText(`${kToC(tick)}°C`, x, margin.top + plotHeight() + 36);
            ctx.fillStyle = t.tickText;
        }

        // Y axis ticks
        const yTicks = logScale
            ? generateLogTicks(viewPressMin, viewPressMax)
            : generateTicks(viewPressMin, viewPressMax);
        ctx.fillStyle = t.tickText;
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        for (const tick of yTicks) {
            const y = scaleY(tick);
            if (y < margin.top || y > margin.top + plotHeight()) continue;
            ctx.fillText(formatTickValue(tick, true), margin.left - 10, y);
        }

        // Y axis label
        ctx.save();
        ctx.translate(18, margin.top + plotHeight() / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillStyle = t.axisLabel;
        ctx.font = "14px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Pressure (kPa)", 0, 0);
        ctx.restore();

        // X axis label
        ctx.fillStyle = t.axisLabel;
        ctx.font = "14px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(
            "Temperature",
            margin.left + plotWidth() / 2,
            canvasHeight - 10,
        );

        ctx.restore(); // un-scale
    }

    function resizeCanvas() {
        if (!canvas) return;
        const rect = canvas.parentElement!.getBoundingClientRect();
        dpr = window.devicePixelRatio || 1;
        canvasWidth = Math.max(600, rect.width);
        canvasHeight = Math.max(400, Math.min(700, window.innerHeight * 0.6));
        canvas.width = canvasWidth * dpr;
        canvas.height = canvasHeight * dpr;
        canvas.style.width = `${canvasWidth}px`;
        canvas.style.height = `${canvasHeight}px`;
        drawGraph();
    }

    let hoveredX = $state<number | null>(null);
    let hoveredTemp = $state<number | null>(null);
    let hoveredValues = $state<{ gasKey: string; value: number }[]>([]);
    let tooltipX = $state(0);
    let tooltipY = $state(0);

    let lockedX = $state<number | null>(null);
    let lockedTemp = $state<number | null>(null);
    let lockedValues = $state<{ gasKey: string; value: number }[]>([]);
    let lockedTooltipX = $state(0);
    let lockedTooltipY = $state(0);
    let isLocked = $state(false);

    function toggleLock() {
        isLocked = !isLocked;
        if (isLocked) {
            lockedX = hoveredX;
            lockedTemp = hoveredTemp;
            lockedValues = [...hoveredValues];
            lockedTooltipX = tooltipX;
            lockedTooltipY = tooltipY;
        } else {
            lockedX = null;
            lockedTemp = null;
            lockedValues = [];
        }
        drawGraph();
    }

    function updateLockedPosition() {
        if (isLocked && lockedTemp !== null) {
            lockedX = scaleX(lockedTemp);
            const values: { gasKey: string; value: number }[] = [];
            for (const [key, gas] of Object.entries(gasData)) {
                if (!visibleGases[key]) continue;
                const p = calcPressure(lockedTemp, gas, gasTuning[key]);
                if (p !== null) {
                    values.push({ gasKey: key, value: p });
                }
            }
            lockedValues = values;
            lockedTooltipX = Math.max(
                85,
                Math.min(lockedX + 85, canvasWidth - 200),
            );
            lockedTooltipY = Math.max(margin.top, 50);
        }
    }

    function updateHoverCursor(svgX: number) {
        const tempK = invScaleX(svgX);
        const rounded = Math.round(tempK);

        if (rounded >= tempMin && rounded <= tempMax) {
            hoveredX = svgX;
            hoveredTemp = rounded;

            const values: { gasKey: string; value: number }[] = [];
            for (const [key, gas] of Object.entries(gasData)) {
                if (!visibleGases[key]) continue;
                const p = calcPressure(rounded, gas, gasTuning[key]);
                if (p !== null) {
                    values.push({ gasKey: key, value: p });
                }
            }
            hoveredValues = values;

            tooltipX = Math.max(15, Math.min(svgX + 15, canvasWidth - 200));
            tooltipY = Math.max(margin.top, 50);
        } else {
            hoveredX = null;
            hoveredTemp = null;
            hoveredValues = [];
        }
    }

    function getSvgCoords(
        clientX: number,
        clientY: number,
    ): { x: number; y: number } {
        const rect = canvas.getBoundingClientRect();
        return { x: clientX - rect.left, y: clientY - rect.top };
    }

    function doRescaleY(svgY: number) {
        const dy = svgY - rescaleStartSvgY;
        const factor = 1 + dy / plotHeight();
        const center = (rescaleStartPressMin + rescaleStartPressMax) / 2;
        const halfRange = Math.max(
            1,
            ((rescaleStartPressMax - rescaleStartPressMin) / 2) * factor,
        );
        viewPressMin = Math.max(0.01, center - halfRange);
        viewPressMax = center + halfRange;
    }

    function doRescaleX(svgX: number) {
        const dx = svgX - rescaleStartSvgX;
        if (logXScale) {
            const logMin = Math.log10(rescaleStartTempMin);
            const logMax = Math.log10(rescaleStartTempMax);
            const logRange = logMax - logMin;
            const dLog = (dx / plotWidth()) * logRange;
            const newLogMin = logMin + dLog;
            const newLogMax = logMax + dLog;
            viewTempMin = Math.pow(10, newLogMin);
            viewTempMax = Math.pow(10, newLogMax);
        } else {
            const factor = 1 + dx / plotWidth();
            const newRange =
                (rescaleStartTempMax - rescaleStartTempMin) * factor;
            viewTempMin = rescaleStartTempMin;
            viewTempMax = rescaleStartTempMin + newRange;
        }
    }

    function doPan(svgX: number, svgY: number) {
        const dx = (svgX - panStartSvgX) / plotWidth();
        if (logXScale) {
            const logMin = Math.log10(panStartViewTempMin);
            const logMax = Math.log10(panStartViewTempMax);
            const logRange = logMax - logMin;
            const dLog = dx * logRange;
            viewTempMin = Math.pow(10, logMin - dLog);
            viewTempMax = Math.pow(10, logMax - dLog);
        } else {
            const tempDelta =
                panStartViewTempMin -
                dx * (panStartViewTempMax - panStartViewTempMin);
            const range = panStartViewTempMax - panStartViewTempMin;
            viewTempMin = tempDelta;
            viewTempMax = tempDelta + range;
        }

        const dy = (svgY - panStartSvgY) / plotHeight();
        const direction = invertPanY ? 1 : -1;

        if (logScale) {
            const logMin = Math.log10(panStartViewPressMin);
            const logMax = Math.log10(panStartViewPressMax);
            const logRange = logMax - logMin;
            const dLog = dy * logRange * direction;
            viewPressMin = Math.pow(10, logMin + dLog);
            viewPressMax = Math.pow(10, logMax + dLog);
        } else {
            const pressDelta =
                dy * (panStartViewPressMax - panStartViewPressMin) * direction;
            const pRange = panStartViewPressMax - panStartViewPressMin;
            let newPressMin = panStartViewPressMin + pressDelta;
            viewPressMin = newPressMin;
            viewPressMax = newPressMin + pRange;
        }
    }

    function doHover(svgX: number) {
        const tempK = invScaleX(svgX);
        const rounded = Math.round(tempK);

        if (tempK < tempMin || tempK > tempMax) {
            hoveredX = null;
            hoveredTemp = null;
            hoveredValues = [];
            return false;
        }

        hoveredX = svgX;
        hoveredTemp = rounded;

        const values: { gasKey: string; value: number }[] = [];
        for (const [key, gas] of Object.entries(gasData)) {
            if (!visibleGases[key]) continue;
            const p = calcPressure(rounded, gas, gasTuning[key]);
            if (p !== null) {
                values.push({ gasKey: key, value: p });
            }
        }
        hoveredValues = values;
        tooltipX = Math.max(15, Math.min(svgX + 15, canvasWidth - 200));
        tooltipY = Math.max(margin.top, 50);
        return true;
    }

    function doZoom(svgX: number, svgY: number, factor: number) {
        const tempAtCursor =
            isLocked && lockedTemp !== null ? lockedTemp : invScaleX(svgX);
        const pressAtCursor = invScaleY(svgY);

        if (logXScale) {
            const logMin = Math.log10(viewTempMin);
            const logMax = Math.log10(viewTempMax);
            const logAtCursor = Math.log10(tempAtCursor);
            const logRange = logMax - logMin;
            const newLogRange = logRange * factor;
            const offset = logAtCursor - logMin;
            const newLogMin = logAtCursor - offset * factor;
            const newLogMax = newLogMin + newLogRange;
            viewTempMin = Math.pow(10, newLogMin);
            viewTempMax = Math.pow(10, newLogMax);
        } else {
            const tempRange = viewTempMax - viewTempMin;
            const newTempRange = tempRange * factor;
            const offset = tempAtCursor - viewTempMin;
            const newOffset = offset * factor;
            viewTempMin = tempAtCursor - newOffset;
            viewTempMax = viewTempMin + newTempRange;
        }

        if (logScale) {
            const logMin = Math.log10(viewPressMin);
            const logMax = Math.log10(viewPressMax);
            const logAtCursor = Math.log10(pressAtCursor);
            const logRange = logMax - logMin;
            const newLogRange = logRange * factor;
            const offset = logAtCursor - logMin;
            const newLogMin = logAtCursor - offset * factor;
            const newLogMax = newLogMin + newLogRange;
            viewPressMin = Math.pow(10, newLogMin);
            viewPressMax = Math.pow(10, newLogMax);
        } else {
            const newPressRange = (viewPressMax - viewPressMin) * factor;
            const newPressMin =
                pressAtCursor - (pressAtCursor - viewPressMin) * factor;
            viewPressMin = newPressMin;
            viewPressMax = viewPressMin + newPressRange;
        }
    }

    function doZoomY(svgY: number, factor: number) {
        const pressAtCursor = invScaleY(svgY);

        if (logScale) {
            const logMin = Math.log10(viewPressMin);
            const logMax = Math.log10(viewPressMax);
            const logAtCursor = Math.log10(pressAtCursor);
            const logRange = logMax - logMin;
            const newLogRange = logRange * factor;
            const offset = logAtCursor - logMin;
            const newLogMin = logAtCursor - offset * factor;
            const newLogMax = newLogMin + newLogRange;
            viewPressMin = Math.pow(10, newLogMin);
            viewPressMax = Math.pow(10, newLogMax);
        } else {
            const newPressRange = (viewPressMax - viewPressMin) * factor;
            const newPressMin =
                pressAtCursor - (pressAtCursor - viewPressMin) * factor;
            viewPressMin = newPressMin;
            viewPressMax = viewPressMin + newPressRange;
        }
    }

    function handleMouseMove(event: MouseEvent) {
        const { x: svgX, y: svgY } = getSvgCoords(event.clientX, event.clientY);

        if (isRescalingY) {
            doRescaleY(svgY);
            updateLockedPosition();
            updateHoverCursor(svgX);
            drawGraph();
            return;
        }

        if (isRescalingX) {
            doRescaleX(svgX);
            updateLockedPosition();
            updateHoverCursor(svgX);
            drawGraph();
            return;
        }

        if (isPanning) {
            doPan(svgX, svgY);
            updateLockedPosition();
            updateHoverCursor(svgX);
            drawGraph();
            return;
        }

        if (!doHover(svgX)) {
            drawGraph();
        } else {
            drawGraph();
        }
    }

    function handleMouseLeave() {
        hoveredX = null;
        hoveredTemp = null;
        hoveredValues = [];
        isRescalingX = false;
        isRescalingY = false;
        isPanning = false;
        drawGraph();
    }

    function handleCanvasMouseOver(event: MouseEvent) {
        const { x: svgX, y: svgY } = getSvgCoords(event.clientX, event.clientY);

        if (isPanning || isRescalingY || isRescalingX) return;

        if (
            svgX < margin.left &&
            svgY >= margin.top &&
            svgY <= margin.top + plotHeight()
        ) {
            canvas.classList.add("rescale-y");
            canvas.classList.remove("rescale-x");
        } else if (
            svgY > margin.top + plotHeight() &&
            svgX >= margin.left &&
            svgX <= margin.left + plotWidth()
        ) {
            canvas.classList.add("rescale-x");
            canvas.classList.remove("rescale-y");
        } else {
            canvas.classList.remove("rescale-y");
            canvas.classList.remove("rescale-x");
        }
    }

    // Pan state
    let isPanning = $state(false);
    let panStartSvgX = $state(0);
    let panStartSvgY = $state(0);
    let panStartViewTempMin = $state(0);
    let panStartViewTempMax = $state(0);
    let panStartViewPressMin = $state(0);
    let panStartViewPressMax = $state(0);

    // Axis rescale state
    let isRescalingY = $state(false);
    let rescaleStartSvgY = $state(0);
    let rescaleStartPressMin = $state(0);
    let rescaleStartPressMax = $state(0);

    let isRescalingX = $state(false);
    let rescaleStartSvgX = $state(0);
    let rescaleStartTempMin = $state(0);
    let rescaleStartTempMax = $state(0);

    function startInteraction(svgX: number, svgY: number) {
        if (
            svgX < margin.left &&
            svgY >= margin.top &&
            svgY <= margin.top + plotHeight()
        ) {
            isRescalingY = true;
            rescaleStartSvgY = svgY;
            rescaleStartPressMin = viewPressMin;
            rescaleStartPressMax = viewPressMax;
            return;
        }

        if (
            svgY > margin.top + plotHeight() &&
            svgX >= margin.left &&
            svgX <= margin.left + plotWidth()
        ) {
            isRescalingX = true;
            rescaleStartSvgX = svgX;
            rescaleStartTempMin = viewTempMin;
            rescaleStartTempMax = viewTempMax;
            return;
        }

        isPanning = true;
        panStartSvgX = svgX;
        panStartSvgY = svgY;
        panStartViewTempMin = viewTempMin;
        panStartViewTempMax = viewTempMax;
        panStartViewPressMin = viewPressMin;
        panStartViewPressMax = viewPressMax;
    }

    function handleMouseDown(event: MouseEvent) {
        if (event.button !== 0) return;
        const { x: svgX, y: svgY } = getSvgCoords(event.clientX, event.clientY);
        startInteraction(svgX, svgY);
    }

    function handleMouseUp() {
        isPanning = false;
        isRescalingY = false;
        isRescalingX = false;
    }

    function handleTouchMove(event: TouchEvent) {
        if (event.touches.length === 1) {
            const { x: svgX } = getSvgCoords(
                event.touches[0].clientX,
                event.touches[0].clientY,
            );
            if (!doHover(svgX)) {
                hoveredX = null;
                hoveredTemp = null;
                hoveredValues = [];
            }
            drawGraph();
        }
    }

    function handleWheel(event: WheelEvent) {
        event.preventDefault();
        const { x: svgX, y: svgY } = getSvgCoords(event.clientX, event.clientY);

        const factor = event.deltaY > 0 ? 1.15 : 1 / 1.15;

        if (event.ctrlKey) {
            if (logXScale) {
                const logMin = Math.log10(viewTempMin);
                const logMax = Math.log10(viewTempMax);
                const logAtSvgX = Math.log10(invScaleX(svgX));
                const logRange = logMax - logMin;
                const newLogRange = logRange * factor;
                const offset = logAtSvgX - logMin;
                const newLogMin = logAtSvgX - offset * factor;
                const newLogMax = newLogMin + newLogRange;
                viewTempMin = Math.pow(10, newLogMin);
                viewTempMax = Math.pow(10, newLogMax);
            } else {
                const newTempRange = (viewTempMax - viewTempMin) * factor;
                viewTempMin = svgX - (svgX - viewTempMin) * factor;
                viewTempMax = viewTempMin + newTempRange;
            }
        } else if (event.shiftKey) {
            doZoomY(svgY, factor);
        } else {
            doZoom(svgX, svgY, factor);
        }

        updateLockedPosition();
        drawGraph();
    }

    function resetView() {
        if (logXScale) {
            viewTempMin = 10;
            viewTempMax = visibleGases["NaCl"] ? 5000 : 1000;
        } else {
            viewTempMin = tempMin;
            viewTempMax = tempMax;
        }
        viewPressMin = logScale ? 5 : pressureMin;
        viewPressMax = logScale ? 10000 : 6500;
        updateLockedPosition();
        drawGraph();
    }

    function toggleGas(gasKey: string) {
        visibleGases = { ...visibleGases, [gasKey]: !visibleGases[gasKey] };
        updateLockedPosition();
    }

    function resetGases() {
        visibleGases = Object.fromEntries(
            Object.keys(gasData).map((k) => [k, k !== "He"]),
        );
        updateLockedPosition();
    }

    $effect(() => {
        void visibleGases;
        void showGrid;
        void theme;
        drawGraph();
    });

    let prevLogScale = $state(false);
    let prevLogXScale = $state(false);
    let showHelp = $state(false);
    let showMiniLegend = $state(loadShowMiniLegend());
    let shareText = $state("Share");
    let shareUrl = $state("");
    let showShareUrl = $state(false);
    let urlGenerated = $state(false);

    async function copyShare() {
        shareUrl = "";
        saveState();
        setTimeout(async () => {
            urlGenerated = true;
            setTimeout(() => (urlGenerated = false), 1500);
            try {
                await navigator.clipboard.writeText(shareUrl);
                shareText = "Copied!";
            } catch {
                shareText = "Failed";
            }
        }, 0);
        showShareUrl = true;
        setTimeout(function () {
            shareText = "Share";
        }, 1500);
    }

    $effect(() => {
        if (!shareUrl) {
            try {
                const hash = window.location.hash.slice(1);
                if (hash) {
                    shareUrl =
                        window.location.origin +
                        window.location.pathname +
                        "#" +
                        hash;
                }
            } catch {}
        }
    });

    $effect(() => {
        if (prevLogScale && !logScale) {
            viewPressMax = pressureMax;
            viewPressMin = pressureMin;
        } else if (!prevLogScale && logScale) {
            viewPressMax = 10000;
            viewPressMin = 5;
        }
        prevLogScale = logScale;
        drawGraph();
    });

    $effect(() => {
        if (prevLogXScale && !logXScale) {
            viewTempMin = tempMin;
            viewTempMax = tempMax;
        } else if (!prevLogXScale && logXScale) {
            viewTempMin = 10;
            viewTempMax = visibleGases["NaCl"] ? 5000 : 1000;
        }
        prevLogXScale = logXScale;
        drawGraph();
    });

    $effect(() => {
        document.body.classList.remove("light-mode", "dark-mode");
        document.documentElement.classList.remove("light-mode", "dark-mode");
        if (theme === "light") {
            document.body.classList.add("light-mode");
            document.documentElement.classList.add("light-mode");
        } else if (theme === "dark") {
            document.body.classList.add("dark-mode");
            document.documentElement.classList.add("dark-mode");
        }
        saveTheme();
    });

    $effect(() => {
        void showMiniLegend;
        saveShowMiniLegend();
    });

    $effect(() => {
        if (!canvas) return;
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);
        return () => window.removeEventListener("resize", resizeCanvas);
    });

    let initLock = $state(false);
    let initSave = $state(true);

    $effect(() => {
        if (!canvas || initLock) return;
        if (saved && saved.isLocked && typeof saved.lockedTemp === "number") {
            initSave = false;
            isLocked = true;
            const temp = saved.lockedTemp as number;
            lockedTemp = temp;
            const values: { gasKey: string; value: number }[] = [];
            for (const [key, gas] of Object.entries(gasData)) {
                if (!visibleGases[key]) continue;
                const p = calcPressure(temp, gas, gasTuning[key]);
                if (p !== null) {
                    values.push({ gasKey: key, value: p });
                }
            }
            lockedValues = values;
            updateLockedPosition();
            drawGraph();
        }
        initLock = true;
    });

    $effect(() => {
        void showGrid;
        void logScale;
        void logXScale;
        void invertPanY;
        void visibleGases;
        void sortKey;
        void sortAsc;
        void viewTempMin;
        void viewTempMax;
        void viewPressMin;
        void viewPressMax;
        void theme;
        void isLocked;
        void lockedTemp;
        if (initSave) saveState();
    });

    $effect(() => {
        window.addEventListener("beforeunload", saveState);
        return () => window.removeEventListener("beforeunload", saveState);
    });

    $effect(() => {
        function handleKey(e: KeyboardEvent) {
            if (e.code === "KeyL" && !e.ctrlKey && !e.metaKey && !e.altKey) {
                e.preventDefault();
                toggleLock();
            }
        }
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    });
</script>

<div
    class="container"
    class:light-mode={theme === "light"}
    class:dark-mode={theme === "dark"}
>
    <h2>Stationeers Gas Phase Diagram</h2>
    <p class="subtitle">
        Saturation curves - above line = liquid possible, below = gas only
    </p>

    <div class="controls">
        <div class="control-row">
            <label>
                <input type="checkbox" bind:checked={showGrid} />
                Grid
            </label>
            <label>
                <input type="checkbox" bind:checked={logScale} />
                Log Y Scale
            </label>
            <label>
                <input type="checkbox" bind:checked={logXScale} />
                Log X Scale
            </label>
            <label>
                <input type="checkbox" bind:checked={invertPanY} />
                Invert Y Pan
            </label>
        </div>
        <div class="control-row">
            <button onclick={resetView} class="btn">Reset View</button>
            <button onclick={resetGases} class="btn">Reset Gas Selection</button
            >
            <button onclick={copyShare} class="btn">{shareText}</button>
            <button
                onclick={() => (showMiniLegend = !showMiniLegend)}
                class="btn">Legend</button
            >
            <button onclick={() => (showHelp = !showHelp)} class="btn"
                >[?]</button
            >
        </div>
    </div>

    {#if showShareUrl}
        <div class="share-row">
            <input
                type="text"
                readonly
                value={shareUrl}
                class="share-url"
                class:share-url-glow={urlGenerated}
                onclick={(e) => (e.target as HTMLInputElement).select()}
            />
            <button
                onclick={() => {
                    showShareUrl = false;
                    shareText = "Share";
                }}
                class="share-close">×</button
            >
        </div>
    {/if}

    {#if showHelp}
        <div class="help-tooltip">
            <h3>Theme</h3>
            <ul>
                <li>
                    <select bind:value={theme} class="theme-select">
                        <option value="stationeers">Stationeers</option>
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                    </select>
                </li>
            </ul>
            <h3>Controls</h3>
            <ul>
                <li><strong>Scroll wheel</strong> — Zoom both axes</li>
                <li>
                    <strong>Ctrl + Scroll</strong> — Zoom X-axis (temperature)
                </li>
                <li>
                    <strong>Shift + Scroll</strong> — Zoom Y-axis (pressure)
                </li>
                <li><strong>Click + drag</strong> — Pan the view</li>
                <li>
                    <strong>Drag Y-axis labels</strong> — Rescale pressure axis
                </li>
                <li>
                    <strong>Drag X-axis labels</strong> — Rescale temperature axis
                </li>
                <li>
                    <strong>L</strong> — Lock/unlock cursor at current position
                </li>
                <li>
                    <strong>Click legend row</strong> — Toggle gas visibility
                </li>
                <li>
                    <strong>Click column headers</strong> — Sort the legend table
                </li>
                <li>
                    <strong>Legend button</strong> — Show/hide mini legend on chart
                </li>
                <li>
                    <strong>Share button</strong> — Copy shareable URL to clipboard
                </li>
            </ul>
        </div>
    {/if}

    <div class="chart-wrapper">
        {#if showMiniLegend}
            <div class="mini-legend">
                {#each Object.entries(gasData) as [key, gas] (key)}
                    <div
                        class="mini-legend-item"
                        class:hidden={!visibleGases[key]}
                        onclick={() => (visibleGases[key] = !visibleGases[key])}
                        onkeydown={(e) => {
                            if (e.key === "Enter" || e.key === " ")
                                visibleGases[key] = !visibleGases[key];
                        }}
                        role="button"
                        tabindex="0"
                        title={gas.name}
                    >
                        <img src={gasIcons[key]} alt={gas.symbol} />
                    </div>
                {/each}
            </div>
        {/if}
        <canvas
            bind:this={canvas}
            onmousemove={handleMouseMove}
            onmouseleave={handleMouseLeave}
            onwheel={handleWheel}
            onmousedown={handleMouseDown}
            onmouseup={handleMouseUp}
            onmouseenter={handleCanvasMouseOver}
            ontouchmove={handleTouchMove}
            class:panning={isPanning}
            class:rescale-y={isRescalingY}
            class:rescale-x={isRescalingX}
        ></canvas>

        {#if (isLocked && lockedTemp !== null && lockedValues.length > 0) || (!isLocked && hoveredTemp !== null && hoveredValues.length > 0)}
            {@const displayTemp = (isLocked ? lockedTemp : hoveredTemp)!}
            <div
                class="tooltip"
                style="left: {isLocked
                    ? lockedTooltipX
                    : tooltipX}px; top: {isLocked
                    ? lockedTooltipY
                    : tooltipY}px;"
            >
                <div class="tooltip-header">
                    {displayTemp}K ({kToC(displayTemp)}°C)
                    {#if isLocked}
                        <span class="lock-icon">🔒</span>
                    {/if}
                </div>
                {#each isLocked ? lockedValues : hoveredValues as { gasKey, value } (gasKey)}
                    {@const g = gasData[gasKey]}
                    <div class="tooltip-row" style="color: {g.labelColor}">
                        <span
                            class="tooltip-dot"
                            style="background: {g.labelColor}"
                        ></span>
                        {g.symbol}: {Math.round(value)} kPa
                    </div>
                {/each}
            </div>
        {/if}
    </div>

    <!-- Legend table -->
    <table class="legend">
        <thead>
            <tr>
                <th>Gas</th>
                <th class="sortable" onclick={() => handleSort("name")}
                    >Name {#if sortKey === "name"}{sortAsc ? "▲" : "▼"}{/if}</th
                >
                <th class="sortable" onclick={() => handleSort("meltK")}
                    >Melt Point {#if sortKey === "meltK"}{sortAsc
                            ? "▲"
                            : "▼"}{/if}</th
                >
                <th class="sortable" onclick={() => handleSort("minCondKPa")}
                    >Min Pressure {#if sortKey === "minCondKPa"}{sortAsc
                            ? "▲"
                            : "▼"}{/if}</th
                >
                <th class="sortable" onclick={() => handleSort("maxLiqK")}
                    >Max Liquid {#if sortKey === "maxLiqK"}{sortAsc
                            ? "▲"
                            : "▼"}{/if}</th
                >
                <th class="sortable" onclick={() => handleSort("maxKPa")}
                    >Max Pressure {#if sortKey === "maxKPa"}{sortAsc
                            ? "▲"
                            : "▼"}{/if}</th
                >
                <th class="sortable" onclick={() => handleSort("specificHeat")}
                    >Specific Heat {#if sortKey === "specificHeat"}{sortAsc
                            ? "▲"
                            : "▼"}{/if}</th
                >
                <th class="sortable" onclick={() => handleSort("latentHeat")}
                    >Latent Heat {#if sortKey === "latentHeat"}{sortAsc
                            ? "▲"
                            : "▼"}{/if}</th
                >
            </tr>
        </thead>
        <tbody>
            {#key sortKey}
                {#each sortedGases as [key, gas] (key)}
                    <tr
                        class:disabled={!visibleGases[key]}
                        onclick={() => toggleGas(key)}
                    >
                        <td class="gas-cell">
                            <span
                                class="color-swatch"
                                style="background: {gas.color}"
                            ></span>
                            <img
                                class="gas-icon"
                                src={gasIcons[key]}
                                alt={gas.name}
                            />
                            <span class="symbol">{gas.symbol}</span>
                        </td>
                        <td class="name">{gas.name}</td>
                        <td>{gas.meltK} K ({kToC(gas.meltK)} °C)</td>
                        <td>{formatP(gas.minCondKPa)}</td>
                        <td>{gas.maxLiqK} K ({kToC(gas.maxLiqK)} °C)</td>
                        <td>{formatP(gas.maxKPa)}</td>
                        <td>{gas.specificHeat} J/mol·K</td>
                        <td>{gas.latentHeat} J/mol</td>
                    </tr>
                {/each}
            {/key}
        </tbody>
    </table>
</div>
