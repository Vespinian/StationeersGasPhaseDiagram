<script lang="ts">
    import { kToC, formatP, type GasData } from "$lib/gasData";
    import * as phaseCalculations from "$lib/phaseCalculations";
    import type { SortKey, Theme } from "$lib/stores/graphState";
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
        theme: Theme;
        sortedGases: [string, GasData][];
        onSort: (key: SortKey) => void;
        onToggleGas: (key: string) => void;
    }

    let {
        visibleGases,
        sortKey,
        sortAsc,
        theme,
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

<table class="legend">
    <thead>
        <tr>
            <th>Gas</th>
            <th class="sortable" onclick={() => handleSort("name")}
                >Name {#if sortKey === "name"}{sortAsc ? "▲" : "▼"}{/if}</th
            >
            <th class="sortable" onclick={() => handleSort("meltK")}
                >Melt Point {#if sortKey === "meltK"}{sortAsc
                        ? "▲"
                        : "▼"}{/if}</th
            >
            <th class="sortable" onclick={() => handleSort("minCondKPa")}
                >Min Pressure {#if sortKey === "minCondKPa"}{sortAsc
                        ? "▲"
                        : "▼"}{/if}</th
            >
            <th class="sortable" onclick={() => handleSort("maxLiqK")}
                >Max Liquid {#if sortKey === "maxLiqK"}{sortAsc
                        ? "▲"
                        : "▼"}{/if}</th
            >
            <th class="sortable" onclick={() => handleSort("maxKPa")}
                >Max Pressure {#if sortKey === "maxKPa"}{sortAsc
                        ? "▲"
                        : "▼"}{/if}</th
            >
            <th class="sortable" onclick={() => handleSort("specificHeat")}
                >Specific Heat {#if sortKey === "specificHeat"}{sortAsc
                        ? "▲"
                        : "▼"}{/if}</th
            >
            <th class="sortable" onclick={() => handleSort("latentHeat")}
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
                    class:disabled={!visibleGases[key]}
                    onclick={() => handleToggleGas(key)}
                >
                    <td class="gas-cell">
                        <span
                            class="color-swatch"
                            style="background: {phaseCalculations.getGasColor(
                                gas,
                                theme,
                            )}"
                        ></span>
                        <img
                            class="gas-icon"
                            src={gasIcons[key]}
                            alt={gas.name}
                        />
                        <span class="symbol">{gas.symbol}</span>
                    </td>
                    <td>{gas.name}</td>
                    <td>{gas.meltK} K ({kToC(gas.meltK)} °C)</td>
                    <td>{formatP(gas.minCondKPa)}</td>
                    <td>{gas.maxLiqK} K ({kToC(gas.maxLiqK)} °C)</td>
                    <td>{formatP(gas.maxKPa)}</td>
                    <td>{gas.specificHeat} J/mol·K</td>
                    <td>{gas.latentHeat} J/mol</td>
                </tr>
            {/each}
        {/key}
    </tbody>
</table>
