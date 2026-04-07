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
        tooltipFlipped: boolean;
        theme: Theme;
        tc: {
            btnBg: string;
            btnBorder: string;
            text: string;
            btnText: string;
        };
    }

    let {
        isLocked,
        lockedTemp,
        lockedValues,
        lockedTooltipX,
        lockedTooltipY,
        tooltipFlipped,
        theme,
        tc,
    }: Props = $props();

    const displayTemp = $derived(lockedTemp);
    const displayValues = $derived(lockedValues);
</script>

{#if displayTemp !== null && displayValues.length > 0}
    <div
        class="absolute rounded p-2 pointer-events-none min-w-40 max-w-[200px] z-10 box-border"
        style:left="{lockedTooltipX}px"
        style:top="{lockedTooltipY}px"
        style:background-color={tc.btnBg}
        style:border="1px solid {tc.btnBorder}"
        style:transform={tooltipFlipped ? "translateX(-100%)" : "none"}
    >
        <div class="text-xs font-bold mb-1" style:color={tc.btnText}>
            {displayTemp}K ({kToC(displayTemp)}°C)
            {#if isLocked}
                <span class="ml-1.5 text-[11px]">🔒</span>
            {/if}
        </div>
        {#each displayValues as { gasKey, value } (gasKey)}
            {@const g = gasData[gasKey]}
            <div
                class="text-xs flex items-center gap-1.5"
                style:color={phaseCalculations.getGasLabelColor(g, theme)}
            >
                <span
                    class="w-2 h-2 rounded-full inline-block"
                    style:background={phaseCalculations.getGasLabelColor(g, theme)}
                ></span>
                {g.symbol}: {Math.round(value)} kPa
            </div>
        {/each}
    </div>
{/if}