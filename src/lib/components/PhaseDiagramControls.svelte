<script lang="ts">
    import type { Theme } from "$lib/stores/graphState";
    import { theme, themeColors } from "$lib/themeDefaults";

    interface Props {
        showGrid: boolean;
        logScale: boolean;
        logXScale: boolean;
        invertPanY: boolean;
        showMiniLegend: boolean;
        showHelp: boolean;
        showShareUrl: boolean;
        shareUrl: string;
        shareText: string;
        urlGenerated: boolean;
        onShowGridChange: (v: boolean) => void;
        onLogScaleChange: (v: boolean) => void;
        onLogXScaleChange: (v: boolean) => void;
        onInvertPanYChange: (v: boolean) => void;
        onResetView: () => void;
        onResetGases: () => void;
        onClearAllGases: () => void;
        onCopyShare: () => void;
        onToggleMiniLegend: () => void;
        onToggleHelp: () => void;
        onThemeChange: (t: Theme) => void;
        onShowShareUrlChange: (v: boolean) => void;
    }

    let {
        showGrid,
        logScale,
        logXScale,
        invertPanY,
        showMiniLegend,
        showHelp,
        showShareUrl,
        shareUrl,
        shareText,
        urlGenerated,
        onShowGridChange,
        onLogScaleChange,
        onLogXScaleChange,
        onInvertPanYChange,
        onResetView,
        onResetGases,
        onClearAllGases,
        onCopyShare,
        onToggleMiniLegend,
        onToggleHelp,
        onThemeChange,
        onShowShareUrlChange,
    }: Props = $props();

    function handleShowGridChange(e: Event) {
        const target = e.target as HTMLInputElement;
        onShowGridChange(target.checked);
    }

    function handleLogScaleChange(e: Event) {
        const target = e.target as HTMLInputElement;
        onLogScaleChange(target.checked);
    }

    function handleLogXScaleChange(e: Event) {
        const target = e.target as HTMLInputElement;
        onLogXScaleChange(target.checked);
    }

    function handleInvertPanYChange(e: Event) {
        const target = e.target as HTMLInputElement;
        onInvertPanYChange(target.checked);
    }
</script>

<div
    class="flex flex-col gap-2.5 mb-5 justify-center p-2.5 rounded-lg mx-auto flex-wrap"
    style:background-color={$themeColors.controlsBg}
    style:box-shadow={$themeColors.controlsShadow}
>
    <div class="flex gap-2 md:gap-5 justify-center flex-wrap">
        <label class="flex items-center gap-1.5 cursor-pointer">
            <input
                type="checkbox"
                checked={showGrid}
                onchange={handleShowGridChange}
            />
            Grid
        </label>
        <label class="flex items-center gap-1.5 cursor-pointer">
            <input
                type="checkbox"
                checked={logScale}
                onchange={handleLogScaleChange}
            />
            Log Y Scale
        </label>
        <label class="flex items-center gap-1.5 cursor-pointer">
            <input
                type="checkbox"
                checked={logXScale}
                onchange={handleLogXScaleChange}
            />
            Log X Scale
        </label>
        <label class="flex items-center gap-1.5 cursor-pointer">
            <input
                type="checkbox"
                checked={invertPanY}
                onchange={handleInvertPanYChange}
            />
            Invert Y Pan
        </label>
    </div>
    <div class="flex gap-2 md:gap-5 justify-center flex-wrap">
        <button
            onclick={onResetView}
            class="px-1 py-0.5 rounded cursor-pointer text-sm"
            style:background-color={$themeColors.btnBg}
            style:color={$themeColors.btnText}
            style:border="1px solid {$themeColors.btnBorder}">Reset View</button
        >
        <button
            onclick={onResetGases}
            class="px-1 py-0.5 rounded cursor-pointer text-sm"
            style:background-color={$themeColors.btnBg}
            style:color={$themeColors.btnText}
            style:border="1px solid {$themeColors.btnBorder}"
            >Reset Selection</button
        >
        <button
            onclick={onClearAllGases}
            class="px-1 py-0.5 rounded cursor-pointer text-sm"
            style:background-color={$themeColors.btnBg}
            style:color={$themeColors.btnText}
            style:border="1px solid {$themeColors.btnBorder}">Clear All</button
        >
        <button
            onclick={onCopyShare}
            class="px-1 py-0.5 rounded cursor-pointer text-sm"
            style:background-color={$themeColors.btnBg}
            style:color={$themeColors.btnText}
            style:border="1px solid {$themeColors.btnBorder}"
            >{shareText}</button
        >
        <button
            onclick={onToggleMiniLegend}
            class="px-1 py-0.5 rounded cursor-pointer text-sm"
            style:background-color={$themeColors.btnBg}
            style:color={$themeColors.btnText}
            style:border="1px solid {$themeColors.btnBorder}"
            >{showMiniLegend ? "Hide" : "Show"} Legend</button
        >
        <button
            onclick={onToggleHelp}
            class="px-1 py-0.5 rounded cursor-pointer text-sm"
            style:background-color={$themeColors.btnBg}
            style:color={$themeColors.btnText}
            style:border="1px solid {$themeColors.btnBorder}">[?]</button
        >
    </div>
</div>

{#if showShareUrl}
    <div class="flex justify-center items-center gap-2 mb-3.75">
        <input
            type="text"
            readonly
            value={shareUrl}
            class="w-full max-w-150 px-3 py-2 rounded text-xs font-mono"
            style:border="1px solid {$themeColors.inputBorder}"
            style:background-color={$themeColors.inputBg}
            style:color={$themeColors.inputText}
            class:animate-[inputGlow_1.5s_ease-out]={urlGenerated}
            onclick={(e) => (e.target as HTMLInputElement).select()}
        />
        <button
            onclick={() => onShowShareUrlChange(false)}
            class="bg-transparent border-none text-xl cursor-pointer p-1"
            style:color={$themeColors.btnText}>×</button
        >
    </div>
{/if}

{#if showHelp}
    <div
        class="max-w-100 mx-auto mb-3.75 rounded-lg p-5 text-sm leading-relaxed"
        style:background-color={$themeColors.helpBg}
        style:border="1px solid {$themeColors.helpBorder}"
        style:box-shadow={$theme === "light"
            ? "0 1px 3px rgba(0,0,0,0.1)"
            : "none"}
    >
        <h3 class="m-0 mb-2 text-base" style:color={$themeColors.h3}>Theme</h3>
        <ul class="m-0 pl-5">
            <li>
                <select
                    value={$theme}
                    onchange={(e) =>
                        onThemeChange(
                            (e.target as HTMLSelectElement).value as Theme,
                        )}
                    class="px-2 py-1 rounded text-sm cursor-pointer"
                    style:background-color={$themeColors.selectBg}
                    style:color={$themeColors.selectText}
                    style:border="1px solid {$themeColors.selectBorder}"
                >
                    <option value="stationeers">Stationeers</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                </select>
            </li>
        </ul>
        <h3 class="m-0 mb-2 text-base" style:color={$themeColors.h3}>
            Controls
        </h3>
        <ul class="m-0 pl-5">
            <li><strong>Scroll wheel</strong> — Zoom both axes</li>
            <li><strong>Ctrl + Scroll</strong> — Zoom X-axis (temperature)</li>
            <li><strong>Shift + Scroll</strong> — Zoom Y-axis (pressure)</li>
            <li><strong>Click + drag</strong> — Pan the view</li>
            <li>
                <strong>L</strong> or <strong>Middle mouse</strong> — Lock/unlock
                cursor at current position
            </li>
            <li><strong>Click legend row</strong> — Toggle gas visibility</li>
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
