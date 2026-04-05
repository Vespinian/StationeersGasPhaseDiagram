<script lang="ts">
    import type { Theme } from "$lib/stores/graphState";

    interface Props {
        showGrid: boolean;
        logScale: boolean;
        logXScale: boolean;
        invertPanY: boolean;
        showMiniLegend: boolean;
        showHelp: boolean;
        theme: Theme;
        showShareUrl: boolean;
        shareText: string;
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
        theme,
        showShareUrl,
        shareText,
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

<div class="controls">
    <div class="control-row">
        <label>
            <input
                type="checkbox"
                checked={showGrid}
                onchange={handleShowGridChange}
            />
            Grid
        </label>
        <label>
            <input
                type="checkbox"
                checked={logScale}
                onchange={handleLogScaleChange}
            />
            Log Y Scale
        </label>
        <label>
            <input
                type="checkbox"
                checked={logXScale}
                onchange={handleLogXScaleChange}
            />
            Log X Scale
        </label>
        <label>
            <input
                type="checkbox"
                checked={invertPanY}
                onchange={handleInvertPanYChange}
            />
            Invert Y Pan
        </label>
    </div>
    <div class="control-row">
        <button onclick={onResetView} class="btn">Reset View</button>
        <button onclick={onResetGases} class="btn">Reset Selection</button>
        <button onclick={onClearAllGases} class="btn">Clear All</button>
        <button onclick={onCopyShare} class="btn">{shareText}</button>
        <button onclick={onToggleMiniLegend} class="btn"
            >{showMiniLegend ? "Hide" : "Show"} Legend</button
        >
        <button onclick={onToggleHelp} class="btn">[?]</button>
    </div>
</div>

{#if showShareUrl}
    <div class="share-row">
        <input
            type="text"
            readonly
            value=""
            class="share-url share-url-glow"
            onclick={(e) => (e.target as HTMLInputElement).select()}
        />
        <button
            onclick={() => {
                onShowShareUrlChange(false);
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
                <select
                    value={theme}
                    onchange={(e) =>
                        onThemeChange(
                            (e.target as HTMLSelectElement).value as Theme,
                        )}
                    class="theme-select"
                >
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
