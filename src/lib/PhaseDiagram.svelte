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
    import PhaseDiagramCanvas from "$lib/components/PhaseDiagramCanvas.svelte";
    import PhaseDiagramLegend from "$lib/components/PhaseDiagramLegend.svelte";
    import PhaseDiagramControls from "$lib/components/PhaseDiagramControls.svelte";

    const saved = loadState() as any;

    let showGrid = $state(getSaved(saved, "showGrid", true));
    let logScale = $state(getSaved(saved, "logScale", false));
    let logXScale = $state(getSaved(saved, "logXScale", false));
    let invertPanY = $state(getSaved(saved, "invertPanY", true));
    let theme = $state<Theme>(loadTheme());

    const themeColors = $derived.by(() => {
        switch (theme) {
            case "light":
                return {
                    bg: "#e8e8e8",
                    text: "#202122",
                    subtitle: "#666",
                    controlsBg: "#f2f2f2",
                    controlsShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    inputBg: "#f2f2f2",
                    inputBorder: "#a2a9b1",
                    inputText: "#202122",
                    btnBg: "#fff",
                    btnText: "#202122",
                    btnBorder: "#a2a9b1",
                    helpBg: "#fff",
                    helpBorder: "#a2a9b1",
                    h3: "#202122",
                    selectBg: "#fff",
                    selectText: "#202122",
                    selectBorder: "#a2a9b1",
                };
            case "dark":
                return {
                    bg: "#101418",
                    text: "#c8cde0",
                    subtitle: "#7a7f98",
                    controlsBg: "#111",
                    controlsShadow: "none",
                    inputBg: "#111",
                    inputBorder: "#444",
                    inputText: "#ccc",
                    btnBg: "#222",
                    btnText: "#ccc",
                    btnBorder: "#444",
                    helpBg: "#111",
                    helpBorder: "#444",
                    h3: "#ccc",
                    selectBg: "#222",
                    selectText: "#ccc",
                    selectBorder: "#444",
                };
            default:
                return {
                    bg: "#1a2233",
                    text: "#b8c8e0",
                    subtitle: "#888",
                    controlsBg: "#1e2a3d",
                    controlsShadow: "none",
                    inputBg: "#1e2a3d",
                    inputBorder: "rgba(100,140,200,0.2)",
                    inputText: "#b8c8e0",
                    btnBg: "#25334a",
                    btnText: "#b8c8e0",
                    btnBorder: "rgba(100,140,200,0.2)",
                    helpBg: "#1e2a3d",
                    helpBorder: "rgba(100,140,200,0.2)",
                    h3: "#b8c8e0",
                    selectBg: "#25334a",
                    selectText: "#b8c8e0",
                    selectBorder: "rgba(100,140,200,0.2)",
                };
        }
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
    class="w-full p-5 font-sans min-h-screen"
    style:background-color={themeColors.bg}
    style:color={themeColors.text}
>
    <h2 class="text-center mb-2.5 text-white max-w-full">
        Stationeers Gas Phase Diagram
    </h2>
    <p class="text-center text-xs mb-5" style:color={themeColors.subtitle}>
        Saturation curves - above line = liquid possible, below = gas only
    </p>

    <PhaseDiagramControls
        {theme}
        {themeColors}
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
        onThemeChange={(t) => (theme = t)}
        onShowShareUrlChange={(v) => {
            showShareUrl = v;
            if (!v) shareText = "Share";
        }}
    />

    <PhaseDiagramCanvas
        {theme}
        {themeColors}
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
        {theme}
        {themeColors}
        {sortedGases}
        onSort={handleSort}
        onToggleGas={toggleGas}
    />
</div>
