<script lang="ts">
    import { untrack } from "svelte";
    import { gasData } from "$lib/gasData";
    import {
        type Theme,
        type SortKey,
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
    import { defaultThemeColors, theme } from "$lib/themeDefaults";
    import PhaseDiagramCanvas from "$lib/components/PhaseDiagramCanvas.svelte";
    import PhaseDiagramLegend from "$lib/components/PhaseDiagramLegend.svelte";
    import PhaseDiagramControls from "$lib/components/PhaseDiagramControls.svelte";

    const saved = loadState() as any;

    let showGrid = $state(getSaved(saved, "showGrid", true));
    let logScale = $state(getSaved(saved, "logScale", false));
    let logXScale = $state(getSaved(saved, "logXScale", false));
    let invertPanY = $state(getSaved(saved, "invertPanY", true));
    let currentTheme = $state<Theme>(loadTheme());

    const themeColors = $derived(
        defaultThemeColors[currentTheme] ?? defaultThemeColors.stationeers,
    );

    $effect(() => {
        theme.set(currentTheme);
    });

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

    let isLocked = $state(false);

    let graphMoved = $state(
        !isDefaultView(
            saved?.viewTempMin ?? untrack(() => calcTempMin(visibleGases)),
            saved?.viewTempMax ?? untrack(() => calcTempMax(visibleGases)),
            saved?.viewPressMin ?? 0,
            saved?.viewPressMax ?? 6000,
            untrack(() => tempMin),
            untrack(() => tempMax),
            untrack(() => tempLogMin),
            untrack(() => tempLogMax()),
            untrack(() => logScale),
            untrack(() => logXScale),
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
            null,
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
        if (currentTheme === "light") {
            document.body.classList.add("light-mode");
            document.documentElement.classList.add("light-mode");
        } else if (currentTheme === "dark") {
            document.body.classList.add("dark-mode");
            document.documentElement.classList.add("dark-mode");
        }
        saveTheme(currentTheme);
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
        if (initSave) {
            initSave = false;
            saveState(
                showGrid,
                logScale,
                logXScale,
                invertPanY,
                isLocked,
                null,
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
                null,
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
                null,
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
                    null,
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
        if (saved && saved.isLocked) {
            isLocked = true;
        }
        initLock = true;
    });

    function toggleLock() {
        isLocked = !isLocked;
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
    class="w-full p-5 font-sans"
    style:background-color={themeColors.bg}
    style:color={themeColors.text}
>
    <h2 class="text-center mb-2.5 max-w-full" style:color={themeColors.text}>
        Stationeers Gas Phase Diagram
    </h2>
    <p class="text-center text-xs mb-5" style:color={themeColors.subtitle}>
        Saturation curves - above line = liquid possible, below = gas only
    </p>

    <PhaseDiagramControls
        {showGrid}
        {logScale}
        {logXScale}
        {invertPanY}
        {showMiniLegend}
        {showHelp}
        {showShareUrl}
        {shareUrl}
        {shareText}
        {urlGenerated}
        onShowGridChange={(v) => (showGrid = v)}
        onLogScaleChange={(v) => (logScale = v)}
        onLogXScaleChange={(v) => (logXScale = v)}
        onInvertPanYChange={(v) => (invertPanY = v)}
        onResetView={resetView}
        onResetGases={resetGases}
        onClearAllGases={clearAllGases}
        onCopyShare={copyShare}
        onToggleMiniLegend={() => (showMiniLegend = !showMiniLegend)}
        onToggleHelp={() => (showHelp = !showHelp)}
        onThemeChange={(t) => (currentTheme = t)}
        onShowShareUrlChange={(v) => {
            showShareUrl = v;
            if (!v) shareText = "Share";
        }}
    />

    <PhaseDiagramCanvas
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
        {graphMoved}
        {showMiniLegend}
        {sortedGases}
        onToggleGas={toggleGas}
        {onGraphMovedChange}
        {onViewChange}
        onToggleLock={toggleLock}
    />

    <PhaseDiagramLegend
        {visibleGases}
        {sortKey}
        {sortAsc}
        {sortedGases}
        onSort={handleSort}
        onToggleGas={toggleGas}
    />
</div>
