<script lang="ts">
    import type { GasData } from "$lib/gasData";
    import { themeColors } from "$lib/themeDefaults";
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

    interface Props {
        visibleGases: Record<string, boolean>;
        sortedGases: [string, GasData][];
        onToggleGas: (key: string) => void;
    }

    let { visibleGases, sortedGases, onToggleGas }: Props = $props();
</script>

<div
    class="absolute top-1/2 -translate-y-1/2 right-12 grid grid-cols-2 gap-1 p-1 rounded border"
    style:background-color={$themeColors.btnBg}
    style:border-color={$themeColors.btnBorder}
>
    {#each sortedGases as [key, gas] (key)}
        <div
            class="w-9 h-9 cursor-pointer rounded flex items-center justify-center transition-opacity touch-manipulation"
            class:opacity-30={!visibleGases[key]}
            onclick={() => onToggleGas(key)}
            onkeydown={(e) => {
                if (e.key === "Enter" || e.key === " ") onToggleGas(key);
            }}
            role="button"
            tabindex="0"
            title={gas.name}
        >
            <img
                class="w-9 h-9 object-contain"
                src={gasIcons[key]}
                alt={gas.symbol}
            />
        </div>
    {/each}
</div>
