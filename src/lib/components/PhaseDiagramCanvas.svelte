<script lang="ts">
    import { onMount } from "svelte";
    import {
        gasData,
        gasTuning,
        calcPressure,
        kToC,
        type GasData,
    } from "$lib/gasData";
    import * as phaseCalculations from "$lib/phaseCalculations";
    import {
        type HoverValue,
        HARD_TEMP_MIN,
        HARD_TEMP_MAX,
        HARD_LOG_TEMP_MIN,
        HARD_LOG_TEMP_MAX,
        HARD_PRESSURE_MIN,
        HARD_PRESSURE_MAX,
        HARD_LOG_PRESSURE_MIN,
        HARD_LOG_PRESSURE_MAX,
    } from "$lib/stores/graphState";
    import { theme, themeColors } from "$lib/themeDefaults";
    import PhaseDiagramTooltip from "$lib/components/PhaseDiagramTooltip.svelte";
    import PhaseDiagramMiniLegend from "$lib/components/PhaseDiagramMiniLegend.svelte";

    interface Props {
        showGrid: boolean;
        logScale: boolean;
        logXScale: boolean;
        invertPanY: boolean;
        visibleGases: Record<string, boolean>;
        viewTempMin: number;
        viewTempMax: number;
        viewPressMin: number;
        viewPressMax: number;
        isLocked: boolean;
        showMiniLegend: boolean;
        sortedGases: [string, GasData][];
        graphMoved: boolean;
        onToggleGas: (key: string) => void;
        onGraphMovedChange: (moved: boolean) => void;
        onViewChange: (
            minT: number,
            maxT: number,
            minP: number,
            maxP: number,
        ) => void;
        onToggleLock: () => void;
    }

    let {
        showGrid,
        logScale,
        logXScale,
        invertPanY,
        visibleGases,
        viewTempMin,
        viewTempMax,
        viewPressMin,
        viewPressMax,
        isLocked,
        showMiniLegend,
        sortedGases,
        onToggleGas,
        onGraphMovedChange,
        onViewChange,
        onToggleLock,
    }: Props = $props();

    const {
        generateTicks,
        generateLogTicks,
        formatTickValue,
        scaleX: doScaleX,
        scaleY: doScaleY,
        invScaleX: doInvScaleX,
        invScaleY: doInvScaleY,
    } = phaseCalculations;

    const margin = { top: 40, right: 40, left: 80, bottom: 60 };

    let canvas: HTMLCanvasElement;
    let canvasWidth = $state(1200);
    let canvasHeight = $state(700);
    let dpr = $state(1);

    let hoveredX = $state<number | null>(null);
    let hoveredTemp = $state<number | null>(null);
    let hoveredValues = $state<HoverValue[]>([]);
    let tooltipX = $state(0);
    let tooltipY = $state(0);
    let tooltipFlipped = $state(false);

    let lockedXInternal = $state<number | null>(null);
    let lockedTempInternal = $state<number | null>(null);
    let lockedValuesInternal = $state<HoverValue[]>([]);
    let lockedTooltipXInternal = $state(0);
    let lockedTooltipYInternal = $state(0);
    let lockedTooltipFlipped = $state(false);

    let isPanning = $state(false);
    let panPrevSvgX = $state(0);
    let panPrevSvgY = $state(0);

    let localIsLocked = $state(false);

    $effect(() => {
        void isLocked;
        localIsLocked = isLocked;
    });

    function handleToggleLock() {
        localIsLocked = !localIsLocked;
        if (localIsLocked && hoveredTemp !== null && hoveredX !== null) {
            lockedTempInternal = hoveredTemp;
            lockedValuesInternal = [...hoveredValues];
            lockedXInternal = hoveredX;
            const tooltipWidth = 200;
            const flipThreshold = canvasWidth - tooltipWidth - 15;
            lockedTooltipFlipped = hoveredX > flipThreshold;
            lockedTooltipXInternal = lockedTooltipFlipped
                ? hoveredX - tooltipWidth - 15
                : hoveredX + 15;
            lockedTooltipYInternal = Math.max(margin.top, 50);
        } else {
            lockedTempInternal = null;
            lockedValuesInternal = [];
            lockedXInternal = null;
        }
        onToggleLock();
        drawGraph();
    }

    function plotWidth(): number {
        return canvasWidth - margin.left - margin.right;
    }

    function plotHeight(): number {
        return canvasHeight - margin.top - margin.bottom;
    }

    function scaleX(tempK: number): number {
        return doScaleX(
            tempK,
            viewTempMin,
            viewTempMax,
            margin,
            plotWidth(),
            logXScale,
        );
    }

    function scaleY(pressure: number): number {
        return doScaleY(
            pressure,
            viewPressMin,
            viewPressMax,
            margin,
            plotHeight(),
            logScale,
        );
    }

    function invScaleX(svgX: number): number {
        return doInvScaleX(
            svgX,
            viewTempMin,
            viewTempMax,
            margin,
            plotWidth(),
            logXScale,
        );
    }

    function invScaleY(svgY: number): number {
        return doInvScaleY(
            svgY,
            viewPressMin,
            viewPressMax,
            margin,
            plotHeight(),
            logScale,
        );
    }

    const gasColors = $derived.by(() => {
        const colors: Record<string, { color: string; labelColor: string }> =
            {};
        for (const [key, gas] of Object.entries(gasData)) {
            colors[key] = {
                color: phaseCalculations.getGasColor(gas, $theme),
                labelColor: phaseCalculations.getGasLabelColor(gas, $theme),
            };
        }
        return colors;
    });

    function tempMax(): number {
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

    function drawGraph() {
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const t = $themeColors;

        const xTicks = logXScale
            ? generateLogTicks(viewTempMin, viewTempMax)
            : generateTicks(viewTempMin, viewTempMax);
        const yTicks = logScale
            ? generateLogTicks(viewPressMin, viewPressMax)
            : generateTicks(viewPressMin, viewPressMax);

        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        ctx.fillStyle = t.bg;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        ctx.fillStyle = t.plotBg;
        ctx.fillRect(margin.left, margin.top, plotWidth(), plotHeight());

        ctx.save();
        ctx.beginPath();
        ctx.rect(margin.left, margin.top, plotWidth(), plotHeight());
        ctx.clip();

        if (showGrid) {
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

        for (const [key, gas] of Object.entries(gasData)) {
            if (!visibleGases[key] || key === "He") continue;
            const tuning = gasTuning[key];
            const color = gasColors[key];

            let started = false;
            for (
                let t = Math.max(Math.ceil(gas.meltK), Math.ceil(viewTempMin));
                t <= Math.min(Math.ceil(gas.maxLiqK), Math.ceil(viewTempMax));
                t += 1
            ) {
                const p = calcPressure(t, gas, tuning);
                if (p === null) {
                    started = false;
                    const x = scaleX(gas.maxLiqK);
                    const y = scaleY(gas.maxKPa);
                    ctx.lineTo(x, y);
                    ctx.stroke();
                    ctx.fillStyle = color.color;
                    ctx.beginPath();
                    ctx.arc(x, y, 5, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                }
                const x = scaleX(t);
                const y = scaleY(p);
                if (!started) {
                    ctx.fillStyle = color.color;
                    if (t === Math.ceil(gas.meltK)) {
                        ctx.beginPath();
                        ctx.arc(x, y, 5, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    ctx.strokeStyle = color.color;
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    started = true;
                    continue;
                } else {
                    ctx.lineTo(x, y);
                    if (t === Math.ceil(viewTempMax)) {
                        started = false;
                        ctx.stroke();
                    }
                }
            }
        }

        const displayX =
            localIsLocked && lockedXInternal !== null
                ? lockedXInternal
                : hoveredX;
        const displayValues = localIsLocked
            ? lockedValuesInternal
            : hoveredValues;

        if (displayX !== null && displayValues.length > 0) {
            ctx.strokeStyle = t.hoverLine;
            ctx.setLineDash([4, 4]);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(displayX, margin.top);
            ctx.lineTo(displayX, margin.top + plotHeight());
            ctx.stroke();
            ctx.setLineDash([]);

            for (const { gasKey, value } of displayValues) {
                const y = scaleY(value);

                ctx.strokeStyle = t.hoverLineH;
                ctx.setLineDash([4, 4]);
                ctx.beginPath();
                ctx.moveTo(margin.left, y);
                ctx.lineTo(margin.left + plotWidth(), y);
                ctx.stroke();
                ctx.setLineDash([]);

                ctx.fillStyle = gasColors[gasKey]?.labelColor;
                ctx.strokeStyle = t.hoverDotStroke;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(displayX, y, 5, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }
        }

        ctx.restore();

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

        ctx.fillStyle = t.tickText;
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        for (const tick of yTicks) {
            const y = scaleY(tick);
            if (y < margin.top || y > margin.top + plotHeight()) continue;
            ctx.fillText(formatTickValue(tick, true), margin.left - 10, y);
        }

        ctx.save();
        ctx.translate(18, margin.top + plotHeight() / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillStyle = t.axisLabel;
        ctx.font = "14px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Pressure (kPa)", 0, 0);
        ctx.restore();

        ctx.fillStyle = t.axisLabel;
        ctx.font = "14px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(
            "Temperature",
            margin.left + plotWidth() / 2,
            canvasHeight - 10,
        );

        ctx.restore();
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

    function updateLockedPosition() {
        if (localIsLocked && lockedTempInternal !== null) {
            lockedXInternal = scaleX(lockedTempInternal);
            const values: HoverValue[] = [];
            for (const [key, gas] of Object.entries(gasData)) {
                if (!visibleGases[key]) continue;
                const p = calcPressure(lockedTempInternal, gas, gasTuning[key]);
                if (p !== null) {
                    values.push({ gasKey: key, value: p });
                }
            }
            lockedValuesInternal = values;
            const tooltipWidth = 200;
            const flipThreshold = canvasWidth - tooltipWidth - 85;
            lockedTooltipFlipped = lockedXInternal > flipThreshold;
            lockedTooltipXInternal = lockedTooltipFlipped
                ? lockedXInternal - tooltipWidth - 15
                : Math.max(85, lockedXInternal + 85);
            lockedTooltipYInternal = Math.max(margin.top, 50);
        }
    }

    function updateHoverCursor(svgX: number) {
        const tempK = invScaleX(svgX);
        const rounded = Math.round(tempK);

        if (rounded >= 0 && rounded <= tempMax()) {
            hoveredX = svgX;
            hoveredTemp = rounded;

            const values: HoverValue[] = [];
            for (const [key, gas] of Object.entries(gasData)) {
                if (!visibleGases[key] || key === "He") continue;
                const p = calcPressure(rounded, gas, gasTuning[key]);
                if (p !== null) {
                    values.push({ gasKey: key, value: p });
                }
            }
            hoveredValues = values;

            const tooltipWidth = 200;
            const flipThreshold = canvasWidth - tooltipWidth - 15;
            tooltipFlipped = svgX > flipThreshold;
            tooltipX = tooltipFlipped ? svgX - tooltipWidth - 15 : svgX + 15;
            tooltipY = Math.max(margin.top, 50);
        } else {
            hoveredX = null;
            hoveredTemp = null;
            hoveredValues = [];
            tooltipX = 0;
            tooltipY = 0;
            tooltipFlipped = false;
        }
    }

    function getSvgCoords(
        clientX: number,
        clientY: number,
    ): { x: number; y: number } {
        const rect = canvas.getBoundingClientRect();
        return { x: clientX - rect.left, y: clientY - rect.top };
    }

    function doPan(svgX: number, svgY: number) {
        const dx = ((svgX - panPrevSvgX) / plotWidth()) * -1;
        if (logXScale) {
            const logMin = Math.log10(viewTempMin);
            const logMax = Math.log10(viewTempMax);
            const wantedDelta = (logMax - logMin) * dx;

            if (Math.pow(10, logMax + wantedDelta) > HARD_LOG_TEMP_MAX) {
                onViewChange(
                    viewTempMin,
                    HARD_LOG_TEMP_MAX,
                    viewPressMin,
                    viewPressMax,
                );
            } else if (Math.pow(10, logMin + wantedDelta) < HARD_LOG_TEMP_MIN) {
                onViewChange(
                    HARD_LOG_TEMP_MIN,
                    viewTempMax,
                    viewPressMin,
                    viewPressMax,
                );
            } else {
                onViewChange(
                    Math.pow(10, logMin + wantedDelta),
                    Math.pow(10, logMax + wantedDelta),
                    viewPressMin,
                    viewPressMax,
                );
            }
        } else {
            const wantedDelta = (viewTempMax - viewTempMin) * dx;

            if (viewTempMax + wantedDelta > HARD_TEMP_MAX) {
                const newMin = HARD_TEMP_MAX - (viewTempMax - viewTempMin);
                onViewChange(newMin, HARD_TEMP_MAX, viewPressMin, viewPressMax);
            } else if (viewTempMin + wantedDelta < HARD_TEMP_MIN) {
                const newMax = HARD_TEMP_MIN + (viewTempMax - viewTempMin);
                onViewChange(HARD_TEMP_MIN, newMax, viewPressMin, viewPressMax);
            } else {
                onViewChange(
                    viewTempMin + wantedDelta,
                    viewTempMax + wantedDelta,
                    viewPressMin,
                    viewPressMax,
                );
            }
        }

        const dy = (svgY - panPrevSvgY) / plotHeight();
        const direction = invertPanY ? 1 : -1;

        if (logScale) {
            const logMin = Math.log10(viewPressMin);
            const logMax = Math.log10(viewPressMax);
            const wantedDelta = (logMax - logMin) * dy * direction;

            if (Math.pow(10, logMax + wantedDelta) > HARD_LOG_PRESSURE_MAX) {
                onViewChange(
                    viewTempMin,
                    viewTempMax,
                    viewPressMin,
                    HARD_LOG_PRESSURE_MAX,
                );
            } else if (
                Math.pow(10, logMin + wantedDelta) < HARD_LOG_PRESSURE_MIN
            ) {
                onViewChange(
                    viewTempMin,
                    viewTempMax,
                    HARD_LOG_PRESSURE_MIN,
                    viewPressMax,
                );
            } else {
                onViewChange(
                    viewTempMin,
                    viewTempMax,
                    Math.pow(10, logMin + wantedDelta),
                    Math.pow(10, logMax + wantedDelta),
                );
            }
        } else {
            const wantedDelta = (viewPressMax - viewPressMin) * dy * direction;

            if (viewPressMax + wantedDelta > HARD_PRESSURE_MAX) {
                const newMin =
                    HARD_PRESSURE_MAX - (viewPressMax - viewPressMin);
                onViewChange(
                    viewTempMin,
                    viewTempMax,
                    newMin,
                    HARD_PRESSURE_MAX,
                );
            } else if (viewPressMin + wantedDelta < HARD_PRESSURE_MIN) {
                const newMax =
                    HARD_PRESSURE_MIN + (viewPressMax - viewPressMin);
                onViewChange(
                    viewTempMin,
                    viewTempMax,
                    HARD_PRESSURE_MIN,
                    newMax,
                );
            } else {
                onViewChange(
                    viewTempMin,
                    viewTempMax,
                    viewPressMin + wantedDelta,
                    viewPressMax + wantedDelta,
                );
            }
        }

        panPrevSvgY = svgY;
        panPrevSvgX = svgX;
        onGraphMovedChange(true);
    }

    function doHover(svgX: number): boolean {
        const tempK = invScaleX(svgX);
        const rounded = Math.round(tempK);

        if (tempK < HARD_TEMP_MIN || tempK > tempMax()) {
            hoveredX = null;
            hoveredTemp = null;
            hoveredValues = [];
            return false;
        }

        hoveredX = svgX;
        hoveredTemp = rounded;

        const values: HoverValue[] = [];
        for (const [key, gas] of Object.entries(gasData)) {
            if (!visibleGases[key] || key == "He") continue;
            const p = calcPressure(rounded, gas, gasTuning[key]);
            if (p !== null) {
                values.push({ gasKey: key, value: p });
            }
        }
        hoveredValues = values;
        const tooltipWidth = 200;
        const flipThreshold = canvasWidth - tooltipWidth - 15;
        tooltipFlipped = svgX > flipThreshold;
        tooltipX = tooltipFlipped ? svgX - tooltipWidth + 20 : svgX + 15;
        tooltipY = Math.max(margin.top, 50);
        return true;
    }

    function doZoom(svgX: number, svgY: number, factor: number) {
        const tempAtCursor =
            localIsLocked && lockedTempInternal !== null
                ? lockedTempInternal
                : invScaleX(svgX);
        const pressAtCursor = invScaleY(svgY);

        let newTempMin: number, newTempMax: number;

        if (logXScale) {
            const logMin = Math.log10(viewTempMin);
            const logMax = Math.log10(viewTempMax);
            const logAtCursor = Math.log10(tempAtCursor);
            const logRange = logMax - logMin;
            const newLogRange = logRange * factor;
            const offset = logAtCursor - logMin;
            const newLogMin = logAtCursor - offset * factor;
            const newLogMax = newLogMin + newLogRange;
            newTempMin = Math.max(HARD_LOG_TEMP_MIN, Math.pow(10, newLogMin));
            newTempMax = Math.min(HARD_LOG_TEMP_MAX, Math.pow(10, newLogMax));
        } else {
            const tempRange = viewTempMax - viewTempMin;
            const newTempRange = tempRange * factor;
            const offset = tempAtCursor - viewTempMin;
            const newOffset = offset * factor;
            newTempMin = Math.max(HARD_TEMP_MIN, tempAtCursor - newOffset);
            newTempMax = Math.min(HARD_TEMP_MAX, newTempMin + newTempRange);
        }

        let newPressMin: number, newPressMax: number;

        if (logScale) {
            const logMin = Math.log10(viewPressMin);
            const logMax = Math.log10(viewPressMax);
            const logAtCursor = Math.log10(pressAtCursor);
            const logRange = logMax - logMin;
            const newLogRange = logRange * factor;
            const offset = logAtCursor - logMin;
            const newLogMin = logAtCursor - offset * factor;
            const newLogMax = newLogMin + newLogRange;
            newPressMin = Math.max(
                HARD_LOG_PRESSURE_MIN,
                Math.pow(10, newLogMin),
            );
            newPressMax = Math.min(
                HARD_LOG_PRESSURE_MAX,
                Math.pow(10, newLogMax),
            );
        } else {
            const newPressRange = (viewPressMax - viewPressMin) * factor;
            const newPressMinRaw =
                pressAtCursor - (pressAtCursor - viewPressMin) * factor;
            newPressMin = Math.max(HARD_PRESSURE_MIN, newPressMinRaw);
            newPressMax = Math.min(
                HARD_PRESSURE_MAX,
                newPressMin + newPressRange,
            );
        }

        onViewChange(newTempMin, newTempMax, newPressMin, newPressMax);
        onGraphMovedChange(true);
    }

    function doZoomX(svgX: number, factor: number) {
        const tempAtCursor = invScaleX(svgX);

        if (logXScale) {
            const logMin = Math.log10(viewTempMin);
            const logMax = Math.log10(viewTempMax);
            const logAtCursor = Math.log10(tempAtCursor);
            const logRange = logMax - logMin;
            const newLogRange = logRange * factor;
            const offset = logAtCursor - logMin;
            const newLogMin = logAtCursor - offset * factor;
            const newLogMax = newLogMin + newLogRange;
            onViewChange(
                Math.pow(10, newLogMin),
                Math.pow(10, newLogMax),
                viewPressMin,
                viewPressMax,
            );
        } else {
            const newTempRange = (viewTempMax - viewTempMin) * factor;
            const newMin = svgX - (svgX - viewTempMin) * factor;
            onViewChange(
                newMin,
                newMin + newTempRange,
                viewPressMin,
                viewPressMax,
            );
        }
        onGraphMovedChange(true);
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
            onViewChange(
                viewTempMin,
                viewTempMax,
                Math.max(HARD_LOG_PRESSURE_MIN, Math.pow(10, newLogMin)),
                Math.min(HARD_LOG_PRESSURE_MAX, Math.pow(10, newLogMax)),
            );
        } else {
            const newPressRange = (viewPressMax - viewPressMin) * factor;
            const newPressMinRaw =
                pressAtCursor - (pressAtCursor - viewPressMin) * factor;
            onViewChange(
                viewTempMin,
                viewTempMax,
                Math.max(HARD_PRESSURE_MIN, newPressMinRaw),
                Math.min(HARD_PRESSURE_MAX, newPressMinRaw + newPressRange),
            );
        }
        onGraphMovedChange(true);
    }

    function handleMouseMove(event: MouseEvent) {
        const { x: svgX, y: svgY } = getSvgCoords(event.clientX, event.clientY);

        if (isPanning) {
            doPan(svgX, svgY);
            updateLockedPosition();
            updateHoverCursor(svgX);
            drawGraph();
            return;
        }

        doHover(svgX);
        drawGraph();
    }

    function handleMouseLeave() {
        hoveredX = null;
        hoveredTemp = null;
        hoveredValues = [];
        isPanning = false;
        drawGraph();
    }

    function handleCanvasMouseOver(event: MouseEvent) {
        const { x: svgX, y: svgY } = getSvgCoords(event.clientX, event.clientY);

        if (isPanning) return;

        if (
            svgX < margin.left &&
            svgY >= margin.top &&
            svgY <= margin.top + plotHeight()
        ) {
            canvas.style.cursor = "ns-resize";
        } else if (
            svgY > margin.top + plotHeight() &&
            svgX >= margin.left &&
            svgX <= margin.left + plotWidth()
        ) {
            canvas.style.cursor = "ew-resize";
        } else {
            canvas.style.cursor = "";
        }
    }

    function startInteraction(svgX: number, svgY: number) {
        isPanning = true;
        panPrevSvgX = svgX;
        panPrevSvgY = svgY;
    }

    function handleMouseDown(event: MouseEvent) {
        if (event.button === 1) {
            event.preventDefault();
            handleToggleLock();
            drawGraph();
            return;
        }
        if (event.button !== 0) return;
        const { x: svgX, y: svgY } = getSvgCoords(event.clientX, event.clientY);
        startInteraction(svgX, svgY);
    }

    function handleMouseUp() {
        isPanning = false;
    }

    function handleTouchMove(event: TouchEvent) {
        if (event.touches.length === 1) {
            const { x: svgX } = getSvgCoords(
                event.touches[0].clientX,
                event.touches[0].clientY,
            );
            doHover(svgX);
            drawGraph();
        }
    }

    function handleWheel(event: WheelEvent) {
        event.preventDefault();
        const { x: svgX, y: svgY } = getSvgCoords(event.clientX, event.clientY);

        const factor = event.deltaY > 0 ? 1.15 : 1 / 1.15;

        if (event.ctrlKey) {
            doZoomX(svgX, factor);
        } else if (event.shiftKey) {
            doZoomY(svgY, factor);
        } else {
            doZoom(svgX, svgY, factor);
        }

        updateLockedPosition();
        drawGraph();
    }

    onMount(() => {
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);
        return () => window.removeEventListener("resize", resizeCanvas);
    });

    $effect(() => {
        void visibleGases;
        void showGrid;
        void $theme;
        void viewTempMin;
        void viewTempMax;
        void viewPressMin;
        void viewPressMax;
        drawGraph();
    });
</script>

<div class="w-full overflow-x-auto relative">
    <canvas
        bind:this={canvas}
        onmousemove={handleMouseMove}
        onmouseleave={handleMouseLeave}
        onwheel={handleWheel}
        onmousedown={handleMouseDown}
        onmouseup={handleMouseUp}
        onmouseenter={handleCanvasMouseOver}
        ontouchmove={handleTouchMove}
        class="w-full h-auto rounded"
        class:cursor-grab={!isPanning}
        class:cursor-grabbing={isPanning}
    ></canvas>

    {#if showMiniLegend}
        <PhaseDiagramMiniLegend {visibleGases} {sortedGases} {onToggleGas} />
    {/if}

    {#if (localIsLocked && lockedTempInternal !== null && lockedValuesInternal.length > 0) || (!localIsLocked && hoveredTemp !== null && hoveredValues.length > 0)}
        <PhaseDiagramTooltip
            isLocked={localIsLocked}
            lockedTemp={localIsLocked ? lockedTempInternal : hoveredTemp}
            lockedValues={localIsLocked ? lockedValuesInternal : hoveredValues}
            lockedTooltipX={localIsLocked ? lockedTooltipXInternal : tooltipX}
            lockedTooltipY={localIsLocked ? lockedTooltipYInternal : tooltipY}
            tooltipFlipped={localIsLocked
                ? lockedTooltipFlipped
                : tooltipFlipped}
        />
    {/if}
</div>
