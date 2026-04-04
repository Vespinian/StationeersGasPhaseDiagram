export interface GasData {
    name: string;
    symbol: string;
    color: string;
    labelColor: string;
    meltK: number;
    maxLiqK: number;
    minCondKPa: number;
    maxKPa: number;
    specificHeat: number;
    latentHeat: number;
}

export interface GasTuning {
    coefA: number;
    coefB: number;
}

export interface LabelOffset {
    x: number;
    y: number;
}

export interface LabelOverrides {
    melt: LabelOffset;
    max: LabelOffset;
}

export const gasData: Record<string, GasData> = {
    N2: { name: 'Nitrogen', symbol: 'N₂', color: '#444444', labelColor: '#999999', meltK: 40.01, maxLiqK: 190.03, minCondKPa: 6.3, maxKPa: 6000, specificHeat: 20.6, latentHeat: 500 },
    O2: { name: 'Oxygen', symbol: 'O₂', color: '#ffffff', labelColor: '#ffffff', meltK: 56.42, maxLiqK: 162.27, minCondKPa: 6.3, maxKPa: 6000, specificHeat: 21.1, latentHeat: 800 },
    H2: { name: 'Hydrogen', symbol: 'H₂', color: '#fca5a5', labelColor: '#fecaca', meltK: 15.18, maxLiqK: 70.06, minCondKPa: 6.3, maxKPa: 6000, specificHeat: 20.4, latentHeat: 200 },
    X: { name: 'Pollutant', symbol: 'X', color: '#ffcc00', labelColor: '#ffcc00', meltK: 173.32, maxLiqK: 433.88, minCondKPa: 1800, maxKPa: 6000, specificHeat: 24.8, latentHeat: 2000 },
    CO2: { name: 'Carbon Dioxide', symbol: 'CO₂', color: '#bbbbbb', labelColor: '#bbbbbb', meltK: 217.82, maxLiqK: 266.31, minCondKPa: 517, maxKPa: 6000, specificHeat: 28.2, latentHeat: 600 },
    N2O: { name: 'Nitrous Oxide', symbol: 'N₂O', color: '#44cc44', labelColor: '#44cc44', meltK: 251.42, maxLiqK: 430.60, minCondKPa: 800, maxKPa: 2000, specificHeat: 37.2, latentHeat: 4000 },
    H2O: { name: 'Water', symbol: 'H₂O', color: '#4488ff', labelColor: '#4488ff', meltK: 270.17, maxLiqK: 643.71, minCondKPa: 6.3, maxKPa: 6000, specificHeat: 72.0, latentHeat: 8000 },
    CH4: { name: 'Methane', symbol: 'CH₄', color: '#dc2626', labelColor: '#ef4444', meltK: 81.53, maxLiqK: 195.02, minCondKPa: 6.3, maxKPa: 6000, specificHeat: 20.4, latentHeat: 1000 },
    HZ: { name: 'Hydrazine', symbol: 'HZ', color: '#ea580c', labelColor: '#f97316', meltK: 246.24, maxLiqK: 520.81, minCondKPa: 6.3, maxKPa: 6000, specificHeat: 48.4, latentHeat: 4000 },
    ALC: { name: 'Alcohol', symbol: 'ALC', color: '#CD853F', labelColor: '#CD853F', meltK: 231.63, maxLiqK: 423.68, minCondKPa: 6.3, maxKPa: 1000, specificHeat: 33.0, latentHeat: 2000 },
    He: { name: 'Helium', symbol: 'He', color: '#cccccc', labelColor: '#cccccc', meltK: 0.95, maxLiqK: 5.2, minCondKPa: 0.0, maxKPa: 228, specificHeat: 20.8, latentHeat: 0 },
    NaCl: { name: 'Sodium Chloride', symbol: 'NaCl', color: '#aaaaaa', labelColor: '#aaaaaa', meltK: 605.90, maxLiqK: 2799.31, minCondKPa: 6.3, maxKPa: 515, specificHeat: 130.0, latentHeat: 16000 },
    SiOH: { name: 'Silanol', symbol: 'SiOH', color: '#00ffcc', labelColor: '#00ffcc', meltK: 163.69, maxLiqK: 821.67, minCondKPa: 516, maxKPa: 6000, specificHeat: 101.0, latentHeat: 10000 },
    HCl: { name: 'Hydrochloric Acid', symbol: 'HCl', color: '#88ff88', labelColor: '#88ff88', meltK: 247.29, maxLiqK: 431.32, minCondKPa: 6.3, maxKPa: 1000, specificHeat: 37.0, latentHeat: 1000 },
    O3: { name: 'Ozone', symbol: 'O₃', color: '#dd88ff', labelColor: '#dd88ff', meltK: 81.41, maxLiqK: 304.39, minCondKPa: 250, maxKPa: 6000, specificHeat: 38.6, latentHeat: 1000 },
    PWa: { name: 'Polluted Water', symbol: 'PWa', color: '#44aaaa', labelColor: '#44aaaa', meltK: 276.80, maxLiqK: 634.37, minCondKPa: 6.3, maxKPa: 6000, specificHeat: 72.0, latentHeat: 8000 },
};

export const gasTuning: Record<string, GasTuning> = {
    N2: { coefA: 5.5757107833E-07, coefB: 4.40221368946 },
    O2: { coefA: 2.6854996004E-11, coefB: 6.49214937325 },
    H2: { coefA: 3.18041E-05, coefB: 4.4843872973 },
    X: { coefA: 2.079033884, coefB: 1.31202194555 },
    CO2: { coefA: 1.579573E-26, coefB: 12.195837931 },
    N2O: { coefA: 0.065353501531, coefB: 1.70297431874 },
    H2O: { coefA: 3.8782059839E-19, coefB: 7.90030107708 },
    CH4: { coefA: 5.863496734E-15, coefB: 7.8643601035 },
    HZ: { coefA: 8E-22, coefB: 9.15642808045339 },
    ALC: { coefA: 9E-20, coefB: 8.3918844460789863 },
    He: { coefA: 0.0, coefB: 0.0 },
    NaCl: { coefA: 6.211737044295E-08, coefB: 2.8774143233482707 },
    SiOH: { coefA: 0.22176555607618392, coefB: 1.5206578718752168 },
    HCl: { coefA: 1E-21, coefB: 9.1088444607898627 },
    O3: { coefA: 0.0062197638230437179, coefB: 2.4097251251207226 },
    PWa: { coefA: 4E-20, coefB: 8.27025711260823 },
};

export const labelOverrides: Record<string, LabelOverrides> = {
    N2: { melt: { x: 0, y: 0 }, max: { x: -15, y: 0 } },
    O2: { melt: { x: 23, y: 0 }, max: { x: -30, y: 0 } },
    H2: { melt: { x: 40, y: -50 }, max: { x: 0, y: 0 } },
    X: { melt: { x: 0, y: -420 }, max: { x: 0, y: 0 } },
    CO2: { melt: { x: 0, y: -340 }, max: { x: 0, y: 0 } },
    N2O: { melt: { x: 0, y: -370 }, max: { x: 30, y: 135 } },
    H2O: { melt: { x: 0, y: 0 }, max: { x: 0, y: 0 } },
    CH4: { melt: { x: 30, y: 0 }, max: { x: 0, y: 0 } },
    HZ: { melt: { x: 0, y: 0 }, max: { x: 0, y: 0 } },
    ALC: { melt: { x: 0, y: -200 }, max: { x: 0, y: 0 } },
    He: { melt: { x: 40, y: -20 }, max: { x: 40, y: 0 } },
    NaCl: { melt: { x: 0, y: 0 }, max: { x: 0, y: 0 } },
    SiOH: { melt: { x: 0, y: 0 }, max: { x: 0, y: 0 } },
    HCl: { melt: { x: 0, y: -250 }, max: { x: 0, y: 0 } },
    O3: { melt: { x: 0, y: -150 }, max: { x: 0, y: 0 } },
    PWa: { melt: { x: 0, y: 0 }, max: { x: 0, y: 0 } },
};

export const labelColorOverrides: Record<string, { melt?: string; max?: string }> = {};

export function calcPressure(tempK: number, gas: GasData, tuning: GasTuning): number | null {
    const { meltK, maxLiqK } = gas;
    const { coefA, coefB } = tuning;
    if (tempK < meltK || tempK > maxLiqK) return null;
    if (coefA === 0 || coefB === 0) return null;
    return coefA * Math.pow(tempK, coefB);
}

export function kToC(k: number): number {
    return Math.round(k - 273);
}

export function formatP(p: number): string {
    return p >= 1000 ? `${(p / 1000).toFixed(1)} MPa` : `${Math.round(p)} kPa`;
}

export interface ChartPoint {
    tempK: number;
    [key: string]: number | null;
}

export function generateAllData(): ChartPoint[] {
    const combined: ChartPoint[] = [];
    for (let t = 1; t <= 3000; t += 1) {
        const point: ChartPoint = { tempK: t };
        for (const [key, gas] of Object.entries(gasData)) {
            point[key] = calcPressure(t, gas, gasTuning[key]);
        }
        combined.push(point);
    }
    return combined;
}
