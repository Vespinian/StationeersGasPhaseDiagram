<script lang="ts">
    import { kToC } from "$lib/gasData";
    import * as graphHelpers from "$lib/graphHelpers";
    import { gasData } from "$lib/gasData";
    import type { HoverValue } from "$lib/stores/graphState";
    import { theme, themeColors } from "$lib/themeDefaults";

    interface Props {
        isLocked: boolean;
        lockedTemp: number | null;
        lockedValues: HoverValue[];
        lockedTooltipX: number;
        lockedTooltipY: number;
        tooltipFlipped: boolean;
    }

    let {
        isLocked,
        lockedTemp,
        lockedValues,
        lockedTooltipX,
        lockedTooltipY,
    }: Props = $props();

    const displayTemp = $derived(lockedTemp);
    const displayValues = $derived(lockedValues);
</script>

{#if displayTemp !== null && displayValues.length > 0}
    <div
        class="absolute rounded p-2 pointer-events-none w-40 z-10 box-border"
        style:left="{lockedTooltipX}px"
        style:top="{lockedTooltipY}px"
        style:background-color={$themeColors.btnBg}
        style:border="1px solid {$themeColors.btnBorder}"
    >
        <div class="text-xs font-bold mb-1" style:color={$themeColors.btnText}>
            {displayTemp}K ({kToC(displayTemp)}°C)
            {#if isLocked}
                <span class="ml-1.5 text-xs]">🔒</span>
            {/if}
        </div>
        {#each displayValues as { gasKey, value } (gasKey)}
            {@const g = gasData[gasKey]}
            <div
                class="text-xs flex items-center gap-1.5"
                style:color={graphHelpers.getGasLabelColor(g, $theme)}
            >
                <span
                    class="w-2 h-2 rounded-full inline-block"
                    style:background={graphHelpers.getGasLabelColor(g, $theme)}
                ></span>
                {g.symbol}: {Math.round(value)} kPa
            </div>
        {/each}
    </div>
{/if}
