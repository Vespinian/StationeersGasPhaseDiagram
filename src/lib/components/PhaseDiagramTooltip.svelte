<script lang="ts">
    import { kToC } from "$lib/gasData";
    import * as phaseCalculations from "$lib/phaseCalculations";
    import { gasData } from "$lib/gasData";
    import type { Theme, HoverValue } from "$lib/stores/graphState";

    interface Props {
        isLocked: boolean;
        lockedTemp: number | null;
        lockedValues: HoverValue[];
        lockedTooltipX: number;
        lockedTooltipY: number;
        hoveredTemp: number | null;
        hoveredValues: HoverValue[];
        tooltipX: number;
        tooltipY: number;
        theme: Theme;
    }

    let {
        isLocked,
        lockedTemp,
        lockedValues,
        lockedTooltipX,
        lockedTooltipY,
        hoveredTemp,
        hoveredValues,
        tooltipX,
        tooltipY,
        theme,
    }: Props = $props();
</script>

{#if (isLocked && lockedTemp !== null && lockedValues.length > 0) || (!isLocked && hoveredTemp !== null && hoveredValues.length > 0)}
    {@const displayTemp = (isLocked ? lockedTemp : hoveredTemp)!}
    <div
        class="tooltip"
        style="left: {isLocked ? lockedTooltipX : tooltipX}px; top: {isLocked
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
            <div
                class="tooltip-row"
                style="color: {phaseCalculations.getGasLabelColor(g, theme)}"
            >
                <span
                    class="tooltip-dot"
                    style="background: {phaseCalculations.getGasLabelColor(
                        g,
                        theme,
                    )}"
                ></span>
                {g.symbol}: {Math.round(value)} kPa
            </div>
        {/each}
    </div>
{/if}
