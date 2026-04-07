<script lang="ts">
    import { kToC, formatP, type GasData } from "$lib/gasData";
    import * as phaseCalculations from "$lib/phaseCalculations";
    import type { SortKey } from "$lib/stores/graphState";
    import { theme, themeColors } from "$lib/themeDefaults";
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
        sortKey: SortKey;
        sortAsc: boolean;
        sortedGases: [string, GasData][];
        onSort: (key: SortKey) => void;
        onToggleGas: (key: string) => void;
    }

    let {
        visibleGases,
        sortKey,
        sortAsc,
        sortedGases,
        onSort,
        onToggleGas,
    }: Props = $props();

    function handleSort(key: SortKey) {
        onSort(key);
    }

    function handleToggleGas(key: string) {
        onToggleGas(key);
    }
</script>

<div class="overflow-x-auto">
    <table class="w-full max-w-350 mx-auto mt-5 border-collapse text-sm align-">
        <thead>
            <tr>
                <th
                    class="text-left p-2 pb-3 font-semibold border-b-2 min-w-25"
                    style:border-color={$themeColors.btnBorder}
                    style:color={$themeColors.text}>Gas</th
                >
                <th
                    class="text-left p-2 pb-3 font-semibold border-b-2 cursor-pointer select-none"
                    style:border-color={$themeColors.btnBorder}
                    style:color={$themeColors.text}
                    onclick={() => handleSort("name")}
                    >Name {#if sortKey === "name"}{sortAsc ? "▲" : "▼"}{/if}</th
                >
                <th
                    class="text-left p-2 pb-3 font-semibold border-b-2 cursor-pointer select-none min-w-15"
                    style:border-color={$themeColors.btnBorder}
                    style:color={$themeColors.text}
                    onclick={() => handleSort("meltK")}
                    >Melt Point {#if sortKey === "meltK"}{sortAsc
                            ? "▲"
                            : "▼"}{/if}</th
                >
                <th
                    class="text-left p-2 pb-3 font-semibold border-b-2 cursor-pointer select-none"
                    style:border-color={$themeColors.btnBorder}
                    style:color={$themeColors.text}
                    onclick={() => handleSort("minCondKPa")}
                    >Min Pressure {#if sortKey === "minCondKPa"}{sortAsc
                            ? "▲"
                            : "▼"}{/if}</th
                >
                <th
                    class="text-left p-2 pb-3 font-semibold border-b-2 cursor-pointer select-none min-w-15"
                    style:border-color={$themeColors.btnBorder}
                    style:color={$themeColors.text}
                    onclick={() => handleSort("maxLiqK")}
                    >Max Liquid {#if sortKey === "maxLiqK"}{sortAsc
                            ? "▲"
                            : "▼"}{/if}</th
                >
                <th
                    class="text-left p-2 pb-3 font-semibold border-b-2 cursor-pointer select-none"
                    style:border-color={$themeColors.btnBorder}
                    style:color={$themeColors.text}
                    onclick={() => handleSort("maxKPa")}
                    >Max Pressure {#if sortKey === "maxKPa"}{sortAsc
                            ? "▲"
                            : "▼"}{/if}</th
                >
                <th
                    class="text-left p-2 pb-3 font-semibold border-b-2 cursor-pointer select-none"
                    style:border-color={$themeColors.btnBorder}
                    style:color={$themeColors.text}
                    onclick={() => handleSort("specificHeat")}
                    >Specific Heat {#if sortKey === "specificHeat"}{sortAsc
                            ? "▲"
                            : "▼"}{/if}</th
                >
                <th
                    class="text-left p-2 pb-3 font-semibold border-b-2 cursor-pointer select-none"
                    style:border-color={$themeColors.btnBorder}
                    style:color={$themeColors.text}
                    onclick={() => handleSort("latentHeat")}
                    >Latent Heat {#if sortKey === "latentHeat"}{sortAsc
                            ? "▲"
                            : "▼"}{/if}</th
                >
            </tr>
        </thead>
        <tbody>
            {#key sortKey}
                {#each sortedGases as [key, gas] (key)}
                    <tr
                        class="cursor-pointer transition-colors duration-150"
                        class:opacity-35={!visibleGases[key]}
                        onclick={() => handleToggleGas(key)}
                        style:color={$themeColors.text}
                    >
                        <td
                            class="p-1.5 border-b"
                            style:border-color={$themeColors.btnBorder}
                        >
                            <div class="flex items-center gap-2">
                                <span
                                    class="w-3 h-3 inline-block rounded border"
                                    style:background={phaseCalculations.getGasColor(
                                        gas,
                                        $theme,
                                    )}
                                    style:border-color={$theme === "light"
                                        ? "#a2a9b1"
                                        : "rgba(255,255,255,0.2)"}
                                ></span>
                                <img
                                    class="w-6 h-6"
                                    src={gasIcons[key]}
                                    alt={gas.name}
                                />
                                <span class="font-semibold">{gas.symbol}</span>
                            </div>
                        </td>
                        <td
                            class="p-1.5 border-b"
                            style:border-color={$themeColors.btnBorder}
                            >{gas.name}</td
                        >
                        <td
                            class="p-1.5 border-b"
                            style:border-color={$themeColors.btnBorder}
                            >{Math.round(gas.meltK)} K ({kToC(gas.meltK)} °C)</td
                        >
                        <td
                            class="p-1.5 border-b"
                            style:border-color={$themeColors.btnBorder}
                            >{formatP(gas.minCondKPa)}</td
                        >
                        <td
                            class="p-1.5 border-b"
                            style:border-color={$themeColors.btnBorder}
                            >{Math.round(gas.maxLiqK)} K ({kToC(gas.maxLiqK)} °C)</td
                        >
                        <td
                            class="p-1.5 border-b"
                            style:border-color={$themeColors.btnBorder}
                            >{formatP(gas.maxKPa)}</td
                        >
                        <td
                            class="p-1.5 border-b"
                            style:border-color={$themeColors.btnBorder}
                            >{gas.specificHeat} J/mol·K</td
                        >
                        <td
                            class="p-1.5 border-b"
                            style:border-color={$themeColors.btnBorder}
                            >{gas.latentHeat} J/mol</td
                        >
                    </tr>
                {/each}
            {/key}
        </tbody>
    </table>
</div>
