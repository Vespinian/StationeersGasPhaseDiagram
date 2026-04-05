<script lang="ts">
    import { untrack } from "svelte";
    import { gasData, gasTuning, calcPressure } from "$lib/gasData";
    import "$lib/PhaseDiagram.css";
    import {
        type Theme,
        type SortKey,
        type HoverValue,
        loadState,
        loadTheme,
        loadShowMiniLegend,
        defaultVisibleGases,
        getSaved,
        isDefaultView,
        calcTempMax,
        calcTempMin,
        calcLogTempMin,
        saveState,
        saveTheme,
        saveShowMiniLegend,
        shareUrl,
        sortedGasData,
    } from "$lib/stores/graphState";
    import * as phaseCalculations from "$lib/phaseCalculations";
    import PhaseDiagramCanvas from "$lib/components/PhaseDiagramCanvas.svelte";
    import PhaseDiagramTooltip from "$lib/components/PhaseDiagramTooltip.svelte";
    import PhaseDiagramLegend from "$lib/components/PhaseDiagramLegend.svelte";
    import PhaseDiagramMiniLegend from "$lib/components/PhaseDiagramMiniLegend.svelte";

    const saved = loadState() as any;

    let showGrid = $state(getSaved(saved, "showGrid", true));
    let logScale = $state(getSaved(saved, "logScale", false));
    let logXScale = $state(getSaved(saved, "logXScale", false));
    let invertPanY = $state(getSaved(saved, "invertPanY", true));
    let theme = $state<Theme>(loadTheme());
    let visibleGases: Record<string, boolean> = $state(
        getSaved(saved, "visibleGases", defaultVisibleGases),
    );

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

    const sortedGases = $derived(sortedGasData(sortKey, sortAsc));

    function tempLogMax(): number {
        return visibleGases["NaCl"] ? 5000 : 1000;
    }

    const tempMax = $derived.by(() => calcTempMax(visibleGases));
    const tempMin = $derived.by(() => calcTempMin(visibleGases));
    const tempLogMin = $derived.by(() => calcLogTempMin(visibleGases));

    let viewTempMin = $state(
        getSaved(
            saved,
            "viewTempMin",
            calcTempMin(untrack(() => visibleGases)),
        ),
    );
    let viewTempMax = $state(
        getSaved(
            saved,
            "viewTempMax",
            untrack(() => calcTempMax(visibleGases)),
        ),
    );
    let viewPressMin = $state(getSaved(saved, "viewPressMin", 0));
    let viewPressMax = $state(getSaved(saved, "viewPressMax", 6000));

    let hoveredX = $state<number | null>(null);
    let hoveredTemp = $state<number | null>(null);
    let hoveredValues = $state<HoverValue[]>([]);
    let tooltipX = $state(0);
    let tooltipY = $state(0);

    let lockedX = $state<number | null>(null);
    let lockedTemp = $state<number | null>(null);
    let lockedValues = $state<HoverValue[]>([]);
    let lockedTooltipX = $state(0);
    let lockedTooltipY = $state(0);
    let isLocked = $state(false);

    let graphMoved = $state(
        !isDefaultView(
            saved?.viewTempMin ?? calcTempMin(visibleGases),
            saved?.viewTempMax ?? calcTempMax(visibleGases),
            saved?.viewPressMin ?? 0,
            saved?.viewPressMax ?? 6000,
            tempMin,
            tempMax,
            tempLogMin,
            tempLogMax(),
            logScale,
            logXScale,
        ),
    );

    function resetView() {
        if (logXScale) {
            viewTempMin = tempLogMin;
            viewTempMax = tempLogMax();
        } else {
            viewTempMin = tempMin;
            viewTempMax = tempMax;
        }
        if (logScale) {
            viewPressMin = 5;
        } else {
            viewPressMin = 0;
        }
        viewPressMax = logScale ? 10000 : 6000;
        graphMoved = false;
    }

    function toggleGas(gasKey: string) {
        visibleGases = { ...visibleGases, [gasKey]: !visibleGases[gasKey] };
        if (!graphMoved) {
            resetView();
        }
    }

    function resetGases() {
        visibleGases = Object.fromEntries(
            Object.keys(gasData).map((k) => [k, k !== "He"]),
        );
        if (graphMoved === false) {
            resetView();
        }
    }

    function clearAllGases() {
        visibleGases = Object.fromEntries(
            Object.keys(gasData).map((k) => [k, false]),
        );
    }

    let prevLogScale = $state(false);
    let prevLogXScale = $state(untrack(() => logXScale));
    let showHelp = $state(false);
    let showMiniLegend = $state(loadShowMiniLegend());
    let shareText = $state("Share");
    let urlGenerated = $state(false);
    let showShareUrl = $state(false);

    async function copyShare() {
        saveState(
            showGrid,
            logScale,
            logXScale,
            invertPanY,
            isLocked,
            lockedTemp,
            visibleGases,
            viewTempMin,
            viewTempMax,
            viewPressMin,
            viewPressMax,
        );
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
        if (prevLogScale && !logScale) {
            viewPressMax = 6000;
            viewPressMin = 5;
        } else if (!prevLogScale && logScale) {
            viewPressMax = 10000;
            viewPressMin = 5;
        }
        prevLogScale = logScale;
    });

    $effect(() => {
        if (prevLogXScale && !logXScale) {
            viewTempMin = tempMin;
            viewTempMax = tempMax;
        } else if (!prevLogXScale && logXScale) {
            viewTempMin = 10;
            viewTempMax = tempLogMax();
        }
        prevLogXScale = logXScale;
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
        saveTheme(theme);
    });

    $effect(() => {
        void showMiniLegend;
        saveShowMiniLegend(showMiniLegend);
    });

    $effect(() => {
        function handleKey(e: KeyboardEvent) {
            if (e.code === "KeyL" && !e.ctrlKey && !e.metaKey && !e.altKey) {
                e.preventDefault();
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
            }
        }
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    });

    let initSave = $state(true);

    $effect(() => {
        void showGrid;
        void logScale;
        void logXScale;
        void invertPanY;
        void visibleGases;
        void viewTempMin;
        void viewTempMax;
        void viewPressMin;
        void viewPressMax;
        void isLocked;
        void lockedTemp;
        if (initSave) {
            initSave = false;
            saveState(
                showGrid,
                logScale,
                logXScale,
                invertPanY,
                isLocked,
                lockedTemp,
                visibleGases,
                viewTempMin,
                viewTempMax,
                viewPressMin,
                viewPressMax,
            );
        } else {
            saveState(
                showGrid,
                logScale,
                logXScale,
                invertPanY,
                isLocked,
                lockedTemp,
                visibleGases,
                viewTempMin,
                viewTempMax,
                viewPressMin,
                viewPressMax,
            );
        }
    });

    $effect(() => {
        window.addEventListener("beforeunload", () => {
            saveState(
                showGrid,
                logScale,
                logXScale,
                invertPanY,
                isLocked,
                lockedTemp,
                visibleGases,
                viewTempMin,
                viewTempMax,
                viewPressMin,
                viewPressMax,
            );
        });
        return () =>
            window.removeEventListener("beforeunload", () => {
                saveState(
                    showGrid,
                    logScale,
                    logXScale,
                    invertPanY,
                    isLocked,
                    lockedTemp,
                    visibleGases,
                    viewTempMin,
                    viewTempMax,
                    viewPressMin,
                    viewPressMax,
                );
            });
    });

    let initLock = $state(false);

    $effect(() => {
        if (initLock) return;
        if (saved && saved.isLocked && typeof saved.lockedTemp === "number") {
            initSave = false;
            isLocked = true;
            const temp = saved.lockedTemp as number;
            lockedTemp = temp;
            const values: HoverValue[] = [];
            for (const [key, gas] of Object.entries(gasData)) {
                if (!visibleGases[key]) continue;
                const p = calcPressure(temp, gas, gasTuning[key]);
                if (p !== null) {
                    values.push({ gasKey: key, value: p });
                }
            }
            lockedValues = values;
            if (lockedTemp !== null) {
                lockedX = phaseCalculations.scaleX(
                    lockedTemp,
                    viewTempMin,
                    viewTempMax,
                    { top: 40, right: 40, left: 80, bottom: 60 },
                    1200 - 80 - 40,
                    logXScale,
                );
            }
        }
        initLock = true;
    });

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
    }

    function onHoveredChange(
        x: number | null,
        temp: number | null,
        values: HoverValue[],
        tx: number,
        ty: number,
    ) {
        hoveredX = x;
        hoveredTemp = temp;
        hoveredValues = values;
        tooltipX = tx;
        tooltipY = ty;
    }

    function onLockedChange(
        x: number | null,
        temp: number | null,
        values: HoverValue[],
        tx: number,
        ty: number,
    ) {
        lockedX = x;
        lockedTemp = temp;
        lockedValues = values;
        lockedTooltipX = tx;
        lockedTooltipY = ty;
    }

    function onGraphMovedChange(moved: boolean) {
        graphMoved = moved;
    }

    function onViewChange(
        minT: number,
        maxT: number,
        minP: number,
        maxP: number,
    ) {
        viewTempMin = minT;
        viewTempMax = maxT;
        viewPressMin = minP;
        viewPressMax = maxP;
    }
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
            <button onclick={resetGases} class="btn">Reset Selection</button>
            <button onclick={clearAllGases} class="btn">Clear All</button>
            <button onclick={copyShare} class="btn">{shareText}</button>
            <button
                onclick={() => (showMiniLegend = !showMiniLegend)}
                class="btn">{showMiniLegend ? "Hide" : "Show"} Legend</button
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
                    <strong>L</strong> or <strong>Middle mouse</strong> — Lock/unlock
                    cursor at current position
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
            <PhaseDiagramMiniLegend
                {visibleGases}
                {sortedGases}
                onToggleGas={toggleGas}
            />
        {/if}

        <PhaseDiagramCanvas
            {theme}
            {showGrid}
            {logScale}
            {logXScale}
            {invertPanY}
            {visibleGases}
            {viewTempMin}
            {viewTempMax}
            {viewPressMin}
            {viewPressMax}
            {isLocked}
            {lockedTemp}
            {lockedValues}
            {lockedX}
            {lockedTooltipX}
            {lockedTooltipY}
            {graphMoved}
            {onHoveredChange}
            {onLockedChange}
            {onGraphMovedChange}
            {onViewChange}
            onToggleLock={toggleLock}
        />

        <PhaseDiagramTooltip
            {isLocked}
            {lockedTemp}
            {lockedValues}
            {lockedTooltipX}
            {lockedTooltipY}
            {hoveredTemp}
            {hoveredValues}
            {tooltipX}
            {tooltipY}
            {theme}
        />
    </div>

    <PhaseDiagramLegend
        {visibleGases}
        {sortKey}
        {sortAsc}
        {theme}
        {sortedGases}
        onSort={handleSort}
        onToggleGas={toggleGas}
    />
</div>
